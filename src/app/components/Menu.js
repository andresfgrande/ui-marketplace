'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAccount, useConnect, useDisconnect } from 'wagmi';

const Menu = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef();
  const hamburgerRef = useRef();
  const { isConnected } = useAccount();

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const handleDisconnect = () => {
    disconnect();
    toggleSidebar();
  };

  const outsideClickListener = (event) => {
    if (!sidebarRef.current.contains(event.target) && !hamburgerRef.current.contains(event.target) && isSidebarOpen) {
      toggleSidebar();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', outsideClickListener);

    return () => {
      document.removeEventListener('mousedown', outsideClickListener);
    };
  }, [isSidebarOpen]);

  const { disconnect } = useDisconnect();

  return (
    <div className='header-menu-item'>
      <div onClick={toggleSidebar} className="hamburger" ref={hamburgerRef}>
        <span> {isSidebarOpen ? "×" : "≡"}</span>
      </div>

      <div className={isSidebarOpen ? "sidebar open" : "sidebar"} ref={sidebarRef}>
        <ul className="nav">
          <li>
            <Link href="/catalog">
              <span>Catalog</span>
            </Link>
          </li>
          <li>
            <Link href="/transactions">
              <span>Transactions</span>
            </Link>
          </li>
          
        </ul>
        {isConnected && 
          <div className='button-disconnect-container'>
              <button className='button-disconnect' onClick={handleDisconnect}><span>Disconnect</span></button>
          </div>   
        }
      </div>
    </div>
  );
}

export default Menu;
