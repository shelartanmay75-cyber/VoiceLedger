import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  pageSize?: number;
  className?: string;
  id?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  pageSize,
  className = '',
  id,
}) => {
  return (
    <div
      id={id}
      className={`flex flex-col sm:flex-row items-center justify-between gap-4 py-3 px-4 bg-white dark:bg-[#151A21] border border-slate-200 dark:border-[#222934] rounded-2xl font-sans ${className}`}
    >
      {/* Item Range Text */}
      <div className="text-xs text-slate-500 dark:text-[#9CA3AF]">
        {totalItems && pageSize ? (
          <span>
            Showing <strong className="text-slate-900 dark:text-[#F3F4F6]">{(currentPage - 1) * pageSize + 1}</strong> to{' '}
            <strong className="text-slate-900 dark:text-[#F3F4F6]">{Math.min(currentPage * pageSize, totalItems)}</strong> of{' '}
            <strong className="text-slate-900 dark:text-[#F3F4F6]">{totalItems}</strong> entries
          </span>
        ) : (
          <span>
            Page <strong className="text-slate-900 dark:text-[#F3F4F6]">{currentPage}</strong> of{' '}
            <strong className="text-slate-900 dark:text-[#F3F4F6]">{totalPages}</strong>
          </span>
        )}
      </div>

      {/* Page Navigation Buttons */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          leftIcon={<ChevronLeft className="w-4 h-4" />}
        >
          Previous
        </Button>

        <div className="flex items-center gap-1">
          {Array.from({ length: totalPages }).map((_, idx) => {
            const pageNum = idx + 1;
            const isActive = pageNum === currentPage;
            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-[#3B82F6] text-white shadow-sm'
                    : 'text-slate-600 dark:text-[#9CA3AF] hover:bg-slate-100 dark:hover:bg-[#222934]'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        <Button
          variant="outline"
          size="sm"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          rightIcon={<ChevronRight className="w-4 h-4" />}
        >
          Next
        </Button>
      </div>
    </div>
  );
};
