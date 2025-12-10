"use client"

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import CardService from '@/services/CardService';

export default function useUserCards() {
  const user = useSelector((state: RootState) => state.auth.user);
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [defaultCard, setDefaultCard] = useState<any>(null);

  const fetchCards = async () => {
    if (!user?.id) {
      setCards([]);
      setDefaultCard(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const fetchedCards = await CardService.listUserCards();
      setCards(fetchedCards || []);

      const defaultCard = fetchedCards.find((card: any) => card.isDefault);
      setDefaultCard(defaultCard ?? fetchedCards[0] ?? null);
    } catch (err) {
      console.error('Error fetching cards:', err);
      setCards([]);
      setDefaultCard(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, [user?.id]);

  const setAsDefault = async (cardId: string) => {
    try {
      await CardService.setDefaultCard(cardId);
      await fetchCards(); // Refresh the list
      return true;
    } catch (err) {
      console.error('Error setting default card:', err);
      return false;
    }
  };

  return {
    cards,
    defaultCard,
    loading,
    refresh: fetchCards,
    setAsDefault,
    hasCards: cards.length > 0,
    hasDefaultCard: !!defaultCard
  };
}