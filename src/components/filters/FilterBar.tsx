import React from 'react';
import { useStore } from '../../store/useStore';
import { Dropdown } from '../ui/Dropdown';
import { Button } from '../ui/Button';
import { USERS } from '../../data/seedData';
import { Status, Priority } from '../../types';

const STATUS_OPTIONS = [
  { value: 'To Do', label: 'To Do' },
  { value: 'In Progress', label: 'In Progress' },
  { value: 'In Review', label: 'In Review' },
  { value: 'Done', label: 'Done' },
];

const PRIORITY_OPTIONS = [
  { value: 'Critical', label: 'Critical' },
  { value: 'High', label: 'High' },
  { value: 'Medium', label: 'Medium' },
  { value: 'Low', label: 'Low' },
];

const ASSIGNEE_OPTIONS = USERS.map((u) => ({ value: u.id, label: u.name }));

export const FilterBar: React.FC = () => {
  const filters = useStore((s) => s.filters);
  const setFilters = useStore((s) => s.setFilters);
  const clearFilters = useStore((s) => s.clearFilters);

  const hasActiveFilters =
    filters.statuses.length > 0 ||
    filters.priorities.length > 0 ||
    filters.assignees.length > 0 ||
    filters.dueDateFrom !== '' ||
    filters.dueDateTo !== '';

  return (
    <div className="flex flex-wrap items-center gap-2 px-3 md:px-4 py-2 md:py-2.5 border-b border-border-primary bg-bg-secondary/50">
      <span className="text-xs text-text-muted font-medium mr-1">Filters:</span>

      <Dropdown
        label="Status"
        options={STATUS_OPTIONS}
        selected={filters.statuses}
        onChange={(v) => setFilters({ statuses: v as Status[] })}
      />
      <Dropdown
        label="Priority"
        options={PRIORITY_OPTIONS}
        selected={filters.priorities}
        onChange={(v) => setFilters({ priorities: v as Priority[] })}
      />
      <Dropdown
        label="Assignee"
        options={ASSIGNEE_OPTIONS}
        selected={filters.assignees}
        onChange={(v) => setFilters({ assignees: v })}
      />

      <div className="hidden sm:flex items-center gap-1.5">
        <label className="text-xs text-text-muted">From:</label>
        <input
          type="date"
          value={filters.dueDateFrom}
          onChange={(e) => setFilters({ dueDateFrom: e.target.value })}
          className="px-2 py-1 rounded-lg text-xs border border-border-primary bg-bg-secondary text-text-primary"
        />
      </div>
      <div className="hidden sm:flex items-center gap-1.5">
        <label className="text-xs text-text-muted">To:</label>
        <input
          type="date"
          value={filters.dueDateTo}
          onChange={(e) => setFilters({ dueDateTo: e.target.value })}
          className="px-2 py-1 rounded-lg text-xs border border-border-primary bg-bg-secondary text-text-primary"
        />
      </div>

      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          ✕ Clear all
        </Button>
      )}
    </div>
  );
};
