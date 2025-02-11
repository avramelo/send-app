import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

export const useAuthRedirect = (redirectPath: string) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && session) {
      router.push(redirectPath);
    }
  }, [session, status, router, redirectPath]);

  return {
    session,
    isLoading: false,
  };
};
