'use client';
import React, { useState, useEffect } from 'react';
import ProductsGrid from './ProductsGrid';
import { useUserInfo } from "../../hooks/useUserInfo"
import { useAllowance } from "../../hooks/useAllowance"
import { useAccount } from 'wagmi'; 

export default function CatalogContent(){

    const { address, isDisconnected, isConnected } = useAccount(); 
    const { loyalID, loyaltyProgramAddress, getUserInfo } = useUserInfo(address);
    const { isAllowanceSet , getAllowance, setAllowance} = useAllowance();

    useEffect(() => {
      setAllowance(false);
    }, [isDisconnected])

    useEffect(() => {
      if(address){
        getUserInfo();
        setAllowance(false)
      }
    }, [address])

    useEffect(() => {
      if (isConnected && address && loyaltyProgramAddress) {
        getAllowance(address, loyaltyProgramAddress);
      }
    }, [isConnected, address, loyaltyProgramAddress])
    return(
        <ProductsGrid
              loyalID={loyalID} 
              loyaltyProgramAddress={loyaltyProgramAddress} 
              getUserInfo={getUserInfo} 
              isAllowanceSet={isAllowanceSet}
              getAllowance={getAllowance}
              setAllowance={setAllowance}
        ></ProductsGrid>
    )
}