const mongoose=require('mongoose')
const validator=require('validator')

const eventSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        required:true
    },
    createdby:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    invitedusers:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    }]
})

module.exports=mongoose.model('Event',eventSchema)