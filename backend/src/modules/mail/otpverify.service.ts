import transporter from "../../config/mail.config";

export interface OtpEmailDetails {
  to: string;
  otp: string;
  userName?: string; // Optional: to personalize the greeting
}

export async function sendOtpEmail(details: OtpEmailDetails) {
  const mailOptions = {
    from: `"ElectroVision" <${process.env.MAIL_USER}>`,
    to: details.to,
    subject: `${details.otp} is your ElectroVision verification code`,
    html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Verify Your Registration</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; background-color: #f4f7f6;">
            <div style="width: 100%; max-width: 500px; margin: 40px auto; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.05);">
                
                <div style="background-color: #0d6efd; color: #ffffff; padding: 20px; text-align: center; border-top-left-radius: 8px; border-top-right-radius: 8px;">
                    <h2 style="margin: 0; font-size: 24px; letter-spacing: 1px;">ElectroVision</h2>
                </div>
                
                <div style="padding: 30px; color: #333333; line-height: 1.6; text-align: center;">
                    <h1 style="font-size: 22px; margin-bottom: 20px;">Verify Your Email</h1>
                    <p style="font-size: 16px; color: #555555;">
                        Hi ${details.userName || 'there'},<br>
                        Thank you for joining ElectroVision! Please use the following code to complete your registration.
                    </p>
                    
                    <div style="margin: 30px 0; padding: 20px; background-color: #f8f9fa; border-radius: 8px; border: 1px dashed #0d6efd;">
                        <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #0d6efd;">
                            ${details.otp}
                        </span>
                    </div>

                    <p style="font-size: 14px; color: #777777;">
                        This code is valid for <strong>10 minutes</strong>. <br>
                        If you didn't request this code, you can safely ignore this email.
                    </p>
                    
                    <hr style="border: 0; border-top: 1px solid #eeeeee; margin: 30px 0;">
                    
                    <p style="font-size: 14px; color: #333333;">
                        Best regards,<br>
                        <strong>The ElectroVision Team</strong>
                    </p>
                </div>

                <div style="background-color: #f4f7f6; padding: 20px; text-align: center; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px; font-size: 12px; color: #777777;">
                    <p>&copy; ${new Date().getFullYear()} ElectroVision. All Rights Reserved.</p>
                </div>

            </div>
        </body>
        </html>
      `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`OTP email sent successfully to ${details.to}`);
  } catch (error: any) {
    console.error(`Error sending OTP email to ${details.to}:`, error);
    throw new Error("Failed to send verification email.");
  }
}