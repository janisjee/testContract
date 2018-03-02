var Counter = artifacts.require("./Counter.sol");

module.exports = function(deployer) {
  deployer.deploy(Counter);
  /* deployer.link(ConvertLib, MetaCoin);
  deployer.deploy(MetaCoin); */
};
