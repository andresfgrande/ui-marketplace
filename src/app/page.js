'use client';
import React from 'react';
import Image from 'next/image';
import Layout from './components/Layout';
import HomeContent from './components/home/HomeContent';

export default function Home() {
  return (
    <Layout>
      <HomeContent></HomeContent>
    </Layout>
  )
}
