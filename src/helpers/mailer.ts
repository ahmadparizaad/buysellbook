import nodemailer from 'nodemailer';
import User from "@/models/userModel";
import bcryptjs from 'bcryptjs';


export const sendEmail = async({email, emailType, userId}:any) => {
    try {
        // create a hased token
        const hashedToken = await bcryptjs.hash(userId.toString(), 10)

        if (emailType === "VERIFY") {
            await User.findByIdAndUpdate(userId, 
                {verifyToken: hashedToken, verifyTokenExpiry: Date.now() + 3600000})
        } else if (emailType === "RESET"){
            await User.findByIdAndUpdate(userId, 
                {forgotPasswordToken: hashedToken, forgotPasswordTokenExpiry: Date.now() + 3600000})
        }

        var transport = nodemailer.createTransport({
            host: "live.smtp.mailtrap.io",
            port: 587,
            auth: {
              user: "api",
              pass: "2e2bc7f82229700f9ab42ee1d33fc92b"
            }
          });


        const mailOptions = {
            from: 'ma1251373@gmail.com',
            to: email,
            subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password",
            html: `
            <div style="max-width: 600px; margin: auto; padding: 20px; background-color: #f9f9f9; border: 1px solid #ddd; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <h2 style="color: #333; margin-top: 0;">${emailType === "VERIFY" ? "Verify Your Email" : "Reset Your Password"}</h2>
                <p style="margin-bottom: 20px;">To ${emailType === "VERIFY" ? "verify your email" : "reset your password"}, click the link below:</p>
                <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}" style="display: inline-block; background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 20px; font-weight: bold;">${emailType === "VERIFY" ? "Verify Email" : "Reset Password"}</a>
                <p style="margin-top: 20px;">Or, copy and paste the link below into your browser:</p>
                <p style="background-color: #f0f0f0; padding: 10px; border-radius: 5px; margin-bottom: 20px;">${process.env.DOMAIN}/verifyemail?token=${hashedToken}</p>
                <p style="color: #999;">If you have any questions or concerns, please don't hesitate to reach out.</p>
            </div>
            `
        }

        const mailresponse = await transport.sendMail
        (mailOptions);
        return mailresponse;

    } catch (error:any) {
        throw new Error(error.message);
    }
}