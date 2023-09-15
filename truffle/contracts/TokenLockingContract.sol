// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract TokenLockingContract is ReentrancyGuard {
    address public owner;
    uint256 public constant interestRate = 2;

    struct Lock {
        uint256 amount;
        uint256 lockTimestamp;
        uint256 duration;
    }

    struct User {
        address walletAddress;
        string name;
        string lastname;
    }

    mapping(address => Lock) public userLocks;
    mapping(address => User) private users;

    event TokensLocked(
        address indexed user,
        uint256 _amount,
        uint256 _lockTimestamp
    );
    event UserAdded(
        address indexed walletAddress,
        string _name,
        string _lastname
    );
    event UnlockTokens(address indexed _walletAddress, uint256 _unlockAmount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function addUser(string calldata _name, string calldata _lastname)
        external
    {
        require(!isUser(msg.sender), "User already exists");

        users[msg.sender] = User(msg.sender, _name, _lastname);
        emit UserAdded(
            msg.sender,
            users[msg.sender].name,
            users[msg.sender].lastname
        );
    }

    function lockTokens(uint256 _duration) external payable {
        require(isUser(msg.sender), "User does not exist!");
        require(_duration > 0, "Duration must be greater than 0");
        require(msg.value > 0, "Must lock a non-zero amount of tokens");
        require(userLocks[msg.sender].amount == 0, "Tokens are already locked");

        uint256 lockTimestamp = block.timestamp + _duration;
        userLocks[msg.sender].amount += msg.value;

        userLocks[msg.sender] = Lock({
            amount: msg.value,
            lockTimestamp: lockTimestamp,
            duration: _duration
        });

        emit TokensLocked(msg.sender, msg.value, lockTimestamp);
    }

    function unlockTokens() external nonReentrant {
        require(isUser(msg.sender), "User does not exist!");
        Lock storage userLock = userLocks[msg.sender];
        require(userLock.amount > 0, "No tokens locked");
        require(
            block.timestamp >= userLock.lockTimestamp,
            "Tokens are still locked"
        );

        uint256 unlockAmount = userLock.amount;

        unchecked {
            userLocks[msg.sender].amount -= unlockAmount;
            delete userLocks[msg.sender];
        }

        (bool success, ) = msg.sender.call{value: unlockAmount}("");
        require(success, "Transfer failed");

        emit UnlockTokens(msg.sender, unlockAmount);
    }

    function isUser(address _walletAddress) private view returns (bool) {
        return users[_walletAddress].walletAddress != address(0);
    }

    function getUser(address _walletAddress)
        external
        view
        returns (User memory)
    {
        require(isUser(_walletAddress), "User does not exist");
        return users[_walletAddress];
    }

    function CalculateUserTokensRewards() external view returns (uint256) {
        require(isUser(msg.sender), "User does not exist!");
    
        uint256 unlockAmount = userLocks[msg.sender].amount;

        uint256 lockTimestamp = userLocks[msg.sender].lockTimestamp +
            userLocks[msg.sender].duration;
      
        uint256 lockingPeriod = lockTimestamp -
            userLocks[msg.sender].lockTimestamp;
        uint256 rewards = (unlockAmount *
            interestRate *
            lockingPeriod) / 1e18; 

        return rewards;
    }

    function getUserTotalLockedTokens()
        external
        view
        returns (uint256)
    {
          require(isUser(msg.sender), "User does not exist!");
        return userLocks[msg.sender].amount;
    }

    function getUserLockTimestamp()
        external
        view
        returns (uint256)
    {
          require(isUser(msg.sender), "User does not exist!");
        return userLocks[msg.sender].lockTimestamp;
    }

    function getContractBalance() external view onlyOwner returns (uint256) {
        return address(this).balance;
    }
}
