import React from 'react';
import { User } from 'lucide-react';

export interface AvatarProps {
  src?: string | null;
  name?: string | null;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showStatus?: boolean;
  statusColor?: string;
  className?: string;
  id?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  size = 'md',
  showStatus = false,
  statusColor = 'bg-[#22C55E]',
  className = '',
  id,
}) => {
  const sizeStyles = {
    sm: 'w-7 h-7 text-[10px]',
    md: 'w-9 h-9 text-xs',
    lg: 'w-12 h-12 text-sm',
    xl: 'w-16 h-16 text-base',
  };

  const getInitials = (n?: string | null): string => {
    if (!n) return 'U';
    const parts = n.trim().split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return parts[0].substring(0, 2).toUpperCase();
  };

  return (
    <div id={id} className={`relative inline-block ${className}`}>
      {src ? (
        <img
          src={src}
          alt={name || 'User Avatar'}
          className={`${sizeStyles[size]} rounded-full object-cover ring-2 ring-[#3B82F6] shadow-sm`}
        />
      ) : (
        <div
          className={`${sizeStyles[size]} rounded-full bg-gradient-to-br from-[#3B82F6] to-[#1E3A8A] text-white font-extrabold flex items-center justify-center shadow-sm select-none`}
        >
          {name ? getInitials(name) : <User className="w-4 h-4" />}
        </div>
      )}

      {showStatus && (
        <span
          className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ${statusColor} ring-2 ring-white dark:ring-[#0B0F14]`}
        />
      )}
    </div>
  );
};
