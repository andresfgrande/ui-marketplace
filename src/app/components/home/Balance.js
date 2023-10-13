'use client';
import React from 'react';
import { useEffect, useState } from 'react';
import { useBalance, useAccount, } from 'wagmi';
import { readContract} from '@wagmi/core';
import LoyaltyProgramFactory from "../../../Abi/loyalty-program-factory.json";
import {  toast } from 'react-toastify';

const Balance = () => {

  const { address, isConnecting, isDisconnected, isConnected } = useAccount()
  const [loyalID, setLoyalID] = useState("");
  const [loyaltyProgramAddress, setLoyaltyProgramAddress] = useState("");
  const [inputValue, setInputValue] = useState("");


  const { data, isError, isLoading, error } = useBalance({
    address: address,
    token: process.env.NEXT_PUBLIC_OMNI_TOKEN_ADDRESS,
    watch: true
  })

  async function getUserInfo() {
    try {
        const [loyalIDFromContract, loyaltyProgram] = await readContract({
            address: process.env.NEXT_PUBLIC_LOYALTY_PROGRAM_FACTORY_ADDRESS,
            abi: LoyaltyProgramFactory.abi,
            functionName: 'getUserInfoByAddress',
            args: [address]
        });
        
        if (loyalIDFromContract) {
            setLoyalID(loyalIDFromContract);
            setLoyaltyProgramAddress(loyaltyProgram);
            console.log([loyalIDFromContract, loyaltyProgram]);
        }else{
          console.log('No registered!');
          setLoyalID('');
          setLoyaltyProgramAddress('');
        }
        
    } catch (error) {
        console.error("Error fetching data:", error);
    }
  }

  async function registerUser (e)  {
    e.preventDefault();

    if(isConnected){
      console.log('on submit register address!');

      let prefix = inputValue.slice(0,3);
      const requestData = {
        address: address,
        loyaltyId: inputValue,
        loyaltyPrefix: prefix
      }
     

      const response = await toast.promise(
        fetch('http://localhost:6475/register', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestData)
        }).then(res => {
          if (!res.ok) {
            return res.json().then(data => {
              throw new Error(data.message || 'Failed! Try again');
            });
          }
          return res;
        }),
        {
          pending: 'Processing registration...',
          success: 'Registration confirmed!',
          error: 'Failed! Try again.'
        }
      );

      const data = await response.json();
      if (data && data.success) {
          console.log(`Transaction hash: ${data.txHash}`);
          getUserInfo();
          setInputValue('');
      } else {
          console.error(data.message);
      }

    }else{
      console.log('connect wallet');
    }
   
    console.log("Submitted:", inputValue);
  };

  useEffect(() => {
    if (address) {
        getUserInfo();
    }

    if (isDisconnected){
      setLoyalID('');
      setLoyaltyProgramAddress('');
    }
  }, [address,isConnected,isDisconnected]);

  return (
    <section className="balance">
      <div className="balance-info">
        <h2>Your Balance</h2>
        {isLoading && <span className="amount">Fetching balance…</span>}
        {isError && <span className="amount">{error.message}</span>}
        {isDisconnected && <span className="amount">0 OMWT</span>}
        {isConnected && <span className="amount">{data?.formatted} {data?.symbol}</span>}
        {(!isLoading && !isError && !isDisconnected && !isConnected) && <span className="amount">0 OMWT</span>}
      </div>
      <div className='balance-info user-info'>
        <h2>Loyal ID</h2>
        {isConnected && loyalID ? (
            <p className="loyalid-text">{loyalID}</p>
        ) : isConnected && !loyalID ? (
            <div>
                <p>{"You're not registered yet!"}</p>
                <form className='register-form' onSubmit={registerUser}>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Enter your loyal ID"
                    />
                    <button type="submit">Register</button>
                </form>
            </div>
        ) : (
            <p>Please connect to view your Loyal ID.</p>
        )}
      </div>
    </section>
)
}

export default Balance;