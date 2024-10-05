const express = require('express');
const bodyParser=require('body-parser');
const {randomBytes}=require('crypto')
const cors=require('cors')
const axios = require('axios');
const { getStarDataRouter } = require('./src/routes/getData');

const app = express()

app.use(bodyParser.json())
app.use(cors())
app.use(getStarDataRouter)

app.listen(4000, ()=>{
    console.log("Listening at 4000")
})

