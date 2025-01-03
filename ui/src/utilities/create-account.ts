import { ethers } from "ethers";

const salt = import.meta.env.VITE_HASH_SATL || "default";

export const createWalletFromCCCD = (cccd: string) => {
  const hash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(salt + cccd));
  const wallet = new ethers.Wallet(hash);
  return wallet;
};
