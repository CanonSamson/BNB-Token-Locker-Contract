// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

// Import the ReentrancyGuard contract from OpenZeppelin for preventing reentrancy attacks
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract TokenLockingContract is ReentrancyGuard {
    // Declare state variables
    address public owner; // Address of the contract owner
    uint256 public constant interestRate = 2; // Fixed interest rate for locked tokens

    // Define a struct to represent a locked token
    struct Lock {
        uint256 amount; // Amount of tokens locked
        uint256 lockTimestamp; // Timestamp when tokens are locked
        uint256 duration; // Duration for which tokens are locked
    }

    // Define a struct to represent a user
    struct User {
        address walletAddress; // User's wallet address
        string name; // User's name
        string lastname; // User's last name
    }

    // Mapping to associate user addresses with their respective locked tokens
    mapping(address => Lock) public userLocks;

    // Private mapping to store user details (name and last name)
    mapping(address => User) private users;

    // Declare events to log contract actions
    event TokensLocked(address indexed user, uint256 _amount, uint256 _lockTimestamp);
    event UserAdded(address indexed walletAddress, string _name, string _lastname);
    event UnlockTokens(address indexed _walletAddress, uint256 _unlockAmount);

    // Modifier to restrict certain functions to the contract owner
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action");
        _;
    }

    // Constructor function to set the contract owner
    constructor() {
        owner = msg.sender;
    }

    // Function to add a new user with name and last name
    function addUser(string calldata _name, string calldata _lastname) external {
        require(!isUser(msg.sender), "User already exists");

        // Create a new user and store their details
        users[msg.sender] = User(msg.sender, _name, _lastname);

        // Emit an event to log the addition of a new user
        emit UserAdded(msg.sender, users[msg.sender].name, users[msg.sender].lastname);
    }

    // Function to lock tokens for a specified duration
    function lockTokens(uint256 _duration) external payable {
        require(isUser(msg.sender), "User does not exist!");
        require(_duration > 0, "Duration must be greater than 0");
        require(msg.value > 0, "Must lock a non-zero amount of tokens");
        require(userLocks[msg.sender].amount == 0, "Tokens are already locked");

        // Calculate the lock timestamp based on the current time and duration
        uint256 lockTimestamp = block.timestamp + _duration;

        // Update the user's locked token details
        userLocks[msg.sender].amount += msg.value;
        userLocks[msg.sender] = Lock({
            amount: msg.value,
            lockTimestamp: lockTimestamp,
            duration: _duration
        });

        // Emit an event to log the token locking action
        emit TokensLocked(msg.sender, msg.value, lockTimestamp);
    }

    // Function to unlock tokens after the lock duration has passed
    function unlockTokens() external nonReentrant {
        require(isUser(msg.sender), "User does not exist!");
        Lock storage userLock = userLocks[msg.sender];
        require(userLock.amount > 0, "No tokens locked");
        require(block.timestamp >= userLock.lockTimestamp, "Tokens are still locked");

        // Calculate the unlock amount and reset user's locked token details
        uint256 unlockAmount = userLock.amount;
        unchecked {
            userLocks[msg.sender].amount -= unlockAmount;
            delete userLocks[msg.sender];
        }

        // Transfer the unlocked tokens to the user's wallet
        (bool success, ) = msg.sender.call{value: unlockAmount}("");
        require(success, "Transfer failed");

        // Emit an event to log the token unlocking action
        emit UnlockTokens(msg.sender, unlockAmount);
    }

    // Function to check if a user exists
    function isUser(address _walletAddress) private view returns (bool) {
        return users[_walletAddress].walletAddress != address(0);
    }

    // Function to get user details
    function getUser(address _walletAddress) external view returns (User memory) {
        require(isUser(_walletAddress), "User does not exist");
        return users[_walletAddress];
    }

    // Function to calculate user's token rewards based on locked amount and duration
    function calculateUserTokensRewards() external view returns (uint256) {
        require(isUser(msg.sender), "User does not exist!");

        uint256 unlockAmount = userLocks[msg.sender].amount;
        uint256 lockTimestamp = userLocks[msg.sender].lockTimestamp + userLocks[msg.sender].duration;
        uint256 lockingPeriod = lockTimestamp - userLocks[msg.sender].lockTimestamp;
        uint256 rewards = (unlockAmount * interestRate * lockingPeriod) / 1e18;

        return rewards;
    }

    // Function to get the total amount of tokens locked
