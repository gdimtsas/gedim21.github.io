---
layout: single
title: "Setup a Solidity project using Hardhat and Typescript "
description: A tutorial on how to create a new project for smart contracts development using Solidity, Hardhat and Typescript
date: 2022-05-29 16:33:54 +0200
header:
  teaser: /assets/images/hardhat.jpg
tags: 
  - typescript
  - solidity
  - web3
  - hardhat
categories:
  - tutorial
---

Let's see how we can setup a new Solidity project for smart contracts development, using Hardhat and Typescript.

# What is Hardhat

[Hardhat](https://hardhat.org/) is a development environment that aims to provide all neccessary tools so that you can develop, test and deploy Ethereum software.
Beside Hardhat there is [Truffle](https://trufflesuite.com/docs/truffle/). Truffle and Hardhat are the most famous enviornments for developing Etherum software. Both have their advantages and strenghts, but the trend is, that more and more devs are using Hardhat.
Let's get started!

# Creating the project

First, create a new node project by typing the following in a terminal:

```bash
$ npm init --yes
```

Then, add the hardhat depencency:

```bash
$ npm install --save-dev hardhat
```


## Using Hardhat to generate a sample project

By far the easiest way to get started with Hardhat, is to use its CLI to generate a sample project for us:

```bash
$ npx hardhat
```

```bash
888    888                      888 888               888
888    888                      888 888               888
888    888                      888 888               888
8888888888  8888b.  888d888 .d88888 88888b.   8888b.  888888
888    888     "88b 888P"  d88" 888 888 "88b     "88b 888
888    888 .d888888 888    888  888 888  888 .d888888 888
888    888 888  888 888    Y88b 888 888  888 888  888 Y88b.
888    888 "Y888888 888     "Y88888 888  888 "Y888888  "Y888

Welcome to Hardhat v2.9.6

? What do you want to do? …
  Create a basic sample project
  Create an advanced sample project
▸ Create an advanced sample project that uses TypeScript
  Create an empty hardhat.config.js
  Quit
```

Choose `Create an advanced sample project that uses TypeScript` and then choose Y on the questions.

## Going through the project structure

We now have a basic project structure, with a sample contract and a basic test

 - `/contracts`: This is where you put your smart contracts, as .sol files.
 - `/test`: Here you can put all your tests. Hardhat is using chai and ethers. Chai as test-runner and ethers to interact with the ethereum blockchain.
 - `/scripts`: Here you can put your automation scripts, maybe one script for deploying to rinkeby testnet and one for local testnet ? You decide :)
 - `hardhat.config.ts`: This is the place where you configure the [HRE](https://hardhat.org/advanced/hardhat-runtime-environment.html) (Hardhat Runtime Enviornment). The HRE  is an object containing all the functionality that Hardhat exposes when running a task, test or script. You can use it anywhere across the project with const hardhat = require("hardhat"). In the config we also define tasks; one example task is also provided by Hardhat for listing all accounts.

# Compiling, testing and delpoying a contract

## Compile

To compile the smart contracts of our project we can run:

```bash
$ npx hardhat compile 
```

```bash
Generating typings for: 2 artifacts in dir: typechain for target: ethers-v5
Successfully generated 5 typings!
Compiled 2 Solidity files successfully
```

Hardhat will compile all .sol files against the [Solidity](https://docs.soliditylang.org/en/v0.8.14/) version that is configured in the hardhat.config.ts:


```javascript
solidity: "0.8.4",
```

The compiled artifacts will be saved in the `artifacts/` directory. Since we are also using Typescript, the `typechain/` directory will contain the Typescript types of our contracts.


## Test

To test you smart contracts, simply run:

```bash
$ npx hardhat test
```


```bash
No need to generate any newer typings.


  Greeter
Deploying a Greeter with greeting: Hello, world!
Changing greeting from 'Hello, world!' to 'Hola, mundo!'
    ✔ Should return the new greeting once it's changed (385ms)


  1 passing (385ms)
```

## Deploy

Hardhat comes built-in with Hardhat Network, a local Ethereum network node designed for development. It allows you to deploy your contracts, run your tests and debug your code. On a new terminal, type:

```bash
$ npx hardhat node
```

```bash
Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/

Accounts
========

WARNING: These accounts, and their private keys, are publicly known.
Any funds sent to them on Mainnet or any other live network WILL BE LOST.

Account #0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (10000 ETH)
Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
...
...
```

The hardhat testnet is now running at `localhost:8545`.

We can now use the sample `deploy.ts` script to deploy our contracts.

```bash
$ npx hardhat run --network localhost scripts/deploy.ts
```

```bash
web3_clientVersion
eth_chainId
eth_accounts
eth_blockNumber
eth_chainId (2)
eth_estimateGas
eth_getBlockByNumber
eth_feeHistory
eth_sendTransaction
  Contract deployment: Greeter
  Contract address:    0xe7f1725e7734ce288f8367e1bb143e90bb3f0512
  Transaction:         0xf35ffcaaa97d66392192e1f2f422f9ddeb489771c86668ebc060142a95de569a
  From:                0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
  Value:               0 ETH
  Gas used:            497026 of 497026
  Block #2:            0xa87bf346afe7de493c6a5dc7bd859b725d6c8774ce7dce50a906a2575312c84b

  console.log:
    Deploying a Greeter with greeting: Hello, Hardhat!

eth_chainId
eth_getTransactionByHash
eth_chainId
eth_getTransactionReceipt
```

Congratulations, the sample smart contract Greeter is now deployed at the address `0xe7f1725e7734ce288f8367e1bb143e90bb3f0512` on the local testnet!

# Summary

In the course of this tutorial, we saw how to setup a new project for solidity development. We created our project using Hardhat, we compiled and tested a smart contract. Finally, we deployed the smart contract on a locally running testnet. 
