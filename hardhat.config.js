require("@nomicfoundation/hardhat-toolbox");
require('@openzeppelin/hardhat-upgrades');
const ethers = require('ethers');

let mnemonic = "harsh buyer easy example grocery glass two forward album quality check text";
let mnemonicWallet = ethers.Wallet.fromMnemonic(mnemonic);

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
    },
    localhost: {
      url: "127.0.0.1:8545"
    },
    mumbai: {
      url: "https://polygon-mumbai.g.alchemy.com/v2/mvn8yXjnnPQs7YkhUxoBL7UZx4CyHWv-",
      accounts: [mnemonicWallet.privateKey]
    }
  },
  solidity: "0.8.17",
};