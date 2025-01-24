"use client";
import axios from "axios";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {useRouter} from "next/navigation";
import { Button } from "@/components/ui/button"
import Image from "next/image";

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
    const router = useRouter()
    const [user, setUser] = useState({
        name: "",
        email: "",
        college: "",
        university: "",
        city: "",
        profileImage: "", // Assuming this is the URL for the profile image
      });

      useEffect(() => {
        if (typeof window !== 'undefined') {
          const user = sessionStorage.getItem('user')
          if(user){
          getUserDetails();
          }
        }
      }, []);

    const logout = async () => {
        try {
            setIsLoading(true);
            const logout = await axios.get('/api/users/logout')

            if(logout.data.success){
                sessionStorage.removeItem('token');
                sessionStorage.removeItem('user');
            }
            toast.success('Logout successful')
            router.push('/login')
            
        } catch (error:any) {
            toast.error("Error in logout")
        } finally {
            setIsLoading(false);
        }
    }

    const getUserDetails = async () => {
        try {
          setLoading(true);
          const user = sessionStorage.getItem('user');
          // const res = await axios.get('/api/users/me');
          const res = JSON.parse(user!);
          setUser({
            name: res.name,
            email: res.email,
            college: res.college,
            university: res.university,
            city: res.city,
            profileImage: res.profileImage,
          });
        } catch (error: any) {
          toast.error(error.message);
        } finally {
          setLoading(false);
        }
      };

      if(loading){
        return <div className="flex items-center justify-center h-screen w-screen">
        <div className="animate-pulse flex flex-col items-start gap-4 w-full shadow-md rounded-md p-4">
            <div className="w-full">
              <div className="w-3/4 h-5 bg-slate-400 rounded-md"></div>
              <div className="w-1/2 h-4 bg-slate-400 mt-3 rounded-md"></div>
            </div>
            <div className="h-4 bg-slate-400 w-full rounded-md"></div>
            <div className="h-4 bg-slate-400 w-full rounded-md"></div>
            <div className="h-4 bg-slate-400 w-full rounded-md"></div>
            <div className="h-4 bg-slate-400 w-1/2 rounded-md"></div>
          </div>
          </div>
      }

      if(!sessionStorage.getItem('user')){
        return (<div className="flex items-center justify-center h-screen w-screen font-[Gilroy]">
          <p>Sign up today and never miss the books you love!</p>
          </div>)}

    return (      
    <>
    {!loading &&   
    <div className="text-black flex flex-col items-center justify-center min-h-screen py-2 z-[9] w-full overflow-x-hidden font-[Gilroy]">
          {/* <h1>Profile</h1> */}
          {/* <Image src="/profilebg.jpg" alt="Profile" layout="fill" objectFit="cover"/>  */}

          <hr />

          
          <div className="bg-blue-500 backdrop-blur-sm bg-opacity-10 bg-clip-padding backdrop-filter flex flex-col items-start justify-center shadow-lg rounded-2xl px-[4vw] p-6 mb-8 m-[3vw] z-[9] md:w-[50%]  w-[95%] border-[1px]">
            <div className="flex">
              <label className="block text-black text-md font-semibold mb-1 mr-2">
                Name :
              </label>
              <p className='text-md'>{user.name}</p>
            </div>
            <div className="flex">
              <label className="fix text-black text-md font-semibold mb-1 mr-2">
                Email ID :
              </label>
              <p className='text-md'>{user.email}</p>
            </div>
            <div className="flex">
              <label className="block text-black text-md font-semibold mb-1 mr-2">
                College :
              </label>
              <p className='text-md'>{user.college}</p>
            </div>
            <div className="flex">
              <label className="block text-black text-md font-semibold mb-1 mr-2">
              University :
              </label>
              <p className='text-md'>{user.university}</p>
            </div>
            <div className="flex">
              <label className="block text-black text-md font-semibold mb-1 mr-2">
                City :
              </label>
              <p className='text-md'>{user.city}</p>
            </div>
            {user.profileImage && (
              <div className="flex mb-3">
                <label className="block text-black text-md font-semibold mb-2 mr-2">
                  Profile Image :
                </label>
                <Image
                  src={user.profileImage}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover"
                />
              </div>
            )}
            
          </div>
          <hr />
          <div className="flex gap-4 items-center">
          <Link href="/update-profile">
              <Button variant="outline" className='border-[1px] border-gray-700 px-5 rounded-3xl bg-white hover:bg-blue-400 hover:text-white hover:border-none ease-linear duration-200'>Update Profile</Button>
            </Link>
          <Button variant="outline"
            onClick={logout}
            className='border-[1px] border-gray-700 px-5 rounded-3xl hover:bg-blue-400 bg-white hover:text-white hover:border-none ease-linear duration-200'
          >
            {isLoading ? 'Processing...' : 'Logout'}
          </Button>
          </div>
        </div>
    }
        </>
      );
    }