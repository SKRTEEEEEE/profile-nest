// Tipos 'dinámicos' para domain -> Estos tipos son distintos de cada parte (repositorio) de la app donde se importa domain (frontend, backend, etc..)

import { MongooseBase } from "./shareds/pattern/infrastructure/types/mongoose";

export type LucideIconNames = string;
export enum ErrorAppCodes {}
export type DBBase = MongooseBase