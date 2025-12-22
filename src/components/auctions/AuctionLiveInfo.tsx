import { FaClock } from 'react-icons/fa';
import { Bidding } from '@/components/auctions/BiddingHistory';

export interface Item {
  description?: string;
  imageURL?: string;
  title?: string;
  seller?: {
    id?: string;
    name?: string;
  }
}

export interface Auction {
  id?: string;
  currentPrice?: number;
  status?: string;
  endTime?: any;
  biddings?: Bidding[];
  item?: Item;
  length: any;
}

interface AuctionLiveInfoProps {
  timeRemaining: string;
  auction: Auction;
  highestBidCurrency?: string; // optional, but we will override if biddings exist
}

const AuctionLiveInfo = ({ timeRemaining, auction }: AuctionLiveInfoProps) => {
  const highestBidCurrency = auction?.biddings?.[0]?.transaction?.paymentCurrency || 'ALL';

  return (
    <div className="w-full">
      <div className="flex flex-col sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        {/* Time Remaining */}
        <div className="p-3 md:p-4 bg-gray-50 rounded-lg md:rounded-xl order-1">
          <div className="flex items-center gap-2 mb-1 md:mb-2">
            <FaClock className="text-purple-600 text-sm md:text-base" />
            <span className="text-xs md:text-sm text-gray-500">Time Remaining</span>
          </div>
          <p
            className={`text-base md:text-lg font-bold ${
              auction?.status === 'finished' ? 'text-red-500 ' : 'text-gray-900'
            }`}>
            {auction?.status === 'finished' ? 'Auction Ended' : timeRemaining}
          </p>
        </div>

        {/* Current Price */}
        <div className="p-3 md:p-4 bg-gray-50 rounded-lg md:rounded-xl order-2">
          <span className="text-xs md:text-sm text-gray-500">Current Price</span>
          <p className="text-xl md:text-2xl font-bold text-purple-600">
            {`${highestBidCurrency === 'EUR' ? '€' : 'L'}${auction?.currentPrice?.toLocaleString() || '0.00'}`}
          </p>
        </div>

        {/* Seller info */}
        {auction?.item?.seller && (
          <div className="p-3 md:p-4 bg-white border border-gray-200 rounded-lg md:rounded-xl order-3 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs md:text-sm text-gray-500">Seller</span>
                <p className="text-sm md:text-base font-medium text-gray-900">
                  {auction.item.seller?.name}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuctionLiveInfo;
