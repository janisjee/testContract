const VMM = artifacts.require('./VMM.sol');

module.exports = (deployer) => {
  deployer.deploy(VMM, 1000000, 'VMM Token', 1, 'VMM');
};
