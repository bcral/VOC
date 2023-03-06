const {
    loadFixture,
  } = require("@nomicfoundation/hardhat-network-helpers");
  const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
  const { expect } = require("chai");

let nftArray = [];

const nfts = [
    ["Chop The Wood", "CTW"],
    ["Parachute Mind", "PM"],
    ["Bend Dont Break", "BDB"],
    ["Pool Together", "PT"],
    ["No Suits Required", "NSR"],
    ["Rocket To The Moon", "RTM"]
];
  
describe("Values NFT Contract", function () {
  
    async function getValuesNFTsAndArgs() {
        // Contracts are deployed using the first signer/account by default
        const [owner, addy1, addy2, addy3] = await ethers.getSigners();

        for (i = 0; i < nfts.length; i++) {
            tokenName = nfts[i][0];
            tokenSymbol = nfts[i][1];

            let ValuesNFT = await ethers.getContractFactory("Values_NFT");
    
            let valuesNFT = await ValuesNFT.deploy(tokenName, tokenSymbol);
    
            nftArray.push(valuesNFT.address);
        };

        return { nftArray, owner, addy1, addy2 };
    }
  
    describe("NFT contract tests", function () {
        describe("Deployment tests", function () {
            it("Test CTW token name, symbol, and owner", async function () {
                const { nftArray, owner, addy1 } = await loadFixture(
                    getValuesNFTsAndArgs
                );

                let ValuesNFT = await ethers.getContractFactory("Values_NFT");
                let ctwNFT = await ValuesNFT.attach(nftArray[0]);

                await ctwNFT.mintNFT(addy1.address, 0);
        
                expect(await ctwNFT.balanceOf(addy1.address)).to.equal(1);
                expect(await ctwNFT.name()).to.equal("Chop The Wood");
                expect(await ctwNFT.symbol()).to.equal("CTW");
            });

            it("Test PM token name, symbol, and owner", async function () {
                const { nftArray, owner, addy1 } = await loadFixture(
                    getValuesNFTsAndArgs
                );

                let ValuesNFT = await ethers.getContractFactory("Values_NFT");
                let ctwNFT = await ValuesNFT.attach(nftArray[1]);

                await ctwNFT.mintNFT(addy1.address, 1);
        
                expect(await ctwNFT.balanceOf(addy1.address)).to.equal(1);
                expect(await ctwNFT.name()).to.equal("Parachute Mind");
                expect(await ctwNFT.symbol()).to.equal("PM");
            });

            it("Test BDB token name, symbol, and owner", async function () {
                const { nftArray, owner, addy1 } = await loadFixture(
                    getValuesNFTsAndArgs
                );

                let ValuesNFT = await ethers.getContractFactory("Values_NFT");
                let ctwNFT = await ValuesNFT.attach(nftArray[2]);

                await ctwNFT.mintNFT(addy1.address, 2);
        
                expect(await ctwNFT.balanceOf(addy1.address)).to.equal(1);
                expect(await ctwNFT.name()).to.equal("Bend Dont Break");
                expect(await ctwNFT.symbol()).to.equal("BDB");
            });

            it("Test PT token name, symbol, and owner", async function () {
                const { nftArray, owner, addy1 } = await loadFixture(
                    getValuesNFTsAndArgs
                );

                let ValuesNFT = await ethers.getContractFactory("Values_NFT");
                let ctwNFT = await ValuesNFT.attach(nftArray[3]);

                await ctwNFT.mintNFT(addy1.address, 3);
        
                expect(await ctwNFT.balanceOf(addy1.address)).to.equal(1);
                expect(await ctwNFT.name()).to.equal("Pool Together");
                expect(await ctwNFT.symbol()).to.equal("PT");
            });

            it("Test NSR token name, symbol, and owner", async function () {
                const { nftArray, owner, addy1 } = await loadFixture(
                    getValuesNFTsAndArgs
                );

                let ValuesNFT = await ethers.getContractFactory("Values_NFT");
                let ctwNFT = await ValuesNFT.attach(nftArray[4]);

                await ctwNFT.mintNFT(addy1.address, 4);
        
                expect(await ctwNFT.balanceOf(addy1.address)).to.equal(1);
                expect(await ctwNFT.name()).to.equal("No Suits Required");
                expect(await ctwNFT.symbol()).to.equal("NSR");
            });

            it("Test RTM token name, symbol, and owner", async function () {
                const { nftArray, owner, addy1 } = await loadFixture(
                    getValuesNFTsAndArgs
                );

                let ValuesNFT = await ethers.getContractFactory("Values_NFT");
                let ctwNFT = await ValuesNFT.attach(nftArray[5]);

                await ctwNFT.mintNFT(addy1.address, 5);
        
                expect(await ctwNFT.balanceOf(addy1.address)).to.equal(1);
                expect(await ctwNFT.name()).to.equal("Rocket To The Moon");
                expect(await ctwNFT.symbol()).to.equal("RTM");
            });
        });
        describe("NFT transfer tests", function () {
            it("Test CTW token minting and transfer", async function () {

                const { nftArray, owner, addy1 } = await loadFixture(
                    getValuesNFTsAndArgs
                );

                const ValuesNFT = await ethers.getContractFactory('Values_NFT');
                const ctw = await ValuesNFT.attach(nftArray[0]);

                await ctw.mintNFT(owner.address, 0);

                expect(await ctw.ownerOf(0)).to.equal(owner.address);
                expect(await ctw.balanceOf(owner.address)).to.equal(1);
                expect(await ctw.balanceOf(addy1.address)).to.equal(0);

                // transferFrom(addressFrom, addressTo, tokenId)
                await ctw.transferFrom(owner.address, addy1.address, 0);

                expect(await ctw.ownerOf(0)).to.equal(addy1.address);
                expect(await ctw.balanceOf(owner.address)).to.equal(0);
                expect(await ctw.balanceOf(addy1.address)).to.equal(1);
            });
            it("Test CTW token transfer by actual owner that isn't owner address", async function () {

                const { nftArray, owner, addy1, addy2 } = await loadFixture(
                    getValuesNFTsAndArgs
                );

                const ValuesNFT = await ethers.getContractFactory('Values_NFT');
                const ctw = await ValuesNFT.attach(nftArray[0]);

                await ctw.mintNFT(addy1.address, 0);

                expect(await ctw.ownerOf(0)).to.equal(addy1.address);
                expect(await ctw.balanceOf(addy1.address)).to.equal(1);

                // transferFrom(addressFrom, addressTo, tokenId)
                await expect(ctw.connect(addy1).transferFrom(addy1.address, owner.address, 0))
                    .to.be.revertedWith(
                        "ERC721: caller is not approved.  Stop trying."
                    );

                await expect(ctw.connect(addy1).transferFrom(addy1.address, addy2.address, 0))
                    .to.be.revertedWith(
                        "ERC721: caller is not approved.  Stop trying."
                    );

                await ctw.connect(owner).transferFrom(addy1.address, addy2.address, 0);

                expect(await ctw.ownerOf(0)).to.equal(addy2.address);
                expect(await ctw.balanceOf(addy1.address)).to.equal(0);
                expect(await ctw.balanceOf(addy2.address)).to.equal(1);
            });
        });
    });
});
  