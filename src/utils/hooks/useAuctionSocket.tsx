import { io, Socket } from 'socket.io-client';
import { useEffect, useRef } from 'react';
import { Bidding } from '@/components/auctions/BiddingHistory';

let socketInstance: Socket | null = null;
interface useAuctionSocketProps {
  user: any;
  auctionId: string;
  setBiddings: any;
  setAuction: any;
  biddingUsers : any;
  setBiddingUsers: any;
  setOutBidNotification: any;

}
export function useAuctionSocket({
  user,
  auctionId,
  setBiddings,
  setAuction,
  setBiddingUsers,
  setOutBidNotification
}: useAuctionSocketProps) {
  const socketRef = useRef<Socket | null>(null);

  const handleNewBid = (bid: Bidding) => {
    setBiddings((prev : any) => [bid, ...prev]);
    setAuction((prev: any) => ({ ...prev, currentPrice: bid.amount }));
  };

  const handleBiddingIndicator = ({
    userName,
    isBidding
  }: {
    userName: string;
    isBidding: boolean;
  }) => {
    setBiddingUsers((prev : any) =>
      isBidding
        ? prev.includes(userName)
          ? prev
          : [...prev, userName]
        : prev.filter((u : any) => u !== userName)
    );
  };

  // Socket :
  useEffect(() => {
    if (!user?.id) return;
    if (!socketInstance) {
      socketInstance = io(process.env.NEXT_PUBLIC_BACKEND_URL, {
        query: { userId: user?.id }
      });
    }

    socketRef.current = socketInstance;

    socketInstance.on('biddingIndicator', handleBiddingIndicator);
    socketInstance.on('outBid', (notification: any) => {
      setOutBidNotification(notification.message ?? 'You were outbid!');
      setTimeout(() => setOutBidNotification(null), 5000);
    });

    return () => {
      socketInstance?.disconnect();
      socketInstance = null;
    };
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id || !auctionId || !socketRef.current) return;

    const socket = socketRef.current;
    socket.emit('joinAuction', auctionId);
    socket.on('newBid', handleNewBid);
    socket.on('biddingIndicator', handleBiddingIndicator);

    return () => {
      socket.emit('leaveAuction', auctionId);
      socket.off('newBid', handleNewBid);
      socket.off('biddingIndicator', handleBiddingIndicator);
    };
  }, [auctionId, user?.id]);
  return socketRef.current;
}
