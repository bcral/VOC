const {
    loadFixture,
  } = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { monitorEventLoopDelay } = require("perf_hooks");
  
describe("Nomination Token", function () {
  
    async function getContractAndArgs() {

        // Contracts are deployed using the first signer/account by default
        const [owner, addy1, addy2, addy3] = await ethers.getSigners();

        const NominationToken = await ethers.getContractFactory("NominationToken");
        const nominationToken = await NominationToken.deploy();

        return { nominationToken, owner, addy1, addy2 };
    }

    describe("Nomination token contract tests", function () {
        describe("Deployment tests", function () {
            it("Should deploy and check owner", async function () {
                const { nominationToken, owner, addy1 } = await loadFixture(
                    getContractAndArgs
                );
        
                expect(await nominationToken.owner()).to.equal(owner.address);
            });
        });
        describe("Token minting tests", function () {
            it("Mint tokens", async function () {
                const { nominationToken, owner, addy1, addy2} = await loadFixture(
                    getContractAndArgs
                );

                await nominationToken.mint(5, [addy1.address, addy2.address]);
        
                expect(await nominationToken.balanceOf(owner.address)).to.equal(0);
                expect(await nominationToken.balanceOf(addy1.address)).to.equal(5);
                expect(await nominationToken.balanceOf(addy2.address)).to.equal(5);
            });
        });
        describe.only("Token transfer tests", function () {
            it("Attempt to transfer tokens with transfer() function", async function () {
                const { nominationToken, owner, addy1, addy2} = await loadFixture(
                    getContractAndArgs
                );

                await nominationToken.mint(5, [addy1.address, addy2.address]);

                expect(await nominationToken.balanceOf(addy1.address)).to.equal(5);
                expect(await nominationToken.balanceOf(addy2.address)).to.equal(5);
        
                // Attempt to transfer tokens shouldn't panic, but shouldn't actually transfer any
                // tokens, because they cannot be transferred - only spent.
                await nominationToken.connect(addy1).transfer(addy2.address, 3);

                expect(await nominationToken.balanceOf(addy1.address)).to.equal(5);
                expect(await nominationToken.balanceOf(addy2.address)).to.equal(5);
            });

            it("Attempt to transfer tokens with transferFrom()", async function () {
                const { nominationToken, owner, addy1, addy2} = await loadFixture(
                    getContractAndArgs
                );

                await nominationToken.mint(5, [addy1.address]);

                expect(await nominationToken.balanceOf(addy1.address)).to.equal(5);
                expect(await nominationToken.balanceOf(addy2.address)).to.equal(0);

                // Allow this address to transferFrom itself, 5 tokens
                await nominationToken.connect(addy1).approve(addy1.address, 5);
        
                // Attempt to transfer tokens shouldn't panic, but shouldn't actually transfer any
                // tokens, because they cannot be transferred - only spent.
                await nominationToken.connect(addy1).transferFrom(addy1.address, addy2.address, 3);

                expect(await nominationToken.balanceOf(addy1.address)).to.equal(5);
                expect(await nominationToken.balanceOf(addy2.address)).to.equal(0);
            });
        });
    });
});