'use client';
import React, { useEffect , useState} from "react";
import LoyaltyProgram from "../../../Abi/loyalty-program.json";
import LoyaltyProgramFactory from "../../../Abi/loyalty-program-factory.json";
import OmniToken from "../../../Abi/omni-token.json";
import { useAccount } from 'wagmi';
import { readContract} from '@wagmi/core';
import { ethers } from 'ethers';
import { toast } from 'react-toastify';

export default function FormTransfer({ loyalID, loyaltyProgramAddress, getUserInfo , data, isError, isLoading, error, refetch, isAllowanceSet, getAllowance, setAllowance}){

  const { address, isConnected } = useAccount(); 

  const [showBlur, setShowBlur] = useState(false); 
  const [recipientAddress, setRecipientAddress] = useState('');
  const [tokenAmount, setTokenAmount] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const notifyRegister = () => toast("Register your Loyal ID!");
  const notifyConnect = () => toast("Connect your wallet!");

  const isSendDisabled = () => {
    return (
      !recipientAddress || 
      !tokenAmount || 
      recipientAddress === address ||
      recipientAddress.length !== 42 ||  
      isNaN(tokenAmount) ||               
      Number(tokenAmount) <= 0            
    );
  };

  const domain = {
    name: "OmniWallet3",
    version: "1",
    chainId: 11155111,
    verifyingContract: loyaltyProgramAddress  
  };

  useEffect(() => {
    if (isConnected && isAllowanceSet === false) {
      setShowBlur(true);
    } else {
      setShowBlur(false);
    }
  }, [isConnected, isAllowanceSet]);

  useEffect(() => {
    const disableButton = (
      !recipientAddress || 
      !tokenAmount || 
      recipientAddress === address ||
      recipientAddress.length !== 42 ||  
      isNaN(tokenAmount) ||               
      Number(tokenAmount) <= 0            
    );
    setIsButtonDisabled(disableButton);  
  }, [recipientAddress, tokenAmount, address]); 

  async function gaslessApproveTokens() {
    if(isConnected && loyalID){

          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();

          console.log('on gasless approve tokens');

          const tokenAmountInWei = ethers.parseUnits('100000000000000000000', 18); 
          console.log(tokenAmountInWei);

          const types = {
              Approval: [
                  { name: "owner", type: "address" },
                  { name: "spender", type: "address" },
                  { name: "value", type: "uint256" },
              ]
          };

          const typedData = {
              types,
              domain,
              primaryType: "Approval",
              message: {
                  owner: address,
                  spender: loyaltyProgramAddress,
                  value: tokenAmountInWei.toString(),
              }
          };

          let signedApproval;
          try {
              signedApproval = await signer.signTypedData(domain, types, typedData.message);
          } catch (error) {
            console.log(error);
              toast.error('Signature rejected by user.');
              return;  
          }

          const requestData = {
              owner: address,
              spender: loyaltyProgramAddress,
              value: tokenAmountInWei.toString(),
              signature: signedApproval,
              loyaltyProgramAddress: loyaltyProgramAddress,
              commercePrefix: loyalID.slice(0,4)
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

              setAllowance(true);
              return data.txHash;
          } else {
              console.error(data.message);
              throw new Error(data.message);
          }

      } else {
          notifyRegister();
          window.scrollTo({
              top: 0,
              behavior: "smooth"
          });
      }
  }
  
  async function gaslessTransferTokens() {
    if (isConnected) {
      console.log('on gasless transfer tokens');
  
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
  
      const toAddress = recipientAddress;

      const types = {
          Transfer: [
              { name: "from", type: "address" },
              { name: "to", type: "address" },
              { name: "amount", type: "uint256" },
          ]
      };

      const typedData = {
          types,
          domain,
          primaryType: "Transfer",
          message: {
              from: address,
              to: toAddress,
              amount: tokenAmount.toString(),
          }
      };
  
      let signedTransfer ;
      try {
        signedTransfer  = await signer.signTypedData(domain,types,typedData.message);
      } catch (error) {
        toast.error('Transaction failed, try again');
        console.log(error);
        return;  
      }
  
      const requestData = {
        from: address,
        to: toAddress,
        amount: tokenAmount.toString(),
        signature: signedTransfer,
        loyaltyProgramAddress: loyaltyProgramAddress,
        commercePrefix: loyalID.slice(0,4)
      }
  
      const response = await toast.promise(
        fetch('http://localhost:6475/transfer', {
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
          refetch();
      } else {
          console.error(data.message);
      }
    }  else{
      console.log('Connect wallet')
      notifyConnect();
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
        <button className={`submit-transfer-form ${isButtonDisabled ? 'disabled-button' : ''}`} 
        type="button" onClick={() => gaslessTransferTokens()}  disabled={isButtonDisabled} >Send</button>
        {showBlur && (
        <div className="blur-overlay">
          <button type="button" onClick={()=>gaslessApproveTokens()}>Allow token transfers</button>
        </div>
      )}
      </form>
    </div>
  )
}