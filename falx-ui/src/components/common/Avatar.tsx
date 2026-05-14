import React, { useMemo } from 'react';

interface AvatarProps {
  firstname: string;
  lastname: string;
  variant?: 'text' | 'image';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({
  firstname,
  lastname,
  variant = 'text',
  size = 'md',
  className = '',
}) => {
  const getInitials = () => {
    const first = firstname ? firstname[0].toUpperCase() : '';
    const last = lastname ? lastname[0].toUpperCase() : '';
    return `${first}${last}`;
  };

  const getColor = useMemo(() => {
    const colors = [
      'bg-blue-600',
      'bg-purple-600',
      'bg-green-600',
      'bg-red-600',
      'bg-yellow-600',
      'bg-pink-600',
      'bg-indigo-600',
    ];

    // Create a deterministic hash from the name
    const name = `${firstname}${lastname}`.toLowerCase();
    const hash = name.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);

    // Use the hash to select a color
    const colorIndex = Math.abs(hash % colors.length);
    return colors[colorIndex];
  }, [firstname, lastname]);

  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base',
  };

  if (variant === 'text') {
    return (
      <div
        className={`rounded-full ${getColor} flex items-center justify-center text-white font-medium ${sizeClasses[size]} ${className}`}
      >
        {getInitials()}
      </div>
    );
  }

  // For future image variant support
  return null;
};

export default Avatar;
