import { NotificationsContext } from "@/providers/Notifications/NotificationProvider";
import { useContext } from "react";

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error("useNotifications must be used within NotificationsProvider");
  }
  return context;
};
