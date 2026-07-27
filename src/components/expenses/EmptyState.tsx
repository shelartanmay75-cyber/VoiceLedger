import React from 'react';
import { Receipt, SearchX, Plus, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';

export interface EmptyStateProps {
  type?: 'no-results' | 'no-expenses';
  onResetFilters?: () => void;
  onAddExpense?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  type = 'no-results',
  onResetFilters,
  onAddExpense,
}) => {
  return (
    <div className="py-16 px-6 text-center bg-white dark:bg-[#151A21] border border-dashed border-slate-200 dark:border-[#222934] rounded-3xl flex flex-col items-center justify-center space-y-4 my-4 font-sans select-none">
      {/* Icon Circle */}
      <div className="w-16 h-16 rounded-2xl bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/20 flex items-center justify-center shadow-lg">
        {type === 'no-results' ? (
          <SearchX className="w-8 h-8 text-[#3B82F6]" />
        ) : (
          <Receipt className="w-8 h-8 text-[#3B82F6]" />
        )}
      </div>

      {/* Message Text */}
      <div className="space-y-1 max-w-sm">
        <h3 className="text-lg font-extrabold text-slate-900 dark:text-[#F3F4F6]">
          {type === 'no-results' ? 'No matching expenses found' : 'No expenses recorded yet'}
        </h3>
        <p className="text-xs text-slate-500 dark:text-[#9CA3AF] leading-relaxed">
          {type === 'no-results'
            ? 'Try adjusting your search query, category selection, or date range filters.'
            : 'Start tracking your spending naturally with your voice or add your first expense manually.'}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="pt-2 flex items-center gap-3">
        {type === 'no-results' && onResetFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={onResetFilters}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            id="empty-state-reset-btn"
          >
            Reset Filters
          </Button>
        )}

        {onAddExpense && (
          <Button
            variant="primary"
            size="sm"
            onClick={onAddExpense}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
            id="empty-state-add-btn"
          >
            Add Expense
          </Button>
        )}
      </div>
    </div>
  );
};
