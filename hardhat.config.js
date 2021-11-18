/* hardhat.config.js */
require("@nomiclabs/hardhat-waffle")
require("@nomiclabs/hardhat-etherscan")
require('dotenv').config();


// For deploying to mainnet
const MAINNET_WALLET_PK = process.env.MAINNET_WALLET_PK

// For deploying to testnet
const INFURA_RINKEBY_URL = process.env.INFURA_RINKEBY_URL
const RINKEBY_WALLET_PK = process.env.RINKEBY_WALLET_PK

// For verifying a contract after it has been deployed on main or testnet
// THIS IS NOT AUTOMATED. You must run the verify command (provided by the hardhat-etherscan plugin)
// For example: hh verify --network rinkeby 0x4aBe3384567F2E82fA1B98DfD9D422f593d17651
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY

module.exports = {
  defaultNetwork: "hardhat",
  etherscan: {
    apiKey: ETHERSCAN_API_KEY
  },
  networks: {
    hardhat: {
      chainId: 1337,
      forking: { 
        // forking from a mainnet allows us to leverage existing chainlink contracts
        // and test as if we were running on mainnet!
        url: "https://eth-mainnet.alchemyapi.io/v2/uriMC2lGhm2sTCEl3TIwEIjTNxzhcRZr"
      }
    },
    rinkeby: {
      url: INFURA_RINKEBY_URL,
      accounts: [RINKEBY_WALLET_PK]
    },
    mumbai: {
      url: "https://rpc-mumbai.matic.today",
      accounts: [privateKey]
    },
  },
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
}