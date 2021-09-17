 const errorHandler =  (err,_req,res,_next) => {
    if(err){
        res.status(err.status).send({message:err.message})
    }
    else{
        res.status(500).send({message:"Something bad happened"})
    }
}

export default errorHandler