import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel"; // Adjust the import based on your project structure
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
    try {
        const { token, password } = await request.json();

        // Validate the token (you should implement your own logic here)
        const user = await User.findOne({ forgotPasswordToken: token, forgotPasswordTokenExpiry: { $gt: Date.now() } });
        if (!user) {
            return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword; // Update the user's password
        user.resetPasswordToken = undefined; // Clear the reset token
        await user.save();

        return NextResponse.json({ message: "Password reset successfully" });
    } catch (error: any) {
        console.error("Error resetting password:", error);
        return NextResponse.json({ error: "Failed to reset password" }, { status: 500 });
    }
} 