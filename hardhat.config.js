/* hardhat.config.js */
require("@nomiclabs/hardhat-waffle")
require("@nomiclabs/hardhat-etherscan")

const fs = require('fs')
const privateKey = fs.readFileSync(".secret").toString().trim() || "01234567890123456789"

// For deploying to testnet
const INFURA_RINKEBY_URL = "https://rinkeby.infura.io/v3/2232dd82097143d09fc226844346895e"
const RINKEBY_WALLET_PK = '0x6719d2a3437b78a2dc40948543f18f968812756cc3a7dd8b4c81dc8b9165b6ec'

// For verifying a contract after it has been deployed on main or testnet
// THIS IS NOT AUTOMATED. You must run the verify command (provided by the hardhat-etherscan plugin)
// For example: hh verify --network rinkeby 0x4aBe3384567F2E82fA1B98DfD9D422f593d17651
const ETHERSCAN_API_KEY = "Q4KYSIFYTUNS4C6WMJCD8JAIQ4XVKM4W4H"

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