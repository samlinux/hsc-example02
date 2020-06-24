/**
 * Hyperledger Fabric REST API - access mycc example
 * @rbole 
 */

// we include some system requironments  
const express = require('express');
const bodyParser = require('body-parser');

// express base instance
const app = express();

// we need the bodyParser because of the post request 
app.use(bodyParser.json());      
app.use(bodyParser.urlencoded({ 
  extended: true
}));  

// we set a config helper object
let config = {
  channel: 'channel1',
  cc:'mycc',
  userName: 'user1',
  ccpPath: '../fabric-samples/rb-first-network/connection-org1.json',
  walletPath: './wallet'
}

// we include our API endpoint code 
let getKeyData = require('./index-query');
let setData = require('./index-set');

// check api is running
app.get('/', function (req, res) {
  res.json({msg:'hello fabric api'});
})

// query by key
app.get('/getData/:key', async function (req, res) {
  let result = await getKeyData(req, config)
  res.json(result);
})

// trasfer a value from a to b or from b to a
app.post('/setData', async function (req, res) {
  let result = await setData(req, config)
  res.json(result);
})

// start the REST API Server
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
})