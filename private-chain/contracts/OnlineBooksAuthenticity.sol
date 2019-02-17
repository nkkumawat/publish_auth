pragma solidity >=0.4.0 <0.6.0;

contract OnlineBooksAuthenticity  {

address public author;
string public bookInformation; 
string IPFShashAuthor;
string authorName;

enum contractState { NotReady,Created,WaitingForPublishers,WaitingToProvideApproval, Aborted}
contractState public contState; 
enum publisherState {ReadyToSubmit, SubmittedForApproval, ValidationSuccess, FailedValidation}
publisherState public pubState;
 
mapping (address=> bool) public recordList;//addresses of publishers and results (true or false)
mapping (address => bool) public approvedAuthors ; 
mapping(address=>string) public bookHashes; //hashes provided by publishers
mapping(address=>publisherState) public publishers;
  
 uint  numberOfRequestsByPublishers; 
 uint numberOfApprovalsByAuthor;

//constructor

constructor() public{
    bookInformation = "Work of Fiction";
    author= msg.sender;
    authorName= "Danielle Steel"; //example
    IPFShashAuthor= "QmXgm5QVTy8pRtKrTPmoWPGXNesehCpP4jjFMTpvGamc1p";
    contState = contractState.NotReady;
    numberOfRequestsByPublishers = 0;
    numberOfApprovalsByAuthor = 0;
}
    //modifiers
     modifier  OnlyAuthor(){
        require(msg.sender == author); 
        _;
    }
    modifier NotAuthor(){
        require(msg.sender!=author);
        _;
    }
    
    //events
    event ContractCreated(address owner, string info);
    event RequestedForApproval(address publisher , string info);    
    event PermissionGrantedToPublish(address author , string info);
    event ValidationSuccess(address publisher, string info);     
    event FailedApproval(address author, string info);
    event ReviseContent(address publisher, string info);
    event ValidationHistorySuccess(address publisher,string info, address author);
    event FailedValidationHistory(address publisher,string info, address author);
    
    //functions
    function createContract() OnlyAuthor public{
       require(contState == contractState.NotReady);
       contState = contractState.Created;
       emit ContractCreated(msg.sender, "Waiting for Publishers..");
    }
    
  function requestApproval(address publisherAddress, string memory bookHash) NotAuthor public  {
   require(contState==contractState.Created && publishers[publisherAddress] == publisherState.ReadyToSubmit);
        publishers[publisherAddress] = publisherState.SubmittedForApproval;
        contState = contractState.WaitingToProvideApproval;
        bookHashes[publisherAddress] = bookHash; //update the mapping
        emit RequestedForApproval(msg.sender, "Attest and Validate document to proceed for publishing");
        numberOfRequestsByPublishers += 1;
    }
    
 
function provideApprovalResult( address publisherAddress) OnlyAuthor public {
    
require(contState==contractState.WaitingToProvideApproval && (publishers[publisherAddress] ==publisherState.SubmittedForApproval));
 
  if(keccak256(bytes(bookHashes[publisherAddress])) == keccak256(bytes(IPFShashAuthor))) //compare hashes
  {
      emit PermissionGrantedToPublish(msg.sender, "Content Verified by Author. ");
      publishers[publisherAddress] = publisherState.ValidationSuccess;
      recordList[publisherAddress] = true;
      approvedAuthors[publisherAddress] = true;
      numberOfApprovalsByAuthor += 1;
      emit ValidationSuccess(publisherAddress, "Proceed to Publish Content on IPFS");
  }
  else if(keccak256(bytes(bookHashes[publisherAddress])) != keccak256(bytes(IPFShashAuthor)))
  {
      emit FailedApproval (msg.sender, " Content Modified / Corrupted: Hash does not match . Failed to be approved by Author");
      recordList[publisherAddress] = false;
      publishers[publisherAddress] = publisherState.FailedValidation;
      emit ReviseContent(publisherAddress, " Amend content and request for attestation again.");
  }
}
function traceBackHistory( address owner, address publisherAddress, address authorAddress ) public {

 require(contState==contractState.WaitingToProvideApproval && (publishers[publisherAddress] == publisherState.ValidationSuccess));
 if(recordList[publisherAddress] == true && approvedAuthors[publisherAddress] == true )
    if(authorAddress == author) {
        //event showing content is verified by the previous address 
        emit ValidationHistorySuccess(publisherAddress,"The content is verified by:", authorAddress);
    }
   else {
            emit FailedValidationHistory(publisherAddress,"The content is Not Verified by:", authorAddress);
        }
      }
}