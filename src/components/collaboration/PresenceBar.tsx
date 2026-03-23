import React from 'react';
import { CollabUser } from '../../types';
import { Avatar } from '../ui/Avatar';

interface PresenceBarProps {
  collabUsers: CollabUser[];
}

export const PresenceBar: React.FC<PresenceBarProps> = ({ collabUsers }) => {
  const activeUsers = collabUsers.filter((u) => u.currentTaskId !== null);

  return (
    <div className="flex items-center gap-2 px-4 py-1.5 text-xs text-text-secondary" style={{ minHeight: 32 }}>
      {activeUsers.length > 0 && (
        <>
          <div className="flex -space-x-1.5">
            {activeUsers.slice(0, 4).map((user) => (
              <Avatar key={user.id} name={user.name} color={user.color} size="sm" className="ring-2 ring-bg-primary" />
            ))}
          </div>
          <span>
            <span className="font-medium text-text-primary">{activeUsers.length}</span>
            {activeUsers.length === 1 ? ' person is' : ' people are'} viewing this board
          </span>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
        </>
      )}
    </div>
  );
};

interface CollabAvatarsProps {
  taskId: string;
  collabUsers: CollabUser[];
}

export const CollabAvatars: React.FC<CollabAvatarsProps> = ({ taskId, collabUsers }) => {
  const usersOnTask = collabUsers.filter((u) => u.currentTaskId === taskId);

  if (usersOnTask.length === 0) return null;

  return (
    <div className="flex items-center -space-x-1 transition-all duration-300">
      {usersOnTask.slice(0, 2).map((user) => (
        <div key={user.id} className="animate-slide-in">
          <Avatar name={user.name} color={user.color} size="sm" className="ring-2 ring-bg-card" />
        </div>
      ))}
      {usersOnTask.length > 2 && (
        <div className="w-6 h-6 rounded-full bg-bg-tertiary text-[10px] flex items-center justify-center text-text-secondary font-medium ring-2 ring-bg-card">
          +{usersOnTask.length - 2}
        </div>
      )}
    </div>
  );
};
