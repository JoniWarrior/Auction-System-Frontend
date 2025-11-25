import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { FaClock, FaArrowLeft } from 'react-icons/fa';
import { io } from 'socket.io-client';
import BiddingHistory from './BiddingHistory';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { showError } from '@/utils/functions';
import axios from 'axios';
import BiddingService from '@/services/BiddingService';
import AuctionService from '@/services/AuctionService';
import Image from 'next/image';
import GradientButton from '@/core/buttons/electrons/GradientButton';
import { useRouter } from 'next/navigation';

let socket: any;
let socketInitialized = false;

export default function AuctionDetailContent() {
  const params = useParams();
  const auctionId = params.id as string;
  const [auction, setAuction] = useState<any>();
  const [bidAmount, setBidAmount] = useState('');
  const [timeRemaining, setTimeRemaining] = useState('');
  const [loading, setLoading] = useState(true);
  const [biddings, setBiddings] = useState<any[]>([]);
  const [biddingUsers, setBiddingUsers] = useState<string[]>([]);
  const [outBidNotification, setOutBidNotification] = useState<string | null>(null);
  const user = useSelector((state: RootState) => state?.auth?.user);
  const [isBidding, setIsBidding] = useState(false);

  const router = useRouter();
  // Socket initialization
  useEffect(() => {
    if (!socketInitialized) {
      socket = io(process.env.NEXT_PUBLIC_BACKEND_URL, {
        query: { userId: user?.id },
      });
      socketInitialized = true;

      socket.on('outBid', (notification: any) => {
        setOutBidNotification(`${notification.message ?? 'You were outbid!'}`);
        setTimeout(() => setOutBidNotification(null), 5000);
      });
    }

    return () => {};
  }, []);

  // Join auction room and listen for updates
  useEffect(() => {
    if (!user?.id || !auctionId || !socket) return;

    socket.emit('joinAuction', auctionId);

    const handleNewBid = (bid: any) => {
      setBiddings((prev) => [bid, ...prev]);
    };

    const handleBiddingIndicator = ({
                                      userName,
                                      isBidding,
                                    }: {
      userName: string;
      isBidding: boolean;
    }) => {
      setBiddingUsers((prev) =>
        isBidding
          ? prev.includes(userName)
            ? prev
            : [...prev, userName]
          : prev.filter((u) => u !== userName)
      );
    };

    socket.on('newBid', handleNewBid);
    socket.on('biddingIndicator', handleBiddingIndicator);

    return () => {
      socket.emit('leaveAuction', auctionId);
      socket.off('newBid', handleNewBid);
      socket.off('biddingIndicator', handleBiddingIndicator);
    };
  }, [auctionId, user?.id]);

  // Fetch auction
  const fetchAuction = async () => {
    setLoading(true);
    try {
      const response = await AuctionService.getSingleAuction(auctionId);
      setAuction(response.data.data);
      setBiddings(response.data.data.biddings.sort((a: any, b: any) => b.amount - a.amount));
    } catch (err) {
      console.error('Error fetching the auction:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuction();
  }, [auctionId]);

  // Countdown timer
  useEffect(() => {
    if (!auction) return;
    const timer = setInterval(() => {
      const now = new Date();
      const end = new Date(auction.endTime);
      const diff = end.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeRemaining('Finished');
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeRemaining(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [auction]);

  // Place bid
  const handlePlaceBid = async (e: React.FormEvent) => {
    setIsBidding(true);
    e.preventDefault();
    try {
      const userId = user?.id;

      if (auction.item.seller?.id === userId) {
        showError('You cannot bid on your own auction');
        return;
      }

      if (!auctionId || !user?.id) {
        showError('Cannot place bid: missing auction or user id');
        return;
      }

      const response = await BiddingService.placeBid({
        auctionId,
        amount: Number(bidAmount),
      });

      const sdkOrderId = await response?.data?.data?.transaction?.sdkOrderId; // maybe another .data?
      console.log('SDK Order ID:', sdkOrderId);
      if (sdkOrderId) {
        router.push(`/pay/${sdkOrderId}`);
      }

      setBidAmount('');
      if (auction) {
        setAuction({ ...auction, currentPrice: response.data.data.amount });
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        // @ts-ignore
        showError(err.response?.data?.message);
      }
      console.error('Error placing bid:', err);
    } finally {
      setIsBidding(false);
    }
  };

  // ===================== RETURN =====================
  return loading ? (
    <p className="text-center mt-20">Loading Auction Details...</p>
  ) : (
    <div className="container mx-auto px-4 py-8">
      <Link
        href="/auctions"
        className="inline-flex items-center text-purple-600 hover:text-purple-800 mb-6"
      >
        <FaArrowLeft className="mr-2" /> Back to Auctions
      </Link>

      {/* Outbid notification */}
      {outBidNotification && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded shadow-lg z-50">
          {outBidNotification}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left side: image */}
        <div>
          <div className="bg-gray-200 rounded-lg overflow-hidden h-80 relative">
            <Image
              src={auction?.item?.imageURL}
              alt={auction?.item?.title}
              fill
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Right side: auction details */}
        <div>
          <h2 className="text-3xl font-bold mb-2">{auction?.item?.title}</h2>
          <p className="text-gray-600 mb-4">{auction?.item?.description}</p>

          <div className="flex items-center mb-4">
            <FaClock className="text-gray-500 mr-2" />
            <span className="font-medium">
              {timeRemaining === 'Finished'
                ? 'Auction Finished'
                : `Ends in: ${timeRemaining}`}
            </span>
          </div>

          <p className="text-xl mb-4">
            <strong>Current Price:</strong> ${auction?.currentPrice?.toFixed(2)}
          </p>

          <form onSubmit={handlePlaceBid} className="flex gap-3">
            <input
              type="number"
              value={bidAmount}
              onChange={(e  ) => setBidAmount(e.target.value)}
              placeholder="Enter your bid"
              className="border border-gray-300 rounded-md px-3 py-2 w-full"
              required
            />
            <GradientButton
              type="submit"
              label="Place Bid"
              isLoading={isBidding}
              fromColor="from-purple-600"
              toColor="to-blue-500"
              hoverFromColor="hover:from-purple-700"
              hoverToColor="hover:to-blue-600"
              className="font-medium px-6 py-2 rounded-lg transition-all"
            />

          </form>
        </div>
      </div>

      {/* Bidding history */}
      <div className="mt-10">
        <BiddingHistory biddings={biddings}/>
      </div>
    </div>
  );
}
