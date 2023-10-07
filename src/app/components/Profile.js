'use client';
import {useState} from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
 
function Profile() {

  const { address, isConnected } = useAccount()
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  })
  const [isCopied, setIsCopied] = useState(false);

  const { disconnect } = useDisconnect()

  function truncateAddress(address) {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-5)}`;
  }

  const handleCopyClick = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
        navigator.clipboard.writeText(address).then(function() {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000); 
        });
    } else {
        // Fallback for older browsers
        const textarea = document.createElement("textarea");
        textarea.textContent = address;
        textarea.style.position = "absolute";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000); 
        document.body.removeChild(textarea);
    }
  };

 
  if (isConnected)
  return (
    <div className='header-connect-item'>
      <div className="address-wrapper">
          <span className="address">{truncateAddress(address)}</span>
          <span className="copy-icon" onClick={handleCopyClick}>
              📋
          </span>
          {isCopied && <span>Copied!</span>}
      </div>
    </div>
     
      
  )
  return <button className='button header-connect-item' onClick={() => connect()}>Connect Wallet</button>
}

export default Profile;