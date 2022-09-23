// const { Client, PrivateKey, AccountCreateTransaction, AccountBalanceQuery, Hbar} = require("@hashgraph/sdk");

import { Client, PrivateKey, AccountCreateTransaction, AccountBalanceQuery, Hbar} from "@hashgraph/sdk";

// import dotenv from 'dotenv';

// let PRIVATE_KEY = "302e020100300506032b657004220420e4de8d58923dff3a00dffb6f0f033cb6a77615fac499d3d7926e4abc9c278549";
// let ACCOUNT_ID = "0.0.317857";


export function checkAccountExists(account, key) {

    if (account == null ||
        key == null ) {
        throw new Error("Environment variables myAccountId and myPrivateKey must be present");
    } else {
        console.log("Nice account bro");
        return true;
    }

}

export function connectClient(account, key) {

    if (checkAccountExists(account, key)) {
        // Create our connection to the Hedera network
        // The Hedera JS SDK makes this really easy!
        const client = Client.forTestnet();

        client.setOperator(account, key);
        
        console.log("Hedera Client Connected");
        return true
    } else {
        return false
    }

}

export async function getAccountBalance(account, key) {

    if (checkAccountExists(account, key)) {

        if (connectClient(account, key)) {

            const client = Client.forTestnet();

            client.setOperator(account, key);

            const accountBalance = await new AccountBalanceQuery()
            .setAccountId(account)
            .execute(client);
    
            console.log("Balance: " + accountBalance)

            let currentBalance = accountBalance.hbars.toTinybars();
    
            return currentBalance;
        }

    } else {
        return false
    }

}

