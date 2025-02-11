"use client";

import { NotificationComponent } from "@/providers/Notifications/components/NotificationComponent";
import { GroupedNotification, NotificationMessage } from "@/utils/types/notifications";
import { createContext, ReactNode, useCallback, useState } from "react";

interface NotificationsContextType {
  addNotification: (notification: NotificationMessage) => void;
  notifications: GroupedNotification[];
  removeNotification: (text: string) => void;
}

export const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export const NotificationsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<GroupedNotification[]>([]);

  const addNotification = useCallback((notification: NotificationMessage) => {
    setNotifications((currentNotifications) => {
      const existingNotification = currentNotifications.find((n) => n.text === notification.text);
      if (existingNotification) {
        return currentNotifications.map((n) =>
          n.text === notification.text ? { ...n, count: n.count + 1 } : n,
        );
      }
      return [...currentNotifications, { ...notification, count: 1 }];
    });
  }, []);

  const removeNotification = useCallback((text: string) => {
    setNotifications((prev) => prev.filter((n) => n.text !== text));
  }, []);

  return (
    <NotificationsContext.Provider value={{ addNotification, notifications, removeNotification }}>
      <NotificationComponent />
      {children}
    </NotificationsContext.Provider>
  );
};
