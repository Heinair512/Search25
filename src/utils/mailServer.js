import { nanoid } from 'nanoid';

// Store for one-time passwords and reset tokens
const otpStore = new Map();
const resetTokenStore = new Map();

export const mailServer = {
  // Generate and store OTP for a user
  generateOTP(email) {
    const otp = nanoid(6).toUpperCase();
    otpStore.set(email, {
      otp,
      createdAt: new Date(),
      attempts: 0
    });
    return otp;
  },

  // Verify OTP
  verifyOTP(email, otp) {
    const stored = otpStore.get(email);
    if (!stored) return false;

    // Check if too many attempts
    if (stored.attempts >= 3) {
      otpStore.delete(email);
      return false;
    }

    stored.attempts++;
    
    if (stored.otp === otp) {
      otpStore.delete(email);
      return true;
    }
    
    return false;
  },

  // Generate password reset token
  generateResetToken(email) {
    const token = nanoid(32);
    resetTokenStore.set(token, {
      email,
      createdAt: new Date()
    });
    return token;
  },

  // Verify reset token
  verifyResetToken(token) {
    const stored = resetTokenStore.get(token);
    if (!stored) return null;
    
    // Check if token is expired (valid for 24 hours)
    const now = new Date();
    const expired = now - stored.createdAt > 24 * 60 * 60 * 1000;
    
    if (expired) {
      resetTokenStore.delete(token);
      return null;
    }
    
    return stored.email;
  },

  // Send invitation email (simulated)
  async sendInvitation(email, otp) {
    console.log(`
      To: ${email}
      Subject: Welcome to Search25!
      
      You have been invited to join Search25. To complete your registration,
      please use the following one-time password:
      
      ${otp}
      
      This code will not expire.
      
      Best regards,
      The Search25 Team
    `);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return true;
  },

  // Send password reset email (simulated)
  async sendPasswordReset(email, token) {
    const resetUrl = `${window.location.origin}/reset-password/${token}`;
    
    console.log(`
      To: ${email}
      Subject: Reset Your Search25 Password
      
      You have requested to reset your password. Please click the link below
      to set a new password:
      
      ${resetUrl}
      
      This link will expire in 24 hours.
      
      If you didn't request this, please ignore this email.
      
      Best regards,
      The Search25 Team
    `);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return true;
  }
};