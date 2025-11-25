"use client";

import { renderForm } from "@nebula-ltd/pok-payments-js";
import "@nebula-ltd/pok-payments-js/lib/index.css";
import GradientButton from '@/core/buttons/electrons/GradientButton';
import { useParams } from 'next/navigation';
import { hideLoader, showLoader } from '@/store/loadingSlice';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const params = useParams();
  const sdkOrderId = params.orderId as string;
  const [isLoading, setIsLoading] = useState(false);

  const initializePayment = () => {
    dispatch(showLoader("Initializing Payment..."));
    setIsLoading(true);
    try {
      renderForm(
        'payment-form-container',
        sdkOrderId,
        () => { console.log('Payment Successful'); },
        (error) =>  { console.log('Payment Failed:', error); },
        {
          env: 'staging',
          locale: 'al',
          initialState: {
            cardNumber: "",
            email: "email@example.com",
            expiration: "",
            securityCode: "",
            holdersName: "",
            countryCode: "US",
            address1: "",
            locality: "",
            administrativeArea: "",
            postalCode: "",
            phoneNumber: ""
          }
        }
      );
    } finally {
      setIsLoading(false);
      dispatch(hideLoader());
    }
  };

  useEffect(() => {
    dispatch(hideLoader())
  }, [dispatch]);


  return isLoading ? (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-purple-600"></div>
        <span className="ml-3 text-lg text-gray-700">Loading Payment Page...</span>
      </div>

    )
   : (
    <div className="payment-page">
      <GradientButton
        label="Pay Now"
        onClick={() => initializePayment()}
        fromColor="from-red-500"
        toColor="to-red-700"
        hoverFromColor="hover:from-red-600"
        hoverToColor="hover:to-red-800"
        className="!x-auto inline-flex text-white font-medium py-2 rounded-lg transition mt-2"
      />
      <div id="payment-form-container"></div>
    </div>
  );
}

export default App;
