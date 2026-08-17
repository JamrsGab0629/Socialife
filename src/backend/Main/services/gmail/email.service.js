import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendVerificationEmail = async (recipientEmail, otpCode) => {
    try {
        const mailOptions = {
            from: `"Socialife" <${process.env.EMAIL_USER}>`,
            to: recipientEmail,
            subject: "Your Socialife Verification Code",
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                    <h2>Welcome to Socialife!</h2>
                    <p>Please use the verification code below to complete your registration:</p>
                    <div style="background: #f4f4f4; padding: 15px; font-size: 24px; font-weight: bold; text-align: center; letter-spacing: 5px; border-radius: 5px;">
                        ${otpCode}
                    </div>
                    <p style="margin-top: 20px; font-size: 12px; color: #777;">
                        This code will expire in 5 minutes. If you didn't request this, please ignore this email.
                    </p>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);
        console.log(`[EMAIL] OTP sent successfully to ${recipientEmail}`);
    } catch (error) {
        console.error("[EMAIL ERROR] Failed to send OTP:", error);
        throw new Error("Failed to send verification email");
    }
};