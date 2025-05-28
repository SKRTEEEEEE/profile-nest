Implementar en el futuro, para dividir el UI de swagger en las distintas familias (admin, useTopics, academia, etc..)
```ts
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { INestApplication } from "@nestjs/common";

export enum AppMainParts {
  ADMIN = "ADMIN",
  // Puedes añadir más partes aquí si tu app crece
}

interface SwaggerPartConfig {
  title: string;
  description: string;
  version: string;
  tags: string[];
  path: string; // ruta donde se monta la doc
}

const SWAGGER_CONFIGS: Record<AppMainParts, SwaggerPartConfig> = {
  [AppMainParts.ADMIN]: {
    title: "Admin API",
    description: "Documentación de la API principal de la aplicación.",
    version: "1.0",
    // tags: ["admin", "users", "cats"],
    // path: "admin/docs" // Esta parte es para indicar el endpoint
  },
  // Puedes añadir más configuraciones para otras partes aquí
};

  static setup(app: INestApplication) {
    
    const config = new DocumentBuilder()
      .setTitle('Cats example')
      .setDescription('The cats API description')
      .setVersion('1.0')
      .addTag('cats')
      .build();

// DE aqui para abajo abria que terminar
// https://docs.nestjs.com/openapi/other-features#multiple-specifications
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  }
}