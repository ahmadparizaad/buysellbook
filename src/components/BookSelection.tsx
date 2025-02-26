'use client';
import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import { MdCurrencyRupee } from "react-icons/md";
import { MdClose } from "react-icons/md";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import UploadImage from '@/components/ui/UploadImage';
import Image from 'next/image';
import { toast } from 'react-hot-toast';

interface Book {
  name: string;
  price: number;
  halfPrice: number;
  image: string;
}

interface BookSelectionProps {
  booklist: (selectedBooks: Book[]) => void;
  handleTotalPrice: (totalPrice: number) => void;
}

const BookSelection: React.FC<BookSelectionProps> = ({ booklist, handleTotalPrice }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [newBook, setNewBook] = useState<Book>({ name: '', price: 0, halfPrice: 0, image: '' });
  const [halfAmount, setHalfAmount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0)

  const handleAddBook = () => {
    if (!newBook.name || !newBook.price || !newBook.image) return toast.error('Please fill all the fields');
    setBooks([...books, newBook]);
    booklist([...books, newBook]);
    setNewBook({ name: '', price: 0, halfPrice: 0, image: '' });
  };

  const handleBookNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewBook({ ...newBook, name: e.target.value });
  };

  const handleBookPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const price = Number(e.target.value);
    setNewBook({ ...newBook, price, halfPrice: price / 2 });
  };

  const handleDeleteBook = (index: number) => {
    const updatedBooks = books.filter((_, i) => i !== index);
    setBooks(updatedBooks);
    booklist(updatedBooks);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; // Get the first uploaded file
    if (file) {
      console.log("Uploading Image:", file);
  
      const reader = new FileReader();
      reader.readAsDataURL(file); // Convert to Base64
  
      reader.onloadend = () => {
        const base64Image = reader.result as string;
        console.log("Base64 Image:", base64Image);
  
        // Set the Base64 string to state
        setNewBook({ ...newBook, image: base64Image });
      };
  
      reader.onerror = (error) => {
        console.error("Error converting file to Base64:", error);
      };
    }
  };
  
  

  const calculateTotalAmount = () => {
    const totalPrice = books.reduce((acc, book) => acc + book.price, 0);
    setTotalAmount(totalPrice);
  };

  const calculateHalfAmount = () => {
    const totalPrice = books.reduce((acc, book) => acc + book.price, 0);
    const halfTotal = totalPrice / 2;
    setHalfAmount(halfTotal);
    handleTotalPrice(halfTotal);

  };

  const calculateAmount = () => {
    calculateTotalAmount();
    calculateHalfAmount();
  }

  return (
    <div className='flex flex-col justify-center items-center mb-4 font-[Gilroy]'>
      <div className='flex flex-col items-start'>
        <label className='pl-5' htmlFor="bookName">Book Name</label>
        <input
          type="text"
          className='text-black border-2 border-gray-700 mb-10 mt-2 w-[30vh] md:w-[30vw] px-4 py-2 rounded-[2vw] max-sm:rounded-[6vw]'
          id="bookName"
          value={newBook.name}
          onChange={handleBookNameChange}
          required
        />
      </div>
      <div className='flex flex-col items-start'>
        <label className='pl-5' htmlFor="bookPrice">Book Price</label>
        <input
          type="number"
          className='text-black border-2 border-gray-700 mb-6 mt-2 w-[30vh] md:w-[30vw] px-4 py-2 rounded-[2vw] max-sm:rounded-[6vw]'
          id="bookPrice"
          value={newBook.price}
          onChange={handleBookPriceChange}
          required
        />
      </div>

      <div className='flex flex-col items-start'>
      <label className='pl-5' htmlFor="bookImage">Book Image</label>
      <input
        type='file'
        onChange={handleImageUpload}
        className='text-black border-2 border-gray-700 mb-6 mt-2 w-[30vh] md:w-[30vw] px-4 py-2 rounded-[2vw] max-sm:rounded-[6vw]'
        required
      />

      </div>

      <div className='flex flex-col items-start'>
        {/* <label className='pl-5' htmlFor="bookImage">Book Image Preview</label> */}
        {newBook.image && <Image src={newBook.image} width={500} height={350} alt="Book Image" className='mb-6 mt-2 w-[30vh] md:w-[30vw] rounded-[2vw] max-sm:rounded-[6vw]' />}
      </div>
          

      <Button variant="outline" onClick={handleAddBook}
      className='mt-2 border-2 px-5 border-gray-700 dark:border-white/[0.3] rounded-[2vw] max-sm:rounded-[6vw] hover:bg-blue-400 hover:text-white hover:border-none ease-linear duration-200'
      >Add</Button>

      
      <div className="w-full flex flex-col items-center justify-center mb-4 mt-8">
        {books.length > 0 &&
          <>
        <h2 className='mb-4 underline'>Book Details</h2>
        <Table className='text-base'>
          <TableHeader>
            <TableRow>
              <TableHead className='px-5'>Book Name</TableHead>
              <TableHead className='px-5'>Price</TableHead>
              <TableHead className='px-5'>Half Price</TableHead>
              <TableHead className='px-5'>Preview</TableHead>
              <TableHead className='px-5'>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {books.map((book, index) => (
              <TableRow key={index}>
                <TableCell className='px-5'>{book.name}</TableCell>
                <TableCell className='px-5'>{book.price}</TableCell>
                <TableCell className='px-5'>₹{book.halfPrice}</TableCell>
                <TableCell className='px-5'>
                  <Image src={book.image} width={50} height={50} alt='Book Image' className='rounded-md' />
                </TableCell>
                <TableCell>
                  <button onClick={() => handleDeleteBook(index)} className='text-red-500 underline text-sm px-3'>
                    remove
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        

      <div className='flex flex-col items-center justify-center'>
      <Button variant="outline" onClick={calculateAmount}
      className='border-2 px-5 border-gray-700 mb-8 mt-10 rounded-[2vw] max-sm:rounded-[6vw] hover:bg-blue-400 hover:text-white hover:border-none ease-linear duration-200'
      >Calculate Total</Button>
        {halfAmount > 0 && (
          <>
          <p className='flex px-5'>Total Amount:  <MdCurrencyRupee className='mt-1 ml-1'/>{totalAmount}</p>
          <p className='flex px-5'>50% Amount:  <MdCurrencyRupee className='mt-1 ml-1'/>{halfAmount}</p>
          </>
        )}
      </div>
      </>}
      </div>
    </div>
  );
}

export default BookSelection;
