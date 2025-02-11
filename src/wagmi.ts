import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { sepolia } from "wagmi/chains";

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID ?? "";

export const config = getDefaultConfig({
  appName: "Wrap App",
  projectId,
  chains: [sepolia],
  ssr: true,
});
