pragma solidity >=0.4.0 <0.6.0;

contract User {
    
    string public name;
    mapping(address => string) requests;
    address myAddress;//my user address
    constructor(string memory _name) public {
        name = _name;
        myAddress = msg.sender;
    }
}
