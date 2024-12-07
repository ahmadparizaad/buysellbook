import {connect} from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { sendEmail } from "@/helpers/mailer";
import { COMETCHAT_CONSTANTS } from "@/app/chat/const";
import axios from "axios";

connect()

async function verifyCaptcha(token: string) {
    try {
        const response = await axios.post(
            `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
            {},
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded; charset=utf-8"
                },
            }
        );
        return response.data.success;
    } catch (error) {
        console.error("Error verifying captcha:", error);
        return false;
    }
}

export async function POST(request: NextRequest){
    try {
        const reqBody = await request.json()
        const {username, email, password, captchaToken} = reqBody

        console.log(reqBody);

        // Verify captcha
        const isCaptchaValid = await verifyCaptcha(captchaToken);
        if (!isCaptchaValid) {
            return NextResponse.json(
                { error: "Invalid captcha" },
                { status: 400 }
            );
        }

        //check if user already exists
        const user = await User.findOne({email})

        if(user){
            return NextResponse.json({error: "User already exists"}, {status: 400})
        }

        //hash password
        const salt = await bcryptjs.genSalt(10)
        const hashedPassword = await bcryptjs.hash(password, salt)

        const newUser = new User({
            username,
            email,
            password: hashedPassword
        })

        const savedUser = await newUser.save()
        console.log(savedUser);

        //send verification email

        await sendEmail({email, emailType: "VERIFY", userId: savedUser._id})
        const options = {
            method: 'POST',
            headers: {
                accept: 'application/json', 
                'content-type': 'application/json',
                apikey: 'be5f7e2c78caa1bd70bcf08bbc24f560f8612e2f'
            },
            body: JSON.stringify(
                {
                    uid: username,
                    name: username,
                })
          };
          
          fetch(`https://${COMETCHAT_CONSTANTS.APP_ID}.api-${COMETCHAT_CONSTANTS.REGION}.cometchat.io/v3/users`, options)
            .then(res => res.json())
            .then(res => console.log(res))
            .catch(err => console.error(err));

        return NextResponse.json({
            message: "User registered successfully",
            success: true,
            savedUser
        })
        
        


    } catch (error: any) {
        return NextResponse.json({error: error.message}, 
        {status: 500})

    }
}