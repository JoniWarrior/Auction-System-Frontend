import API from '@/utils/API/API';

export interface PlaceBidPayload {
  auctionId: string;
  amount: number;
}

const BiddingService = {
  placeBid: (payload: PlaceBidPayload) => API.post("/biddings", payload)
};

export default BiddingService;