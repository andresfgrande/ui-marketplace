import React, { useState } from 'react';
import Link from 'next/link';
import { useAccount, useConnect, useDisconnect } from 'wagmi';

const Menu = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { isConnected } = useAccount();

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const { disconnect } = useDisconnect();

  return (
    <div className='header-menu-item'>
      <div onClick={toggleSidebar} className="hamburger">
         {isSidebarOpen ? "×" : "≡"}
     </div>

      <div className={isSidebarOpen ? "sidebar open" : "sidebar"}>
        <ul className="nav">
          <li>
            <Link href="/catalog">
              <span>Catalog</span>
            </Link>
          </li>
          <li>
            <Link href="/login">
              <span>Login</span>
            </Link>
          </li>
        </ul>
        {isConnected && 
        <div className='button-disconnect-container'>
            <button className='button-disconnect' onClick={() => disconnect()}><span>Disconnect</span></button>
        </div>
          
        }
      </div>
    </div>
  );
}

export default Menu;
