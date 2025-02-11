import type { NextApiRequest, NextApiResponse } from "next";
import { generateNonce } from "siwe";

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Content-Type", "text/plain");
  res.send(generateNonce());
}
