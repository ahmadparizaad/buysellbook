"use client";

import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/solid';

export default function VerifyEmailPage() {
    const [token, setToken] = useState("");
    const [verified, setVerified] = useState(false);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const urlToken = window.location.search.split("=")[1];
        setToken(urlToken || "");
    }, []);

    useEffect(() => {
        if (token.length > 0) {
            const verifyUserEmail = async () => {
                try {
                    setLoading(true);
                    await axios.post('/api/users/verifyemail', { token });
                    setVerified(true);
                } catch (error: any) {
                    setError(true);
                    console.log(error.response.data);
                } finally {
                    setLoading(false);
                };
            verifyUserEmail();
        }}
    }, [token]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-6 font-[Gilroy]">
            <div className="p-6 max-w-md w-full">
                <h1 className="text-3xl font-bold text-center mb-4">Verify Your Email</h1>
                {/* <h2 className="p-2 bg-orange-500 text-white text-center rounded mb-4">
                    {token ? `Token: ${token}` : "No token provided"}
                </h2> */}

                {loading && (
                    <div className="flex items-center justify-center mb-4">
                        <svg className="animate-spin h-6 w-6 text-blue-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V2.5"></path>
                        </svg>
                        <h2 className="text-xl text-blue-600">Verifying Email...</h2>
                    </div>
                )}

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
            <Link href="/login" className="px-5 py-2 border-2 border-gray-700 rounded-3xl mt-4 inline-block text-center text-black hover:text-white hover:bg-blue-400 hover:border-none">
                    Go to Login Page
            </Link>
        </div>
    );
}