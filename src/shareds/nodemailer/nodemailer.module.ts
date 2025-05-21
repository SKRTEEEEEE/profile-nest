import { Module } from "@nestjs/common";
import { EmailNodemailerRepository } from "./email-nodemailer.repo";

@Module({
    providers: [
        EmailNodemailerRepository,
    ],
    exports: [
        EmailNodemailerRepository
    ]
})
export class NodemailerModule{}