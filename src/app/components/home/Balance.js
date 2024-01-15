'use client';
import React from 'react';
import { useEffect, useState } from 'react';
import { useBalance, useAccount, } from 'wagmi';
import { readContract} from '@wagmi/core';
import LoyaltyProgramFactory from "../../../Abi/loyalty-program-factory.json";
import {  toast } from 'react-toastify';
import { ethers } from 'ethers';

const Balance = ({ loyalID, loyaltyProgramAddress, getUserInfo, data, isError, isLoading, error, refetch }) => {

  const { address, isConnecting, isDisconnected, isConnected } = useAccount()
  const [inputValue, setInputValue] = useState("");

  const domain = {
    name: "OmniWallet3",
    version: "1",
    chainId: 11155111,
    verifyingContract: process.env.NEXT_PUBLIC_LOYALTY_PROGRAM_FACTORY_ADDRESS
  };

  async function registerUser (e)  {
    e.preventDefault();

    if(isConnected){
      console.log(address);
      console.log('on submit register address!');

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const types = {
          Register: [
              { name: "loyaltyId", type: "string" },
              { name: "userAddress", type: "address" },
          ]
      };

      const typedData = {
          types,
          domain,
          primaryType: "Register",
          message: {
              loyaltyId: inputValue,
              userAddress: address
          }
      };

      console.log(typedData);

      let signedRegister;
      try {
        signedRegister  = await signer.signTypedData(domain,types,typedData.message);
      } catch (error) {
        toast.error('Signature rejected by user.');
        console.log(error);
        return;  
      }

      let prefix = inputValue.slice(0,4);
      const requestData = {
        address: address,
        loyaltyId: inputValue,
        signature: signedRegister,
        commercePrefix: prefix
      }
     
      const response = await toast.promise(
        fetch('/register', {
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

  const copyTokenToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(process.env.NEXT_PUBLIC_OMNI_TOKEN_ADDRESS);
      toast.success('Copied!');
    } catch (error) {
      toast.error('Failed to copy');
    }
  };

  const copyLoyaltyIdToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(loyalID);
      toast.success('Copied!');
    } catch (error) {
      toast.error('Failed to copy');
    }
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
        <div className='token-info'>
          <p className='token-address'>{process.env.NEXT_PUBLIC_OMNI_TOKEN_ADDRESS.slice(0,10)}...{process.env.NEXT_PUBLIC_OMNI_TOKEN_ADDRESS.slice(-10)}</p>
          <img
              className='token-copy'
              src="/copy.png"
              alt="Copy token address"
              onClick={copyTokenToClipboard}
            />
        </div>
       
      </div>
      <div className='balance-info user-info'>
        <h2>Loyalty ID</h2>
        {loyalID ? (
            <div className='loyalty-info'>
                 <p className="loyalid-text">{loyalID}</p>
                 <img
                    className='token-copy'
                    src="/copy.png"
                    alt="Copy token address"
                    onClick={copyLoyaltyIdToClipboard}
                  />
            </div>
         
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