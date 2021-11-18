const { ethers } = require("hardhat");
const fs = require('fs')


async function main() {
  const NFTMarket = await hre.ethers.getContractFactory("NFTMarket");
  const nftMarket = await NFTMarket.deploy();
  await nftMarket.deployed();
  console.log("nftMarket deployed to:", nftMarket.address);

  const NFT = await hre.ethers.getContractFactory("NFT");
  const nft = await NFT.deploy(nftMarket.address);
  await nft.deployed();
  console.log("nft deployed to:", nft.address);


  const [deployer] = await ethers.getSigners();
  console.log(`Deploying token contract with the account: ${deployer.address}`)

  const balance = await deployer.getBalance();
  console.log(`Account ETH balance: ${balance.toString()}`)
  const Token = await ethers.getContractFactory("Token");
  const token = await Token.deploy()
  console.log(`ERC20 Token Address ${token.address}`)

  const data = {
    tokenAddress: token.address,
    nftTokenAddress: nft.address,
    nftMarketAddress: nftMarket.address,
  }


  // write out the contract addresses to a json file
  fs.writeFileSync('contracts.json', JSON.stringify(data))

}

main()
 .then(() => process.exit(0))
 .catch((error) => {
  console.error(error);
  process.exit(1);
 });