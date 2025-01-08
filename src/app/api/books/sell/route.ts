import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import User from "@/models/userModel";
import Book from "@/models/bookModel";

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

    // Update user data with the request body
       // Create a new Book instance
       const newBook = new Book({
        userId: userId,
        course: course,
        std: std,
        year: year,
        semester: semester,
        isSet: isSet,
        books: books,
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
      console.log(error.message);
      return NextResponse.json({
        error: error.message,
      }, { status: 500 });
    }
  }