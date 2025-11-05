import React from 'react';
import CInput, { InputProps } from '@/core/inputs/CInput';
import { FaEnvelope } from 'react-icons/fa';

const CEmailInput = (props: InputProps) => {
  return (
    <CInput
      appendIcon={<FaEnvelope className="absolute left-3 top-3 text-gray-400" />}
      {...props}
    />
  );
};

export default CEmailInput;
