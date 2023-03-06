// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts (last updated v4.8.0) (token/ERC20/ERC20.sol)

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NominationToken is ERC20, Ownable {

    address public admin;

    constructor() ERC20("FoundryNominationToken", "FNT") {
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

    function mint(uint256 amount, address[] memory toAddresses) public {
        require(_msgSender() == admin, "No minting your own money!");
        // Give everyone in the array of addresses  a payday!
        for (uint i = 0; i < toAddresses.length; i++) {
            _mint(toAddresses[i], amount);
        }
    }

    function burn(address account, uint256 amount) public {
        require(_msgSender() == admin, "No burning your own money!");
        _burn(account, amount);
    }
}