const router = require('express').Router();
const User = require('../models/User');
const {registerValidation,loginValidation} = require('../validation');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const verify = require('./verifyToken');
// const redis = require("redis");
// const client = redis.createClient();

// client.on("error", function(error) {
//   console.error(error);
// });

// client.set("key", "value", redis.print);
// client.get("key", redis.print);

//Register
router.post('/registerAdmin', async(req, res)=> {
    // Here validating brfore adding 
    const {error} = registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //checking if user already present
    const emailExist = await User.findOne({email: req.body.email});
    if(emailExist) return res.status(400).send('Email already exists');

    //Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //Adding new user
    const user1 = await User.create({
        username: req.body.username,
        email:req.body.email,
        password: hashedPassword,
        post: req.body.post
    });
    try{
        res.send({user: user1 });

    }catch(err){
        res.status(400).send(err);
    }

});

//Login

router.post('/loginAdmin', async(req,res) =>{
    // Here validating brfore adding 
    const {error} = loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //checking if user present or not
    const user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send('Invailid eeemail or password');

    //password is correct or not
    const validPass = await bcrypt.compare(req.body.password,user.password);
    if(!validPass) return res.status(400).send('Invailid email or password');


    //Create and assign a token
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
    //req.session.Token = token;
    res.header('Authorization',token).send(token);
    //client.setex('token2',600,JSON.stringify(token));
   // res.send('Logged in!');

});

router.get('logout',async(req,res)=>{
    const data = client.get('token2',(err,data)=>{
        console.log(data);
    })

})

router.get('/chk',async(req,res)=>{
        // cannot access session here
        console.log(req.session);
})



module.exports = router;