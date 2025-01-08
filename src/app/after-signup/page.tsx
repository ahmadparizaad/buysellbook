'use client';
import React from 'react'

function AfterSignUp() {
  const emailVerificationLink ='https://mail.google.com/mail/u/0/#inbox';

  const handleOpenGmail = () => {
    const userAgent = navigator.userAgent;

    if (/android/i.test(userAgent)) {
      window.location.href = "intent://mail/#Intent;package=com.google.android.gm;end";
    } else if (/iPad|iPhone|iPod/.test(userAgent)) {
      window.location.href = "_blank";
    } else {
      window.open(emailVerificationLink, '_blank');
    }
  };

  return (
    <div className="text-xl font-[Gilroy] min-h-[100vh] font-semibold mx-3 mt-56 text-center">
      <h1>Verify Your Email</h1>
      <p className='text-base mt-2 font-normal'>We have sent a verification email to your email address. Please verify your email to complete the signup process.</p>
      <button
        className=" text-base border-2 border-gray-700 my-5 dark:border-white/[0.3] rounded-[2vw] max-sm:rounded-[6vw] hover:bg-red-400 hover:text-white hover:border-none ease-linear duration-200 px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={handleOpenGmail}>Open Gmail</button>
    </div>
  )
}

export default AfterSignUp;