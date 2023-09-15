import Web3 from "web3";
import Signup from "./components/Signup";
import { useEth } from "./contexts/EthContext";

import {  useState } from "react";
import LockToken from "./components/LockToken";
import Header from "./components/Header";
import './styles.css';
import { AiFillUnlock } from "react-icons/ai";

function App() {

 // Destructure variables from the 'useEth' hook's state
const { state: { contract, accounts }, tryInit } = useEth();

// State variables to manage the component's state
const [isConnect, setIsConnect] = useState(false); // Indicates whether the user is connected
const [user, setUser] = useState(null); // Stores user data
const [name, setName] = useState(""); // Stores user's name
const [lastName, setLastName] = useState(""); // Stores user's last name

const [lockedToken, setLockedToken] = useState(null); // Stores information about locked tokens
const [userTokensRewards, setUserTokensRewards] = useState(null); // Stores user's token rewards
const [lockTimestamp, setLockTimestamp] = useState(''); // Stores the lock timestamp
const [duration, setDuration] = useState(0); // Stores the lock duration
const [ethAmountL, setethAmountL] = useState(''); // Stores the amount of Ether to lock
const [isCalling, setIsCalling] = useState(false); // Indicates if a transaction is in progress

// Function to fetch user data from the smart contract
const getUser = async () => {
  try {
    const value = await contract.methods.getUser(accounts[0]).call({ from: accounts[0] });
    setUser(value);
    console.log(value);
  } catch (err) {
    // Handle any errors that occur during the request (if needed)
    console.error(err);
  }
};

// Function to add a user to the smart contract
const addUser = async () => {
  if (isConnect) {
    // Set a flag to indicate that a transaction is in progress
    setIsCalling(true);

    try {
      // Call the 'addUser' function on the smart contract with the provided name and last name
      const value = await contract.methods.addUser(name, lastName).send({ from: accounts[0] });
      console.log(value);

      // Reset the flag to indicate that the transaction is complete
      setIsCalling(false);
    } catch (err) {
      // Handle any errors that occur during the transaction
      console.error(err);

      // Reset the flag to indicate that the transaction is complete
      setIsCalling(false);
    }
  } else {
    // Display an alert if the user is not connected to their BNB Wallet
    alert("Connect Your BNB Wallet");
  }
};

// Function to lock tokens for the current user
const lockToken = async () => {
  // Check if there is an active connection (presumably 'isConnect' is a boolean flag)
  if (isConnect) {
    // Set a flag to indicate that a transaction is in progress
    setIsCalling(true);

    // Initialize a Web3 instance with the Binance Smart Chain RPC URL
    const web3 = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545');

    // Convert the input 'ethAmountL' to Wei using Web3 utilities
    const amount = web3.utils.toWei(ethAmountL, 'ether');

    try {
      // Call the 'lockTokens' function on the smart contract and send the transaction from the user's account with the specified amount of Ether
      const value = await contract.methods.lockTokens(duration).send({ from: accounts[0], value: amount });

      // Log the result of the transaction (if needed)
      console.log(value);

      // Call the 'login' function to perform actions related to the user's account (e.g., update user data)
      login();

      // Reset the flag to indicate that the transaction is complete
      setIsCalling(false);
    } catch (err) {
      // Handle any errors that occur during the transaction
      setIsCalling(false);
      console.log(err);
    }
  }
}


// Function to unlock tokens for the current user
const unlockToken = async () => {
  // Check if there is an active connection (presumably 'isConnect' is a boolean flag)
  if (isConnect) {
    // Set a flag to indicate that a transaction is in progress
    setIsCalling(true);

    try {
      // Call the 'unlockTokens' function on the smart contract and send the transaction from the user's account
      const value = await contract.methods.unlockTokens().send({ from: accounts[0] });

      // Log the result of the transaction (if needed)
      console.log(value);

      // Reset the flag to indicate that the transaction is complete
      setIsCalling(false);

      // Call the 'login' function to perform actions related to the user's account (e.g., update user data)
      login();
    } catch (err) {
      // Handle any errors that occur during the transaction
      console.log(err);

      // Reset the flag to indicate that the transaction is complete
      setIsCalling(false);
    }
  }
}


  const getLockedToken = async () => {


    const web3 = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545');

    try {
      const value = await contract.methods.getUserTotalLockedTokens().call({ from: accounts[0] });
      console.log(value);
      // Convert Wei to Ether
      const etherValue = web3.utils.fromWei(value, 'ether');

      console.log('User Total Locked Tokens (Wei):', value);
      console.log('User Total Locked Tokens (Ether):', etherValue);

      // Display to the user (you can customize this part)
      setLockedToken(etherValue); // Display with 4 decimal places
    } catch (err) {
      console.log(err)
    }
  }



  const getUserLockTimestamp = async () => {

    try {
      const value = await contract.methods.getUserLockTimestamp().call({ from: accounts[0] });
      console.log(value);

      // Create a new Date object from the timestamp
      const date = new Date(value * 1000); // Convert seconds to milliseconds by multiplying by 1000

      // Get individual date and time components
      const year = date.getFullYear();
      const month = date.getMonth() + 1; // Months are zero-indexed, so add 1
      const day = date.getDate();
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const seconds = date.getSeconds();

      // Determine AM or PM
      const amOrPm = hours >= 12 ? 'PM' : 'AM';

      // Convert 24-hour time to 12-hour time
      const formattedHours = hours % 12 || 12; // Use 12 instead of 0 for 12 AM

      // Create a formatted date and time string
      const formattedDateTime = `${year}-${month}-${day} ${formattedHours}:${minutes}:${seconds} ${amOrPm}`;


      setLockTimestamp(formattedDateTime)
    } catch (err) {
      console.log(err)
    }

  }

// Function to retrieve and calculate the rewards for a user's locked tokens
const UserTokensRewards = async () => {
  if (accounts[0]) {
    // Initialize a Web3 instance with the Binance Smart Chain RPC URL
    const web3 = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545');

    try {
      // Call the 'CalculateUserTokensRewards' function on the smart contract
      const value = await contract.methods.CalculateUserTokensRewards().call({ from: accounts[0] });

      // Convert the result from Wei to Ether using Web3 utilities
      const etherValue = web3.utils.fromWei(value, 'ether');

      // Log the user's total locked tokens in both Wei and Ether
      console.log('User Total Locked Tokens (Wei):', value);
      console.log('User Total Locked Tokens (Ether):', etherValue);

      // Set the user's token rewards in Ether in the component's state (assuming 'setUserTokensRewards' is a state setter function)
      setUserTokensRewards(etherValue);
    } catch (err) {
      console.log(err);
    }
  }
};

// Function to perform various actions when a user logs in
const login = async () => {
  // Check if there's an active user account (presumably stored in 'accounts[0]')
  if (accounts[0]) {
    // Call functions to retrieve user data, locked tokens, rewards, and lock timestamp
    getUser(); // Fetch user data
    getLockedToken(); // Fetch information about locked tokens
    UserTokensRewards(); // Calculate user's token rewards
    getUserLockTimestamp(); // Fetch the lock timestamp for the user
  }
}

// Function to mask part of a user's Ethereum address for privacy
const maskAddress = (address) => {
  // Extract the prefix (first 6 characters), middle ('xxx'), and suffix (last 4 characters) of the address
  const prefix = address.slice(0, 6);
  const middle = 'xxx';
  const suffix = address.slice(-4);
  
  // Combine the masked parts to create a masked address
  return `${prefix}${middle}${suffix}`;
}



  return (

    <div id="App">
    <div className="main">
      {/* Display a loading spinner if a transaction is in progress */}
      {isCalling && <div className="loading"></div>}
      
      {/* Background image */}
      <img className="bg" src="https://images.pexels.com/photos/5011647/pexels-photo-5011647.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="" />
      
      {/* Navigation bar */}
      <nav className="  ">
        <h1 className="">Toke<span className="">n L</span>ocker</h1>
        <div className=" flex items-center gap-3">
          {/* Toggle between 'Log in' and 'Log out' button based on user state */}
          <button onClick={() => {
            if (user) {
              setUser(null); // Log out the user
            } else {
              login(); // Log in the user
            }
          }} className=" nav-button  ">{!user ? "Log in" : "Log out"}</button>
          
          {/* Button to connect to the BNB Wallet or display the connected address */}
          <button className=" nav-button  " onClick={() => {
            tryInit(); // Initialize Ethereum-related functionality
            setIsConnect(true); // Set the connection state to 'true'
          }}> {accounts && accounts[0] ? maskAddress(accounts[0]) : "Connect"}</button>
        </div>
      </nav>
  
      {/* Conditional rendering based on user state */}
      {!user ? (
        <div className="container">
          {/* Render the Signup component */}
          <Signup setName={setName} name={name} onClick={addUser} setLastName={setLastName} lastName={lastName} />
        </div>
      ) : (
        <>
          {/* Render the Header component */}
          <div>
            <Header lockedToken={lockedToken} userTokensRewards={userTokensRewards} lockTimestamp={lockTimestamp} user={user} />
          </div>
  
          {/* Conditional rendering based on the value of 'lockedToken' */}
          {lockedToken == 0 ? (
            <div>
              {/* Render the LockToken component */}
              <LockToken duration={duration} setDuration={setDuration} onClick={lockToken} setethAmountL={setethAmountL} ethAmountL={ethAmountL} />
            </div>
          ) : (
            <div className="srceen">
              {/* Render an 'unlock' button with an icon */}
              <button className="unlock" onClick={unlockToken}><AiFillUnlock size={100} /></button>
            </div>
          )}
        </>
      )}
    </div>
  </div>
  

  );
}

export default App;
