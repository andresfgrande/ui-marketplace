'use client';
import React, { useState, useEffect } from 'react';
import productsData from '../../../data/catalog.json';

export default function ProductsGrid() {
    const [filteredProducts, setFilteredProducts] = useState(productsData);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedCommerce, setSelectedCommerce] = useState('All');

    const [isSidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        let filtered = productsData;
        
        if (selectedCategory !== 'All') {
            filtered = filtered.filter(product => product.category === selectedCategory);
        }

        if (selectedCommerce !== 'All') {
            filtered = filtered.filter(product => product.commerceName === selectedCommerce);
        }

        setFilteredProducts(filtered);
    }, [selectedCategory, selectedCommerce]); 

    const uniqueCategories = Array.from(new Set(productsData.map(product => product.category)));
    const uniqueCommerces = Array.from(new Set(productsData.map(product => product.commerceName))); 

    return (
    
            <main className='main-container'>
                <h1 className='main-title'>Catalog</h1>
                
                <button className={`sidebar-toggle ${isSidebarOpen ? 'toggle-opened' : ''}`} onClick={() => setSidebarOpen(!isSidebarOpen)}>
                            {isSidebarOpen ? 'Close filters' : 'Show filters'}
                </button>

                <div className="catalog-wrapper">
                
                    <aside className={`sidebar-categories ${isSidebarOpen ? 'open' : ''}`}>
                        <button className={`sidebar-toggle2 ${isSidebarOpen ? 'toggle2-opened' : ''}`} onClick={() => setSidebarOpen(!isSidebarOpen)}>
                            {isSidebarOpen ? 'Close filters' : 'Show filters'}
                        </button>
                        <h2 className='subtitle-categories'>Stores</h2>
                        <ul className='stores-list'>
                            <li onClick={() => { setSelectedCommerce('All'); setSidebarOpen(false); }} className={selectedCommerce === 'All' ? 'active' : ''}>All</li>
                            {uniqueCommerces.map(commerce => (
                                <li key={commerce} onClick={() => {setSelectedCommerce(commerce);setSidebarOpen(false);}} className={selectedCommerce === commerce ? 'active' : ''}>
                                    {commerce}
                                </li>
                            ))}
                        </ul>

                        <h2 className='subtitle-categories'>Categories</h2>
                        <ul className='categories-list'>
                            <li onClick={() => { setSelectedCategory('All'); setSidebarOpen(false); }} className={selectedCategory === 'All' ? 'active' : ''}>All</li>
                            {uniqueCategories.map(category => (
                                <li key={category} onClick={() => {setSelectedCategory(category); setSidebarOpen(false)}} className={selectedCategory === category ? 'active' : ''}>
                                    {category}
                                </li>
                            ))}
                        </ul>
                        
                    </aside>

                    <section className="products products-catalog">
                        <div className="product-list">
                        {filteredProducts.map(product => (
                            <div key={product.id} className="product">
                                <div className="product-content"> 
                                    <img src={product.image} alt={product.name} />
                                    <h3 className='product-name'>{product.name}</h3>
                                    <p className='product-price'>{product.price} OMWT</p>
                                </div>
                                <button>Redeem</button>
                            </div>
                        ))}
                        </div>
                    </section>
                </div>
            </main>
     
    )
}
