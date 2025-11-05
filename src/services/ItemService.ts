import API from '@/utils/API/API';

export interface CreateItemPayload {
  title: string;
  description: string;
  sellerId: string;
  image?: File | null;
}

const ItemService = {
  create: async (payload: CreateItemPayload) => {
    const { title, description, sellerId, image } = payload;
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('sellerId', sellerId);

    if (image) {
      formData.append('image', image);
    }

    return API.post('/items', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  getEmptyItems: () => API.get('items/my-empty-items')
};

export default ItemService;
