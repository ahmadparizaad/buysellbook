// File: /pages/api/otp/send.ts
import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";
import User from "@/models/userModel"; // Adjust based on your project structure
import {connect} from "@/dbConfig/dbConfig";
import bcryptjs from "bcryptjs";

connect()

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);

export async function POST(request: NextRequest, response: NextResponse) {
  const reqBody = await request.json()
  const { username, password, whatsappNumber } = reqBody;

  if (!whatsappNumber) {
    return NextResponse.json({error: "WhatsApp number is required"}, {status: 400});
  }

  try {
    // Check if user exists
    let user = await User.findOne({ whatsappNumber });
    if(user){
      return NextResponse.json({error: "User already exists"}, {status: 400})
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Only create new user if password and username are provided
    if (password && username) {
      //hash password
      const salt = await bcryptjs.genSalt(10)
      const hashedPassword = await bcryptjs.hash(password, salt)

      const newUser = new User({
          username,
          whatsappNumber,
          password: hashedPassword,
          verifyToken: otp,
          verifyTokenExpiry: Date.now() + 5 * 60 * 1000 // 5 minutes
      })

      await newUser.save()
      console.log("New user created:", user);
    }

    // Send OTP via WhatsApp
    await twilioClient.messages.create({
      from: process.env.TWILIO_WHATSAPP_NUMBER,
      to: `whatsapp:${whatsappNumber}`,
      body: `Your OTP code is: ${otp}. It will expire in 5 minutes.`,
    });

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
    
    fetch(`https://${process.env.COMETCHAT_APP_ID}.api-${process.env.COMETCHAT_REGION}.cometchat.io/v3/users`, options)
      .then(res => res.json())
      .then(res => console.log(res))
      .catch(err => console.error(err));

    return NextResponse.json({message: "OTP sent successfully"}, {status:200});
  } catch (error) {
    console.error("Error sending OTP:", error);
    return NextResponse.json({error: "Failed to send OTP" }, {status:500});
  }
}
