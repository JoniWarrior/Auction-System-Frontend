interface BidFormProps {
  handlePlaceBid : any,
  bidAmount : string,
  setBidAmount : (bidAmount : string) => void,
  auction : any,
  user : any,
  isProcessing : boolean,
  hasDefaultCard : boolean
}

const BidForm = ({handlePlaceBid,bidAmount, setBidAmount, auction, user, isProcessing,
                   hasDefaultCard} : BidFormProps) => {
  return (
    <div>
      <div className="space-y-4 w-full">
        <form onSubmit={handlePlaceBid} className="space-y-4">
          <div>
            <label htmlFor="bidAmount" className="block text-sm font-medium text-gray-700 mb-2">
              Bid Amount (USD)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500">$</span>
              </div>
              <input
                id="bidAmount"
                type="number"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                placeholder={`Enter amount above $${auction?.currentPrice || '0.00'}`}
                className="w-full pl-8 pr-4 py-3 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                required
                disabled={!user?.id || isProcessing}
              />
            </div>
          </div>

          {/* Bid button */}
          <button
            type="submit"
            disabled={!user?.id || !bidAmount || !hasDefaultCard || isProcessing}
            className={`w-full py-4 text-lg font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-3 ${
              !user?.id || !bidAmount || !hasDefaultCard || isProcessing
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white shadow-lg hover:shadow-xl active:scale-[0.98]'
            }`}>
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Processing...
              </>
            ) : !user?.id ? (
              'Login to Bid'
            ) : !hasDefaultCard ? (
              'Add Payment Method First'
            ) : (
              <>
                Place Bid
                {bidAmount && (
                  <span className="ml-2 px-3 py-1 bg-white/20 rounded-full">
                        ${Number(bidAmount)}
                      </span>
                )}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default BidForm;