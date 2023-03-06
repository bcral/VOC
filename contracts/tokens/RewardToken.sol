// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts (last updated v4.8.0) (token/ERC20/ERC20.sol)

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RewardToken is ERC20, Ownable {

    address admin;

    constructor() ERC20("FoundryRewardToken", "FRT") {
    }

    function claim(address newOwner) public {
        // require(admin == address(0), "admin role is already claimed. But feel free to try again?");
        admin = newOwner;
    }

    function mint(uint256 amount, address toAddress, address fromAddress) public {
        require(msg.sender == admin, "No minting your own money!");
        // Give the referred their new spendable tokens
        _mint(toAddress, amount);
        // And the same to the referrer
        _mint(fromAddress, amount);
    }
}
