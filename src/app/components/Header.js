import React from 'react';
import Link from 'next/link';
import { useAccount } from 'wagmi'
import Profile from './Profile';  
import Menu from './Menu';  

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
        <Menu></Menu>
        <Link href="/" className='header-logo-item'><div className="logo">Loyalty</div></Link>
        <Profile></Profile>
      </div>
    </header>
  );
}

export default Header;
