const express = require('express')
const cors = require("cors");
const cryptoRouter = require('./routes/crypto')

const app = express()

app.use(express.json())
app.use(cors());

app.use('/home', (req, res) => {
    console.log('chimney')
    res.json({"food": "macaroni"})
})



app.use('/crypto', cryptoRouter)
console.log('og master 300')


module.exports = app

// const PORT = process.env.PORT || 9001;

// app.listen(PORT, ()=>{
    // console.log(`listening on port ${PORT}`)
// })

