import {connect} from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import axios from "axios";

connect()

async function verifyCaptcha(token: string) {
    try {
        console.log("Verifying captcha token:", token); // Debug log

        const response = await axios.post(
            `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
            {},
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded; charset=utf-8"
                },
            }
        );
        console.log("Captcha verification response:", response.data); // Debug log

        return response.data.success;
    } catch (error:any) {
        console.error("Detailed captcha verification error:", error.response?.data || error); // More detailed error
        return false;
    }
}

export async function POST(request: NextRequest){
    try {

        const reqBody = await request.json()
        const {email, password, captchaToken} = reqBody;
        console.log(reqBody);

        // Verify captcha
        const isCaptchaValid = await verifyCaptcha(captchaToken);
        if (!isCaptchaValid) {
            return NextResponse.json(
                { error: "Invalid captcha" },
                { status: 400 }
            );
        }

        //check if user exists
        const user = await User.findOne({email})
        if(!user){
            return NextResponse.json({error: "User does not exist"}, {status: 400})
        }
        console.log("user exists");
        
        
        //check if password is correct
        const validPassword = await bcryptjs.compare(password, user.password)
        if(!validPassword){
            return NextResponse.json({error: "Invalid password"}, {status: 400})
        }
        // Check if user is verified
        if(!user.isVerified){
            return NextResponse.json({error: "User is not verified"}, {status: 400})
        }
        
        //create token data
        const tokenData = {
            id: user._id,
            username: user.username,
            email: user.email
        }
        //create token
        const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, {expiresIn: "1d"})

        const response = NextResponse.json({
            message: "Login successful",
            success: true,
        })
        response.cookies.set("token", token, {
            httpOnly: true, 
            
        })
        return response;

    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}