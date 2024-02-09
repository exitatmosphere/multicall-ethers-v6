// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

error TestContract1Error();

contract TestContract1 {
  function balanceOf(uint256 a) public pure returns (uint256) {
    return a;
  }

  function allowance(uint256 a, uint256 b) public pure returns (uint256) {
    return a * b;
  }

  function getUint() public pure returns (uint256) {
    return 1e20;
  }

  function getUint2() public pure returns (uint256, uint256) {
    return (1e18, 1e19);
  }

  function doRevert() public pure returns (uint256) {
    revert TestContract1Error();
  }
}