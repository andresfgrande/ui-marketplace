'use client';
import React from 'react';
import Header from './Header';
import Footer from './Footer';


import { WagmiConfig, createConfig, configureChains, mainnet } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet],
  [publicProvider()],
)

const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
})

const Layout = ({ children }) => (
  <WagmiConfig config={config}>
     <div>
  <Header />
  {children}
  <Footer />
</div>
</WagmiConfig>
 
);

export default Layout;
