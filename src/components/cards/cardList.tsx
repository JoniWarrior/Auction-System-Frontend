import { useEffect, useState } from "react";
import API from "@/utils/API/API";

export interface Card {
  id: string;
  lastDigits: string;
  cardType: string;
  isDefault: boolean;
}

interface CardListProps {
  onSelect: (card: Card | null) => void;
}

export default function CardList({ onSelect }: CardListProps) {
  const [cards, setCards] = useState<Card[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  const fetchCards = async () => {
    try {
      const res = await API.get("/cards/list-cards");
      const data: Card[] = res.data.data;
      setCards(data);

      if (data.length > 0) {
        setSelectedCardId(data[0].id);
        onSelect(data[0]);
      } else {
        onSelect(null);
      }
    } catch (err) {
      console.error("Failed to fetch cards:", err);
      setCards([]);
      onSelect(null);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const handleSelect = (card: Card) => {
    setSelectedCardId(card.id);
    onSelect(card);
  };

  if (cards.length === 0) {
    return (
      <div className="text-center p-4 border rounded">
        <p>You have no saved cards.</p>
        <button
          onClick={() => window.alert("Redirect to Add Card page")}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Add a Card
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-bold mb-2">Select a Card</h2>
      <ul>
        {cards.map((card) => (
          <li key={card.id} className="flex items-center mb-2">
            <input
              type="radio"
              name="selectedCard"
              checked={selectedCardId === card.id}
              onChange={() => handleSelect(card)}
              className="mr-2"
            />
            <span>
              {card.cardType} **** {card.lastDigits}{" "}
              {card.isDefault && "(Default)"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
