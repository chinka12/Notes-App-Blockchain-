var noteAppApiRoutes = require('express').Router();

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

var dataManagerContractAddress = config.dataManagerContractAddress;


// now contract interface
var noteAppContractABI = [
    {
        "constant": false,
        "inputs": [
            {
                "name": "_noteId",
                "type": "string"
            },
            {
                "name": "_noteDescription",
                "type": "string"
            },
            {
                "name": "_noteDate",
                "type": "string"
            },
            {
                "name": "_noteTime",
                "type": "string"
            },
            {
                "name": "_active",
                "type": "string"
            }
        ],
        "name": "addNote",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_noteId",
                "type": "string"
            }
        ],
        "name": "getNote",
        "outputs": [
            {
                "name": "",
                "type": "string"
            },
            {
                "name": "",
                "type": "string"
            },
            {
                "name": "",
                "type": "string"
            },
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_noteId",
                "type": "string"
            },
            {
                "name": "_noteDescription",
                "type": "string"
            },
            {
                "name": "_noteDate",
                "type": "string"
            },
            {
                "name": "_noteTime",
                "type": "string"
            },
            {
                "name": "_active",
                "type": "string"
            }
        ],
        "name": "updateNote",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "name": "_actionPerformed",
                "type": "string"
            },
            {
                "indexed": false,
                "name": "_noteId",
                "type": "string"
            },
            {
                "indexed": false,
                "name": "_noteDescription",
                "type": "string"
            },
            {
                "indexed": false,
                "name": "_noteDate",
                "type": "string"
            },
            {
                "indexed": false,
                "name": "_noteTime",
                "type": "string"
            },
            {
                "indexed": false,
                "name": "_active",
                "type": "string"
            },
            {
                "indexed": false,
                "name": "_timeOfTx",
                "type": "uint256"
            }
        ],
        "name": "NoteEvent",
        "type": "event"
    }
];

//The APIs below will sendTransaction()/call() contract functions using party A,B,C account keys. We can either promatically or manually unlock the key asking for the passphrase to make sure of party's identity
//now contract initiation
var noteAppContract = web3.eth.contract(noteAppContractABI).at(dataManagerContractAddress);

noteAppApiRoutes.get('/', function(req, res) {

    res.send("NoteApp API server");

});

// this API is admin API only exposed to Node A
noteAppApiRoutes.post('/note/add', function(req, res) {

    var noteId = req.body._noteId;
    var noteDescription = req.body._noteDescription;
    var noteDate = req.body._noteDate;
    var noteTime = req.body._noteTime;
    var active = req.body._active;
   


    noteAppContract.addNote.sendTransaction(noteId, noteDescription, noteDate, noteTime, active, {
        from: web3.eth.defaultAccount,
        gas: 400000 //hardcoded for simplicity. This value can also be dynamic based on averaging out last 2 blocks gas used
    }, function(err, result) {
        console.log(result);
        if (!err) {

            //console.log(response);
            res.json(result);
        } else
            res.status(401).json("Error" + err);
    });
});


noteAppApiRoutes.post('/note/update', function(req, res) {

    var noteId = req.body._noteId;
    var noteDescription = req.body._noteDescription;
    var noteDate = req.body._noteDate;
    var noteTime = req.body._noteTime;
    var active = req.body._active;



    noteAppContract.updateNote.sendTransaction(noteId, noteDescription, noteDate, noteTime, active, {
        from: web3.eth.defaultAccount,
        gas: 400000 //hardcoded for simplicity. This value can also be dynamic based on averaging out last 2 blocks gas used
    }, function(err, result) {
        console.log(result);
        if (!err) {

            //console.log(response);
            res.json(result);
        } else
            res.status(401).json("Error" + err);
    });
});



noteAppApiRoutes.post('/note/get', function(req, res) {

    var noteId = req.body._noteId;

    noteAppContract.getNote.call(noteId, function(err, result) {
        console.log(result);
        if (!err) {

            //console.log(response);
            res.json({
                "noteDescription": result[0],
                "noteDate": result[1],
                "noteTime": result[2],
                "active": result[3]

            });
        } else
            res.status(401).json("Error" + err);
    });

});

noteAppApiRoutes.post('/note/getIterations', function(req, res) {

    var noteEvent = noteAppContract.NoteEvent({
        from: web3.eth.defaultAccount
    }, {
        fromBlock: 0,
        toBlock: 'latest'
    });

    noteEvent.get(function(err, result) {
        //console.log(result);
        if (!err) {
            var arrayLength = result.length;
            console.log(arrayLength)
            var processedArray = [];
            for (var i = 0; i < arrayLength; i++) {
                if (req.body._noteId == result[i].args._noteId) {
                    processedArray.push(

                        {

                            "actionPerformed": result[i].args._actionPerformed,
                            "noteId": result[i].args._noteId,
                            "noteDescription": result[i].args._noteDescription,
                            "noteDate": result[i].args._noteDate,
                            "noteTime": result[i].args._noteTime,
                            "active": result[i].args._active,

                            "timestamp": result[i].args._timeOfTx
                        }

                    )
                }

            }
            //console.log(response);
            res.json(processedArray);
        } else
            return res.json("Error" + err);
    });

})


noteAppApiRoutes.get('/note/getAllLogs', function(req, res) {

    var noteEvent = noteAppContract.NoteEvent({
        from: web3.eth.defaultAccount
    }, {
        fromBlock: 0,
        toBlock: 'latest'
    });

    noteEvent.get(function(err, result) {
        //console.log(result);
        if (!err) {
            var arrayLength = result.length;
            console.log(arrayLength)
            var processedArray = [];
            for (var i = 0; i < arrayLength; i++) {
                processedArray.push(

                    {

                        "address": result[i].address,
                        "blockNumber": result[i].blockNumber,
                        "transactionHash": result[i].transactionHash,
                        "blockHash": result[i].blockHash,
                        "event": result[i].event,
                        "actionPerformed": result[i].args._actionPerformed,
                        "noteId": result[i].args._noteId,
                        "noteDescription": result[i].args._noteDescription,
                        "noteDate": result[i].args._noteDate,
                        "noteTime": result[i].args._noteTime,
                        "active": result[i].args._active,                        
                        "timestamp": result[i].args._timeOfTx
                    }

                )


            }
            //console.log(response);
            res.json(processedArray);
        } else
            return res.json("Error" + err);
    });
})


noteAppApiRoutes.post('/identity/generate', function (req, res) {

    var options = {
        method: 'POST',
        url: 'http://localhost:8545',
        headers: {
            'Content-Type': 'application/json'
        },
        body: {
            id: '1',
            jsonrpc: '2.0',
            method: 'personal_newAccount',
            params: [req.body._passphrase]
        },
        json: true
    };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);

        res.json({
            "address": body.result
        });

    });
});


noteAppApiRoutes.post('/identity/authenticate', function (req, res) {

    var options = {
        method: 'POST',
        url: 'http://localhost:8545',
        headers: {
            'Content-Type': 'application/json'
        },
        body: {
            id: '1',
            jsonrpc: '2.0',
            method: 'personal_unlockAccount',
            params: [req.body._address, req.body._passphrase, 0]
        },
        json: true
    };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);

        res.json({
            "authenticationStatus": body.result
        });
    });
});

noteAppApiRoutes.post('/identity/lock', function (req, res) {


    var options = {
        method: 'POST',
        url: 'http://localhost:8545',
        headers: {
            'Content-Type': 'application/json'
        },
        body: {
            id: '1',
            jsonrpc: '2.0',
            method: 'personal_lockAccount',
            params: [req.body._address]
        },
        json: true
    };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);

        res.json({
            "lockStatus": body.result
        });
    });
});


module.exports = noteAppApiRoutes;