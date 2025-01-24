'use client'
import React from 'react'
import OneToOneChat from '@/components/OneToOneChat';
import { Button } from "@/components/ui/button"
import Link from "next/link";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
  import { Checkbox } from "@/components/ui/checkbox"
  import { useState, useEffect } from 'react';
  import axios from 'axios';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { isSet } from 'util/types';
import { title } from 'process';

  interface IBook {
    _id: string;
    userId: string;
    course: string;
    std: string;
    year: string;
    semester: string;
    isSet: string;
    books: {name : string, price : number, halfPrice : number}[];
    seller: {
      name: string;
      city: string;
      college: string;
      university: string;
    };
    totalPrice: number;
  }

function Books() {
  const [books, setBooks] = useState<IBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [senderUID, setSenderUID] = useState('');
  const [recieverUID, setRecieverUID] = useState('');      
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('books');
  const [filters, setFilters] = useState({
    course: '',
    std: '',
    year: '',
    semester: ''
  });

  const router = useRouter();


  useEffect(() => {
    fetchData();
    getSenderUID();
  }, [searchQuery, filters]);

  // Add intersection observer
useEffect(() => {
  const observer = new IntersectionObserver(
    entries => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        setPage(prev => {
          const nextPage = prev + 1;
          fetchData(nextPage);
          return nextPage;
        });
      }
    },
    { threshold: 1.0 }
  );

  const sentinel = document.getElementById('sentinel');
  if (sentinel) observer.observe(sentinel);

    return () => observer.disconnect();
  }, [hasMore, loading]);

  const handleBuyClick = async (book: any) => {
    try{
      const userId = book.userId
    if (book.userId === currentUser) {
      alert("You cannot buy your own book.");
      return; // Prevent further execution
    }

    setIsLoading(true);
    const receiverUid = await getRecieverUID(userId);
    setRecieverUID(receiverUid);
    // Encode book details as URL parameters
    const queryParams = new URLSearchParams({
      reciever: receiverUid
    }).toString();

    router.push(`/onechat?${queryParams}`);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('An error occurred while fetching data.');
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async (pageNum = 1) => {
    try {
      // Add filters to query params
      const queryParams = new URLSearchParams({
        page: pageNum.toString(),
        limit: '12',
        ...(filters.course && { course: filters.course }),
        ...(filters.std && { std: filters.std }),
        ...(filters.year && { year: filters.year }),
        ...(filters.semester && { semester: filters.semester })
      }).toString();

      const response = await axios.get(`/api/books/buy?${queryParams}`);
      console.log(response.data.books);
      if (pageNum === 1) {
        setBooks(response.data.books.reverse());
      } else {
        setBooks(prev => [...prev, ...response.data.books]);
      }
      setHasMore(response.data.books.length === 12);
    } catch (error) {
      setError('An error occurred while fetching data.');
    } finally {
      setLoading(false);
    }
  };

//   const fetchSearchData = async (query: string) => {
//     try {
//       const response = await axios.get(`/api/books/search/search?query=${query}`);
//       setBooks(response.data.books);
//       console.log(response.data.books);
      
//     } catch (error) {
//       console.error('Error fetching data:', error);
//       setError('An error occurred while fetching data.');
//     } finally {
//       setLoading
//   }
// };

  const getSenderUID = async () => {
    // const res = await axios.get('/api/users/me');
    const user = sessionStorage.getItem('user');
    if(user){
      const res = JSON.parse(user);
      setCurrentUser(res._id);
      setSenderUID(res.username);
      return res.username;
    }
  }

  const getRecieverUID = async (userId: string) => {
    const res = await axios.post('/api/users/username', {userId: userId});
    setRecieverUID(res.data.data);
    return res.data.data;
  }

  const handleFilterChange = (filterType: string, value: string) => {
    // Reset dependent filters when course changes
    if (filterType === 'course') {
      setFilters({
        course: value,
        std: '',
        year: '',
        semester: ''
      });
    } else {
      setFilters(prev => ({
        ...prev,
        [filterType]: value
      }));
    }
    setPage(1); // Reset page when filters change
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        searchType: searchType,
        query: searchQuery,
        ...(filters.course && { course: filters.course }),
        ...(filters.std && { std: filters.std }),
        ...(filters.year && { year: filters.year }),
        ...(filters.semester && { semester: filters.semester })
      }).toString();

      const response = await axios.get(`/api/books/buy?${queryParams}`);
      setBooks(response.data.books);
      setHasMore(response.data.books.length === 12);
    } catch (error) {
      toast.error('Failed to search books');
    } finally {
      setLoading(false);
    }
  };

  return (
    // Adjust main container padding and margin for mobile
    <div className='p-2 sm:p-2 min-h-screen h-auto relative z-[9] mt-[60px] sm:mt-[8vw] mb-20 font-[Gilroy]'>
      {isLoading && <div className="fixed inset-0 bg-black bg-opacity-50 z-[999] flex items-center justify-center">
          <Image src="/loading.gif" alt="Loading" width={100} height={100} />
          </div>}
      
      {/* Search section  */}
      <div className="flex flex-col sm:flex-row sm:justify-center gap-3 items-center my-6">
        <select
          className="w-[80%] sm:w-auto sm:py-1 rounded-3xl px-4 py-2 text-black border-2 border-gray-700"
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
        >
          <option value="books">Search Books</option>
          <option value="city">Search by City</option>
          <option value="college">Search by College</option>
          <option value="university">Search by University</option>
        </select>
        
        <input 
          className='w-[80%] sm:w-[30%] sm:py-1 rounded-3xl px-4 py-2 text-black border-2 border-gray-700'
          placeholder={`Search ${searchType}...`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        
        <Button 
          onClick={handleSearch}
          variant="outline" 
          className='sm:w-auto border-2 dark:border-white/[0.3] rounded-3xl bg-white text-black ease-linear duration-200 border-gray-700 hover:bg-blue-400 hover:text-white hover:border-none'>
          Search
        </Button>
      </div>

      {/* Replace the filter accordion with this new one */}
      <Accordion type="single" collapsible className="mb-8">
        <AccordionItem value="item-1">    
          <AccordionTrigger className='text-base'>Filters</AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4">
            {/* Course Filter */}
            <div className="flex flex-col gap-2">
              <label className="font-medium">Course</label>
              <select 
                className="focus:outline-none border-2 border-gray-700 text-black mb-4 mt-2 w-[30vh] md:w-[30vw] px-4 py-2 rounded-[2vw] max-sm:rounded-[6vw]"
                value={filters.course}
                onChange={(e) => handleFilterChange('course', e.target.value)}
              >
                <option className='rounded-3xl' value="">All Courses</option>
                <option value="School">School</option>
                <option value="Engineering">Engineering</option>
                <option value="Medical">Medical</option>
                <option value="BSc">BSc</option>
                <option value="BCom">BCom</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Conditional School Class Filter */}
            {filters.course === "School" && (
              <div className="flex flex-col gap-2">
                <label className="font-medium">Class</label>
                <select 
                  className="border-2 border-gray-700 text-black mb-4 mt-2 w-[30vh] md:w-[30vw] px-4 py-2 rounded-[2vw] max-sm:rounded-[6vw]"
                  value={filters.std}
                  onChange={(e) => handleFilterChange('std', e.target.value)}
                >
                  <option value="">All Classes</option>
                  <option value="Class 9">Class 9</option>
                  <option value="Class 10">Class 10</option>
                  <option value="Class 11">Class 11</option>
                  <option value="Class 12">Class 12</option>
                </select>
              </div>
            )}

            {/* Conditional Year Filter for non-School courses */}
            {filters.course && filters.course !== "School" && (
              <div className="flex flex-col gap-2">
                <label className="font-medium">Year</label>
                <select 
                  className="border-2 border-gray-700 text-black mb-4 mt-2 w-[30vh] md:w-[30vw] px-4 py-2 rounded-[2vw] max-sm:rounded-[6vw]"
                  value={filters.year}
                  onChange={(e) => handleFilterChange('year', e.target.value)}
                >
                  <option value="">All Years</option>
                  <option value="First Year">First Year</option>
                  <option value="Second Year">Second Year</option>
                  <option value="Third Year">Third Year</option>
                  {filters.course !== "BSc" && filters.course !== "BCom" && filters.course === "Medical" && (
                    <option value="Fourth Year">Fourth Year</option>
                  )}
                  {filters.course !== "BSc" && filters.course !== "BCom" && (
                    <option value="Final Year">Final Year</option>
                  )}
                </select>
              </div>
            )}

            {/* Conditional Semester Filter for non-School courses */}
            {filters.course && filters.course !== "School" && (
              <div className="flex flex-col gap-2">
                <label className="font-medium">Semester</label>
                <select 
                  className="border-2 border-gray-700 text-black mb-4 mt-2 w-[30vh] md:w-[30vw] px-4 py-2 rounded-[2vw] max-sm:rounded-[6vw]"
                  value={filters.semester}
                  onChange={(e) => handleFilterChange('semester', e.target.value)}
                >
                  <option value="">All Semesters</option>
                  <option value="Semester 1">Semester 1</option>
                  <option value="Semester 2">Semester 2</option>
                </select>
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8'>
        {loading && Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="animate-pulse flex flex-col items-start gap-4 w-full shadow-md rounded-md p-4">
            <div className="w-full">
              <div className="w-3/4 h-5 bg-slate-400 rounded-xl"></div>
              <div className="w-1/2 h-4 bg-slate-400 mt-3 rounded-xl"></div>
            </div>
            <div className="h-4 bg-slate-400 w-full rounded-xl"></div>
            <div className="h-4 bg-slate-400 w-full rounded-xl"></div>
            <div className="h-4 bg-slate-400 w-full rounded-xl"></div>
            <div className="h-4 bg-slate-400 w-1/2 rounded-xl"></div>
          </div>
        ))}
      </div>

      {error && <p className="text-red-600 mb-8">{error}</p>}

      {/* Books grid */}
      {books.length === 0 && !loading && (
        <div className="text-center text-gray-500 text-xl mt-8">
          No books found.
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-1 px-6">
        {books?.map((book) => (
          <div key={book._id} className="relative mb-4 md:mx-3 text-black">
            <div className="group box p-4 pb-16 bg-blue-500 bg-opacity-10 border border-gray-400/[0.8]
                          filter backdrop-blur-xl rounded-xl transition-all duration-300 ease-in-out 
                          flex flex-col justify-between hover:shadow-lg hover:shadow-blue-200 hover:scale-103 hover:border-opacity-55">
              <div className='flex justify-between items-center'>
              <h2 className="title text-lg sm:text-2xl font-medium tracking-wide mb-4">{book.course}</h2>
              {book.isSet && <p className='text-white mb-6 rounded-3xl text-[12px] bg-green-400 px-2 mr-2'>Complete Set</p>}
              </div>
              <div className='aspect-video w-full rounded-md border-2 overflow-hidden mb-4'>
                <Image 
                  className='w-full h-full object-cover'
                  src="https://imgs.search.brave.com/-jECYjiPs2ms18A1J5ZBPuf_NCglf6PouYjY2fQHCvA/rs:fit:500:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudGhyaWZ0Ym9v/a3MuY29tL2dlbmVy/YWwvZHQtc18xMGVk/MWFkMi5qcGc"
                  alt={book.course}
                  width={500} 
                  height={500}
                />
              </div>

              {book.std && <p className='text-gray-900 mb-[2px]'>Standard: {book.std}</p>}  
              {book.year && <p className='text-gray-900 mb-[2px]'>Year: {book.year}</p>}
              {book.semester && <p className='text-gray-900 mb-[2px]'>Semester: {book.semester}</p>}
            
              {/* <div className="mb-2">
                <h3 className="font-medium mb-[2px]">Books:</h3>
                <ul className="space-y-[1px]">
                  {book.books.map((item, index) => (
                    <li key={index} className="text-black">
                      <p className='font-medium'>{item.name}: ₹{item.halfPrice}</p>
                    </li>
                  ))}
                </ul>
                <p className='font-medium'>Total Price: ₹{book.totalPrice}</p>
              </div>   */}
              <div>

              </div>

              {book.seller && (
                <div className="text-sm text-gray-900">
                  <p>Seller: {book.seller.name}</p>
                  <p>College: {book.seller.college.length > 25 ? `${book.seller.college.split('').slice(0, 25).join('')}...` : book.seller.college}</p>
                  {/* <p>University: {book.seller.university}</p> */}
                  <p>City: {book.seller.city}</p>
                </div>
              )}

              <Button 
                onClick={() => handleBuyClick(book)} 
                variant="outline" 
                className="absolute font-medium left-1/2 bottom-4 transform -translate-x-1/2 w-4/5 rounded-full bg-white text-black hover:text-white hover:bg-blue-400 transition-all duration-300 ease-out"
              >
                Buy
              </Button>

              <div className="absolute blur-lg bg-[#fab5704c] rounded-full w-16 h-16 sm:w-24 sm:h-24 top-[8%] right-[9%] -z-10"></div>
              <div className="absolute border border-white h-8 sm:h-12 top-[8%] right-[5%]"></div>
            </div>
          </div> 
        ))}
        <div id="sentinel" className="h-10" />
      </div>
    </div>
  )
}

export default Books