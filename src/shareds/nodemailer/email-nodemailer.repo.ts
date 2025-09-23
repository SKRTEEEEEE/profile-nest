import { Injectable } from '@nestjs/common';
import { EmailInterface, SendMailParams } from './email.interface';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { createDomainError } from 'src/domain/flows/error.registry';
import { ErrorCodes } from 'src/domain/flows/error.type';
import { verificationEmailTemplate } from './verification-email-template';
import * as crypto from 'crypto';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailNodemailerRepo implements EmailInterface {
  private _transporter;
  private host = process.env.SMTP_HOST;
  private port = process.env.SMTP_PORT;
  private user = process.env.SMTP_USER;
  private pass = process.env.SMTP_PASS;

  private mFrom = process.env.SMTP_FROM_EMAIL;

  constructor() {
    this._transporter = this.initialize();
  }
  private initialize() {
    const smtpOptions: SMTPTransport.Options = {
      host: this.host,
      port: parseInt(this.port || '465', 10),
      auth: {
        user: this.user,
        pass: this.pass,
      },
    };
    return nodemailer.createTransport(smtpOptions);
  }
  protected get transporter() {
    return this._transporter;
  }

  async sendMail(
    params: SendMailParams,
  ): Promise<SMTPTransport.SentMessageInfo> {
    if (!this.mFrom)
      throw createDomainError(
        ErrorCodes.SET_ENV,
        EmailNodemailerRepo,
        'sendMail',
        undefined,
        { variable: 'SMTP_FROM_EMAIL' },
      );
    const mailOpt = { ...params, from: this.mFrom };
    return await this.transporter.sendMail(mailOpt);
  }
  createVerificationEmail(verificationLink: string): string {
    return verificationEmailTemplate(verificationLink);
  }
  private generateToken(): string {
    return crypto.randomBytes(20).toString('hex');
  }
  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }
  generateVerificationToken(): { hashedToken: string; expireDate: Date } {
    const verificationToken = this.generateToken();
    const hashedToken = this.hashToken(verificationToken);
    const expireDate = new Date(Date.now() + 30 * 60 * 1000);
    return {
      hashedToken,
      expireDate,
    };
  }
}
