import { MultiCallClient } from "../src/MultiCallClient";
import { TestContract1, TestContract2 } from "../typechain-types";
import { ethers } from "hardhat";
import { expect } from "chai";

describe("MultiCall", async () => {
  let testContract1: TestContract1;
  let testContract2: TestContract2;
  let multiCallClient: MultiCallClient;

  before(async () => {
    testContract1 = await (
      await ethers.getContractFactory("TestContract1")
    ).deploy();
    testContract2 = await (
      await ethers.getContractFactory("TestContract2")
    ).deploy();
    multiCallClient = new MultiCallClient(ethers.provider);
  });

  context("correct input", () => {
    it("should return correct data", async () => {
      const testContract1Addr = await testContract1.getAddress();
      const testContract1Iface = testContract1.interface;
      const testContract1Inputs: [number, [number, number]] = [12, [10, 16]];

      const testContract2Addr = await testContract2.getAddress();
      const testContract2Iface = testContract2.interface;

      const inputs = [
        {
          target: testContract1Addr,
          interface: testContract1Iface,
          function: "balanceOf",
          args: [testContract1Inputs[0]],
        },
        {
          target: testContract1Addr,
          interface: testContract1Iface,
          function: "allowance",
          args: testContract1Inputs[1],
        },
        {
          target: testContract1Addr,
          interface: testContract1Iface,
          function: "getUint",
        },
        {
          target: testContract1Addr,
          interface: testContract1Iface,
          function: "getUint2",
        },
        {
          target: testContract1Addr,
          interface: testContract1Iface,
          function: "doRevert",
        },
        {
          target: testContract2Addr,
          interface: testContract2Iface,
          function: "getUintArray",
        },
        {
          target: testContract2Addr,
          interface: testContract2Iface,
          function: "getUintArray2",
        },
        {
          target: testContract2Addr,
          interface: testContract2Iface,
          function: "getStruct",
        },
        {
          target: testContract2Addr,
          interface: testContract2Iface,
          function: "doRevert",
        },
      ];
      const [blockNumber, result] = await multiCallClient.multiCall(inputs);

      expect(blockNumber).to.equal(await ethers.provider.getBlockNumber());
      expect(result[0]).to.equal(testContract1Inputs[0]);
      expect(result[1]).to.equal(
        testContract1Inputs[1][0] * testContract1Inputs[1][1]
      );
      expect(result[2]).to.equal(BigInt(1e20));
      expect(result[3]).to.eql([BigInt(1e18), BigInt(1e19)]);
      expect(result[4]).to.be.null;
      expect(result[5]).to.eql([BigInt(1e20), BigInt(1e18)]);
      expect(result[6]).to.eql([BigInt(1e20)]);

      const struct = result[7];
      expect(struct.a).to.equal(BigInt(1e18));
      expect(struct.b).to.eql([BigInt(50), BigInt(2)]);

      expect(result[8]).to.be.null;
    });
  });
});
