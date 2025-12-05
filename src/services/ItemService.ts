import API from '@/utils/API/API';
export interface GetItemsParams {
  page?: number;
  qs?: string;
}
const ItemService = {
  create: async (payload: FormData) =>
    API.post('/items', payload, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getEmptyItems: async (params : GetItemsParams) => {
    const response = await API.get('items/my-empty-items', {params});
    return response?.data?.data;
  }
};

export default ItemService;
