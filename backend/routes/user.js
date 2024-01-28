const express=require("express");
const zod=require("zod");
const jwtwebtoken=require("jsonwebtoken");
const { User, Account } =require("../db");
const { JWT_SECRET }  =require("../config");
const { authMiddleware }=require("../middleware");

const router=express.Router();

//import { authMiddleware } from "../middleware";
//The above line of code was giving the error: SyntaxError: Cannot use import statement outside a module
//The erorr pops up when you attempt to use ES6 module syntax (import) in a context where the 
//runtime expects CommonJS modules (require)
/**Diff between require() and import
 * Key Differences and Considerations
 * 
Syntax: require uses module.exports and require(), while ESM uses import and export.

Loading Mechanism: require is synchronous and loads modules at runtime, whereas import is asynchronous and supports top-level await 
(in newer Node versions).

File Extensions: With ESM, you often need to specify the full file name including its extension, whereas CommonJS is more flexible.

Configurations: For ESM, you might need to set "type": "module" in your package.json or use the .mjs file extension. There's no
such requirement for CommonJS.
 */



const userSignupZodSchema=zod.object({
    username:zod.string().email(),
    password:zod.string(),
    firstName:zod.string(),
    lastName:zod.string()
});

router.post("/signup",async function(req,res){
    const userSchemaCheck=userSignupZodSchema.safeParse(req.body)
    if(!userSchemaCheck)
    {
        return res.status(400).json({
            msg:"Type an email and password of min length 6 characters"
        })  
    }
    
    const existingUser= await User.findOne({username:req.body.username});
    
    if(existingUser)
    {
        return res.status(411).json({
            msg:"user already exists"
        })
    }
    
    //Creating user 
    const user=await User.create({
        username:req.body.username,
        password:req.body.password,
        firstName: req.body.firstName,
        lastName:req.body.lastName,
    });
    
    
    //userId-random id generateed by mongoDB database
    const userId=user._id;
    
    const token=jwtwebtoken.sign({userId},JWT_SECRET);
    res.status(200).json({
        userId:"User created successfully",
        token:token
    })

    //Initializ balances in account for the given user
    const account=await Account.create({
        balance:1+Math.random()*100000,
        userId:userId
    })

    
});


const userSigninZodSchema=zod.object({
    username:zod.string().email(),
    password:zod.string()
})

//Why POST is used for sign-in and not get?
/**
The choice of using a POST request for a sign-in operation (authentication)
rather than a GET request is a common practice in web development for s
ecurity reasons and best practices. Here are some reasons why:

Security:

In a GET request, parameters are often included in the URL, which can be 
visible in browser history, server logs, and may be cached by web servers.
User credentials (e.g., username and password) should not be included in 
the URL for security reasons, as URLs are more exposed and prone to being 
logged.

Request Payload:

POST requests allow you to send data in the request body, which is more 
suitable for sending sensitive information like user credentials.
In a POST request, the sensitive data is not exposed in the URL, making 
it a more secure way to transmit authentication information.

Caching:

GET requests are more likely to be cached by browsers, proxies, and other 
intermediaries. Caching sensitive information in URLs can pose security 
risks.

Idempotence:

GET requests are generally considered idempotent, meaning they should not 
have side effects on the server. Authentication involves altering the 
server state, and it's not considered idempotent.

Conventions and Best Practices:

Using POST for sign-in operations aligns with RESTful conventions, where 
POST is commonly used for creating or updating resources, including 
authentication.

It's important to note that the use of POST for sign-in doesn't imply that 
GET requests are inherently insecure. However, for operations that involve 
submitting sensitive information, such as authentication, using POST is a
widely adopted practice.

In summary, the choice of HTTP method depends on the nature of the 
operation. For sign-in/authentication, where sensitive information is 
involved, using POST is a recommended best practice for security reasons.
*/

router.post("/signin",async function(req,res){
    const userSchemaCheck=userSigninZodSchema.safeParse(req.body);
    if(userSchemaCheck)
    {
        //Search database for user who is trying to login
        const loginUser= await User.findOne({
            username:req.body.username,
            password:req.body.password
        });
        
        if(!loginUser)
        {
            res.status(411).json({
                msg:"user does not exists"
            })
        }
        else
        {
            //create jwt token for the user who successfully logs in
            const token=jwtwebtoken.sign({userId:loginUser._id},JWT_SECRET);
            res.status(200).json({
                token:token
            })
            return;
        }
    }
    else
    {
        return res.status(400).json({
            msg:"Wrong username or password.Error while logging"
        })   
    }
});

const updateUserZodSchema=zod.object({
    password:zod.string().optional(),
    firstName:zod.string().optional(),
    lastName:zod.string().optional()
});
router.put("/",authMiddleware,async (req,res)=>{
    
    const { checkUpdateSchema } = updateUserZodSchema.safeParse(req.body);
    
    if(checkUpdateSchema)
    {
        await User.updateOne(req.body,{
            id:req.userId,
        });
        res.status(200).json({
            msg:"Details updated successfully"
        })
    }
    else
    {
        return res.status(400).json({
            msg:"Cannot update user.Incorrect details"
        })   
    }
});

router.get("/bulk",async function(req,res){
    const filter=req.query.filter || "";
    const findUsers= await User.find({
        $or:[{
            'firstName':{
                "$regex":filter
            },
        },{
            "lastName":{
                "$regex":filter
            }
        }]
    });

    res.json({
        user: findUsers.map(function(user){
            return ({
                username:user.username,
                firstName:user.firstName,
                lastName:user.lastName,
                _id:user
            });
        })
    })
});

module.exports=router;