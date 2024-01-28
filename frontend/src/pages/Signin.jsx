import { useState } from "react"
import BottomWarning from "../Components/BottomWarning"
import {Button} from "../Components/Button"
import {Heading} from "../Components/Heading"
import {InputBox} from "../Components/InputBox"
import {SubHeading} from "../Components/SubHeading"
import axios from "axios";

export const Signin = () => {
  const [username,setUsername]=useState('');
  const [password,setPassword]=useState('');
    return <div className="bg-slate-300 h-screen flex justify-center">
    <div className="flex flex-col justify-center">
      <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
        <Heading label={"Sign in"} />
        <SubHeading label={"Enter your credentials to access your account"} />
        <InputBox onChange={e=>{setUsername(e.target.value);}} placeholder="ritesh@gmail.com" label={"Email"} />
        <InputBox onChange={e=>{setPassword(e.target.value);}} placeholder="123456" label={"Password"} />
        <div className="pt-4">
          <Button onClick={async ()=>{
            const response= await axios.post("http://localhost:3000/api/v1/user/signin",{
                            username:username,
                            password:password,
                          })
            //we have got token in response from backend. Below mentioned code shows how to store token.
            //localStorage.setItem(<key>,<value>);
            localStorage.setItem("token",response.data.token);
          }} label={"Sign in"} />
        </div>
        <BottomWarning label={"Don't have an account?"} buttonText={"Sign up"} to={"/signup"} />
      </div>
    </div>
  </div>
}