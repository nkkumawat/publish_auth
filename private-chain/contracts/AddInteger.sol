pragma solidity >=0.4.0 <0.6.0;

contract AddInteger {
    uint c;
    constructor() public {
        c = 0;
    }
    function addTwoNumbers(uint _a, uint _b) public returns(uint sufficient) {
        c = _a + _b;
        return c;
    }
    function getNumber() public view returns(uint){
        return c;
    }

}