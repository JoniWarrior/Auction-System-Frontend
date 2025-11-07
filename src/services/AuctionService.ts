import API from '../utils/API/API';

export interface GetAuctionsParams {
  status?: string;
  page?: number;
  pageSize?: number;
  qs?: string;
}

export interface CreateAuctionPayload {
  itemId?: any;
  startingPrice: number;
  endTime: any;
}
const AuctionService = {
  getBidderAuctions: (params : GetAuctionsParams) => {
    return API.get('/auctions/my-auctions-as-bidder', { params });
  },
  getSellerAuctions: (params : GetAuctionsParams) => {
    return API.get('/auctions/my-auctions-as-seller', {params});
  },
  getSingleAuction: async (auctionId: string) => {
    return API.get(`/auctions/${auctionId}`);
  },
  getAllAuctions: (params: GetAuctionsParams) => {
    return API.get('/auctions', { params });
  },
  createAuction: (payload: CreateAuctionPayload) => {
    return API.post('/auctions', payload);
  },
  closeAuction : (auctionId : string) => {
    return API.post(`/auctions/${auctionId}/close`);
  }
};

export default AuctionService;
