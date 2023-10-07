'use client';
import React from 'react';
import Image from 'next/image';
import Layout from './components/Layout';
import Balance from './components/home/Balance';
import FeaturedProducts from './components/home/FeaturedProducts';
import FormTransfer from './components/home/FormTransfer';

export default function Home() {
  return (
    <Layout>
      <main className='main-container'>
        <Balance></Balance>
        <FeaturedProducts></FeaturedProducts>
        <FormTransfer></FormTransfer>
      </main>
    </Layout>
  )
}
