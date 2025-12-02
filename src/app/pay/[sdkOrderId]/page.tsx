"use client"

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { useParams, useRouter } from 'next/navigation';
import { hideLoader, showLoader } from '@/store/loadingSlice';
import { showError, showSuccess } from '@/utils/functions';
import CardService from '@/services/CardService';
import { renderAddCardForm, setUpCardTokenPayment, PaymentErrorResponse, AddCardData, encryptCard } from "@nebula-ltd/pok-payments-js";
import "@nebula-ltd/pok-payments-js/lib/index.css";
import GradientButton from '@/core/buttons/electrons/GradientButton';
import "@nebula-ltd/pok-payments-js/lib/index.css";

export default function PaymentPage() {

  const params = useParams();
  const sdkOrderId = params.sdkOrderId as string;
  const user = useSelector((state : RootState) => state.auth.user);
  const isLoading = useSelector((state: RootState) => state.loading.show);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();


  const [userCards, setUserCards] = useState<any[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Fetch user saved cards:
  const fetchUserCards = async () => {
    if (!user?.id) return;
    dispatch(showLoader("Loading saved cards..."));
    try {
      const cards = await CardService.listUserCards();
      setUserCards(cards || []);
    } catch (err) {
      console.error(err);
      showError("Failed to fetch saved cards.");
    } finally {
      dispatch(hideLoader());
    }

  }

  useEffect(() => {
    fetchUserCards()
  }, [user?.id]);

  const initializeAddCardForm = () => {
    renderAddCardForm(
      'add-card-form-container',
      'Save Card',
      async (cardPayload: AddCardData) => {
        try {
          dispatch(showLoader('Saving card...'));
          await CardService.tokenizeGuestCard(cardPayload);

          showSuccess('Card saved successfully!');
          await fetchUserCards();
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
          cardNumber: "",
          email: user?.email || "",
          expiration: "",
          securityCode: "",
          holdersName: `${user?.name}` || "",
          countryCode: "AL",
          address1: "",
          locality: "",
          administrativeArea: "",
          postalCode: "",
          phoneNumber: ""
        }
      }
    );
  };


  const handlePayWithCard = async () => {
    if (!selectedCardId) {
      showError("Please select a card to pay with!");
      return;
    }
    setPaymentError(null);
    dispatch(showLoader("Processing payment..."));

    try {
      const res = await CardService.  setupTokenized3DS({selectedCardId, sdkOrderId});
      const payerAuthentication = res;
      setUpCardTokenPayment({
        containerId: 'pay-by-token-container',
        orderId: sdkOrderId,
        payerAuthentication,
        onSuccess: () => {
          showSuccess('Payment successful!');
          router.push('/auctions'); // or success page
        },
        onError: (error: PaymentErrorResponse) => {
          console.error('Payment failed:', error);
          setPaymentError(error.message || 'Payment failed');
        },
        env: 'staging'
      });

    } catch (err) {
      console.error(err);
      // @ts-ignore
      setPaymentError(err.message || "Payment initialization failed!");
    } finally {
      dispatch(hideLoader());
    }
  }


  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Complete Your Payment</h2>

      <div className="mb-6">
        <h3 className="font-semibold mb-2">Saved Cards</h3>
        {userCards.length === 0 && <p>No saved cards yet.</p>}
        <ul className="space-y-2">
          {userCards.map((card) => (
            <li key={card.id} className="flex items-center gap-3">
              <input
                type="radio"
                name="selectedCard"
                checked={selectedCardId === card.pokCardId}
                onChange={async () => {
                  setSelectedCardId(card.pokCardId);

                  try {
                    dispatch(showLoader("Setting default card..."));
                    await CardService.setDefaultCard(card.id);
                    showSuccess("Default card set successfully!");

                    setUserCards((prev) =>
                      prev.map((c) => ({
                        ...c,
                        isDefault: c.id === card.id,
                      }))
                    );
                  } catch (err) {
                    console.error(err);
                    showError("Failed to set default card.");
                  } finally {
                    dispatch(hideLoader());
                  }
                }}
              />
              <span>
        {card.hiddenNumber} - {card.cardType}{" "}
                {card.isDefault && <strong>(Default)</strong>}
      </span>
            </li>
          ))}
        </ul>

      </div>

      <div className="mb-6">
        <button
          onClick={initializeAddCardForm}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          Add New Card
        </button>
        <div id="add-card-form-container" className="mt-3"></div>
      </div>

      {paymentError && (
        <p className="text-red-500 mb-2">{paymentError}</p>
      )}

      <div className="mb-6">
        <GradientButton
          label="Pay Now"
          isLoading={isLoading}
          type="button"
          onClick={handlePayWithCard}
          fromColor="from-purple-600"
          toColor="to-blue-500"
        />
      </div>

      <div id="pay-by-token-container"></div>
    </div>
  );
}