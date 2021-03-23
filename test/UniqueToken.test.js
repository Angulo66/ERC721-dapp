const { assert } = require('chai')
const { default: Web3 } = require('web3')

const UniqueAsset = artifacts.require('UniqueAsset')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('UniqueAsset', () => {
    let uniqueAsset

    before(async () => {
        uniqueAsset = await UniqueAsset.new()
    })
})