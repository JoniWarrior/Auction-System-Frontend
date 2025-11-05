import API from '@/utils/API/API';

const ItemService = {
  create: async (payload: FormData) =>
    API.post('/items', payload, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getEmptyItems: () => API.get('items/my-empty-items')
};

export default ItemService;
