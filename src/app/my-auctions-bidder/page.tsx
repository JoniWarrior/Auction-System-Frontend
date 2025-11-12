'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaClock } from 'react-icons/fa';
import AuctionService, { passParams } from '@/services/AuctionService';
import Image from 'next/image';
import _ from 'lodash';
import Pagination from '@/core/pagination/Pagination';
import CSearch from '@/core/inputs/CSearch';
import CFilter from '@/core/inputs/Cfilter';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { hideLoader, showLoader } from '@/store/loadingSlice';

export default function MyAuctionsPage() {
  const [auctions, setAuctions] = useState<any[]>([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [totalPages, setTotalPages] = useState<any>();
  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useDispatch<AppDispatch>();

  const handleSearchChange = _.debounce((value: string) => setSearchTerm(value), 500);
  const fetchAuctions = async () => {
    dispatch(showLoader(true));
    try {
      const params = passParams(filter, currentPage, searchTerm);
      const response = await AuctionService.getBidderAuctions(params);
      setAuctions(response?.data?.data?.data);
      setTotalPages(response?.data?.data?.meta?.totalPages);
    } catch (err) {
      console.error('Error fetching auctions:', err);
    } finally {
      dispatch(hideLoader());
    }
  };

  useEffect(() => {
    dispatch(hideLoader())
  }, [dispatch]);

  useEffect(() => {
    fetchAuctions();
  }, [searchTerm, filter, currentPage])

  return (
  <>
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-3xl font-bold mb-4 md:mb-0">My Auctions</h1>

        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="relative">
            <CSearch onSearch={handleSearchChange} />
          </div>
          <CFilter filter={filter} onFilterChange={setFilter}/>
        </div>
      </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {auctions.map((auction) => (
            <div
              key={auction.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
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

              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg truncate">{auction.item.title}</h3>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    By {auction?.item?.seller?.name}
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {auction?.item?.description}
                </p>

                <div className="flex justify-between items-center mb-3">
                  <div>
                    <span className="text-sm text-gray-500">Current bid</span>
                    <span className="text-2xl font-bold text-purple-700 block">
                      ${auction.currentPrice.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-gray-500">Current Price</span>
                    <span className="text-lg font-semibold block">
                      ${auction.currentPrice.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                  <span>{auction.biddings.length} bids</span>
                </div>

                <Link
                  href={`/auctions/${auction.id}`}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white font-medium py-2 rounded-lg hover:from-purple-700 hover:to-blue-600 transition-all flex items-center justify-center"
                >
                  {auction.status === 'finished' ? 'View Results' : 'Place Bid'}
                </Link>
              </div>
            </div>
          ))}
        </div>
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onChange={setCurrentPage}
      />
    </div>
  </>
);

}
