"use client";

import { renderAddCardForm } from "@nebula-ltd/pok-payments-js";
import "@nebula-ltd/pok-payments-js/lib/index.css";
import { PaymentErrorResponse, AddCardData } from '@nebula-ltd/pok-payments-js';

export default function AddCard() {

  const handleSuccess = (cardPayload: AddCardData) => {
    console.log("Card added successfully!", cardPayload);
    // Send to backend if needed
  };

  const handleError = (error: PaymentErrorResponse) => {
    console.error("Adding card failed:", error);
  };

  const initializeCardForm = () => {
    renderAddCardForm(
      'add-card-form-container', // Target div ID
      'Save Card',               // Button label
      handleSuccess,             // ✅ pass reference
      handleError,               // ✅ pass reference
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
  };

  return (
    <div className="card-form-page">
      <button onClick={initializeCardForm}>
        Add New Card
      </button>

      <div id="add-card-form-container"></div>
    </div>
  );
}
