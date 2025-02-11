"use client";

import { useSafeInfo } from "@/hooks/token/safeTokenInfo/useSafeInfo";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useEffect, useState } from "react";

interface SafeWalletBannerProps {
  safeAddress: string;
}

interface SafeInfo {
  owners: string[];
  threshold: number;
}

export const SafeWalletBanner = ({ safeAddress }: SafeWalletBannerProps) => {
  const { getSafeInfo } = useSafeInfo();
  const [safeInfo, setSafeInfo] = useState<SafeInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSafeInfo = async () => {
      if (!safeAddress) return;
      setIsLoading(true);
      const info = await getSafeInfo(safeAddress);
      if (info) {
        setSafeInfo(info);
      }
      setIsLoading(false);
    };

    fetchSafeInfo();
  }, [safeAddress, getSafeInfo]);

  if (!safeAddress || !safeInfo) return null;

  if (isLoading) {
    return (
      <Box
        sx={{
          p: 2,
          mb: 3,
          background: "linear-gradient(90deg, #2c3e50 0%, #3498db 100%)",
          borderRadius: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress size={24} sx={{ color: "#fff" }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: 2,
        mb: 3,
        background: "linear-gradient(90deg, #2c3e50 0%, #3498db 100%)",
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",
        gap: 1,
      }}
    >
      <Typography sx={{ color: "#fff" }}>
        Using Safe: {safeAddress} ({safeInfo.threshold} of {safeInfo.owners.length} signatures
        required)
      </Typography>
      <Typography variant="caption" sx={{ color: "#fff", opacity: 0.8 }}>
        Owners: {safeInfo.owners.join(", ")}
      </Typography>
    </Box>
  );
};
