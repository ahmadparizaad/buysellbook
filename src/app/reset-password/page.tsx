'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Button } from "@/components/ui/button"; // Adjust based on your button component

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [token, setToken] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    // Extract token from URL
    React.useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const tokenFromUrl = urlParams.get('token');
        if (tokenFromUrl) {
            setToken(tokenFromUrl);
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post('/api/users/reset-password', { token, password });
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
                <h2 className="text-2xl font-semibold text-center mb-6">Reset Password</h2>
                
                <div className='relative flex flex-col items-start mb-5'>
                <input
                    type={passwordVisible ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="New Password"
                    className="text-black border-2 border-gray-700 mb-0 mt-2 w-[30vh] md:w-[25vw] px-4 py-2 rounded-[2vw] max-sm:rounded-[6vw]"
                    required
                />
                <button
                type="button"
                onClick={() => setPasswordVisible(!passwordVisible)} // Toggle visibility
                className="absolute right-3 top-6 md:top-7 transform -translate-y-2/4 text-gray-500"
            >
                {passwordVisible ? (
                        <span role="img" aria-label="Hide Password">🙈</span> // Hide Icon
        ) : (
          <span role="img" aria-label="Show Password">👁️</span> // Show Icon
                    )}
            </button>
            </div>

            <div className='flex flex-col items-start mb-5'>
                <input
                    type={passwordVisible ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm Password"
                    className="text-black border-2 border-gray-700 mb-0 mt-2 w-[30vh] md:w-[25vw] px-4 py-2 rounded-[2vw] max-sm:rounded-[6vw]"
                    required
                />
                </div>
                
                <Button type="submit" variant="outline" className="border-2 border-gray-700 mb-3 dark:border-white/[0.3] rounded-[2vw] max-sm:rounded-[6vw] hover:bg-blue-400 hover:border-none hover:text-white ease-linear duration-200 px-4 py-2">
                    {loading ? 'Processing...' : 'Reset Password'}
                </Button>
            </form>
        </div>
    );
};

export default ResetPassword; 