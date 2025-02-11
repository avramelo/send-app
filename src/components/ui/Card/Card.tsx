import { Box, Paper, PaperProps } from "@mui/material";
import { ReactNode } from "react";

interface CardProps extends PaperProps {
  children: ReactNode;
  actionButton?: ReactNode;
}

export const Card = ({ children, actionButton, ...props }: CardProps) => {
  return (
    <Paper
      elevation={3}
      sx={{
        p: 4,
        borderRadius: 2,
      }}
      {...props}
    >
      <Box>{children}</Box>
      {actionButton && <Box sx={{ mt: 2 }}>{actionButton}</Box>}
    </Paper>
  );
};
