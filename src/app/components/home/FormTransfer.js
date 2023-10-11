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
   
    const tokenAmountInWei = ethers.parseUnits('9999999999999999999', 18); //Será un valor muy grande
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
      const tokenAmountInWei = ethers.parseUnits('1', 18); //Será un valor de input amount
      const toAddress = "0x4c5da66830d94B20d740106144f3C6a2Dc0D91b1"; //Será valor de input recipient address

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
          }),
          {
            pending: 'Processing transaction...',
            success: 'Transaction confirmed!',
            error: 'Failed! Try again'
          }
      );

      const data = await response.json();
      if (data && data.success) {
          console.log(`Transaction hash: ${data.txHash}`);
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
        <input type="text" id="address" name="address" required />
        <label htmlFor="amount">Amount:</label>
        <input type="number" id="amount" name="amount" required />
        <button className="submit-transfer-form" type="submit" onClick={() => gaslessTransferTokens()} >Send</button>
        {showBlur && (
        <div className="blur-overlay">
          <button onClick={()=>gaslessApproveTokens()}>Activate token transfers</button>
        </div>
      )}
      </form>
        <ToastContainer position="bottom-right"  />
    </div>
  )
}