const app = require('./index')
const {PORT} = require('./config')
require('colors')

const server = app.listen(PORT, ()=>{
    console.log(`connected on port ${PORT}`.yellow)
})

module.exports = server