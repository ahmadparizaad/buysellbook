// pages/update-profile.tsx
'use client'
import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

const UpdateProfile = () => {
  const [profileImage, setProfileImage] = useState("");
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    college: '',
    city: '',
    profileImage: '',
  });

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
      console.log('Profile updated successfully', res.data);
      toast.success('Profile updated successfully');
      router.push('/profile'); // Redirect to profile page after successful update
    } catch (error: any) {
      console.error(error.message);
      toast.error('Failed to update profile');
    }
  };

  return (
    <div className="mt-[6.5vw] flex flex-col items-center justify-center min-h-screen py-2">
      <h1>Update Profile</h1>
      <hr />
      <form onSubmit={handleSubmit} className="max-w-md w-full z-[9]">
        <div className="mb-4">
          <label className="block text-gray-200 text-sm font-bold mb-2">Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter your name"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-200 text-sm font-bold mb-2">College:</label>
          <input
            type="text"
            name="college"
            value={formData.college}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter your college name"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-200 text-sm font-bold mb-2">City:</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter your city"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-200 text-sm font-bold mb-2">Profile Image:</label>
          <input
            type="file" 
            accept="image/jpeg, image/png, application/pdf" 
            onChange={handleFileChange}
            // className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            // placeholder="Enter URL for profile image"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default UpdateProfile;
