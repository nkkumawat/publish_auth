pragma solidity ^0.4.25;

import "Book.sol";
import "Author.sol";

contract Publisher {
    
    string public name;
    address[] public publishedBooks;//contract addresses
    mapping(address => string) requests;
    address myAddress;//my user address
    
    //modifiers
    modifier OnlyMe() {
        require(msg.sender == myAddress);
        _;
    }
    
    modifier NotMe() {
        require(msg.sender != myAddress);
        _;
    }
    
    constructor(string _name) public {
        name = _name;
        myAddress = msg.sender;
    }
    
    function requestApproval(address bookAddr, string ipfsHash) OnlyMe public {
        //check book not published
        Book book = Book(bookAddr);
        //send author address directly as parameter
        Author author = Author(book.authContract());
        //add in requests
        requests[bookAddr] = ipfsHash;
        //author.requestApproval() or make event ??
    }
    
    function requestApproved(address bookAddr) public {
        Book book = Book(bookAddr);
        Author author = Author(book.authContract());
        require(msg.sender == book.author());
        publishedBooks.push(bookAddr);
        delete requests[bookAddr];
        //add event
    }
    
    function requestRejected(address bookAddr) public {
        Book book = Book(bookAddr);
        Author author = Author(book.authContract());
        require(msg.sender == book.author());
        delete requests[bookAddr];//check this function
    }
    
}
