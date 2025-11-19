"use client";
import "@nebula-ltd/pok-payments-js/lib/index.css";
import { PaymentErrorResponse } from '@nebula-ltd/pok-payments-js';
import { useParams } from 'next/navigation';
import { GuestCheckoutForm } from '@nebula-ltd/pok-payments-js/react';

export default function App() {
  const params = useParams();
  const orderId = params.id as string;
  // Success callback - triggered when payment is successful
  const handleSuccess = () => {
    console.log("Payment was successful!");
    window.location.href = "/auctions";
  };

  // Error callback - triggered when payment fails
  const handleError = (error: PaymentErrorResponse) => {
    console.error("Payment failed:", error);
  };

  return (
    <GuestCheckoutForm
      orderId={orderId} // Replace with your actual order ID
      onSuccess={handleSuccess}
      onError={handleError}
      options={{
        env: 'staging', // Use 'production' for live environment
        locale: 'al', // Language locale default (en)
      }}
    />
  );
}