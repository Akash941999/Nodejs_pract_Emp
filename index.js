const express = require('express');
const app =express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const session = require('express-session');
const cors = require('cors');


dotenv.config();

// Import Routes
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');

//Conect to DB
const MONGOURI = 'mongodb://localhost:27017/emp';

mongoose.connect(MONGOURI, {useNewUrlParser:true}, () =>
console.log('connected to DB')
);

//Middleware
app.use(express.json());
app.use(cors());

//Route Middlewares
app.use('/api/user',authRoute);
app.use('/api/posts',postRoute);



app.use(session({
    secret: 'ssshhhhh',
    saveUninitialized: true,
    resave: true}));

app.get("/login", function(req, res){
       
        // req.session.key = value
        req.session.name = process.env.TOKEN_SECRET;
        //console.log(req.user);
        return res.send("Session Set")
    })
       
app.get("/session", function(req, res){
       
        var name = req.session.name
        //console.log(req.user);
        return res.send(name)
       
        /*  To destroy session you can use
            this function 
         req.session.destroy(function(error){
            console.log("Session Destroyed")
        })
        */
    })
app.get('/logout',async(req,res)=>{
    req.session.destroy(function(err) {
        // cannot access session here
        if(err)
        res.json(err);
        else
        res.json('destroy');
     })
})
app.listen(3001, () => console.log('Server Up and running'));