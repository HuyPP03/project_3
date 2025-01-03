/* eslint-disable @typescript-eslint/no-explicit-any */
import { Contract, ethers, providers } from "ethers";
import React, { createContext, useContext, useEffect, useState } from "react";
import { abi } from "../abis/VehicleRegistration.json";

const address = import.meta.env.VITE_CONTRACT_ADDRESS;

// type EthersContextType = {
//   account: string | null;
//   setAccount: any;
//   provider: providers.Web3Provider | null;
//   loadBlockchainData: () => void;
//   contract: Contract | null;
//   connectWallet: any;
//   role: string | null;
// };

// Tạo context
const EthersContext = createContext<any>(null);

// Tạo provider
export const EthersProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [provider, setProvider] = useState<providers.Web3Provider | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [contract, setContract] = useState<Contract | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [registrationInfo, setRegistrationInfo] = useState<{
    address: string;
    tokenId: number;
  } | null>(null);

  const connectWallet = async () => {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const account = ethers.utils.getAddress(accounts[0]);
      setAccount(account);
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  const loadBlockchainData = async () => {
    try {
      setLoading(true);
      const provider = new providers.Web3Provider(window.ethereum);
      // const network = await provider.getNetwork();

      setProvider(provider);

      const contract = new ethers.Contract(address, abi, provider);

      setContract(contract);

      window.ethereum.on("accountsChanged", async () => {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const account = ethers.utils.getAddress(accounts[0]);
        setAccount(account);
      });
      setLoading(false);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    loadBlockchainData();
  }, []);

  const getRole = async () => {
    const role = await contract?.connect(account!).checkAuthorityLevel();
    setRole(role);
  };

  useEffect(() => {
    if (account && contract) {
      getRole();
    }
  }, [account, contract]);

  return (
    <EthersContext.Provider
      value={{
        account,
        setAccount,
        provider,
        loadBlockchainData,
        contract,
        connectWallet,
        role,
        loading,
        registrationInfo,
        setRegistrationInfo,
      }}
    >
      {children}
    </EthersContext.Provider>
  );
};

export const useEthers = () => {
  return useContext(EthersContext);
};
