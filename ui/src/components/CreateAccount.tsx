/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { createWalletFromCCCD } from "../utilities/create-account";
import QRCode from "react-qr-code";

const CreateAccount = () => {
  const [cccd, setCccd] = useState<string>("");
  const [openQR, setOpenQR] = useState<boolean>(false);
  const [accountData, setAccountData] = useState<string>("");
  const createWallet = (e: any) => {
    e.preventDefault();
    if (!cccd) {
      return;
    }
    const wallet = createWalletFromCCCD(cccd);
    setOpenQR(true);
    setAccountData(
      `Public key: ${wallet.address}\nPrivate key: ${wallet.privateKey}`
    );
  };

  const handleClose = () => {
    setOpenQR(false);
    setAccountData("");
    setCccd("");
  };
  return (
    <form className="" onSubmit={createWallet}>
      <input
        type="text"
        placeholder="CCCD"
        value={cccd}
        onChange={(e) => setCccd(e.target.value)}
        className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <button
        className={`my-4 w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300`}
        type="submit"
      >
        Create Wallet
      </button>

      {openQR && (
        <div className="relative mt-8">
          <button
            onClick={handleClose}
            className="absolute top-[-40px] right-[-10px] p-2 text-white bg-red-500 rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 z-10"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
          <QRCode
            size={256}
            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
            value={accountData}
            viewBox={`0 0 256 256`}
          />
        </div>
      )}
    </form>
  );
};

export default CreateAccount;
