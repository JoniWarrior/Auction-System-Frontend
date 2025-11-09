import { Dispatch, SetStateAction } from 'react';
import GradientButton from '../buttons/electrons/GradientButton';

interface PaginationProps {
  totalPages: number;
  currentPage: number,
  onChange: Dispatch<SetStateAction<number>>;
}

const Pagination = ({ totalPages, currentPage, onChange }: PaginationProps) => {

  const handleLeftChange = () => {
    onChange((prev) => Math.max(prev - 1, 1));
  };

  const handleRightChange = () => {
    onChange((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="flex justify-center items-center gap-4 my-6">
      <GradientButton
        onClick={handleLeftChange}
        disabled={currentPage === 1}
        className="px-6 py-2 rounded disabled:opacity-50 max-w-22"
        label="Previous"
      />
      <span>
        Page {currentPage} of {totalPages}
      </span>
      <GradientButton
        onClick={handleRightChange}
        disabled={currentPage === totalPages}
        className="px-6 py-2 rounded disabled:opacity-50 max-w-20"
        label="Next"
      />
    </div>
  );
};

export default Pagination;
