import { useEffect, useCallback, useRef } from 'react';
import { useStore } from '../store/useStore';
import { FilterState, Status, Priority, ViewType } from '../types';

const STATUS_VALUES: Status[] = ['To Do', 'In Progress', 'In Review', 'Done'];
const PRIORITY_VALUES: Priority[] = ['Critical', 'High', 'Medium', 'Low'];

function parseFiltersFromURL(): { filters: Partial<FilterState>; view?: ViewType } {
  const params = new URLSearchParams(window.location.search);
  const result: Partial<FilterState> = {};
  let view: ViewType | undefined;

  const statusParam = params.get('status');
  if (statusParam) {
    result.statuses = statusParam.split(',').filter((s) => STATUS_VALUES.includes(s as Status)) as Status[];
  }

  const priorityParam = params.get('priority');
  if (priorityParam) {
    result.priorities = priorityParam.split(',').filter((p) => PRIORITY_VALUES.includes(p as Priority)) as Priority[];
  }

  const assigneeParam = params.get('assignee');
  if (assigneeParam) {
    result.assignees = assigneeParam.split(',');
  }

  const fromParam = params.get('from');
  if (fromParam) result.dueDateFrom = fromParam;

  const toParam = params.get('to');
  if (toParam) result.dueDateTo = toParam;

  const viewParam = params.get('view');
  if (viewParam && ['kanban', 'list', 'timeline'].includes(viewParam)) {
    view = viewParam as ViewType;
  }

  return { filters: result, view };
}

function filtersToURL(filters: FilterState, view: ViewType): string {
  const params = new URLSearchParams();

  if (filters.statuses.length > 0) params.set('status', filters.statuses.join(','));
  if (filters.priorities.length > 0) params.set('priority', filters.priorities.join(','));
  if (filters.assignees.length > 0) params.set('assignee', filters.assignees.join(','));
  if (filters.dueDateFrom) params.set('from', filters.dueDateFrom);
  if (filters.dueDateTo) params.set('to', filters.dueDateTo);
  if (view !== 'kanban') params.set('view', view);

  const str = params.toString();
  return str ? `?${str}` : window.location.pathname;
}

export function useUrlFilters() {
  const filters = useStore((s) => s.filters);
  const view = useStore((s) => s.view);
  const setFilters = useStore((s) => s.setFilters);
  const setView = useStore((s) => s.setView);
  const isInitialized = useRef(false);

  // On mount: read URL and apply filters
  useEffect(() => {
    const { filters: urlFilters, view: urlView } = parseFiltersFromURL();
    if (Object.keys(urlFilters).length > 0) {
      setFilters(urlFilters);
    }
    if (urlView) {
      setView(urlView);
    }
    isInitialized.current = true;
  }, [setFilters, setView]);

  // Sync filters → URL
  useEffect(() => {
    if (!isInitialized.current) return;
    const url = filtersToURL(filters, view);
    const currentUrl = window.location.search || window.location.pathname;
    if (url !== currentUrl) {
      window.history.pushState({}, '', url);
    }
  }, [filters, view]);

  // Handle popstate (back/forward)
  const handlePopState = useCallback(() => {
    const { filters: urlFilters, view: urlView } = parseFiltersFromURL();
    setFilters({
      statuses: urlFilters.statuses || [],
      priorities: urlFilters.priorities || [],
      assignees: urlFilters.assignees || [],
      dueDateFrom: urlFilters.dueDateFrom || '',
      dueDateTo: urlFilters.dueDateTo || '',
    });
    if (urlView) setView(urlView);
  }, [setFilters, setView]);

  useEffect(() => {
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [handlePopState]);
}
