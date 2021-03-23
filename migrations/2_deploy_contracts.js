const UniqueAsset = artifacts.require("UniqueAsset");

module.exports = function (deployer, _network, accounts) {
  deployer.deploy(UniqueAsset);
  //const una = UniqueAsset.deployed();
  //una.awardItem(accounts[1], 'QmR777WYseLr96XdcDTY4cRhcWUR9XAm94BRgNaonYPvtw', 'Girl with a Pearl Earring Painting by Johannes Vermeer')
};
