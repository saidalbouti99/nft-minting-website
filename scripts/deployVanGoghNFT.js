const hre = require("hardhat");

async function main() {
  const VanGoghNFT = await hre.ethers.getContractFactory("VanGoghNFT");
  const vanGoghNFT = await VanGoghNFT.deploy();

  await vanGoghNFT.deployed();

  console.log("VanGoghNFT deployed to:", vanGoghNFT.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
