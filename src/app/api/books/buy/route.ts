import { NextRequest, NextResponse } from "next/server";
import Book from "@/models/bookModel";
import User from "@/models/userModel";
import { connect } from "@/dbConfig/dbConfig";

connect()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const searchType = searchParams.get('searchType');
    const query = searchParams.get('query');
    const course = searchParams.get('course');
    const std = searchParams.get('std');
    const year = searchParams.get('year');
    const semester = searchParams.get('semester');

    // Build book filter
    const bookFilter: any = {};
    if (course) bookFilter.course = course;
    if (std) bookFilter.std = std;
    if (year) bookFilter.year = year;
    if (semester) bookFilter.semester = semester;

    // Handle search
    let matchingUserIds = [];
    if (query && (searchType === 'city' || searchType === 'college' || searchType === 'university')) {
      const userFilter = {
        [searchType]: { $regex: query, $options: 'i' }
      };
      const matchingUsers = await User.find(userFilter).select('_id');
      matchingUserIds = matchingUsers.map(user => user._id);
      bookFilter.userId = { $in: matchingUserIds };
    } else if (query && searchType === 'books') {
      bookFilter['books.name'] = { $regex: query, $options: 'i' };
    }

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Fetch filtered books with user details
    const books = await Book.aggregate([
      { $match: bookFilter },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'seller'
        }
      },
      { $unwind: '$seller' },
      {
        $project: {
          _id: 1,
          course: 1,
          std: 1,
          year: 1,
          semester: 1,
          isSet: 1,
          books: 1,
          userId: 1,
          'seller.city': 1,
          'seller.college': 1,
          'seller.university': 1,
          'seller.name': 1,
          totalPrice: 1
        }
      }
    ]);

    return NextResponse.json({
      message: "Books retrieved successfully",
      books: books
    });
  } catch (error: any) {
    console.error("Error fetching books:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
