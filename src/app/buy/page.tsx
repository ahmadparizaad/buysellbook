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

  interface IBook {
    _id: string;
    userId: string;
    course: string;
    std: string;
    year: string;
    semester: string;
    isSet: string;
    books: {name : string, price : number}[];
  }
  


function Books() {
  const [books, setBooks] = useState<IBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [senderUID, setSenderUID] = useState('');
  const [recieverUID, setRecieverUID] = useState('');      
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState(''); // Add state for search query

  const router = useRouter();


  useEffect(() => {
    fetchData();
    getSenderUID();
  }, [searchQuery]);

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
    const userId = book.userId
    if (book.userId === currentUser) {
      alert("You cannot buy your own book.");
      return; // Prevent further execution
    }

    const receiverUid = await getRecieverUID(userId);
    setRecieverUID(receiverUid);
    // Encode book details as URL parameters
    const queryParams = new URLSearchParams({
      reciever: receiverUid
    }).toString();

    router.push(`/onechat?${queryParams}`);
  };

  const fetchData = async (pageNum = 1) => {
    try {
      const response = await axios.get(`/api/books/buy?page=${pageNum}&limit=12`);
    if (pageNum === 1) {
      setBooks(response.data.books);
    } else {
      setBooks(prev => [...prev, ...response.data.books]);
    }
    setHasMore(response.data.books.length === 12);
   } catch (error) {
      console.error('Error fetching data:', error);
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
    const res = await axios.get('/api/users/me');
    const senderUID = res.data.data.username;
    const userId = res.data.data._id
    console.log(userId);
    setCurrentUser(userId)
    setSenderUID(senderUID);
    console.log(senderUID);
    return senderUID;
  }

  const getRecieverUID = async (userId: string) => {
    const res = await axios.post('/api/users/username', {userId: userId});
    setRecieverUID(res.data.data);
    return res.data.data;
  }

  return (
    // Adjust main container padding and margin for mobile
    <div className='p-2 sm:p-2 min-h-screen relative z-[9] mt-[60px] sm:mt-[8vw] font-[Gilroy]'>
      
      {/* Search section  */}
      <div className="flex sm:flex-row sm:justify-center gap-3 items-center my-6">
        <input 
          className='w-[80%] sm:w-[30%] sm:py-1 rounded-3xl px-4 py-2 text-black border-2'
          placeholder="Search books..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button 
          // onClick={() => fetchSearchData(searchQuery)}
          variant="outline" 
          className=' sm:w-auto border dark:border-white/[0.3] rounded-3xl hover:bg-white hover:text-black ease-linear duration-200'
        >
          Search
        </Button>
      </div>

      {/* Filter accordion */}
      {/* <Accordion type="single" collapsible className="mb-8">
        <AccordionItem value="item-1">    
          <AccordionTrigger>Filter</AccordionTrigger>
          <AccordionContent className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Checkbox id="fy" />
              <label htmlFor="fy">First Year</label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="sy" />
              <label htmlFor="sy">Second Year</label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="ty" />
              <label htmlFor="ty">Third Year</label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="ly" />
              <label htmlFor="ly">Last Year</label>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion> */}

      
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8'>
        {loading && Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="animate-pulse flex flex-col items-start gap-4 w-full shadow-md rounded-md p-4">
            <div className="w-full">
              <div className="w-3/4 h-5 bg-slate-400 rounded-md"></div>
              <div className="w-1/2 h-4 bg-slate-400 mt-3 rounded-md"></div>
            </div>
            <div className="h-4 bg-slate-400 w-full rounded-md"></div>
            <div className="h-4 bg-slate-400 w-full rounded-md"></div>
            <div className="h-4 bg-slate-400 w-full rounded-md"></div>
            <div className="h-4 bg-slate-400 w-1/2 rounded-md"></div>
          </div>
        ))}
      </div>

      {error && <p className="text-red-600 mb-8">{error}</p>}

      {/* Books grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {books?.map((book) => (
          <div key={book._id} className="container relative text-white">
            <div className="group box w-[80vw] sm:w-auto p-4 pb-16 bg-white bg-opacity-10 border border-white border-opacity-20 
                          filter backdrop-blur-xl rounded-lg transition-all duration-300 ease-in-out 
                          flex flex-col justify-between hover:shadow-lg hover:scale-105 hover:border-opacity-55">
              <h2 className="title text-xl sm:text-2xl font-medium tracking-wide mb-4">{book.course}</h2>
              
              <div className='aspect-video w-full rounded-md border-2 overflow-hidden mb-4'>
                <Image 
                  className='w-full h-full object-cover'
                  src="https://imgs.search.brave.com/-jECYjiPs2ms18A1J5ZBPuf_NCglf6PouYjY2fQHCvA/rs:fit:500:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudGhyaWZ0Ym9v/a3MuY29tL2dlbmVy/YWwvZHQtc18xMGVk/MWFkMi5qcGc"
                  alt={book.course}
                  width={500} 
                  height={500}
                />
              </div>

              {book.std && <p className='text-gray-300 mb-[2px]'>Standard: {book.std}</p>}  
              <p className='text-gray-300 mb-[2px]'>Year: {book.year}</p>
              <p className='text-gray-300 mb-[2px]'>Semester: {book.semester}</p>
            
              <div className="mb-2">
                <h3 className="font-medium mb-[2px]">Books:</h3>
                <ul className="space-y-[2px]">
                  {book.books.map((item, index) => (
                    <li key={index} className="text-gray-300">
                      <p className='font-medium'>{item.name}: ₹{item.price}</p>
                    </li>
                  ))}
                </ul>
              </div>

              <Button 
                onClick={() => handleBuyClick(book)} 
                variant="outline" 
                className="absolute font-medium left-1/2 bottom-4 transform -translate-x-1/2 
                         w-4/5 rounded-full bg-blue-600 text-white 
                          transition-all duration-300 ease-out 
                          hover:text-blue-800 hover:bg-white"
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