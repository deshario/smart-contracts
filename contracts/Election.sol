pragma solidity >=0.4.21 <0.7.0;

contract Election{

    struct Candidate{
        uint id;
        string name;
        uint voteCount;
    }

    mapping(uint => Candidate) public candidates;
    mapping(address => bool) public voters; // Store accounts that voted

    uint public candidatesCount;

    constructor() public {
        addCandidate('Elon');
        addCandidate('Mark');
    }

    function addCandidate(string memory mName) private {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount,mName,0);
    }

    function vote(uint candidateId) public {
        // require that they havent vote before
        // Validating candidate
        require(!voters[msg.sender], "Invalid Voter");
        require(candidateId > 0 && candidateId <= candidatesCount, 'Vote Hacked');
        voters[msg.sender] = true; // record the voter has voted
        candidates[candidateId].voteCount++;
    }

}