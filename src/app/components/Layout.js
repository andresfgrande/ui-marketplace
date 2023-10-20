import React from 'react';
import Header from './Header';
import Footer from './Footer';

import {polygonMumbai, sepolia } from 'wagmi/chains'; 
import { WagmiConfig, createConfig, configureChains, mainnet } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { alchemyProvider } from 'wagmi/providers/alchemy';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/*const { chains, publicClient, webSocketPublicClient } = configureChains(
  [polygonMumbai],
  [alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY })],
)*/
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [sepolia],
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
  <ToastContainer position="bottom-center"  />
</WagmiConfig>
 
);

export default Layout;
