const sendToken=(user,statusCode,res)=>{
    //    create jwt token
    const token=user.getJwtToken();
    // optons for cookie
     
    const options=({
        expires: process.env.JWT_EXPIRE_TIME, 
        httpOnly: true,
        secure:true, 
        maxAge:  7 * 24 * 60 * 60 * 1000, 
        sameSite:'none'
    })
    // console.log(options);
    res.status(statusCode).cookie('token',token,options).json({
        success:true,
        user,
        token
    })
    }
   export default sendToken;