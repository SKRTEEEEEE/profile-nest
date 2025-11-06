# Presentation Layer (NestJS)

## 📋 Descripción

La capa de **Presentation** es la capa más externa de la aplicación y se encarga de manejar toda la comunicación con el mundo exterior. En este proyecto, está implementada usando **NestJS** y sus utilidades nativas.

**Responsabilidades principales:**
- Manejar peticiones HTTP y transformarlas en llamadas a casos de uso
- Validar datos de entrada (DTOs)
- Serializar respuestas
- Gestionar autenticación y autorización
- Implementar la lógica específica del framework (NestJS)
- Proporcionar documentación de API (Swagger)

---

## 🏗️ Componentes de Presentation

### 📡 Controllers

Los **Controllers** manejan las peticiones HTTP y delegan la lógica de negocio a los UseCases.

**Ubicación:** `modules/<entity>/presentation/<entity>.controller.ts`

**Responsabilidades:**
- Definir endpoints HTTP
- Validar datos de entrada (usando Pipes y DTOs)
- Llamar a UseCases correspondientes
- Retornar respuestas HTTP

**Ejemplo:**
```typescript
@Controller('users')
@ApiTags('Users')
export class UserController {
  constructor(private readonly userUseCase: UserUseCase) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiSuccessResponse(CreateUserDto)
  @ApiErrorResponse()
  async createUser(@Body() dto: CreateUserDto): Promise<UserBase & DBBase> {
    return await this.userUseCase.create(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  async getUserById(@Param('id') id: string): Promise<UserBase & DBBase> {
    return await this.userUseCase.readById(id);
  }
}
```

---

### 📦 Modules

Los **Modules** organizan la aplicación en contextos cohesivos y configuran la inyección de dependencias.

**Ubicación:** `modules/<entity>/presentation/<entity>.module.ts`

**Responsabilidades:**
- Registrar providers (UseCases, Repositories)
- Importar módulos externos
- Exportar providers para otros módulos
- Configurar dependencias

**Ejemplo:**
```typescript
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema }
    ]),
    JwtAuthModule,
  ],
  controllers: [UserController],
  providers: [
    {
      provide: USER_REPOSITORY,
      useClass: MongooseUserRepo
    },
    UserUseCase,
  ],
  exports: [USER_REPOSITORY, UserUseCase]
})
export class UserModule {}
```

---

### 🔄 Pipes

Los **Pipes** transforman y validan datos antes de que lleguen al controlador.

#### Validation Pipes

**Ubicación:** `shareds/presentation/pipes/global.validation.ts`

```typescript
export const globalValidationPipe = new ValidationPipe({
  whitelist: true,           // Elimina propiedades no definidas en DTO
  forbidNonWhitelisted: true, // Lanza error si hay propiedades extra
  transform: true,            // Transforma tipos automáticamente
  transformOptions: {
    enableImplicitConversion: true
  }
});
```

#### DTOs (Data Transfer Objects)

**Ubicación:** `modules/<entity>/presentation/<entity>.dto.ts`

```typescript
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: 'User wallet address', example: '0x...' })
  @IsString()
  address: string;

  @ApiProperty({ description: 'User email', example: 'user@example.com', required: false })
  @IsEmail()
  @IsOptional()
  email?: string;
}
```

---

### 🛡️ Guards

Los **Guards** controlan el acceso a rutas antes de que se ejecute el handler del controlador.

**Ubicación:** `shareds/<feature>/presentation/<feature>.guard.ts`

**Tipos de Guards en esta aplicación:**

#### 1. **JwtAuthGuard** (Autenticación)

```typescript
@Injectable()
export class JwtAuthThirdwebGuard extends AuthGuard('jwt-thirdweb') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.get<boolean>(
      'isPublic',
      context.getHandler()
    );
    if (isPublic) return true; // Ruta pública
    return super.canActivate(context);
  }
}
```

#### 2. **RoleAuthGuard** (Autorización por rol)

```typescript
@Injectable()
export class RoleAuthTokenGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRole = this.reflector.get<RoleType>(
      'roles',
      context.getHandler()
    );
    if (!requiredRole) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    
    return user.role.level >= requiredRole;
  }
}
```

#### 3. **SignatureAuthGuard** (Firma de wallet)

```typescript
@Injectable()
export class SignatureAuthThirdWebGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const payload = request.body;
    const signature = request.headers['x-signature'];
    
    // Verifica firma de wallet
    const isValid = await verifySignature(payload, signature);
    return isValid;
  }
}
```

**Uso en Controllers:**
```typescript
@Get('admin')
@UseGuards(RoleAuthTokenGuard)
@Roles(RoleType.ADMIN)
async getAdminData() {
  // Solo accesible por admins
}
```

---

### 🔍 Interceptors

Los **Interceptors** agregan lógica antes/después de la ejecución del handler.

**Ubicación:** `shareds/presentation/<feature>.interceptor.ts`

#### ResponseInterceptor

Transforma todas las respuestas a un formato estándar:

```typescript
@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(data => ({
        success: true,
        timestamp: new Date().toISOString(),
        data
      }))
    );
  }
}
```

**Respuesta transformada:**
```json
{
  "success": true,
  "timestamp": "2025-11-06T10:30:00.000Z",
  "data": { "id": "123", "name": "User" }
}
```

---

### 🚨 Filters

Los **Filters** manejan excepciones y errores de manera centralizada.

**Ubicación:** `shareds/presentation/filters/<feature>.filter.ts`

#### DomainErrorFilter

Captura todos los errores de dominio y los transforma en respuestas HTTP apropiadas:

```typescript
@Catch(DomainError)
export class DomainErrorFilter implements ExceptionFilter {
  catch(exception: DomainError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    
    const errorResponse = {
      success: false,
      timestamp: new Date().toISOString(),
      error: {
        code: exception.code,
        message: exception.friendlyMessage,
        details: exception.meta
      }
    };

    response.status(exception.httpStatus).json(errorResponse);
  }
}
```

---

### 🎨 Decorators

Los **Decorators** personalizados simplifican la configuración de endpoints.

**Ubicación:** `shareds/presentation/<feature>.decorator.ts`

#### @PublicRoute

Marca una ruta como pública (sin autenticación):

```typescript
export const PublicRoute = () => SetMetadata('isPublic', true);

// Uso:
@Get('public-data')
@PublicRoute()
async getPublicData() {
  return { message: 'Public data' };
}
```

#### @Roles

Define el rol mínimo requerido:

```typescript
export const Roles = (role: RoleType) => SetMetadata('roles', role);

// Uso:
@Get('admin-only')
@Roles(RoleType.ADMIN)
async getAdminData() {
  return { message: 'Admin data' };
}
```

#### @CurrentUser

Extrae el usuario autenticado de la request:

```typescript
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  }
);

// Uso:
@Get('profile')
async getProfile(@CurrentUser() user: UserBase) {
  return user;
}
```

---

### 🛣️ Middleware

Los **Middleware** procesan requests antes de que lleguen al controlador.

**Ubicación:** `shareds/presentation/<feature>.middleware.ts`

#### CorrelationIdMiddleware

Agrega un ID único a cada request para tracking:

```typescript
@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const correlationId = req.headers['x-correlation-id'] || uuidv4();
    req['correlationId'] = correlationId;
    res.setHeader('x-correlation-id', correlationId);
    next();
  }
}
```

---

## 📚 Swagger Documentation

### Decoradores de Documentación

**Ubicación:** `shareds/swagger/`

#### @ApiSuccessResponse

```typescript
export function ApiSuccessResponse(dto: Type<any>) {
  return applyDecorators(
    ApiResponse({
      status: 200,
      description: 'Successful response',
      type: dto
    })
  );
}
```

#### @ApiErrorResponse

```typescript
export function ApiErrorResponse() {
  return applyDecorators(
    ApiResponse({
      status: 400,
      description: 'Bad request'
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized'
    }),
    ApiResponse({
      status: 500,
      description: 'Internal server error'
    })
  );
}
```

**Uso completo:**
```typescript
@Post()
@ApiOperation({ summary: 'Create user' })
@ApiSuccessResponse(UserDto)
@ApiErrorResponse()
@ApiBearerAuth('access-token')
async createUser(@Body() dto: CreateUserDto) {
  return await this.userUseCase.create(dto);
}
```

---

## 🎯 Mejores Prácticas

### 1. **Controllers Delgados**

✅ **CORRECTO:**
```typescript
@Post()
async createUser(@Body() dto: CreateUserDto) {
  return await this.userUseCase.create(dto);
}
```

❌ **INCORRECTO:**
```typescript
@Post()
async createUser(@Body() dto: CreateUserDto) {
  // 🔴 Lógica de negocio en el controller
  if (dto.age < 18) throw new Error('Too young');
  const user = await this.userRepo.create(dto);
  await this.emailService.send(user.email);
  return user;
}
```

### 2. **Validación con DTOs**

✅ **CORRECTO:**
```typescript
export class CreateUserDto {
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  name: string;
}
```

### 3. **Manejo de Errores**

Los errores se propagan automáticamente al filtro global:

```typescript
@Get(':id')
async getUser(@Param('id') id: string) {
  // Si no existe, el repository lanza DomainError
  // El filtro lo captura y retorna respuesta apropiada
  return await this.userUseCase.readById(id);
}
```

---

## 📚 Referencias

- [NestJS Documentation](https://docs.nestjs.com/)
- [NestJS Controllers](https://docs.nestjs.com/controllers)
- [NestJS Guards](https://docs.nestjs.com/guards)
- [NestJS Interceptors](https://docs.nestjs.com/interceptors)
- [NestJS Pipes](https://docs.nestjs.com/pipes)
- [Reporte de Análisis de Estructura](./task/staged/reporte-analisis-estructura.md)
