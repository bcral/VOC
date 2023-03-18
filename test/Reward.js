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

        return { rewardToken, owner, addy1, addy2, addy3 };
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
        describe("Token mint tests", function () {
            it("Should mint 5 tokens to both addresses.", async function () {
                const { rewardToken, owner, addy1, addy2, addy3 } = await loadFixture(
                    getContractAndArgs
                );
                // Mint mimics a nomination from the logic contract
                // So the nominator and nominated are both minted tokens
                await rewardToken.connect(owner).mint(5, addy1.address, addy2.address);
        
                expect(await rewardToken.balanceOf(addy1.address)).to.equal(5);
                expect(await rewardToken.balanceOf(addy2.address)).to.equal(5);
                expect(await rewardToken.balanceOf(addy3.address)).to.equal(0);
            });
        });
        describe("Token transfer tests", function () {
            it("Should not be able to be transferred by anyone.", async function () {
                const { rewardToken, owner, addy1, addy2 } = await loadFixture(
                    getContractAndArgs
                );

                await rewardToken.connect(owner).mint(5, addy1.address, addy2.address);

                // Attempt to transfer tokens shouldn't panic, but shouldn't actually transfer any
                // tokens, because they cannot be transferred - only spent.
                await rewardToken.connect(addy1).transferFrom(addy1.address, addy2.address, 3);
        
                expect(await rewardToken.balanceOf(addy1.address)).to.equal(5);
                expect(await rewardToken.balanceOf(addy2.address)).to.equal(5);
            });
        });
    });
});