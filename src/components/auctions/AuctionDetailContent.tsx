'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft, FaClock, FaExclamationTriangle } from 'react-icons/fa';
import Image from 'next/image';
import BiddingHistory, { Bidding } from './BiddingHistory';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { showError, showSuccess } from '@/utils/functions';
import AuctionService from '@/services/AuctionService';
import { hideLoader, showLoader } from '@/store/loadingSlice';
import useAuctionCountDown from '@/utils/hooks/AuctionCountdown';
import useUserCards from '@/utils/hooks/useUserCards';
import {
  AddCardData,
  PaymentErrorResponse,
  renderAddCardForm,
  setUpCardTokenPayment
} from '@nebula-ltd/pok-payments-js';
import '@nebula-ltd/pok-payments-js/lib/index.css';
import CardService from '@/services/CardService';
import BiddingService from '@/services/BiddingService';
import AuctionSelectCard from '@/components/auctions/AuctionSelectCard';
import BidForm from '@/components/auctions/BidForm';
import AuctionLiveInfo from '@/components/auctions/AuctionLiveInfo';
import { useAuctionSocket } from '@/utils/hooks/useAuctionSocket';
import TransactionService from '@/services/TransactionService';

let socket: any;

export function AuctionDetailContent() {
  const params = useParams();
  const auctionId = params.id as string;
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state?.auth?.user);

  const [auction, setAuction] = useState<any>(null);
  const timeRemaining = useAuctionCountDown(auction?.endTime);
  const [bidAmount, setBidAmount] = useState('');
  const [biddings, setBiddings] = useState<Bidding[]>([]);
  const [biddingUsers, setBiddingUsers] = useState<string[]>([]);
  const [outBidNotification, setOutBidNotification] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAddCardForm, setShowAddCardForm] = useState(false);
  const [showCardSelection, setShowCardSelection] = useState(false);
  const [paymentCurrency, setPaymentCurrency] = useState<'ALL' | 'EUR'>('ALL');

  const { defaultCard, hasDefaultCard, cards: userCards, refresh } = useUserCards();

  // Socket initialization
  socket = useAuctionSocket({
    user,
    auctionId,
    setBiddings,
    setAuction,
    biddingUsers,
    setBiddingUsers,
    setOutBidNotification
  });

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
      console.log('hideLoader 1');
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
          await refresh();
          showSuccess('Card saved successfully!');
          setShowAddCardForm(false);
        } catch (err) {
          console.error(err);
          showError('Failed to save card');
        } finally {
          console.log('hideLoader 2');
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

  const processPayment = async (bidValue: number, transaction: any) => {
    if (!defaultCard) {
      showError('No payment method found. Please add a card first.');
      return false;
    }
    setIsProcessing(true);
    setPaymentError(null);
    // dispatch(showLoader('Processing payment...'));

    const sdkOrderId = transaction?.sdkOrderId;
    // 1. Call setUpTokenized3DS :
    const res = await CardService.setupTokenized3DS({
      selectedCardId: defaultCard.pokCardId,
      sdkOrderId
    });
    const payerAuthentication = res;
    setUpCardTokenPayment({
      containerId: 'payment-processor-container',
      orderId: sdkOrderId,
      payerAuthentication,
      onSuccess: async () => {
        try {
          const bidResponse = await BiddingService.placeBid({
            auctionId,
            transactionId: transaction?.id,
            amount: bidValue
          });
          await TransactionService.updateAndCancelTransaction({
            previousTransaction: bidResponse?.previousTransaction, // sdkOrderId checked V
            currentTransaction: transaction?.id, // normal ID of DB checked V
            bidding: bidResponse?.bidding // object checked V
          });
          showSuccess('Payment successful!');
          await fetchAuction();
          setBidAmount('');
        } catch (error: any) {
          console.error('Payment processing error:', error);
        } finally {
          console.log('po tani?');
          dispatch(hideLoader());
        }
      },
      onError: (error: PaymentErrorResponse) => {
        console.error('Payment failed:', error);
        setPaymentError(error.message || 'Payment failed. Please try again.');
        showError('Payment failed. Please try again.');
      },
      env: 'staging'
    });

    return true;
  };

  // Place bid
  const handlePlaceBid = async (e: React.FormEvent, currency: 'ALL' | 'EUR') => {
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
    dispatch(showLoader('Placing bid...'));
    let newTransaction;
    try {
      newTransaction = await TransactionService.createTransaction({
        amount: bidValue,
        auctionId,
        paymentCurrency: currency
      });
      if (bidValue <= auction?.currentPrice) {
        showError(`Bid must be higher than highest Bid`)
        dispatch(hideLoader());
        return;
      }
    } catch (err: any) {
      console.error('Backend error:', err.response?.data.message || err.message || err);
      showError(err.response?.data?.message || 'Failed to place bid. Please try again.');
      dispatch(hideLoader());
      return;
    }



    const paymentSuccess = await processPayment(bidValue, newTransaction);
    setIsProcessing(false);
    if (!paymentSuccess) {
      showError('Payment failed');
      return;
    }
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
      console.log('hideLoader 4');
      dispatch(hideLoader());
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
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
      <div className="flex sm:flex-row flex-col space-x-6">
        <div className="space-y-1 sm:w-2/5 w-full">
          <div className="space-y-3 justify-center items-center flex flex-col">
            <div className="relative w-full sm:max-w-sm md:max-w-md lg:w-65 aspect-square sm:aspect-video md:aspect-[4/3] bg-gray-100 rounded-2xl md:rounded-3xl overflow-hidden shadow-md mx-auto">
              {auction?.item?.imageURL ? (
                <Image
                  src={auction.item.imageURL}
                  alt={auction?.item?.title || 'Auction item'}
                  fill
                  className="object-cover object-contain"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 80vw, (max-width: 1024px) 60vw, 400px"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-sm sm:text-base">
                  No image available
                </div>
              )}
            </div>
            {/* Bidding indicators */}
            {biddingUsers.length > 0 && (
              <div className="flex items-center gap-2 text-blue-700 font-medium mb-2">
                <div className="h-3 w-3 rounded-full bg-red-700 animate-pulse"></div>
                <span>
                  {biddingUsers.length === 1
                    ? `${biddingUsers[0]} is bidding...`
                    : `${biddingUsers.join(', ')} are bidding...`}
                </span>
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
        <div className="flex flex-col sm:w-3/4 w-full space-y-6">
          {/* Auction title and description */}
          <div className="w-full max-w-3xl flex flex-col items-center">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              {auction?.item?.title || 'Loading...'}
            </h1>
          </div>

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

          {auction?.status !== 'finished' && auction?.item?.seller?.id !== user?.id ? (
            <BidForm
              handlePlaceBid={handlePlaceBid}
              bidAmount={bidAmount}
              setBidAmount={setBidAmount}
              auction={auction}
              user={user}
              isProcessing={isProcessing}
              hasDefaultCard={hasDefaultCard}
              socket={socket}
              paymentCurrency={paymentCurrency}
              setPaymentCurrency={setPaymentCurrency}
            />
          ) : (
            <span className="text-center text-gray-500">
              {auction?.status === 'finished'
                ? 'Auction has finished'
                : 'You cannot bid on your own auction'}
            </span>
          )}
        </div>
      </div>
      <div id="payment-processor-container"></div>
    </div>
  );
}
