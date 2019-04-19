pragma solidity >=0.4.0 <0.6.0;
contract BookAuthor {
    
    mapping (bytes32 => address) public booksAuthors ;
   
    constructor() public { }
    
    function insertBook(bytes32 ipfsHash, address _authorAddress) public {
     	booksAuthors[ipfsHash] = _authorAddress; 
    }

    function checkAuthenticity(bytes32 ipfsHash) view public returns (address) { 
        return booksAuthors[ipfsHash];
    }

}
