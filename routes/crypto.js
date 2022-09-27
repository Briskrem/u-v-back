const express = require('express')
const Crypto = require('../Models/cryptoModel')
const axios = require('axios')
const WebSocket = require('ws')

const BASE_URL = 'https://data.alpaca.markets/v1beta2/crypto'
const crypto_url = 'wss://stream.data.alpaca.markets/v1beta2/crypto';
const apiKey = process.env.API_KEY
const secretKey = process.env.SECRET_KEY
const auth = {"action": "auth", "key": `${apiKey}`, "secret": `${secretKey}`};

const router = express.Router()

let newRequestTracker = 0
let ziba;



router.get('/ticker/:cryptoID', (req, res) => {
    const name = req.params.cryptoID
    function getTick(name, res){ 
        const cryptoName = name
        // res.send({name})
        // res.send({name})
        const subscription = {"action":"subscribe","quotes":[`${cryptoName}/USD`] ,"bars":["BTC/USD"]}    
        const server = require('../server')
        const io = require('socket.io')(server,{ cors:{ origin:'*'}})
        io.on('connection', socket =>  {
            console.log('io connected', cryptoName, '================================')
            res.send({state: 'io connected'})
        })
        io.on('disconnect', reason =>{
            window.wss.close()
            socket.removeAllListeners()
        })
        function connectAlpaca(cryptoName, subscription){      
            setTimeout(()=>{  
                myAsync()
            }, 500)
            function myAsync(){ 
                wss = new WebSocket(crypto_url)
                wss.addEventListener('open', ws => {
                    console.log(wss.readyState, 'READYSTATE 2.... && wss coonnected')
                    wss.send(JSON.stringify(auth))
                    wss.send(JSON.stringify(subscription))         
                }) 
                wss.addEventListener('message', ({data})=>{
                    let dataString = Buffer.from(data).toString('utf-8')
                    io.emit('meta',  `${dataString}`)  
                    // console.log(dataString)                                
                })  
                wss.addEventListener('close', (data)=>{
                    console.log('WSS disconnected, NOW WSS READY TO RE-connect', cryptoName, subscription)
                }) 
            }  
        }
        connectAlpaca(cryptoName, subscription)    
    }
    getTick(name, res) 
    // return {message: 'success'}
    
})


router.get('/stats/:cryptoID', async (req, res) => {
    const cryptoID = req.params.cryptoID
    const queries = req.query
    console.log(queries, cryptoID, 'inside stats route')
    try{
     
        const data = await Crypto.getGraph(cryptoID, queries, res)
        // res.send({data})
        return res.json({data})
    }catch(e){
        console.log(e)
    }
})

module.exports = router

// router.get('/ticker/:cryptoID', (req, res) => {
//     newRequestTracker ++
//     const name = req.params.cryptoID
//     // i do not need to put it in the constructor upon initialization

//     let data;
//     if(!ziba){
//         ziba = new Crypto()
//         res.json({ziba: `${ziba}`})
//         data = ziba.getTicker(name, newRequestTracker)
//         console.log(data, '************************************')
//         // res.send({data})
//         // res.json({ziba: `${ziba}`})
//         // return res.json({data})
//     }else{
//         data = ziba.getTicker(name, newRequestTracker)
//         res.json({error: 'error'})
//     }
//     // this created headrr can be sent error
//     return res.json({data: 'CRYPTO QUOTES'})
// })

