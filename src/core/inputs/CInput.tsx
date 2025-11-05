import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  appendIcon?: React.ReactNode;
}

const CInput = ({ label, value, onChange, appendIcon, ...props }: InputProps) => {
  return (
    <div>
      {label && (
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="mt-1 relative">
        <input
          id="email"
          name="email"
          type="email"
          required
          className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
          value={value}
          onChange={onChange}
          {...props}
        />
        {appendIcon}
      </div>
    </div>
  );
};

export default CInput;
