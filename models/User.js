const mongoose=require('mongoose')
const validator=require('validator')

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        validate(value){
            return validator.isEmail(value)
        }
    },
    password:{
        type:String,
        required:true
    },
    createdevents:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Event',
        required:true
    }],
    invitedevents:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Event',
        required:true
    }]
})

module.exports=mongoose.model('User',userSchema)