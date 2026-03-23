import { useMemo } from 'react';
import { Task, FilterState, SortState, Priority } from '../types';

const PRIORITY_ORDER: Record<Priority, number> = {
  Critical: 0,
  High: 1,
  Medium: 2,
  Low: 3,
};

export function useFilteredTasks(tasks: Task[], filters: FilterState): Task[] {
  return useMemo(() => {
    return tasks.filter((task) => {
      if (filters.statuses.length > 0 && !filters.statuses.includes(task.status)) {
        return false;
      }
      if (filters.priorities.length > 0 && !filters.priorities.includes(task.priority)) {
        return false;
      }
      if (filters.assignees.length > 0 && !filters.assignees.includes(task.assignee.id)) {
        return false;
      }
      if (filters.dueDateFrom && task.dueDate < filters.dueDateFrom) {
        return false;
      }
      if (filters.dueDateTo && task.dueDate > filters.dueDateTo) {
        return false;
      }
      return true;
    });
  }, [tasks, filters]);
}

export function useSortedTasks(tasks: Task[], sort: SortState): Task[] {
  return useMemo(() => {
    const sorted = [...tasks];
    sorted.sort((a, b) => {
      let cmp = 0;
      switch (sort.field) {
        case 'title':
          cmp = a.title.localeCompare(b.title);
          break;
        case 'priority':
          cmp = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
          break;
        case 'dueDate':
          cmp = a.dueDate.localeCompare(b.dueDate);
          break;
      }
      return sort.direction === 'asc' ? cmp : -cmp;
    });
    return sorted;
  }, [tasks, sort]);
}
