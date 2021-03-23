// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract UniqueAsset is ERC721 {
  address public owner;
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;
  mapping(string => uint8) hashes;
  
  constructor() ERC721('UniqueAsset', 'UNA') {
  	//owner = msg.sender;
  }

  function awardItem(address recipient, string memory hash) public returns (uint256) {
    //require(hashes[hash] != 1);
    //hashes[hash] = 1;
    _tokenIds.increment();
    uint256 newItemId = _tokenIds.current();
    _mint(recipient, newItemId);
    _setTokenURI(newItemId, hash);
    return newItemId;
  }

}
