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
  books: { name: string; price: number }[];
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
      console.log(response)
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
        const response = await axios.delete(`/api/books/deletebooks/`, {
          data: bookId 
        }); // Adjust the endpoint as necessary
        console.log(response);
        setMyBooks(myBooks.filter(book => book._id !== bookId)); // Update state to remove the book
      } catch (error) {
        console.error('Error removing book:', error);
        setError(`An error occurred while removing the book. ${error}`);
      }
    }
  };

  if (error) {
    return <div className="text-xl text-red-600 font-semibold mb-4 mx-3 mt-20 md:mt-56 text-center">{error}</div>;
  }
  if(!loading && myBooks.length === 0) {
    return <div className="text-xl font-semibold mb-4 mx-3 mt-20 md:mt-56 text-center">You have not listed any books yet.</div>;
  }

  return (
    <div className='p-4 sm:p-8 min-h-screen relative z-[9] mt-[60px] sm:mt-[8vw] font-[Gilroy]'>
      <h1 className="text-2xl font-medium mb-8">My Books</h1>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

        {myBooks.map((book) => (
          <div key={book._id} className="container relative text-white">
            <div className="group box w-full p-4 bg-white bg-opacity-10 border border-white border-opacity-20 
                          filter backdrop-blur-xl rounded-lg transition-all duration-300 ease-in-out 
                          flex flex-col justify-between hover:shadow-lg hover:scale-105 hover:border-opacity-55">

      <div className="absolute top-2 right-2">
                <button onClick={() => setMenuVisible(prev => ({ ...prev, [book._id]: !prev[book._id] }))}>
                  &#x22EE; {/* Three dots icon */}
                </button>
                {menuVisible[book._id] && (
                  <div className="absolute right-0 bg-white text-black shadow-lg rounded mt-1">
                    <button 
                      onClick={() => removeBook(book._id)} 
                      className="block px-4 py-2 hover:bg-gray-200"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>   

              <h2 className="title text-xl sm:text-2xl font-medium tracking-wide mb-4">{book.course}</h2>

              <div className='aspect-video w-full rounded-md border-2 overflow-hidden mb-4'>
                <Image 
                  className='w-full h-full object-cover'
                  src="https://imgs.search.brave.com/-jECYjiPs2ms18A1J5ZBPuf_NCglf6PouYjY2fQHCvA/rs:fit:500:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudGhyaWZ0Ym9v/a3MuY29tL2dlbmVy/YWwvZHQtc18xMGVk/MWFkMi5qcGc" // Replace with actual image URL if available
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