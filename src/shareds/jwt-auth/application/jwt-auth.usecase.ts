import { Injectable } from '@nestjs/common';
import { JwtAuthInterface } from 'src/shareds/jwt-auth/application/jwt-auth.interface';

// ⚠️ TESTING
//No utilizar si no necesitamos -> Verificar tokens fuera de contexto HTTP - o - Abstracción para infraestructura de auth(websockets, workers, subscribers--mqtt)
@Injectable()
// <TDBBase extends TDBBaseMockup>
export class JwtAuthUseCase {
  constructor(private readonly userAuthRepository: JwtAuthInterface) {}
  async verifyJWT(token: string) {
    return this.userAuthRepository.verifyJWT(token);
  }
}
