import nodemailer from "nodemailer";

const transporter = nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || "587"),
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

/**
 * Send confirmation email for registration
 */
export async function sendConfirmationEmail(
    to: string,
    name: string,
    confirmationToken: string,
    type: "participant" | "volunteer" = "participant"
): Promise<void> {
    const confirmUrl = `${process.env.NEXT_PUBLIC_APP_URL}/${type === "volunteer" ? "volunteer/" : ""}confirm?token=${confirmationToken}`;

    const subject = type === "volunteer"
        ? "Confirm Your Volunteer Registration - Young Ministers Retreat"
        : "Confirm Your Registration - Young Ministers Retreat";

    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
                .button { display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; margin: 20px 0; }
                .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Welcome to Young Ministers Retreat!</h1>
                </div>
                <div class="content">
                    <p>Hi ${name},</p>
                    <p>Thank you for ${type === "volunteer" ? "volunteering with" : "registering for"} Young Ministers Retreat! We're excited to have you join us.</p>
                    <p>Please confirm your ${type === "volunteer" ? "volunteer application" : "registration"} by clicking the button below:</p>
                    <div style="text-align: center;">
                        <a href="${confirmUrl}" class="button">Confirm ${type === "volunteer" ? "Application" : "Registration"}</a>
                    </div>
                    <p>Or copy and paste this link into your browser:</p>
                    <p style="word-break: break-all; color: #10b981;">${confirmUrl}</p>
                    <p>This link will expire in 24 hours.</p>
                    <p>If you didn't ${type === "volunteer" ? "apply to volunteer" : "register"}, please ignore this email.</p>
                    <p>God bless,<br>The Young Ministers Retreat Team</p>
                </div>
                <div class="footer">
                    <p>Setting a generation on fire for Jesus</p>
                </div>
            </div>
        </body>
        </html>
    `;

    try {
        await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to,
            subject,
            html,
        });
        console.log(`✅ Confirmation email sent to ${to}`);
    } catch (error) {
        console.error("Email sending error:", error);
        throw new Error("Failed to send confirmation email");
    }
}

/**
 * Send welcome email after confirmation
 */
export async function sendWelcomeEmail(
    to: string,
    name: string,
    type: "participant" | "volunteer" = "participant"
): Promise<void> {
    const subject = type === "volunteer"
        ? "Welcome to the YMR Volunteer Team!"
        : "Welcome to Young Ministers Retreat!";

    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
                .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🎉 ${type === "volunteer" ? "Application Confirmed!" : "Registration Confirmed!"}</h1>
                </div>
                <div class="content">
                    <p>Hi ${name},</p>
                    <p>${type === "volunteer"
            ? "Your volunteer application has been confirmed! We'll review your application and get back to you soon with next steps."
            : "Your registration has been confirmed! We're thrilled to have you join us at Young Ministers Retreat."
        }</p>
                    <p>You can log in to your dashboard to view more details and updates.</p>
                    <p>We're looking forward to seeing you!</p>
                    <p>In Christ,<br>The Young Ministers Retreat Team</p>
                </div>
                <div class="footer">
                    <p>Setting a generation on fire for Jesus</p>
                </div>
            </div>
        </body>
        </html>
    `;

    try {
        await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to,
            subject,
            html,
        });
    } catch (error) {
        console.error("Welcome email error:", error);
    }
}
