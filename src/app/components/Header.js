import React from 'react';
import Link from 'next/link';

const Header = () => (
  <header className="header">
    <div className='header-content'>
    <div className="logo">Loyalty</div>
    <nav className="nav">
      <Link href="/login">
        <span className="span">Login</span>
      </Link>
      <Link href="/">
        <span className="span">Wallet</span>
      </Link>
    </nav>
    </div>
     
  </header>
);

export default Header;
