# Application Layer

## 📋 Descripción

La capa de **Application** contiene la lógica de aplicación y los casos de uso (UseCases). Esta capa orquesta el flujo de datos entre la capa de Presentation (controladores) y la capa de Infrastructure (repositorios, servicios externos).

**Responsabilidades principales:**
- Implementar casos de uso de negocio
- Orquestar llamadas a repositorios y servicios externos
- Transformar datos entre capas
- Coordinar transacciones y flujos complejos
- **NO contiene lógica de negocio pura** (eso va en Domain)

---

## 🏗️ Estructura

```
modules/<entity>/application/
├── <entity>.usecase.ts       # Casos de uso principales
├── <entity>.interface.ts     # Interfaces de repositorio
└── <entity>-*.usecase.ts     # Casos de uso específicos (opcional)
```

**Ejemplo:**
```
modules/user/application/
├── user.usecase.ts           # UserUseCase con métodos CRUD
├── user.interface.ts         # UserRepository interface
└── user-nodemailer.usecase.ts # Caso de uso específico de email
```

---

## 📖 USECASES

### Tipos de UseCases

#### 1. **UseCases Principales (Recomendado)**
Agrupa operaciones relacionadas en una sola clase inyectable.

```typescript
@Injectable()
export class UserUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository
  ) {}

  async create(data: CreateUserDto): Promise<User> { ... }
  async readById(id: string): Promise<User> { ... }
  async read(filter?: Partial<User>): Promise<User[]> { ... }
  async updateById(id: string, data: UpdateUserDto): Promise<User> { ... }
  async deleteById(id: string): Promise<User> { ... }
  
  // Métodos específicos de negocio
  async verifyEmail(id: string, token: string): Promise<User> { ... }
}
```

**Ventajas:**
- ✅ Reduce número de clases
- ✅ Facilita inyección de dependencias
- ✅ Mejora mantenibilidad
- ✅ Simplifica configuración en módulos

#### 2. **UseCases Granulares (Legacy - No Recomendado)**
Cada operación en su propia clase inyectable.

```typescript
@Injectable()
export class UserCreateUseCase { ... }

@Injectable()
export class UserReadByIdUseCase { ... }

@Injectable()
export class UserUpdateByIdUseCase { ... }
// ... etc
```

**Desventajas:**
- ❌ Genera código verbose
- ❌ Dificulta mantenimiento
- ❌ Requiere múltiples inyecciones en controladores
- ❌ Complica configuración de módulos

> ⚠️ **Nota:** Este patrón está siendo refactorizado. Ver [Reporte de Análisis de Estructura](./task/staged/reporte-analisis-estructura.md) para más detalles.

---

### 3. **UseCases Especializados**
Para lógica compleja que no es CRUD estándar.

```typescript
@Injectable()
export class UserNodemailerUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository,
    @Inject(EMAIL_REPOSITORY) private readonly emailRepository: EmailRepository
  ) {}

  async sendVerificationEmail(userId: string): Promise<void> {
    const user = await this.userRepository.readById(userId);
    const token = generateVerificationToken();
    await this.emailRepository.send({
      to: user.email,
      subject: 'Verify your email',
      template: 'verification',
      context: { token }
    });
  }
}
```

---

## 🔌 INTERFACES

Las interfaces definen los contratos entre la capa de Application y la capa de Infrastructure.

### Estructura de Interfaces

```typescript
// application/<entity>.interface.ts
import { MongooseCRUI } from 'src/shareds/pattern/infrastructure/implementations/cru.impl';

export interface UserRepository extends MongooseCRUI<UserBase> {
  // Métodos específicos de User además de CRUD base
  verifyEmail(props: { id: string; verifyToken: string }): Promise<UserBase & DBBase>;
  findByEmail(email: string): Promise<UserBase & DBBase | null>;
}
```

### Nomenclatura de Interfaces

**Recomendado:**
```typescript
export interface UserRepository extends MongooseCRUI<UserBase> { ... }
export interface TechRepository extends MongooseCRUI<TechBase> { ... }
export interface ProjectRepository extends MongooseCRUI<ProjectBase> { ... }
```

**⚠️ Evitar (inconsistente):**
```typescript
// ❌ Mezcla de nomenclaturas
export interface UserInterface extends MongooseCRUI<UserBase> { ... }
export interface TechRepository extends MongooseCRUI<TechBase> { ... }
```

---

## 🎯 Mejores Prácticas

### 1. **Separación de Responsabilidades**

✅ **CORRECTO:**
```typescript
// application/user.usecase.ts
@Injectable()
export class UserUseCase {
  async verifyEmail(id: string, token: string): Promise<User> {
    const user = await this.userRepository.readById(id);
    user.verifyEmail(token); // 🟢 Lógica en Domain
    return await this.userRepository.updateById(id, user);
  }
}
```

❌ **INCORRECTO:**
```typescript
// application/user.usecase.ts
@Injectable()
export class UserUseCase {
  async verifyEmail(id: string, token: string): Promise<User> {
    const user = await this.userRepository.readById(id);
    // 🔴 Lógica de negocio en Application (debería estar en Domain)
    if (user.verifyToken !== token) {
      throw new Error('Invalid token');
    }
    if (new Date(user.verifyTokenExpire) <= new Date()) {
      throw new Error('Token expired');
    }
    user.isVerified = true;
    return await this.userRepository.updateById(id, user);
  }
}
```

### 2. **Inyección de Dependencias**

✅ **CORRECTO:**
```typescript
@Injectable()
export class UserUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository,
    @Inject(EMAIL_REPOSITORY) private readonly emailRepository: EmailRepository
  ) {}
}
```

❌ **INCORRECTO:**
```typescript
@Injectable()
export class UserUseCase {
  // 🔴 Importación directa de implementación
  constructor(private readonly userRepository: MongooseUserRepo) {}
}
```

### 3. **Gestión de Errores**

```typescript
@Injectable()
export class UserUseCase {
  async readById(id: string): Promise<User> {
    // Los errores de dominio se propagan automáticamente
    // desde el repositorio hacia el filtro global
    return await this.userRepository.readById(id);
  }
}
```

---

## 📝 Tokens de Inyección

Los tokens se definen en `modules/tokens.ts`:

```typescript
// modules/tokens.ts
export const USER_REPOSITORY = Symbol('UserRepository');
export const TECH_REPOSITORY = Symbol('TechRepository');
export const PROJECT_REPOSITORY = Symbol('ProjectRepository');
export const ROLE_REPOSITORY = Symbol('RoleRepository');
export const EMAIL_REPOSITORY = Symbol('EmailRepository');
```

**Uso en módulos:**
```typescript
@Module({
  providers: [
    {
      provide: USER_REPOSITORY,
      useClass: MongooseUserRepo
    },
    UserUseCase
  ]
})
export class UserModule {}
```

---

## 🔄 Flujo de Datos

```
Controller → UseCase → Repository → Database
    ↓           ↓          ↓            ↓
   DTO      Domain     Mongoose    MongoDB
```

**Ejemplo completo:**
```typescript
// 1. Controller recibe DTO
@Post()
async createUser(@Body() dto: CreateUserDto) {
  return await this.userUseCase.create(dto);
}

// 2. UseCase orquesta la operación
@Injectable()
export class UserUseCase {
  async create(dto: CreateUserDto): Promise<User> {
    // Transforma DTO a entidad de dominio
    const userData: UserBase = {
      email: dto.email,
      address: dto.address,
      // ... más campos
    };
    return await this.userRepository.create(userData);
  }
}

// 3. Repository persiste en BD
async create(data: Omit<UserBase, 'id'>): Promise<User> {
  const document = new this.Model(data);
  return await document.save();
}
```

---

## 🧪 Testing

```typescript
describe('UserUseCase', () => {
  let useCase: UserUseCase;
  let mockRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    mockRepository = {
      create: jest.fn(),
      readById: jest.fn(),
      // ... más métodos
    } as any;

    useCase = new UserUseCase(mockRepository);
  });

  it('should create a user', async () => {
    const userData = { email: 'test@example.com', address: '0x...' };
    mockRepository.create.mockResolvedValue({ id: '1', ...userData });

    const result = await useCase.create(userData);

    expect(result).toEqual({ id: '1', ...userData });
    expect(mockRepository.create).toHaveBeenCalledWith(userData);
  });
});
```

---

## 🚀 Migrando de UseCases Granulares a Consolidados

**Paso 1: Consolidar clases**
```typescript
// Antes (8 archivos)
user-create.usecase.ts
user-read.usecase.ts
user-update.usecase.ts
// ...

// Después (1 archivo)
user.usecase.ts
```

**Paso 2: Actualizar módulo**
```typescript
// Antes
providers: [
  UserCreateUseCase,
  UserReadUseCase,
  UserUpdateUseCase,
  // ...
]

// Después
providers: [UserUseCase]
```

**Paso 3: Actualizar controlador**
```typescript
// Antes
constructor(
  private readonly userCreateUseCase: UserCreateUseCase,
  private readonly userReadUseCase: UserReadUseCase,
  // ...
) {}

// Después
constructor(private readonly userUseCase: UserUseCase) {}
```

---

## 📚 Referencias

- [Clean Architecture por Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [NestJS Documentation](https://docs.nestjs.com/)
- [Reporte de Análisis de Estructura](./task/staged/reporte-analisis-estructura.md)
