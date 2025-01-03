/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useEthers } from "../context/EthersProvider";
import toast from "react-hot-toast";
import CreateAccount from "./CreateAccount";

const Province = () => {
  const { contract, provider } = useEthers();
  const [districts, setDistricts] = useState<string[]>([]);
  const [district, setDistrict] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingDistrict, setLoadingDistrict] = useState<string | null>(null);

  const getAllDistricts = async () => {
    try {
      const signer = provider.getSigner();
      const districts = await contract.connect(signer).getDistricts();
      setDistricts(districts);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddDistrict = async () => {
    setIsLoading(true);
    try {
      const signer = provider.getSigner();
      await contract.connect(signer).addDistrictPolice(district);
      setDistricts([...districts, district]);
      setDistrict("");
      toast.success("District added successfully!", {
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

  const handleRemoveDistrict = async (district: string) => {
    setLoadingDistrict(district);
    try {
      const signer = provider.getSigner();
      await contract.connect(signer).removeDistrictPolice(district);
      setDistricts(districts.filter((p) => p !== district));
      toast.success("District removed successfully!", {
        duration: 2500,
        position: "top-center",
      });
    } catch (error: any) {
      toast.error(error.reason || "An error occurred", {
        duration: 2500,
        position: "top-center",
      });
    } finally {
      setLoadingDistrict(null);
    }
  };

  useEffect(() => {
    getAllDistricts();
  }, []);

  return (
    <div className="flex flex-col items-center p-6 space-y-6">
      <div className="w-full max-w-md">
        <label
          htmlFor="district"
          className="block mb-2 text-sm font-medium text-gray-700"
        >
          Add New District:
        </label>
        <div className="flex space-x-2">
          <input
            type="text"
            id="district"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter District name"
          />
          <button
            onClick={handleAddDistrict}
            disabled={!district || isLoading}
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
        <h2 className="mb-4 text-lg font-semibold text-gray-800">Districts</h2>
        <ul className="space-y-2">
          {districts.length > 0 ? (
            districts.map((district, index) => (
              <li
                key={index}
                className="flex items-center justify-between p-4 bg-gray-100 rounded-lg shadow"
              >
                <span className="text-gray-700">{district}</span>
                <button
                  onClick={() => handleRemoveDistrict(district)}
                  disabled={loadingDistrict === district}
                  className={`flex items-center px-3 py-1 text-sm text-red-600 bg-red-100 rounded-lg hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-300 ${
                    loadingDistrict === district
                      ? "cursor-not-allowed opacity-50"
                      : ""
                  }`}
                >
                  {loadingDistrict === district ? (
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
            <p className="text-gray-500">No Districts available.</p>
          )}
        </ul>
      </div>
      <div className="w-full max-w-md">
        <CreateAccount />
      </div>
    </div>
  );
};

export default Province;
