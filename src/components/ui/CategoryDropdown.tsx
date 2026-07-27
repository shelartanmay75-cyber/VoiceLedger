import React from 'react';
import { Tag } from 'lucide-react';
import { Dropdown } from './Dropdown';
import { TOP_20_CATEGORIES } from '../../data/mockExpensesData';

export interface CategoryDropdownProps {
  value: string;
  onChange: (category: string) => void;
  label?: string;
  className?: string;
  id?: string;
}

export const CategoryDropdown: React.FC<CategoryDropdownProps> = ({
  value,
  onChange,
  label = 'Category',
  className = '',
  id,
}) => {
  const options = TOP_20_CATEGORIES.map((cat) => ({
    label: cat,
    value: cat,
    icon: <Tag className="w-3.5 h-3.5 text-[#3B82F6]" />,
  }));

  return (
    <Dropdown
      id={id}
      label={label}
      options={options}
      value={value}
      onChange={onChange}
      placeholder="Select category..."
      className={className}
    />
  );
};
