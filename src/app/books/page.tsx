'use client'
import Card from '@/components/ui/card'
import React from 'react'
import { Button } from "@/components/ui/button"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
  import { Checkbox } from "@/components/ui/checkbox"
  import { useState, useEffect } from 'react';
  import axios from 'axios';

  interface IBook {
    _id: string;
    course: string;
    std: string;
    year: string;
    semester: string;
    isSet: string;
    books: string[];
  }
  


function Books() {
  const [books, setBooks] = useState<IBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('/api/books/buy');
      setBooks(response.data.books);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('An error occurred while fetching data.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className='p-8 min-h-[100vh] relative z-[9] mt-[8vw] max-sm:mt-[30vw]'>
        <input className='rounded-[2vw] max-sm:rounded-[6vw] text-black px-[15px] py-[5px] border-2 mx-5 '></input>
        <Button variant="outline" className='border dark:border-white/[0.3] max-sm:rounded-[6vw] max-sm:mt-[5vw] max-sm:mb-[5vw] max-sm:ml-[30vw] rounded-[2vw] hover:bg-white hover:text-black ease-linear duration-200'>Search</Button>
        <Accordion type="single" collapsible>
  <AccordionItem value="item-1">    
    <AccordionTrigger>Filter</AccordionTrigger>
    <AccordionContent>
    <Checkbox className='mx-3' />First Year
    <Checkbox className='mx-3' />Second Year
    <Checkbox className='mx-3' />Third Year
    <Checkbox className='mx-3' />Last Year

    </AccordionContent>
  </AccordionItem>
</Accordion>

{loading && <p>Loading...</p>}

{error && <p className="text-red-600">{error}</p>}

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {books.map((book) => (
    <div key={book._id} className="bg-white shadow-md rounded-md p-4">
      <h2 className="text-xl font-bold mb-2">{book.course}</h2>
      <p><strong>Standard:</strong> {book.std}</p>
      <p><strong>Year:</strong> {book.year}</p>
      <p><strong>Semester:</strong> {book.semester}</p>
      <p><strong>Is Set:</strong> {book.isSet}</p>

      <div className="mt-2">
        <h3 className="text-lg font-semibold mb-1">Books:</h3>
        <ul>
          {book.books.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  ))}
</div>
        
        
    </div>
  )
}

export default Books