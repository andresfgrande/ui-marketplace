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

        const productSku = params.productSku;
        const from = params.from;
        const toProductCommerceAddress = params.toProductCommerceAddress;
        const toUserCommerceAddress = params.toUserCommerceAddress;
        const amount = params.amount;
        const signature = params.signature;
        const loyaltyProgramAddress = params.loyaltyProgramAddress;
        const commercePrefix = params.commercePrefix;

        let envVarName = `RELAYER_PK_COMMERCE_${commercePrefix.toUpperCase()}`;
        let privateKeyCommerce = process.env[envVarName]; 

        let walletCommerce = new ethers.Wallet(privateKeyCommerce, provider);

        let contractLoyaltyProgram = new ethers.Contract(loyaltyProgramAddress, LoyaltyProgramAbi.abi, walletCommerce);

        let txResponse = await contractLoyaltyProgram.redeemProduct(productSku, from, toProductCommerceAddress,
                                                                    toUserCommerceAddress, amount, signature);
        let txReceipt = await txResponse.wait();

        return Response.json({ success: true, txHash: txReceipt.hash });
    } catch (error) {
        return Response.json({ success: false, message: error.message, error: 'Transaction failed'  });
    }
    
}

