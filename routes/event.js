const express=require('express')

const fetchuser=require('../middleware/fetchuser')

const bcrypt=require('bcryptjs')

const Event=require('../models/Event')

const User=require('../models/User')

const router=express.Router()

const jwt=require('jsonwebtoken')
const { findById } = require('../models/Event')

router.post('/create',fetchuser,async (req,res)=>{
    try{        
        let correct_data=true;
        let invited_user_ids=[];

        for(let username of req.body.invitedusers){
            const user = await User.findOne({ username: username });
            if(! user){
                correct_data=false;
                break;
            }
            invited_user_ids.push(user._id);
        }

        if(correct_data){
            const event=new Event({
                title:req.body.title,
                description:req.body.description,
                date:req.body.date,
                createdby: req._id,
                invitedusers: invited_user_ids
            })

            const createEvent= await event.save();

            const user=await User.findById({_id:req._id});

            user.createdevents.push(createEvent._id);

            const userUpdate = await User.findByIdAndUpdate(
                { _id: req._id },
                { $set: user },
                { new: true, runValidators: true }
            );

            for(let id of invited_user_ids){
                const users=await User.findById({_id:id});
                users.invitedevents.push(createEvent._id); 
                const usersUpdate=await User.findByIdAndUpdate(
                    { _id: id },
                    { $set: users },
                    { new: true, runValidators: true }
                );
            }

            res.send({success:true,data:createEvent})
        }
        else{
            res.send({success:false,error:"Could not create event"})
        }
    }
    catch(error){
        res.status(500).json({success:false,error:error})
    }
})

router.put('/update/:eventid',fetchuser,async (req,res)=>{
    try{  
        
        const event=await Event.findById(req.params.eventid);
        
        if(event.createdby==req._id){
            const changes={
                title:req.body.title,
                description:req.body.description,
                date:req.body.date
            }

            const usersEvent=await Event.findByIdAndUpdate(
                { _id: req.params.eventid },
                { $set: changes },
                { new: true, runValidators: true }
            );

            res.send({success:true,data:usersEvent})
        }
        else{
            res.send({success:false,error:"You don't have right to update event"})
        }
    }
    catch(error){
        res.json({success:false,error:error})
    }
})

router.put('/invite/:eventid/:username',fetchuser,async (req,res)=>{
    try{        
        const event=await Event.findById(req.params.eventid);
        if(event.createdby==req._id){
            const user = await User.findOne({username:req.params.username});
            if(user){
                event.invitedusers.push(user.id);
                user.invitedevents.push(req.params.eventid);

                const updateEvent=await Event.findByIdAndUpdate(
                    { _id: req.params.eventid },
                    { $set: event },
                    { new: true, runValidators: true }
                );

                const updateUser=await User.findByIdAndUpdate(
                    { _id: user._id },
                    { $set: user },
                    { new: true, runValidators: true }
                );

                res.send({success:true,data:[updateEvent,updateUser]});
            }
            else{
                res.send({success:false,error:"Invalid username"})
            }
        }
        else{
            res.send({success:false,error:"You don't have right invite users"})
        }
    }
    catch(error){
        res.json({success:false,error:error})
    }
})

module.exports=router