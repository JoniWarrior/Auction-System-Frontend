import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';

interface CSearchProps {
  onSearch: (search: string) => void;
}

const CSearch = ({ onSearch }: CSearchProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search auctions..."
        value={searchTerm}
        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 w-full"
        onChange={(e) => {
          setSearchTerm(e.target.value);
          onSearch(e.target.value);
        }}
      />
      <FaSearch className="absolute left-3 top-3 text-gray-400" />
    </div>
  );
};

export default CSearch;
