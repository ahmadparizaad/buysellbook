"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from "react";


export default function VerifyEmailPage() {

    const [token, setToken] = useState("");
    const [verified, setVerified] = useState(false);
    const [error, setError] = useState(false);
    const router = useRouter();
    const verifyUserEmail = async () => {
        try {
            await axios.post('/api/users/verifyemail', {token})
            setVerified(true);
        } catch (error:any) {
            setError(true);
            console.log(error.reponse.data);
            
        }

    }

    useEffect(() => {
        const urlToken = window.location.search.split("=")[1];
        setToken(urlToken || "");
    }, []);


    useEffect(() => {
        if(token.length > 0) {
            verifyUserEmail();
        }
    }, [token]);

    return(
        <div className="flex flex-col items-center justify-center min-h-screen py-2 font-[Gilroy]">

            <h1 className="text-4xl">Verify Email</h1>
            {/* <h2 className="p-2 bg-orange-500 text-black">{token ? `${token}` : "no token"}</h2> */}

            {!verified && !error && (
                <h2 className="text-white text-lg m-3 bg-blue-400 px-5 py-1 rounded-3xl">Verifying...</h2>
            )}

            {verified && (
                <div>
                    <h2 className="text-white text-lg m-3 bg-green-400 px-5 py-1 rounded-3xl">Email Verified</h2>
                    <Button onClick={() => router.push('/login')} variant="outline"
                    className="border-2 px-5 border-gray-700 dark:border-white/[0.3] rounded-[2vw] max-sm:rounded-[6vw] hover:bg-blue-400 hover:text-white hover:border-none ease-linear duration-200">
                        Login
                    </Button>
                </div>
            )}
            {error && (
                <div>
                    <h2 className="text-white text-lg m-3 bg-red-400 px-5 py-1 rounded-3xl">Error in verifying Email</h2>
                    
                </div>
            )}
        </div>
    )

}