'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaBan, FaClock } from 'react-icons/fa';
import { showError } from '@/utils/functions';
import axios from 'axios';
import AuctionService, { passParams } from '@/services/AuctionService';
import Image from 'next/image';
import GradientButton from '@/core/buttons/electrons/GradientButton';
import Pagination from '@/core/pagination/Pagination';
import CSearch from '@/core/inputs/CSearch';
import CFilter from '@/core/inputs/Cfilter';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { hideLoader, showLoader } from '@/store/loadingSlice';
import { useRouter } from 'next/navigation';
import { Auction } from '@/components/auctions/AuctionLiveInfo';
import NoAuctionsMsg from '@/components/auctions/NoAuctionsMsg';

export default function MyAuctionsPage() {
  const router = useRouter();
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [totalPages, setTotalPages] = useState<any>();
  const [currentPage, setCurrentPage] = useState(1);
  const [updated, setUpdated] = useState(0);

  const dispatch = useDispatch<AppDispatch>();
  const isLoading = useSelector((state: RootState) => state.loading.show);

  const MyEmptyItemsClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch(showLoader('Displaying Your Empty Items...'));
    router.push('/my-empty-items');
  };

  const handleCloseAuction = async (auctionId: string) => {
    const confirmed = window.confirm('Are you sure to close the auction?');
    if (!confirmed) return;

    try {
      await AuctionService.closeAuction(auctionId);
      setUpdated(updated + 1);
    } catch (err : any) {
      if (axios.isAxiosError(err)) {
        showError(err.response?.data.message);
      }
      console.error('Error closing the auction, ', err);
    }
  };

  const cancelAuction = async (auctionId : string) => {
    const confirmed = window.confirm("Are you sure to cancel the auction? No transaction will be captured! ");
    if (!confirmed) return;

    try {
      await AuctionService.cancelAuction(auctionId);
      setUpdated(updated + 1);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        showError(err.response?.data.message);
      }
      console.error('Error cancelling the auction, ', err);
    }
  }

  const fetchAuctions = async () => {
    dispatch(showLoader(true));
    try {
      const params = passParams(filter, currentPage, searchTerm);

      const response = await AuctionService.getSellerAuctions(params);
      setAuctions(response.data);
      setTotalPages(response.meta?.totalPages);
    } catch (err) {
      console.error('Error fetching the data ', err);
    } finally {
      dispatch(hideLoader());
    }
  };

  useEffect(() => {
    hideLoader();
  }, [dispatch]);

  useEffect(() => {
    fetchAuctions();
  }, [searchTerm, filter, currentPage, updated]);

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1 className="text-3xl font-bold mb-4 md:mb-0"> </h1>

          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <CSearch onSearch={setSearchTerm} />
            <div className="flex items-center space-x-2">
              <CFilter filter={filter} onFilterChange={setFilter} />
            </div>
            <Link
              href="#"
              onClick={MyEmptyItemsClick}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition">
              <span>+ Add an Auction</span>
            </Link>
          </div>
        </div>

        {isLoading ? (
          <p className="text-center mt-20">Loading Auctions...</p>
        ) : auctions.length === 0 ? (
          <NoAuctionsMsg />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {auctions.map((auction) => (
              <div
                key={auction.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="h-48 bg-gray-200 relative">
                  {auction.status !== 'finished' && (
                    <button
                      onClick={() => cancelAuction(auction.id ?? '')}
                      title="Cancel auction"
                      className="absolute top-3 right-3 z-10 bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-full shadow-lg transition-all hover:scale-105"
                    >
                      <FaBan size={14} />
                    </button>
                  )}

                  <Image
                    src={auction?.item?.imageURL ?? 'Undefined'}
                    alt={auction?.item?.title ?? 'Undefined'}
                    fill
                    className="w-full h-full object-cover"
                  />
                  <div
                    className={`absolute top-4 left-4 text-white text-sm font-medium py-1 px-3 rounded-full ${
                      auction?.status !== 'finished' ? 'bg-green-500' : 'bg-red-500'
                    }`}>
                    <FaClock className="inline mr-1" />{' '}
                    {auction.status !== 'finished'
                      ? new Date(auction?.endTime).toLocaleString()
                      : 'Finished'}
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg truncate">{auction?.item?.title}</h3>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      By {auction?.item?.seller?.name}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {auction.item?.description}
                  </p>

                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <span className="text-sm text-gray-500">Current bid</span>
                      <span className="text-2xl font-bold text-purple-700 block">
                        L{auction?.currentPrice?.toLocaleString()}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm text-gray-500">Current Price</span>
                      <span className="text-lg font-semibold block">
                        L{auction.currentPrice?.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                    <span>{auction.biddings?.length ?? 0} bids</span>
                  </div>

                  <Link
                    href={`/auctions/${auction.id}`}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white font-medium py-2 rounded-lg hover:from-purple-700 hover:to-blue-600 transition-all flex items-center justify-center">
                    View Results
                  </Link>

                  {auction.status !== 'finished' && (
                      <GradientButton
                        isLoading={isLoading}
                        label="Close Auction"
                        onClick={() => handleCloseAuction(auction.id ?? '')}
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
