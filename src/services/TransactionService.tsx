import API from '@/utils/API/API';
import { Bidding } from '@/components/auctions/BiddingHistory';

export interface TransactionPayload {
  amount: any;
  auctionId: string;
}

export interface UpdateTransactionPayload {
  previousTransaction : string,
  currentTransaction : string,
  bidding : Bidding
}

const TransactionService = {
  createTransaction: async (payload: TransactionPayload) => {
    const response = await API.post('/transactions', payload);
    return response?.data?.data;
  },
  updateAndCancelTransaction : async (payload : UpdateTransactionPayload) => {
    const response = await API.post("/transactions/update-cancel", payload);
    return response?.data?.data;
  }
};

export default TransactionService;
