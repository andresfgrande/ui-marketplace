'use client';
import React from 'react';
import Header from './Header';
import Footer from './Footer';

import {polygonMumbai } from 'wagmi/chains'; //ok
import { WagmiConfig, createConfig, configureChains, mainnet } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { alchemyProvider } from 'wagmi/providers/alchemy';

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [polygonMumbai],
  [alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY })],
)

const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
})

const Layout = ({ children }) => (
  <WagmiConfig config={config}>
    
  <Header />
  {children}
  <Footer />

</WagmiConfig>
 
);

export default Layout;
