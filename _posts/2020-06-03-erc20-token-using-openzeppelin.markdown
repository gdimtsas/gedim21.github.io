---
title: How to create a ERC-20 token and deploy it to the Ethereum network
description: A tutorial on how to create and deploy a ERC-20 token on the ethereum network, using OpenZeppelin contracts
date: 2022-06-03 16:33:54 +0200
header:
  teaser: 
tags: 
  - typescript
  - solidity
  - web3
  - hardhat
  - smart contracts
  - ethereum
categories:
  - tutorial
published: false
---

Let's keep building on the project setup that we did in []({% post_url 2015-04-21-embedding-mono-generic-method-1 %}) and deploy our own ERC-20 token on the Ethereum network.

# What is ERC-20

[ERC-20](https://ethereum.org/en/developers/docs/standards/tokens/erc-20/) tokens are blockchain-based assets that have value and can be sent and received. The primary difference to native coins like Bitcoin and Litecoin is that instead of running on their own blockchain, ERC-20 tokens are issued on the Ethereum network.

> The "ERC" stands for "Ethereum Request for Comments", which is an official protocol used to propose improvements to the Ethereum network. The "20" is the unique ID number used to identify the proposal.

ERC-20 is a technical standard for tokens issued on the Ethereum blockchain, providing a list of rules that all Ethereum-based tokens must follow. These standards include how the tokens can be transferred, how transactions are approved, how users can access data about a token, and the total supply of tokens.

All Smart Contracts that implement the following methods and events are considered ERC-20 tokens:

Methods

```c
function name() public view returns (string)
function symbol() public view returns (string)
function decimals() public view returns (uint8)
function totalSupply() public view returns (uint256)
function balanceOf(address _owner) public view returns (uint256 balance)
function transfer(address _to, uint256 _value) public returns (bool success)
function transferFrom(address _from, address _to, uint256 _value) public returns (bool success)
function approve(address _spender, uint256 _value) public returns (bool success)
function allowance(address _owner, address _spender) public view returns (uint256 remaining)
```

Events

```c
event Transfer(address indexed _from, address indexed _to, uint256 _value)
event Approval(address indexed _owner, address indexed _spender, uint256 _value)
```

These functions are integral for user/token implementation, specifically in determining the amount of tokens in circulation, storing and returning balances, making transfer and withdrawal requests and granting approval, and agreeing to automated transfers.

[EIP-20 token standard](https://eips.ethereum.org/EIPS/eip-20)

## Sample implementations

There are already plenty of ERC-20 compliant tokens deployed on the Ethereum network. Different implementations have been written by various teams that have different trade-offs: from gas saving to improved security.

Check these sample implementations:

[ConsenSys](https://github.com/ConsenSys/Tokens/blob/fdf687c69d998266a95f15216b1955a4965a0a6d/contracts/eip20/EIP20.sol)

[OpenZeppelin](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/9b3710465583284b8c4c5d2245749246bb2e0094/contracts/token/ERC20/ERC20.sol)

We are going to extend on the [OpenZeppelin](https://www.openzeppelin.com/) implementation to build our own token. OpenZeppelin contracts are battle tested and used by many successful projects.

# Install openzeppelin contracts

npm install --save-dev @openzeppelin/contracts

# Create the token

```c
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TutorialToken is ERC20 {
    constructor(uint256 initialSupply) ERC20("Tutorial", "TUT") {
        _mint(msg.sender, initialSupply);
    }
}
```

First, we import the OpenZeppelin ERC20.sol contract. Then, we create a contract called TutorialToken that extends the ERC20 contract.
We then define a constructor for our contract, which is also indicating the arguments for the constructor of the base contract; the name of the token and it's symbol.
Finally, we are minting some tokens and giving them to the address that deploys the smart contract.

# Add tests

```bash
$ npm install --save-dev @types/chai-as-promised
$ npm install --save-dev chai-as-promised
```

```typescript
import { ethers } from "hardhat";
import chai from "chai";
import chaiAsPromised from "chai-as-promised";

import { TutorialToken } from "../typechain/TutorialToken";
import { TutorialToken__factory } from "../typechain/factories/TutorialToken__factory";
import { Signer } from "ethers";

chai.use(chaiAsPromised);
const { expect } = chai;

describe("Tutorial", () => {
  let tutorialTokenFactory: TutorialToken__factory;
  let tutorialToken: TutorialToken;

  describe("Deployment", () => {
    let deployer: Signer;

    beforeEach(async () => {
      [deployer] = await ethers.getSigners();
      tutorialTokenFactory = new TutorialToken__factory(deployer);
      tutorialToken = await tutorialTokenFactory.deploy(100);
      await tutorialToken.deployed();
    });

    it("should have the correct name", async () => {
      expect(await tutorialToken.name()).to.equal("Tutorial");
    });

    it("should have the correct symbol", async () => {
      expect(await tutorialToken.symbol()).to.equal("TUT");
    });

    it("should have the correct total supply", async () => {
      expect((await tutorialToken.totalSupply()).toString()).to.equal("100");
    });

    it("should have correct balance after deployment", async () => {
      expect(await tutorialToken.balanceOf(await deployer.getAddress())).to.equal("100");
    });
  });
});

```

# Deploy on the Ethereum network

## Add test net to hardhat config

## Get API key from alchemyapi.io

## Get ETH from faucet

https://goerlifaucet.com/

## Deploy