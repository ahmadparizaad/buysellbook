"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import {useRouter} from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Spotlight } from "@/components/ui/Spotlight";
import ReCAPTCHA from "react-google-recaptcha";



export default function SignupPage() {
    const router = useRouter();
    const [user, setUser] = useState({
        email: "",
        password: "",
        username: "",
    })
    const [buttonDisabled, setButtonDisabled] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [captchaToken, setCaptchaToken] = useState<string | null>(null);

    const onSignup = async (e: React.FormEvent) => {
        try {
            e.preventDefault();
            
            if (!captchaToken) {
                toast.error("Please complete the captcha");
                return;
            }

            setLoading(true);
            const response = await axios.post("/api/users/signup", {
                ...user,
                captchaToken
            });
            console.log("Signup success", response.data);
            toast.success("Signup successful");
            router.push("/login");
            
        } catch (error:any) {
            console.log("Signup failed", error.message);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }

    const handleCaptchaChange = (token: string | null) => {
        setCaptchaToken(token);
    }

    useEffect(() => {
        if(user.email.length > 0 && 
           user.password.length > 0 && 
           user.username.length > 0 && 
           captchaToken) {
            setButtonDisabled(false);
        } else {
            setButtonDisabled(true);
        }
    }, [user, captchaToken]);


    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <Spotlight
          className="left-40  md:left-60 md:-top-20"
          fill="blue"
        />
        <h1 className="text-2xl mb-2 md:mt-24">{loading ? "Processing" : "Signup"}</h1>
        <hr />
        <form onSubmit={onSignup} className="z-[9] flex flex-col items-center justify-center py-2">
        
        <div className='flex flex-col items-start mb-3'>
        {/* <label className='pl-5' htmlFor="username">Username</label> */}
        <input 
        className="text-black mb-3 mt-2 w-[30vh] md:w-[25vw] px-4 py-2 rounded-[2vw] max-sm:rounded-[6vw]"
            id="username"
            type="text"
            value={user.username}
            onChange={(e) => setUser({...user, username: e.target.value})}
            placeholder="username"
            required
            />
        </div>

        <div className='flex flex-col items-start mb-3'>
        {/* <label className='pl-5' htmlFor="email">Email</label> */}
        <input 
        className="text-black mb-3 mt-2 w-[30vh] md:w-[25vw] px-4 py-2 rounded-[2vw] max-sm:rounded-[6vw]"
            id="email"
            type="text"
            value={user.email}
            onChange={(e) => setUser({...user, email: e.target.value})}
            placeholder="email"
            required
            />
        </div>

        <div className='flex flex-col items-start mb-3'>
        {/* <label className='pl-5' htmlFor="password">Password</label> */}
        <input 
        className="text-black mb-3 mt-2 w-[30vh] md:w-[25vw] px-4 py-2 rounded-[2vw] max-sm:rounded-[6vw]"
            id="password"
            type="password"
            value={user.password}
            onChange={(e) => setUser({...user, password: e.target.value})}
            placeholder="password"
            required
            />
        </div>
        
            <div className="mb-5">
                <ReCAPTCHA
                    sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                    onChange={handleCaptchaChange}
                />
            </div>

            <button
                type="submit"
                disabled={buttonDisabled}
                className="border mb-3 dark:border-white/[0.3] rounded-[2vw] max-sm:rounded-[6vw] hover:bg-blue-500 ease-linear duration-200 px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? "Processing..." : "Sign Up"}
            </button>
            <p className="text-sm mb-2">Already have an account?</p>
            <Link className="text-sm text-blue-500" href="/login">Login here</Link>
            </form>
        </div>
    )

}