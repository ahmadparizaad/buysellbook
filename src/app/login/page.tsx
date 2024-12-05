"use client";
import Link from "next/link";
import React, {useEffect} from "react";
import {useRouter} from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import CometChat from "@cometchat/chat-sdk-javascript";
import { Button } from "@/components/ui/button"
import { Spotlight } from "@/components/ui/Spotlight";

// import { initializeCometChat } from "@/utils/cometchatConfig";

export default function LoginPage() {
    const router = useRouter();
    const [user, setUser] = React.useState({
        email: "",
        password: "",
       
    })
    const [buttonDisabled, setButtonDisabled] = React.useState(false);
    const [loading, setLoading] = React.useState(false);


    const onLogin = async (e: React.FormEvent) => {
        try {
            e.preventDefault(); 
            setLoading(true);
            const response = await axios.post("/api/users/login", user);
            console.log("Login success", response.data);
            toast.success("Login success");
            router.push("/");
            
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
        <Spotlight
          className="left-40  md:left-60 md:-top-20"
          fill="blue"
        />
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
            <p className="text-sm mb-2">Don&apos;t have an account?</p>
            <Link className="text-sm text-blue-500" href="/signup">Sign Up here</Link>
            </form>
        </div>
    )

}