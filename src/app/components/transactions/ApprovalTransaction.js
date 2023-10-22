import React, { useEffect , useState} from "react";
import LoyaltyProgram from "../../../Abi/loyalty-program.json";
import { ethers } from 'ethers';

export default function ApprovalTransaction({address, isConnected, isDisconnected, loyalID, loyaltyProgramAddress, getUserInfo}){

    const [approvalEvents, setApprovalEvents] = useState([]);


    function formatDate(timestamp) {
        const date = new Date(timestamp * 1000);
        return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
    }

    async function fetchApprovalEvents() {
        if(address){
            const provider = new ethers.BrowserProvider(window.ethereum);
            const contract = new ethers.Contract(loyaltyProgramAddress, LoyaltyProgram.abi, provider);
    
            const filter = contract.filters.GaslessApproval(address, loyaltyProgramAddress, null, null); 
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
            const fetchedApprovalEvents = await fetchApprovalEvents();
            setApprovalEvents(fetchedApprovalEvents);
        }

        if(address && isConnected){
            getUserInfo();
        }
       
        if(address && isConnected && loyaltyProgramAddress){
            fetchData()
        }
    }, [address, isConnected, loyaltyProgramAddress]);

    useEffect(() => {
        setApprovalEvents([]);
    }, [isDisconnected])

    return(
        <>
        <h2 className="transactions-subtitle">Token approval</h2>
        <div className="transaction-section">
              <table className="transaction-table">
                     <thead>
                         <tr>
                             <th>Tx Hash</th>
                             <th>Owner</th>
                             <th>Spender</th>
                             <th>Value</th>
                             <th>Date</th>
                         </tr>
                     </thead>
                     <tbody>
                        {approvalEvents.map((eventData, index) => (
                            <tr key={index}>
                                <td><a href={`https://sepolia.etherscan.io/tx/${eventData.transactionHash}`} target="_blank">{`${eventData.transactionHash.slice(0,7)}...${eventData.transactionHash.slice(-7)}`}</a></td>
                                <td>{`${eventData.event.args.owner.slice(0,7)}...${eventData.event.args.owner.slice(-7)}`}</td>
                                <td>{`${eventData.event.args.spender.slice(0,7)}...${eventData.event.args.spender.slice(-7)}`}</td>
                                <td>{ethers.formatEther(eventData.event.args.value.toString())} OMW</td>
                                <td>{formatDate(eventData.event.args.timestamp.toString())} </td>
                            </tr>
                        ))}
                     </tbody>
                 </table>
        </div>
        </>
    )
}