enum AppMainParts {
  ADMIN = "ADMIN",
  // Puedes añadir más partes aquí si tu app crece
}

interface SwaggerPartConfig {
  title: string;
  description: string;
  version: string;
  tags?: string[];
//   path: string; // ruta donde se monta la doc
}

export const SWAGGER_CONFIGS: Record<AppMainParts, SwaggerPartConfig> = {
  [AppMainParts.ADMIN]: {
    title: "Admin API",
    description: "Documentación de la API principal de la aplicación.",
    version: "1.0",
    // tags: ["admin", "users", "cats"],
    // path: "admin/docs" // Esta parte es para indicar el endpoint
  },
  // Puedes añadir más configuraciones para otras partes aquí
};