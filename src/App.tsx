import React from 'react';
import { useStore } from './store/useStore';
import { useUrlFilters } from './hooks/useUrlFilters';
import { useFilteredTasks } from './hooks/useFilteredTasks';
import { useSortedTasks } from './hooks/useFilteredTasks';
import { useCollaboration } from './hooks/useCollaboration';
import { ViewSwitcher } from './components/layout/ViewSwitcher';
import { FilterBar } from './components/filters/FilterBar';
import { PresenceBar } from './components/collaboration/PresenceBar';

// Direct imports - Lazy loading is bad for LCP if it's the default view, and bundle is small enough
import { KanbanBoard } from './components/kanban/KanbanBoard';
import { ListView } from './components/list/ListView';
import { TimelineView } from './components/timeline/TimelineView';

const App: React.FC = () => {
  // Sync filters with URL
  useUrlFilters();

  // Get store state
  const tasks = useStore((s) => s.tasks);
  const view = useStore((s) => s.view);
  const setView = useStore((s) => s.setView);
  const filters = useStore((s) => s.filters);
  const sort = useStore((s) => s.sort);
  const setSort = useStore((s) => s.setSort);
  const moveTask = useStore((s) => s.moveTask);
  const clearFilters = useStore((s) => s.clearFilters);

  // Collab simulation
  const collabUsers = useCollaboration();

  // Apply filters
  const filteredTasks = useFilteredTasks(tasks, filters);

  // Apply sorting (for list view)
  const sortedTasks = useSortedTasks(filteredTasks, sort);

  return (
    <div className="h-screen flex flex-col bg-bg-primary">
      {/* Header */}
      <header className="flex items-center justify-between px-3 md:px-4 py-2 md:py-3 border-b border-border-primary bg-bg-secondary/80 backdrop-blur-sm gap-2" style={{ minHeight: 48 }}>
        <div className="flex items-center gap-2 md:gap-3 shrink-0">
          <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center">
            <svg className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-base md:text-lg font-bold text-text-primary">
            Project <span className="text-accent-blue">Tracker</span>
          </h1>
        </div>

        <ViewSwitcher currentView={view} onViewChange={setView} />

        <div className="text-xs text-text-muted hidden sm:block shrink-0">
          {filteredTasks.length} of {tasks.length} tasks
        </div>
      </header>

      {/* Presence bar */}
      <PresenceBar collabUsers={collabUsers} />

      {/* Filter bar */}
      <FilterBar />

      {/* Main content — fixed height to prevent CLS */}
      <main className="flex-1 overflow-hidden">
        {view === 'kanban' && (
          <KanbanBoard
            tasks={filteredTasks}
            collabUsers={collabUsers}
            onMoveTask={moveTask}
          />
        )}
        {view === 'list' && (
          <ListView
            tasks={sortedTasks}
            sort={sort}
            collabUsers={collabUsers}
            onSort={setSort}
            onClearFilters={clearFilters}
          />
        )}
        {view === 'timeline' && (
          <TimelineView
            tasks={filteredTasks}
            collabUsers={collabUsers}
            onClearFilters={clearFilters}
          />
        )}
      </main>
    </div>
  );
};

export default App;
