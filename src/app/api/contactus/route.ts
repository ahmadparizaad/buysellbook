import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import nodemailer from "nodemailer";

// Create a transporter for sending emails
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD // Use App Password if using Gmail
    }
});

async function verifyCaptcha(token: string) {
    try {
        const response = await axios.post(
            `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.CAPTCHA_SECRET_KEY}&response=${token}`,
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

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { name, email, description, captchaToken } = reqBody;

        // Input validation
        if (!name || !email || !description || !captchaToken) {
            return NextResponse.json(
                { error: "All fields are required" },
                { status: 400 }
            );
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: "Invalid email format" },
                { status: 400 }
            );
        }

        // Verify captcha
        const isCaptchaValid = await verifyCaptcha(captchaToken);
        if (!isCaptchaValid) {
            return NextResponse.json(
                { error: "Invalid captcha" },
                { status: 400 }
            );
        }

        // Email content
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.CONTACT_FORM_RECIPIENT, // Where you want to receive contact form submissions
            subject: `New Contact Form Submission from ${name}`,
            html: `
                <h2>New Contact Form Submission</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Message:</strong></p>
                <p>${description}</p>
            `
        };

        // Send email
        await transporter.sendMail(mailOptions);

        // Optional: Save to database if you want to keep records
        // await ContactForm.create({ name, email, message });

        return NextResponse.json(
            { message: "Message sent successfully" },
            { status: 200 }
        );

    } catch (error: any) {
        console.error("Contact form error:", error);
        return NextResponse.json(
            { error: "Failed to send message" },
            { status: 500 }
        );
    }
}
