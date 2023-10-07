import React from "react";
import productsData from '../../../data/catalog.json';

export default function FeaturedProducts (){

    const featuredProducts = productsData.filter(product => product.isFeatured).slice(0,10);

    return(
        <section className="products">
          <h2>Featured Products</h2>
          <div className="product-list">
            {featuredProducts.map(product => (
              <div key={product.id} className="product">
                <img src={product.image} alt={product.name} />
                <h3 className="product-name">{product.name}</h3>
                <p className='product-price'>{product.price} OMWT</p>
                <button>Redeem</button>
              </div>
            ))}
          </div>
        </section>
    )
}