# Adapter + Service

## 🧩 1. Interfaz (en `application/interfaces/email-sender.interface.ts`)

```ts
export interface EmailSender {
  sendEmail(to: string, subject: string, body: string): Promise<void>;
}
```

---

## 🏗️ 2. Adapter (en `infrastructure/adapters/nodemailer.adapter.ts`)

```ts
import nodemailer from 'nodemailer';
import { EmailSender } from 'src/application/interfaces/email-sender.interface';

export class NodemailerAdapter implements EmailSender {
  async sendEmail(to: string, subject: string, body: string): Promise<void> {
    const transporter = nodemailer.createTransport({
      host: 'smtp.example.com',
      port: 587,
      auth: {
        user: 'your_email@example.com',
        pass: 'your_password',
      },
    });

    await transporter.sendMail({
      from: '"Mi App 👋" <no-reply@example.com>',
      to,
      subject,
      text: body,
    });
  }
}
```

---

## 🧠 3. Service (en `application/usecases/user.service.ts`)

```ts
import { Injectable } from '@nestjs/common';
import { EmailSender } from '../interfaces/email-sender.interface';

@Injectable()
export class UserService {
  constructor(private readonly emailSender: EmailSender) {}

  async registerUser(email: string) {
    // lógica para crear usuario (omitada)

    await this.emailSender.sendEmail(
      email,
      'Bienvenido a Mi App 🎉',
      'Gracias por registrarte. ¡Disfruta!'
    );
  }
}
```

---

## 🧩 4. Módulo (en `infrastructure/modules/user.module.ts`)

```ts
import { Module } from '@nestjs/common';
import { UserService } from 'src/application/usecases/user.service';
import { EmailSender } from 'src/application/interfaces/email-sender.interface';
import { NodemailerAdapter } from '../adapters/nodemailer.adapter';

@Module({
  providers: [
    UserService,
    {
      provide: EmailSender, // 👈 token basado en interfaz
      useClass: NodemailerAdapter, // 👈 implementación concreta
    },
  ],
  exports: [UserService],
})
export class UserModule {}
```

---

## ✅ Resultado

* `UserService` no tiene idea de que Nodemailer existe.
* Puedes cambiar el adapter por otro (`ConsoleAdapter`, `SESAdapter`, etc.) sin tocar nada más.
* Estás cumpliendo con los principios de inversión de dependencias.

¿Quieres que te lo extienda para tener un adapter *mock* también y cambiarlo por entorno?
