import { FaCreditCard, FaExclamationTriangle, FaPlus } from 'react-icons/fa';
import CardSelectionSection, { Card } from '@/components/cards/CardSelection';
import { User } from '@/components/auctions/BidForm';

interface DefaultCard {
  id: string;
  cardType: string;
  hiddenNumber: string;
  isDefault: boolean;
}

interface AuctionSelectCardProps {
  user: User | null;
  hasDefaultCard: boolean;
  showAddCardForm: boolean;
  setShowAddCardForm: (show: boolean) => void;
  showCardSelection: boolean;
  setShowCardSelection: (show: boolean) => void;
  defaultCard: DefaultCard;
  userCards: Card[];
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
    <div className="w-full md:w-3/4 lg:w-1/2">
      {/* Payment Method Section */}
      {user?.id && (
        <div className="space-y-3 md:space-y-4">
          {userCards?.length < 1 && !showAddCardForm && (
            <div className="p-3 md:p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
              <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                <div className="hidden sm:flex p-2 bg-yellow-100 rounded-lg">
                  <FaCreditCard className="text-green-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-yellow-800 mb-1 text-sm md:text-base">
                    Payment Method Required
                  </h4>
                  <p className="text-yellow-700 text-xs md:text-sm mb-3">
                    Add a payment method to place bids
                  </p>
                  <button
                    onClick={() => setShowAddCardForm(true)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-3 py-2 md:px-4 md:py-2 bg-yellow-600 text-white hover:bg-yellow-700 rounded-lg transition-colors font-medium text-sm">
                    <FaPlus className="text-sm" />
                    Add Payment Method
                  </button>
                </div>
              </div>
            </div>
          )}

          {hasDefaultCard && !showCardSelection && !showAddCardForm && (
            <div className="p-3 md:p-4 bg-green-50 border border-green-200 rounded-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex p-2 rounded-lg">
                    <FaCreditCard className="text-green-800" />
                  </div>
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <span className="font-semibold text-gray-900 text-sm md:text-base">
                        {defaultCard.cardType}
                      </span>
                      {defaultCard.isDefault && (
                        <span className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                          Default Card
                        </span>
                      )}
                    </div>
                    <p className="text-gray-700 text-xs md:text-sm mt-1">
                      Ending in •••• {defaultCard.hiddenNumber?.slice(-4) || '••••'}
                    </p>
                  </div>
                </div>
                {hasDefaultCard && (
                  <button
                    onClick={() => setShowCardSelection(!showCardSelection)}
                    className="self-start sm:self-center text-sm text-green-600 hover:text-green-800 font-medium">
                    Change
                  </button>
                )}
              </div>
            </div>
          )}

          {showAddCardForm && (
            <div className="p-3 md:p-4 bg-white border border-gray-200 rounded-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
                <h4 className="font-semibold text-gray-900 text-sm md:text-base">Add New Card</h4>
                <button
                  onClick={() => setShowAddCardForm(false)}
                  className="text-sm text-gray-500 hover:text-gray-700 self-start sm:self-center">
                  Cancel
                </button>
              </div>
              <div id="add-card-form-container" className="mb-4"></div>
            </div>
          )}

          {showCardSelection && userCards.length > 0 && !showAddCardForm && (
            <div className="max-h-48 md:max-h-64 overflow-y-auto pr-2">
              <CardSelectionSection
                userCards={userCards}
                defaultCard={defaultCard}
                showCardSelection={showCardSelection}
                setShowAddCardForm={setShowAddCardForm}
                handleSetAsDefault={handleSetAsDefault}
                setShowCardSelection={setShowCardSelection}
              />
            </div>
          )}

          {/* Payment Error */}
          {paymentError && (
            <div className="p-3 md:p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-start gap-3">
                <div className="hidden sm:flex p-2 bg-red-100 rounded-lg">
                  <FaExclamationTriangle className="text-red-600" />
                </div>
                <div>
                  <p className="text-red-700 font-medium text-sm md:text-base">Payment Error</p>
                  <p className="text-red-600 text-xs md:text-sm">{paymentError}</p>
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
