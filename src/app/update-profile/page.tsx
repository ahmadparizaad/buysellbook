// pages/update-profile.tsx
'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { Button } from "@/components/ui/button"

const UpdateProfile = () => {
  const [profileImage, setProfileImage] = useState("");
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    college: '',
    city: '',
    isProfileComplete: true,
  });

  const getUserDetails = async () => {
    try {
      const res = await axios.get('/api/users/me');
      setFormData(res.data.data);
    } catch (error: any) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getUserDetails();
  }, [])
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    setProfileImage(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.put('/api/users/update-profile', formData);
      toast.success('Profile updated successfully');
      router.push('/profile'); // Redirect to profile page after successful update
    } catch (error: any) {
      console.error(error.message);
      toast.error('Failed to update profile');
    }
  };

  return (
    <div className="min-h-[100vh] p-9 mt-[3vw] flex flex-col justify-center items-center relative z-[9] max-sm:mt-[5vw]">
      <h1 className='text-2xl'>Update Profile</h1>
      <br />
      <form onSubmit={handleSubmit} className="z-[9] flex flex-col items-center justify-center py-2">
        <div className="mb-4">
          {/* <label className="block text-gray-200 text-sm font-bold mb-2">Name:</label> */}
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className='text-black border-2 border-gray-700 mb-4 mt-2 w-[30vh] md:w-[30vw] px-4 py-2 rounded-[2vw] max-sm:rounded-[6vw]'
            placeholder="Enter your name"
          />
        </div>
        <div className="mb-4">
          {/* <label className="block text-gray-200 text-sm font-bold mb-2">College:</label> */}
          <input
            type="text"
            name="college"
            required
            value={formData.college}
            onChange={handleChange}
            className='text-black border-2 border-gray-700 mb-4 mt-2 w-[30vh] md:w-[30vw] px-4 py-2 rounded-[2vw] max-sm:rounded-[6vw]'

            placeholder="Enter your college name"
          />
        </div>
        <div className="mb-4">
          {/* <label className="block text-gray-200 text-sm font-bold mb-2">City:</label> */}
          <input
            type="text"
            name="city"
            required
            value={formData.city}
            onChange={handleChange}
            className='text-black border-2 border-gray-700 mb-4 mt-2 w-[30vh] md:w-[30vw] px-4 py-2 rounded-[2vw] max-sm:rounded-[6vw]'

            placeholder="Enter your city"
          />
        </div>
        {/* <div className="mb-4">
          <label className="block text-gray-200 text-sm font-bold mb-2">Profile Image:</label>
          <input
            type="file" 
            accept="image/jpeg, image/png, application/pdf" 
            onChange={handleFileChange}
            // className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            // placeholder="Enter URL for profile image"
          />
        </div> */}
        <Button
          type="submit"
          variant="outline"
          className='border-2 border-gray-700 mt-5 dark:border-white/[0.3] rounded-[2vw] max-sm:rounded-[6vw] hover:bg-blue-400 hover:text-white hover:border-none  ease-linear duration-200'
          >
          Update Profile
        </Button>
      </form>
    </div>
  );
};

export default UpdateProfile;
