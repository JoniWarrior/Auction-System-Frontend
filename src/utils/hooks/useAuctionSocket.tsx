import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

export default function useAuctionSocket({ userId, auctionId, onOutBid, onNewBid, onBiddingIndicator }: {
  userId: string | undefined;
  auctionId: string | undefined;
  onOutBid: (msg: string) => void;
  onNewBid: (bid: any) => void;
  onBiddingIndicator: (data: { userName: string; isBidding: boolean }) => void;
}) {
  const socketRef = useRef<Socket | null>(null);

  // Initialize socket
  useEffect(() => {
    if (!userId || socketRef.current) return;

    const socket = io(process.env.NEXT_PUBLIC_BACKEND_URL!, {
      query: { userId }
    });

    socketRef.current = socket;

    socket.on("outBid", (n: any) => {
      onOutBid(n.message ?? "You were outbid!");
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [userId, onOutBid]);

  // Join auction + listen to auction events
  useEffect(() => {
    const socket = socketRef.current;
    if (!userId || !auctionId || !socket) return;

    socket.emit("joinAuction", auctionId);

    socket.on("newBid", onNewBid);
    socket.on("biddingIndicator", onBiddingIndicator);

    return () => {
      socket.emit("leaveAuction", auctionId);
      socket.off("newBid", onNewBid);
      socket.off("biddingIndicator", onBiddingIndicator);
    };
  }, [auctionId, userId, onNewBid, onBiddingIndicator]);

  return socketRef;
}
