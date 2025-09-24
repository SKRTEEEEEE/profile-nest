import { Module } from '@nestjs/common';
import { EmailNodemailerRepo } from './email-nodemailer.repo';

@Module({
  providers: [EmailNodemailerRepo],
  exports: [EmailNodemailerRepo],
})
export class NodemailerModule {}
