import API from '@/utils/API/API';

export interface PlaceBidPayload {
  auctionId: string;
  amount: number;
}

const BiddingService = {
  placeBid: async (payload: PlaceBidPayload) => {
    const response = await API.post("/biddings", payload);
    return response?.data?.data;
  },
};

export default BiddingService;