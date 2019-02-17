var OnlineBooksAuthenticity = artifacts.require("./OnlineBooksAuthenticity.sol");
module.exports = function(deployer) {
  deployer.deploy(OnlineBooksAuthenticity);
};
