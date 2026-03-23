export function formatDueDate(dueDate: string): { text: string; isOverdue: boolean; isTodayDue: boolean } {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate + 'T00:00:00');
  const diffMs = due.getTime() - today.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return { text: 'Due Today', isOverdue: false, isTodayDue: true };
  }

  if (diffDays < -7) {
    return { text: `${Math.abs(diffDays)} days overdue`, isOverdue: true, isTodayDue: false };
  }

  if (diffDays < 0) {
    return { text: formatDateShort(dueDate), isOverdue: true, isTodayDue: false };
  }

  return { text: formatDateShort(dueDate), isOverdue: false, isTodayDue: false };
}

export function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function toDateStr(d: Date): string {
  return d.toISOString().split('T')[0];
}
