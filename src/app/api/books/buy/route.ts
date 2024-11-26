import { NextRequest, NextResponse } from "next/server";
import Book from "@/models/bookModel";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { connect } from "@/dbConfig/dbConfig";

connect()

export async function GET(request: NextRequest, response: NextResponse) {
  if (request.method === "GET") {
    try {
      // Fetch all books from the database
     const books = await Book.find()

      // Return the list of books as JSON response
      return NextResponse.json({
        message: "Books retrieved successfully",
        books: books,
      });
    } catch (error: any) {
      console.error("Error fetching books:", error);
      return NextResponse.json({ error: "Internal Server Error" });
    }
  } else {
    return NextResponse.json({ error: "Method Not Allowed" });
  }
}
