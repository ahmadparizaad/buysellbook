import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";
import Book from "@/models/bookModel";
import { connect } from "@/dbConfig/dbConfig";

connect();

export async function GET(request:NextRequest){
    try {
        const userId = await getDataFromToken(request);
        const books = await Book.find({userId: userId});
        return NextResponse.json({
            message: "Listed Books",
            data: books,
        })
    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 400});
    }
}