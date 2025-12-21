import { FaSearch } from 'react-icons/fa';

const NoAuctionsMsg = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-500">
      <FaSearch className="text-4xl mb-3 opacity-70" />
      <p className="text-lg font-medium">No auctions found</p>
      <p className="text-sm mt-1">Try adjusting your search or filters</p>
    </div>
  );
};
export default NoAuctionsMsg;
