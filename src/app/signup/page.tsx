"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import {useRouter} from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Spotlight } from "@/components/ui/Spotlight";
import { COMETCHAT_CONSTANTS } from '@/app/chat/const';




export default function SignupPage() {
    const router = useRouter();
    const [user, setUser] = useState({
        email: "",
        password: "",
        username: "",
    })
    const [buttonDisabled, setButtonDisabled] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const onSignup = async (e: React.FormEvent) => {
        try {
            e.preventDefault();
            setLoading(true);
            const response = await axios.post("/api/users/signup", user);
            console.log("Signup success", response.data);
            toast.success("Signup successful");
            router.push("/login");
            if (response.data) {
                // Step 2: Create user on CometChat
                // await axios.post('/api/cometchat/createUser', {
                //   uid: user.username, // Ensure uid is unique
                //   name: user.username,
                //   // Optionally, include avatar URL
                // });
            }
            
        }catch (error:any) {
            console.log("Signup failed", error.message);
            
            toast.error(error.message);
        }finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if(user.email.length > 0 && user.password.length > 0 && user.username.length > 0) {
            setButtonDisabled(false);
        } else {
            setButtonDisabled(true);
        }
    }, [user]);


    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <Spotlight
          className="left-40  md:left-60 md:-top-20"
          fill="blue"
        />
        <h1 className="text-2xl mb-5">{loading ? "Processing" : "Signup"}</h1>
        <hr />
        <form onSubmit={onSignup} className="z-[9] flex flex-col items-center justify-center py-2">
        
        <div className='flex flex-col items-start mb-5'>
        {/* <label className='pl-5' htmlFor="username">Username</label> */}
        <input 
        className="text-black mb-4 mt-2 w-[30vh] md:w-[25vw] px-4 py-2 rounded-[2vw] max-sm:rounded-[6vw]"
            id="username"
            type="text"
            value={user.username}
            onChange={(e) => setUser({...user, username: e.target.value})}
            placeholder="username"
            required
            />
        </div>

        <div className='flex flex-col items-start mb-5'>
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
        
            <button
            type="submit"
            className="border mb-5 dark:border-white/[0.3] rounded-[2vw] max-sm:rounded-[6vw] hover:bg-blue-500 ease-linear duration-200 p-2">
               Signup
            </button>
            <p className="text-sm mb-2">Already have an account?</p>
            <Link className="text-sm text-blue-500" href="/login">Login here</Link>
            </form>
        </div>
    )

}