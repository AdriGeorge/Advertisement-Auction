var Contract = artifacts.require('./Advertisement.sol');

module.exports = function (deployer) {
  deployer.deploy(Contract, 'www.google.it', 'Google', 'NoImg');
};
