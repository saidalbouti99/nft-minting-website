const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("VanGoghNFT", function () {
  it("Should mint and transfer an NFT to someone", async function () {
    const VanGoghNFT = await ethers.getContractFactory("VanGoghNFT");
    const vanGoghNFT = await VanGoghNFT.deploy();
    await vanGoghNFT.deployed();

    const recipient = "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199";
    const metadataURI = "cid/test.png";

    let balance = await vanGoghNFT.balanceOf(recipient);
    expect(balance).to.equal(0);
    vanGoghNFT.setIsPublicMintEnabled(true);

    const newlyMintedToken = await vanGoghNFT.payToMint(
      recipient,
      metadataURI,
      {
        value: ethers.utils.parseEther("0.02"),
      }
    );

    // wait until the transaction is mined
    await newlyMintedToken.wait();

    balance = await vanGoghNFT.balanceOf(recipient);
    expect(balance).to.equal(1);

    expect(await vanGoghNFT.isURIOwned(metadataURI)).to.equal(true);
    const newlyMintedToken2 = await vanGoghNFT.payToMint(recipient, "foo", {
      value: ethers.utils.parseEther("0.02"),
    });
  });
});
