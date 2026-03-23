import React, { useCallback, useRef, useState, useEffect } from 'react';
import { Task, Status, CollabUser } from '../../types';
import { KanbanColumn } from './KanbanColumn';
import { EmptyState } from '../ui/EmptyState';

const COLUMNS: Status[] = ['To Do', 'In Progress', 'In Review', 'Done'];

interface KanbanBoardProps {
  tasks: Task[];
  collabUsers: CollabUser[];
  onMoveTask: (taskId: string, newStatus: Status) => void;
}

interface DragInfo {
  taskId: string;
  originalStatus: Status;
  cloneEl: HTMLDivElement;
  placeholderEl: HTMLDivElement;
  cardEl: HTMLElement;
  cardRect: DOMRect;
  offsetX: number;
  offsetY: number;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ tasks, collabUsers, onMoveTask }) => {
  const [activeDropZone, setActiveDropZone] = useState<Status | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const boardRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<DragInfo | null>(null);

  const getTasksByStatus = useCallback(
    (status: Status) => tasks.filter((t) => t.status === status),
    [tasks]
  );

  // Document-level pointer move & up
  useEffect(() => {
    const handleMove = (e: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag) return;

      e.preventDefault();

      const x = e.clientX - drag.offsetX;
      const y = e.clientY - drag.offsetY;
      drag.cloneEl.style.left = `${x}px`;
      drag.cloneEl.style.top = `${y}px`;

      // Hide clone to detect elements below
      drag.cloneEl.style.display = 'none';
      const elementsBelow = document.elementsFromPoint(e.clientX, e.clientY);
      drag.cloneEl.style.display = '';

      let foundColumn: Status | null = null;
      for (const el of elementsBelow) {
        const col = (el as HTMLElement).dataset?.column as Status | undefined;
        if (col && COLUMNS.includes(col)) {
          foundColumn = col;
          break;
        }
      }
      setActiveDropZone(foundColumn);
    };

    const handleUp = (e: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag) return;

      e.preventDefault();

      const { taskId, originalStatus, cloneEl, placeholderEl, cardEl, cardRect } = drag;

      cardEl.style.display = '';
      placeholderEl.remove();

      cloneEl.style.display = 'none';
      const elementsBelow = document.elementsFromPoint(e.clientX, e.clientY);
      cloneEl.style.display = '';

      let dropColumn: Status | null = null;
      for (const el of elementsBelow) {
        const col = (el as HTMLElement).dataset?.column as Status | undefined;
        if (col && COLUMNS.includes(col)) {
          dropColumn = col;
          break;
        }
      }

      if (dropColumn && dropColumn !== originalStatus) {
        onMoveTask(taskId, dropColumn);
        cloneEl.remove();
      } else if (dropColumn === originalStatus) {
        cloneEl.remove();
      } else {
        cloneEl.style.transition = 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        cloneEl.style.left = `${cardRect.left}px`;
        cloneEl.style.top = `${cardRect.top}px`;
        cloneEl.style.opacity = '1';
        cloneEl.style.transform = 'rotate(0deg) scale(1)';
        cloneEl.style.boxShadow = 'none';
        setTimeout(() => cloneEl.remove(), 300);
      }

      dragRef.current = null;
      setIsDragging(false);
      setActiveDropZone(null);
    };

    document.addEventListener('pointermove', handleMove, { passive: false });
    document.addEventListener('pointerup', handleUp);

    return () => {
      document.removeEventListener('pointermove', handleMove);
      document.removeEventListener('pointerup', handleUp);
    };
  }, [onMoveTask]);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent, task: Task, cardEl: HTMLElement) => {
      if (e.button !== 0) return;
      e.preventDefault();
      e.stopPropagation();

      const rect = cardEl.getBoundingClientRect();

      const clone = cardEl.cloneNode(true) as HTMLDivElement;
      clone.style.position = 'fixed';
      clone.style.width = `${rect.width}px`;
      clone.style.height = `${rect.height}px`;
      clone.style.left = `${rect.left}px`;
      clone.style.top = `${rect.top}px`;
      clone.style.opacity = '0.85';
      clone.style.zIndex = '9999';
      clone.style.pointerEvents = 'none';
      clone.style.transition = 'none';
      clone.style.boxShadow = '0 20px 40px rgba(0,0,0,0.4)';
      clone.style.transform = 'rotate(2deg) scale(1.02)';
      clone.style.cursor = 'grabbing';
      document.body.appendChild(clone);

      const placeholder = document.createElement('div');
      placeholder.style.height = `${rect.height}px`;
      placeholder.style.borderRadius = '0.75rem';
      placeholder.style.border = '2px dashed #475569';
      placeholder.style.backgroundColor = 'rgba(59, 130, 246, 0.05)';
      placeholder.style.marginBottom = '0.5rem';
      placeholder.style.transition = 'all 0.2s ease';
      placeholder.style.flexShrink = '0';

      cardEl.parentElement?.insertBefore(placeholder, cardEl);
      cardEl.style.display = 'none';

      dragRef.current = {
        taskId: task.id,
        originalStatus: task.status,
        cloneEl: clone,
        placeholderEl: placeholder,
        cardEl,
        cardRect: rect,
        offsetX: e.clientX - rect.left,
        offsetY: e.clientY - rect.top,
      };

      setIsDragging(true);
    },
    []
  );

  if (tasks.length === 0) {
    return <EmptyState title="No tasks found" description="Try adjusting your filters to see tasks." showClearFilters />;
  }

  return (
    <div
      ref={boardRef}
      className="flex flex-col md:flex-row gap-3 md:gap-4 p-3 md:p-4 h-full overflow-y-auto md:overflow-x-auto md:overflow-y-hidden md:justify-center"
      style={{ touchAction: 'none' }}
    >
      {COLUMNS.map((status) => (
        <KanbanColumn
          key={status}
          status={status}
          tasks={getTasksByStatus(status)}
          collabUsers={collabUsers}
          isDropTarget={activeDropZone === status}
          isDragging={isDragging}
          onPointerDown={handlePointerDown}
        />
      ))}
    </div>
  );
};
