const brand = {
    bg: '#0A0A0A',
    panel: '#141414',
    text: '#F7F7F2',
    muted: '#A3A3A3',
    accent: '#D4FF4F',
};

const currentYear = new Date().getFullYear();

function escapeHtml(value: string): string {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function renderButton(label: string, href: string): string {
    return `
        <a href="${escapeHtml(href)}" style="display:inline-block;background:${brand.accent};color:${brand.bg};font-weight:700;text-decoration:none;padding:14px 18px;border-radius:8px;margin-top:18px;">
            ${escapeHtml(label)}
        </a>
    `;
}

function renderLayout(title: string, body: string): string {
    const unsubscribeUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/unsubscribe`;

    return `
        <!doctype html>
        <html>
            <head>
                <meta charset="utf-8" />
                <meta name="viewport" content="width=device-width,initial-scale=1" />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />
                <title>${escapeHtml(title)}</title>
            </head>
            <body style="margin:0;background:${brand.bg};font-family:Inter,Arial,sans-serif;color:${brand.text};">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:${brand.bg};padding:32px 16px;">
                    <tr>
                        <td align="center">
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:${brand.panel};border:1px solid #242424;border-radius:14px;overflow:hidden;">
                                <tr>
                                    <td style="padding:28px 28px 8px;">
                                        <div style="font-size:13px;letter-spacing:0.08em;text-transform:uppercase;color:${brand.accent};font-weight:700;">CreatorLyff</div>
                                        <h1 style="font-size:28px;line-height:1.2;margin:18px 0 0;color:${brand.text};">${escapeHtml(title)}</h1>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding:8px 28px 30px;font-size:16px;line-height:1.7;color:${brand.text};">
                                        ${body}
                                    </td>
                                </tr>
                            </table>
                            <div style="max-width:560px;color:${brand.muted};font-size:12px;line-height:1.6;margin:18px auto 0;text-align:center;">
                                <div>&copy; ${currentYear} CreatorLyff. All rights reserved.</div>
                                <a href="${escapeHtml(unsubscribeUrl)}" style="color:${brand.muted};">Unsubscribe</a>
                            </div>
                        </td>
                    </tr>
                </table>
            </body>
        </html>
    `;
}

function paragraph(text: string): string {
    return `<p style="margin:16px 0;color:${brand.text};">${escapeHtml(text)}</p>`;
}

export function welcomeEmail(name: string, role: string): string {
    return renderLayout(
        'Welcome to CreatorLyff',
        `${paragraph(`Hi ${name}, your ${role} account is ready.`)}
        ${paragraph('CreatorLyff helps creators and brands build clean, high-signal collaborations from discovery to payment.')}
        ${renderButton('Open CreatorLyff', process.env.FRONTEND_URL || 'http://localhost:3000')}`
    );
}

export function verifyEmail(name: string, verificationLink: string): string {
    return renderLayout(
        'Verify your email',
        `${paragraph(`Hi ${name}, confirm your email address to finish setting up CreatorLyff.`)}
        ${renderButton('Verify email', verificationLink)}`
    );
}

export function passwordResetEmail(name: string, resetLink: string): string {
    return renderLayout(
        'Reset your password',
        `${paragraph(`Hi ${name}, use the secure link below to reset your CreatorLyff password.`)}
        ${paragraph('If you did not request this, you can safely ignore this email.')}
        ${renderButton('Reset password', resetLink)}`
    );
}

export function proposalReceivedEmail(creatorName: string, brandName: string, proposalTitle: string, ctaLink: string): string {
    return renderLayout(
        'New collaboration proposal',
        `${paragraph(`Hi ${creatorName}, ${brandName} sent you a new proposal: ${proposalTitle}.`)}
        ${paragraph('Review the brief, budget, deliverables, and timeline before you respond.')}
        ${renderButton('View proposal', ctaLink)}`
    );
}

export function proposalAcceptedEmail(brandName: string, creatorName: string, proposalTitle: string, ctaLink: string): string {
    return renderLayout(
        'Proposal accepted',
        `${paragraph(`Hi ${brandName}, ${creatorName} accepted your proposal: ${proposalTitle}.`)}
        ${paragraph('You can now continue the collaboration conversation in CreatorLyff.')}
        ${renderButton('Open proposal', ctaLink)}`
    );
}

export function proposalDeclinedEmail(brandName: string, creatorName: string, proposalTitle: string, ctaLink: string): string {
    return renderLayout(
        'Proposal declined',
        `${paragraph(`Hi ${brandName}, ${creatorName} declined your proposal: ${proposalTitle}.`)}
        ${paragraph('You can review the proposal details or discover another creator for this campaign.')}
        ${renderButton('View proposal', ctaLink)}`
    );
}

export function verificationApprovedEmail(creatorName: string, ctaLink: string): string {
    return renderLayout(
        'Verification approved',
        `${paragraph(`Hi ${creatorName}, your CreatorLyff verification has been approved.`)}
        ${paragraph('Your profile now has a stronger trust signal for brand collaborations.')}
        ${renderButton('View profile', ctaLink)}`
    );
}

export function verificationRejectedEmail(creatorName: string, ctaLink: string): string {
    return renderLayout(
        'Verification needs attention',
        `${paragraph(`Hi ${creatorName}, we could not approve your verification with the current details.`)}
        ${paragraph('Please review your profile and submit updated information when you are ready.')}
        ${renderButton('Update profile', ctaLink)}`
    );
}

export function newMessageEmail(receiverName: string, senderName: string, messagePreview: string, conversationLink: string): string {
    return renderLayout(
        'New message on CreatorLyff',
        `${paragraph(`Hi ${receiverName}, ${senderName} sent you a message.`)}
        ${paragraph(messagePreview)}
        ${renderButton('View conversation', conversationLink)}`
    );
}
