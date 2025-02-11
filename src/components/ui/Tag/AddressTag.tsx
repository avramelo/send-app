import { copyAddressToClipboard, maskAddress } from "../../../utils/format-data";
import Tag from "./Tag";

const AddressTag = ({ address }: { address: string }) => {
  const maskedAddress = maskAddress(address);
  return <Tag value={maskedAddress} onClick={() => copyAddressToClipboard(address)} />;
};

export default AddressTag;
