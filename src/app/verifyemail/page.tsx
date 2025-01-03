"use client";

import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/solid';

export default function VerifyEmailPage() {
    const [token, setToken] = useState("");
    const [verified, setVerified] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        const urlToken = window.location.search.split("=")[1];
        setToken(urlToken || "");
    }, []);

    useEffect(() => {
        if (token.length > 0) {
            const verifyUserEmail = async () => {
                try {
                    await axios.post('/api/users/verifyemail', { token });
                    setVerified(true);
                } catch (error: any) {
                    setError(true);
                    console.log(error.response.data);
                }
            };
            verifyUserEmail();
        }
    }, [token]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-6">
            <div className="shadow-md rounded-lg p-6 max-w-md w-full">
                <h1 className="text-3xl font-bold text-center mb-4">Verify Your Email</h1>
                {/* <h2 className="p-2 bg-orange-500 text-white text-center rounded mb-4">
                    {token ? `Token: ${token}` : "No token provided"}
                </h2> */}

                {verified && (
                    <div className="flex items-center justify-center mb-4">
                        <CheckCircleIcon className="h-6 w-6 text-green-500 mr-2" />
                        <h2 className="text-xl text-green-600">Email Verified Successfully!</h2>
                    </div>
                )}
                {error && (
                    <div className="flex items-center justify-center mb-4">
                        <XCircleIcon className="h-6 w-6 text-red-500 mr-2" />
                        <h2 className="text-xl text-red-600">Error Verifying Email</h2>
                    </div>
                )}
            </div>
            <Link href="/login" className="mt-4 inline-block text-center text-blue-600 hover:underline">
                    Go to Login Page
            </Link>
        </div>
    );
}