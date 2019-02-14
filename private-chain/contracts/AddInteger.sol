pragma solidity >=0.4.0 <0.6.0;

contract AddInteger {
    uint c;
    mapping (address => uint) answers;
    event Transfer(address indexed _from,  uint256 _value);
    constructor() public {
        c = 0;
        answers[tx.origin] = 0;
    }
    function addTwoNumbers(uint _a, uint _b) public returns(uint sufficient) {
        c = _a + _b;
        answers[msg.sender] = c;
        emit Transfer(msg.sender,  c);
        return c;
    }
    function getNumber() public view returns(uint){
        return answers[msg.sender];
    }

}