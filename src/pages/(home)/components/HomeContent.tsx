import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useAuthRedirect } from "../../../authentication/hooks/useAuthRedirect";
import { useWalletAuth } from "../../../authentication/hooks/useWalletAuth";
import { useNotifications } from "@/hooks/base/useNotifications";
import { NotificationSeverity } from "@/utils/types/notifications";
import { Box, Container, Paper, Typography, CircularProgress } from "@mui/material";

const HomeContent = () => {
  const { addNotification } = useNotifications();
  const [error, setError] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const { address, isConnected } = useAccount();
  const { session, isLoading } = useAuthRedirect("/dashboard");
  const { handleSign } = useWalletAuth({
    onError: setError,
    address,
    onSignStart: () => setIsSigningIn(true),
    onSignEnd: () => setIsSigningIn(false),
  });

  useEffect(() => {
    if (error) {
      addNotification({
        text: error ?? "Something went wrong during authentication, please try again.",
        severity: NotificationSeverity.WARNING,
        duration: 10000,
      });
      setError(null);
    }
  }, [error, addNotification]);

  useEffect(() => {
    if (isConnected && address && !isSigningIn && !session) {
      handleSign();
    }
  }, [isConnected, address, handleSign, isSigningIn, session]);

  if (isSigningIn || isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "grey.900",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        p: 4,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography variant="h4" component="h2" gutterBottom>
            Welcome to the Send App
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Connect your wallet to continue
          </Typography>
          <Box sx={{ mt: 3 }}>
            <ConnectButton />
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default HomeContent;
