import React from 'react';
import { Task, Status, CollabUser } from '../../types';
import { KanbanCard } from './KanbanCard';
import { EmptyState } from '../ui/EmptyState';

const STATUS_COLORS: Record<Status, string> = {
  'To Do': 'bg-status-todo',
  'In Progress': 'bg-status-progress',
  'In Review': 'bg-status-review',
  Done: 'bg-status-done',
};

interface KanbanColumnProps {
  status: Status;
  tasks: Task[];
  collabUsers: CollabUser[];
  isDropTarget: boolean;
  isDragging: boolean;
  onPointerDown: (e: React.PointerEvent, task: Task, cardEl: HTMLElement) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  status,
  tasks,
  collabUsers,
  isDropTarget,
  isDragging,
  onPointerDown,
}) => {
  const [visibleCount, setVisibleCount] = React.useState(4);
  const observerTarget = React.useRef<HTMLDivElement>(null);

  // Reset visible count when filters change the task list substantially
  React.useEffect(() => {
    setVisibleCount(4);
  }, [tasks.length]);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + 15, tasks.length));
        }
      },
      { rootMargin: '200px' }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [tasks.length]);

  const visibleTasks = tasks.slice(0, visibleCount);

  return (
    <div
      data-column={status}
      className={`flex flex-col w-full md:min-w-[280px] md:w-[280px] lg:w-[300px] rounded-xl transition-colors duration-200 ${
        isDropTarget
          ? 'bg-bg-drop-zone ring-2 ring-accent-blue/30'
          : 'bg-bg-secondary/30'
      }`}
    >
      {/* Column header */}
      <div className="flex items-center gap-2 px-3 py-3 border-b border-border-primary/50" data-column={status}>
        <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${STATUS_COLORS[status]}`} />
        <h3 className="text-sm font-semibold text-text-primary">{status}</h3>
        <span className="text-xs text-text-muted bg-bg-tertiary/50 px-2 py-0.5 rounded-full">
          {tasks.length}
        </span>
      </div>

      {/* Cards container */}
      <div
        data-column={status}
        className={`flex-1 overflow-y-auto p-2 space-y-2 min-h-[80px] md:min-h-[100px] max-h-[400px] md:max-h-none ${isDragging ? 'pointer-events-auto' : ''}`}
      >
        {tasks.length === 0 ? (
          <div data-column={status}>
            <EmptyState
              title="No tasks"
              description={`No tasks in ${status}`}
            />
          </div>
        ) : (
          <>
            {visibleTasks.map((task) => (
              <KanbanCard
                key={task.id}
                task={task}
                collabUsers={collabUsers}
                onPointerDown={onPointerDown}
              />
            ))}
            {visibleCount < tasks.length && (
              <div ref={observerTarget} className="h-4 w-full flex items-center justify-center">
                <span className="w-4 h-4 rounded-full border-2 border-accent-blue/30 border-t-accent-blue animate-spin" />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
