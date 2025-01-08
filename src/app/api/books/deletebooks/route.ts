import { NextRequest, NextResponse } from "next/server";
import Book from "@/models/bookModel";
import { connect } from "@/dbConfig/dbConfig";

connect();

export async function DELETE(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { bookId } = reqBody;

        if (!bookId) {
            return NextResponse.json({ error: "Book ID is required" }, { status: 400 });
        }

        const deletedBook = await Book.findByIdAndDelete(bookId);

        if (!deletedBook) {
            return NextResponse.json({ error: "Book not found" }, { status: 404 });
        }

        return NextResponse.json({
            message: "Book deleted successfully",
            data: deletedBook,
        }, { status: 200 });
    } catch (error: any) {
        console.error("Error deleting book:", error.message);
        return NextResponse.json({ error: "Failed to delete book" }, { status: 500 });
    }
}