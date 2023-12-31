import React, { useEffect , useState} from "react";
import LoyaltyProgram from "../../../Abi/loyalty-program.json";
import { ethers } from 'ethers';
import { formatDate } from "../../../utils/dateUtils.js";

export default function RewardsTransaction({address, isConnected, isDisconnected, loyalID, loyaltyProgramAddress, getUserInfo}){

    const [rewardEvents, setRewardEvents] = useState([]);

    async function fetchRewardEvents() {
        if(address){
            const provider = new ethers.BrowserProvider(window.ethereum);
            const contract = new ethers.Contract(loyaltyProgramAddress, LoyaltyProgram.abi, provider);
    
            const filter = contract.filters.RewardsSent(null, address, null, null); 
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
            const fetchedRewardEvents = await fetchRewardEvents();
            setRewardEvents(fetchedRewardEvents);
        }

        if(address && isConnected){
            getUserInfo();
        }
       
        if(address && isConnected && loyaltyProgramAddress){
            fetchData()
        }
    }, [address, isConnected, loyaltyProgramAddress]);

    useEffect(() => {
        setRewardEvents([]);
    }, [isDisconnected])

    return(
        <>
        <h2 className="transactions-subtitle">Rewards</h2>
        <div className="transaction-section">
              <table className="transaction-table transaction-table-4">
                     <thead>
                         <tr>
                             <th>Tx Hash</th>
                             <th>To</th>
                             <th>Value</th>
                             <th>Date</th>
                         </tr>
                     </thead>
                     <tbody>
                        {rewardEvents.map((eventData, index) => (
                            <tr key={index}>
                                <td><a href={`https://sepolia.etherscan.io/tx/${eventData.transactionHash}`} target="_blank">{`${eventData.transactionHash.slice(0,7)}...${eventData.transactionHash.slice(-7)}`}</a></td>
                                <td>{`${eventData.event.args.to.slice(0,7)}...${eventData.event.args.to.slice(-7)}`}</td>
                                <td>{ethers.formatEther(eventData.event.args.amount.toString())} OMW</td>
                                <td>{formatDate(eventData.event.args.timestamp.toString())}</td>
                            </tr>
                        ))}
                     </tbody>
                 </table>
        </div>
        </>
    )
}