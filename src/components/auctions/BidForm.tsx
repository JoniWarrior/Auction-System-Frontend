import { Auction } from '@/components/auctions/AuctionLiveInfo';

export interface User {
  id : string
}

interface BidFormProps {
  handlePlaceBid: any;
  bidAmount: string;
  setBidAmount: (bidAmount: string) => void;
  auction: Auction;
  user?: User | null;
  isProcessing: boolean;
  hasDefaultCard: boolean;
  socket: any;
}

const BidForm = ({
  handlePlaceBid,
  bidAmount,
  setBidAmount,
  auction,
  user,
  isProcessing,
  hasDefaultCard,
  socket
}: BidFormProps) => {
  return (
    <div className="w-full">
      <form onSubmit={handlePlaceBid} className="w-full">
        <div className="space-y-3">
          <div className="flex sm:flex-row flex-col sm:items-start items-center sm:gap-6">
            {/* Input section with label above */}
            <div className="flex flex-col">
              <div className="flex justify-center mb-2">
                <label htmlFor="bidAmount" className="text-sm font-medium text-gray-900">
                  Bid Amount (USD)
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">$</span>
                </div>
                <input
                  id="bidAmount"
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  onFocus={(e) => {
                    socket?.emit('startBidding', {
                      auctionId: auction?.id,
                      userId: user?.id
                    });
                  }}
                  onBlur={(e) => {
                    socket?.emit('stopBidding', {
                      auctionId: auction?.id,
                      userId: user?.id
                    });
                  }}
                  placeholder={`Enter amount above $${auction?.currentPrice || '0.00'}`}
                  className="w-[320px] pl-8 pr-4 py-2.5 text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  required
                  disabled={!user?.id || isProcessing}
                />
              </div>
            </div>

            {/* Bid button - wider and shows only amount when bidding */}
            <div className="flex flex-col">
              <div className="h-6 mb-2"></div> {/* Spacer to align with input */}
              <button
                type="submit"
                disabled={!user?.id || !bidAmount || !hasDefaultCard || isProcessing}
                className={`py-2.5 px-12 text-sm font-semibold rounded-xl transition-all duration-200 flex items-center justify-center min-h-[46px] w-[160px] ${
                  !user?.id || !bidAmount || !hasDefaultCard || isProcessing
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white shadow-lg hover:shadow-xl active:scale-[0.98]'
                }`}>
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : !user?.id ? (
                  'Login to Bid'
                ) : !hasDefaultCard ? (
                  'Add Payment'
                ) : bidAmount ? (
                  // Show only the bid amount when bidding
                  <span className="text-base font-semibold">${Number(bidAmount)}</span>
                ) : (
                  // Show "Place Bid" only when no amount entered
                  'Place Bid'
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default BidForm;
