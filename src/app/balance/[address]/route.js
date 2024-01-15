
import {utils, ethers, formatEther } from 'ethers';
import LoyaltyProgramFactory from '../../../Abi/loyalty-program-factory.json';
import LoyaltyProgram from '../../../Abi/loyalty-program.json';

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL); //Fijo para todos

const privateKeyAdmin = process.env.RELAYER_PK_ADMIN;  //Fija PK del admin (Factory)
const walletAdmin = new ethers.Wallet(privateKeyAdmin, provider);

const contractLoyaltyProgramFactory = new ethers.Contract(process.env.LOYALTY_PROGRAM_FACTORY_ADDRESS, LoyaltyProgramFactory.abi, walletAdmin);

export async function GET(request, { params }) {
    const address = params.address 

    try {
        const balanceWei = await provider.getBalance(address);
        const balanceEth = formatEther(balanceWei);
        return Response.json({ address: address, balance: balanceEth} );
    } catch (error) {
        return Response.json({ error: error} );
    }
    
  }

