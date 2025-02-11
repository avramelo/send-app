"use client";

import { useNotifications } from "@/hooks/base/useNotifications";
import { Alert, Snackbar } from "@mui/material";

export const NotificationComponent = () => {
  const { notifications, removeNotification } = useNotifications();

  return (
    <>
      {notifications.map((notification) => (
        <Snackbar
          key={notification.text}
          open
          autoHideDuration={notification.duration ?? 6000}
          onClose={() => removeNotification(notification.text)}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            onClose={() => removeNotification(notification.text)}
            severity={notification.severity}
            sx={{ width: "100%" }}
          >
            {notification.text}
            {notification.count > 1 && ` (${notification.count})`}
          </Alert>
        </Snackbar>
      ))}
    </>
  );
};
