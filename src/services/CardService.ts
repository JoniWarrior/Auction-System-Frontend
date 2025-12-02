import API from '@/utils/API/API';

export interface TokenizeGuestCardPayload {
  csFlexCard: {
    numericCardType: string;
    expirationYear: string;
    expirationMonth: string;
    jwe: string;
  };
  billingInfo: {
    firstName: string;
    lastName: string;
    address1: string;
    locality: string;
    postalCode: string | null;
    countryCode: string;
    administrativeArea: string;
    sameAsShipping: boolean;
    email: string;
  };
  securityCode: string;
}

const CardService = {
    listUserCards : async () => {
      const response = await API.get("/cards/list-cards");
      return response.data.data
    },
    tokenizeGuestCard : async (payload : any) => {
      const response = await API.post("/cards/tokenize-guest-card", payload);
      console.log("Payload coming: ", payload);
      console.log("Response coming: ", response);
      return response.data.data
    },
    setupTokenized3DS : async (payload : any) => {
      const response = await API.post("/cards/setup-tokenized-3DS", payload);
      return response.data.data
    },
    setDefaultCard : async (cardId : string) => {
      const response = await API.post("/cards/set-default", {cardId});
      return response.data.data;
    },
    useDefaultCard : async (cardId : string) => {
      const response = await API.post("/cards/use-default", {cardId});
      return response.data.data;
    }
}

export default CardService;
