import React from 'react';
import Layout from '../components/Layout';

export default function Catalog(){
    return(
        <Layout>
            <main className='main-container'>
            <h1 className='main-title'>Catalog</h1>

                <section className="products">
                   
                    <div className="product-list">
                        <div className="product">
                        <img src="https://picsum.photos/id/237/200/300" alt="Product 1"/>
                            <h3>Product Name</h3>
                            <p className='product-price'>100 LTY</p>
                            <button>Redeem</button>
                        </div>
                        <div className="product">
                        <img src="https://picsum.photos/id/237/200/300" alt="Product 1"/>
                            <h3>Product Name</h3>
                            <p className='product-price'>100 LTY</p>
                            <button>Redeem</button>
                        </div>
                        <div className="product">
                        <img src="https://picsum.photos/id/237/200/300" alt="Product 1"/>
                            <h3>Product Name</h3>
                            <p className='product-price'>100 LTY</p>
                            <button>Redeem</button>
                        </div>
                        <div className="product">
                        <img src="https://picsum.photos/id/237/200/300" alt="Product 1"/>
                            <h3>Product Name</h3>
                            <p className='product-price'>100 LTY</p>
                            <button>Redeem</button>
                        </div>
                        <div className="product">
                        <img src="https://picsum.photos/id/237/200/300" alt="Product 1"/>
                            <h3>Product Name</h3>
                            <p className='product-price'>100 LTY</p>
                            <button>Redeem</button>
                        </div>
                        <div className="product">
                        <img src="https://picsum.photos/id/237/200/300" alt="Product 1"/>
                            <h3>Product Name</h3>
                            <p className='product-price'>100 LTY</p>
                            <button>Redeem</button>
                        </div>
                        <div className="product">
                        <img src="https://picsum.photos/id/237/200/300" alt="Product 1"/>
                            <h3>Product Name</h3>
                            <p className='product-price'>100 LTY</p>
                            <button>Redeem</button>
                        </div>

                        
                    </div>
                </section>

            </main>
         
        </Layout>
    )

}