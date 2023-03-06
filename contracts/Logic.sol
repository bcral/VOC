// contracts/Box.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Import Ownable from the OpenZeppelin Contracts library
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IERC721.sol";
import "./interfaces/IERC20_nomination.sol";
import "./interfaces/IERC20_reward.sol";

// TODO add access controls if time allows.
contract Logic is Ownable {

    // Values enum
    enum Values {
        ChopTheWood,
        ParachuteMind,
        BendDontBreak,
        PoolTogether,
        NoSuitsRequired,
        RocketToTheMoon
    }

    address[] public valuesArray;
    IERC721 public nftContract;

    // FT contracts
    IERC20_nomination public nominationTokens;
    IERC20_reward public rewardTokens;

    // *********************************************** Talk to frontend team about logging on the front
    // log of all users' value nominations in this epoch
    mapping(address => mapping(uint8 => uint256)) public log;

    // Nomination token values defaulted to 5
    uint256 newNomTokensAmount = 5;
    uint256 epochTime; // blocks?  timestamp?

    // whitelist of all employees in organization
    mapping(address => bool) public whitelist;

    // array of all employees in whitelist
    address[] public whitelistArray;

    // Events:
    event NewNomination(address _nominated, address nominator, uint8 _value, uint256 _amount, string message);

    // Pass all contracts for FT, NFT addresses
    constructor(address[] memory valuesNFTs, address _nomTokens, address _reTokens) {
        valuesArray = valuesNFTs;

        nominationTokens = IERC20_nomination(_nomTokens);
        rewardTokens = IERC20_reward(_reTokens);
    }

    // Function for initializing all dummy data for hackathon demo
    function initialize() onlyOwner public {
        // Add a bunch of dummy data to populate everything for hackathon demo
        // Give this contract sole transfer rights for NFTs
        // It's super secure.  Don't worry about it.
        for (uint8 i = 0; i < valuesArray.length; i++) {
            IERC721(valuesArray[i]).addAdmin(address(this));
        }
    }

    // ***************************************************************************************
    // Whitelist stuff
    // ***************************************************************************************

    modifier _onWhitelist(address addy) {
        require(onWhitelist(addy), "This address is not in the whitelist");
        _;
    }

    // check if the passed address is on whitelist or not
    function onWhitelist(address addy) public view returns(bool) {
        if (whitelist[addy]) {
            return true;
        } else {
            return false;
        }
    }

    // if time allows, restrict to onlyOwner
    function addToWhitelist(address addy) public {
        require(!onWhitelist(addy), "This address is already whitelisted");
        whitelist[addy] = true;
        whitelistArray.push(addy);
    }

    // if time allows, restrict to onlyOwner
    function removeFromWhitelist(address addy) _onWhitelist(addy) public {
        whitelist[addy] = false;
        // This part sucks. Loops in Solidity suck.
        for (uint256 i = 0; i < whitelistArray.length; i++) {
            if (whitelistArray[i] == addy) {
                whitelistArray[i] = whitelistArray[whitelistArray.length - 1];
                whitelistArray.pop();
                break;
            } 
        }
    }

    // ***************************************************************************************
    // Nomination Token stuff
    // ***************************************************************************************

    // Used by admin to generate new nomination tokens at whatever interval
    // Add access controls if time
    // Add limits for how often this can happen if time
    function addNomTokens() public {
        nominationTokens.mint(newNomTokensAmount, whitelistArray);
    }

    // Set new amount of nomination tokens generated each period
    function setNomTokens(uint256 num) public {
        newNomTokensAmount = num;
    }

    // Requires calling address to first approve transfer of at least <amount> to this contract
    function nominate(address toAddress, uint256 amount, uint8 value, string memory message) public {
        // require nomination tokens
        require(nominationTokens.balanceOf(msg.sender) >= amount, "You don't have enough tokens. Try being a better person?");
        // check that <value> exists
        require(value <= 5, "We don't care about that value here. Like, not at all.");
        // FT transferFrom caller(no permissions should be required)
        nominationTokens.transferFrom(msg.sender, address(this), amount);
        // mint <amount> of Reward Token (FT) to toAddress
        rewardTokens.mint(amount, toAddress, msg.sender);
        // burn nomination tokens that were just recieved
        nominationTokens.burn(address(this), amount);
        // emit nomination event with caller's address, <value>, and <amount>
        emit NewNomination(toAddress, msg.sender, value, amount, message);
    }

    // ***************************************************************************************
    // Referral Token stuff
    // ***************************************************************************************

    // Function for spending your rewards for being such an amazing employee!
    function redeemTokens(uint256 amount) public {
        // Handle this somewhere else.  In the "store" contract.
        // Burn tokens after spending.
    }

    // ***************************************************************************************
    // Values NFT stuff
    // ***************************************************************************************

    // if time allows, restrict to onlyOwner
    function transferValueNFT(uint8 value, address toAddress) _onWhitelist(toAddress) public {
        // call NFT contract by value and transfer to <toAddress>
        nftContract = IERC721(getNFTAddress(value));
    }

    // ***************************************************************************************
    // Random stuff
    // ***************************************************************************************

    function getNFTAddress(uint8 value) internal view returns (address) {
        return valuesArray[value];
    }
}