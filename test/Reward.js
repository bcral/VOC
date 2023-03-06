const {
    loadFixture,
  } = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
  
describe("Reward Token", function () {
  
    async function getContractAndArgs() {

        // Contracts are deployed using the first signer/account by default
        const [owner, addy1, addy2, addy3] = await ethers.getSigners();

        const RewardToken = await ethers.getContractFactory("RewardToken");
        const rewardToken = await RewardToken.deploy();

        return { rewardToken, owner, addy1 };
    }
  
    describe("Reward token contract tests", function () {
        describe("Deployment tests", function () {
            it("Should deploy and check owner", async function () {
                const { rewardToken, owner } = await loadFixture(
                    getContractAndArgs
                );
        
                expect(await rewardToken.owner()).to.equal(owner.address);
            });
        });
        describe("Token transfer tests", function () {
            it("Should do whatever it does", async function () {
                const { rewardToken, owner, addy1 } = await loadFixture(
                    getContractAndArgs
                );

                
        
                expect(await rewardToken.owner()).to.equal(owner.address);
            });
        });
    });
});