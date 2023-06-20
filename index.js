const connectToMongo =require("./db")
const express = require('express')
const app = express()

connectToMongo();

app.use(express.json())
app.use('/api/auth',require('./routes/auth'))
// app.use('/api/notes',require('./routes/notes'))

app.listen(3000,()=>{
    console.log("Listening to port 3000")
})