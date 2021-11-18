const { ethers } = require("hardhat")
const { expect } = require("chai")
const { beforeEach } = require("mocha")


describe("ERC20", function() {

  let Token, token, owner, acct1, acc2

  beforeEach(async () => {
    [owner, acct1, acct2, _] = await ethers.getSigners()
    Token = await ethers.getContractFactory("Token")
    token = await Token.deploy()
    await token.deployed()
  })


  it("Should deploy and belong to the owner", async () => {
    expect(await token.owner()).to.equal(owner.address)
  })

  it("Should assign the total supply of tokens to the owner", async () => {
    const ownerBalance = await token.balanceOf(owner.address)
    expect(await token.totalSupply()).to.equal(ownerBalance);
  })

  it("Should support transactions between accounts", async function() {  
    // transfer 50 tokens from owner to acct1
    await token.transfer(acct1.address, 50)
    const acct1Balance = await token.balanceOf(acct1.address)
    expect(acct1Balance).to.equal(50)

    // transfer 50 tokens from acct1 to acct2
    await token.connect(acct1).transfer(acct2.address,50)
    const acct2Balance = await token.balanceOf(acct2.address)
    expect(acct2Balance).to.equal(50)
  })

  it("Should update balances after transfers", async () => {
    const initialBalanceOfOwner = await token.balanceOf(owner.address)
    await token.transfer(acct1.address, 100)
    await token.transfer(acct2.address, 50)

    const finalOwnerBalance = await token.balanceOf(owner.address)
    expect(finalOwnerBalance).to.equal(initialBalanceOfOwner - 150)

    const acct1Balance = await token.balanceOf(acct1.address)
    expect(acct1Balance).to.equal(100)

    const acct2Balance = await token.balanceOf(acct2.address)
    expect(acct2Balance).to.equal(50)
  })


})


describe("NFTMarket", function() {
  it("Should create and execute market sales", async function() {
    /* deploy the marketplace */
    const Market = await ethers.getContractFactory("NFTMarket")
    const market = await Market.deploy()
    await market.deployed()
    const marketAddress = market.address

    /* deploy the NFT contract */
    const NFT = await ethers.getContractFactory("NFT")
    const nft = await NFT.deploy(marketAddress)
    await nft.deployed()
    const nftContractAddress = nft.address

    let listingPrice = await market.getListingPrice()
    listingPrice = listingPrice.toString()

    const auctionPrice = ethers.utils.parseUnits('1', 'ether')

    /* create two tokens */
    await nft.createToken("https://www.mytokenlocation.com")
    await nft.createToken("https://www.mytokenlocation2.com")
  
    /* put both tokens for sale */
    await market.createMarketItem(nftContractAddress, 1, auctionPrice, { value: listingPrice })
    await market.createMarketItem(nftContractAddress, 2, auctionPrice, { value: listingPrice })
    
    const [_, buyerAddress] = await ethers.getSigners()
  
    /* execute sale of token to another user */
    await market.connect(buyerAddress).createMarketSale(nftContractAddress, 1, { value: auctionPrice})

    /* query for and return the unsold items */
    let items = await market.fetchMarketItems()
    items = await Promise.all(items.map(async i => {
      const tokenUri = await nft.tokenURI(i.tokenId)
      let item = {
        price: i.price.toString(),
        tokenId: i.tokenId.toString(),
        seller: i.seller,
        owner: i.owner,
        tokenUri
      }
      return item
    }))
    //console.log('items: ', items)
  })
})