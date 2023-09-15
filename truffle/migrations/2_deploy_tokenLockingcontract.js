const fs = require("fs")
const TokenLockingContract = artifacts.require("./TokenLockingContract.sol");

module.exports = async function (deployer) {
  await deployer.deploy(TokenLockingContract);
  const instance = await TokenLockingContract.deployed();
  let tokenLockingContractAddress = await instance.address;

  let config = "export const tokenLockingContractAddress =" + tokenLockingContractAddress;

  console.log("tokenLockingContractAddress =" + tokenLockingContractAddress);
  let data = JSON.stringify(config);

  fs.writeFileSync("config.js", JSON.parse(data));
};
