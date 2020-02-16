pragma solidity >=0.4.21 <0.7.0;

contract Election{

    struct Candidate{
        uint id;
        string name;
        uint voteCount;
    }

    mapping(uint => Candidate) public candidates;

    uint public candidatesCount;

    constructor() public {
        addCandidate('Elon');
        addCandidate('Mark');
    }

    function addCandidate(string memory mName) private {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount,mName,0);
    }

}