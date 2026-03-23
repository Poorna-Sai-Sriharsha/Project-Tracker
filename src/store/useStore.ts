import { create } from 'zustand';
import { Task, Status, FilterState, ViewType, SortState, CollabUser } from '../types';
import { generateTasks } from '../data/seedData';

interface StoreState {
  tasks: Task[];
  view: ViewType;
  filters: FilterState;
  sort: SortState;
  collabUsers: CollabUser[];

  setView: (view: ViewType) => void;
  moveTask: (taskId: string, newStatus: Status) => void;
  updateTaskStatus: (taskId: string, newStatus: Status) => void;
  setFilters: (filters: Partial<FilterState>) => void;
  clearFilters: () => void;
  setSort: (field: SortState['field']) => void;
  setCollabUsers: (users: CollabUser[]) => void;
  updateCollabUser: (userId: string, taskId: string | null) => void;
}

const emptyFilters: FilterState = {
  statuses: [],
  priorities: [],
  assignees: [],
  dueDateFrom: '',
  dueDateTo: '',
};

export const useStore = create<StoreState>((set) => ({
  tasks: generateTasks(500),
  view: 'kanban',
  filters: { ...emptyFilters },
  sort: { field: 'title', direction: 'asc' },
  collabUsers: [],

  setView: (view) => set({ view }),

  moveTask: (taskId, newStatus) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId ? { ...t, status: newStatus } : t
      ),
    })),

  updateTaskStatus: (taskId, newStatus) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId ? { ...t, status: newStatus } : t
      ),
    })),

  setFilters: (partial) =>
    set((state) => ({
      filters: { ...state.filters, ...partial },
    })),

  clearFilters: () => set({ filters: { ...emptyFilters } }),

  setSort: (field) =>
    set((state) => ({
      sort: {
        field,
        direction:
          state.sort.field === field && state.sort.direction === 'asc'
            ? 'desc'
            : 'asc',
      },
    })),

  setCollabUsers: (users) => set({ collabUsers: users }),

  updateCollabUser: (userId, taskId) =>
    set((state) => ({
      collabUsers: state.collabUsers.map((u) =>
        u.id === userId ? { ...u, currentTaskId: taskId } : u
      ),
    })),
}));
