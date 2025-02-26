import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import User from "@/models/userModel";
import Book from "@/models/bookModel";
import cloudinary from "@/lib/cloudinary";
import { connect } from "@/dbConfig/dbConfig";

connect();

export async function POST(request: NextRequest) {
  try {
    const userId = await getDataFromToken(request);
      // Destructure the request body
      const { course, std, year, semester, isSet, books, totalPrice } = await request.json();

      // Check if required fields are present
      if (!course || !isSet || !books) {
        return NextResponse.json({
          error: "Missing required fields",
        }, { status: 400 });
      }

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({
        error: "User not found",
      }, { status: 404 });
    }

    // Upload book images to Cloudinary
    const uploadedBooks = await Promise.all(
      books.map(async (book: any) => {
        if (book.image) {
          const uploadedResponse = await cloudinary.uploader.upload(book.image, {
            folder: "campusbook",
          });

          return { ...book, image: uploadedResponse.secure_url };
        }
        return book;
      })
    );

      console.log(uploadedBooks);
       // Create a new Book instance
       const newBook = new Book({
        userId: userId,
        course: course,
        std: std,
        year: year,
        semester: semester,
        isSet: isSet,
        books: uploadedBooks,
        totalPrice: totalPrice
      });
  
      // Save the new Book document
      const savedBook = await newBook.save();
  
      // Log the saved book to the console
      console.log(savedBook);
  
      // Return a success response with the new book details
      return NextResponse.json({
        message: "Book details uploaded successfully",
        success: true,
        newBook: savedBook, // Return the saved book details
      });
    } catch (error: any) {
      // Return an error response if an error occurs
      console.error("Server Error:", error);
      return NextResponse.json({
        error: error.message,
      }, { status: 500 });
    }
  }