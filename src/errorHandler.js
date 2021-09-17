 const errorHandler =  (err,_req,res,_next) => {
    if(err){
        res.status(err.status).send(err)
    }
    else{
        res.status(500).send({message:"Something bad happened"})
    }
}

export default errorHandler