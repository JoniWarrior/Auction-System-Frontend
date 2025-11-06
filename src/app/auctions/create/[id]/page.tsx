'use client';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import AuctionService, { CreateAuctionPayload } from '@/services/AuctionService';
import GradientButton from '@/core/buttons/electrons/GradientButton';

export default function CreateAuctionPage() {
  const params = useParams();
  const itemId = params.id;
  const router = useRouter();

  const [startingPrice, setStartingPrice] = useState('');
  const [endTime, setEndTime] = useState('');

  const handleCreateAuction = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: CreateAuctionPayload = {
        itemId,
        startingPrice: Number(startingPrice),
        endTime
      };

      const response = await AuctionService.createAuction(payload);
      router.push(`/auctions/${response.data.data.id}`);
    } catch (err) {
      console.error('Error creating auction', err);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Create Auction for Item</h1>
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
        <GradientButton type="submit" label="Create Auction"/>
      </form>
    </div>
  );
}
