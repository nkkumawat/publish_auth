pragma solidity >=0.4.0 <0.6.0;

import "./Book.sol";
import "./Publisher.sol";

contract Author {
    
    string public name;
    address[] public publishedBooks;
    address[] public unpublishedBooks;
    address myAddress;
    
    struct Request {
        address publisher;
        string ipfsHash;
        address bookAddr;
    }
    
    Request[] requests;
    
    //modifiers
    modifier OnlyMe() {
        require(msg.sender == myAddress, 'You are not the author :(');
        _;
    }
    
    modifier NotMe() {
        require(msg.sender != myAddress, 'You are the author :(');
        _;
    }
    
    constructor(string memory _name) public {
        name = _name;
        myAddress = msg.sender;
    }
    
    function getAuthor() view public returns(address) {
	return  ( myAddress ) ;
    }
    

    function addNewBook(string memory title, string memory ipfsHash) OnlyMe public {
        //TODO: check if the book exists
        address book = address(new Book(title, ipfsHash, address(this)));
        unpublishedBooks.push(book);
    }
    
    function getLatestBookAddress() view OnlyMe public returns (address) {
	return (unpublishedBooks[unpublishedBooks.length -1 ] ) ;
    }	
    
    function requestApproval(address _pubAddr, string memory _ipfsHash, address _bookAddr) NotMe public  {
        requests.push(Request(_pubAddr, _ipfsHash, _bookAddr));
        //add event
    }
    
    function getRequestIndex() view public returns( uint ) {
        return (requests.length);
    }
    
    function approveRequest(uint index)  public {
        Book book = Book(requests[index].bookAddr);
        //Publisher publisher = Publisher(requests[index].publisher);
        //TODO: check book exists, doest not have a publisher, publisher exists
        // require(book.publisher == 0);
        if(keccak256(abi.encodePacked(requests[index].ipfsHash)) == keccak256(abi.encodePacked(book.ipfsHash))) {
            book.setPublisher(requests[index].publisher);
            //publisher.requestApproved(requests[index].bookAddr);
            publishedBooks.push(requests[index].bookAddr);
            uint i;
            for(i = 0;i < unpublishedBooks.length;i++) {
                if(unpublishedBooks[i] == requests[index].bookAddr) {
                    break;
                }
            }
            delete unpublishedBooks[i];
            //inform publisher
            //add to publisher list
        }
    }
    
}

