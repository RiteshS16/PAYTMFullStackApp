import { Appbar } from "../Components/AppBar";
import { Balance } from "../Components/Balances";
import { Users } from "../Components/Users";

export const Dashboard=function(){
    return (
        <div>
            <Appbar/>
            <div className="m-8">
                <Balance value={"10,000"}/>
                <Users/>
            </div>
        </div>
    )
}