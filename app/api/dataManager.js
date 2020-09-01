var dataManagerApiRoutes = require('express').Router();

var Web3 = require('web3');
var config = require('../config/config')
var request = require('request');

var web3;
if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider);
} else {
    web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    console.log(web3.net.peerCount);
}

web3.eth.defaultAccount = web3.eth.coinbase;

dataManagerApiRoutes.post('/get/transactionDetails', function(req, res) {


    var options = { method: 'POST',
  url: 'http://localhost:8545',
  headers: 
   { 'cache-control': 'no-cache',
     'Content-Type': 'application/json' },
  body: 
   { jsonrpc: '2.0',
     method: 'eth_getTransactionReceipt',
     params: [ req.body._txhash ],
     id: 1 },
  json: true };

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  //console.log(body);
  res.json(body);
});
	//res.send(body);
});

dataManagerApiRoutes.get('/get/transactionDetails', function(req, res) {


    var options = { method: 'POST',
  url: 'http://localhost:8545',
  headers: 
   { 'cache-control': 'no-cache',
     'Content-Type': 'application/json' },
  body: 
   { jsonrpc: '2.0',
     method: 'eth_getTransactionReceipt',
     params: [ req.query._txhash ],
     id: 1 },
  json: true };

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  //console.log(body);
  res.json(body);
});
	//res.send(body);
});


dataManagerApiRoutes.get('/explorer', function(req, res) {

    var latestBlock = web3.eth.blockNumber;
    var processedArray = [];

    for (var i = 0; i <= 29; i++) {
        var block = web3.eth.getBlock(latestBlock - i);
        var number = block.number;
        var hash = block.hash;
        var time = block.timestamp;
        var gas = block.gasUsed;
        var time1 = new Date(time/1000000);

        processedArray.push(

        {

                "number": number,
                "blockDifficulty" : block.difficulty,
                "gasLimit" : block.gasLimit,
                "gasUsed" : block.gasUsed,
                "blockHash" : block.hash,
                "parentHash" : block.parentHash,
                "receiptsRoot" : block.receiptsRoot,
                "sha3Uncles" : block.sha3Uncles,
                "size" : block.size,
                "stateRoot" : block.stateRoot,
                "timestamp" : block.timestamp,
                "totalDifficulty" : block.totalDifficulty,
                "transactionsRoot" : block.transactionsRoot,
                "transactions" : block.transactions,
                "time" : time1
            }
        )
    }
   
    res.json(processedArray);

});

dataManagerApiRoutes.get('/explorer/pagination', function(req, res) {

    var latestBlock = web3.eth.blockNumber;
    var processedArray = [];

    if (req.query._to == "all") {
        for (var i = req.query._from; i <= latestBlock; i++) {
            var block = web3.eth.getBlock(latestBlock - i);
            var number = block.number;
            var hash = block.hash;
            var time = block.timestamp;
            var gas = block.gasUsed;
            var time1 = new Date(time / 1000000);

            processedArray.push(

                {

                    "number": number,
                    "blockDifficulty": block.difficulty,
                    "gasLimit": block.gasLimit,
                    "gasUsed": block.gasUsed,
                    "blockHash": block.hash,
                    "parentHash": block.parentHash,
                    "receiptsRoot": block.receiptsRoot,
                    "sha3Uncles": block.sha3Uncles,
                    "size": block.size,
                    "stateRoot": block.stateRoot,
                    "timestamp": block.timestamp,
                    "totalDifficulty": block.totalDifficulty,
                    "transactionsRoot": block.transactionsRoot,
                    "transactions": block.transactions,
                    "time": time1
                }
            )
        }

        res.json(processedArray);

    } else {
        for (var i = req.query._from; i <= req.query._to; i++) {
            var block = web3.eth.getBlock(latestBlock - i);
            var number = block.number;
            var hash = block.hash;
            var time = block.timestamp;
            var gas = block.gasUsed;
            var time1 = new Date(time / 1000000);

            processedArray.push(

                {

                    "number": number,
                    "blockDifficulty": block.difficulty,
                    "gasLimit": block.gasLimit,
                    "gasUsed": block.gasUsed,
                    "blockHash": block.hash,
                    "parentHash": block.parentHash,
                    "receiptsRoot": block.receiptsRoot,
                    "sha3Uncles": block.sha3Uncles,
                    "size": block.size,
                    "stateRoot": block.stateRoot,
                    "timestamp": block.timestamp,
                    "totalDifficulty": block.totalDifficulty,
                    "transactionsRoot": block.transactionsRoot,
                    "transactions": block.transactions,
                    "time": time1
                }
            )
        }

        res.json(processedArray);
    }



});

dataManagerApiRoutes.get('/explorer', function(req, res) {

    var latestBlock = web3.eth.blockNumber;
    var processedArray = [];

    for (var i = 0; i <= 29; i++) {
        var block = web3.eth.getBlock(latestBlock - i);
        var number = block.number;
        var hash = block.hash;
        var time = block.timestamp;
        var gas = block.gasUsed;
        var time1 = new Date(time / 1000000);

        processedArray.push(

            {

                "number": number,
                "blockDifficulty": block.difficulty,
                "gasLimit": block.gasLimit,
                "gasUsed": block.gasUsed,
                "blockHash": block.hash,
                "parentHash": block.parentHash,
                "receiptsRoot": block.receiptsRoot,
                "sha3Uncles": block.sha3Uncles,
                "size": block.size,
                "stateRoot": block.stateRoot,
                "timestamp": block.timestamp,
                "totalDifficulty": block.totalDifficulty,
                "transactionsRoot": block.transactionsRoot,
                "transactions": block.transactions,
                "time": time1
            }
        )
    }

    res.json(processedArray);

});

dataManagerApiRoutes.get('/get/latestBlockNumber', function(req, res) {

    var latestBlock = web3.eth.blockNumber;
   
    res.json(latestBlock);

});

dataManagerApiRoutes.post('/get/consolidatedTransactionDetails', function(req, res) {

    try{
        var count = req.body._count;
    var latestBlock = web3.eth.blockNumber;
    var processedArray = [];

    for (i = 0; i < parseInt(count); i++) {
        var block = web3.eth.getBlock(latestBlock - i);
        var arrayLength = (block.transactions).length;

        for (j = 0; j < parseInt(arrayLength); j++) {
            
            processedArray.push(web3.eth.getTransactionReceipt(block.transactions[j])); 
            
        }
   
    }
    res.json({
        status:200,
        data: processedArray
    });
    }catch(e){
        console.log('e=',e);
        res.send({
            status:400,
            message:e.message
        });
        
    }

});

module.exports = dataManagerApiRoutes;
