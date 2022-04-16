require("dotenv").config();

require('./db')

const routes_user=require('./routes/user.js')
const routes_event=require('./routes/event.js')

const cors=require('cors')

const express=require('express')

const app=express()

app.use(cors())

app.use(express.json())

app.use('/user',routes_user)
app.use('/event',routes_event)

app.listen(process.env.PORT || 80,()=>{
    console.log(`connected to port ${process.env.PORT || 80}`)
})