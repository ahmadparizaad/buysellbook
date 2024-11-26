import { NextRequest, NextResponse } from "next/server";
import {connect} from "@/dbConfig/dbConfig";
import Book from "@/models/bookModel";
import User from "@/models/userModel";

connect();

export async function GET(request: NextRequest, response: NextResponse) {
  if (request.method === "GET") {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get("query") || ""; // Get the search query from the URL
  
        // Find users matching the search query based on city or college
        const users = await User.find({
          $or: [
            { college: { $regex: query, $options: 'i' } },
            { city: { $regex: query, $options: 'i' } }
          ]
        }).select('_id'); // Get user IDs matching the search
  
        // If users are found, filter books by their IDs
        const userIds = users.map(user => user._id);
        const books = await Book.find(userIds.length > 0 ? { userId: { $in: userIds } } : {}).populate('userId', 'username college city');  

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