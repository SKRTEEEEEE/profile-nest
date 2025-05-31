// mock-auth-user.strategy.ts

import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { Strategy } from "passport-custom";
import { JwtAuthPayload } from "src/shareds/jwt-auth/application/jwt-auth.interface";
import { RoleType } from "src/domain/entities/role.type";
import { UnauthorizedError } from "src/domain/flows/domain.error";

@Injectable()
export class JwtAuthMockStrategy extends PassportStrategy(Strategy, 'mock') {
  async validate(req: Request): Promise<JwtAuthPayload> {
    const authHeader = req.headers['authorization']
    const token = authHeader?.split(' ')[1]
    if (token !== 'megustajs') {
      throw new UnauthorizedError(JwtAuthMockStrategy,'Token mock inválido')
    }

    return {
      iss: "mock-iss",
      sub: "0x1349wallet",
      aud: "mock-aud",
      exp: 12,
      nbf:13,
      iat: 14,
      jti: "mock-jti",
      ctx:{id: 'mock-user', nick: '0x123', role: RoleType.STUDENT }
    };
  }
}
