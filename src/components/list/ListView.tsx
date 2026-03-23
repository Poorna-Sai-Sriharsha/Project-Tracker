import React, { useMemo, useCallback } from 'react';
import { Task, SortState, CollabUser } from '../../types';
import { useVirtualScroll } from '../../hooks/useVirtualScroll';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { StatusDropdown } from '../ui/StatusDropdown';
import { CollabAvatars } from '../collaboration/PresenceBar';
import { EmptyState } from '../ui/EmptyState';
import { formatDueDate } from '../../utils/dateUtils';
import { useStore } from '../../store/useStore';

const ROW_HEIGHT = 56;

interface ListViewProps {
  tasks: Task[];
  sort: SortState;
  collabUsers: CollabUser[];
  onSort: (field: SortState['field']) => void;
  onClearFilters?: () => void;
}

const SortIcon: React.FC<{ active: boolean; direction: 'asc' | 'desc' }> = ({ active, direction }) => (
  <span className={`inline-flex ml-1 text-[10px] ${active ? 'text-accent-blue' : 'text-text-muted opacity-0 group-hover:opacity-100'}`}>
    {direction === 'asc' ? '▲' : '▼'}
  </span>
);

export const ListView: React.FC<ListViewProps> = ({ tasks, sort, collabUsers, onSort, onClearFilters }) => {
  const updateTaskStatus = useStore((s) => s.updateTaskStatus);

  const containerHeight = useMemo(() => {
    return Math.min(typeof window !== 'undefined' ? window.innerHeight - 200 : 600, 700);
  }, []);

  const { visibleItems, totalHeight, onScroll, containerRef } = useVirtualScroll({
    totalItems: tasks.length,
    itemHeight: ROW_HEIGHT,
    containerHeight,
    overscan: 5,
  });

  const renderSortHeader = useCallback(
    (label: string, field: SortState['field']) => (
      <button
        onClick={() => onSort(field)}
        className="group flex items-center text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors cursor-pointer uppercase tracking-wider"
      >
        {label}
        <SortIcon active={sort.field === field} direction={sort.field === field ? sort.direction : 'asc'} />
      </button>
    ),
    [sort, onSort]
  );

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
    <div className="flex flex-col h-full">
      {/* Desktop Header */}
      <div className="hidden md:grid grid-cols-[1fr_110px_90px_110px_110px_50px] gap-2 px-4 py-3 border-b border-border-primary bg-bg-secondary/50 sticky top-0 z-10">
        {renderSortHeader('Title', 'title')}
        <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Assignee</span>
        {renderSortHeader('Priority', 'priority')}
        {renderSortHeader('Due Date', 'dueDate')}
        <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Status</span>
        <span></span>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden flex items-center gap-2 px-3 py-2 border-b border-border-primary bg-bg-secondary/50 sticky top-0 z-10">
        {renderSortHeader('Title', 'title')}
        {renderSortHeader('Priority', 'priority')}
        {renderSortHeader('Due', 'dueDate')}
      </div>

      {/* Virtual scroll container */}
      <div
        ref={containerRef}
        onScroll={onScroll}
        className="flex-1 overflow-y-auto"
        style={{ height: containerHeight }}
      >
        <div style={{ height: totalHeight, position: 'relative' }}>
          {visibleItems.map(({ index, offsetTop }) => {
            const task = tasks[index];
            if (!task) return null;
            const { text: dueDateText, isOverdue, isTodayDue } = formatDueDate(task.dueDate);

            return (
              <div key={task.id} style={{ position: 'absolute', top: 0, left: 0, right: 0, height: ROW_HEIGHT, transform: `translateY(${offsetTop}px)` }}>
                {/* Desktop Row */}
                <div className="hidden md:grid grid-cols-[1fr_110px_90px_110px_110px_50px] gap-2 items-center px-4 h-full border-b border-border-primary/30 hover:bg-bg-card-hover transition-colors">
                  <span className="text-sm text-text-primary truncate pr-2">{task.title}</span>
                  <div className="flex items-center gap-1.5 overflow-hidden">
                    <Avatar name={task.assignee.name} color={task.assignee.color} size="sm" />
                    <span className="text-xs text-text-secondary truncate">{task.assignee.name.split(' ')[0]}</span>
                  </div>
                  <Badge priority={task.priority} />
                  <span className={`text-xs font-medium ${isOverdue ? 'text-red-400' : isTodayDue ? 'text-yellow-400' : 'text-text-muted'}`}>
                    {dueDateText}
                  </span>
                  <StatusDropdown
                    currentStatus={task.status}
                    onChange={(s) => updateTaskStatus(task.id, s)}
                  />
                  <CollabAvatars taskId={task.id} collabUsers={collabUsers} />
                </div>

                {/* Mobile Row */}
                <div className="md:hidden flex flex-col justify-center gap-1 px-3 h-full border-b border-border-primary/30 hover:bg-bg-card-hover transition-colors">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm text-text-primary truncate flex-1">{task.title}</span>
                    <Badge priority={task.priority} />
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <Avatar name={task.assignee.name} color={task.assignee.color} size="sm" />
                      <span className="text-xs text-text-muted truncate">{task.assignee.name.split(' ')[0]}</span>
                    </div>
                    <span className={`text-xs font-medium ${isOverdue ? 'text-red-400' : isTodayDue ? 'text-yellow-400' : 'text-text-muted'}`}>
                      {dueDateText}
                    </span>
                    <StatusDropdown
                      currentStatus={task.status}
                      onChange={(s) => updateTaskStatus(task.id, s)}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-2 text-xs text-text-muted border-t border-border-primary bg-bg-secondary/50">
        {tasks.length} tasks total
      </div>
    </div>
  );
};
