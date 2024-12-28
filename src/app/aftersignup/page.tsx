'use client';
import React from 'react'

function AfterSignUp() {
  const emailVerificationLink ='https://mail.google.com/mail/u/0/#inbox';

  const handleOpenGmail = () => {
    window.open(emailVerificationLink, '_blank');
  };

  return (
    <div className="text-xl font-semibold mb-4 mx-3 mt-20 md:mt-56 text-center">
      <h1>Verify Your Email</h1>
      <p className='text-base mt-2 font-normal'>We have sent a verification email to your email address. Please verify your email to complete the signup process.</p>
      <button
        className="border my-5 dark:border-white/[0.3] rounded-[2vw] max-sm:rounded-[6vw] hover:bg-red-500 ease-linear duration-200 px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={handleOpenGmail}>Open Gmail</button>
    </div>
  )
}

export default AfterSignUp;