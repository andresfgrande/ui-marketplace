import React, { useEffect , useState} from "react";
import LoyaltyProgram from "../../../Abi/loyalty-program.json";
import { ethers } from 'ethers';
import { formatDate } from "../../../utils/dateUtils.js";

export default function RedeemTransaction({address, isConnected, isDisconnected, loyalID, loyaltyProgramAddress, getUserInfo}){

    const [redeemEvents, setRedeemEvents] = useState([]);
    
    async function fetchRedeemProducts() {
        if(address){
            const provider = new ethers.BrowserProvider(window.ethereum);
            const contract = new ethers.Contract(loyaltyProgramAddress, LoyaltyProgram.abi, provider);
    
            const filter = contract.filters.RedeemProduct(address, null, null, null, null); 
            const logs = await contract.queryFilter(filter);
        
            const events = logs.map(log => ({
                transactionHash: log.transactionHash,
                event: contract.interface.parseLog(log)
            }));

            return events;
        }
    }

    useEffect(() => {
        async function fetchData() {
            const fetchedEventsSent = await fetchRedeemProducts();
            
            setRedeemEvents(fetchedEventsSent);
           
        }

        if(address && isConnected){
            getUserInfo();
           
        }
       
        if(address && isConnected && loyaltyProgramAddress){
            fetchData()
        }
    }, [address, isConnected, loyaltyProgramAddress]);

    useEffect(() => {
        setRedeemEvents([]);
       
    }, [isDisconnected])
    
    return(
        <>
        <h2 className="transactions-subtitle">Redeem product</h2>
            <div className="transaction-section">
                <table className="transaction-table">
                    <thead>
                        <tr>
                            <th>Tx Hash</th>
                            <th>From</th>
                            <th>To Product Owner 80%</th>
                            <th>To User Commerce 20%</th>
                            <th>Total Amount</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {redeemEvents.map((eventData, index) => (
                            <tr key={index}>
                                <td><a href={`https://sepolia.etherscan.io/tx/${eventData.transactionHash}`} target="_blank">{`${eventData.transactionHash.slice(0,7)}...${eventData.transactionHash.slice(-7)}`}</a></td>
                                <td>{`${eventData.event.args.from.slice(0,7)}...${eventData.event.args.from.slice(-7)}`}</td>
                                <td>{`${eventData.event.args._toProductOwner.slice(0,7)}...${eventData.event.args._toProductOwner.slice(-7)}`}</td>
                                <td>{`${eventData.event.args._toUserOwner.slice(0,7)}...${eventData.event.args._toUserOwner.slice(-7)}`}</td>
                                <td>{ethers.formatEther(eventData.event.args.amount.toString())} OMW</td>
                                <td>{formatDate(eventData.event.args.timestamp.toString())} </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}