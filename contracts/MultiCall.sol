// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

error MulticallWrongArrayLengths();

contract MultiCall {
  constructor(
    address[] memory targets,
    bytes[] memory datas
  ) {
    uint256 len = targets.length;
    if (datas.length != len) {
        revert MulticallWrongArrayLengths();
    }

    bytes[] memory returnDatas = new bytes[](len);

    for (uint256 i = 0; i < len; i++) {
      address target = targets[i];
      bytes memory data = datas[i];
      (bool success, bytes memory returnData) = target.call(data);
      if (!success) {
        returnDatas[i] = bytes("");
      } else {
        returnDatas[i] = returnData;
      }
    }
    bytes memory res = abi.encode(block.number, returnDatas);
    assembly { return(add(res, 32), mload(res)) }
  }
}