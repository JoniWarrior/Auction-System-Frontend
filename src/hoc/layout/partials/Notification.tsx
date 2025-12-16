'use client';
import { useEffect, useState } from 'react';
import { FaBell } from 'react-icons/fa';
import { io, Socket } from 'socket.io-client';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import NotificationService from '@/services/NotificationService';
import GradientButton from '@/core/buttons/electrons/GradientButton';
import { User } from '@/components/auctions/BidForm';

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const user = useSelector((state: RootState) => state.auth.user);

  const fetchNotifications = async (user: User) => {
    try {
      const response = await NotificationService.getUnreadNotification(user?.id);
      setNotifications(response || []);
      setUnreadCount(response.filter((n: any) => !n.isRead).length);
    } catch (err) {
      console.error('Error fetching notifications: ', err);
    }
  };

  useEffect(() => {
    if (!user?.id) return;
    fetchNotifications(user);

    const socket: Socket = io(process.env.NEXT_PUBLIC_BACKEND_URL!, {
      query: { userId: user?.id }
    });
    socket.on('outBid', (notification: any) => {
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
      setToastMessage(notification.message);
      console.log("Outbid arriving in front via socket",notification);
      setTimeout(() => setToastMessage(null), 5000);
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  const markAsRead = async (id: string) => {
    try {
      await NotificationService.markAsRead(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id)); // remove from the list
      setUnreadCount((prev) => Math.max(prev - 1, 0));
    } catch (err) {
      console.error('Error marking notification as read: ', err);
    }
  };

  return (
    <div className="relative">
      <GradientButton
        onClick={() => setIsOpen(!isOpen)}
        fromColor="from-purple-500"
        toColor="to-blue-500"
        hoverFromColor="hover:from-purple-800"
        hoverToColor="hover:to-blue-600"
        className="!w-auto p-2 rounded-full relative text-white"
        label={
          <>
            <FaBell className="text-l" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </>
        }
      />

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white border rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
          {notifications.length === 0 ? (
            <p className="p-3 text-gray-500 text-sm">No notifications</p>
          ) : (
            notifications
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .slice(0, 10)
              .map((n) => (
                <div key={n.id} className="p-3 border-b flex justify-between items-center bg-white">
                  <span className="text-sm text-gray-800">
                    {n.message || `You were outbid with bid $${n.bidding?.amount}`}
                  </span>
                  <button
                    onClick={() => markAsRead(n.id)}
                    className="text-xs text-purple-600 hover:underline ">
                    Mark read
                  </button>
                </div>
              ))
          )}
        </div>
      )}

      {toastMessage && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded shadow-lg z-50">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
