'use client';
import Link from 'next/link';
import { FaClock, FaGavel, FaTag, FaStar, FaArrowRight } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import AuctionService, { GetAuctionsParams } from '@/services/AuctionService';
import Image from 'next/image';
import { showLoader } from '@/store/loadingSlice';

import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [featuredAuctions, setFeaturedAuctions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const linkText = 'My Auctions';
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const isLoading = useSelector((state: RootState) => state.loading.show);

  const MyAuctionsSellerClick = async (e : React.MouseEvent) => {
    e.preventDefault();
    dispatch(showLoader("Displaying Your Auctions ..."));
    router.push("/my-auctions-seller");
  }
  const MyAuctionsBidderClick = async (e : React.MouseEvent) => {
    e.preventDefault();
    dispatch(showLoader("Displaying Your Biddings..."));
    router.push("/my-auctions-bidder");
  }

  const SellItemClick = async (e : React.MouseEvent) => {
    e.preventDefault();
    dispatch(showLoader("Displaying Sell Item Page..."));
    router.push("/sell");
  }



  const fetchAuctions = async () => {
    try {
      const params: GetAuctionsParams = {
        status: 'active',
        page: 1,
        pageSize: 10,
        qs: ''
      };
      const response = await AuctionService.getAllAuctions(params);
      setFeaturedAuctions(response?.data || []);
    } catch (err) {
      console.error('Error fetching the items from the backend,', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuctions();
  }, []);

  return loading ? (
    <p className="text-center mt-20">Loading Auctions...</p>
  ) : (
    <div className="min-h-screen">
      <section className="bg-gradient-to-r from-purple-700 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Discover Unique Treasures & <br />
            Win Amazing Auctions
          </h1>
          <p className="text-xl mb-10 max-w-2xl mx-auto">
            Bid on exclusive items from around the world. Everything from rare collectibles to
            everyday essentials.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="#"
              onClick={MyAuctionsSellerClick}
              className="bg-white text-purple-700 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition duration-300 flex items-center justify-center">
              {linkText} <FaArrowRight className="ml-2" />
            </Link>

            {
              <Link
                href="#"
                onClick={MyAuctionsBidderClick}
                className="bg-white text-purple-700 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition duration-300 flex items-center justify-center">
                {'My Biddings'} <FaArrowRight className="ml-2" />
              </Link>
            }
            <Link
              href="#"
              onClick={SellItemClick}
              className="bg-transparent border-2 border-white text-white font-semibold py-3 px-8 rounded-lg hover:bg-white hover:text-purple-700 transition duration-300">
              Sell an Item
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Auctions */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold">Featured Auctions</h2>
            <Link
              href="/auctions"
              className="text-purple-600 hover:text-purple-800 font-medium flex items-center">
              View All <FaArrowRight className="ml-2" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredAuctions?.length > 0 &&
              featuredAuctions
                ?.filter((auction) => auction?.status === 'active' || auction?.status === 'pending')
                .slice(0, 8)
                .map((auction) => (
                  <div
                    key={auction.id}
                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <div className="h-48 bg-gray-200 relative">
                      <Image
                        src={auction.item.imageURL}
                        alt={auction.item.title}
                        fill
                        className="object-cover rounded-lg"
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
                      <h3 className="font-semibold text-lg mb-2 truncate">{auction.item.title}</h3>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-2xl font-bold text-purple-700">
                          ${auction.currentPrice.toLocaleString()}
                        </span>
                      </div>

                      <Link
                        href={`/auctions/${auction.id}`}
                        className="block w-full text-center bg-gradient-to-r from-purple-600 to-blue-500 text-white font-medium py-2 rounded-lg hover:from-purple-700 hover:to-blue-600 transition-all">
                        Place Bid
                      </Link>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaTag className="text-2xl text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Register & Browse</h3>
              <p className="text-gray-600">
                Create an account and explore thousands of unique items up for auction.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaGavel className="text-2xl text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. Place Your Bid</h3>
              <p className="text-gray-600">
                Enter your maximum bid and let our system automatically compete for you.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaStar className="text-2xl text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Win & Celebrate</h3>
              <p className="text-gray-600">
                If you have the highest bid when the auction ends, the item is yours!
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-purple-600 to-blue-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Find Your Treasure?</h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto">
            Join thousands of bidders discovering amazing items every day.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/signup"
              className="bg-white text-purple-700 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition duration-300">
              Create Account
            </Link>
            <Link
              href="/auctions"
              className="bg-transparent border-2 border-white text-white font-semibold py-3 px-8 rounded-lg hover:bg-white hover:text-purple-700 transition duration-300">
              Browse Auctions
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}