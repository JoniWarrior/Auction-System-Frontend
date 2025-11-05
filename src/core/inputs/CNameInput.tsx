import React from 'react';
import CInput, { CInputProps } from '@/core/inputs/CInput';
import { FaUser } from 'react-icons/fa';

const CNameInput = ({ value, onChange, ...props }: CInputProps) => {
  return (
    <CInput
      value={value}
      onChange={onChange}
      appendIcon={<FaUser className="absolute left-3 top-3 text-gray-400" />}
      {...props}
    />
  );
};

export default CNameInput;
