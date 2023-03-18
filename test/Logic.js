const {
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Logic Contract", function () {

  const nfts = [
    ["Chop The Wood", "CTW"],
    ["Parachute Mind", "PM"],
    ["Bend Dont Break", "BDB"],
    ["Pool Together", "PT"],
    ["No Suits Required", "NSR"],
    ["Rocket To The Moon", "RTTM"]
  ];

  async function getLogicAndArgs() {

    // Contracts are deployed using the first signer/account by default
    const [owner, addy1, addy2, addy3, addy4] = await ethers.getSigners();

    const Logic = await ethers.getContractFactory("Logic");
    const logic = await Logic.deploy("Foundry Value Token", "FVT");

    const nomAddy = await logic.nominationTokens();
    const rewAddy = await logic.rewardTokens();
    const nftAddy = await logic.valuesNFT();

    let NOM = await ethers.getContractFactory("NominationToken");
    let REW = await ethers.getContractFactory("RewardToken");
    let NFT = await ethers.getContractFactory("Values_NFT");
    let nominationToken = await NOM.attach(nomAddy);
    let rewardToken = await REW.attach(rewAddy);
    let valuesNFT = await NFT.attach(nftAddy);

    return { logic, owner, addy1, addy2, addy3, addy4, valuesNFT, nominationToken, rewardToken };
  }

  describe("Logic contract tests", function () {
    describe("Deployment tests", function () {
      it("Should check that logic deployed correctly", async function () {
        const { logic, owner, valuesNFT, nominationToken, rewardToken } = await loadFixture(
            getLogicAndArgs
        );
        // check nft address
        expect(await logic.valuesNFT()).to.equal(valuesNFT.address);
        // check nomination token address
        expect(await logic.nominationTokens()).to.equal(nominationToken.address);
        // check reward token address
        expect(await logic.rewardTokens()).to.equal(rewardToken.address);
      });
    });
    describe("Whitelist tests", function () {
      it("Should confirm that only admin can add to whitelist", async function () {
        const { logic, owner, addy1, addy2, addy3, addy4, rewardToken } = await loadFixture(
            getLogicAndArgs
        );
        
        await logic.connect(owner).addToWhitelist(addy1.address);
        await logic.connect(owner).addToWhitelist(addy2.address);
        await logic.connect(owner).addToWhitelist(addy3.address);

        expect(await logic.onWhitelist(addy1.address)).to.equal(true);
        expect(await logic.onWhitelist(addy2.address)).to.equal(true); 
        expect(await logic.onWhitelist(addy3.address)).to.equal(true); 
        expect(await logic.onWhitelist(addy4.address)).to.equal(false); 

        await expect(logic.connect(addy1).addToWhitelist(addy4.address))
          .to.be.revertedWith(
              "Ownable: caller is not the owner"
        );

        await expect(logic.connect(owner).addToWhitelist(addy2.address))
          .to.be.revertedWith(
              "This address is already whitelisted"
        );
      });
      it("Should confirm that admin can remove from whitelist", async function () {
        const { logic, owner, addy1, addy2, addy3, addy4, rewardToken } = await loadFixture(
          getLogicAndArgs
        );
        
        await logic.connect(owner).addToWhitelist(addy1.address);
        await logic.connect(owner).addToWhitelist(addy2.address);
        await logic.connect(owner).addToWhitelist(addy3.address);

        expect(await logic.onWhitelist(addy1.address)).to.equal(true);
        expect(await logic.onWhitelist(addy2.address)).to.equal(true); 
        expect(await logic.onWhitelist(addy3.address)).to.equal(true);

        await logic.removeFromWhitelist(addy2.address);

        expect(await logic.onWhitelist(addy2.address)).to.equal(false);

        await expect(logic.connect(owner).removeFromWhitelist(addy2.address))
          .to.be.revertedWith(
              "This address is not in the whitelist"
        );

        await expect(logic.connect(addy1).removeFromWhitelist(addy2.address))
          .to.be.revertedWith(
              "Ownable: caller is not the owner"
        );
        await expect(logic.connect(addy1).removeFromWhitelist(addy3.address))
          .to.be.revertedWith(
              "Ownable: caller is not the owner"
        );
      });
      it("Should confirm that mint only works for whitelisted addresses", async function () {
        const { logic, owner, addy1, addy2, addy3, addy4, nominationToken } = await loadFixture(
            getLogicAndArgs
        );

        await logic.connect(owner).addNomTokens();

        expect(await nominationToken.balanceOf(addy1.address)).to.equal(0);
        expect(await nominationToken.balanceOf(addy2.address)).to.equal(0);
        expect(await nominationToken.balanceOf(addy3.address)).to.equal(0);
        expect(await nominationToken.balanceOf(addy4.address)).to.equal(0);

        await logic.connect(owner).addToWhitelist(addy1.address);
        await logic.connect(owner).addToWhitelist(addy2.address);
        await logic.connect(owner).addToWhitelist(addy3.address);

        await logic.connect(owner).addNomTokens();

        expect(await nominationToken.balanceOf(addy1.address)).to.equal(5);
        expect(await nominationToken.balanceOf(addy2.address)).to.equal(5);
        expect(await nominationToken.balanceOf(addy3.address)).to.equal(5);
        expect(await nominationToken.balanceOf(addy4.address)).to.equal(0);

        await expect(logic.connect(addy1).addNomTokens())
          .to.be.revertedWith(
              "Ownable: caller is not the owner"
        );
      });
      it("Should confirm that only whitelisted addresses can be nominated", async function () {
        const { logic, owner, addy1, addy2, addy3, addy4, nominationToken, rewardToken } = await loadFixture(
            getLogicAndArgs
        );

        await logic.connect(owner).addToWhitelist(addy1.address);
        await logic.connect(owner).addToWhitelist(addy2.address);
        await logic.connect(owner).addToWhitelist(addy3.address);

        await logic.connect(owner).addNomTokens();

        expect(await nominationToken.balanceOf(addy1.address)).to.equal(5);
        expect(await nominationToken.balanceOf(addy2.address)).to.equal(5);
        expect(await nominationToken.balanceOf(addy3.address)).to.equal(5);
        expect(await nominationToken.balanceOf(addy4.address)).to.equal(0);

        await logic.connect(addy1).nominate(addy2.address, 1, 1, "You're the best!");

        expect(await nominationToken.balanceOf(addy1.address)).to.equal(4);
        expect(await nominationToken.balanceOf(addy2.address)).to.equal(5);

        expect(await rewardToken.balanceOf(addy1.address)).to.equal(1);
        expect(await rewardToken.balanceOf(addy2.address)).to.equal(1);

        await expect(logic.connect(addy1).nominate(addy4.address, 1, 1, "You're the best!"))
          .to.be.revertedWith(
              "This address is not in the whitelist"
        );

        expect(await nominationToken.balanceOf(addy1.address)).to.equal(4);
      });
    });
    describe("Nomination minting tests", function () {
      it("Should confirm that only whitelisted addresses can be nominated", async function () {
        const { logic, owner, addy1, addy2, addy3, addy4, nominationToken } = await loadFixture(
            getLogicAndArgs
        );

        await logic.connect(owner).addToWhitelist(addy1.address);
        await logic.connect(owner).addToWhitelist(addy2.address);
        await logic.connect(owner).addToWhitelist(addy3.address);

        await logic.connect(owner).addNomTokens();

        expect(await nominationToken.balanceOf(addy1.address)).to.equal(5);
        expect(await nominationToken.balanceOf(addy2.address)).to.equal(5);
        expect(await nominationToken.balanceOf(addy3.address)).to.equal(5);
        expect(await nominationToken.balanceOf(addy4.address)).to.equal(0);

        await logic.connect(addy1).nominate(addy2.address, 1, 1, "You're the best!");
        await logic.connect(addy2).nominate(addy3.address, 5, 3, "YOU are the best!");

        expect(await nominationToken.balanceOf(addy1.address)).to.equal(4);
        expect(await nominationToken.balanceOf(addy2.address)).to.equal(0);

        await logic.connect(owner).addNomTokens();

        expect(await nominationToken.balanceOf(addy1.address)).to.equal(5);
        expect(await nominationToken.balanceOf(addy2.address)).to.equal(5);
        expect(await nominationToken.balanceOf(addy3.address)).to.equal(5);
        expect(await nominationToken.balanceOf(addy4.address)).to.equal(0);
      });
    });
    describe("Values NFT tests", function () {
      it("Should confirm that NFTs can't be moved without belonging to the 'from address", async function () {
        const { logic, owner, addy1, addy2, addy3, addy4, valuesNFT } = await loadFixture(
            getLogicAndArgs
        );
        await logic.connect(owner).addToWhitelist(addy1.address);
        await logic.connect(owner).addToWhitelist(addy2.address);
        await logic.connect(owner).addToWhitelist(addy3.address);

        await expect(logic.connect(owner).transferValueNFT(1, addy1.address, addy2.address))
          .to.be.revertedWith(
            "'from' address doesn't have a balance"
          );

        expect(await valuesNFT.balanceOf(addy2.address)).to.equal(0);
      });
      it("Should confirm that NFT can't be moved from an address that doesn't currently own it", async function () {
        const { logic, owner, addy1, addy2, addy3, addy4, valuesNFT } = await loadFixture(
            getLogicAndArgs
        );
        await logic.connect(owner).addToWhitelist(addy1.address);
        await logic.connect(owner).addToWhitelist(addy2.address);
        await logic.connect(owner).addToWhitelist(addy3.address);

        await logic.connect(owner).transferValueNFT(3, owner.address, addy1.address);

        await expect(logic.connect(owner).transferValueNFT(2, addy1.address, addy2.address))
          .to.be.revertedWith(
            "'from' address doesn't currently have this value NFT"
          );
      });
      it("Should confirm that only the owner can move NFTs", async function () {
        const { logic, owner, addy1, addy2, addy3, addy4, valuesNFT } = await loadFixture(
            getLogicAndArgs
        );
        await logic.connect(owner).addToWhitelist(addy1.address);
        await logic.connect(owner).addToWhitelist(addy2.address);
        await logic.connect(owner).addToWhitelist(addy3.address);

        await logic.connect(owner).transferValueNFT(1, owner.address, addy2.address);

        expect(await valuesNFT.balanceOf(addy2.address)).to.equal(1);
        expect(await valuesNFT.ownerOf(1)).to.equal(addy2.address);
        expect(await valuesNFT.balanceOf(addy1.address)).to.equal(0);

        await expect(logic.connect(addy1).transferValueNFT(1, addy1.address, addy2.address))
          .to.be.revertedWith(
            "Ownable: caller is not the owner"
          );
      });
    });
  });
});
