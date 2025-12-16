import API from '../utils/API/API';

export interface GetAuctionsParams {
  status?: string;
  page?: number;
  pageSize?: number;
  qs?: string;
}

export interface CreateAuctionPayload {
  itemId?: string;
  startingPrice: number;
  endTime: any;
}
export const passParams = (
  filter?: string,
  currentPage?: number,
  searchTerm?: string
): GetAuctionsParams => ({
  status: filter && filter !== 'all' ? filter : undefined,
  page: currentPage || 1,
  qs: searchTerm || ''
});

const AuctionService = {
  getBidderAuctions: async (params: GetAuctionsParams) => {
    const response = await API.get('/auctions/my-auctions-as-bidder', { params });
    return response?.data?.data
  },
  getSellerAuctions: async (params: GetAuctionsParams) => {
    const response = await API.get('/auctions/my-auctions-as-seller', { params });
    return response?.data?.data;
  },
  getSingleAuction: async (auctionId: string) => {
    const response = await API.get(`/auctions/${auctionId}`);
    return response?.data?.data;
  },
  getAllAuctions: async (params: GetAuctionsParams) => {
    const response = await API.get('/auctions', { params });
    return response?.data?.data;
  },
  createAuction: (payload: CreateAuctionPayload) => {
    return API.post('/auctions', payload);
  },
  closeAuction: (auctionId: string) => {
    return API.post(`/auctions/${auctionId}/close`);
  }
};

export default AuctionService;
