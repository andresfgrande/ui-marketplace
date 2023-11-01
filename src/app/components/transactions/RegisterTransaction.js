import React, { useEffect , useState} from "react";
import LoyaltyProgram from "../../../Abi/loyalty-program.json";
import { ethers } from 'ethers';
import { formatDate } from "../../../utils/dateUtils.js";

export default function RegisterTransaction({address, isConnected, isDisconnected, loyalID, loyaltyProgramAddress, getUserInfo}){

    const [registerEvents, setRegisterEvents] = useState([]);

    async function fetchRegisterEvents() {
        if(address){
            const provider = new ethers.BrowserProvider(window.ethereum);
            const contract = new ethers.Contract(loyaltyProgramAddress, LoyaltyProgram.abi, provider);
    
            const filter = contract.filters.Registered(address, null,null); 
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
            const fetchedRegisterEvents = await fetchRegisterEvents();
            setRegisterEvents(fetchedRegisterEvents);
        }

        if(address && isConnected){
            getUserInfo();
        }
       
        if(address && isConnected && loyaltyProgramAddress){
            fetchData()
        }
    }, [address, isConnected, loyaltyProgramAddress]);

    useEffect(() => {
        setRegisterEvents([]);
    }, [isDisconnected])

    return(
       <>
       <h2 className="transactions-subtitle">Register</h2>
       <div className="transaction-section">
             <table className="transaction-table transaction-table-4">
                    <thead>
                        <tr>
                            <th>Tx Hash</th>
                            <th>Address</th>
                            <th>LoyaltyID</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {registerEvents.map((eventData, index) => (
                            <tr key={index}>
                                <td><a href={`https://sepolia.etherscan.io/tx/${eventData.transactionHash}`} target="_blank">{`${eventData.transactionHash.slice(0,7)}...${eventData.transactionHash.slice(-7)}`}</a></td>
                                <td>{`${eventData.event.args.user.slice(0,7)}...${eventData.event.args.user.slice(-7)}`}</td>
                                <td>{eventData.event.args.loyal_ID}</td>
                                <td>{formatDate(eventData.event.args.timestamp.toString())}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
       </div>
       </>
    )
}