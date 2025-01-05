"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import {useRouter} from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Spotlight } from "@/components/ui/Spotlight";
import ReCAPTCHA from "react-google-recaptcha";
import { EyeIcon, EyeOffIcon } from '@heroicons/react/solid'; // Import icons from Heroicons


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
    const [usernameError, setUsernameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [passwordVisible, setPasswordVisible] = useState(false); // State for password visibility

    const validateUsername = (username: string) => {
        // Check if username starts with a number
        if (/^\d/.test(username)) {
            setUsernameError("Cannot start with a number");
            return false;
        }
        // Check for spaces
        if (/\s/.test(username)) {
            setUsernameError("Space is not allowed");
            return false;
        }

        // Check if username only contains small letters
        if (!/^[a-z]+$/.test(username)) {
            setUsernameError("Only contain small letters");
            return false;
        }
        // Clear error if valid
        setUsernameError("");
        return true;
    };

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

    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newUsername = e.target.value;
        setUser({ ...user, username: newUsername });
        validateUsername(newUsername);
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

    const onSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
   
        if (!captchaToken) {
            toast.error("Please complete the captcha");
            return;
        }

        if (!validateUsername(user.username)) {
            return; // Prevent submission if username is invalid
        }

        if (!validateEmail(user.email) || !validatePassword(user.password)) {
            return; // Prevent submission if email or password is invalid
        }

        if (!validatePassword(user.password)) {
            return; // Prevent submission if password is invalid
        }

        try {           
            const res = await axios.post("/api/users/signup", {
                email: user.email,
                password: user.password,
                username: user.username,
                captchaToken: captchaToken
            });
            toast.success("Signup successful");
            router.push("/after-signup");
        } catch (error:any) {
            console.log("Signup failed", error.message);
            if(error.status == 400){
                toast.error("User already exists");
            }

            if(error.status == 401){
                toast.error("Invalid captcha");
            }

            if(error.status == 500){
                toast.error("Failed to send verification email");
            }

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

        if(user.username.length == 0){
            setUsernameError("");
        }
        
        if(user.email.length == 0){
            setEmailError("");
        }

        if(user.password.length == 0){
            setPasswordError("");
        }
    }, [user, captchaToken]);


    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2 font-[Gilroy]">
            
        <h1 className="text-2xl mb-2 md:mt-24">{loading ? "Processing" : "Signup"}</h1>
        <hr />
        <form onSubmit={onSignup} className="z-[9] flex flex-col items-center justify-center py-2">
        
        <div className='flex flex-col items-start mb-5'>
        {/* <label className='pl-5' htmlFor="username">Username</label> */}
        <input 
        className="text-black border-2 border-gray-700 mb-0 mt-2 w-[30vh] md:w-[25vw] px-4 py-2 rounded-[2vw] max-sm:rounded-[6vw]"
            id="username"
            type="text"
            value={user.username}
            onChange={handleUsernameChange}
            placeholder="username"
            required
            />
            {usernameError && <div className="text-red-500 ml-5 p-1 text-sm">{usernameError}</div>}
        </div>

        <div className='flex flex-col items-start mb-5'>
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
            type={passwordVisible ? "text" : "password"} // Toggle input type
            value={user.password}
            onChange={handlePasswordChange}
            placeholder="password"
            required
            />
            <button
                type="button"
                onClick={() => setPasswordVisible(!passwordVisible)} // Toggle visibility
                className="absolute right-3 top-6 md:top-5 transform -translate-y-2/4 text-gray-500"
            >
                {passwordVisible ? (
                        <span role="img" aria-label="Hide Password">🙈</span> // Hide Icon
        ) : (
          <span role="img" aria-label="Show Password">👁️</span> // Show Icon
                    )}
            </button>
            {passwordError && <div className="text-red-500 ml-5 p-1 text-sm">{passwordError}</div>}
        </div>
        
            <div className="mb-5 mt-2">
                <ReCAPTCHA
                    sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                    onChange={handleCaptchaChange}
                />
            </div>

            <button
                type="submit"
                disabled={buttonDisabled}
                className="border-2 border-gray-700 mb-3 dark:border-white/[0.3] rounded-[2vw] max-sm:rounded-[6vw] hover:bg-blue-400 hover:border-none hover:text-white ease-linear duration-200 px-4 py-2">
                {loading ? "Processing..." : "Sign Up"}
            </button>
            <p className="text-sm mb-2">Already have an account?</p>
            <Link className="text-sm text-blue-500" href="/login">Login here</Link>
            </form>
        </div>
    )

}