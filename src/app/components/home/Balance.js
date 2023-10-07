'use client';
import React from 'react';
import { useBalance, useAccount, } from 'wagmi';

const Balance = () => {

  const { address, isConnecting, isDisconnected, isConnected } = useAccount()

  const { data, isError, isLoading, error } = useBalance({
    address: address,
    token: '0x204bEf42f4f62Df9612C593dFaf81Cd006C09255',
  })

  return (
    <section className="balance">
      <div className="balance-info">
        <h2>Your Balance</h2>
        {isLoading && <span className="amount">Fetching balance…</span>}
        {isError && <span className="amount">{error.message}</span>}
        {isDisconnected && <span className="amount">0 OMWT</span>}
        {isConnected && <span className="amount">{data?.formatted} {data?.symbol}</span>}
        {(!isLoading && !isError && !isDisconnected && !isConnected) && <span className="amount">0 OMWT</span>}
      </div>
    </section>
  )
}

export default Balance;