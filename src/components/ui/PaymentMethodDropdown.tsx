import React from 'react';
import { CreditCard, Smartphone, Banknote, Building } from 'lucide-react';
import { Dropdown } from './Dropdown';
import { PAYMENT_METHODS } from '../../data/mockExpensesData';

export interface PaymentMethodDropdownProps {
  value: string;
  onChange: (method: string) => void;
  label?: string;
  className?: string;
  id?: string;
}

export const PaymentMethodDropdown: React.FC<PaymentMethodDropdownProps> = ({
  value,
  onChange,
  label = 'Payment Method',
  className = '',
  id,
}) => {
  const getIcon = (method: string) => {
    switch (method) {
      case 'UPI':
        return <Smartphone className="w-3.5 h-3.5 text-[#3B82F6]" />;
      case 'Credit Card':
      case 'Debit Card':
        return <CreditCard className="w-3.5 h-3.5 text-[#8B5CF6]" />;
      case 'Cash':
        return <Banknote className="w-3.5 h-3.5 text-[#22C55E]" />;
      case 'Net Banking':
        return <Building className="w-3.5 h-3.5 text-[#F59E0B]" />;
      default:
        return <CreditCard className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  const options = PAYMENT_METHODS.map((pm) => ({
    label: pm,
    value: pm,
    icon: getIcon(pm),
  }));

  return (
    <Dropdown
      id={id}
      label={label}
      options={options}
      value={value}
      onChange={onChange}
      placeholder="Select payment method..."
      className={className}
    />
  );
};
