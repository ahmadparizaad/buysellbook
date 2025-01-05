"use client";
import Link from "next/link";
import React, {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
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

    const validateEmail = (email: string) => {
        // Regular expression for validating email format
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            setEmailError("Invalid Email");
            return false;
        }
        // Clear error if valid
        setEmailError("");
        return true;
    };

    const validatePassword = (password: string) => {
        // Regular expressions for password validation
        const minLength = /.{8,}/; // At least 8 characters
        const upperCase = /[A-Z]/; // At least one uppercase letter
        const lowerCase = /[a-z]/; // At least one lowercase letter
        const number = /[0-9]/; // At least one number
        const specialChar = /[!@#$%^&*]/; // At least one special character

        if (!minLength.test(password)) {
            setPasswordError("At least 8 characters long");
            return false;
        }
        if (!upperCase.test(password)) {
            setPasswordError("At least one uppercase letter");
            return false;
        }
        if (!lowerCase.test(password)) {
            setPasswordError("At least one lowercase letter");
            return false;
        }
        if (!number.test(password)) {
            setPasswordError("At least one number");
            return false;
        }
        if (!specialChar.test(password)) {
            setPasswordError("At least one special character");
            return false;
        }

        // Clear error if valid
        setPasswordError("");
        return true;
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newEmail = e.target.value;
        setUser({ ...user, email: newEmail });
        validateEmail(newEmail);
    }; 

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPassword = e.target.value;
        setUser({ ...user, password: newPassword });
        validatePassword(newPassword);
    };

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
    <div className="flex flex-col items-center justify-center h-screen w-screen font-[Gilroy]">
        
        <h1 className="text-2xl md:mt-20 mb-2">{loading ? "Processing..." : "Login"}</h1>
        <hr />
        <form onSubmit={onLogin} className="z-[9] flex flex-col items-center justify-center py-2">

        <div  className='flex flex-col items-start mb-5'>
        {/* <label className='pl-5' htmlFor="email">Email</label> */}
        <input 
        className="text-black border-2 border-gray-700 mb-0 mt-2 w-[30vh] md:w-[25vw] px-4 py-2 rounded-[2vw] max-sm:rounded-[6vw]"
            id="email"
            type="text"
            value={user.email}
            onChange={handleEmailChange}
            placeholder="email"
            required
            />
            {emailError && <div className="text-red-500 ml-5 p-1 text-sm">{emailError}</div>}
        </div>

        <div className='relative flex flex-col items-start mb-5'>
        {/* <label className='pl-5' htmlFor="password">Password</label> */}
        <input 
        className="text-black border-2 border-gray-700 mb-0 mt-2 w-[30vh] md:w-[25vw] px-4 py-2 rounded-[2vw] max-sm:rounded-[6vw]"
            id="password"
            type={passwordVisible ? "text" : "password"}
            value={user.password}
            onChange={handlePasswordChange}
            placeholder="password"
            required
            />
            <button
                type="button"
                onClick={() => setPasswordVisible(!passwordVisible)} // Toggle visibility
                className="absolute right-3 top-7 transform -translate-y-2/4 text-black"
            >
                {passwordVisible ? (
                        <span role="img" aria-label="Hide Password">🙈</span> // Hide Icon
        ) : (
          <span role="img" aria-label="Show Password">👁️</span> // Show Icon
                    )}
            </button>
            {passwordError && <div className="text-red-500 ml-5 p-1 text-sm">{passwordError}</div>}
        </div>
        
        <div className="mb-5">
            <ReCAPTCHA
                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                onChange={handleCaptchaChange}
            />
        </div>

            <Button
            variant="outline"
            className="border-2 border-gray-700 mb-5 px-4 dark:border-white/[0.3] rounded-[2vw] max-sm:rounded-[6vw] ease-linear duration-200 hover:bg-blue-400 hover:border-none hover:text-white">
                Login
            </Button>
            <p className="text-sm mb-2">Don&apos;t have an account?</p>
            <Link className="text-sm text-blue-500" href="/signup">Sign Up here</Link>
            </form>
        </div>
    )

}