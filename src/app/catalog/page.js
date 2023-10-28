'use client';
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import CatalogContent from '../components/catalog/catalogContent';

export default function Catalog() {
    return (
        <Layout>
            <CatalogContent></CatalogContent>
        </Layout>
    )
}
