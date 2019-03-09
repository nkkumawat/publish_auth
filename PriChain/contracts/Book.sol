pragma solidity ^0.4.25;

contract Book {
    
    address public author;//author's user address
    address public publisher;//publisher's user address
    string public ipfsHash;
    string public title;
    uint public dateOfPublishing;
    address public authContract;
    
    //modifiers
    modifier  OnlyAuthor() {
        require(msg.sender == author, 'You are not the author :(');
        _;
    }
    
    constructor(string _title, string _ipfsHash, address _authContract) public {
        title = _title;
        ipfsHash = _ipfsHash;
        author = msg.sender;
        authContract = _authContract;
    }
    
    function setPublisher(address _publisher) OnlyAuthor public {
        publisher = _publisher;
        dateOfPublishing = now;
    }

    function getBookInfo() constant public returns (address, address, string, string, uint) { 
        return (author, publisher, ipfsHash, title, dateOfPublishing);
    }

}
