"use client";
import axios from "axios";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import {toast} from "react-hot-toast";
import {useRouter} from "next/navigation";
import { Button } from "@/components/ui/button"
import Image from "next/image";

export default function ProfilePage() {
    const router = useRouter()
    const [user, setUser] = useState({
        name: "",
        email: "",
        college: "",
        city: "",
        profileImage: "", // Assuming this is the URL for the profile image
      });

      useEffect(() => {
        getUserDetails();
      }, []);

    const logout = async () => {
        try {
            await axios.get('/api/users/logout')
            toast.success('Logout successful')
            router.push('/login')
        } catch (error:any) {
            console.log(error.message);
            toast.error(error.message)
        }
    }

    const getUserDetails = async () => {
        try {
          const res = await axios.get('/api/users/me');
          setUser({
            name: res.data.data.name,
            email: res.data.data.email,
            college: res.data.data.college,
            city: res.data.data.city,
            profileImage: res.data.data.profileImage,
          });
        } catch (error: any) {
          console.log(error.message);
          toast.error(error.message);
        }
      };

    return (
        <div className="text-white flex flex-col items-center justify-center min-h-screen py-2 z-[9] w-full overflow-x-hidden">
          {/* <h1>Profile</h1> */}
          <hr />
          <div className="bg-slate-500/[.07] flex flex-col items-start justify-center shadow-xl rounded-2xl px-[4vw] p-6 mb-8 m-[3vw] z-[9] md:w-[50%]  w-[95%] border-[1px]">
            <div className="flex mb-3">
              <label className="block text-white text-sm font-semibold mb-1 mr-2">
                Name:
              </label>
              <p className='text-md'>{user.name}</p>
            </div>
            <div className="flex mb-3">
              <label className="block text-white text-sm font-semibold mb-1 mr-2">
                Email ID:
              </label>
              <p className='text-md'>{user.email}</p>
            </div>
            <div className="flex mb-3">
              <label className="block text-white text-sm font-semibold mb-1 mr-2">
                College:
              </label>
              <p className='text-md'>{user.college}</p>
            </div>
            <div className="flex ">
              <label className="block text-white text-sm font-semibold mb-1 mr-2">
                City:
              </label>
              <p className='text-md'>{user.city}</p>
            </div>
            {user.profileImage && (
              <div className="flex mb-3">
                <label className="block text-white text-sm font-semibold mb-2 mr-2">
                  Profile Image:
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
              <Button variant="outline" className='border dark:border-white/[0.3] rounded-3xl hover:bg-white hover:text-black ease-linear duration-200'>Update Profile</Button>
            </Link>
          <Button variant="outline"
            onClick={logout}
            className='border dark:border-white/[0.3] rounded-3xl hover:bg-white hover:text-black ease-linear duration-200'
          >
            Logout
          </Button>
          </div>
        </div>
      );
    }