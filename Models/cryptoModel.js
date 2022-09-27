const express = require('express')
const WebSocket = require('ws')
const axios = require('axios')
const Alpaca = require("@alpacahq/alpaca-trade-api");
require('dotenv').config()

// console.log(process.env)

const router = express.Router()
const BASE_URL = 'https://data.alpaca.markets/v1beta2/crypto'
const crypto_url = 'wss://stream.data.alpaca.markets/v1beta2/crypto';
const apiKey = process.env.API_KEY
const secretKey = process.env.SECRET_KEY
const auth = {"action": "auth", "key": `${apiKey}`, "secret": `${secretKey}`};

console.log(apiKey, secretKey)

let wss = null;

class Crypto{


    static async getGraph(name, time){
        console.log(name,time,'tell me why')

        const method = 'GET'
        const url = 'https://data.alpaca.markets/v1beta2/crypto/bars'
        const params = {
            symbols : `${name}/USD`,
            timeframe: `${time.timeframe}`,
            start: '2022-07-01',
            limit: 200
        }
        
        const headers = {
        'APCA-API-KEY-ID': `${apiKey}`,
        'APCA-API-SECRET-KEY': `${secretKey}`
        }
    
        try{
            console.log('right above api request')
            // const resp = await axios.get('https://data.alpaca.markets/v1beta2/BTC/USD/bars')
            const resp = await axios({url, method, params, headers})
            // console.log(resp.data.bars, 'ππππππππππππππππππ')
            return resp.data;
        }catch(e){
            console.log('failed')
        }
     
    }




    getTicker(name, tracker){
        let newRequestTracker = tracker
        if(newRequestTracker > 1) {
            console.log(newRequestTracker, wss.readyState, 'WSS READY STATE AT THE TOP B4 ITS INITIALISED')
            wss.close()
            // READYSTATE AT 2, IT NEEDSS TO BE AT O FOR NEW CONNECTION
            console.log(wss.readyState, 'WSS READY STATE AT THE BOTTOM B4 ITS INITIALISED, because its from the previous instance % TRACKER GREATER THAN 1 SO I JUST CLOSED THE WSS LOOP')
        }
        function getTicker(name, zz){ 
            const cryptoName = name
            // const cryptoName = req.params.cryptoID
            // const subscription = {"action":"subscribe",  "quotes":[`${cryptoName}/USD`], "bars":['*']};
            const subscription = {"action":"subscribe","quotes":[`${cryptoName}/USD`] ,"bars":["BTC/USD"]}
            console.log(cryptoName, subscription, '++++++++++++++++++++++++++++++++++++++++++++')
    
    
            const server = require('../server')
            const io = require('socket.io')(server,{ cors:{ origin:'*'}})
            io.on('connection', socket =>  console.log('io connected', cryptoName, '================================'))
            io.on('disconnect', reason =>{
                window.wss.close()
                socket.removeAllListeners()
                console.log('io disconnected [CONSEQUESNTIAL]')
            })


            // connectAlpaca needs to be inside get ticker because aqlpca neeeds that IO object
            function connectAlpaca(cryptoName, subscription){      
                console.log('CRYPTONAME()((()()()()()()', cryptoName, subscription)           
                setTimeout(()=>{  
                    console.log('ASYNC BEGINS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
                    myAsync()
                    console.log('ASYNC ENDS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
                }, 500)
                function myAsync(){ 
                    wss = new WebSocket(crypto_url)
                    console.log(wss.readyState, 'READY STATE ADDED & INSIDE MYASYNC')
                    wss.addEventListener('open', ws => {
                        console.log(wss.readyState, 'READYSTATE 2.... && wss coonnected')
                        wss.send(JSON.stringify(auth))
                        wss.send(JSON.stringify(subscription))         
                    }) 
                    console.log('chesse')
                    wss.addEventListener('message', ({data})=>{
                        let dataString = Buffer.from(data).toString('utf-8')
                        io.emit('meta',  `${dataString}`)  
                        // console.log(dataString)                                
                    })  
                    // In the cycle this function responds before MYASYNC runs, because its the previous listener thats responding. 
                    wss.addEventListener('close', (data)=>{
                        console.log(wss.readyState, 'READYSTATE 3...')
                        // wss.close()
                        //this listener responds before io.connect and MYASYNC, because it is the listener from the previous request,
                        //therefore it logs the crypto of the previous ws request while the current request is parsing.
                        console.log('WSS disconnected, NOW WSS READY TO RE-connect', cryptoName, subscription)
                        // connectAlpaca(cryptoName, subscription)
                    }) 
                }  
            }
            connectAlpaca(cryptoName, subscription)    
            console.log('this async function should return at this point but it returns later on')
        }
        getTicker(name) 
        return {message: 'success'}
    }
}

module.exports = Crypto
