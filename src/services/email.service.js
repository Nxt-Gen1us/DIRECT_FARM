class EmailService {
  async sendVerificationEmail(email, token) {
    console.log(`Sending verification email to ${email} with token ${token}`);
    // TODO: integrate real email provider (SendGrid, SES)
  }

  async sendPasswordReset(email, token) {
    console.log(`Sending password reset email to ${email} with token ${token}`);
    // TODO: integrate real email provider
  }

  async sendOtp(email, otp) {
    console.log(`Sending OTP to ${email}: ${otp}`);
    // TODO: integrate SMS/Email provider for OTP
  }
}

export default new EmailService();
