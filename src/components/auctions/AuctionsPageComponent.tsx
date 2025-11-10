'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaClock, FaSearch } from 'react-icons/fa';
import _ from 'lodash';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import AuctionService, { passParams } from '@/services/AuctionService';
import Image from 'next/image';
import Pagination from '@/core/pagination/Pagination';
import CFilter from '@/core/inputs/Cfilter';

export default function AuctionsPageComponent() {
  const [auctions, setAuctions] = useState<any[]>([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const user = useSelector((state: RootState) => state.auth.user);

  const handleSearchChange = _.debounce((value: string) => setSearchTerm(value), 500);

  const fetchAuctions = async () => {
    setLoading(true);
    try {
      // const params: GetAuctionsParams = {
      //   status: filter && filter !== 'all' ? filter : undefined,
      //   page: currentPage || 1,
      //   qs: searchTerm || ''
      // };
      const params = passParams(filter, currentPage, searchTerm);
      const response = await AuctionService.getAllAuctions(params);
      setAuctions(response?.data?.data?.data); // matcehs beckend {data,meta }
      setTotalPages(response?.data?.data?.meta?.totalPages);
    } catch (err: any) {
      console.error('Error fetching the data ', err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuctions();
  }, [searchTerm, filter, currentPage]);

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1 className="text-3xl font-bold mb-4 md:mb-0"></h1>

          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search auctions..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 w-full"
                onChange={(e) => handleSearchChange(e.target.value)}
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
            <CFilter filter={filter} onFilterChange={setFilter} />
          </div>
        </div>

        <div className="flex justify-center items-center space-x-4 mt-6"></div>

        {loading ? (
          <p className="text-center mt-20">Loading All Auctions...</p>
        ) : auctions?.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-600">No auctions found</h2>
            <p className="text-gray-500 mt-2">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {auctions.map((auction) => (
              <div
                key={auction.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col"
              >
                <div className="h-48 bg-gray-200 relative">
                  <Image
                    src={auction.item.imageURL}
                    alt={auction.item.title}
                    fill
                    className="w-full h-full object-cover"
                  />

                  <div
                    className={`absolute top-4 left-4 text-white text-sm font-medium py-1 px-3 rounded-full ${
                      auction.status !== 'finished' ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  >
                    <FaClock className="inline mr-1" />{' '}
                    {auction.status !== 'finished'
                      ? new Date(auction.endTime).toLocaleString()
                      : 'Finished'}
                  </div>
                </div>

                <div className="p-4 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg truncate">{auction.item.title}</h3>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    By {auction.item.seller.name}
                  </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {auction.item.description}
                  </p>

                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <span className="text-sm text-gray-500">Current bid</span>
                      <span className="text-2xl font-bold text-purple-700 block">
                      ${auction.currentPrice.toLocaleString()}
                    </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-sm text-gray-500 mb-4"></div>

                  {auction.status === 'finished' ? (
                    <div className="flex justify-center mt-4 mb-4">
                      <p className="flex items-center gap-3 text-sm text-gray-700 border border-black rounded-lg px-4 py-2 bg-white shadow-md font-medium">
                        🏆 <span>Winner: </span>
                        <span className="text-purple-700 font-bold">
                        {auction?.winningBid?.bidder?.name}
                      </span>
                        <span className="text-gray-400"> | </span>
                        💰 <span>Winning Bid:</span>
                        <span className="text-purple-700 font-bold">
                        ${auction?.winningBid?.amount}
                      </span>
                      </p>
                    </div>
                  ) : (
                    <div className="min-h-[60px]"></div>
                  )}

                  <Link
                    href={`/auctions/${auction.id}`}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white font-medium py-2 rounded-lg hover:from-purple-700 hover:to-blue-600 transition-all flex items-center justify-center mt-auto"
                  >
                    {auction.status === 'finished' || auction.item.seller.id === user?.id
                      ? 'View Results'
                      : 'Place Bid'}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onChange={setCurrentPage}
        />
      </div>
    </>
  );

}
