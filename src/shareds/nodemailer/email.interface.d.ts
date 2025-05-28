import SMTPTransport from "nodemailer/lib/smtp-transport";


type EmailInterface = {
    sendMail(params: SendMailParams): Promise<SMTPTransport.SentMessageInfo>
    createVerificationEmail(verificationLink: string): string;
}
type SendMailParams = {
    to: string,
    subject: string,
    html: string,
}

