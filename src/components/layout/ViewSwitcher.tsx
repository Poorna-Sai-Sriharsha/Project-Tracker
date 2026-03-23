import React from 'react';
import { ViewType } from '../../types';

interface ViewSwitcherProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

const VIEWS: { id: ViewType; label: string; icon: React.ReactNode }[] = [
  {
    id: 'kanban',
    label: 'Board',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2m0 10V7m6 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
      </svg>
    ),
  },
  {
    id: 'list',
    label: 'List',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
      </svg>
    ),
  },
  {
    id: 'timeline',
    label: 'Timeline',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
];

export const ViewSwitcher: React.FC<ViewSwitcherProps> = ({ currentView, onViewChange }) => {
  return (
    <div className="flex bg-bg-tertiary/30 rounded-lg p-0.5">
      {VIEWS.map((v) => (
        <button
          key={v.id}
          onClick={() => onViewChange(v.id)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-150 cursor-pointer ${
            currentView === v.id
              ? 'bg-accent-blue text-white shadow-md'
              : 'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary/50'
          }`}
        >
          {v.icon}
          <span className="hidden sm:inline">{v.label}</span>
        </button>
      ))}
    </div>
  );
};
