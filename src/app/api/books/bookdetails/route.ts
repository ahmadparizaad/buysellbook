import { NextRequest, NextResponse } from "next/server";
import Book from "@/models/bookModel";
import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";

connect();

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const reqBody = await request.json();
    const { id } = reqBody;

    if (!id) {
      return NextResponse.json(
        { error: "Book ID is required" },
        { status: 400 }
      );
    }

    // Find the book by ID
    const book = await Book.findById(id);

    if (!book) {
      return NextResponse.json(
        { error: "Book not found" },
        { status: 404 }
      );
    }

    console.log("Book:", book);

    const seller = await User.findById(book.userId);

    return NextResponse.json({
      message: "Book data fetched successfully",
      data: book,
      seller, 
    });
  } catch (error: any) {
    console.error("Error fetching book:", error);
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
