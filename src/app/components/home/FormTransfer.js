'use client';
import React, { useEffect , useState} from "react";
import LoyaltyProgram from "../../../Abi/loyalty-program.json";
import LoyaltyProgramFactory from "../../../Abi/loyalty-program-factory.json";
import OmniToken from "../../../Abi/omni-token.json";
import { useBalance, useAccount, } from 'wagmi';
import { readContract} from '@wagmi/core';
import { keccak256, encodePacked, parseEther} from 'viem';
import { ethers } from 'ethers';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function FormTransfer(){

  const { address, isConnected } = useAccount(); 

  const [isAllowanceSet, setIsAllowanceSet] = useState(null); 
  const [showBlur, setShowBlur] = useState(false); 

  const [recipientAddress, setRecipientAddress] = useState('');
  const [tokenAmount, setTokenAmount] = useState('');

  useEffect(() => {
    async function checkAllowance() {
      const allowance = await getAllowance();
      if (allowance && allowance > 0) {
        setIsAllowanceSet(true);
      } else {
        setIsAllowanceSet(false);
      }
    }

    if (isConnected && address) {
      checkAllowance();
    }
  }, [isConnected, address]);

  useEffect(() => {
    if (isConnected && isAllowanceSet === false) {
      setShowBlur(true);
    } else {
      setShowBlur(false);
    }
  }, [isConnected, isAllowanceSet]);

  async function getAllowance() {
    try {
      const data = await readContract({
        address: process.env.NEXT_PUBLIC_OMNI_TOKEN_ADDRESS, 
        abi: OmniToken.abi,
        functionName: 'allowance',
        args: [address, process.env.NEXT_PUBLIC_LOYALTY_PROGRAM_ADDRESS]
      });
      return data;
    } catch (error) {
      console.error("Error fetching allowance:", error);
      return null;
    }
  }

  async function gaslessApproveTokens() {

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    console.log('on gasless approve tokens');
   
    const tokenAmountInWei = ethers.parseUnits('9999999999999999999', 18); 
    console.log(tokenAmountInWei);

    const message = ethers.solidityPackedKeccak256(
      ['address', 'address', 'uint256'],
      [address, process.env.NEXT_PUBLIC_LOYALTY_PROGRAM_ADDRESS, tokenAmountInWei] //Loyalty program coger dinamicamente by user
    );

    const signedApproval = await signer.signMessage(ethers.getBytes(message));

    const requestData = {
      owner: address,
      spender: process.env.NEXT_PUBLIC_LOYALTY_PROGRAM_ADDRESS,
      value: tokenAmountInWei.toString(),
      signature: signedApproval
    };

    const response = await toast.promise(
        fetch('http://localhost:6475/approve', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        }),
        {
            pending: 'Processing transaction...',
            success: 'Transaction confirmed!',
            error: 'Failed! Try again'
        }
    );

    const data = await response.json();

    if (data && data.success) {
        console.log(`Approval transaction hash: ${data.txHash}`);
        setIsAllowanceSet(true);
        return data.txHash;
    } else {
        console.error(data.message);
        throw new Error(data.message);
    }

  }

  async function gaslessTransferTokens() {
    if (isConnected) {
      console.log('on gasless transfer tokens');
  
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
  
      //controlar primero mi balance para dejar enviar lo justo
      const tokenAmountInWei = ethers.parseUnits(tokenAmount.toString(), 18);
      const toAddress = recipientAddress;
  
      const message = ethers.solidityPackedKeccak256(
        ['address', 'address', 'uint256'],
        [address, toAddress, tokenAmountInWei]
      );
  
      const signedTransfer = await signer.signMessage(ethers.getBytes(message));
  
      const requestData = {
        from: address,
        to: toAddress,
        amount: tokenAmountInWei.toString(),
        signature: signedTransfer
      }
  
      const response = await toast.promise(
        fetch('http://localhost:6475/relay', {
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
          pending: 'Processing transaction...',
          success: 'Transaction confirmed!',
          error: 'Failed! Try again.'
        }
      );
  
      const data = await response.json();
      if (data && data.success) {
          console.log(`Transaction hash: ${data.txHash}`);
          setRecipientAddress('');
          setTokenAmount('');
      } else {
          console.error(data.message);
      }
    }  else{
      console.log('Connect wallet')
    }
  }
  

  return(
    <div className="transfer-form">
      <h2 className='title-transfer'>Transfer Tokens</h2>
      <form className="transfer-form">
        <label htmlFor="address">Recipient Address:</label>
        <input 
        type="text" 
        value={recipientAddress} 
        id="address" 
        name="address" 
        onChange={e => setRecipientAddress(e.target.value)}
        required />
        <label htmlFor="amount">Amount:</label>
        <input 
        type="number" 
        id="amount" 
        name="amount" 
        value={tokenAmount}
        onChange={e => setTokenAmount(e.target.value)}
        required />
        <button className="submit-transfer-form" type="button" onClick={() => gaslessTransferTokens()} >Send</button>
        {showBlur && (
        <div className="blur-overlay">
          <button type="button" onClick={()=>gaslessApproveTokens()}>Activate token transfers</button>
        </div>
      )}
      </form>
        <ToastContainer position="bottom-right"  />
    </div>
  )
}