/**
 * cli - set
 */
'use strict';

const { FileSystemWallet, Gateway } = require('fabric-network');
const path = require('path');
const { exit } = require('process');

let config = {
  channel: 'channel1',
  cc:'mycc',
  userName: 'user1',
  ccpPath: '../../fabric-samples/rb-first-network/connection-org1.json'
}

// get the key from the post request
let myArgs = process.argv.slice(2);
let p1, p2, value;

if(myArgs.length == 3){
  p1 = String(myArgs[0]);
  p2 = String(myArgs[1]);
  value = String(myArgs[2]);
} else {
  console.log('wrong number parameters');
  exit(1);
}

const ccpPath = path.resolve(__dirname, config.ccpPath);
async function main() {
  try {

    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), '../wallet');
    const wallet = new FileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    // Check to see if we've already enrolled the user.
    const userExists = await wallet.exists(config.userName);
    if (!userExists) {
        console.log('An identity for the user "'+config.userName+'" does not exist in the wallet');
        console.log('Run the registerUser.js application before retrying');
        return;
    }

    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();
    await gateway.connect(ccpPath, { wallet, identity: config.userName, discovery: { enabled: true, asLocalhost: true } });

    // Get the network (channel) our contract is deployed to.
    const network = await gateway.getNetwork(config.channel);

    // Get the contract from the network.
    const contract = network.getContract(config.cc);

    // Submit the specified transaction.
    await contract.submitTransaction('invoke', p1, p2, value);
    console.log('Transaction has been submitted');

    // Disconnect from the gateway.
    await gateway.disconnect();

  } catch (error) {
      console.error(`Failed to submit transaction: ${error}`);
      process.exit(1);
  }
}

main();
