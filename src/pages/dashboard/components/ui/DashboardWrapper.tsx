import AddressTag from "@/components/ui/Tag/AddressTag";
import { maskAddress } from "@/utils/format-data";
import { AppBar, Box, Container, Toolbar, useTheme } from "@mui/material";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ReactNode } from "react";
import { useAccount } from "wagmi";

const DashboardWrapper = ({ children }: { children: ReactNode }) => {
  const { address } = useAccount();
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "grey.900",
      }}
    >
      <AppBar
        position="static"
        sx={{
          bgcolor: "rgba(0, 0, 0, 0.4)",
          borderBottom: 1,
          borderColor: "grey.800",
          backdropFilter: "blur(8px)",
        }}
      >
        <Container maxWidth="lg">
          <Toolbar
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              justifyContent: "space-between",
              alignItems: "center",
              gap: 2,
              py: 1,
            }}
            disableGutters
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box sx={{ color: theme.palette.primary.main }}>
                <AddressTag address={maskAddress(address ?? "N.A.")} />
              </Box>
            </Box>
            <Box sx={{ display: "flex", gap: 2 }}>
              <ConnectButton />
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Container
        maxWidth="lg"
        sx={{
          py: 4,
        }}
      >
        {children}
      </Container>
    </Box>
  );
};

export default DashboardWrapper;
