pragma solidity >=0.4.0 <0.6.0;
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
    
    constructor(string memory _title, string memory _ipfsHash, address _authContract) public payable {
        title = _title;
        ipfsHash = _ipfsHash;
        author = msg.sender;
        authContract = _authContract;
    }
    
    function setPublisher(address _publisher) OnlyAuthor public {
        publisher = _publisher;
        dateOfPublishing = now;
    }

    function getBookInfo() view public returns (address, address, string memory, string memory, uint) { 
        return (author, publisher, ipfsHash, title, dateOfPublishing);
    }

}
