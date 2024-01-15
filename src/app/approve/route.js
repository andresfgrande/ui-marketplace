import {utils, ethers, formatEther } from 'ethers';
import LoyaltyProgramFactory from '../../Abi/loyalty-program-factory.json';
import LoyaltyProgramAbi from '../../Abi/loyalty-program.json';

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL); //Fijo para todos

const privateKeyAdmin = process.env.RELAYER_PK_ADMIN;  //Fija PK del admin (Factory)
const walletAdmin = new ethers.Wallet(privateKeyAdmin, provider);

const contractLoyaltyProgramFactory = new ethers.Contract(process.env.LOYALTY_PROGRAM_FACTORY_ADDRESS, LoyaltyProgramFactory.abi, walletAdmin);

export async function POST(request, { params }) {

    try {
        const params = await request.json();

        const owner = params.owner;
        const spender = params.spender;
        const value = params.value;
        const signature = params.signature;
        const loyaltyProgramAddress = params.loyaltyProgramAddress;
        const commercePrefix = params.commercePrefix;

        const envVarName = `RELAYER_PK_COMMERCE_${commercePrefix.toUpperCase()}`;
        const privateKeyCommerce = process.env[envVarName]; 
        const walletCommerce = new ethers.Wallet(privateKeyCommerce, provider);

        const contractLoyaltyProgram = new ethers.Contract(loyaltyProgramAddress, LoyaltyProgramAbi.abi, walletCommerce);

        const txResponse = await contractLoyaltyProgram.gaslessApprove(owner, spender, value, signature);
        const txReceipt = await txResponse.wait();

        return Response.json({ success: true, txHash: txReceipt.hash });
    } catch (error) {
        return Response.json({ success: false, message: error.message, error: 'Transaction failed' });
    }
    
}

