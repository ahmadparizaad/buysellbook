'use client';

import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { FaBook, FaUser, FaMapMarkerAlt } from 'react-icons/fa';
import { IBook } from '@/components/interfaces/book';
import { User } from '@/components/interfaces/user';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

// import Carousel from "@/components/ui/carousel";

export default function BookDetails({params}: any) {
    const [book, setBook] = useState<IBook | undefined>();
    const [seller, setSeller] = useState<User>();
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();

    useEffect(() => {
      console.log(params);
      const fetchData = async () => {
        try {
            const res = await axios.post(`/api/books/bookdetails`, {id: params.id});
            setBook(res.data.data);
            setSeller(res.data.seller);
        }
        catch (error) {
            console.log(error);
        }
    }
      fetchData();
  }, [params]);

    const handleBuyClick = async (book: any) => {
      try{
        const userId = book.userId
        if (typeof window !== 'undefined') {
          const user = window.sessionStorage.getItem('user');
          if(user){
            const res = JSON.parse(user);
            if (userId === res._id) {
              toast.error("You cannot buy your own book.");
              return; // Prevent further execution
            }}}
  
      setIsLoading(true);
      // const receiverUid = await getRecieverUID(userId);
      // setRecieverUID(receiverUid);
      // Encode book details as URL parameters
      if (seller) {
        console.log(seller)
        console.log(seller.username)
        const queryParams = new URLSearchParams({
          reciever: seller.username
        }).toString();
    
        router.push(`/onechat?${queryParams}`);
      }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('An error occurred while fetching data.');
      } finally {
        setIsLoading(true);
      }
    };
    
  return (
    <div className="flex flex-col gap-5 p-5 md:px-16 mt-24">
      {/* <Carousel slides={book?.images} /> */}

      {/* Book Details and Total Price */}
      <div className="flex flex-col md:flex-row gap-5">
        {/* Book Details */}
        <div className="border border-gray-300 shadow-md rounded-2xl p-6 w-full md:w-2/3 bg-white">
          <h2 className="text-2xl font-bold mb-6 text-gray-700 flex items-center">
            <FaBook className="mr-2 text-blue-500" /> Book Details
          </h2>
          <div className="space-y-2 md:px-8">
          {book?.books.map((book, index) => (
            <div key={index} className="flex justify-between items-center">
                <p className="text-base md:text-lg px-2 font-medium text-gray-600">{book.name}</p>
                <p className="text-base md:text-lg px-2 font-semibold text-gray-800">₹{book.halfPrice}</p>
            </div>

            
            ))}

            

          </div>
        </div>

        {/* Total Price */}
        <div className="border border-gray-300 shadow-md rounded-2xl p-6 w-full md:w-1/3 bg-white flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-700">Total Price</h2>
          <p className="text-3xl font-extrabold text-blue-500 mb-6">₹{book?.totalPrice}</p>
          <button 
            onClick={() => handleBuyClick(book)}          
            className="bg-blue-500 bg-opacity-90 text-white px-6 py-3 rounded-full hover:bg-indigo-700 transition font-medium">
            Contact Seller
          </button>
        </div>
      </div>

      {/* Seller Details */}
      <div className="border border-gray-300 shadow-md rounded-2xl p-6 w-full md:w-2/3 bg-white">
        <h2 className="text-2xl font-bold mb-6 text-gray-700 flex items-center">
          <FaUser className="mr-2 text-blue-500" /> Seller Details
        </h2>
        <div className="space-y-2 px-2 text-base md:text-lg">
          <p className=" text-gray-600">
            <strong className="font-medium">Name:</strong> {seller?.name}
          </p>
          <p className=" text-gray-600">
            <strong className="font-medium">College:</strong> {seller?.college}
          </p>
          <p className=" text-gray-600">
            <strong className="font-medium">University:</strong> {seller?.university}
          </p>
          <p className=" text-gray-600 flex items-center">
            {/* <FaMapMarkerAlt className="mr-2 text-indigo-600" /> */}
            <strong className="font-medium">City: </strong> {seller?.city}
          </p>
        </div>
      </div>
    </div>
  );
}
