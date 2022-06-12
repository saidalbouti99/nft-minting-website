// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract VanGoghNFT is ERC721,ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;
    uint256 public mintPrice;
    uint256 public maxPerWallet;
    mapping(string => uint8) mintedURIs;
    bool public isPublicMintEnabled;
    mapping(address => uint256) public walletMints;

    constructor() payable ERC721("VanGoghNFT", "VGN") {
        mintPrice = 0.02 ether;
        maxPerWallet = 10;
    }

    function _baseURI() internal pure override returns (string memory) {
        return "ipfs://";
    }

    function setIsPublicMintEnabled(bool _isPublicMintEnabled) external onlyOwner{
        isPublicMintEnabled=_isPublicMintEnabled;
    }

    function safeMint(address to, string memory uri) public onlyOwner {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        mintedURIs[uri] = 1;
    }


    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

     function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }


    function isURIOwned(string memory uri) public view returns (bool) {
        return mintedURIs[uri] == 1;
    }

    function payToMint(
        address recipient,
        string memory metadataURI
    ) public payable returns (uint256) {
        require(isPublicMintEnabled,'Minting not enabled');
        require(mintedURIs[metadataURI] != 1, 'NFT already minted!');
        require (msg.value >= 0.02 ether, 'Not enough ETH!');
        require(walletMints[msg.sender] + 1 <= maxPerWallet,'Exceed max NFT per wallet');

        uint256 newItemId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        mintedURIs[metadataURI] = 1;

        _mint(recipient, newItemId);
        _setTokenURI(newItemId, metadataURI);

        return newItemId;
    }

    function count() public view returns (uint256) {
        return _tokenIdCounter.current();
    }
}

