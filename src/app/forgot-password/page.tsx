'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Button } from "@/components/ui/button";

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await axios.post('/api/users/forgot-password', { email });
            toast.success(response.data.message);
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2 font-[Gilroy]">
            <form onSubmit={handleSubmit} className="z-[9] flex flex-col items-center justify-center py-2">
                <h2 className="text-xl mb-4">Forgot Password</h2>
                <div className='flex flex-col items-start mb-5'>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter Your Email"
                    className="text-black border-2 border-gray-700 mb-0 mt-2 w-[30vh] md:w-[25vw] px-4 py-2 rounded-[2vw] max-sm:rounded-[6vw]"
                    required
                />
                </div>
                <Button type="submit" variant="outline" className="border-2 border-gray-700 mb-3 dark:border-white/[0.3] rounded-[2vw] max-sm:rounded-[6vw] hover:bg-blue-400 hover:border-none hover:text-white ease-linear duration-200 px-4 py-2">
                {loading ? "Processing..." : "Send Reset Link"}
                </Button>
            </form>
        </div>
    );
};

export default ForgotPassword; 