import { NextPage } from "next";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useWalletInit } from "@/authentication/hooks/useWalletInit";
import { Loading } from "@/components/ui/Loading/Loading";
import DashboardContent from "@/pages/dashboard/components/DashboardContent";
import DashboardWrapper from "@/pages/dashboard/components/ui/DashboardWrapper";

const DashboardPage: NextPage = () => {
  const { isConnected, status, isLoading: isWalletLoading } = useWalletInit();
  const router = useRouter();
  const [isPendingDisconnect, setIsPendingDisconnect] = useState(false);

  const isLoadingState = isWalletLoading || isPendingDisconnect;

  useEffect(() => {
    const handleAuthState = async () => {
      if (!isLoadingState) {
        if (!isConnected && status === "disconnected") {
          setIsPendingDisconnect(true);
          await signOut({ redirect: false });
          router.replace("/");
          return;
        }
      }
    };

    handleAuthState();
  }, [isConnected, status, isLoadingState, router]);

  if (isLoadingState) {
    return <Loading />;
  }

  return (
    <DashboardWrapper>
      <DashboardContent />
    </DashboardWrapper>
  );
};

export default DashboardPage;
