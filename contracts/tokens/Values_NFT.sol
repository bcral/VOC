// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "./ERC721_values.sol";

/**
 * @dev 
 */
contract Values_NFT is ERC721_values, Ownable {

    constructor(string memory value, string memory symbol) ERC721_values(value, symbol) {}

    // Mints an NFT.  Pretty obvious.
    function mintNFT(address recipient, uint id)
        public onlyOwner
    {
        require(!super._exists(id), "This token already exists");
        _mint(recipient, id);
        // Set if we have time
    }
}