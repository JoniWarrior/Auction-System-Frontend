"use client";
import { useEffect, useState } from "react";
import { FaBell } from "react-icons/fa";
import { io } from "socket.io-client";
import API from "@/API/API";

let socket: any;

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user?.id) return;

    // Fetch Notifications from DB :
    const fetchNotifications = async () => {
      try {
        const response = await API.get(`/notifications/${user.id}`);
        console.log("Notifications : ", response.data);
        setNotifications(response.data);
        setUnreadCount(response.data.filter((n: any) => !n.isRead).length);
      } catch (err) {
        console.error("Error fetching notifications: ", err);
      }
    };
    fetchNotifications();

    // Set Up WebSocket (only once) :
    socket = io(process.env.NEXT_PUBLIC_BACKEND_URL!, {
      query: { userId: user?.id },
    });

    socket.on("connect", () => {
      console.log("Connected to socket as user: ", user.id);
    });

    // Handle outBid event from backend :
    socket.on("outbid", (notification: any) => {
      console.log("Notification received: ", notification);

      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);

      setToastMessage(notification.message);
      setTimeout(() => setToastMessage(null), 5000);
    });

    return () => {
      socket?.disconnect();
    };
  }, []);

  // Mark notifications as read :
  const markAsRead = async (id: string) => {
    try {
      await API.patch(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(prev - 1, 0)); // could be simplified
    } catch (err) {
      console.error("Error making notification as read: ", err);
    }
  };

  return (
    <div className="relative">
      {/* Bell icon */}
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

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white border rounded-lg shadow-lg max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <p className="p-3 text-gray-500 text-sm">No notifications</p>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`p-3 border-b flex justify-between items-center ${
                  n.isRead ? "bg-gray-100" : "bg-white"
                }`}
              >
                <span className="text-sm text-gray-800">
                  {n.message ||
                    `You were outbid with bid $${n.bidding?.amount}`}
                </span>
                {!n.isRead && (
                  <button
                    onClick={() => markAsRead(n.id)}
                    className="text-xs text-purple-600 hover:underline ml-2"
                  >
                    Mark read
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      )}
      {/* Toast popup */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded shadow-lg z-50">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
