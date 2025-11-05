import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  textColor?: string;
  color?: string;
  hoverColor?: string;
}

const DefaultButton = ({
  className,
  label,
  textColor = 'text-white',
  color = 'bg-purple-600',
  hoverColor = 'hover:bg-purple-700',
  ...props
}: ButtonProps) => {
  return (
    <button
      {...props}
      className={`cursor-pointer group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg ${textColor} ${color} ${hoverColor} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 ${className}`}>
      {label}
    </button>
  );
};

export default DefaultButton;
