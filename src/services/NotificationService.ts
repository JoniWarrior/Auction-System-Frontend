import API from '../utils/API/API';

const NotificationService = {
  getUnreadNotification: (userId: string) => {
    return API.get(`/notifications/${userId}/unread`);
  },
  markAsRead : (notificationId : string) => {
    return API.patch(`/notifications/${notificationId}/read`);
  }
  
};

export default NotificationService;
