import React from 'react';
import { Priority } from '../../types';

interface BadgeProps {
  priority: Priority;
  className?: string;
}

const PRIORITY_STYLES: Record<Priority, string> = {
  Critical: 'bg-red-500/20 text-red-400 border-red-500/30',
  High: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  Medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  Low: 'bg-green-500/20 text-green-400 border-green-500/30',
};

export const Badge: React.FC<BadgeProps> = ({ priority, className = '' }) => {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border ${PRIORITY_STYLES[priority]} ${className}`}
    >
      {priority}
    </span>
  );
};
