import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { FaClock, FaArrowLeft } from "react-icons/fa";
import API from "@/utils/API/API";
import { io } from "socket.io-client";
import BiddingHistory from "./BiddingHistory";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { showError } from "@/utils/functions";
import axios from "axios";

let socket: any;
let socketInitialized = false;

export default function AuctionDetailContent() {
  const params = useParams();
  const auctionId = params.id;
  const [auction, setAuction] = useState<any>();
  const [bidAmount, setBidAmount] = useState("");
  const [timeRemaining, setTimeRemaining] = useState("");

  const [loading, setLoading] = useState(true);
  const [biddings, setBiddings] = useState<any[]>([]);
  const [biddingUsers, setBiddingUsers] = useState<string[]>([]);
  const [outBidNotification, setOutBidNotification] = useState<string | null>(
    null
  );
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (!socketInitialized) {
      socket = io(process.env.NEXT_PUBLIC_BACKEND_URL, {
        query: { userId: user?.id },
      });
      socketInitialized = true;

      socket.on("outBid", (notification: any) => {
        const bid = notification.bidding;
        const bidderName = bid?.bidder?.name ?? "Unknown";

        setOutBidNotification(`${notification.message ?? "You were outbid!"}`);

        setTimeout(() => setOutBidNotification(null), 5000);
      });
    }

    return () => {};
  }, []);

  useEffect(() => {
    if (!user?.id || !auctionId || !socket) return;

    socket.emit("joinAuction", auctionId);

    const handleNewBid = (bid: any) => {
      setBiddings((prev) => [bid, ...prev]);
    };

    const handleBiddingIndicator = ({
      userName,
      isBidding,
    }: {
      userName: string;
      isBidding: boolean;
    }) => {
      setBiddingUsers((prev) => {
        return isBidding
          ? prev.includes(userName)
            ? prev
            : [...prev, userName]
          : prev.filter((u) => u !== userName);
      });
    };

    socket.on("newBid", handleNewBid);
    socket.on("biddingIndicator", handleBiddingIndicator);

    return () => {
      socket.emit("leaveAuction", auctionId);
      socket.off("newBid", handleNewBid);
      socket.off("biddingIndicator", handleBiddingIndicator);
    };
  }, [auctionId, user?.id]);

  const fetchAuction = async () => {
    try {
      const response = await API.get(`/auctions/${auctionId}`);
      setAuction(response.data.data);
      setBiddings(
        response.data.data.biddings.sort(
          (a: any, b: any) => b?.amount - a?.amount
        )
      );
    } catch (err) {
      console.error("Error fetching the auction,", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuction();
  }, [auctionId]);

  useEffect(() => {
    if (!auction) return;
    const timer = setInterval(() => {
      const now = new Date();
      const end = new Date(auction.endTime);
      const diff = end.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeRemaining("Finished");
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        setTimeRemaining(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [auction]);

  const handlePlaceBid = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userId = user?.id;

      if (auction.item.seller?.id === userId) {
        showError("You cannot bid on your own auction");
        return;
      }

      const response = await API.post("biddings", {
        auctionId,
        amount: Number(bidAmount),
        bidderId: userId,
      });

      setBidAmount("");
      if (auction) {
        setAuction({ ...auction, currentPrice: response.data.data.amount });
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        // @ts-ignore
        showError(err.response.data.message);
      }
      console.error("Error placing bid:", err);
    } finally {
      setLoading(false);
    }
  };

  return loading ? (
    <p className="text-center mt-20">Loading All Auctions...</p>
  ) : (
    <div className="container mx-auto px-4 py-8">
      <Link
        href="/auctions"
        className="inline-flex items-center text-purple-600 hover:text-purple-800 mb-6"
      >
        <FaArrowLeft className="mr-2" /> Back to Auctions
      </Link>

      {/* Outbid notification */}
      {outBidNotification && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded shadow-lg z-50">
          {outBidNotification}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="bg-gray-200 rounded-lg overflow-hidden h-80">
            <img
              src={auction?.item.imageURL}
              alt={auction?.item.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Details */}
        <div>
          <div
            className={`inline-block text-white text-sm font-medium py-1 px-3 rounded-full mb-4 ${
              auction?.status === "finished" ? "bg-gray-500" : "bg-red-500"
            }`}
          >
            <FaClock className="inline mr-1" />
            {auction?.status === "finished"
              ? "Auction Finished"
              : `Ends in: ${timeRemaining}`}
          </div>

          <h1 className="text-3xl font-bold mb-2">{auction?.item.title}</h1>

          <div className="flex items-center text-gray-600 mb-6">
            <span>Seller : {auction?.item.seller.name}</span>
            <span className="mx-2">•</span>
            <span className="mx-2">•</span>
            <span>{auction?.biddings.length} biddings</span>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <span className="text-sm text-gray-500">Current Bid</span>
                <div className="text-3xl font-bold text-purple-700">
                  ${biddings[0]?.amount.toLocaleString()}
                </div>
              </div>

              <div className="text-right">
                <span className="text-sm text-gray-500">Starting Price</span>
                <div className="text-xl font-semibold">
                  ${auction?.startingPrice?.toLocaleString() ?? 0}
                </div>
              </div>
            </div>

            {auction?.status !== "finished" &&
              auction?.item.seller?.id !== user?.id && (
                <>
                  {/* Bidding Indicator */}
                  <div className="text-sm text-gray-500 mb-2">
                    {biddingUsers.length > 0 &&
                      biddingUsers.map((userName) => (
                        <p key={userName}>{userName} is bidding...</p>
                      ))}
                  </div>
                  <form onSubmit={handlePlaceBid}>
                    <div className="flex space-x-2">
                      <input
                        type="number"
                        min={auction.currentPrice + 1}
                        step="1"
                        placeholder={`Enter $${
                          auction.currentPrice + 1
                        } or more`}
                        className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        value={bidAmount}
                        onChange={(e) => {
                          setBidAmount(e.target.value);
                          if (e.target.value) {
                            socket.emit("startBidding", {
                              auctionId,
                              userName: user?.name,
                            });
                          } else {
                            socket.emit("stopBidding", {
                              auctionId,
                              userName: user?.name,
                            });
                          }
                        }}
                        onBlur={() =>
                          socket.emit("stopBidding", {
                            auctionId,
                            userName: user?.name,
                          })
                        }
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
          <BiddingHistory biddings={biddings} />
        </div>
      </div>
    </div>
  );
}
