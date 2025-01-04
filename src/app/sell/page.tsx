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

interface Book {
  name: string;
  price: number;
}

function SellPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [profileComplete, setProfileComplete] = useState(false);
  const [book, setBook] = useState({
    course: '',
    std: '',
    year: '',
    semester: '',
    isSet: '',
    books: [] as Book[],
  });

  useEffect(() => {
    setLoading(true);
    const fetchUserDetails = async () => {
      const user = await getUserDetails();
      if (user?.isProfileComplete) {
        setProfileComplete(true);
        
      }
    };
    fetchUserDetails();
    setLoading(false);
  }, [])

  const handleSemesterChange = (semester: string) => {
    setBook({ ...book, semester: semester });
  };

  const handleBookSelection = (selectedBooks: Book[]) => {
    setBook({ ...book, books: selectedBooks });
  };

  const onSubmit = async () => {
    try{
      setLoading(true);
      console.log(book);
      const response = await axios.post("/api/books/sell", book);
      console.log("Book Details uploaded Successfully", response.data);
      router.push("/buy");
    }
    catch (error:any) {
      console.log("Failed", error.message);
      
      toast.error(error.message);
  }finally {
      setLoading(false);
  }
  }

  if(!loading && !profileComplete){
    return <div className="text-xl font-semibold mb-4 mx-3 mt-20 md:mt-56 text-center">Complete your profile first for better experience.
    <br/>
    <Button
    onClick={() => router.push("/update-profile")}
    variant="outline"
    className='border mt-5 dark:border-white/[0.3] rounded-[2vw] max-sm:rounded-[6vw] hover:bg-white hover:text-black ease-linear duration-200'>
    Complete Profile</Button> </div>
  }

  return (
    <>
    
    <div className='min-h-[100vh] pt-20 p-9 mt-[6vw] flex flex-col justify-center items-center relative z-[9] max-sm:mt-[20vw]'>
      {loading && 
      <div className="flex justify-center items-center">
      <div className="relative w-24 h-8 p-0">
        <span className="absolute right-0 w-1 h-8 bg-teal-500 block rounded-full animate-move delay-[-0.4s]"></span>
        <span className="absolute right-0 w-1 h-8 bg-teal-500 block rounded-full animate-move delay-[-0.8s]"></span>
        <span className="absolute right-0 w-1 h-8 bg-teal-500 block rounded-full animate-move delay-[-1.2s]"></span>
        <span className="absolute right-0 w-1 h-8 bg-teal-500 block rounded-full animate-move delay-[-1.6s]"></span>
        <span className="absolute right-0 w-1 h-8 bg-teal-500 block rounded-full animate-move delay-[-2s]"></span>
        <span className="absolute right-0 w-1 h-8 bg-teal-500 block rounded-full animate-move delay-[-2.4s]"></span>
        <span className="absolute right-0 w-1 h-8 bg-teal-500 block rounded-full animate-move delay-[-2.8s]"></span>
      </div>
    </div>
    }

    
      <div className="flex flex-col items-start">
      <label className='pl-5' htmlFor="course">Course</label>
      <select
        className='text-black mb-4 mt-2 w-[30vh] md:w-[30vw] px-4 py-2 rounded-[2vw] max-sm:rounded-[6vw]'
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
          className='text-black mb-4 mt-2 w-[30vh] md:w-[30vw] px-4 py-2 rounded-[2vw] max-sm:rounded-[6vw]'
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
          className='text-black mb-4 mt-2 w-[30vh] md:w-[30vw] px-4 py-2 rounded-[2vw] max-sm:rounded-[6vw]'
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
          className='text-black mb-10 mt-2 w-[30vh] md:w-[30vw] px-4 py-2 rounded-[2vw] max-sm:rounded-[6vw]'
          id="isset"
          value={book.isSet}
          onChange={(e) => setBook({ ...book, isSet: e.target.value })}
        >
          <option value="1">Yes</option>
          <option value="0">No</option>
          </select>
          </div>

      <BookSelection booklist={handleBookSelection} />
    

    {/* <PhotoUpload bookImage={handleFile} /> */}
    <Button 
    onClick={onSubmit}
      variant="outline"
      className='border dark:border-white/[0.3] rounded-[2vw] max-sm:rounded-[6vw] hover:bg-blue-500 ease-linear duration-200'
    >
      Submit
    </Button>
    </div>
    
  </> 
  );
}

export default SellPage;
