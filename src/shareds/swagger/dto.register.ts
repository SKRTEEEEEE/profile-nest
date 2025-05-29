
// dto-registry.ts
export const dtoRegistry: { [key: string]: any } = {};

export function DtoRegister(constructor: Function) {
  // Register the constructor using its name (schema name in Swagger)
  dtoRegistry[constructor.name] = constructor;
  return constructor; // Allow decorator to be used without breaking the class
}