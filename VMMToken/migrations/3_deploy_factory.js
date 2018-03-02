const VMMFactory =
  artifacts.require('./VMMFactory.sol');

module.exports = (deployer) => {
  deployer.deploy(VMMFactory);
};
