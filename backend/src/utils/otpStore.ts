// Simple in-memory OTP store { email -> { otp, expiresAt, userData } }
// For production, use Redis instead

type OtpEntry = {
  otp: string;
  expiresAt: number;
  userData: { username: string; email: string; password: string };
};

// temporary storage
const otpStore = new Map<string, OtpEntry>();

export const saveOtp = (email: string, otp: string, userData: OtpEntry["userData"]) => {
  
  //email as key and otp, expiration, userinfo as value
  otpStore.set(email, {
    otp,
    expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
    userData,
  });
};

export const getOtp = (email: string) => otpStore.get(email);

export const deleteOtp = (email: string) => otpStore.delete(email);