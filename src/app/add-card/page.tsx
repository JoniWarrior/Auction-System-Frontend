// "use client";
//
// import { renderAddCardForm } from "@nebula-ltd/pok-payments-js";
// import "@nebula-ltd/pok-payments-js/lib/index.css";
// import { PaymentErrorResponse, AddCardData } from '@nebula-ltd/pok-payments-js';
// import { useEffect } from 'react';
// import { router } from 'next/client';
//
// export default function AddCard() {
//
//   const handleSuccess = async (cardPayload: AddCardData) => {
//     console.log('Card added successfully!', cardPayload);
//     try {
//       const res = await fetch('/api/cards/save-card', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ cardPayload })
//       });
//       const data= await res.json();
//       console.log("Saved card response: ", data);
//
//       await router.push(`/pay/${data.sdkOrderId}`);
//     } catch (err) {
//       console.error('Error saving card:', err);
//     }
//   };
//
//   const handleError = (error: PaymentErrorResponse) => {
//     console.error("Adding card failed:", error);
//   };
//
//   const initializeCardForm = () => {
//     renderAddCardForm(
//       'add-card-form-container',
//       'Save Card',
//       handleSuccess,
//       handleError,
//       {
//         env: 'staging',
//         locale: 'al',
//         initialState: {
//           cardNumber: "",
//           email: "email@example.com",
//           expiration: "",
//           securityCode: "",
//           holdersName: "",
//           countryCode: "US",
//           address1: "",
//           locality: "",
//           administrativeArea: "",
//           postalCode: "",
//           phoneNumber: ""
//         }
//       }
//     );
//   };
//
//   useEffect(() => {
//     initializeCardForm()
//   }, []);
//
//   return (
//     <div className="card-form-page">
//       <button onClick={initializeCardForm}>
//         Add New Card
//       </button>
//
//       <div id="add-card-form-container"></div>
//     </div>
//   );
// }
