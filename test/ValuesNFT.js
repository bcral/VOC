const {
    loadFixture,
  } = require("@nomicfoundation/hardhat-network-helpers");
  const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
  const { expect } = require("chai");
  
describe("Values NFT Contract", function () {
  
    async function getValuesNFTsAndArgs() {
        // Contracts are deployed using the first signer/account by default
        const [owner, addy1, addy2, addy3] = await ethers.getSigners();

        let ValuesNFT = await ethers.getContractFactory("Values_NFT");

        let valuesNFT = await ValuesNFT.deploy("Foundry Value Token", "FVT");

        return { valuesNFT, owner, addy1, addy2 };
    }
  
    describe("NFT contract tests", function () {
        describe("Deployment tests", function () {
            it("Test CTW token name, symbol, and owner", async function () {
                const { valuesNFT, owner, addy1 } = await loadFixture(
                    getValuesNFTsAndArgs
                );

                await valuesNFT.mintNFT(addy1.address, 1);
        
                expect(await valuesNFT.balanceOf(addy1.address)).to.equal(1);
                expect(await valuesNFT.name()).to.equal("Foundry Value Token");
                expect(await valuesNFT.symbol()).to.equal("FVT");
                expect(await valuesNFT.ownerOf(1)).to.equal(addy1.address);
            });
            it("Test PM token name, symbol, and owner", async function () {
                const { valuesNFT, owner, addy1 } = await loadFixture(
                    getValuesNFTsAndArgs
                );

                await valuesNFT.mintNFT(addy1.address, 2);
        
                expect(await valuesNFT.balanceOf(addy1.address)).to.equal(1);
                expect(await valuesNFT.name()).to.equal("Foundry Value Token");
                expect(await valuesNFT.symbol()).to.equal("FVT");
                expect(await valuesNFT.ownerOf(2)).to.equal(addy1.address);
            });
            it("Test BDB token name, symbol, and owner", async function () {
                const { valuesNFT, owner, addy1 } = await loadFixture(
                    getValuesNFTsAndArgs
                );

                await valuesNFT.mintNFT(addy1.address, 3);
        
                expect(await valuesNFT.balanceOf(addy1.address)).to.equal(1);
                expect(await valuesNFT.name()).to.equal("Foundry Value Token");
                expect(await valuesNFT.symbol()).to.equal("FVT");
                expect(await valuesNFT.ownerOf(3)).to.equal(addy1.address);
            });
            it("Test PT token name, symbol, and owner", async function () {
                const { valuesNFT, owner, addy1 } = await loadFixture(
                    getValuesNFTsAndArgs
                );

                await valuesNFT.mintNFT(addy1.address, 4);
        
                expect(await valuesNFT.balanceOf(addy1.address)).to.equal(1);
                expect(await valuesNFT.name()).to.equal("Foundry Value Token");
                expect(await valuesNFT.symbol()).to.equal("FVT");
                expect(await valuesNFT.ownerOf(4)).to.equal(addy1.address);
            });
            it("Test NSR token name, symbol, and owner", async function () {
                const { valuesNFT, owner, addy1 } = await loadFixture(
                    getValuesNFTsAndArgs
                );

                await valuesNFT.mintNFT(addy1.address, 5);
        
                expect(await valuesNFT.balanceOf(addy1.address)).to.equal(1);
                expect(await valuesNFT.name()).to.equal("Foundry Value Token");
                expect(await valuesNFT.symbol()).to.equal("FVT");
                expect(await valuesNFT.ownerOf(5)).to.equal(addy1.address);
            });
            it("Test RTTM token name, symbol, and owner", async function () {
                const { valuesNFT, owner, addy1 } = await loadFixture(
                    getValuesNFTsAndArgs
                );

                await valuesNFT.mintNFT(addy1.address, 6);
        
                expect(await valuesNFT.balanceOf(addy1.address)).to.equal(1);
                expect(await valuesNFT.name()).to.equal("Foundry Value Token");
                expect(await valuesNFT.symbol()).to.equal("FVT");
                expect(await valuesNFT.ownerOf(6)).to.equal(addy1.address);
            });
        });
        describe("NFT transfer tests", function () {
            it("Test CTW token minting and transfer", async function () {

                const { valuesNFT, owner, addy1 } = await loadFixture(
                    getValuesNFTsAndArgs
                );

                await valuesNFT.mintNFT(owner.address, 0);

                expect(await valuesNFT.ownerOf(0)).to.equal(owner.address);
                expect(await valuesNFT.balanceOf(owner.address)).to.equal(1);
                expect(await valuesNFT.balanceOf(addy1.address)).to.equal(0);

                // transferFrom(addressFrom, addressTo, tokenId)
                await valuesNFT.transferFrom(owner.address, addy1.address, 0);

                expect(await valuesNFT.ownerOf(0)).to.equal(addy1.address);
                expect(await valuesNFT.balanceOf(owner.address)).to.equal(0);
                expect(await valuesNFT.balanceOf(addy1.address)).to.equal(1);
            });
            it("Test CTW token transfer by actual owner that isn't owner address", async function () {

                const { valuesNFT, owner, addy1, addy2 } = await loadFixture(
                    getValuesNFTsAndArgs
                );

                await valuesNFT.mintNFT(addy1.address, 0);

                expect(await valuesNFT.ownerOf(0)).to.equal(addy1.address);
                expect(await valuesNFT.balanceOf(addy1.address)).to.equal(1);

                // transferFrom(addressFrom, addressTo, tokenId)
                await expect(valuesNFT.connect(addy1).transferFrom(addy1.address, owner.address, 0))
                    .to.be.revertedWith(
                        "ERC721: caller is not approved.  Stop trying."
                    );

                await expect(valuesNFT.connect(addy1).transferFrom(addy1.address, addy2.address, 0))
                    .to.be.revertedWith(
                        "ERC721: caller is not approved.  Stop trying."
                    );

                await valuesNFT.connect(owner).transferFrom(addy1.address, addy2.address, 0);

                expect(await valuesNFT.ownerOf(0)).to.equal(addy2.address);
                expect(await valuesNFT.balanceOf(addy1.address)).to.equal(0);
                expect(await valuesNFT.balanceOf(addy2.address)).to.equal(1);
            });
        });
        describe("Token uri tests", function () {
            it("Test CTW token uri", async function () {
                const { valuesNFT, owner, addy1 } = await loadFixture(
                    getValuesNFTsAndArgs
                );

                await valuesNFT.mintNFT(addy1.address, 1);
                await valuesNFT.mintNFT(addy1.address, 2);
                await valuesNFT.mintNFT(addy1.address, 3);
                await valuesNFT.mintNFT(addy1.address, 4);
                await valuesNFT.mintNFT(addy1.address, 5);
                await valuesNFT.mintNFT(addy1.address, 6);
        
                expect(await valuesNFT.balanceOf(addy1.address)).to.equal(6);

                expect(await valuesNFT.tokenURI(1)).to.equal("yourwebsiteurl.com/1");
                expect(await valuesNFT.tokenURI(2)).to.equal("yourwebsiteurl.com/2");
                expect(await valuesNFT.tokenURI(3)).to.equal("yourwebsiteurl.com/3");
                expect(await valuesNFT.tokenURI(4)).to.equal("yourwebsiteurl.com/4");
                expect(await valuesNFT.tokenURI(5)).to.equal("yourwebsiteurl.com/5");
                expect(await valuesNFT.tokenURI(6)).to.equal("yourwebsiteurl.com/6");
            });
        });
    });
});
  