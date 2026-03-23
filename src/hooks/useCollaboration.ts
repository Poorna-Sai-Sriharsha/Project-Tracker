import { useEffect, useRef, useCallback } from 'react';
import { useStore } from '../store/useStore';
import { CollabUser } from '../types';

const SIMULATED_USERS: CollabUser[] = [
  { id: 'collab-1', name: 'Jordan Lee', color: '#f59e0b', currentTaskId: null },
  { id: 'collab-2', name: 'Riley Park', color: '#06b6d4', currentTaskId: null },
  { id: 'collab-3', name: 'Casey Morgan', color: '#f43f5e', currentTaskId: null },
];

export function useCollaboration() {
  const tasks = useStore((s) => s.tasks);
  const setCollabUsers = useStore((s) => s.setCollabUsers);
  const updateCollabUser = useStore((s) => s.updateCollabUser);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const moveRandomUser = useCallback(() => {
    if (tasks.length === 0) return;
    const userIndex = Math.floor(Math.random() * SIMULATED_USERS.length);
    const userId = SIMULATED_USERS[userIndex].id;
    const randomTask = tasks[Math.floor(Math.random() * Math.min(tasks.length, 50))];
    updateCollabUser(userId, randomTask.id);
  }, [tasks, updateCollabUser]);

  useEffect(() => {
    // Initialize collab users
    const initialUsers = SIMULATED_USERS.map((u, i) => ({
      ...u,
      currentTaskId: tasks.length > i ? tasks[i].id : null,
    }));
    setCollabUsers(initialUsers);

    // Move users randomly every 3-6 seconds, but defer startup to prioritize initial paint
    const timeout = setTimeout(() => {
      intervalRef.current = setInterval(() => {
        moveRandomUser();
      }, 3000 + Math.random() * 3000);
    }, 1000);

    return () => {
      clearTimeout(timeout);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [tasks.length > 0]); // eslint-disable-line react-hooks/exhaustive-deps

  return useStore((s) => s.collabUsers);
}
