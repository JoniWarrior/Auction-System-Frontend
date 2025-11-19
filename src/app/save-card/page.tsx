"use client";

import { AddCardForm } from "@nebula-ltd/pok-payments-js/react";
import "@nebula-ltd/pok-payments-js/lib/index.css";
import { PaymentErrorResponse, AddCardData } from '@nebula-ltd/pok-payments-js';

export default function App() {

  const handleSuccess = (cardPayload: AddCardData) => {
    console.log("Card added successfully!", cardPayload);
    // Here you would typically send this data to your backend
    // to store or process as needed
  };

  const handleError = (error: PaymentErrorResponse) => {
    console.error("Adding card failed:", error);
  };

  return (
    <AddCardForm
      onSuccess={handleSuccess}
      onError={handleError}
      buttonTitle="Save Card" // Optional, defaults to "Add Card"
      options={{
        env: 'production', // or 'staging' for test environment
        locale: 'it',
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
      }}
    />
  );
}