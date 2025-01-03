/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useEthers } from "../context/EthersProvider";
import toast from "react-hot-toast";

const User = () => {
  const { registrationInfo, account, contract, provider } = useEthers();
  const [transferAddress, setTransferAddress] = useState("");
  const [isTransferring, setIsTransferring] = useState(false);

  const handleTransfer = async () => {
    setIsTransferring(true);
    try {
      const signer = provider.getSigner();
      const connectedContract = contract.connect(signer);
      await connectedContract.transferFrom(
        registrationInfo.address,
        transferAddress,
        registrationInfo.tokenId
      );
      toast.success("Transfer successful!", {
        duration: 2500,
        position: "top-center",
      });
    } catch (error: any) {
      console.log(error);
      toast.error(error.reason || "An error occurred", {
        duration: 2500,
        position: "top-center",
      });
    } finally {
      setIsTransferring(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-6 space-y-6">
      {registrationInfo && registrationInfo.address === account && (
        <div className="w-full max-w-md mt-8 p-4 border border-gray-300 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Transfer Registration
          </h2>
          <input
            type="text"
            placeholder="Enter address to transfer to..."
            value={transferAddress}
            onChange={(e) => setTransferAddress(e.target.value)}
            className="w-full px-4 py-2 mb-4 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={handleTransfer}
            disabled={isTransferring}
            className={`w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 ${
              isTransferring ? "cursor-not-allowed opacity-50" : ""
            }`}
          >
            {isTransferring ? (
              <div className="flex items-center justify-center">
                <svg
                  className="w-5 h-5 mr-2 text-white animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
                Transferring...
              </div>
            ) : (
              "Transfer"
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default User;
