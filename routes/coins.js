
const Joi = require('joi');
const express = require('express');
const router = express.Router();

const MongoClient = require('mongodb').MongoClient;

router.get('/', (req,res) => {
        MongoClient.connect('mongodb://localhost', function (err, client) {
        if (err) throw err;
        var db = client.db('mytestingdb');

        db.collection('customers').find({}).toArray( function (findErr, result) {
            if (findErr) throw findErr;
            res.send(result);
        });

    });
});


router.post('/', (req,res) => {
    const schema = Joi.object().keys({
        coin: Joi.string().min(3).required(),
    });

    const result = Joi.validate(req.body, schema);
    if (result.error){
        res.status(400).send(result.error.details[0].message);
        return;
    }

    let coinData = {
        "name": req.body.coin,
        "Created At": new Date()
    }

    MongoClient.connect('mongodb://localhost',function (err,client) {
        if (err) throw err;
        var db = client.db('mytestingdb');

        db.collection('customers').insertOne(coinData, (result) => res.status(200).send("Data inserted Successfully"));
    })
});


router.put('/', (req, res) => {
    const schema = Joi.object().keys({
        oldCoin : Joi.string().min(3).required(),
        newCoin : Joi.string().min(3).required()
    });
    const result = Joi.validate(req.body,schema);
    let oldCoin = req.body.oldCoin;
    let newCoin = req.body.newCoin;

    MongoClient.connect('mongodb://localhost',function (err,client) {
        if(err) throw err
        var db = client.db('mytestingdb');

        var promise = new Promise(function (resolve, reject) {
            resolve(db.collection('customers').findOne({name:oldCoin}));
        })

        promise.then(function (result) {
            if (result == null) {
                res.status(400).send("Data Not Found");
            }
            else{
                db.collection('customers').updateOne({name:oldCoin}, {$set:{name:newCoin}}, () => res.status(200).send("Data Upadated Successfully"));
            }
        })
    })
});


router.delete('/:name', (req,res) => {
    MongoClient.connect('mongodb://localhost',function (err,client) {
    if (err) throw err;
    var db = client.db('mytestingdb');
        db.collection('customers').deleteOne({name:req.params.name},(result) => res.status(200).send("Data Deleted Successfully"));
    })
});


module.exports = router;