/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useEthers } from "../context/EthersProvider";
import toast from "react-hot-toast";
import Car from "./Car";
import MotorCycle from "./Motorcycle";

const Search = () => {
  const { contract, setRegistrationInfo } = useEthers();
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  const getData = async (uri: string) => {
    try {
      const response = await fetch(uri);
      const jsonData = await response.json();
      setData(jsonData);
    } catch (error: any) {
      console.log(error);
      toast.error(error.reason || "An error occurred", {
        duration: 2500,
        position: "top-center",
      });
    }
  };

  const handleSearch = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await contract.getURIByNumberPlate(searchText);
      console.log(parseInt(result[2], 10));
      await getData(result[0]);
      setRegistrationInfo({
        address: result[1],
        tokenId: parseInt(result[2], 10),
      });
    } catch (error: any) {
      toast.error(error.reason || "An error occurred", {
        duration: 2500,
        position: "top-center",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setSearchText("");
    setData(null);
    setRegistrationInfo(null);
  };

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <form className="w-full max-w-md" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search by number plate..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          type="submit"
          disabled={!contract || isLoading}
          className={`mt-4 w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 ${
            isLoading ? "cursor-not-allowed opacity-50" : ""
          }`}
        >
          {isLoading ? (
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
              Loading...
            </div>
          ) : (
            "Search"
          )}
        </button>
      </form>
      {data && (
        <div className="relative mt-8">
          <button
            onClick={handleClose}
            className="absolute top-4 right-0 p-2 text-white bg-red-500 rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 z-10"
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
          {data.vehicle_type === "car" ? (
            <Car data={data} />
          ) : (
            <MotorCycle data={data} />
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
