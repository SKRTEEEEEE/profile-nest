// mock-auth-user.strategy.ts

import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { Strategy } from "passport-custom";
import { UserAuthJWTPayload } from "src/shareds/jwt-auth/application/jwt-auth.interface";
import { RoleType } from "src/domain/entities/role.type";

@Injectable()
export class JwtAuthMockStrategy extends PassportStrategy(Strategy, 'mock') {
  async validate(req: Request): Promise<UserAuthJWTPayload["ctx"]> {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];

    if (token !== 'megustajs') {
      throw new UnauthorizedException('Token mock inválido');
    }

    return {
       id: 'mock-user', nick: '0x123', role: RoleType.STUDENT 
    };
  }
}
