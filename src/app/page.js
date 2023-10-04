import Image from 'next/image'
import styles from './page.module.css'
import Layout from './components/Layout';

export default function Home() {
  return (
    <Layout>

<main className='main-container'>
        <section className="balance">
            <div className="balance-info">
                <h2>Your Balance</h2>
                <span className="amount">1500 OMW</span>
            </div>
           
        </section>

      
        <section className="products">
            <h2>Redeem Products</h2>
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
                    <span className='product-price'>100 LTY</span>
                    <button>Redeem</button>
                </div>
                <div className="product">
                <img src="https://picsum.photos/id/237/200/300" alt="Product 1"/>
                    <h3>Product Name</h3>
                    <span className='product-price'>100 LTY</span>
                    <button>Redeem</button>
                </div>
                <div className="product">
                <img src="https://picsum.photos/id/237/200/300" alt="Product 1"/>
                    <h3>Product Name</h3>
                    <span className='product-price'>100 LTY</span>
                    <button>Redeem</button>
                </div>
                <div className="product">
                <img src="https://picsum.photos/id/237/200/300" alt="Product 1"/>
                    <h3>Product Name</h3>
                    <span className='product-price'>100 LTY</span>
                    <button>Redeem</button>
                </div>
                <div className="product">
                <img src="https://picsum.photos/id/237/200/300" alt="Product 1"/>
                    <h3>Product Name</h3>
                    <span className='product-price'>100 LTY</span>
                    <button>Redeem</button>
                </div>
                <div className="product">
                <img src="https://picsum.photos/id/237/200/300" alt="Product 1"/>
                    <h3>Product Name</h3>
                    <span className='product-price'>100 LTY</span>
                    <button>Redeem</button>
                </div>
                <div className="product">
                <img src="https://picsum.photos/id/237/200/300" alt="Product 1"/>
                    <h3>Product Name</h3>
                    <span className='product-price'>100 LTY</span>
                    <button>Redeem</button>
                </div>
                
            </div>
        </section>

        
        <div className="transfer-form">
            <h2 className='title-transfer'>Transfer Tokens</h2>
            <form>
                <label htmlFor="address">Recipient Address:</label>
                <input type="text" id="address" name="address" required/>
                <label htmlFor="amount">Amount:</label>
                <input type="number" id="amount" name="amount" required/>
                <button type="submit">Send</button>
            </form>
        </div>

    </main>
    </Layout>
  )
}
