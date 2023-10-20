import React from "react";
import Balance from './Balance'
import FeaturedProducts from './FeaturedProducts';
import FormTransfer from './FormTransfer';

import { useUserInfo } from "../../hooks/useUserInfo"
import { useAccount } from 'wagmi'; 
import { useBalance} from 'wagmi';

export default function HomeContent() {
    const { address } = useAccount(); 
    const { loyalID, loyaltyProgramAddress, getUserInfo } = useUserInfo(address);

    const { data, isError, isLoading, error, refetch } = useBalance({
        address: address,
        token: process.env.NEXT_PUBLIC_OMNI_TOKEN_ADDRESS,
    })

    return(
        <main className="main-container">
        <Balance
          loyalID={loyalID} 
          loyaltyProgramAddress={loyaltyProgramAddress} 
          getUserInfo={getUserInfo} 
          data={data}
          isError={isError}
          isLoading={isLoading}
          error={error}
          refetch={refetch}
        ></Balance>
        <FeaturedProducts
          loyalID={loyalID} 
          loyaltyProgramAddress={loyaltyProgramAddress} 
          getUserInfo={getUserInfo} 
          data={data}
          isError={isError}
          isLoading={isLoading}
          error={error}
          refetch={refetch}
        ></FeaturedProducts>
        <FormTransfer
          loyalID={loyalID} 
          loyaltyProgramAddress={loyaltyProgramAddress} 
          getUserInfo={getUserInfo} 
          data={data}
          isError={isError}
          isLoading={isLoading}
          error={error}
          refetch={refetch}
        ></FormTransfer>
        </main>
    )
}