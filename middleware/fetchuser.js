const jwt=require('jsonwebtoken')

function fetchuser(req,res,next){
    try{
        const token=req.header('token')

        if(!token){
            res.status(401).send({success:false,error:'Unauthorized user'})
        }
        else{
            const info=jwt.verify(token,process.env.JWT_SECRET)
            req._id=info._id
            next() 
        } 
    }
    catch(error){
        res.status(500).json({success:false,error:'Unauthorized user'})
    }
}

module.exports=fetchuser