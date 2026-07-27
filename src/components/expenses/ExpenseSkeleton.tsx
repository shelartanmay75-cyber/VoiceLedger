import React from 'react';

export interface ExpenseSkeletonProps {
  count?: number;
  layoutMode?: 'grid' | 'table';
}

export const ExpenseSkeleton: React.FC<ExpenseSkeletonProps> = ({
  count = 6,
  layoutMode = 'grid',
}) => {
  const items = Array.from({ length: count });

  if (layoutMode === 'table') {
    return (
      <tbody className="divide-y divide-slate-100 dark:divide-[#222934]/60">
        {items.map((_, i) => (
          <tr key={i} className="animate-pulse">
            <td className="py-4 px-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-200 dark:bg-[#222934]" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-3.5 bg-slate-200 dark:bg-[#222934] rounded-md w-32" />
                  <div className="h-2.5 bg-slate-200 dark:bg-[#222934] rounded-md w-24" />
                </div>
              </div>
            </td>
            <td className="py-4 px-4">
              <div className="h-5 bg-slate-200 dark:bg-[#222934] rounded-full w-24" />
            </td>
            <td className="py-4 px-4">
              <div className="h-3.5 bg-slate-200 dark:bg-[#222934] rounded-md w-20" />
            </td>
            <td className="py-4 px-4">
              <div className="h-3.5 bg-slate-200 dark:bg-[#222934] rounded-md w-24" />
            </td>
            <td className="py-4 px-4 text-right">
              <div className="h-4 bg-slate-200 dark:bg-[#222934] rounded-md w-16 ml-auto" />
            </td>
            <td className="py-4 px-4 text-right">
              <div className="h-6 bg-slate-200 dark:bg-[#222934] rounded-lg w-12 ml-auto" />
            </td>
          </tr>
        ))}
      </tbody>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((_, i) => (
        <div
          key={i}
          className="bg-white dark:bg-[#151A21] border border-slate-200 dark:border-[#222934] rounded-2xl p-4 space-y-4 animate-pulse"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-[#222934]" />
              <div className="h-5 bg-slate-200 dark:bg-[#222934] rounded-md w-24" />
            </div>
            <div className="w-12 h-6 bg-slate-200 dark:bg-[#222934] rounded-lg" />
          </div>

          <div className="space-y-2">
            <div className="h-4 bg-slate-200 dark:bg-[#222934] rounded-md w-3/4" />
            <div className="h-3 bg-slate-200 dark:bg-[#222934] rounded-md w-1/2" />
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-[#222934]/60 flex items-center justify-between">
            <div className="h-3 bg-slate-200 dark:bg-[#222934] rounded-md w-20" />
            <div className="h-5 bg-slate-200 dark:bg-[#222934] rounded-md w-16" />
          </div>
        </div>
      ))}
    </div>
  );
};
