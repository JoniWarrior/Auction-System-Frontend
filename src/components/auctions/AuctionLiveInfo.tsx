import { FaClock } from 'react-icons/fa';

interface AuctionLiveInfoProps {
  timeRemaining: string;
  auction: any;
}

const AuctionLiveInfo = ({timeRemaining, auction} : AuctionLiveInfoProps) => {
  return <div>
    <div className="grid grid-cols-3 gap-4">
      <div className="p-5 bg-gray-50 rounded-xl">
        <div className="flex items-center gap-3 mb-2">
          <FaClock className="text-purple-600 text-lg" />
          <span className="text-base text-gray-500">Time Remaining</span>
        </div>
        <p
          className={`text-xl font-bold ${timeRemaining === 'Finished' ? 'text-red-600' : 'text-gray-900'}`}>
          {timeRemaining === 'Finished' ? 'Auction Ended' : timeRemaining}
        </p>
      </div>

      <div className="p-4 bg-gray-50 rounded-xl">
        <span className="text-sm text-gray-500">Current Price</span>
        <p className="text-3xl font-bold text-purple-600">
          ${auction?.currentPrice || '0.00'}
        </p>
      </div>
      {/* Seller info */}
      {auction?.item?.seller && (
        <div className="p-4 bg-white border border-gray-200 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm text-gray-500">Seller</span>
              <p className="font-medium text-gray-900">{auction.item.seller?.name}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
}

export default AuctionLiveInfo;