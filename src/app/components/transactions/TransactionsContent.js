import React, { useEffect , useState} from "react";
import { useUserInfo } from "../../hooks/useUserInfo"
import { useAccount } from 'wagmi'; 
import UserTransfers from "./UserTransfers";
import RegisterTransaction from "./RegisterTransaction";
import ApprovalTransaction from "./ApprovalTransaction";
import RewardsTransaction from "./RewardsTransaction";

export default function TransactionsContent(){

    const { address, isConnected, isDisconnected } = useAccount(); 
    const { loyalID, loyaltyProgramAddress, getUserInfo } = useUserInfo(address);

    return (
        <main className="main-container">
            <h1 className="main-title">Transactions</h1>
            <RegisterTransaction
                address={address}
                isConnected={isConnected}
                isDisconnected={isDisconnected}
                loyalID={loyalID}
                loyaltyProgramAddress={loyaltyProgramAddress}
                getUserInfo={getUserInfo}
            ></RegisterTransaction>
            <ApprovalTransaction
                address={address}
                isConnected={isConnected}
                isDisconnected={isDisconnected}
                loyalID={loyalID}
                loyaltyProgramAddress={loyaltyProgramAddress}
                getUserInfo={getUserInfo}
            ></ApprovalTransaction>
            <RewardsTransaction
                address={address}
                isConnected={isConnected}
                isDisconnected={isDisconnected}
                loyalID={loyalID}
                loyaltyProgramAddress={loyaltyProgramAddress}
                getUserInfo={getUserInfo}>
            </RewardsTransaction>
            <UserTransfers
                address={address}
                isConnected={isConnected}
                isDisconnected={isDisconnected}
                loyalID={loyalID}
                loyaltyProgramAddress={loyaltyProgramAddress}
                getUserInfo={getUserInfo}
            ></UserTransfers>
        </main>
    )
}