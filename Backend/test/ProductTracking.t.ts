import { expect } from "chai";
import hre from "hardhat";

const { ethers, networkHelpers } = await hre.network.create();

describe("ProductTracking", function () {
    let productTracking: any;
    let owner: any;
    let manufacturer: any;
    let distributor: any;
    let retailer: any;

    const productId = ethers.encodeBytes32String("P001");
    const metadataHash = ethers.keccak256(
        ethers.toUtf8Bytes("metadata")
    );
    const eventHash = ethers.keccak256(
        ethers.toUtf8Bytes("created")
    );

    beforeEach(async function () {
        [owner, manufacturer, distributor, retailer] = await ethers.getSigners();

        const ProductTracking = await ethers.getContractFactory("ProductTracking");

        productTracking = await ProductTracking.deploy();

        await productTracking.waitForDeployment();
    });

    describe("Product Creation", function () {
        it("Should create a product", async function () {
            await productTracking
                .connect(manufacturer)
                .createProduct(productId, metadataHash, eventHash);

            expect(
                await productTracking.productExists(productId)
            ).to.equal(true);

            expect(
                await productTracking.getCurrentStatus(productId)
            ).to.equal(0);
        });

        it("Should revert for duplicate product", async function () {
            await productTracking
                .connect(manufacturer)
                .createProduct(productId, metadataHash, eventHash);

            await expect(
                productTracking
                    .connect(manufacturer)
                    .createProduct(productId, metadataHash, eventHash)
            ).to.be.revertedWith("This product already exists");
        });

        it("Should reject empty product id", async function () {
            await expect(
                productTracking.createProduct(
                    ethers.ZeroHash,
                    metadataHash,
                    eventHash
                )
            ).to.be.revertedWith("Empty productID paramater");
        });

    });

    describe("Traceability", function () {
        beforeEach(async function () {
            await productTracking
                .connect(manufacturer)
                .createProduct(productId, metadataHash, eventHash);
        });

        it("Should add pickup event", async function () {
            const pickupHash = ethers.keccak256(
                ethers.toUtf8Bytes("pickup")
            );

            await productTracking
                .connect(distributor)
                .addTraceabilityEvent(
                    productId,
                    1,
                    pickupHash
                );

            expect(
                await productTracking.getCurrentStatus(productId)
            ).to.equal(1);
        });

        it("Should update through every status", async function () {
            for (let i = 1; i <= 6; i++) {
                await productTracking
                    .connect(distributor)
                    .addTraceabilityEvent(
                        productId,
                        i,
                        ethers.keccak256(
                            ethers.toUtf8Bytes("step" + i)
                        )
                    );

                expect(
                    await productTracking.getCurrentStatus(productId)
                ).to.equal(i);
            }
        });

        it("Should revert if product doesn't exist", async function () {
            await expect(
                productTracking.addTraceabilityEvent(
                    ethers.encodeBytes32String("Unknown"),
                    1,
                    eventHash
                )
            ).to.be.revertedWith("Product does not exists");
        });
    });

    describe("Verification", function () {

        beforeEach(async function () {

            await productTracking
                .connect(manufacturer)
                .createProduct(productId, metadataHash, eventHash);
        });

        it("Should verify correct metadata", async function () {
            expect(
                await productTracking.verifyProduct(
                    productId,
                    metadataHash
                )
            ).to.equal(true);
        });

        it("Should fail incorrect metadata", async function () {
            const wrongHash = ethers.keccak256(
                ethers.toUtf8Bytes("wrong")
            );

            expect(
                await productTracking.verifyProduct(
                    productId,
                    wrongHash
                )
            ).to.equal(false);

        });

    });

    describe("History", function () {

        beforeEach(async function () {
            await productTracking
                .connect(manufacturer)
                .createProduct(productId, metadataHash, eventHash);

            await productTracking
                .connect(distributor)
                .addTraceabilityEvent(
                    productId,
                    1,
                    ethers.keccak256(
                        ethers.toUtf8Bytes("pickup")
                    )
                );
            
            await productTracking
                .connect(distributor)
                .addTraceabilityEvent(
                    productId,
                2,
                    ethers.keccak256(
                        ethers.toUtf8Bytes("pickup")
                    )
                );

            await productTracking
                .connect(retailer)
                .addTraceabilityEvent(
                    productId,
                    3,
                    ethers.keccak256(
                        ethers.toUtf8Bytes("warehouse")
                    )
                );
        });

        it("Should return complete history", async function () {
            const history = await productTracking.getProductHistory(productId);

            expect(history.length).to.equal(4);

            expect(history[0].stepType).to.equal(0);

            expect(history[1].stepType).to.equal(1);

            expect(history[2].stepType).to.equal(2);

            expect(history[3].stepType).to.equal(3);
        });

    });

    describe("Events", function () {
        it("Should emit ProductCreated", async function () {
            await expect(
                productTracking
                    .connect(manufacturer)
                    .createProduct(
                        productId,
                        metadataHash,
                        eventHash
                    )
            ).to.emit(productTracking, "ProductCreated");
        });

        it("Should emit TraceabilityEventAdded", async function () {
            await productTracking
                .connect(manufacturer)
                .createProduct(productId, metadataHash, eventHash);

            await expect(
                productTracking
                    .connect(distributor)
                    .addTraceabilityEvent(
                        productId,
                        1,
                        eventHash
                    )
            ).to.emit(productTracking, "TraceabilityEventAdded");
        });
    });
});