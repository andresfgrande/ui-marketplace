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

        const address = params.address;
        const loyaltyId = params.loyaltyId;
        const signature = params.signature;
        const commercePrefix = params.commercePrefix;

        const txResponse = await contractLoyaltyProgramFactory.addUserInfo(address, loyaltyId, commercePrefix, signature);
        const txReceipt = await txResponse.wait();

        const envVarName = `RELAYER_PK_COMMERCE_${commercePrefix.toUpperCase()}`;
        const privateKeyCommerce = process.env[envVarName]; 
        const walletCommerce = new ethers.Wallet(privateKeyCommerce, provider);

        const loyaltyProgramAddress = await contractLoyaltyProgramFactory.loyaltyProgramByPrefix(commercePrefix);
        const contractLoyaltyProgram = new ethers.Contract(loyaltyProgramAddress, LoyaltyProgramAbi.abi, walletCommerce);

        const txResponseLP = await contractLoyaltyProgram.register(loyaltyId, address);
        const txReceiptLP = await txResponseLP.wait();
      
        return Response.json({ success: true, txHashAddUser: txReceipt.hash, txHashRegister: txReceiptLP.hash });
    } catch (error) {
        return Response.json({ success: false, message: error.message, error: 'Transaction failed' });
    }
    
}

