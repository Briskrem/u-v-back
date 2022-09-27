const express = require('express')
const Crypto = require('../Models/cryptoModel')
const axios = require('axios')

const router = express.Router()

let newRequestTracker = 0
let ziba;

router.get('/ticker/:cryptoID', (req, res) => {
    newRequestTracker ++
    const name = req.params.cryptoID
    // i do not need to put it in the constructor upon initialization

    let data;
    if(!ziba){
        ziba = new Crypto()
        res.json({ziba: `${ziba}`})
        data = ziba.getTicker(name, newRequestTracker, res)
    }else{
        data = ziba.getTicker(name, newRequestTracker)
        res.json({error: 'error'})
    }
    return res.json({data: 'CRYPTO QUOTES'})
})


router.get('/stats/:cryptoID', async (req, res) => {
    const cryptoID = req.params.cryptoID
    const queries = req.query
    console.log(queries, cryptoID, 'inside stats route')
    try{
     
        const data = await Crypto.getGraph(cryptoID, queries)
        // res.send({data})
        return res.json({data})
    }catch(e){
        console.log(e)
    }
})

module.exports = router

