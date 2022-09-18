
// mongodb+srv://Aditya:Aditya@2001@cluster0.spp2b.mongodb.net/
const path = require('path');
const mongoose = require('mongoose')
const express = require('express')
const cors=require('cors')
const fast2sms =require("fast-two-sms")
const jwt = require('jsonwebtoken');
require('dotenv').config();
// const session = require('express-session')
// const passport=require('passport');
// const passportLocalMongoose=require("passport-local-mongoose")

const JWT_SECRET=process.env.JWT_SECRET;
const app = express()

app.use(express.static(path.resolve(__dirname, 'frontend/build')));
app.use(express.json())
app.use(express.urlencoded())
app.use(cors());

// app.use(session({
//     secret: 'keyboard cat',
//     resave: false,
//     saveUninitialized: true,
// }));

// app.use(passport.initialize());
// app.use(passport.session());
const mongodbPassword=process.env.MONGODB_PASSWORD
mongoose.connect('mongodb+srv://Aditya:'+mongodbPassword+'@cluster0.spp2b.mongodb.net/reminderAppDB',() => console.log("DB connected"));

const reminderSchema = new mongoose.Schema({
    ReminderMessage: String,
    RemindAt: String,
    phoneNumber:String,
    isReminded: Boolean
})

const userSchema=new mongoose.Schema({
    name:String,
    phoneNumber:String,
    password:String
})

// userSchema.plugin(passportLocalMongoose);

const Reminder = new mongoose.model("reminder", reminderSchema)
const User=new mongoose.model("User",userSchema)

// passport.use(User.createStrategy());

// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

// const User=ne
// const port = 9000

app.get('/', (req, res) => {
    console.log(req.body);
  res.send('Hello World!')
})

setInterval(() =>{
    
    Reminder.find({},(err,reminder) =>{

        // API_KEY="udovhMkKJ6HFQ34AejpaTtRgODUfxrcEVZXm278iLPl9SIWsyb1eDQCqkt2PAuzbBSLIO3Uo0hVvijcK"
        if(!err)
        {
            reminder.forEach(element => {
                if(element.isReminded==false)
                {
                    const now=new Date();
                    if((new Date(element.RemindAt) - now) < 0) 
                    {
                        Reminder.findByIdAndUpdate(element._id, {isReminded: true}, (err, remindObj)=>{
                            console.log(element.ReminderMessage)
                            API_KEY=process.env.API_KEY
                            var options = {authorization : API_KEY , message : element.ReminderMessage ,  numbers : [element.phoneNumber]}
                            const response=fast2sms.sendMessage(options)
                        })
                    }
                }
            });
        }
    })
    
}, 1000);
// app.post("/send",async (req,res) =>{
//     API_KEY=""
//     var options = {authorization : API_KEY , message : req.body.message ,  numbers : [req.body.number]}
//     const response=await fast2sms.sendMessage(options)
//     res.send(response) 
// })

app.post("/getAllReminder",async (req,res) => {
    // res.send("DSADsa")
    // console.log("Co");
    const {token}=req.body;
    try{
           const data=jwt.verify(token,JWT_SECRET);
            const id=data.user.id; 
           console.log("id ",id);
        //    console.log("phone NUMEber="+phoneNumber)
           const user=await User.findOne({_id:id});
           const nphoneNumber=user.phoneNumber;
           Reminder.find({phoneNumber:nphoneNumber},(err,result) => {
               // console.error(err);
               console.log(result)
               if(err)
               {
                   console.log(err);
                   res.send(err);
               }
               else
                   res.send(result);
           })
    }
    catch{
        res.status(401).send("Please send valid token");
    }
});

app.get("/homepage",(req,res) => {
    if(req.isAuthenticated())
    {
        res.send({message:"Welcome"})
    }
    else{
        res.redirect("/login")
    }
})
app.post("/register",(req,res) =>{
    const {name,phoneNumber,password}=req.body;
    // User.register({phoneNumber:phoneNumber},password,(err,user) => {
    //     if(err)
    //     {
    //         console.log(err);
    //         res.redirect("/register")
    //     }
    //     else{
    //         passport.authenticate('local')(req,res,function()
    //         {
    //             res.redirect("/homepage");
    //         })
            
    //     }
    // })
    // console.log(req.body)
    User.findOne({phoneNumber:phoneNumber},(err,user) =>{
        if(user)
        {
            res.send({message:"User alreday exists please login"})
        }
        else{
            const newUser=new User({
                name,
                phoneNumber,
                password         
            })
            newUser.save().then(()=>{res.send({message:"Regster Succefully"})})
        }
    })
})

app.post("/login",(req,res) =>{
    const {phoneNumber,password}=req.body;
    User.findOne({phoneNumber:phoneNumber},(err,user)=>{
        if(!user)
        {
            res.send({message:"No user found please register"})
        }
        else{
            if(user.password===password)
            {
                const data={
                    user:{
                        id:user._id
                    }
                };
                const token=jwt.sign(data,JWT_SECRET);
                res.send({message:"login sucess",user:user,token:token})
            }
            else{
                res.send({message:"Bad credentials"})
            }
        }
    })
})

app.post("/addReminder", (req,res) => {
    console.log("Doen from index");
    const {ReminderMessage,RemindAt,phoneNumber} = req.body;
    console.log(req.body)
    const newReminder = new Reminder({ReminderMessage:ReminderMessage,RemindAt:RemindAt,isReminded : false,phoneNumber:phoneNumber});
    newReminder.save().then(() => {
        console.log("Saved Sucess");
        Reminder.find({phoneNumber:phoneNumber},(err,result) => {
            if(err)
            {
                console.log(err);
                res.send(err);
            }
            else
                res.send(result);
        })
    })
})

app.post("/getUser",(req,res)=>{
    const {token}=req.body;
    console.log(token);
    console.log(req.body);
    console.log("bakend");
    try{
        const data=jwt.verify(token,JWT_SECRET);
        const id=data.user.id;
        User.findOne({_id:id},(err,user) =>{
            if(err)
                console.log(err);
            else
                res.send({user:user});
        }) 
    }
    catch{
        res.status(403).send("Bad!!!");
    }
})
app.post("/deletRemider",(req,res) => {
    const {id,phoneNumber}=req.body;
    Reminder.deleteOne({_id:id}, () => {
        Reminder.find({phoneNumber:phoneNumber},(err,result) => {
            if(err)
            {
                console.log(err);
                res.send(err);
            }
            else
                res.send(result);
        })
    })
})

// app.use(express.static(path.join(__dirname, "/<front end app folder name>/build")));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/frontend/build', 'index.html'));
});
let port = process.env.PORT;

if(port == null || port == ""){
    port = 9000;
}

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
