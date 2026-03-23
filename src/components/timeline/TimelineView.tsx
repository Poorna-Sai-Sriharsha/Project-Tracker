import React, { useMemo, useRef } from 'react';
import { Task, Priority, CollabUser } from '../../types';
import { CollabAvatars } from '../collaboration/PresenceBar';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { EmptyState } from '../ui/EmptyState';
import { getDaysInMonth, formatDueDate } from '../../utils/dateUtils';

const PRIORITY_COLORS: Record<Priority, string> = {
  Critical: '#ef4444',
  High: '#f97316',
  Medium: '#eab308',
  Low: '#22c55e',
};

const PRIORITY_BG: Record<Priority, string> = {
  Critical: 'bg-red-500/15 border-red-500/30',
  High: 'bg-orange-500/15 border-orange-500/30',
  Medium: 'bg-yellow-500/15 border-yellow-500/30',
  Low: 'bg-green-500/15 border-green-500/30',
};

const DAY_WIDTH = 36;

interface TimelineViewProps {
  tasks: Task[];
  collabUsers: CollabUser[];
  onClearFilters?: () => void;
}

/** Desktop Gantt chart view */
const DesktopTimeline: React.FC<{
  tasks: Task[];
  collabUsers: CollabUser[];
  days: { num: number; dayName: string; isWeekend: boolean }[];
  todayDate: number;
  year: number;
  month: number;
  daysInMonth: number;
  totalWidth: number;
  monthLabel: string;
  scrollRef: React.RefObject<HTMLDivElement | null>;
}> = ({ tasks, collabUsers, days, todayDate, year, month, daysInMonth, totalWidth, monthLabel, scrollRef }) => {
  const taskBars = useMemo(() => {
    const monthStart = new Date(year, month, 1);
    const monthEnd = new Date(year, month, daysInMonth);

    return tasks.map((task) => {
      const dueDate = new Date(task.dueDate + 'T00:00:00');
      const startDate = task.startDate ? new Date(task.startDate + 'T00:00:00') : null;
      const effectiveStart = startDate || dueDate;
      const effectiveEnd = dueDate;
      const clampedStart = new Date(Math.max(effectiveStart.getTime(), monthStart.getTime()));
      const clampedEnd = new Date(Math.min(effectiveEnd.getTime(), monthEnd.getTime()));

      if (clampedStart > monthEnd || clampedEnd < monthStart) return null;

      const startDay = clampedStart.getDate();
      const endDay = clampedEnd.getDate();
      const left = (startDay - 1) * DAY_WIDTH;
      const width = Math.max((endDay - startDay + 1) * DAY_WIDTH - 4, DAY_WIDTH - 4);
      const isSingleDay = !startDate || effectiveStart.getTime() === effectiveEnd.getTime();

      return { task, left, width, isSingleDay, color: PRIORITY_COLORS[task.priority] };
    }).filter(Boolean) as { task: Task; left: number; width: number; isSingleDay: boolean; color: string }[];
  }, [tasks, year, month, daysInMonth]);

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-2 text-sm font-semibold text-text-primary border-b border-border-primary bg-bg-secondary/50">
        {monthLabel}
      </div>
      <div ref={scrollRef} className="flex-1 overflow-x-auto overflow-y-auto">
        <div style={{ minWidth: totalWidth + 200 }}>
          {/* Day headers */}
          <div className="flex border-b border-border-primary sticky top-0 z-10 bg-bg-primary">
            <div className="w-[200px] shrink-0 px-3 py-2 text-xs font-semibold text-text-secondary uppercase border-r border-border-primary bg-bg-secondary/50">
              Task
            </div>
            <div className="flex relative">
              {days.map((day) => (
                <div
                  key={day.num}
                  className={`flex flex-col items-center justify-center border-r border-border-primary/30 text-center ${
                    day.isWeekend ? 'bg-bg-secondary/30' : ''
                  } ${day.num === todayDate ? 'bg-accent-blue/10' : ''}`}
                  style={{ width: DAY_WIDTH }}
                >
                  <span className="text-[10px] text-text-muted">{day.dayName}</span>
                  <span className={`text-xs font-medium ${day.num === todayDate ? 'text-accent-blue' : 'text-text-secondary'}`}>
                    {day.num}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Task rows */}
          {taskBars.map(({ task, left, width, isSingleDay, color }) => (
            <div key={task.id} className="flex border-b border-border-primary/20 hover:bg-bg-card-hover/30 transition-colors">
              <div className="w-[200px] shrink-0 px-3 py-2 flex items-center gap-1.5 border-r border-border-primary/30">
                <span className="text-xs text-text-primary truncate">{task.title}</span>
                <CollabAvatars taskId={task.id} collabUsers={collabUsers} />
              </div>
              <div className="relative" style={{ width: totalWidth, height: 36 }}>
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-accent-blue/60 z-10"
                  style={{ left: (todayDate - 1) * DAY_WIDTH + DAY_WIDTH / 2 }}
                />
                <div
                  className={`absolute top-1.5 rounded-md flex items-center px-2 text-[10px] text-white font-medium truncate transition-all duration-200 ${
                    isSingleDay ? 'justify-center' : ''
                  }`}
                  style={{ left: left + 2, width, height: 22, backgroundColor: color, opacity: 0.85 }}
                  title={`${task.title} (${task.priority})`}
                >
                  {!isSingleDay && <span className="truncate">{task.title}</span>}
                  {isSingleDay && <span>◆</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const MobileTimeline: React.FC<{
  tasks: Task[];
  collabUsers: CollabUser[];
  monthLabel: string;
  todayDate: number;
  year: number;
  month: number;
}> = ({ tasks, collabUsers, monthLabel, todayDate, year, month }) => {
  // Group tasks by due date and sort chronologically
  const groupedTasks = useMemo(() => {
    const monthStart = new Date(year, month, 1);
    const monthEnd = new Date(year, month + 1, 0);

    const inMonth = tasks.filter((t) => {
      const d = new Date(t.dueDate + 'T00:00:00');
      return d >= monthStart && d <= monthEnd;
    });

    inMonth.sort((a, b) => a.dueDate.localeCompare(b.dueDate));

    const groups: { dateStr: string; dateLabel: string; dayNum: number; isToday: boolean; tasks: Task[] }[] = [];
    let currentKey = '';

    for (const task of inMonth) {
      if (task.dueDate !== currentKey) {
        currentKey = task.dueDate;
        const d = new Date(task.dueDate + 'T00:00:00');
        const dayNum = d.getDate();
        groups.push({
          dateStr: task.dueDate,
          dateLabel: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
          dayNum,
          isToday: dayNum === todayDate && d.getMonth() === month && d.getFullYear() === year,
          tasks: [],
        });
      }
      groups[groups.length - 1].tasks.push(task);
    }

    return groups;
  }, [tasks, year, month, todayDate]);

  const [visibleCount, setVisibleCount] = React.useState(2);
  const observerTarget = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setVisibleCount(2);
  }, [groupedTasks.length]);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + 5, groupedTasks.length));
        }
      },
      { rootMargin: '300px' }
    );
    if (observerTarget.current) observer.observe(observerTarget.current);
    return () => observer.disconnect();
  }, [groupedTasks.length]);

  const visibleGroups = groupedTasks.slice(0, visibleCount);

  return (
    <div className="flex flex-col h-full">
      {/* Month header */}
      <div className="px-3 py-2 text-sm font-semibold text-text-primary border-b border-border-primary bg-bg-secondary/50 flex items-center justify-between">
        <span>{monthLabel}</span>
        <span className="text-xs text-text-muted font-normal">{tasks.length} tasks</span>
      </div>

      {/* Scrollable timeline */}
      <div className="flex-1 overflow-y-auto px-3 py-3">
        {groupedTasks.length === 0 ? (
          <div className="text-center py-8 text-text-muted text-sm">No tasks this month</div>
        ) : (
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-border-primary/50" />

            {visibleGroups.map((group) => (
              <div key={group.dateStr} className="mb-4 last:mb-0">
                {/* Date marker */}
                <div className="flex items-center gap-3 mb-2 relative">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 z-10 ${
                      group.isToday
                        ? 'bg-accent-blue text-white shadow-lg shadow-accent-blue/30'
                        : 'bg-bg-tertiary text-text-primary border border-border-primary'
                    }`}
                  >
                    {group.dayNum}
                  </div>
                  <div className="flex flex-col">
                    <span className={`text-xs font-semibold ${group.isToday ? 'text-accent-blue' : 'text-text-primary'}`}>
                      {group.dateLabel}
                    </span>
                    {group.isToday && (
                      <span className="text-[10px] text-accent-blue font-medium">Today</span>
                    )}
                    <span className="text-[10px] text-text-muted">{group.tasks.length} task{group.tasks.length > 1 ? 's' : ''}</span>
                  </div>
                </div>

                {/* Task cards for this date */}
                <div className="ml-[19px] pl-6 border-l-2 border-transparent space-y-2">
                  {group.tasks.map((task) => {
                    const { text: dueDateText, isOverdue } = formatDueDate(task.dueDate);
                    return (
                      <div
                        key={task.id}
                        className={`rounded-xl p-3 border transition-colors ${PRIORITY_BG[task.priority]}`}
                      >
                        {/* Top: title + priority */}
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h4 className="text-sm font-medium text-text-primary leading-snug flex-1">{task.title}</h4>
                          <Badge priority={task.priority} />
                        </div>

                        {/* Bottom: assignee + status + duration bar */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5">
                            <Avatar name={task.assignee.name} color={task.assignee.color} size="sm" />
                            <span className="text-xs text-text-muted">{task.assignee.name.split(' ')[0]}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {task.startDate && (
                              <span className="text-[10px] text-text-muted">
                                {new Date(task.startDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                {' → '}
                                {new Date(task.dueDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </span>
                            )}
                            {isOverdue && (
                              <span className="text-[10px] text-red-400 font-medium">{dueDateText}</span>
                            )}
                            <CollabAvatars taskId={task.id} collabUsers={collabUsers} />
                          </div>
                        </div>

                        {/* Duration progress bar */}
                        {task.startDate && (
                          <div className="mt-2 h-1.5 rounded-full bg-white/10 overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                backgroundColor: PRIORITY_COLORS[task.priority],
                                width: `${Math.min(
                                  100,
                                  Math.max(
                                    5,
                                    ((Date.now() - new Date(task.startDate + 'T00:00:00').getTime()) /
                                      (new Date(task.dueDate + 'T00:00:00').getTime() - new Date(task.startDate + 'T00:00:00').getTime())) *
                                      100
                                  )
                                )}%`,
                                opacity: 0.8,
                              }}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
            
            {visibleCount < groupedTasks.length && (
              <div ref={observerTarget} className="h-4 w-full flex items-center justify-center my-4">
                <span className="w-4 h-4 rounded-full border-2 border-accent-blue/30 border-t-accent-blue animate-spin" />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export const TimelineView: React.FC<TimelineViewProps> = ({ tasks, collabUsers, onClearFilters }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const todayDate = now.getDate();
  const monthLabel = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const days = useMemo(() => {
    return Array.from({ length: daysInMonth }, (_, i) => {
      const d = new Date(year, month, i + 1);
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      const isWeekend = d.getDay() === 0 || d.getDay() === 6;
      return { num: i + 1, dayName, isWeekend };
    });
  }, [year, month, daysInMonth]);

  const totalWidth = daysInMonth * DAY_WIDTH;

  if (tasks.length === 0) {
    return (
      <EmptyState
        title="No matching tasks"
        description="Try adjusting your filters to see tasks."
        showClearFilters
        onClearFilters={onClearFilters}
      />
    );
  }

  return (
    <>
      {/* Desktop: Gantt chart */}
      <div className="hidden md:flex flex-col h-full">
        <DesktopTimeline
          tasks={tasks}
          collabUsers={collabUsers}
          days={days}
          todayDate={todayDate}
          year={year}
          month={month}
          daysInMonth={daysInMonth}
          totalWidth={totalWidth}
          monthLabel={monthLabel}
          scrollRef={scrollRef}
        />
      </div>

      {/* Mobile: Vertical timeline */}
      <div className="md:hidden flex flex-col h-full">
        <MobileTimeline
          tasks={tasks}
          collabUsers={collabUsers}
          monthLabel={monthLabel}
          todayDate={todayDate}
          year={year}
          month={month}
        />
      </div>
    </>
  );
};
