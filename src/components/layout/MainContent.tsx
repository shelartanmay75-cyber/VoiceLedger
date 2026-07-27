import React from 'react';

export interface MainContentProps {
  children: React.ReactNode;
  className?: string;
}

export const MainContent: React.FC<MainContentProps> = ({
  children,
  className = '',
}) => {
  return (
    <main
      className={`flex-1 min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8 bg-[#0B0F14] text-[#F3F4F6] transition-all overflow-x-hidden ${className}`}
    >
      <div className="max-w-7xl mx-auto w-full space-y-6">{children}</div>
    </main>
  );
};
