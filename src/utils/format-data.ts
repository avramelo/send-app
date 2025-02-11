const MASK = "···";

export function maskAddress(address: string): string {
  if (!address) {
    return "";
  }
  return address.length > 8 ? `${address.slice(0, 4)}${MASK}${address.slice(-4)}` : address;
}

export const copyAddressToClipboard = (value: string) => {
  return navigator.clipboard.writeText(value);
};
