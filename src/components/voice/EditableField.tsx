import React from 'react';

export interface EditableFieldProps {
  label: string;
  value: string | number;
  onChange: (val: string) => void;
  type?: 'text' | 'number';
  icon?: React.ReactNode;
  placeholder?: string;
  disabled?: boolean;
  id?: string;
  prefix?: string;
  className?: string;
}

export const EditableField: React.FC<EditableFieldProps> = ({
  label,
  value,
  onChange,
  type = 'text',
  icon,
  placeholder = '',
  disabled = false,
  id,
  prefix,
  className = '',
}) => {
  const fieldId = id || `editable-field-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className={`space-y-1.5 ${className}`}>
      <label htmlFor={fieldId} className="block text-xs font-semibold text-slate-700 dark:text-[#9CA3AF]">
        {label}
      </label>
      <div className="relative group">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3B82F6] pointer-events-none">
            {icon}
          </div>
        )}
        {prefix && !icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm pointer-events-none">
            {prefix}
          </div>
        )}
        <input
          id={fieldId}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder={placeholder}
          className={`w-full py-2.5 bg-slate-50 dark:bg-[#0B0F14] text-xs sm:text-sm font-semibold text-slate-900 dark:text-[#F3F4F6] border border-slate-200 dark:border-[#222934] rounded-xl focus:ring-2 focus:ring-[#3B82F6]/30 focus:border-[#3B82F6] outline-none transition-all ${
            icon || prefix ? 'pl-9' : 'pl-3'
          } pr-3 placeholder-slate-400 dark:placeholder-[#4B5563] disabled:opacity-60 disabled:cursor-not-allowed`}
        />
      </div>
    </div>
  );
};
