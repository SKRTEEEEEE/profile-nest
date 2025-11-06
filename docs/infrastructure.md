# Infrastructure Layer

## 📋 Descripción

La capa de **Infrastructure** contiene las implementaciones concretas de los contratos definidos en la capa de Application. Esta capa se encarga de la comunicación con servicios externos como bases de datos, APIs de terceros, sistemas de archivos, etc.

**Responsabilidades principales:**
- Implementar interfaces de repositorio definidas en Application
- Gestionar conexiones con bases de datos
- Integrar servicios externos (email, storage, APIs)
- Transformar datos entre formatos de dominio y persistencia
- Manejar detalles técnicos de comunicación externa

---

## 🏗️ Estructura

```
modules/<entity>/infrastructure/
├── <entity>.repo.ts           # Repositorio principal
├── <entity>.schema.ts         # Schema de Mongoose
└── <entity>-<service>/        # Implementaciones específicas (opcional)
    ├── create.repo.ts
    ├── update.repo.ts
    └── delete.repo.ts
```

**Ejemplo:**
```
modules/tech/infrastructure/
├── tech.repo.ts               # MongooseTechRepo
├── tech.schema.ts             # TechSchema (Mongoose)
├── delete.repo.ts             # DeleteRepoImpl
└── tech-octokit/              # Integraciones con Octokit
    ├── create.repo.ts
    ├── update.repo.ts
    └── actualizar.repo.ts
```

---

## 🗄️ Repositorios

### Implementación Base

Los repositorios implementan las interfaces definidas en la capa de Application y extienden implementaciones base reutilizables.

```typescript
// infrastructure/<entity>.repo.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MongooseCRUImpl } from 'src/shareds/pattern/infrastructure/implementations/cru.impl';
import { UserRepository } from '../application/user.interface';

@Injectable()
export class MongooseUserRepo 
  extends MongooseCRUImpl<UserBase> 
  implements UserRepository 
{
  constructor(@InjectModel('User') userModel: Model<UserDocument>) {
    super(userModel);
  }

  // Métodos específicos de User
  async findByEmail(email: string): Promise<UserBase & DBBase | null> {
    try {
      const document = await this.Model.findOne({ email });
      return document ? this.documentToPrimary(document) : null;
    } catch (error) {
      throw createDomainError(
        ErrorCodes.DATABASE_FIND,
        MongooseUserRepo,
        'findByEmail',
        undefined,
        { optionalMessage: `Failed to find user by email: ${email}` }
      );
    }
  }
}
```

---

## 🔧 Patrones Reutilizables

### MongooseCRUImpl

Implementación base para operaciones CRUD con Mongoose.

**Ubicación:** `shareds/pattern/infrastructure/implementations/cru.impl.ts`

```typescript
export class MongooseCRUImpl<TBase> extends MongooseBaseImpl<TBase> {
  async create(data: Omit<TBase, 'id'>): Promise<TBase & DBBase>
  async readById(id: string): Promise<TBase & DBBase>
  async updateById(props: MongooseUpdateByIdProps<TBase>): Promise<TBase & DBBase>
}
```

**Uso:**
```typescript
@Injectable()
export class MongooseUserRepo extends MongooseCRUImpl<UserBase> {
  constructor(@InjectModel('User') userModel: Model<UserDocument>) {
    super(userModel);
  }
  // Hereda: create, readById, updateById
}
```

### MongoosePopulateImpl

Implementación base para operaciones con populate de Mongoose.

**Ubicación:** `shareds/pattern/infrastructure/implementations/populate.impl.ts`

```typescript
export class MongoosePopulateImpl<TBase> extends MongooseCRUImpl<TBase> {
  async read(filter?: Partial<TBase>): Promise<(TBase & DBBase)[]>
  async readOne(filter: Record<string, any>): Promise<TBase & DBBase>
}
```

---

## 📊 Schemas de Mongoose

Los schemas definen la estructura de datos en MongoDB.

```typescript
// infrastructure/<entity>.schema.ts
import { Schema } from 'mongoose';
import { UserBase } from 'src/domain/entities/user';
import { IntlSchema } from 'src/shareds/pattern/infrastructure/schemas/intl.schema';

export const UserSchema = new Schema<UserBase>(
  {
    address: { type: String, required: true, unique: true },
    email: { type: String, required: false },
    name: IntlSchema,
    bio: IntlSchema,
    role: { type: Schema.Types.ObjectId, ref: 'Role' },
    isVerified: { type: Boolean, default: false },
    verifyToken: { type: String, required: false },
    verifyTokenExpire: { type: Date, required: false },
  },
  {
    timestamps: true,
    collection: 'users',
  }
);

export interface UserDocument extends UserBase, Document {}
```

### Schema Reutilizable: IntlSchema

Para campos multiidioma:

```typescript
// shareds/pattern/infrastructure/schemas/intl.schema.ts
export const IntlSchema = new Schema(
  {
    es: { type: String, required: false },
    en: { type: String, required: false },
    ca: { type: String, required: false },
    de: { type: String, required: false },
  },
  { _id: false }
);
```

---

## 🔌 Servicios Externos (Shared Repositories)

### Nomenclatura

Los repositorios de servicios externos (no entidades) usan el sufijo `.repo.ts`:

```
shareds/<service>/infrastructure/
└── <service>.repo.ts
```

**Ejemplos:**
- `shareds/nodemailer/email-nodemailer.repo.ts`
- `shareds/octokit/infrastructure/octokit.service.ts`
- `shareds/thirdweb/auth-thirdweb.repo.ts`

### Ejemplo: Email Repository

```typescript
// shareds/nodemailer/email-nodemailer.repo.ts
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { EmailInterface } from './email.interface';

@Injectable()
export class EmailNodemailerRepo implements EmailInterface {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransporter({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async send(options: EmailOptions): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: options.to,
        subject: options.subject,
        html: options.html,
      });
    } catch (error) {
      throw createDomainError(
        ErrorCodes.SHARED_ACTION,
        EmailNodemailerRepo,
        'send',
        'd',
        { shortDesc: 'Failed to send email' }
      );
    }
  }
}
```

---

## ⚠️ Mejores Prácticas

### 1. **Gestión de Errores**

🧠 **IMPORTANTE:** Envolver todos los métodos con try-catch y lanzar errores de dominio.

✅ **CORRECTO:**
```typescript
async readById(id: string): Promise<User & DBBase> {
  try {
    const document = await this.Model.findById(id);
    if (!document) {
      throw createDomainError(
        ErrorCodes.DATABASE_FIND,
        MongooseUserRepo,
        'Model.findById',
        undefined,
        { optionalMessage: 'User not found' }
      );
    }
    return this.documentToPrimary(document);
  } catch (error) {
    throw createDomainError(
      ErrorCodes.DATABASE_FIND,
      MongooseUserRepo,
      'readById',
      undefined,
      { optionalMessage: error.message }
    );
  }
}
```

❌ **INCORRECTO:**
```typescript
async readById(id: string): Promise<User & DBBase> {
  // 🔴 Sin try-catch, los errores de Mongoose se propagan sin procesar
  const document = await this.Model.findById(id);
  return this.documentToPrimary(document);
}
```

### 2. **Inyección de Dependencias**

🐐 **IMPORTANTE:** Las capas finales (Mongoose/Entities, Shared) **NO necesitan** usar services en el constructor, ya que utilizamos inyección de dependencias. De lo contrario, se crea un error de inyección circular.

✅ **CORRECTO:**
```typescript
@Injectable()
export class MongooseUserRepo extends MongooseCRUImpl<UserBase> {
  constructor(
    @InjectModel('User') private readonly userModel: Model<UserDocument>
  ) {
    super(userModel);
  }
}
```

❌ **INCORRECTO:**
```typescript
@Injectable()
export class MongooseUserRepo {
  constructor(
    private readonly userModel: Model<UserDocument>,
    private readonly emailService: EmailService // 🔴 Inyección circular!
  ) {}
}
```

### 3. **Transformación de Datos**

Usar `documentToPrimary()` para convertir documentos de Mongoose a entidades de dominio:

```typescript
protected documentToPrimary(document: TBase & MongooseDocument): TBase & DBBase {
  return {
    ...document.toObject(),
    id: document._id.toString(),
  };
}
```

### 4. **Validación en Schema vs Domain**

❌ **INCORRECTO:** Validación de negocio en schema de Mongoose
```typescript
const UserSchema = new Schema({
  age: { 
    type: Number, 
    validate: { // 🔴 Lógica de negocio en Infrastructure
      validator: (v) => v >= 18,
      message: 'User must be 18 or older'
    }
  }
});
```

✅ **CORRECTO:** Validación técnica en schema, lógica de negocio en Domain
```typescript
// infrastructure/user.schema.ts
const UserSchema = new Schema({
  age: { type: Number, required: true } // ✅ Solo validación técnica
});

// domain/entities/user.type.ts
class User {
  setAge(age: number): void {
    if (age < 18) { // ✅ Lógica de negocio en Domain
      throw new InvalidAgeError();
    }
    this.age = age;
  }
}
```

---

## 🔄 Flujo de Datos en Infrastructure

```
UseCase → Repository → Mongoose Model → MongoDB
           ↓
      Transform Data
    (Domain ↔ Database)
```

**Ejemplo completo:**

```typescript
// 1. UseCase llama al repositorio
const user = await this.userRepository.create({
  email: 'test@example.com',
  address: '0x...'
});

// 2. Repository crea documento de Mongoose
async create(data: Omit<UserBase, 'id'>): Promise<User & DBBase> {
  try {
    const document = new this.Model(data);
    const saved = await document.save();
    return this.documentToPrimary(saved); // Transforma a entidad de dominio
  } catch (error) {
    throw createDomainError(/*...*/);
  }
}

// 3. MongoDB persiste y retorna documento
// 4. documentToPrimary transforma de MongooseDocument a Domain Entity
```

---

## 🧪 Testing

### Mock de Repository

```typescript
describe('MongooseUserRepo', () => {
  let repo: MongooseUserRepo;
  let mockModel: jest.Mocked<Model<UserDocument>>;

  beforeEach(() => {
    mockModel = {
      findById: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      // ... más métodos
    } as any;

    repo = new MongooseUserRepo(mockModel);
  });

  it('should find user by email', async () => {
    const mockUser = { _id: '123', email: 'test@example.com', toObject: () => ({}) };
    mockModel.findOne.mockResolvedValue(mockUser as any);

    const result = await repo.findByEmail('test@example.com');

    expect(mockModel.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
    expect(result).toBeDefined();
  });
});
```

---

## 📚 Integraciones con Servicios Externos

### Ubicación

Los servicios externos se organizan en `shareds/`:

```
shareds/
├── nodemailer/           # Email service
│   ├── email-nodemailer.repo.ts
│   └── email.interface.d.ts
├── octokit/              # GitHub API
│   └── infrastructure/
│       ├── octokit.service.ts
│       └── octokit.conn.ts
└── thirdweb/             # Web3 authentication
    ├── auth-thirdweb.repo.ts
    └── thirdweb.module.ts
```

### Cuándo usar Infrastructure en Shareds

**SIEMPRE** cuando necesitamos lógica de alguna **librería externa** (servicio) diferente a bases de datos:
- ✅ Envío de emails (Nodemailer)
- ✅ APIs externas (Octokit, Thirdweb)
- ✅ Almacenamiento de archivos (S3, Storage)
- ✅ Servicios de pago (Stripe)
- ✅ Servicios de autenticación externos

---

## 🔐 Configuración y Secretos

### Uso de Variables de Entorno

```typescript
@Injectable()
export class EmailNodemailerRepo {
  constructor() {
    this.transporter = nodemailer.createTransporter({
      host: process.env.EMAIL_HOST,     // ✅ Variables de entorno
      port: Number(process.env.EMAIL_PORT),
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,   // ✅ Secretos desde .env
      },
    });
  }
}
```

❌ **NUNCA hardcodear secretos:**
```typescript
// 🔴 NUNCA hacer esto
const apiKey = 'hardcoded-secret-value'; // ❌ MAL
```

---

## 📝 Registro de Modelos en Módulos

```typescript
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Role', schema: RoleSchema }
    ])
  ],
  providers: [
    {
      provide: USER_REPOSITORY,
      useClass: MongooseUserRepo
    }
  ],
  exports: [USER_REPOSITORY]
})
export class UserModule {}
```

---

## 🚀 Optimizaciones

### 1. **Índices en Schemas**

```typescript
export const UserSchema = new Schema({
  email: { type: String, index: true },      // ✅ Índice simple
  address: { type: String, unique: true },   // ✅ Índice único
});

UserSchema.index({ email: 1, role: 1 });     // ✅ Índice compuesto
```

### 2. **Lean Queries**

Para operaciones de solo lectura que no requieren funcionalidad de documentos de Mongoose:

```typescript
async read(filter?: Partial<UserBase>): Promise<UserBase[]> {
  const documents = await this.Model.find(filter).lean(); // ✅ Más rápido
  return documents.map(doc => ({
    ...doc,
    id: doc._id.toString()
  }));
}
```

### 3. **Selección de Campos**

```typescript
async readUserPublicProfile(id: string): Promise<Partial<User>> {
  return await this.Model
    .findById(id)
    .select('name bio avatar') // ✅ Solo campos necesarios
    .lean();
}
```

---

## 📚 Referencias

- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [NestJS Mongoose Integration](https://docs.nestjs.com/techniques/mongodb)
- [Clean Architecture - Infrastructure Layer](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Reporte de Análisis de Estructura](./task/staged/reporte-analisis-estructura.md)
