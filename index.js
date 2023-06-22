const connectToMongo =require("./db")
const express = require('express')
const app = express()

connectToMongo();

app.use(express.json())
app.use('/api/auth',require('./routes/auth'))
app.use('/api/notes',require('./routes/notes'))

app.listen(8000,()=>{
    console.log("Listening to port 8000")
})