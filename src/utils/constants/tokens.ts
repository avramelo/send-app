import { AddressType } from "../types/shared";

export interface Token {
  address: AddressType | "ETH";
  symbol: string;
  name: string;
}

export const TOKENS: Token[] = [
  {
    address: "ETH",
    symbol: "ETH",
    name: "Ethereum",
  },
  {
    address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984" as AddressType,
    symbol: "UNI",
    name: "Uniswap",
  },
  {
    address: "0x7b79995e5f793A07bc00C21412e50ECae098E7f9" as AddressType,
    symbol: "WETH",
    name: "Wrapped Ethereum",
  },
  {
    address: "0x779877A7B0D9E8603169DdbD7836e478b4624789" as AddressType,
    symbol: "LINK",
    name: "Chainlink Token",
  },
];
