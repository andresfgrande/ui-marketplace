import React from 'react';
import Link from 'next/link';
import { useAccount } from 'wagmi'

const Header = () => {
  const { address, isConnecting, isConnected } = useAccount();
  
  let connectionStatus;
  if (isConnecting) {
    connectionStatus = 'Connecting…';
  } else if (!isConnected) {
    connectionStatus = 'Disconnected';
  } else {
    connectionStatus = address;
  }

  return(
    <header className="header">
      <div className='header-content'>
        <Link href="/"><div className="logo">Loyalty</div></Link>
      
        <nav className="nav">
          <Link href="/catalog">
            <span className="span">Catalog</span>
          </Link>
          <Link href="/login">
            <span className="span">Login</span>
          </Link>
          <Link href="/">
            <span className="span">Wallet</span>
          </Link>
        </nav>
        <div><p>{connectionStatus}</p></div> {/* Display connection status here */}
      </div>
    </header>
  );
}

export default Header;
