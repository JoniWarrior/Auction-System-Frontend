'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { FaClock, FaArrowLeft, FaExclamationTriangle } from 'react-icons/fa';
import Image from 'next/image';
import { io } from 'socket.io-client';
import BiddingHistory from './BiddingHistory';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { showError, showSuccess } from '@/utils/functions';
import AuctionService from '@/services/AuctionService';
import { hideLoader, showLoader } from '@/store/loadingSlice';
import useAuctionCountDown from '@/utils/hooks/AuctionCountdown';
import useUserCards from '@/utils/hooks/useUserCards';
import {
  renderAddCardForm,
  setUpCardTokenPayment,
  PaymentErrorResponse,
  AddCardData
} from '@nebula-ltd/pok-payments-js';
import '@nebula-ltd/pok-payments-js/lib/index.css';
import CardService from '@/services/CardService';
import BiddingService from '@/services/BiddingService';
import AuctionSelectCard from '@/components/auctions/AuctionSelectCard';
import BidForm from '@/components/auctions/BidForm';
import AuctionLiveInfo from '@/components/auctions/AuctionLiveInfo';

let socket: any;
let socketInitialized = false;

export function AuctionDetailContent() {
  const params = useParams();
  const auctionId = params.id as string;
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state?.auth?.user);

  const [auction, setAuction] = useState<any>(null);
  const timeRemaining = useAuctionCountDown(auction?.endTime);
  const [bidAmount, setBidAmount] = useState('');
  const [biddings, setBiddings] = useState<any[]>([]);
  const [biddingUsers, setBiddingUsers] = useState<string[]>([]);
  const [outBidNotification, setOutBidNotification] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAddCardForm, setShowAddCardForm] = useState(false);
  const [showCardSelection, setShowCardSelection] = useState(false);

  const { defaultCard, hasDefaultCard, cards: userCards, refresh } = useUserCards();

  // Socket initialization
  useEffect(() => {
    if (!socketInitialized && user?.id) {
      socket = io(process.env.NEXT_PUBLIC_BACKEND_URL, {
        query: { userId: user?.id }
      });
      socketInitialized = true;

      socket.on('outBid', (notification: any) => {
        setOutBidNotification(notification.message ?? 'You were outbid!');
        setTimeout(() => setOutBidNotification(null), 5000);
      });
    }

    return () => {
      if (socket) {
        socket.disconnect();
        socketInitialized = false;
      }
    };
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id || !auctionId || !socket) return;

    socket.emit('joinAuction', auctionId);

    const handleNewBid = (bid: any) => {
      setBiddings((prev) => [bid, ...prev]);
      setAuction((prev: any) => ({ ...prev, currentPrice: bid.amount }));
    };

    const handleBiddingIndicator = ({
      userName,
      isBidding
    }: {
      userName: string;
      isBidding: boolean;
    }) => {
      setBiddingUsers((prev) =>
        isBidding
          ? prev.includes(userName)
            ? prev
            : [...prev, userName]
          : prev.filter((u) => u !== userName)
      );
      console.log("Bidding Users: ",biddingUsers);
    };

    socket.on('newBid', handleNewBid);
    socket.on('biddingIndicator', handleBiddingIndicator);

    return () => {
      socket.emit('leaveAuction', auctionId);
      socket.off('newBid', handleNewBid);
      socket.off('biddingIndicator', handleBiddingIndicator);
    };
  }, [auctionId, user?.id, socket]);

  // Fetch auction data
  const fetchAuction = async () => {
    if (!auctionId) return;
    dispatch(showLoader('Loading auction...'));
    try {
      const response = await AuctionService.getSingleAuction(auctionId);
      setAuction(response);
      setBiddings(response.biddings?.sort((a: any, b: any) => b.amount - a.amount) || []);
    } catch (err) {
      console.error('Error fetching the auction:', err);
      showError('Failed to load auction details');
    } finally {
      dispatch(hideLoader());
    }
  };

  useEffect(() => {
    fetchAuction();
  }, [auctionId]);

  // Initialize add card form
  const initializeAddCardForm = () => {
    const container = document.getElementById('add-card-form-container');
    if (!container) return;

    container.innerHTML = '';

    renderAddCardForm(
      'add-card-form-container',
      'Save Card',
      async (cardPayload: AddCardData) => {
        try {
          dispatch(showLoader('Saving card...'));
          await CardService.tokenizeGuestCard(cardPayload);
          showSuccess('Card saved successfully!');
          setShowAddCardForm(false);
        } catch (err) {
          console.error(err);
          showError('Failed to save card');
        } finally {
          dispatch(hideLoader());
        }
      },
      (error: PaymentErrorResponse) => {
        console.error('Add card failed', error);
        showError(error.message || 'Card saving failed');
      },
      {
        env: 'staging',
        locale: 'al',
        initialState: {
          cardNumber: '',
          email: user?.email || '',
          expiration: '',
          securityCode: '',
          holdersName: user?.name || '',
          countryCode: 'AL',
          address1: '',
          locality: '',
          administrativeArea: '',
          postalCode: '',
          phoneNumber: ''
        }
      }
    );
  };

  useEffect(() => {
    if (showAddCardForm) {
      setTimeout(() => {
        initializeAddCardForm();
      }, 100);
    }
  }, [showAddCardForm]);

  const processPayment = async () => {
    if (!defaultCard) {
      showError('No payment method found. Please add a card first.');
      return false;
    }
    setIsProcessing(true);
    setPaymentError(null);
    dispatch(showLoader('Processing payment...'));

    try {
      // First cretae the bid // not like this, confirm payment then create bid + transaction
      const bidResponse = await BiddingService.placeBid({
        auctionId,
        amount: Number(bidAmount)
      });

      const sdkOrderId = bidResponse?.data?.data?.transaction?.sdkOrderId;

      if (!sdkOrderId) {
        showError('Payment initialization failed');
        setIsProcessing(false);
        return false;
      }

      // Then process payment with the bid's sdkOrderId
      const res = await CardService.setupTokenized3DS({
        selectedCardId: defaultCard.pokCardId,
        sdkOrderId
      });

      const payerAuthentication = res;

      setUpCardTokenPayment({
        containerId: 'payment-processor-container',
        orderId: sdkOrderId,
        payerAuthentication,
        onSuccess: () => {
          showSuccess('Payment successful!');
          fetchAuction();
          setBidAmount('');
        },
        onError: (error: PaymentErrorResponse) => {
          console.error('Payment failed:', error);
          setPaymentError(error.message || 'Payment failed. Please try again.');
          showError('Payment failed. Please try again.');
        },
        env: 'staging'
      });

      return true;
    } catch (err: any) {
      console.error('Payment processing error:', err);
      return false;
    } finally {
      setIsProcessing(false);
      dispatch(hideLoader());
    }
  };

  // Place bid
  const handlePlaceBid = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.id) {
      showError('Please login to place a bid');
      return;
    }

    const bidValue = Number(bidAmount);
    if (isNaN(bidValue) || bidValue <= 0) {
      showError('Please enter a valid bid amount');
      return;
    }
    if (auction?.item?.seller?.id === user.id) {
      showError('You cannot bid on your own auction');
      return;
    }
    if (!hasDefaultCard) {
      showError('Please add a payment method first');
      setShowAddCardForm(true);
      return;
    }
    await processPayment();
  };

  // Set card as default
  const handleSetAsDefault = async (cardId: string) => {
    try {
      await CardService.setDefaultCard(cardId);
      showSuccess('Default card set successfully!');
      setShowCardSelection(false);
      await refresh();
    } catch (err) {
      console.error(err);
      showError('Failed to set default card.');
    } finally {
      dispatch(hideLoader());
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back button */}
      <Link
        href="/auctions"
        className="inline-flex items-center text-purple-600 hover:text-purple-800 mb-6 transition-colors hover:underline">
        <FaArrowLeft className="mr-2" /> Back to Auctions
      </Link>

      {/* Notifications */}
      {outBidNotification && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
          <div className="flex items-center gap-2">
            <FaExclamationTriangle />
            <span>{outBidNotification}</span>
          </div>
        </div>
      )}

      {/* Main content grid */}
      <div className="flex space-x-8">
        {/* Left side: Image */}
        <div className="space-y-6 w-2/5">
          <div className="space-y-3">
            <div className="relative flex justify-center h-96 w-96 bg-gray-100 rounded-2xl overflow-hidden shadow-lg">
              {auction?.item?.imageURL ? (
                <Image
                  src={auction.item.imageURL}
                  alt={auction?.item?.title || 'Auction item'}
                  fill
                  className="object-cover object-contain"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  No image available
                </div>
              )}
            </div>

            {/* Bidding indicators */}
            {/*Bidding indicator component*/}
            {biddingUsers.length > 0 && (
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                <div className="flex items-center gap-2">
                  <div className="flex items-center -space-x-2">
                    {biddingUsers.slice(0, 3).map((user, index) => (
                      <div
                        key={index}
                        className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white">
                        {user.charAt(0).toUpperCase()}
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="text-sm text-blue-700 font-medium">
                      {biddingUsers.length} active bidder{biddingUsers.length !== 1 ? 's' : ''}
                    </p>
                    <p className="text-xs text-blue-600">Currently bidding on this item</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Bidding History</h3>
              <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">
                {biddings.length} {biddings.length === 1 ? 'bid' : 'bids'}
              </span>
            </div>
            {biddings.length > 0 ? (
              <BiddingHistory biddings={biddings} />
            ) : (
              <div className="text-center py-12 bg-white rounded-2xl shadow">
                <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <FaClock className="text-2xl text-gray-400" />
                </div>
                <h4 className="text-lg font-semibold  text-gray-900 mb-2">No bids yet</h4>
                <p className="text-gray-500">Be the first to place a bid on this item!</p>
              </div>
            )}
          </div>
        </div>

        {/* Right side: Auction details */}
        <div className="flex flex-col w-full space-y-6">
          {/* Auction title and description */}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              {auction?.item?.title || 'Loading...'}
            </h1>
          </div>

          {/* Auction status */}
          <AuctionLiveInfo timeRemaining={timeRemaining} auction={auction} />

          <AuctionSelectCard
            user={user}
            hasDefaultCard={hasDefaultCard}
            showAddCardForm={showAddCardForm}
            setShowAddCardForm={setShowAddCardForm}
            showCardSelection={showCardSelection}
            setShowCardSelection={setShowCardSelection}
            defaultCard={defaultCard}
            userCards={userCards}
            paymentError={paymentError}
            handleSetAsDefault={handleSetAsDefault}
          />

          {/* Bid form */}
          <BidForm
            handlePlaceBid={handlePlaceBid}
            bidAmount={bidAmount}
            setBidAmount={setBidAmount}
            auction={auction}
            user={user}
            isProcessing={isProcessing}
            hasDefaultCard={hasDefaultCard}
          />
        </div>
      </div>
      <div id="payment-processor-container" className="hidden"></div>
    </div>
  );
}
