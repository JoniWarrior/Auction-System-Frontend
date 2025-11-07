import API from '@/utils/API/API';
export interface GetItemsParams {
  page?: number;
  qs?: string;
}
const ItemService = {
  create: async (payload: FormData) =>
    API.post('/items', payload, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getEmptyItems: (params : GetItemsParams) => API.get('items/my-empty-items', {params})
};

export default ItemService;
