import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import nodemailer from "nodemailer";

// Create a transporter for sending emails
var transporter = nodemailer.createTransport({
    host: "live.smtp.mailtrap.io",
    port: 587,
    auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASS
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
        const { name, email, description, attachment, captchaToken } = reqBody;
        // console.log("request body : ", reqBody);
        
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
        console.log("Email format verified");
        

        // Verify captcha
        const isCaptchaValid = await verifyCaptcha(captchaToken);
        if (!isCaptchaValid) {
            return NextResponse.json(
                { error: "Invalid captcha" },
                { status: 400 }
            );
        }
        console.log("Captcha verified");
        

        // Email content
        const mailOptions = {
            from: process.env.EMAIL_USER, // Your email address
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
        try{
        await transporter.sendMail(mailOptions);
        console.log("Email sent");
        
        } catch (error) {
            console.error("Error sending email:", error);
            return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
        }
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
