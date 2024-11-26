import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import { connect } from "@/dbConfig/dbConfig";

connect();

export async function POST(request:NextRequest){

    try {
        const reqBody = await request.json()
        const {userId} = reqBody;
        console.log(reqBody);
        const user = await User.findById(userId);
        const username = user.username;
        return NextResponse.json({
            message: "Username found",
            data: username,
        })
    } catch (error:any) {
        return NextResponse.json({error: error.message}, {status: 400});
    }

}