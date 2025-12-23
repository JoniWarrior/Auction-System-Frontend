'use client';

import { FaGavel, FaGem, FaShieldAlt, FaUsers, FaTrophy, FaHeart, FaStar } from 'react-icons/fa';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-blue-300">
              About Auction House
            </h1>
            <p className="text-xl mb-8 text-gray-200">
              Where extraordinary finds meet passionate collectors. We bring the excitement of live auctions to your fingertips.
            </p>
            <div className="flex justify-center space-x-4">
              <Link 
                href="/auctions" 
                className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-blue-600 transition-all shadow-lg"
              >
                Explore Auctions
              </Link>
              <Link 
                href="/sell" 
                className="border-2 border-purple-400 text-purple-300 px-6 py-3 rounded-lg font-semibold hover:bg-purple-400 hover:text-gray-900 transition-all"
              >
                Start Selling
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <div className="bg-gradient-to-br from-gray-700 to-gray-800 p-8 rounded-2xl shadow-xl border border-gray-700">
                <h2 className="text-3xl font-bold text-purple-300 mb-4">Our Story</h2>
                <p className="text-gray-300 mb-4">
                  Founded in 2015, Auction House began as a small passion project for art and antique enthusiasts. 
                  What started as a local community for collectors has grown into a premier online auction platform 
                  connecting buyers and sellers from around the world.
                </p>
                <p className="text-gray-300">
                  Our mission is to democratize the auction experience, making it accessible to everyone while 
                  maintaining the excitement and prestige of traditional live auctions. We combine cutting-edge 
                  technology with expert curation to bring you the most extraordinary items.
                </p>
              </div>
            </div>
            <div className="md:w-1/2 md:pl-12">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-700 p-6 rounded-2xl shadow-md border border-gray-600 hover:border-purple-500 transition-colors">
                  <div className="text-4xl text-purple-400 mb-3">
                    <FaGavel />
                  </div>
                  <h3 className="font-semibold text-lg mb-2 text-white">500K+</h3>
                  <p className="text-gray-300">Auctions Completed</p>
                </div>
                <div className="bg-gray-700 p-6 rounded-2xl shadow-md border border-gray-600 hover:border-blue-500 transition-colors">
                  <div className="text-4xl text-blue-400 mb-3">
                    <FaUsers />
                  </div>
                  <h3 className="font-semibold text-lg mb-2 text-white">250K+</h3>
                  <p className="text-gray-300">Active Users</p>
                </div>
                <div className="bg-gray-700 p-6 rounded-2xl shadow-md border border-gray-600 hover:border-purple-500 transition-colors">
                  <div className="text-4xl text-purple-400 mb-3">
                    <FaGem />
                  </div>
                  <h3 className="font-semibold text-lg mb-2 text-white">$380M+</h3>
                  <p className="text-gray-300">In Sales</p>
                </div>
                <div className="bg-gray-700 p-6 rounded-2xl shadow-md border border-gray-600 hover:border-blue-500 transition-colors">
                  <div className="text-4xl text-blue-400 mb-3">
                    <FaHeart />
                  </div>
                  <h3 className="font-semibold text-lg mb-2 text-white">98%</h3>
                  <p className="text-gray-300">Satisfaction Rate</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-2xl bg-gradient-to-b from-gray-800 to-gray-900 border border-gray-700 hover:border-purple-500 transition-all hover:shadow-xl">
              <div className="bg-purple-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-purple-700">
                <FaShieldAlt className="text-2xl text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Trust & Security</h3>
              <p className="text-gray-400">
                We verify all items and users to ensure a safe, transparent auction environment. Your transactions are protected with bank-level security.
              </p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-gradient-to-b from-gray-800 to-gray-900 border border-gray-700 hover:border-blue-500 transition-all hover:shadow-xl">
              <div className="bg-blue-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-700">
                <FaTrophy className="text-2xl text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Excellence</h3>
              <p className="text-gray-400">
                We curate only the finest items and provide an exceptional bidding experience. Quality is at the heart of everything we do.
              </p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-gradient-to-b from-gray-800 to-gray-900 border border-gray-700 hover:border-purple-500 transition-all hover:shadow-xl">
              <div className="bg-purple-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-purple-700">
                <FaUsers className="text-2xl text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Community</h3>
              <p className="text-gray-400">
                We foster a vibrant community of collectors, enthusiasts, and experts who share a passion for unique and valuable items.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">What Our Users Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-700 p-6 rounded-2xl border border-gray-600">
              <div className="flex text-yellow-400 mb-3">
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
              </div>
              <p className="text-gray-300 italic mb-4">
                "I've found incredible pieces for my collection that I never would have had access to otherwise. The live bidding feature is exhilarating!"
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-purple-500 rounded-full mr-3"></div>
                <div>
                  <p className="text-white font-medium">James Collector</p>
                  <p className="text-gray-400 text-sm">Art Enthusiast</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-700 p-6 rounded-2xl border border-gray-600">
              <div className="flex text-yellow-400 mb-3">
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
              </div>
              <p className="text-gray-300 italic mb-4">
                "As a seller, I've achieved prices far beyond my expectations. The platform is professional and the audience is truly global."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-500 rounded-full mr-3"></div>
                <div>
                  <p className="text-white font-medium">Sarah Dealer</p>
                  <p className="text-gray-400 text-sm">Antique Seller</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-700 p-6 rounded-2xl border border-gray-600">
              <div className="flex text-yellow-400 mb-3">
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
              </div>
              <p className="text-gray-300 italic mb-4">
                "The authentication process gives me confidence in every purchase. I know I'm getting exactly what's described."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-purple-500 rounded-full mr-3"></div>
                <div>
                  <p className="text-white font-medium">Michael Investor</p>
                  <p className="text-gray-400 text-sm">Collector & Investor</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">How It Works</h2>
          <div className="flex flex-col md:flex-row justify-between items-start">
            <div className="flex-1 text-center p-6 group">
              <div className="bg-gradient-to-b from-purple-900 to-blue-900 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg border border-purple-700 group-hover:scale-110 transition-transform">
                <span className="text-2xl font-bold text-purple-300">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Discover</h3>
              <p className="text-gray-400">
                Browse our curated collections of rare antiques, fine art, collectibles, and unique items from around the world.
              </p>
            </div>
            <div className="flex-1 text-center p-6 group">
              <div className="bg-gradient-to-b from-blue-900 to-purple-900 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg border border-blue-700 group-hover:scale-110 transition-transform">
                <span className="text-2xl font-bold text-blue-300">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Bid</h3>
              <p className="text-gray-400">
                Participate in live auctions or place automatic bids. Get real-time notifications so you never miss out.
              </p>
            </div>
            <div className="flex-1 text-center p-6 group">
              <div className="bg-gradient-to-b from-purple-900 to-blue-900 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg border border-purple-700 group-hover:scale-110 transition-transform">
                <span className="text-2xl font-bold text-purple-300">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Win & Collect</h3>
              <p className="text-gray-400">
                Secure your winning item with our protected payment system and enjoy global delivery to your doorstep.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto bg-gray-800 bg-opacity-40 p-8 rounded-2xl border border-gray-700 backdrop-blur-sm">
            <h2 className="text-4xl font-bold mb-6 text-white">Ready to Join the Auction?</h2>
            <p className="text-xl mb-8 text-gray-200">
              Become part of our growing community of collectors and discover unique treasures from around the world.
            </p>
            <div className="flex justify-center space-x-4">
              <Link 
                href="/signup"
                className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-blue-600 transition-all shadow-lg"
              >
                Create Account
              </Link>

              <Link 
                href="/auctions" 
                className="border-2 border-purple-400 text-purple-300 px-8 py-3 rounded-lg font-semibold hover:bg-purple-400 hover:text-gray-900 transition-all"
              >
                Browse Auctions
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}