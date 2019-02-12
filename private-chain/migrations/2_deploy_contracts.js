var Addition   = artifacts.require("./AddInteger.sol");

module.exports = function(deployer) {
  deployer.deploy(Addition);
};
