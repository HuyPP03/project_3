/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useEthers } from "../context/EthersProvider";
import { toast } from "react-hot-toast";
import CreateAccount from "./CreateAccount";

const District = () => {
  const { contract, provider } = useEthers();
  const [data, setData] = useState<any>({
    owner: "",
    numberPlate: "",
    uri: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  // const [preview, setPreview] = useState(false);

  const handleAddRegisterVehicle = async () => {
    setIsLoading(true);
    try {
      const signer = provider.getSigner();
      await contract
        .connect(signer)
        .registerVehicle(data.owner, data.uri, data.numberPlate);
      setData({
        owner: "",
        numberPlate: "",
        uri: "",
      });
      toast.success("Register vehicle added successfully!", {
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
      setIsLoading(false);
    }
  };
  return (
    <div className="flex flex-col items-center p-6 space-y-6">
      <div className="w-full max-w-md">
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Add New Register Vehicle:
        </label>
        <div className="flex flex-col gap-4">
          <input
            type="text"
            id="owner"
            value={data.owner}
            onChange={(e) => setData({ ...data, owner: e.target.value })}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter owner address"
          />
          <input
            type="text"
            id="numberPlate"
            value={data.numberPlate}
            onChange={(e) => setData({ ...data, numberPlate: e.target.value })}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter number plate"
          />
          <input
            type="text"
            id="uri"
            value={data.uri}
            onChange={(e) => setData({ ...data, uri: e.target.value })}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter URI (ipfs URL)"
          />

          <button
            onClick={handleAddRegisterVehicle}
            disabled={isLoading}
            className={`px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 ${
              isLoading ? "cursor-not-allowed opacity-50" : ""
            }`}
          >
            {isLoading ? (
              <svg
                className="w-5 h-5 animate-spin"
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
            ) : (
              "Add"
            )}
          </button>
        </div>
      </div>
      <div className="w-full max-w-md">
        <CreateAccount />
      </div>
    </div>
  );
};

export default District;
