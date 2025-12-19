import API from '@/utils/API/API';
import { AddCardData } from '@nebula-ltd/pok-payments-js';

interface SetUpTokenized3DSPayload {
  selectedCardId ?: string,
  sdkOrderId ?: string
}

const CardService = {
    listUserCards : async () => {
      const response = await API.get("/cards/list-cards");
      return response?.data?.data
    },
    tokenizeGuestCard : async (payload : AddCardData) => {
      const response = await API.post("/cards/tokenize-guest-card", payload);
      return response?.data?.data
    },
    setupTokenized3DS : async (payload : SetUpTokenized3DSPayload) => {
      const response = await API.post("/cards/setup-tokenized-3DS", payload);
      return response?.data?.data
    },
    setDefaultCard : async (cardId : string) => {
      const response = await API.post("/cards/set-default", {cardId});
      return response?.data?.data;
    },
    getGuestCardInfo : async (cardId : string[]) => {
      const response = await API.post("/cards/get-guest-card-info", {cardId});
      return response?.data?.data;
    }
    // mix getGuestCardInfo with listUserCards to send the label too // or save the label in db instead of hiddenNumber
}

export default CardService;
