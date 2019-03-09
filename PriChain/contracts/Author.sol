pragma solidity ^0.4.25;

import "Book.sol";
import "Publisher.sol";

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
    
    constructor(string _name) public {
        name = _name;
        myAddress = msg.sender;
    }
    
    function addNewBook(string title, string ipfsHash) OnlyMe public {
        //TODO: check if the book exists
        address book = new Book(title, ipfsHash, address(this));
        unpublishedBooks.push(book);
    }
    
    function requestApproval(address _pubAddr, string _ipfsHash, address _bookAddr) NotMe public {
        requests.push(Request(_pubAddr, _ipfsHash, _bookAddr));
        //add event
    }
    
    function approveRequest(uint index) OnlyMe public {
        Book book = Book(requests[index].bookAddr);
        Publisher publisher = Publisher(requests[index].publisher);
        //TODO: check book exists, doest not have a publisher, publisher exists
        // require(book.publisher == 0);
        if(keccak256(requests[index].ipfsHash) == keccak256(book.ipfsHash)) {
            book.setPublisher(requests[index].publisher);
            publisher.requestApproved(requests[index].bookAddr);
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
        } else {
            publisher.requestRejected(requests[index].bookAddr);
            //failure message
            //remove from list of publisher
        }
        delete requests[index];
    }
    
}