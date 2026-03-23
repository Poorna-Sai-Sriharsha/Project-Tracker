import { Task, Priority, Status, User } from '../types';

const USERS: User[] = [
  { id: 'u1', name: 'Rahul Sharma', color: '#3b82f6' },
  { id: 'u2', name: 'Priya Patel', color: '#8b5cf6' },
  { id: 'u3', name: 'Ravi Kumar', color: '#ef4444' },
  { id: 'u4', name: 'Ananya Singh', color: '#22c55e' },
  { id: 'u5', name: 'Arjun Reddy', color: '#f97316' },
  { id: 'u6', name: 'Deepika Nair', color: '#ec4899' },
];

export { USERS };

const PRIORITIES: Priority[] = ['Critical', 'High', 'Medium', 'Low'];
const STATUSES: Status[] = ['To Do', 'In Progress', 'In Review', 'Done'];

const TASK_PREFIXES = [
  'Implement', 'Fix', 'Update', 'Refactor', 'Design', 'Test', 'Review',
  'Optimize', 'Configure', 'Deploy', 'Add', 'Remove', 'Debug', 'Build',
  'Migrate', 'Setup', 'Create', 'Integrate', 'Document', 'Upgrade',
];

const TASK_SUBJECTS = [
  'user authentication flow', 'payment gateway', 'dashboard layout',
  'notification system', 'search functionality', 'API endpoints',
  'database schema', 'caching layer', 'file upload module',
  'email templates', 'CI/CD pipeline', 'logging system',
  'error handling', 'rate limiting', 'user profile page',
  'dark mode theme', 'accessibility features', 'mobile navigation',
  'data export feature', 'admin panel', 'analytics dashboard',
  'form validation', 'image optimization', 'WebSocket connection',
  'session management', 'password reset flow', 'two-factor auth',
  'report generation', 'audit logging', 'backup automation',
  'input sanitization', 'performance monitoring', 'memory leak',
  'dropdown component', 'modal dialog', 'tooltip behavior',
  'chart rendering', 'table pagination', 'breadcrumb navigation',
  'sidebar collapse', 'keyboard shortcuts', 'drag interactions',
];

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function formatDate(d: Date): string {
  return d.toISOString().split('T')[0];
}

export function generateTasks(count: number = 500): Task[] {
  const tasks: Task[] = [];
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sixtyDaysFromNow = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000);

  for (let i = 0; i < count; i++) {
    const prefix = randomItem(TASK_PREFIXES);
    const subject = randomItem(TASK_SUBJECTS);
    const title = `${prefix} ${subject}`;

    const dueDate = randomDate(thirtyDaysAgo, sixtyDaysFromNow);
    const hasStartDate = Math.random() > 0.15;
    let startDate: Date | null = null;

    if (hasStartDate) {
      const startOffset = Math.floor(Math.random() * 14) + 1;
      startDate = new Date(dueDate.getTime() - startOffset * 24 * 60 * 60 * 1000);
    }

    tasks.push({
      id: `task-${i + 1}`,
      title,
      status: randomItem(STATUSES),
      priority: randomItem(PRIORITIES),
      assignee: randomItem(USERS),
      startDate: startDate ? formatDate(startDate) : null,
      dueDate: formatDate(dueDate),
      createdAt: formatDate(randomDate(thirtyDaysAgo, now)),
    });
  }

  return tasks;
}
