export type Priority = 'Critical' | 'High' | 'Medium' | 'Low';
export type Status = 'To Do' | 'In Progress' | 'In Review' | 'Done';
export type ViewType = 'kanban' | 'list' | 'timeline';

export interface User {
  id: string;
  name: string;
  color: string;
}

export interface Task {
  id: string;
  title: string;
  status: Status;
  priority: Priority;
  assignee: User;
  startDate: string | null;
  dueDate: string;
  createdAt: string;
}

export interface FilterState {
  statuses: Status[];
  priorities: Priority[];
  assignees: string[];
  dueDateFrom: string;
  dueDateTo: string;
}

export interface CollabUser {
  id: string;
  name: string;
  color: string;
  currentTaskId: string | null;
}

export type SortField = 'title' | 'priority' | 'dueDate';
export type SortDirection = 'asc' | 'desc';

export interface SortState {
  field: SortField;
  direction: SortDirection;
}
