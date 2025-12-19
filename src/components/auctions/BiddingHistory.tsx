import { formatDate } from "@/utils/functions";
import { FaUser } from "react-icons/fa";

export interface Bidding {
  id : string;
  bidder : {
    name : string
  }
  amount : number,
  createdAt : string,
  transaction ?: { paymentCurrency : string}
}

interface BiddingHistoryProps {
  biddings: Bidding[];
}

export default function BiddingHistory({ biddings }: BiddingHistoryProps) {
  return (
    <div>
      {biddings.length === 0 ? (
        <p className="text-gray-500">No bids yet. Be the first to bid!</p>
      ) : (
        <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
          {biddings.map((bidding: Bidding) => (
            <div
              key={bidding.id}
              className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                  <FaUser className="text-purple-600" />
                </div>
                <span className="font-medium">{bidding?.bidder?.name}</span>
              </div>
              <div className="text-right">
                <div className="font-semibold">
                  <div>
                    Amount: {`${bidding?.transaction?.paymentCurrency === 'EUR' ? '€' : 'L'}${bidding.amount.toLocaleString()}`}
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {formatDate(bidding.createdAt)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
