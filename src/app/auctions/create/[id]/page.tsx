'use client';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import API from '@/API/API';

export default function CreateAuctionPage() {
  const params = useParams();
  const itemId = params.id;
  const router = useRouter();

  const [startingPrice, setStartingPrice] = useState('');
  const [endTime, setEndTime] = useState('');

  const handleCreateAuction = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await API.post('/auctions', {
        itemId,
        starting_price: Number(startingPrice),
        end_time: endTime
      });
      router.push(`/auctions/${response.data.id}`);
    } catch (err) {
      console.error('Error creating auction', err);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Create Auction for Item {itemId}</h1>
      <form onSubmit={handleCreateAuction} className="space-y-4 max-w-md">
        <div>
          <label>Starting Price:</label>
          <input
            type="number"
            value={startingPrice}
            onChange={(e) => setStartingPrice(e.target.value)}
            className="border px-3 py-2 w-full rounded"
            required
          />
        </div>
        <div>
          <label>End Time:</label>
          <input
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="border px-3 py-2 w-full rounded"
            required
          />
        </div>
        <button className="bg-purple-600 text-white px-4 py-2 rounded">Create Auction</button>
      </form>
    </div>
  );
}
