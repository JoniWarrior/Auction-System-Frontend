// app/auctions/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { FaClock, FaUser, FaArrowLeft } from 'react-icons/fa';
import RolesProtectRoute from '@/components/role-protect';
import API from "@/API/API";
import { io } from 'socket.io-client';

let socket : any;

function AuctionDetailContent() {
  const params = useParams();
  const auctionId = params.id;
  const [auction, setAuction] = useState<any>();
  const [bidAmount, setBidAmount] = useState('');
  const [timeRemaining, setTimeRemaining] = useState('');
  const [user, setUser] = useState<{role ?: string, name ?: string} | null>(null);
  const [loading, setLoading] = useState(true);
  const [biddings, setBiddings] = useState<any[]>([]);
  const [biddingUsers, setBiddingUsers] = useState<string[]>([])

  useEffect(() => {
    socket = io(process.env.NEXT_PUBLIC_BACKEND_URL)
    socket.on('connect', () => {
    })

    socket.emit("joinAuction", auctionId);

    socket.on("newBid", (bid : any) => {
      console.log("New Bidding received: ", bid);
      setBiddings((prev) => [bid, ...prev]);
    });

    return () => {
      socket.emit("leaveAuction", auctionId);
      socket.disconnect();
    }
  }, [auctionId]);

  useEffect(() => {
    socket.on("biddingIndicator", ({userName, isBidding} : { userName : string, isBidding : boolean}) => {
      setBiddingUsers((prev) => {
        if (isBidding) {
          console.log("BIdding Users: ", biddingUsers);
          return prev.includes(userName) ? prev : [...prev, userName];
        } else {
          return prev.filter((u) => u !== userName)
        }
      })
    });

    return () => {
      socket.off("biddingIndicator")
    }
  }, [socket]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const fetchAuction = async () => {
      try {
        const response = await API.get(`/auctions/${auctionId}`);
        setAuction(response.data);
        setBiddings(response.data.biddings.sort((a : any, b : any) => b?.amount - a?.amount));
      } catch (err) {
        console.error("Error fetching the auction,", err);
      } finally {
        setLoading(false)
      }
    };
    
    fetchAuction();
  }, [auctionId]);

  useEffect(() => {
    if (!auction) return;
    const timer = setInterval(() => {
      
      const now = new Date();
      const end = new Date(auction.end_time);
      const diff = end.getTime() - now.getTime();
      
      if (diff <= 0) {
        setTimeRemaining('Finished');
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        setTimeRemaining(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [auction]);
  
  if (loading) return <p className="text-center mt-20">Loading All Auctions...</p>

  const handlePlaceBid = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userString = localStorage.getItem("user");
      const user = userString ? JSON.parse(userString) : null;
      const userId = user?.id;

      const response = await API.post("biddings", {
        auctionId, amount : Number(bidAmount), bidderId : userId
      });
      setBidAmount(response.data.amount);

    } catch (err) {

    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/auctions" className="inline-flex items-center text-purple-600 hover:text-purple-800 mb-6">
        <FaArrowLeft className="mr-2" /> Back to Auctions
      </Link>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="bg-gray-200 rounded-lg overflow-hidden h-80">
            <img 
              src={auction.item.imageURL} 
              alt={auction.item.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        
        {/* Details */}
        <div> 
          <div className={`inline-block text-white text-sm font-medium py-1 px-3 rounded-full mb-4 ${
            auction.status === 'finished' ? 'bg-gray-500' : 'bg-red-500'
          }`}>
            <FaClock className="inline mr-1" /> 
            {auction.status === 'finished' ? 'Auction Finished' : `Ends in: ${timeRemaining}`}
          </div>
          
          <h1 className="text-3xl font-bold mb-2">{auction.item.title}</h1>
          
          <div className="flex items-center text-gray-600 mb-6">
            <span>Seller :  {auction.item.seller.name}</span>
            <span className="mx-2">•</span>
            <span className="mx-2">•</span>
            <span>{auction.biddings.length} biddings</span>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <span className="text-sm text-gray-500">Current Bid</span>
                <div className="text-3xl font-bold text-purple-700">${biddings[0]?.amount.toLocaleString()}</div>
              </div>
              
              <div className="text-right">
                <span className="text-sm text-gray-500">Starting Price</span>
                {auction && (<div className="text-xl font-semibold">${auction?.starting_price?.toLocaleString() ?? 0}</div>)}
              </div>
            </div>
            
            {auction.status !== 'finished' && user?.role === "bidder" && (
              <>
              {/* Bidding Indicator */}
              <div className="text-sm text-gray-500 mb-2">
                {biddingUsers.length > 0 && biddingUsers.map((userName) => (
                  <p key={userName}>{userName} is bidding...</p>
                ))}
              </div>
              <form onSubmit={handlePlaceBid}>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    min={auction.current_price + 1}
                    step="1"
                    placeholder={`Enter $${auction.current_price + 1} or more`}
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    value={bidAmount}
                    onChange={(e) => {
                      setBidAmount(e.target.value);
                      if (e.target.value) {
                        socket.emit("startBidding", {auctionId, userName : user?.name})
                      } else {
                        socket.emit("stopBidding", {auctionId, userName : user?.name})
                      }
                    }} onBlur={() => socket.emit("stopBidding", {auctionId, userName : user?.name})}
                    required
                  />
                  <button 
                    type="submit"
                    className="justify-end bg-gradient-to-r from-purple-600 to-blue-500 text-white font-medium px-6 py-2 rounded-lg hover:from-purple-700 hover:to-blue-600 transition-all"
                  >
                    Place Bid
                  </button>
                </div>
              </form>
              </>
            )}
          </div>
          
          {/* Bids History */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Bid History</h2>
            
            {biddings.length === 0 ? (
              <p className="text-gray-500">No bids yet. Be the first to bid!</p>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                {biddings.map((bidding : any) => (
                  <div key={bidding.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                        <FaUser className="text-purple-600" />
                      </div>
                      <span className="font-medium">{bidding.bidder.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">${bidding.amount.toLocaleString()}</div>
                      <div className="text-sm text-gray-500">{formatDate(bidding.created_at)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuctionDetailPage() {
  return (
    <RolesProtectRoute allowedRoles={["bidder", "seller", "admin"]}>
      <AuctionDetailContent />
    </RolesProtectRoute>
  )
}