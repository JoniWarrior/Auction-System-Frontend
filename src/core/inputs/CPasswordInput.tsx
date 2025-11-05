import React from 'react';
import CInput, { InputProps } from '@/core/inputs/CInput';
import { FaLock } from 'react-icons/fa';

const CPasswordInput = (props: InputProps) => {
  return (
    <CInput
      type="password"
      appendIcon={<FaLock className="absolute left-3 top-3 text-gray-400" />}
      {...props}
    />
  );
};

export default CPasswordInput;
