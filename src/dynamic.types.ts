// Tipos 'dinámicos' para domain -> Estos tipos son distintos de cada parte (repositorio) de la app donde se importa domain (frontend, backend, etc..)

export type LucideIconNames = string;
export enum ErrorAppCodes {}
export type DBBase = {
  id: string;
  createdAt: string;
  updatedAt: string;
};