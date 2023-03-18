// contracts/Box.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Import Ownable from the OpenZeppelin Contracts library
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IERC20_nomination.sol";
import "./interfaces/IERC20_reward.sol";
import "./tokens/NominationToken.sol";
import "./tokens/RewardToken.sol";
import "./tokens/Values_NFT.sol";

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

    Values_NFT public valuesNFT;
    IERC721 public nftContract;

    // FT contracts
    IERC20_nomination public nominationTokens;
    IERC20_reward public rewardTokens;

    // *********************************************** Talk to frontend team about logging on the front
    // log of all users' value nominations in this epoch
    mapping(address => mapping(uint8 => uint256)) public log;

    // Nomination token values (defaulted to 5)
    uint256 newNomTokensAmount;
    uint256 epochTime; // blocks?  timestamp?
    
    // whitelist of all employees in organization
    mapping(address => bool) public whitelist;

    // array of all employees in whitelist
    address[] public whitelistArray;

    // Events:
    event NewNomination(address _nominated, address nominator, string _value, uint256 _amount, string message);

    // Pass all contracts for FT, NFT addresses
    constructor(string memory _name, string memory _symbol) {

        Values_NFT valuesNFTContract = new Values_NFT(_name, _symbol);
        NominationToken nomToken = new NominationToken();
        RewardToken rewToken = new RewardToken();

        valuesNFT = Values_NFT(address(valuesNFTContract));
        nominationTokens = IERC20_nomination(address(nomToken));
        rewardTokens = IERC20_reward(address(rewToken));

        valuesNFT.mintNFT(msg.sender, 1);
        valuesNFT.mintNFT(msg.sender, 2);
        valuesNFT.mintNFT(msg.sender, 3);
        valuesNFT.mintNFT(msg.sender, 4);
        valuesNFT.mintNFT(msg.sender, 5);
        valuesNFT.mintNFT(msg.sender, 6);

        newNomTokensAmount = 5;
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

    // Only callable by the admin
    function addToWhitelist(address addy) onlyOwner public {
        require(!onWhitelist(addy), "This address is already whitelisted");
        whitelist[addy] = true;
        whitelistArray.push(addy);
    }

    // if time allows, restrict to onlyOwner
    function removeFromWhitelist(address addy) onlyOwner _onWhitelist(addy) public {
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
    function addNomTokens() onlyOwner public {
        nominationTokens.mint(newNomTokensAmount, whitelistArray);
    }

    // Set new amount of nomination tokens generated each period
    function setNomTokens(uint256 num) public {
        newNomTokensAmount = num;
    }

    // Requires calling address to first approve transfer of at least <amount> to this contract
    function nominate(address toAddress, uint256 amount, uint8 value, string memory message) _onWhitelist(toAddress) public {
        // require nomination tokens
        require(nominationTokens.balanceOf(msg.sender) >= amount, "You don't have enough tokens. Try being a better person?");
        // check that <value> exists
        require(value <= 5, "We don't care about that value here. Like, not at all.");
        // FT transferFrom caller(no permissions should be required)
        nominationTokens.transferFrom(msg.sender, address(this), amount);
        // mint <amount> of Reward Token (FT) to toAddress
        rewardTokens.mint(amount, toAddress, msg.sender);
        // burn nomination tokens that were just recieved
        nominationTokens.burn(msg.sender, amount);
        // emit nomination event with caller's address, <value>, and <amount>
        emit NewNomination(toAddress, msg.sender, getValuesByUint(Values(value)), amount, message);
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
    function transferValueNFT(uint8 value, address from, address to) onlyOwner _onWhitelist(to) public {
        // call NFT contract by value and transfer to <toAddress>
        nftContract = IERC721(valuesNFT);
        require(nftContract.balanceOf(from) > 0, "'from' address doesn't have a balance");
        require(nftContract.ownerOf(value) == from, "'from' address doesn't currently have this value NFT");
        nftContract.transferFrom(from, to, value);
    }

    // ***************************************************************************************
    // Random stuff
    // ***************************************************************************************

    function getValuesByUint(Values value) internal pure returns (string memory valueString) {
        if (value == Values.ChopTheWood) {
            valueString = "Chop The Wood";
        } else if (value == Values.ParachuteMind) {
            valueString = "Parachute Mind";
        } else if (value == Values.BendDontBreak) {
            valueString = "Bend, Don't Break";
        } else if (value == Values.PoolTogether) {
            valueString = "Pool Together";
        } else if (value == Values.NoSuitsRequired) {
            valueString = "No Suits Required";
        } else if (value == Values.RocketToTheMoon) {
            valueString = "Rocket To The Moon";
        } else {
            valueString = "We don't value that here";
        }
    }
}