"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { FaBoxOpen, FaPlus, FaSearch } from "react-icons/fa";
import API from "@/utils/API/API";

export default function MyEmptyItemsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchEmptyItems = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await API.get("items/my-empty-items", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setItems(response.data);
    } catch (err) {
      console.error("Error fetching empty items", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmptyItems();
  }, []);

  const filteredItems = useMemo(
    () =>
      items.filter((item) => {
        const matchesSearch =
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesSearch;
      }),
    [items, searchTerm]
  );

  return loading ? (
    <p className="text-center mt-20">Loading your empty items...</p>
  ) : (
    <div className="container mx-auto px-4 py-8">
      {/* Top section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-3xl font-bold mb-4 md:mb-0">My Empty Items</h1>

        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search items..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <div className="text-center py-12">
          <FaBoxOpen className="mx-auto text-5xl text-gray-400 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-600">
            No empty items found
          </h2>
          <p className="text-gray-500 mt-2">
            Start by creating items that are not linked to auctions yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="h-48 bg-gray-200">
                <img
                  src={item.imageURL}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-lg truncate">{item.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {item.description}
                </p>

                <Link
                  href={`/auctions/create/${item.id}`}
                  className="w-full bg-gradient-to-r from-green-600 to-teal-500 text-white font-medium py-2 rounded-lg hover:from-green-700 hover:to-teal-600 transition-all flex items-center justify-center gap-2"
                >
                  <FaPlus /> Create Auction
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
