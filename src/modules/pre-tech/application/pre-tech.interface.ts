// 🧠⁉️🤔 Otro enfoque mas simple ⁉️ -> A las /interface/entities se la suda los métodos del pattern. Esta se encarga de crear los métodos que se expondrán en el controller(endpoints) y ya. De esta forma los usecases son solo los endpoints y en /infra/mongoose se pondrán utilizar los métodos de los pattern -> NO ES BUENA IDEA - esto introduce un acoplamiento mas fuerte entre clases.

import { PreTechBase } from '@skrteeeeee/profile-domain/dist/entities/pre-tech';

export abstract class PreTechInterface<TDB> {
  abstract updatePreTech(): Promise<void>;
  abstract readByQuery(query: { q: string }): Promise<(PreTechBase & TDB)[]>;
}
