require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    sepolia: {
      url: "https://eth-sepolia.public.blastapi.io",
      accounts: [
        "0x1fe4d0d0d2421dcdfe3fb17613412d57bc325326da5a6de0c7b3c1b133fd2e2a",
      ],
    },
  },
};
