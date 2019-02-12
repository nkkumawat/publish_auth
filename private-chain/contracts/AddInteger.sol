pragma solidity >=0.4.0 <0.6.0;
contract AddInteger{
    uint private c;
    function addition(uint _a, uint _b) public returns(uint){
        c = _a+_b;
        return c;
    } 
}