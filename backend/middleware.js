const express=require("express");
const jwt=require("jsonwebtoken");
const {JWT_SECRET}=require("./config")
const app=express();
app.use(express.json());

function authMiddleware(req,res,next){

    //authHeader stores the authorization row in headers section
    
    //Question: how authorization row in headers section will receive the token?
    //Answer: When a JSON Web Token (JWT) is sent as a response from the 
    //server to the client after a successful sign-in, it is typically 
    //included in the response body. The client 
    //then stores this JWT locally (e.g., in a cookie or local storage) 
    //and includes it in the Authorization header of subsequent requests 
    //to authenticate itself.
    //Client side code to extract the token is mentioned below in commented part
    
    //Client side code which will collect the token and keep it is authorization row in headers
        // // Assume this is a client-side script in a browser
        // const signInButton = document.getElementById('signInButton');

        // signInButton.addEventListener('click', async () => {
        // // Perform sign-in and receive the token
        // const response = await fetch('http://localhost:3000/signin', {
        //     method: 'POST',
        //     headers: {
        //     'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({ /* your sign-in credentials */ }),
        // });

        // const data = await response.json();
        // const token = data.token; // Extract the token from the JSON response

        // // Now, you can use the obtained token in subsequent requests
        // const protectedResponse = await fetch('http://localhost:3000/protected-route', {
        //     method: 'GET',
        //     headers: {
        //     'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
        //     },
        // });

        // const protectedData = await protectedResponse.json();
        // console.log(protectedData);
        // });


    const authHeader=req.headers.authorization;

    //Checking if authHeader is not empty or contains Bearer "token"
    if(!authHeader || !authHeader.startsWith('Bearer '))
    {
        return res.status(400).json({
            msg:"Incorrect token"
        })
        
    }

    const token=authHeader.split(' ')[1];
    
    try{
        const decoded=jwt.verify(token,JWT_SECRET);
        
        //decoded is an object. userId is the key in object
        //decoded{
        //     userId:"something"
        // }
        //the jwt.sign() in user.js creates this object {userId:token} 
        //during user sign-in. That same object is decoded here and checked.
        if(decoded.userId)
        {
            //created a new key userId in req object and attached
            //the decoded userId to it.(cannot do this in typescript)
            req.userId=decoded.userId;
            next();
        }
        else
        {
            return res.status(403).json({
                msg:"cannot decode"
            })
        }

    }
    catch(err)
    {
        res.status(403).json({
            msg:err
        })
    }

}

module.exports={
    authMiddleware
}