/**
 * Hyperledger Fabric REST API
 * @rbole 
 */

'use strict';
module.exports = async function (req, config) {
  const { FileSystemWallet, Gateway } = require('fabric-network');
  const path = require('path');
  const ccpPath = path.resolve(__dirname, config.ccpPath);
  
  let p1 = req.body.p1;
  let p2 = req.body.p2;
  let value = req.body.value;

  // Create a new file system based wallet for managing identities.
  const walletPath = path.join(process.cwd(), config.walletPath);
  const wallet = new FileSystemWallet(walletPath);

  // Create a new gateway for connecting to our peer node.
  const gateway = new Gateway();
  await gateway.connect(ccpPath, { wallet, identity: config.userName, discovery: { enabled: true, asLocalhost: true } });

  // Get the network (channel) our contract is deployed to.
  const network = await gateway.getNetwork(config.channel);

  // Get the contract from the network.
  const contract = network.getContract(config.cc);

  try {
    // Submit the specified transaction.
    let response = await contract.submitTransaction('invoke', p1, p2, value);
   
    // Disconnect from the gateway.
    await gateway.disconnect();

    let result = 'Transaction has been successfully submitted: '+p1+' > '+p2+' '+value;
    return result;
  }
  catch(error){
    let result = {result:'Failed to submit transaction: '+error};
    return result;
  }
}