import { useState } from 'react';
import { readContract } from '@wagmi/core';
import OmniToken from "../../Abi/omni-token.json";

export const useAllowance = () => {

    const [isAllowanceSet, setIsAllowanceSet] = useState(false); 
    
    async function getAllowance(address, loyaltyProgramAddress) {
        try {
            const data = await readContract({
              address: process.env.NEXT_PUBLIC_OMNI_TOKEN_ADDRESS, 
              abi: OmniToken.abi,
              functionName: 'allowance',
              args: [address, loyaltyProgramAddress]
      
            });
            if( data && data > 0){
                setIsAllowanceSet(true)
            }
          } catch (error) {
            console.error("Error fetching allowance:", error);
            setIsAllowanceSet(false)
        }  
    }

    async function setAllowance(state){
      setIsAllowanceSet(state)
    }

    return { isAllowanceSet, getAllowance, setAllowance };
}
