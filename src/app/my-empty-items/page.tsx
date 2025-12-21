'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaPlus } from 'react-icons/fa';
import ItemService, { GetItemsParams } from '@/services/ItemService';
import Image from 'next/image';
import Pagination from '@/core/pagination/Pagination';
import CSearch from '@/core/inputs/CSearch';
import { useDispatch } from 'react-redux';
import { hideLoader, showLoader } from '@/store/loadingSlice';
import NoItems from '@/components/sell/NoItems';

interface Item {
  id: string;
  imageURL: string;
  title: string;
  description: string;
}
export default function MyEmptyItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalPages, setTotalPages] = useState<any>();
  const [currentPage, setCurrentPage] = useState(0);
  const dispatch = useDispatch();

  const fetchEmptyItems = async () => {
    dispatch(showLoader(true));
    try {
      const params: GetItemsParams = {
        page: currentPage || 1,
        qs: searchTerm || ''
      };
      const response = await ItemService.getEmptyItems(params);
      setItems(response?.data);
      setTotalPages(response?.meta?.totalPages);
    } catch (err) {
      console.error('Error fetching empty items', err);
    } finally {
      dispatch(hideLoader());
    }
  };

  useEffect(() => {
    dispatch(hideLoader());
  }, [dispatch]);

  useEffect(() => {
    fetchEmptyItems();
  }, [searchTerm, currentPage]);

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        {/* Top section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1 className="text-3xl font-bold mb-4 md:mb-0">My Empty Items</h1>

          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <div className="relative">
              <CSearch onSearch={setSearchTerm} />
            </div>
          </div>
        </div>

        {items.length === 0 ? (
          <NoItems />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item: Item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="h-48 bg-gray-200 relative">
                  <Image
                    src={item.imageURL}
                    alt={item.title}
                    fill
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-lg truncate">{item.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.description}</p>

                  <Link
                    href={`/auctions/create/${item.id}`}
                    className="w-full bg-gradient-to-r from-green-600 to-teal-500 text-white font-medium py-2 rounded-lg hover:from-green-700 hover:to-teal-600 transition-all flex items-center justify-center gap-2">
                    <FaPlus /> Create Auction
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
        <Pagination totalPages={totalPages} currentPage={currentPage} onChange={setCurrentPage} />
      </div>
    </>
  );
}
