import React from 'react';

interface AvatarProps {
  name: string;
  color: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZES = {
  sm: 'w-6 h-6 text-[10px]',
  md: 'w-8 h-8 text-xs',
  lg: 'w-10 h-10 text-sm',
};

export const Avatar: React.FC<AvatarProps> = ({ name, color, size = 'md', className = '' }) => {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className={`inline-flex items-center justify-center rounded-full font-semibold text-white shrink-0 ${SIZES[size]} ${className}`}
      style={{ backgroundColor: color }}
      title={name}
    >
      {initials}
    </div>
  );
};
