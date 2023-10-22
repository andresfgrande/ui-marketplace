'use client';
import React from "react";
import Layout from '../components/Layout';
import TransactionsContent from "../components/transactions/TransactionsContent";

export default function Transactions (){
    return(
        <Layout>
             <TransactionsContent></TransactionsContent>
        </Layout>
    )
}