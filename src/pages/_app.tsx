import { theme } from "@/theme";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import {
  GetSiweMessageOptions,
  RainbowKitSiweNextAuthProvider,
} from "@rainbow-me/rainbowkit-siwe-next-auth";
import "@rainbow-me/rainbowkit/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { WagmiProvider } from "wagmi";
import { NotificationsProvider } from "../providers/Notifications/NotificationProvider";
import "../styles/globals.css";
import { config } from "../wagmi";

const client = new QueryClient();

const getSiweMessageOptions: GetSiweMessageOptions = () => ({
  statement: "Sign in to my APP",
});

function MyApp({
  Component,
  pageProps,
}: AppProps<{
  session: Session;
}>) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <WagmiProvider config={config}>
        <SessionProvider refetchInterval={0} session={pageProps.session}>
          <QueryClientProvider client={client}>
            <RainbowKitSiweNextAuthProvider getSiweMessageOptions={getSiweMessageOptions}>
              <NotificationsProvider>
                <RainbowKitProvider>
                  <Component {...pageProps} />
                </RainbowKitProvider>
              </NotificationsProvider>
            </RainbowKitSiweNextAuthProvider>
          </QueryClientProvider>
        </SessionProvider>
      </WagmiProvider>
    </ThemeProvider>
  );
}

export default MyApp;
