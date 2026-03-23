import React, { useRef } from 'react';
import { Task, CollabUser } from '../../types';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { CollabAvatars } from '../collaboration/PresenceBar';
import { formatDueDate } from '../../utils/dateUtils';

interface KanbanCardProps {
  task: Task;
  collabUsers: CollabUser[];
  onPointerDown: (e: React.PointerEvent, task: Task, cardEl: HTMLElement) => void;
}

export const KanbanCard: React.FC<KanbanCardProps> = ({ task, collabUsers, onPointerDown }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const { text: dueDateText, isOverdue, isTodayDue } = formatDueDate(task.dueDate);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (cardRef.current) {
      onPointerDown(e, task, cardRef.current);
    }
  };

  return (
    <div
      ref={cardRef}
      data-task-id={task.id}
      data-column={task.status}
      className="bg-bg-card hover:bg-bg-card-hover border border-border-primary/50 rounded-xl p-3 cursor-grab select-none transition-colors duration-150"
      onPointerDown={handlePointerDown}
      style={{ touchAction: 'none' }}
    >
      {/* Top row: priority + collab */}
      <div className="flex items-center justify-between mb-2">
        <Badge priority={task.priority} />
        <CollabAvatars taskId={task.id} collabUsers={collabUsers} />
      </div>

      {/* Title */}
      <h4 className="text-sm font-medium text-text-primary mb-2.5 leading-snug line-clamp-2">
        {task.title}
      </h4>

      {/* Bottom row: avatar + due date */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Avatar name={task.assignee.name} color={task.assignee.color} size="sm" />
          <span className="text-xs text-text-muted truncate max-w-[80px]">{task.assignee.name.split(' ')[0]}</span>
        </div>
        <span
          className={`text-xs font-medium ${
            isOverdue ? 'text-red-400' : isTodayDue ? 'text-yellow-400' : 'text-text-muted'
          }`}
        >
          {dueDateText}
        </span>
      </div>
    </div>
  );
};
