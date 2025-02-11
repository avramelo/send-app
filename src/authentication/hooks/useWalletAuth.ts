import { signIn } from "next-auth/react";
import { useCallback } from "react";
import { SiweMessage } from "siwe";
import { useAccount, useDisconnect, useSignMessage } from "wagmi";
import { AUTH_CONFIG } from "../../utils/constants/auth";

interface UseWalletAuthProps {
  onError: (error: string) => void;
  address?: string;
  onSignStart: () => void;
  onSignEnd: () => void;
}

export const useWalletAuth = ({ onError, address, onSignStart, onSignEnd }: UseWalletAuthProps) => {
  const { disconnect } = useDisconnect();
  const { signMessageAsync } = useSignMessage();
  const { status } = useAccount();

  const handleSign = useCallback(async () => {
    if (!address || status !== "connected") return;

    try {
      onSignStart();
      const nonce = await fetch("/api/auth/nonce").then((res) => {
        if (!res.ok) throw new Error("Failed to fetch nonce");
        return res.text();
      });

      const message = new SiweMessage({
        domain: window.location.host,
        address,
        statement: AUTH_CONFIG.SIGN_MESSAGE,
        uri: window.location.origin,
        version: AUTH_CONFIG.VERSION,
        chainId: AUTH_CONFIG.CHAIN_ID,
        nonce,
      });

      try {
        const signature = await signMessageAsync({
          message: message.prepareMessage(),
        });

        if (!signature) {
          onError("Signature is required to continue");
          disconnect();
          return;
        }

        const result = await signIn("web3", {
          message: JSON.stringify(message),
          signature,
          redirect: false,
        });

        if (result?.error) {
          onError("Authentication failed. Please try again.");
          disconnect();
        }
      } catch (signError: any) {
        if (
          signError.name === "UserRejectedRequestError" ||
          signError.message?.includes("Connector not connected")
        ) {
          onError("Please sign the message to continue");
          disconnect();
          return;
        }
        throw signError;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      console.error("Error during sign in:", errorMessage);
      onError(errorMessage);
    } finally {
      onSignEnd();
    }
  }, [signMessageAsync, disconnect, onError, address, onSignStart, onSignEnd, status]);

  return { handleSign };
};
