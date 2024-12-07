// File: /pages/api/otp/verify.ts
import { NextApiRequest, NextApiResponse } from "next";
import User from "@/models/userModel"; // Adjust based on your project structure
import {connect} from "@/dbConfig/dbConfig";

connect();

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { whatsappNumber, otp } = req.body;

  if (!whatsappNumber || !otp) {
    return res.status(400).json({ message: "WhatsApp number and OTP are required" });
  }

  try {
    // Find user by WhatsApp number
    const user = await User.findOne({ whatsappNumber });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if OTP is valid and not expired
    if (
      user.verifyToken !== otp ||
      !user.verifyTokenExpiry ||
      user.verifyTokenExpiry < Date.now()
    ) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Mark user as verified
    user.isVerified = true;
    user.verifyToken = undefined; // Clear OTP
    user.verifyTokenExpiry = undefined; // Clear expiration
    await user.save();

    return res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return res.status(500).json({ message: "Failed to verify OTP" });
  }
}
