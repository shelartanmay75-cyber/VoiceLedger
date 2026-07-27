import React from 'react';

export interface StatusChipProps {
  status: 'active' | 'pending' | 'completed' | 'failed';
  label?: string;
  className?: string;
}

export const StatusChip: React.FC<StatusChipProps> = ({ status, label, className = '' }) => {
  const config = {
    active: {
      color: 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/30',
      dot: 'bg-[#22C55E] animate-pulse',
      defaultLabel: 'Active',
    },
    pending: {
      color: 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/30',
      dot: 'bg-[#F59E0B]',
      defaultLabel: 'Pending',
    },
    completed: {
      color: 'bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/30',
      dot: 'bg-[#3B82F6]',
      defaultLabel: 'Completed',
    },
    failed: {
      color: 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/30',
      dot: 'bg-[#EF4444]',
      defaultLabel: 'Failed',
    },
  };

  const item = config[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${item.color} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${item.dot}`} />
      <span>{label || item.defaultLabel}</span>
    </span>
  );
};
