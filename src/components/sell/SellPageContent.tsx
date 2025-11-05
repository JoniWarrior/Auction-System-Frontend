import { useState } from 'react';
import Link from 'next/link';
import { FaArrowLeft, FaTag, FaAlignLeft, FaUpload } from 'react-icons/fa';
import { handleRequestErrors, showSuccess } from '@/utils/functions';
import ItemService from '@/services/ItemService';
import { useRouter } from 'next/navigation';

export default function SellPageContent() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imageURL, setImageURL] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setImage(file);
      setImageURL(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      if (image) {
        formData.append('image', image);
      }
      const res = await ItemService.create(formData);
      showSuccess(res.data.message);
      router.push('/my-empty-items');
    } catch (err) {
      handleRequestErrors(err);
    } finally {
      setLoading(false);
    }
  };

  return loading ? (
    <p className="text-center mt-20">Loading All Auctions...</p>
  ) : (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg mx-auto bg-white rounded-xl shadow-lg overflow-hidden p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link href="/" className="text-orange-600 hover:text-orange-700 flex items-center">
            <FaArrowLeft className="mr-2" /> Back to Home
          </Link>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
              <FaTag className="text-white text-sm" />
            </div>
            <span className="text-lg font-bold text-gray-800">Sell Item</span>
          </div>
        </div>

        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            List Your Item for Auction
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Provide details and upload your item image
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Item Title
              </label>
              <div className="mt-1 relative">
                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  placeholder="Awesome Vintage Watch"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-yellow-400 focus:border-yellow-400"
                />
                <FaTag className="absolute left-3 top-3 text-gray-400" />
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <div className="mt-1 relative">
                <textarea
                  id="description"
                  name="description"
                  required
                  rows={4}
                  placeholder="Describe your item..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-yellow-400 focus:border-yellow-400"
                />
                <FaAlignLeft className="absolute left-3 top-3 text-gray-400" />
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Upload Image</label>
              <div className="mt-1 flex items-center">
                <label
                  htmlFor="image"
                  className="cursor-pointer bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-lg flex items-center hover:from-yellow-500 hover:to-orange-600">
                  <FaUpload className="mr-2" /> Choose File
                </label>
                <input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                {image && <span className="ml-4 text-sm text-gray-700 truncate">{image.name}</span>}
              </div>

              {imageURL && (
                <img
                  src={imageURL}
                  alt="Preview"
                  className="mt-4 w-full h-64 object-cover rounded-lg border border-gray-200"
                />
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400">
              List Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
