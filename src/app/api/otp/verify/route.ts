// File: /pages/api/otp/verify.ts
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel"; // Adjust based on your project structure
import {connect} from "@/dbConfig/dbConfig";

connect();

export async function POST(request: NextRequest, response: NextResponse) {  
  const reqBody = await request.json()
  const { whatsappNumber, otp } = reqBody;

  if (!whatsappNumber || !otp) {
    return NextResponse.json({ error: "WhatsApp number and OTP are required" }, { status: 400 });
  }

  try {
    // Find user by WhatsApp number
    const user = await User.findOne({ whatsappNumber });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Check if OTP is valid and not expired
    if (
      user.verifyToken !== otp ||
      !user.verifyTokenExpiry ||
      user.verifyTokenExpiry < Date.now()
    ) {
      return NextResponse.json({ message: "Invalid or expired OTP" }, { status: 400 });
    }

    // Mark user as verified
    user.isVerified = true;
    user.verifyToken = undefined; // Clear OTP
    user.verifyTokenExpiry = undefined; // Clear expiration
    await user.save();

    return NextResponse.json({ message: "OTP verified successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return NextResponse.json({ message: "Failed to verify OTP" }, { status: 500 });
  }
}
