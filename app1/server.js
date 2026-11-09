const express = require('express')
const cors = require('cors');
const dotenv = require("dotenv");
dotenv.config();
const app =express();
const studentRouter = require('./routes/studentroute');
const bcrypt = require('bcryptjs');
const cookieParser = require("cookie-parser");
app.use(cookieParser());

app.use(cors({
  origin: 'http://localhost:5174',
  credentials: true
}));
const dbConnect=require('./config/db')
const authRouter = require('./routes/authRouter');
const port=3040;
app.use(express.json());
app.use('/auth', authRouter);
app.use('/students', studentRouter);

dbConnect();

app.get('/',(req,res)=>{
    res.send("Welcome to Server")
})

app.listen(port,()=>{
    console.log(`Server Started on port ${port}`)
})
