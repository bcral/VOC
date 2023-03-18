// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts (last updated v4.8.0) (token/ERC20/ERC20.sol)

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RewardToken is ERC20, Ownable {

    address admin;

    constructor() ERC20("FoundryRewardToken", "FRT") {
        admin = msg.sender;
    }

    // Transfer stuff to make stuff not work like stuff is supposed to work and stuff
    function transfer(address to, uint256 amount) public override returns (bool) {
        // Do nothing at all.
        return true;
    }

    // TransferFrom stuff to make stuff not work like stuff is supposed to work and stuff
    function transferFrom(address from, address to, uint256 amount) public override returns (bool) {
        // Do nothing at all.
        return true;
    }

    function mint(uint256 amount, address toAddress, address fromAddress) public {
        require(msg.sender == admin, "No minting your own money!");
        // Give the referred their new spendable tokens
        _mint(toAddress, amount);
        // And the same to the referrer
        _mint(fromAddress, amount);
    }
}
