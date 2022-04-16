const express=require('express')

const fetchuser=require('../middleware/fetchuser')

const bcrypt=require('bcryptjs')

const User=require('../models/User')

const Event=require('../models/Event')

const router=express.Router()

const jwt=require('jsonwebtoken')

router.post('/register',async (req,res)=>{
    try{
        const salt=await bcrypt.genSalt(10)
        const secPassword=await bcrypt.hash(req.body.password,salt)
        const user=new User({
            name:req.body.name,
            username:req.body.username,
            email:req.body.email,
            password:secPassword
        })
        
        const createUser= await user.save()

        const token=await jwt.sign({_id:createUser._id},process.env.JWT_SECRET)
        res.send({success:true,token:token}) 
    }
    catch(error){
        res.status(400).json({success:false,error:'signup with correct credentials'})
    }
})

router.post('/login',async (req,res)=>{
    try{
        const user=req.body
        const userData=await User.findOne({username:user.username})
        
        if(!userData){
            res.status(400).json({success:false,error:'login with correct credentials'})
        }
        else{
    
            const match=await bcrypt.compare(user.password,userData.password)
    
            if(match){
                const token=await jwt.sign({_id:userData._id},process.env.JWT_SECRET)
                res.send({success:true,token:token})           
            }
            else{
                res.status(400).json({success:false,error:'login with correct credentials'})
            }
        }
    }
    catch(error){
        res.status(500).json({success:false,error:'internal sever error'})
    }
})

router.get('/createdevents',fetchuser,async (req,res)=>{
    try{
        const user = await User.findById({_id:req._id});

        const skip=parseInt(req.query.skip) || 0;

        const limit=parseInt(req.query.limit) || Infinity;

        const sortfilter=req.query.sortfilter || null;

        const datefilter=req.query.datefilter || null;

        const search=req.query.search || null;

        let createdevents=[];

        for(let id of user.createdevents){
            const event=await Event.findById({_id:id});
            createdevents.push(event);
        }

        createdevents=createdevents.slice(skip,skip+limit);

        if(sortfilter==1){
            createdevents.sort((a,b)=> (a.title > b.title ? 1 : -1))
        }

        if(datefilter==1){
            createdevents.sort((a,b)=> (a.date > b.date ? 1 : -1))
        }

        if(search){
            createdevents=createdevents.filter(function(event){
                return (event.title).includes(search) || (event.description).includes(search);
            });
        }

        res.send({success:true,data:createdevents});
    }
    catch(error){
        res.status(500).json({success:false,error:'internal sever error'})
    }
})

router.get('/invitedevents',fetchuser,async (req,res)=>{
    try{
        const skip=parseInt(req.query.skip) || 0;

        const limit=parseInt(req.query.limit) || Infinity;

        const sortfilter=req.query.sortfilter || null;

        const datefilter=req.query.datefilter || null;

        const search=req.query.search || null;

        const user = await User.findById({_id:req._id});

        let invitedevents=[];

        for(let id of user.invitedevents){
            const event=await Event.findById({_id:id});
            invitedevents.push(event);
        }

        invitedevents=invitedevents.slice(skip,skip+limit);

        if(sortfilter==1){
            invitedevents.sort((a,b)=> (a.title > b.title ? 1 : -1))
        }


        if(datefilter==1){
            invitedevents.sort((a,b)=> (a.date > b.date ? 1 : -1))
        }

        if(search){
            invitedevents=invitedevents.filter(function(event){
                return (event.title).includes(search) || (event.description).includes(search);
            });
        }

        res.send({success:true,data:invitedevents});
    }
    catch(error){
        res.status(500).json({success:false,error:error})
    }
})

module.exports=router