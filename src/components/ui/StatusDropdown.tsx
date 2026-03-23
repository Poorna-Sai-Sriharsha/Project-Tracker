import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Status } from '../../types';

interface StatusDropdownProps {
  currentStatus: Status;
  onChange: (status: Status) => void;
}

const STATUSES: Status[] = ['To Do', 'In Progress', 'In Review', 'Done'];

const STATUS_COLORS: Record<Status, string> = {
  'To Do': 'bg-status-todo',
  'In Progress': 'bg-status-progress',
  'In Review': 'bg-status-review',
  Done: 'bg-status-done',
};

export const StatusDropdown: React.FC<StatusDropdownProps> = ({ currentStatus, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<{ top: number; left: number; openUp: boolean }>({ top: 0, left: 0, openUp: false });
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback(() => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const openUp = spaceBelow < 180;

    setPosition({
      top: openUp ? rect.top : rect.bottom + 4,
      left: Math.min(rect.left, window.innerWidth - 160),
      openUp,
    });
  }, []);

  const handleToggle = () => {
    if (!isOpen) {
      updatePosition();
    }
    setIsOpen(!isOpen);
  };

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;

    const handler = (e: MouseEvent) => {
      if (
        btnRef.current && !btnRef.current.contains(e.target as Node) &&
        menuRef.current && !menuRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen]);

  // Close on scroll
  useEffect(() => {
    if (!isOpen) return;
    const handler = () => setIsOpen(false);
    window.addEventListener('scroll', handler, true);
    return () => window.removeEventListener('scroll', handler, true);
  }, [isOpen]);

  const dropdownMenu = isOpen
    ? createPortal(
        <div
          ref={menuRef}
          className="fixed w-40 rounded-lg border border-border-primary bg-bg-secondary shadow-2xl animate-fade-in"
          style={{
            top: position.openUp ? 'auto' : position.top,
            bottom: position.openUp ? window.innerHeight - position.top + 4 : 'auto',
            left: position.left,
            zIndex: 99999,
          }}
        >
          <div className="py-1">
            {STATUSES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  onChange(s);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs hover:bg-bg-tertiary transition-colors text-left cursor-pointer ${
                  s === currentStatus ? 'text-accent-blue font-semibold' : 'text-text-primary'
                }`}
              >
                <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${STATUS_COLORS[s]}`} />
                {s}
              </button>
            ))}
          </div>
        </div>,
        document.body
      )
    : null;

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={handleToggle}
        className="flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium hover:bg-bg-tertiary transition-colors cursor-pointer whitespace-nowrap"
      >
        <span className={`w-2 h-2 rounded-full shrink-0 ${STATUS_COLORS[currentStatus]}`} />
        <span className="truncate max-w-[80px]">{currentStatus}</span>
        <svg className="w-3 h-3 text-text-muted shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {dropdownMenu}
    </>
  );
};
