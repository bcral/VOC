const {
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("Logic Contract", function () {

  async function addresses() {
    let addressArray = [];
    for (i=0; i>10; i++) {
      const [address] = await ethers.getSigners();
      addressArray.push(address);
    }
    return addressArray;
  };

  const nfts = [
    ["Chop The Wood", "CTW"],
    ["Parachute Mind", "PM"],
    ["Bend Dont Break", "BDB"],
    ["Pool Together", "PT"],
    ["No Suits Required", "NSR"],
    ["Rocket To The Moon", "RTM"]
  ];

  async function deployTokens() {

    let nftArray = [];

    // deploy nft contracts
    for (i = 0; i < nfts.length; i++) {
        tokenName = nfts[i][0];
        tokenSymbol = nfts[i][1];

        let ValuesNFT = await ethers.getContractFactory("Values_NFT");
        let valuesNFT = await ValuesNFT.deploy(tokenName, tokenSymbol);

        nftArray.push(valuesNFT.address);
    };

    // deploy nomination token contract
    const NominationToken = await ethers.getContractFactory("NominationToken");
    const nominationToken = await NominationToken.deploy();

    // deploy reward token contract
    const RewardToken = await ethers.getContractFactory("RewardToken");
    const rewardToken = await RewardToken.deploy();

    return { nftArray, nominationToken, rewardToken };
  }

  async function getLogicAndArgs() {

    // Contracts are deployed using the first signer/account by default
    const [owner, addy1, addy2, addy3] = await ethers.getSigners();

    const { nftArray, nominationToken, rewardToken } = await deployTokens();

    const Logic = await ethers.getContractFactory("Logic");
    const logic = await Logic.deploy(nftArray, nominationToken.address, rewardToken.address);

    return { logic, owner, addy1, nftArray, nominationToken, rewardToken };
  }

  describe("Logic contract tests", function () {
    describe("Deployment tests", function () {
      it("Should check that logic deployed correctly", async function () {
          const { logic, owner, nftArray, nominationToken, rewardToken } = await loadFixture(
              getLogicAndArgs
          );
          // check nft addresses
          expect(await logic.valuesArray(0)).to.equal(nftArray[0]);
          expect(await logic.valuesArray(1)).to.equal(nftArray[1]);
          expect(await logic.valuesArray(2)).to.equal(nftArray[2]);
          expect(await logic.valuesArray(3)).to.equal(nftArray[3]);
          expect(await logic.valuesArray(4)).to.equal(nftArray[4]);
          expect(await logic.valuesArray(5)).to.equal(nftArray[5]);
          // check nomination token address
          expect(await logic.nominationTokens()).to.equal(nominationToken.address);
          // check reward token address
          expect(await logic.rewardTokens()).to.equal(rewardToken.address);
      });
      it("Should check that logic argument addresses match other contracts", async function () {
        const { logic, owner, nftArray, nominationToken, rewardToken } = await loadFixture(
            getLogicAndArgs
        );

        // check nft addresses
        expect(await logic.valuesArray(0)).to.equal(nftArray[0]);
      });
    });
  });
});
