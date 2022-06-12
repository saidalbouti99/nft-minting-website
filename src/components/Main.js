import { useState, useEffect } from "react";
import { ethers, BigNumber } from "ethers";
import VanGoghNFT from "../VanGoghNFT.json";
import "./Main.css";

const vanGoghNFTAddress = "0x1474Eb79cB3215304Fb5bF2D335C4B30bc8b2935";

const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const contract = new ethers.Contract(vanGoghNFTAddress, VanGoghNFT.abi, signer);

function Main({ accounts, setAccounts }) {
  const [mintAmount, setMintAmount] = useState(1);
  const [balance, setBalance] = useState();
  const [totalMinted, setTotalMinted] = useState(0);
  const isConnected = Boolean(accounts[0]);

  useEffect(() => {
    getCount();
  }, []);

  const getCount = async () => {
    const count = await contract.count();
    console.log(parseInt(count));
    setTotalMinted(parseInt(count));
  };

  const getBalance = async () => {
    const [account] = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const balance = await provider.getBalance(account);
    setBalance(ethers.utils.formatEther(balance));
  };

  return (
    <div className="section">
      <h1 className="title">Van Gogh NFT</h1>
      <p>NFT in the form of Van Gogh Art!</p>

      {isConnected ? (
        <div>
          <h4>Your balance : {balance}</h4>
          <button onClick={() => getBalance()}>My Balance</button>
        </div>
      ) : (
        <p>Your wallet must be connected to view your balance</p>
      )}
      <div className="container">
        <div className="row">
          {Array(totalMinted + 1)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="col-sm">
                <NFTImage tokenId={i} getCount={getCount} />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
function NFTImage({ tokenId, getCount }) {
  const contentId = "QmbMxZaK5K8XXDaT2N7uN9ekvepe3ePaQTmsnMuKWg1vnS";
  const metadataURI = `${contentId}/${tokenId}.json`;
  const imageURI = `https://gateway.pinata.cloud/ipfs/${contentId}/${tokenId}.png`;
  // const imageURI = `../img/${tokenId}.png`;

  const [isMinted, setIsMinted] = useState(false);

  useEffect(() => {
    getMintedStatus();
  }, [isMinted]);

  const getMintedStatus = async () => {
    const result = await contract.isURIOwned(metadataURI);
    console.log(result);
    setIsMinted(result);
  };

  const mintToken = async () => {
    const connection = contract.connect(signer);
    const addr = connection.address;
    const result = await contract.payToMint(addr, metadataURI, {
      value: ethers.utils.parseEther("0.02"),
    });

    await result.wait();
    getMintedStatus();
    getCount();
  };

  async function getURI() {
    const uri = await contract.tokenURI(tokenId);
    alert(uri);
  }
  return (
    <div className="card" style={{ width: "18rem" }}>
      <img
        className="card-img-top"
        src={isMinted ? imageURI : "img/placeholder.png"}
      ></img>
      <div className="card-body">
        <h5 className="card-title">ID #{tokenId}</h5>
        {!isMinted ? (
          <button className="btn btn-primary" onClick={mintToken}>
            Mint
          </button>
        ) : (
          <button className="btn btn-secondary" onClick={getURI}>
            Taken! Show URI
          </button>
        )}
      </div>
    </div>
  );
}
export default Main;
