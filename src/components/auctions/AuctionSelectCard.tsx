import { FaCreditCard, FaExclamationTriangle, FaPlus } from 'react-icons/fa';
import CardSelectionSection from '@/components/cards/CardSelection';

interface AuctionSelectCardProps {
  user: any;
  hasDefaultCard: boolean;
  showAddCardForm: boolean;
  setShowAddCardForm: (show: boolean) => void;
  showCardSelection: boolean;
  setShowCardSelection: (show: boolean) => void;
  defaultCard: any;
  userCards: any[];
  paymentError: string | null;
  handleSetAsDefault: (cardId: string) => void;
}

const AuctionSelectCard = ({
  user,
  hasDefaultCard,
  showAddCardForm,
  setShowAddCardForm,
  showCardSelection,
  setShowCardSelection,
  defaultCard,
  userCards,
  paymentError,
  handleSetAsDefault
}: AuctionSelectCardProps) => {
  return (
    <div className="w-full">
      {/* Payment Method Section */}
      {user?.id && (
        <div className="space-y-4">
          {/* No Cards - Show Add Card Form */}
          {!hasDefaultCard && !showAddCardForm && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <FaCreditCard className="text-green-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-yellow-800 mb-1">Payment Method Required</h4>
                  <p className="text-yellow-700 text-sm mb-3">Add a payment method to place bids</p>
                  <button
                    onClick={() => setShowAddCardForm(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white hover:bg-yellow-700 rounded-lg transition-colors font-medium text-sm">
                    <FaPlus className="text-sm" />
                    Add Payment Method
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Add Card Form */}
          {showAddCardForm && (
            <div className="p-4 bg-white border border-gray-200 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-900">Add New Card</h4>
                <button
                  onClick={() => setShowAddCardForm(false)}
                  className="text-sm text-gray-500 hover:text-gray-700">
                  Cancel
                </button>
              </div>
              <div id="add-card-form-container" className="mb-4"></div>
            </div>
          )}

          {hasDefaultCard && !showCardSelection && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg`}>
                    <FaCreditCard className="text-green-800" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">{defaultCard.cardType}</span>
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                        Default
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm mt-1">
                      Ending in •••• {defaultCard.hiddenNumber?.slice(-4) || '••••'}
                    </p>
                  </div>
                </div>
                {hasDefaultCard && (
                  <button
                    onClick={() => setShowCardSelection(!showCardSelection)}
                    className="text-sm text-green-600 hover:text-green-800 font-medium">
                    {showCardSelection ? 'Hide Cards' : 'Change'}
                  </button>
                )}
              </div>
            </div>
          )}
          {/* Card Selection */}
          {showCardSelection && userCards.length > 0 && (
            <CardSelectionSection
              userCards={userCards}
              defaultCard={defaultCard}
              showCardSelection={showCardSelection}
              setShowAddCardForm={setShowAddCardForm}
              handleSetAsDefault={handleSetAsDefault}
              setShowCardSelection={setShowCardSelection}
            />
          )}

          {/* Payment Error */}
          {paymentError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <FaExclamationTriangle className="text-red-600" />
                </div>
                <div>
                  <p className="text-red-700 font-medium">Payment Error</p>
                  <p className="text-red-600 text-sm">{paymentError}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AuctionSelectCard;
