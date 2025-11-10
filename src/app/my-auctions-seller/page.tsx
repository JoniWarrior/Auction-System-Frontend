'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaClock, FaFilter } from 'react-icons/fa';
import { showError } from '@/utils/functions';
import axios from 'axios';
import AuctionService, { GetAuctionsParams } from '@/services/AuctionService';
import Image from 'next/image';
import GradientButton from '@/core/buttons/electrons/GradientButton';
import _ from 'lodash';
import Pagination from '@/core/pagination/Pagination';
import CSearch from '@/core/inputs/CSearch';

export default function MyAuctionsPage() {
  const [auctions, setAuctions] = useState<any[]>([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [totalPages, setTotalPages] = useState<any>();
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const handleSearchChange = _.debounce((value: string) => setSearchTerm(value), 500);

  const handleCloseAuction = async (auctionId: string) => {
    const confirmed = window.confirm('Are you sure to close the auction?');
    if (!confirmed) return;

    try {
      const response = await AuctionService.closeAuction(auctionId);
      setAuctions((prev) =>
        prev.map((auction) =>
          auction.id === auctionId ? { ...auction, ...response.data.data } : auction
        )
      );
    } catch (err) {
      if (axios.isAxiosError(err)) {
        // @ts-ignore
        showError(err.response.data.message);
      }
      console.error('Error closing the auction, ', err);
    }
  };

  const fetchAuctions = async () => {
    setLoading(true);
    try {
      const params: GetAuctionsParams = {
        status: filter && filter !== 'all' ? filter : undefined,
        page: currentPage || 1,
        qs: searchTerm || ''
      };
      const response = await AuctionService.getSellerAuctions(params);
      setAuctions(response.data?.data?.data);
      setTotalPages(response?.data?.data?.meta?.totalPages);
    } catch (err) {
      console.error('Error fetching the data ', err);
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
          <h1 className="text-3xl font-bold mb-4 md:mb-0"> </h1>

          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <CSearch onSearch={handleSearchChange} />
            <div className="flex items-center space-x-2">
              <FaFilter className="text-gray-500" />
              <select
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}>
                <option value="all">All Auctions</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="finished">Finished</option>
              </select>
            </div>
            <a
              href="/my-empty-items"
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition">
              + Add an Auction
            </a>
          </div>
        </div>

        {loading ? (
          <p className="text-center mt-20">Loading All Auctions...</p>
        ) : auctions.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-600">No auctions found</h2>
            <p className="text-gray-500 mt-2">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {auctions.map((auction) => (
              <div
                key={auction.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
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
                    }`}>
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
                    {auction.item.description}
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
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white font-medium py-2 rounded-lg hover:from-purple-700 hover:to-blue-600 transition-all flex items-center justify-center">
                    View Results
                  </Link>

                  {auction.status !== 'finished' && (
                    <GradientButton
                      label="Close Auction"
                      onClick={() => handleCloseAuction(auction.id)}
                      fromColor="from-red-500"
                      toColor="to-red-700"
                      hoverFromColor="hover:from-red-600"
                      hoverToColor="hover:to-red-800"
                      className="w-full text-white font-medium py-2 rounded-lg transition mt-2"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Pagination totalPages={totalPages} currentPage={currentPage} onChange={setCurrentPage} />
    </>
  );
}
