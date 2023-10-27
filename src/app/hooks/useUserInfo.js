import { useState } from 'react';
import { readContract } from '@wagmi/core';
import LoyaltyProgramFactory from "../../Abi/loyalty-program-factory.json";

export const useUserInfo = (address) => {
    const [loyalID, setLoyalID] = useState("");
    const [loyaltyProgramAddress, setLoyaltyProgramAddress] = useState("");

    async function getUserInfo() {
    
        if(address){
            try {
                const [loyalIDFromContract, loyaltyProgram] = await readContract({
                    address: process.env.NEXT_PUBLIC_LOYALTY_PROGRAM_FACTORY_ADDRESS,
                    abi: LoyaltyProgramFactory.abi,
                    functionName: 'getUserInfoByAddress',
                    args: [address]
                });
                if (loyalIDFromContract && loyalIDFromContract !== null && loyalIDFromContract !== "") {
                    setLoyalID(loyalIDFromContract);
                    setLoyaltyProgramAddress(loyaltyProgram);
                } else {
                    setLoyalID('');
                    setLoyaltyProgramAddress('');
                }
                
            } catch (error) {
                console.error("Error fetching data:", error);
                setLoyalID('');
                setLoyaltyProgramAddress('');
            }
        }else{
            setLoyalID('');
            setLoyaltyProgramAddress('');
        }
        
    }

    return { loyalID, loyaltyProgramAddress, getUserInfo };
}
