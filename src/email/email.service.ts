import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: 'smtp-mail.outlook.com',
      port: 587,
      secure: false,
      auth: {
        user: configService.get('EMAIL'),
        pass: configService.get('EMAIL_PASSWORD'),
      },
    });
  }

  async sendEmail(to: string, subject: string, message: string) {
    try {
      const mailOptions = {
        from: this.configService.get('EMAIL'),
        to,
        subject,
        html: message,
      };

      await this.transporter.sendMail(mailOptions);

      return {
        message: 'Email sent to ' + to,
        success: true,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
