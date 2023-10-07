'use client';
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import ProductsGrid from '../components/catalog/ProductsGrid';

export default function Catalog() {
    
    return (
        <Layout>
            <ProductsGrid></ProductsGrid>
        </Layout>
    )
}
