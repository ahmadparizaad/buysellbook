'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import Image from 'next/image';
import LoadingComponent from '@/components/LoadingComponent';

interface IBook {
  _id: string;
  userId: string;
  course: string;
  std: string;
  year: string;
  semester: string;
  isSet: string;
  books: { name: string; halfPrice: number }[];
  totalPrice: number;
}

const MyBook = () => {
  const [myBooks, setMyBooks] = useState<IBook[]>([]);
  const [menuVisible, setMenuVisible] = useState<{ [key: string]: boolean }>({}); // Track visibility of menus
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const initializePage = async () => {
      try {
        await fetchMyBooks();
      } catch (error) {
        console.error('Error initializing page:', error);
      } 
    };

    initializePage();
  }, []);

  const fetchMyBooks = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/books/mybooks'); // Adjust the endpoint as necessary
      setMyBooks(response.data.data);
    } catch (error) {
      console.error('Error fetching my books:', error);
      setError('An error occurred while fetching your books.');
    } finally {
      setLoading(false);
    }
  };

  const removeBook = async (bookId: string) => {
    const confirmRemove = window.confirm("Are you sure you want to remove this book?");
    if (confirmRemove) {
      try {
        const response = await axios.delete(`/api/books/deletebooks/${bookId}`); // Adjust the endpoint as necessary
        setMyBooks(myBooks.filter(book => book._id !== bookId)); // Update state to remove the book
      } catch (error) {
        console.error('Error removing book:', error);
        setError(`An error occurred while removing the book. ${error}`);
      }
    }
  };

  if (error) {
    return <div className="text-xl min-h-[100vh] font-[Gilroy] text-red-600 font-semibold mb-4 mx-3 mt-20 md:mt-56 text-center">{error}</div>;
  }
  if(!loading && myBooks.length === 0) {
    return <div className="min-h-[100vh] font-[Gilroy] text-xl font-semibold mb-4 mx-3 mt-40 md:mt-56 text-center">You have not listed any books yet.</div>;
  }

  return (
    <div className='p-4 sm:p-8 min-h-screen relative z-[9] mt-[60px] sm:mt-[8vw] font-[Gilroy]'>
      <h1 className="text-2xl font-medium mb-8">My Books</h1>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-8'>
        {loading && Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="animate-pulse flex flex-col items-start gap-4 w-full shadow-md rounded-md p-4">
            <div className="w-full">
              <div className="w-3/4 h-5 bg-slate-400 rounded-xl"></div>
              <div className="w-1/2 h-4 bg-slate-400 mt-3 rounded-xl"></div>
            </div>
            <div className="h-4 bg-slate-400 w-full rounded-xl"></div>
            <div className="h-4 bg-slate-400 w-full rounded-xl"></div>
            <div className="h-4 bg-slate-400 w-full rounded-xl"></div>
            <div className="h-4 bg-slate-400 w-full rounded-xl"></div>
            <div className="h-4 bg-slate-400 w-1/2 rounded-xl"></div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-y-6">

        {myBooks.map((book) => (
          <div key={book._id} className="container relative text-black">
            <div className="group box w-full p-4 bg-blue-500 bg-opacity-10 border border-gray-400/[0.8]
                          filter backdrop-blur-xl rounded-lg transition-all duration-300 ease-in-out 
                          flex flex-col justify-between hover:shadow-lg hover:scale-104 hover:border-opacity-55">

      <div className="absolute top-2 right-2">
                <button onClick={() => setMenuVisible(prev => ({ ...prev, [book._id]: !prev[book._id] }))}>
                  &#x22EE; {/* Three dots icon */}
                </button>
                {menuVisible[book._id] && (
                  <div className="absolute right-0 bg-white text-black shadow-lg hover:bg-gray-200 rounded">
                    <button 
                      onClick={() => removeBook(book._id)} 
                      className="block px-4 py-2"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>   

              <div className='flex justify-between items-center'>
              <h2 className="title text-xl sm:text-2xl font-medium tracking-wide mb-4">{book.course}</h2>
              {book.isSet && <p className='text-white mb-6 rounded-3xl text-sm bg-green-400 px-2 mx-2'>Complete Set</p>}
              </div>

              <div className='aspect-video w-full rounded-md border-2 overflow-hidden mb-4'>
                <Image 
                  className='w-full h-full object-cover'
                  src="https://imgs.search.brave.com/-jECYjiPs2ms18A1J5ZBPuf_NCglf6PouYjY2fQHCvA/rs:fit:500:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudGhyaWZ0Ym9v/a3MuY29tL2dlbmVy/YWwvZHQtc18xMGVk/MWFkMi5qcGc" // Replace with actual image URL if available
                  alt={book.course}
                  width={500} 
                  height={500}
                />
              </div>

              {book.std && <p className='text-gray-900 mb-[2px]'>Standard: {book.std}</p>}  
              {book.year && <p className='text-gray-900 mb-[2px]'>Year: {book.year}</p>}
              {book.semester && <p className='text-gray-900 mb-[2px]'>Semester: {book.semester}</p>}
            
              <div className="mb-2">
                <h3 className="font-medium mb-[2px]">Books:</h3>
                <ul className="space-y-[2px]">
                  {book.books.map((item, index) => (
                    <li key={index} className="text-gray-900">
                      <p className='font-medium'>{item.name}: ₹{item.halfPrice}</p>
                    </li>
                  ))}
                </ul>
                <p className='font-medium'>Total Price: ₹{book.totalPrice}</p>
              </div>

              {/* <Button 
                variant="outline" 
                className="absolute left-1/2 bottom-4 transform -translate-x-1/2 
                         w-4/5 rounded-full bg-blue-500 text-white"
              >
                Edit
              </Button> */}
            </div>
          </div> 
        ))}
      </div>
    </div>
  );
};

export default MyBook;