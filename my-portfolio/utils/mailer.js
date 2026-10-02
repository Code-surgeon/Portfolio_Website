import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: process.env.EMAIL_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export async function sendTemporaryPassword(toEmail, tempPassword) {
    const mailOptions = {
        from: `"DevPortfolio Admin" <${process.env.EMAIL_USER}>`,
        to: toEmail,
        subject: "Your Temporary Admin Password",
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; background: #0f172a; color: #f8fafc; border-radius: 8px;">
                <h2 style="color: #818cf8;">Admin Access Request</h2>
                <p>A temporary password has been generated for your portfolio admin dashboard:</p>
                <div style="background: #1e293b; padding: 15px; font-size: 20px; font-weight: bold; letter-spacing: 2px; text-align: center; color: #34d399; margin: 20px 0; border-radius: 6px;">
                    ${tempPassword}
                </div>
                <p>Please log in to your admin dashboard immediately using this password and update it to your permanent password.</p>
                <p style="font-size: 12px; color: #94a3b8; margin-top: 30px;">If you did not request this, please ignore this email.</p>
            </div>
        `,
    };

    return await transporter.sendMail(mailOptions);
}