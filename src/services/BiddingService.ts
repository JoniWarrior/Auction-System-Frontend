import API from '@/utils/API/API';

export interface PlaceBidPayload {
  auctionId: string;
//   bidderId: string;
  amount: number;
}

const BiddingService = {
    // Put the two first in auctionService
  getBidderAuctions: async (filter?: string) => {
    return API.get('/auctions/my-auctions-as-bidder', {
      params: { status: filter }
    });
  },
  getSellerAuctions: async (filter?: string) => {
    return API.get('/auctions/my-auctions-as-seller', {
      params: { status: filter }
    });
  },
  placeBid: (payload: PlaceBidPayload) => API.post("/biddings", payload)
};

export default BiddingService;
