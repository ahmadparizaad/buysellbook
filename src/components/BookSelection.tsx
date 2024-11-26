'use client';
import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import { MdCurrencyRupee } from "react-icons/md";

interface Book {
  name: string;
  price: number;
}

interface BookSelectionProps {
  booklist: (selectedBooks: Book[]) => void;
}

const BookSelection: React.FC<BookSelectionProps> = ({ booklist }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [newBook, setNewBook] = useState<Book>({ name: '', price: 0});
  const [halfAmount, setHalfAmount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0)

  const handleAddBook = () => {
    setBooks([...books, newBook]);
    booklist([...books, newBook]);
    setNewBook({ name: '', price: 0 });
  };

  const handleBookNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewBook({ ...newBook, name: e.target.value });
  };

  const handleBookPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewBook({ ...newBook, price: Number(e.target.value) });
  };

  const calculateTotalAmount = () => {
    const totalPrice = books.reduce((acc, book) => acc + book.price, 0);
    setTotalAmount(totalPrice);
  };

  const calculateHalfAmount = () => {
    const totalPrice = books.reduce((acc, book) => acc + book.price, 0);
    const halfTotal = totalPrice / 2;
    setHalfAmount(halfTotal);
  };

  const calculateAmount = () => {
    calculateTotalAmount();
    calculateHalfAmount();
  }

  return (
    <div className='flex flex-col justify-center items-center mb-4'>
      <div className='flex flex-col items-start'>
        <label className='pl-5' htmlFor="bookName">Book Name</label>
        <input
          type="text"
          className='text-black mb-10 mt-2 w-[30vh] md:w-[30vw] px-4 py-2 rounded-[2vw] max-sm:rounded-[6vw]'
          id="bookName"
          value={newBook.name}
          onChange={handleBookNameChange}
        />
      </div>
      <div className='flex flex-col items-start'>
        <label className='pl-5' htmlFor="bookPrice">Book Price</label>
        <input
          type="number"
          className='text-black mb-6 mt-2 w-[30vh] md:w-[30vw] px-4 py-2 rounded-[2vw] max-sm:rounded-[6vw]'
          id="bookPrice"
          value={newBook.price}
          onChange={handleBookPriceChange}
        />
      </div>
      <Button variant="outline" onClick={handleAddBook}
      className='mt-2  border dark:border-white/[0.3] rounded-[2vw] max-sm:rounded-[6vw] hover:bg-blue-500 ease-linear duration-200'
      >Add</Button>

      
      <div className="w-full flex flex-col items-start mb-4 mt-4 pl-5">
      <div>
        <h2 className='mb-4'>Book Details</h2>
        <ol>
          {books.map((book, index) => (
            <li key={index}  className='flex' >
              {book.name} - <MdCurrencyRupee className='mt-1 ml-1'/> {book.price}
            </li>
          ))}
        </ol>
      </div>

      <div>
      <Button variant="outline" onClick={calculateAmount}
      className='ml-[8vw] mb-8 mt-10 border dark:border-white/[0.3] rounded-[2vw] max-sm:rounded-[6vw] hover:bg-blue-500 ease-linear duration-200'
      >Calculate Total</Button>
        {halfAmount > 0 && (
          <>
          <p className='flex'>Total Amount: <MdCurrencyRupee className='mt-1 ml-1'/> {totalAmount}</p>
          <p className='flex'>50% Amount: <MdCurrencyRupee className='mt-1 ml-1'/> {halfAmount}</p>
          </>
        )}
      </div>
      </div>
    </div>
  );
}

export default BookSelection;
