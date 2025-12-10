import API from '@/utils/API/API';

export interface TransactionPayload {
  amount: any;
  auctionId: string;
}

export interface UpdateTransactionPayload {
  previousTransaction : string,
  currentTransaction : string,
  bidding : any
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
