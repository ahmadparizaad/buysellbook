import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="flex flex-col items-center justify-start w-screen bg-black/[0.96] antialiased relative overflow-hidden p-4 bg-gray-900 text-white">
      
        <div className=' w-[100%] flex md:px-10 items-center justify-between'>
        <div className="mt-2 text-left">
          <a href="/privacy" className="text-gray-400 hover:text-gray-300 m-3 text-sm">Privacy Policy</a><br/>
          <a href="/terms" className="text-gray-400 hover:text-gray-300 m-3 text-sm">Terms of Service</a><br/>
          <a href="/contact" className="text-gray-400 hover:text-gray-300 m-3 text-sm">Contact Us</a>
        </div>
        <div className="flex items-center justify-start -mt-6">
          <a href="https://www.facebook.com/ahmadparizaad" className="text-blue-600 hover:text-gray-300 mx-2">
            <FaFacebook size={24} />
          </a>
          <a href="https://www.twitter.com/ahmadparizaad" className="text-blue-400 hover:text-gray-300 mx-2">
            <FaTwitter size={24} />
          </a>
          <a href="https://www.instagram.com/ahmadparizaad" className="text-pink-500 hover:text-gray-300 mx-2">
            <FaInstagram size={24} />
          </a>
          <a href="https://www.linkedin.com/in/ahmadparizaad" className="text-blue-500 hover:text-gray-300 mx-2">
            <FaLinkedin size={24} />
          </a>
        </div>
        </div>
     
        <div className="mx-auto mt-8 text-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Campus Book. All rights reserved.
        </p>
        </div>
    </footer>
  );
};

export default Footer;