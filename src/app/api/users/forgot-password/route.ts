import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel"; // Adjust the import based on your project structure
import { sendEmail } from "@/helpers/mailer"; // Import the sendEmail function

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();

        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ error: "User does not exist" }, { status: 404 });
        }

        // Send the forgot password email
        await sendEmail({ email, emailType: "RESET", userId: user._id });

        return NextResponse.json({ message: "Reset password email sent successfully" });
    } catch (error: any) {
        console.error("Error in forgot password:", error);
        return NextResponse.json({ error: "Failed to send reset password email" }, { status: 500 });
    }
} 