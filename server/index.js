require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const {SERVER_PORT} = process.env

const {getEntries,getNavEntries,saveSearch,getSearches} = require('./controller.js')

app.use(express.json())
app.use(cors())
app.get('/eng/:search',getEntries)
app.get('/nav/:search',getNavEntries)
app.post('/save',saveSearch)
app.get('/save',getSearches)
app.get('/css', (req,res)=>{
    res.sendFile(path.join(__dirname,'styles.css'))
})
app.get('/js', (req,res)=>{
    res.sendFile(path.join(__dirname,'index.js'))
})

//Entries
app.listen(SERVER_PORT, () => console.log(`up on ${SERVER_PORT}`))