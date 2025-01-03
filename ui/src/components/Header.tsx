import { useEthers } from "../context/EthersProvider";
import { useEffect } from "react";

const Header = () => {
  const { account, connectWallet } = useEthers();

  useEffect(() => {
    if (window.ethereum) {
      connectWallet();
    }
  }, []);

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-700 shadow-md sticky top-0">
      <div className="text-white font-bold text-xl tracking-wide">
        <h1>RegisterVehicle</h1>
      </div>

      {account ? (
        <button
          type="button"
          className="bg-white text-gray-800 px-4 py-2 rounded-lg shadow hover:bg-gray-100 transition duration-300 transform hover:scale-105"
        >
          {account.slice(0, 6) + "..." + account.slice(-4)}
        </button>
      ) : (
        <button
          type="button"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition duration-300 transform hover:scale-105"
          onClick={connectWallet}
        >
          Connect Wallet
        </button>
      )}
    </nav>
  );
};

export default Header;
