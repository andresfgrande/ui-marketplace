'use client';
import React, { useState, useEffect } from 'react';
import productsData from '../../../data/catalog.json';
import { useAccount } from 'wagmi';
import { toast } from 'react-toastify';
import { ethers } from 'ethers';

export default function ProductsGrid({ loyalID, loyaltyProgramAddress, getUserInfo, isAllowanceSet, getAllowance, setAllowance }) {
    const [filteredProducts, setFilteredProducts] = useState(productsData);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedCommerce, setSelectedCommerce] = useState('All');
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const { address, isDisconnected, isConnected } = useAccount();
    const notifyConnect = () => toast("Connect your wallet!");
    const notifyRegister = () => toast("Register your Loyal ID!");
    const notifyActivateTransfer = () => toast("Allow token transfers to start!");

    const domain = {
      name: "OmniWallet3",
      version: "1",
      chainId: 11155111,
      verifyingContract: loyaltyProgramAddress  
    };

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

      async function redeemProduct(productSku, productCommerceAddress,tokenAmount){

        if(isConnected){
  
          if(loyalID){
            if(isAllowanceSet){
  
  
              console.log('on gasless redeem product');
    
              const provider = new ethers.BrowserProvider(window.ethereum);
              const signer = await provider.getSigner();
  
              const types = {
                  Redeem: [
                    { name: "productSku", type: "string"},
                    { name: "from", type: "address" },
                    { name: "toProductCommerce", type: "address" },
                    { name: "toUserCommerce", type: "address" },
                    { name: "amount", type: "uint256" },
                  ]
              };
  
              const typedData = {
                  types,
                  domain,
                  primaryType: "Redeem",
                  message: {
                      productSku: productSku, 
                      from: address,
                      toProductCommerce: productCommerceAddress,
                      toUserCommerce: loyaltyProgramAddress,
                      amount: tokenAmount.toString(),
                  }
              };
          
              let signedRedeem;
              try {
                signedRedeem = await signer.signTypedData(domain,types,typedData.message);
              } catch (error) {
                toast.error('Signature rejected by user.');
                return;  
              }
          
              const requestData = {
                productSku: productSku,
                from: address,
                toProductCommerceAddress: productCommerceAddress,
                toUserCommerceAddress: loyaltyProgramAddress,
                amount: tokenAmount.toString(),
                signature: signedRedeem,
                loyaltyProgramAddress: loyaltyProgramAddress,
                commercePrefix: loyalID.slice(0,4)
              }
          
              const response = await toast.promise(
                fetch('http://localhost:6475/redeem', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(requestData)
                }).then(res => {
                  if (!res.ok) {
                    return res.json().then(data => {
                      throw new Error(data.message || 'Failed! Try again');
                    });
                  }
                  return res;
                }),
                {
                  pending: 'Processing transaction...',
                  success: 'Transaction confirmed!',
                  error: 'Failed! Try again.'
                }
              );
          
              const data = await response.json();
              if (data && data.success) {
                  console.log(`Transaction hash: ${data.txHash}`);
              } else {
                  console.error(data.message);
              }
  
            }else{
              notifyActivateTransfer();
            }
          }else{
            notifyRegister();
            window.scrollTo({
              top: 0,
              behavior: "smooth"
            });
          }
  
        }else{
          notifyConnect();
        }
  
      }

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
                                    <span className="product-sku">SKU: {product.sku}</span>
                                    <p className='product-price'>{product.price} OMW</p>
                                </div>
                                <button onClick={()=>redeemProduct(product.sku, product.commerceAddress, product.price)}>Redeem</button>
                            </div>
                        ))}
                        </div>
                    </section>
                </div>
            </main>
     
    )
}
