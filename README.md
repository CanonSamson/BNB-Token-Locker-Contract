
# Web3 Token Locker DApp - README

Welcome to the **Web3 Token Locker DApp** project repository! This decentralized application (DApp) leverages blockchain technology to implement an Token locker platform on the BNB Chain.



[Click Here To Watch Demo Video On Youtube](https://youtu.be/Sw3Rzefi5M8)



Get Started by Creating An Account.

![Create Account](/s1.png)


![Home Page](/s2.png)


## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Smart Contracts](#smart-contracts)
- [Testing](#testing)
- [License](#license)


## Overview

 This Dpp  act as a secure vault for users to lock their tokens for a specified period, earning rewards over time. Each user have a separate compartment within the contract, ensuring individualized security and reward calculation.

## Features

- Browse ongoing locker.
- Users can send tokens to the contract..
- Tokens can be locked for a defined period.
- The contract calculates rewards.
- Rewards are based on the time the tokens are locked.
- Each user has a unique compartment within the contract.
- Ensures personalized security and reward management..


## Smart Contracts

- `TokenLockingContract.sol`: Responsible for creating new locker.


## License

This project is licensed under the [MIT License](LICENSE).

---


# BNB Smart Chain Truffle Box

- [BNB Smart Chain Truffle Box](#bnb-smart-chain-truffle-box)
  - [Requirements](#requirements)
  - [Installation](#installation)
  - [Setup](#setup)
    - [Using the env File](#using-the-env-file)
    - [New Configuration File](#new-configuration-file)
    - [New Directory Structure for Artifacts](#new-directory-structure-for-artifacts)
  - [BNB Smart Chain](#bnb-smart-chain)
    - [Compiling](#compiling)
    - [Migrating](#migrating)
    - [Paying for Migrations](#paying-for-migrations)
  - [Basic Commands](#basic-commands)
    - [Testing](#testing)
  - [Support](#support)

<small><i><a href='http://ecotrust-canada.github.io/markdown-toc/'>Table of contents generated with markdown-toc</a></i></small>

This Truffle BNB Smart Chain box provides you with the boilerplate structure necessary to start coding on the BNB Smart Chain. For detailed information on how the BNB Smart Chain works, please see their documentation [here](https://docs.bnbchain.org/docs/getting-started).

As a starting point, this box contains only the ```SimpleStorage``` Solidity contract. Including minimal code was a conscious decision as this box is meant to provide the initial building blocks needed to get to work on BNB Smart Chain without pushing developers to write any particular sort of application. With this box, you will be able to compile, migrate, and test Solidity code against several instances of BNB Smart Chain networks.

The BNB Smart Chain is fully compatible with the EVM. This means you will not need a new compiler to deploy Solidity contracts, and should be able to add your own Solidity contracts to this project. The main difference developers will encounter is in accessing and interacting with the BNB Smart Chain network.

## Requirements

The BSC box has the following requirements:

- [Node.js](https://nodejs.org/) 10.x or later
- [NPM](https://docs.npmjs.com/cli/) version 5.2 or later
- Windows, Linux or MacOS

Helpful, but optional:

- A [MetaMask](https://metamask.io/) account

# React Truffle Box

This box comes with everything you need to start using Truffle to write, compile, test, and deploy smart contracts, and interact with them from a React app.

## Installation

First ensure you are in an empty directory.

Run the `unbox` command using 1 of 2 ways.

```sh
# Install Truffle globally and run `truffle unbox`
$ npm install -g truffle
$ truffle unbox react
```

```sh
# Alternatively, run `truffle unbox` via npx
$ npx truffle unbox react
```

Start the react dev server.

```sh
$ cd client
$ npm start
```

From there, follow the instructions on the hosted React app. It will walk you through using Truffle and Ganache to deploy the `SimpleStorage` contract, making calls to it, and sending transactions to change the contract's state.

## FAQ

- __How do I use this with Ganache (or any other network)?__

  The Truffle project is set to deploy to Ganache by default. If you'd like to change this, it's as easy as modifying the Truffle config file! Check out [our documentation on adding network configurations](https://trufflesuite.com/docs/truffle/reference/configuration/#networks). From there, you can run `truffle migrate` pointed to another network, restart the React dev server, and see the change take place.

- __Where can I find more resources?__

  This Box is a sweet combo of [Truffle](https://trufflesuite.com) and [Webpack](https://webpack.js.org). Either one would be a great place to start!
