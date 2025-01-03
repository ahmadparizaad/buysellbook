"use client";
import Link from "next/link";
import React, {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button"
import { Spotlight } from "@/components/ui/Spotlight";
import ReCAPTCHA from "react-google-recaptcha";

// import { initializeCometChat } from "@/utils/cometchatConfig";

export default function LoginPage() {
    const router = useRouter();
    const [user, setUser] = React.useState({
        email: "",
        password: "",
        captchaToken: ""
       
    })
    const [buttonDisabled, setButtonDisabled] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [passwordVisible, setPasswordVisible] = useState(false); // State for password visibility

    const onLogin = async (e: React.FormEvent) => {
        try {
            e.preventDefault();
            setEmailError("");
            setPasswordError("");
            if (!user.captchaToken) {
                toast.error("Please complete the captcha");
                return;
            }

            setLoading(true);
            const response = await axios.post("/api/users/login", {
                email: user.email,
                password: user.password,
                captchaToken: user.captchaToken // Make sure this is being sent
            });
            
            toast.success("Login successful");
            router.push("/");
        } catch (error: any) {
            console.error("Login error:", error.response?.data || error); // More detailed error logging
            toast.error(error.message);
            if (error.response) {
                // Check for specific error messages from the server
                if (error.response.status === 400) {
                    const errorMessage = error.response.data.error;
                    if (errorMessage.includes("User does not exist")) {
                        setEmailError("Invalid Email: Please Enter Correct Email");
                    } else if (errorMessage.includes("Invalid password")) {
                        setPasswordError("Invalid password: Please Enter Correct Password");
                    } else {
                        toast.error(errorMessage); // General error message
                    }
                } else {
                    toast.error("An unexpected error occurred. Please try again.");
                }
            }
        } finally {
            setLoading(false);
        }
    }
    const handleCaptchaChange = (token: string | null) => {
        setUser({...user, captchaToken: token || ''});
    }

    useEffect(() => {
        if(user.email.length > 0 && user.password.length > 0 && user.captchaToken) {
            setButtonDisabled(false);
        } else {
            setButtonDisabled(true);
        }
    }, [user]);

    return (
    <div className="flex flex-col items-center justify-center h-screen w-screen">
        <Spotlight
          className="left-40  md:left-60 md:-top-20"
          fill="blue"
        />
        <h1 className="text-2xl md:mt-20 mb-2">{loading ? "Processing..." : "Login"}</h1>
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
            {emailError && <div className="text-red-500">{emailError}</div>}
        </div>

        <div className='relative flex flex-col items-start mb-5'>
        {/* <label className='pl-5' htmlFor="password">Password</label> */}
        <input 
        className="text-black mb-4 mt-2 w-[30vh] md:w-[25vw] px-4 py-2 rounded-[2vw] max-sm:rounded-[6vw]"
            id="password"
            type={passwordVisible ? "text" : "password"}
            value={user.password}
            onChange={(e) => setUser({...user, password: e.target.value})}
            placeholder="password"
            required
            />
            <button
                type="button"
                onClick={() => setPasswordVisible(!passwordVisible)} // Toggle visibility
                className="absolute right-3 top-7 transform -translate-y-2/4 text-gray-500"
            >
                {passwordVisible ? (
                        <span role="img" aria-label="Hide Password">🙈</span> // Hide Icon
        ) : (
          <span role="img" aria-label="Show Password">👁️</span> // Show Icon
                    )}
            </button>
            {passwordError && <div className="text-red-500">{passwordError}</div>}
        </div>
        
        <div className="mb-5">
            <ReCAPTCHA
                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                onChange={handleCaptchaChange}
            />
        </div>

            <Button
            variant="outline"
            className="border mb-5 px-4 dark:border-white/[0.3] rounded-[2vw] max-sm:rounded-[6vw] hover:bg-blue-500 ease-linear duration-200">
                Login
            </Button>
            <p className="text-sm mb-2">Don&apos;t have an account?</p>
            <Link className="text-sm text-blue-500" href="/signup">Sign Up here</Link>
            </form>
        </div>
    )

}