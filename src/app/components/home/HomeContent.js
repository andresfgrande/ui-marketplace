import React, { useEffect , useState} from "react";
import Balance from './Balance'
import FeaturedProducts from './FeaturedProducts';
import FormTransfer from './FormTransfer';
import { useUserInfo } from "../../hooks/useUserInfo"
import { useAllowance } from "../../hooks/useAllowance"
import { useAccount } from 'wagmi'; 
import { useBalance} from 'wagmi';

export default function HomeContent() {
    const { address, isDisconnected, isConnected } = useAccount(); 
    const { loyalID, loyaltyProgramAddress, getUserInfo } = useUserInfo(address);
    const { isAllowanceSet , getAllowance, setAllowance} = useAllowance();

    const { data, isError, isLoading, error, refetch } = useBalance({
        address: address,
        token: process.env.NEXT_PUBLIC_OMNI_TOKEN_ADDRESS,
    })

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
          isAllowanceSet={isAllowanceSet}
          getAllowance={getAllowance}
          setAllowance={setAllowance}
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
          isAllowanceSet={isAllowanceSet}
          getAllowance={getAllowance}
          setAllowance={setAllowance}
        ></FormTransfer>
        </main>
    )
}