import productsData from '../../../data/catalog.json';
import { toast } from 'react-toastify';
import React, { useEffect , useState} from "react";
import LoyaltyProgram from "../../../Abi/loyalty-program.json";
import LoyaltyProgramFactory from "../../../Abi/loyalty-program-factory.json";
import OmniToken from "../../../Abi/omni-token.json";
import { useAccount } from 'wagmi';
import { readContract} from '@wagmi/core';
import { ethers } from 'ethers';

export default function FeaturedProducts ({ loyalID, loyaltyProgramAddress, getUserInfo, data, isError, isLoading, error, refetch, isAllowanceSet, getAllowance, setAllowance }){

    const { address, isDisconnected, isConnected } = useAccount()

    const notifyConnect = () => toast("Connect your wallet!");
    const notifyRegister = () => toast("Register your Loyal ID!");
    const notifyActivateTransfer = () => toast("Allow token transfers to start!");

    const featuredProducts = productsData.filter(product => product.isFeatured).slice(0,10);

    const domain = {
      name: "OmniWallet3",
      version: "1",
      chainId: 11155111,
      verifyingContract: loyaltyProgramAddress  
    };

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
              fetch('/redeem', {
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
                refetch();
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

    return(
        <section className="products">
          <h2>Featured Products</h2>
          <div className="product-list">
            {featuredProducts.map(product => (
              <div key={product.id} className="product">
                <img src={product.image} alt={product.name} />
                <h3 className="product-name">{product.name}</h3>
                <span className="product-sku">SKU: {product.sku}</span>
                <p className='product-price'>{product.price} OMW</p>
                <button onClick={()=>redeemProduct(product.sku, product.commerceAddress, product.price)}>Redeem</button>
              </div>
            ))}
          </div>
        </section>
    )
}