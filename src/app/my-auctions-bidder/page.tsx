"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { FaClock, FaSearch, FaFilter } from "react-icons/fa";
import API from "@/utils/API/API";

export default function MyAuctionsPage() {
  const [auctions, setAuctions] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ role?: string } | null>(null);

  useEffect(() => {
    const userStored = localStorage.getItem("user");
    if (userStored) {
      setUser(JSON.parse(userStored));
    }
  }, []);

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const response = await API.get("/auctions/my-auctions-as-bidder");
        setAuctions(response.data);
      } catch (err) {
        console.error("Error fetching the data ", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAuctions();
  }, []);

  const filteredAuctions = useMemo(
    () =>
      auctions.filter((auction) => {
        const matchesFilter = filter === "all" || auction.status === filter;
        const matchesSearch =
          auction.item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          auction.item.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
      }),
    [auctions, searchTerm, filter]
  );

  return loading ? (
    <p className="text-center mt-20">Loading All Auctions...</p>
  ) : (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-3xl font-bold mb-4 md:mb-0"> </h1>

        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search auctions..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>

          <div className="flex items-center space-x-2">
            <FaFilter className="text-gray-500" />
            <select
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Auctions</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="finished">Finished</option>
            </select>
          </div>
        </div>
      </div>

      {filteredAuctions.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-600">
            No auctions found
          </h2>
          <p className="text-gray-500 mt-2">
            Try adjusting your search or filter criteria
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAuctions.map((auction) => (
            <div
              key={auction.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="h-48 bg-gray-200 relative">
                <img
                  src={auction.item.imageURL}
                  alt={auction.item.title}
                  className="w-full h-full object-cover"
                />
                <div
                  className={`absolute top-4 left-4 text-white text-sm font-medium py-1 px-3 rounded-full ${
                    auction.status !== "finished"
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                >
                  <FaClock className="inline mr-1" />{" "}
                  {auction.status !== "finished"
                    ? new Date(auction.end_time).toLocaleString()
                    : "Finished"}
                </div>
              </div>

              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg truncate">
                    {auction.item.title}
                  </h3>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    By {auction?.item?.seller?.name}
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {auction.item.description}
                </p>

                <div className="flex justify-between items-center mb-3">
                  <div>
                    <span className="text-sm text-gray-500">Current bid</span>
                    <span className="text-2xl font-bold text-purple-700 block">
                      ${auction.current_price.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-gray-500">Current Price</span>
                    <span className="text-lg font-semibold block">
                      ${auction.current_price.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                  <span>{auction.biddings.length} bids</span>
                  {/* <span>{auction.watchlist} watching</span> */}
                </div>

                <Link
                  href={`/auctions/${auction.id}`}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white font-medium py-2 rounded-lg hover:from-purple-700 hover:to-blue-600 transition-all flex items-center justify-center"
                >
                  {auction.status === "finished" || user?.role === "seller"
                    ? "View Results"
                    : "Place Bid"}
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
