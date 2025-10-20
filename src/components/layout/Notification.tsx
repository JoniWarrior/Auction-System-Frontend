"use client";
import { useEffect, useState } from "react";
import { FaBell } from "react-icons/fa";
import { io, Socket } from "socket.io-client";
import API from "@/utils/API/API";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const notification = Number(localStorage.getItem("notification")) | 0;

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user?.id) return;

    const fetchNotifications = async () => {
      try {
        const response = await API.get(`/notifications/${user.id}`);
        setNotifications(response.data);
        setUnreadCount(response.data.filter((n: any) => !n.isRead).length);
      } catch (err) {
        console.error("Error fetching notifications: ", err);
      }
    };
    fetchNotifications();

    const socket: Socket = io(process.env.NEXT_PUBLIC_BACKEND_URL!, {
      query: { userId: user.id },
    });

    socket.on("connect", () => {
      console.log("Connected to socket as user: ", user.id);
    });


    socket.on("outBid", (notification: any) => {
      console.log("Notification received: ", notification);

      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);

      setToastMessage(notification.message);
      setTimeout(() => setToastMessage(null), 5000);
    });

    return () => {
      socket.disconnect();
    };
  }, [notification]);


  const markAsRead = async (id: string) => {
    try {
      await API.patch(`/notifications/${id}/read`);

      setNotifications((prev) => prev.filter((n) => n.id !== id)); // remove from the list
      setUnreadCount((prev) => Math.max(prev - 1, 0));
    } catch (err) {
      console.error("Error marking notification as read: ", err);
    }
  };

  return (
    <div className="relative">
      <button
        className="relative text-gray-600 hover:text-purple-600"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FaBell className="text-xl" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white border rounded-lg shadow-lg max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <p className="p-3 text-gray-500 text-sm">No notifications</p>
          ) : (
            notifications
            .sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .slice(0, 10)
            .map((n) => (
              <div
                key={n.id}
                className="p-3 border-b flex justify-between items-center bg-white"
              >
                <span className="text-sm text-gray-800">
                  {n.message || `You were outbid with bid $${n.bidding?.amount}`}
                </span>
                <button
                  onClick={() => markAsRead(n.id)}
                  className="text-xs text-purple-600 hover:underline ml-2"
                >
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