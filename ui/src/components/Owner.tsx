/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useEthers } from "../context/EthersProvider";
import toast from "react-hot-toast";
import CreateAccount from "./CreateAccount";

const Owner = () => {
  const { contract, provider } = useEthers();
  const [provinces, setProvinces] = useState<string[]>([]);
  const [province, setProvince] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProvince, setLoadingProvince] = useState<string | null>(null);

  const getAllProvinces = async () => {
    try {
      const signer = provider.getSigner();
      const provinces = await contract.connect(signer).getProvinces();
      setProvinces(provinces);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddProvince = async () => {
    setIsLoading(true);
    try {
      const signer = provider.getSigner();
      await contract.connect(signer).addProvincialPolice(province);
      setProvinces([...provinces, province]);
      setProvince("");
      toast.success("Province added successfully!", {
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

  const handleRemoveProvince = async (province: string) => {
    setLoadingProvince(province);
    try {
      const signer = provider.getSigner();
      await contract.connect(signer).removeProvincialPolice(province);
      setProvinces(provinces.filter((p) => p !== province));
      toast.success("Province removed successfully!", {
        duration: 2500,
        position: "top-center",
      });
    } catch (error: any) {
      toast.error(error.reason || "An error occurred", {
        duration: 2500,
        position: "top-center",
      });
    } finally {
      setLoadingProvince(null);
    }
  };

  useEffect(() => {
    getAllProvinces();
  }, []);

  return (
    <div className="flex flex-col items-center p-6 space-y-6">
      <div className="w-full max-w-md">
        <label
          htmlFor="province"
          className="block mb-2 text-sm font-medium text-gray-700"
        >
          Add New Province:
        </label>
        <div className="flex space-x-2">
          <input
            type="text"
            id="province"
            value={province}
            onChange={(e) => setProvince(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter province name"
          />
          <button
            onClick={handleAddProvince}
            disabled={!province || isLoading}
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
        <h2 className="mb-4 text-lg font-semibold text-gray-800">Provinces</h2>
        <ul className="space-y-2">
          {provinces.length > 0 ? (
            provinces.map((province, index) => (
              <li
                key={index}
                className="flex items-center justify-between p-4 bg-gray-100 rounded-lg shadow"
              >
                <span className="text-gray-700">{province}</span>
                <button
                  onClick={() => handleRemoveProvince(province)}
                  disabled={loadingProvince === province}
                  className={`flex items-center px-3 py-1 text-sm text-red-600 bg-red-100 rounded-lg hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-300 ${
                    loadingProvince === province
                      ? "cursor-not-allowed opacity-50"
                      : ""
                  }`}
                >
                  {loadingProvince === province ? (
                    <svg
                      className="w-4 h-4 animate-spin"
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
                    <span className="font-bold">×</span>
                  )}
                </button>
              </li>
            ))
          ) : (
            <p className="text-gray-500">No provinces available.</p>
          )}
        </ul>
      </div>
      <div className="w-full max-w-md">
        <CreateAccount />
      </div>
    </div>
  );
};

export default Owner;
