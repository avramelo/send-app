import { Typography } from "@mui/material";

interface NotificationMessageProps {
  message: string;
}

export const NotificationMessage = ({ message }: NotificationMessageProps) => {
  return (
    <Typography variant="body2" sx={{ wordBreak: "break-word" }}>
      {message}
    </Typography>
  );
};
