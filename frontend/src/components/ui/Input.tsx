import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ label, icon, className = '', ...props }) => (
  <div className="w-full">
    {label && <label className="block text-xs font-medium text-gray-400 mb-1.5">{label}</label>}
    <div className="relative flex items-center">
      {icon && <div className="absolute left-3 text-gray-400 pointer-events-none">{icon}</div>}
      <input
        className={`w-full bg-surface border border-gray-800 rounded-xl ${icon ? 'pl-10' : 'pl-4'} pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all ${className}`}
        {...props}
      />
    </div>
  </div>
);
