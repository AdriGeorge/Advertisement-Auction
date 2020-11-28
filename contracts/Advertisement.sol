// SPDX-License-Identifier: MIT
pragma solidity >=0.4.0 <=0.8.0;

contract Advertisement{
    
    struct Ad{
        address adOwner;
        string link;
        string linkName;
    }
    
    mapping(uint => Ad) public ads;
    
    address payable owner;
    uint adCost = 0 ether;
    uint adCount = 1;
    
    modifier allowToChange (uint value) {
        require (value > adCost);
        _;
    }
    
    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }
    
    constructor(string memory _link, string memory _linkName) public {
        owner = msg.sender;
        ads[adCount] = Ad(msg.sender, _link, _linkName);
    }
    
    function changeAd(string memory _link, string memory _linkName) public payable allowToChange(msg.value) {
        adCount ++;
        ads[adCount] = Ad(msg.sender, _link, _linkName);
        adCost = msg.value;
    }
    
    function getCost() public view returns (uint) {
        return adCost;
    }
    
    function getAd() public view returns(address, string memory, string memory){
        return (ads[adCount].adOwner, ads[adCount].link, ads[adCount].linkName);
    }
    
    function getBalanceOfContract() public view onlyOwner returns(uint){
        return address(this).balance;
    }
    
    function getAdCount() public view onlyOwner returns (uint){
        return adCount;
    }
    
    function withdraw(uint amount) public onlyOwner {
        require(amount < address(this).balance, "Not amount into contract");
        owner.transfer(amount);
    }
}