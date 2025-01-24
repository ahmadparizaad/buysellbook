'use client';
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import PhotoUpload from '@/components/PhotoUpload';
import Semester from '@/components/Semester';
import BookSelection from '@/components/BookSelection';
import { toast } from "react-hot-toast";
import {useRouter} from "next/navigation";
import axios from "axios";
import getUserDetails from '@/utils/getUserDetails';
import Image from 'next/image';

interface Book {
  name: string;
  price: number;
  halfPrice: number;
}

function SellPage() {
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [profileComplete, setProfileComplete] = useState(false);
  const [book, setBook] = useState({
    course: '',
    std: '',
    year: '',
    semester: '',
    isSet: '',
    books: [] as Book[],
    totalPrice: 0,
  });

  useEffect(() => {
    
    const fetchUserDetails = async () => {
      setLoading(true);
      if (typeof window !== 'undefined') {
      const user = sessionStorage.getItem('user');
      // const user = await getUserDetails();
      const userObj = JSON.parse(user!);
      if (userObj?.isProfileComplete) {
        setProfileComplete(true);
      }
      setLoading(false);
    }
    };
    fetchUserDetails();
  }, [])

  const handleSemesterChange = (semester: string) => {
    setBook({ ...book, semester: semester });
  };

  const handleBookSelection = (selectedBooks: Book[]) => {
    setBook({ ...book, books: selectedBooks });
  };

  const handleTotalPrice = (totalPrice: number) => {
    setBook({ ...book, totalPrice: totalPrice });
  };

  const onSubmit = async () => {
    try{
      setIsLoading(true);
      const response = await axios.post("/api/books/sell", book);
      toast.success("Book added successfully");
      router.push("/mybooks");
    }
    catch (error:any) {
      console.log("Failed", error.message);
      if(error.status === 400) {
        toast.error("Missing required fields");
      }
      if(error.status === 404) {
        toast.error("User not found");
      }
      if(error.status === 500) {
        toast.error("Internal server error");
      }
  }finally {
      setIsLoading(false);
  }
  }

  if(loading) {
    // return <div className="min-h-[100vh] text-xl font-semibold mb-4 mx-3 mt-40 md:mt-56 text-center font-[Gilroy]">Loading...</div>
    return <div className='flex flex-col items-center justify-center min-h-screen py-2 font-[Gilroy]'>
      <Image src='/loading.gif' width={100} height={100} alt='Loading' />
    </div>
  }

  return (
    <>
    {!profileComplete ? 
    <div className="min-h-[100vh] text-xl font-semibold mb-4 mx-3 mt-40 md:mt-56 text-center font-[Gilroy]">Complete your profile first for better experience.
    <br/>
    <Button
    onClick={() => router.push("/update-profile")}
    variant="outline"
    className=' border-2 border-gray-700 mt-5 dark:border-white/[0.3] rounded-[2vw] max-sm:rounded-[6vw] bg-white hover:bg-blue-400 hover:text-white hover:border-none ease-linear duration-200'>
    Complete Profile</Button> </div>
    :
    <div className='min-h-[100vh] pt-20 p-9 mt-[6vw] flex flex-col justify-center items-center relative z-[9] max-sm:mt-[20vw] font-[Gilroy]'>
    
      <div className="flex flex-col items-start">
      <label className='pl-5' htmlFor="course">Course</label>
      <select
        className='text-black border-2 border-gray-700 mb-4 mt-2 w-[30vh] md:w-[30vw] px-4 py-2 rounded-[2vw] max-sm:rounded-[6vw]'
        id="course"
        value={book.course}
        onChange={(e) => setBook({ ...book, course: e.target.value })}
      >
        <option value="">Select Course</option>
        <option value="School">School</option>
        <option value="Engineering">Engineering</option>
        <option value="Medical">Medical</option>
        <option value="BSc">BSc</option>
        <option value="BCom">BCom</option>
        <option value="Other">Other</option>
      </select>
    </div>
    <br />

    {book.course === "School" &&
      <div className='flex flex-col items-start'>
        <label className='pl-5' htmlFor="class">Class</label>
        <select
          className='text-black border-2 border-gray-700 mb-4 mt-2 w-[30vh] md:w-[30vw] px-4 py-2 rounded-[2vw] max-sm:rounded-[6vw]'
          id="class"
          value={book.std}
          onChange={(e) => setBook({ ...book, std: e.target.value })}
        >
          <option value="">Select Class</option>
          <option value="Class 9">Class 9</option>
          <option value="Class 10">Class 10</option>
          <option value="Class 11">Class 11</option>
          <option value="Class 12">Class 12</option>
        </select>
      </div>
    }
    {book.course && book.course !== "School" &&
      <div className='flex flex-col items-start'>
        <label className='pl-5' htmlFor="year">Year</label>
        <select
          className='text-black border-2 border-gray-700 mb-4 mt-2 w-[30vh] md:w-[30vw] px-4 py-2 rounded-[2vw] max-sm:rounded-[6vw]'
          id="year"
          value={book.year}
          onChange={(e) => setBook({ ...book, year: e.target.value })}
        >
          <option value="">Select Year</option>
          <option value="First Year">First Year</option>
          <option value="Second Year">Second Year</option>
          <option value="Third Year">Third Year</option>
          {book.course !== "BSc" && book.course === "Medical" &&
            <option value="Fourth Year">Fourth Year</option>
          }
          {book.course !== "BSc" &&
            <option value="Final Year">Final Year</option>
          }
        </select>
      </div>
    }
    <br />

    {book.course && book.course !== "School" &&
      <Semester semester={book.semester} setSemester={handleSemesterChange} />
    }

      <div className='flex flex-col items-center'>
        <label className='pb-3' htmlFor="isset">Do you have Complete Set of Books?</label>
        <select
          className='text-black border-2 border-gray-700 mb-10 mt-2 w-[30vh] md:w-[30vw] px-4 py-2 rounded-[2vw] max-sm:rounded-[6vw]'
          id="isset"
          value={book.isSet}
          onChange={(e) => setBook({ ...book, isSet: e.target.value })}
        >
          <option value="">Select</option>
          <option value="1">Yes</option>
          <option value="0">No</option>
          </select>
          </div>
      <div className='flex flex-col items-start'>
      <BookSelection booklist={handleBookSelection} handleTotalPrice={handleTotalPrice} />
    </div>

    {/* <PhotoUpload bookImage={handleFile} /> */}
    <Button 
    onClick={onSubmit}
      variant="outline"
      className='border-2 px-5 border-gray-700 dark:border-white/[0.3] rounded-[2vw] max-sm:rounded-[6vw] hover:bg-blue-400 hover:text-white hover:border-none ease-linear duration-200'
    >
      {isLoading ? "Submitting..." : "Submit"}
    </Button>
    </div>
    }
    
    
    
  </> 
  );
}

export default SellPage;
