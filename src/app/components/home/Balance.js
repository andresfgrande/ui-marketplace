'use client';
import React from 'react';
import { useEffect, useState } from 'react';
import { useBalance, useAccount, } from 'wagmi';
import { readContract} from '@wagmi/core';
import LoyaltyProgramFactory from "../../../Abi/loyalty-program-factory.json";
import {  toast } from 'react-toastify';

const Balance = ({ loyalID, loyaltyProgramAddress, getUserInfo, data, isError, isLoading, error, refetch }) => {

  const { address, isConnecting, isDisconnected, isConnected } = useAccount()
  const [inputValue, setInputValue] = useState("");

  async function registerUser (e)  {
    e.preventDefault();

    if(isConnected){
      console.log('on submit register address!');

      let prefix = inputValue.slice(0,4);
      const requestData = {
        address: address,
        loyaltyId: inputValue,
        commercePrefix: prefix
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
          console.log(`Transaction hash: ${data.txHashRegister}`);
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
        setInputValue('');
    }

    if (isDisconnected){
      getUserInfo();
    }
  }, [address]);

  return (
    <section className="balance">
      <div className="balance-info">
        <h2>Your Balance</h2>
        {isLoading && <span className="amount">Fetching balance…</span>}
        {isError && <span className="amount">Fetching balance…</span>}
        {isDisconnected && <span className="amount">0 OMW</span>}
        {isConnected && <span className="amount">{data?.formatted} {data?.symbol}</span>}
        {(!isLoading && !isError && !isDisconnected && !isConnected) && <span className="amount">0 OMW</span>}
      </div>
      <div className='balance-info user-info'>
        <h2>Loyal ID</h2>
        {loyalID ? (
            <p className="loyalid-text">{loyalID}</p>
        ) : isConnected ? (
            <div>
                <p>{"You're not registered yet!"}</p>
                <form className='register-form' onSubmit={registerUser}>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value.toUpperCase())}
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