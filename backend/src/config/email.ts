import { Resend } from 'resend';

export interface SendEmailInput {
    to: string | string[];
    subject: string;
    html: string;
    text?: string;
}

export const emailFrom = process.env.EMAIL_FROM || 'CreatorLyff <support.creatorlyff@gmail.com>';
export const isResendConfigured = Boolean(process.env.RESEND_API_KEY);
export const resend = isResendConfigured ? new Resend(process.env.RESEND_API_KEY) : null;

export async function sendEmail({ to, subject, html, text }: SendEmailInput) {
    if (!resend) {
        console.warn('RESEND_API_KEY missing. Email skipped:', subject);
        return { success: false, skipped: true, error: 'RESEND_API_KEY missing' };
    }

    const { data, error } = await resend.emails.send({
        from: emailFrom,
        to,
        subject,
        html,
        text,
    });

    if (error) {
        throw error;
    }

    return { success: true, data };
}
