// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// decimals defaults to 18 https://docs.openzeppelin.com/contracts/4.x/erc20
contract Token is ERC20 {
    address public owner;

    constructor() ERC20("Lagauna Token", "LTT") {
        owner = msg.sender;
        _mint(msg.sender, 1000000);
    }
}
