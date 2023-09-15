import Web3 from "web3";
import Signup from "./components/Signup";
import { useEth } from "./contexts/EthContext";

import {  useState } from "react";
import LockToken from "./components/LockToken";
import Header from "./components/Header";
import './styles.css';
import { AiFillUnlock } from "react-icons/ai";

function App() {

  const { state: { contract, accounts }, tryInit } = useEth();

  const [isConnect, setIsConnect] = useState(false)
  const [user, setUser] = useState(null)
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");

  const [lockedToken, setLockedToken] = useState(null)
  const [userTokensRewards, setUserTokensRewards] = useState(null)
  const [lockTimestamp, setLockTimestamp] = useState('')
  const [duration, setDuration] = useState(0)
  const [ethAmountL, setethAmountL] = useState('')
  const [isCalling, setIsCalling] = useState(false)

  const getUser = async () => {
    try {
      const value = await contract.methods.getUser(accounts[0]).call({ from: accounts[0] });
      setUser(value)
      console.log(value)
    } catch {
    }

  };


  const addUser = async () => {
    if (isConnect) {
      setIsCalling(true)
      try {
        const value = await contract.methods.addUser(name, lastName).send({ from: accounts[0] });
        console.log(value);
        setIsCalling(false)
      } catch (err) {
        console.log(err);
        setIsCalling(false)
      }
    } else {
      alert("Conect Your BNB Wallet")
    }
  };
  const lockToken = async () => {


    if (isConnect) {
      setIsCalling(true)
      const web3 = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545');

      const amount = web3.utils.toWei(ethAmountL, 'ether');
      try {
        const value = await contract.methods.lockTokens(duration).send({ from: accounts[0], value: amount });
        console.log(value);
        login()
        setIsCalling(false)
      } catch (err) {
        setIsCalling(false)
        console.log(err)
      }
    }
  }

  const unlockToken = async () => {

    if (isConnect) {
      setIsCalling(true)
      try {
        const value = await contract.methods.unlockTokens().send({ from: accounts[0] });
        console.log(value);
        setIsCalling(false)
        login()
      } catch (err) {
        console.log(err)
        setIsCalling(false)
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

  const UserTokensRewards = async () => {
    if (accounts[0]) {
      const web3 = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545');

      try {
        const value = await contract.methods.CalculateUserTokensRewards().call({ from: accounts[0] });
        console.log(value);
        const etherValue = web3.utils.fromWei(value, 'ether');

        console.log('User Total Locked Tokens (Wei):', value);
        console.log('User Total Locked Tokens (Ether):', etherValue);

        setUserTokensRewards(etherValue)
      } catch (err) {
        console.log(err)
      }
    }
  }

  const login = async () => {

    if (accounts[0]) {
      getUser();
      getLockedToken()
      UserTokensRewards()
      getUserLockTimestamp()
    }
  }
  const maskAddress = (address) => {
    const prefix = address.slice(0, 6);
    const middle = 'xxx';
    const suffix = address.slice(-4);
    return `${prefix}${middle}${suffix}`;
  }


  return (

    <div id="App">
      <div className="main">
        {
          isCalling && <div className="loading"></div>
        }
        <img className="bg" src="https://images.pexels.com/photos/5011647/pexels-photo-5011647.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="" />
        <nav className="  ">
          <h1 className="">Toke<span className="">n L</span>ocker</h1>
          <div className=" flex items-center gap-3">
            <button onClick={() => {
              if (user) {
                setUser(null)
              } else {
                login()
              }
            }} className=" nav-button  ">{!user ? "Log in" : "Log out"}</button>
            <button className=" nav-button  " onClick={() => {
              tryInit()
              setIsConnect(true)
            }}> {accounts && accounts[0] ? maskAddress(accounts[0]) : "Connect"}</button>
          </div>
        </nav>

        {
          !user ? <div className="container">
            <Signup setName={setName} name={name} onClick={addUser} setLastName={setLastName} lastName={lastName} />
          </div>
            :
            <>

              <div>
                <Header lockedToken={lockedToken} userTokensRewards={userTokensRewards} lockTimestamp={lockTimestamp} user={user} />
              </div>

              {lockedToken == 0 ?
                <div>
                  <LockToken duration={duration} setDuration={setDuration} onClick={lockToken} setethAmountL={setethAmountL} ethAmountL={ethAmountL} />
                </div>
                : <div className="srceen">
                  <button className="unlock" onClick={unlockToken}><AiFillUnlock size={100} /></button>
                </div>
              }
            </>
        }
      </div>
    </div>

  );
}

export default App;
