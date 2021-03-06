import { createTransport, SentMessageInfo } from 'nodemailer';

import { config } from '../../../config';

const Email = require('email-templates');

export async function mail(template: string, recipient: string, data: any): Promise<SentMessageInfo> {
    const transporter = createTransport({
        host: config.mail.host,
        port: config.mail.port,
        secure: config.mail.secure,
        auth: {
            user: config.mail.user,
            pass: config.mail.password
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    const message = await renderTemplate(template, data);

    return transporter.sendMail({
        from: config.mail.from,
        to: recipient,
        subject: message.subject,
        text: message.text,
        html: message.html
    });
}

export function renderTemplate(path: string, data: any): Promise<RenderedMessage> {

    const email = new Email({
        htmlToText: false,
        views: { root: config.mail.templatesDir },
        juice: true,
        juiceResources: {
            preserveImportant: true,
            webResources: {
                relativeTo: config.mail.templatesDir,
                images: true
            }
        },
        i18n: {}
    });

    return email.renderAll(path, {
        ...data,
        __: function (key: string) {
            return '-- ' + key + '(' + data.locale + ') --';
        }
    });
}

export class RenderedMessage {
    subject: string;
    text: string;
    html: string;
}
