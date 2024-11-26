"use client";
import Link from "next/link";
import React, {useEffect} from "react";
import {useRouter} from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import CometChat from "@cometchat/chat-sdk-javascript";
import { Button } from "@/components/ui/button"

// import { initializeCometChat } from "@/utils/cometchatConfig";

export default function LoginPage() {
    const router = useRouter();
    const [user, setUser] = React.useState({
        email: "",
        password: "",
       
    })
    const [buttonDisabled, setButtonDisabled] = React.useState(false);
    const [loading, setLoading] = React.useState(false);


    const onLogin = async () => {
        try {
            setLoading(true);
            const response = await axios.post("/api/users/login", user);
            console.log("Login success", response.data);
            toast.success("Login success");
            // if (response.data.success) {
            //   const res = await axios.get('/api/users/me');
            //   const uid = res.data.data.username;
            //     // Step 2: Generate CometChat Auth Token
            //     const options = {
            //       method: 'POST',
            //       headers: {accept: 'application/json', 'content-type': 'application/json'}
            //     };
                
            //     fetch(`https://26674133e9811b37.api-in.cometchat.io/v3/users/${uid}/auth_tokens`, options)
            //       .then(res => res.json())
            //       .then(res => console.log(res))
            //       .catch(err => console.error(err));
            //       console.log(res);
            //       const authToken = res.data.authToken
            //       console.log(authToken);
                  
        
            //       // Step 3: Login to CometChat
            //     //   initializeCometChat();
            //       await CometChat.CometChat.getLoggedinUser().then(
            //         (value: CometChat.User | null) => {
            //           if (!value) {
            //             CometChat.CometChat.login(authToken).then(
            //               (user: CometChat.User) => {
            //                 console.log("Login Successful:", { user });
            //               },
            //               (error: CometChat.CometChatException) => {
            //                 console.log("Login failed with exception:", { error });
            //               }
            //             );
            //           }
            //         },
            //         (error: CometChat.CometChatException) => {
            //           console.log("Some Error Occured", { error });
            //         }
            //       );
            //       // Redirect or perform other actions after successful login
            //       // ...
                
            //     if(!res.data.data.isProfileComplete){
            //       router.push("/complete-profile");
            //     } else{
            //       router.push("/")
            //     }
                
            //   }
            
        } catch (error:any) {
            console.log("Login failed", error.message);
            toast.error(error.message);
        } finally{
        setLoading(false);
        }
    }

    useEffect(() => {
        if(user.email.length > 0 && user.password.length > 0) {
            setButtonDisabled(false);
        } else{
            setButtonDisabled(true);
        }
    }, [user]);

    return (
    <div className="flex flex-col items-center justify-center h-screen w-screen">
        <h1 className="text-2xl mb-5">{loading ? "Processing" : "Login"}</h1>
        <hr />
        <form onSubmit={onLogin} className="z-[9] flex flex-col items-center justify-center py-2">

        <div  className='flex flex-col items-start mb-5'>
        {/* <label className='pl-5' htmlFor="email">Email</label> */}
        <input 
        className="text-black mb-4 mt-2 w-[30vh] md:w-[25vw] px-4 py-2 rounded-[2vw] max-sm:rounded-[6vw]"
            id="email"
            type="text"
            value={user.email}
            onChange={(e) => setUser({...user, email: e.target.value})}
            placeholder="email"
            required
            />
        </div>

        <div className='flex flex-col items-start mb-5'>
        {/* <label className='pl-5' htmlFor="password">Password</label> */}
        <input 
        className="text-black mb-4 mt-2 w-[30vh] md:w-[25vw] px-4 py-2 rounded-[2vw] max-sm:rounded-[6vw]"
            id="password"
            type="password"
            value={user.password}
            onChange={(e) => setUser({...user, password: e.target.value})}
            placeholder="password"
            required
            />
        </div>
        
            <Button
            variant="outline"
            className="border mb-5 dark:border-white/[0.3] rounded-[2vw] max-sm:rounded-[6vw] hover:bg-blue-500 ease-linear duration-200">
                Login
            </Button>
            <p className="text-sm mb-2">Don't have an account?</p>
            <Link className="text-sm text-blue-500" href="/signup">Signup here</Link>
            </form>
        </div>
    )

}