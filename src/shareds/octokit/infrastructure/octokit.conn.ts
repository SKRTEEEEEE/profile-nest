import { Injectable } from '@nestjs/common';
import { createDomainError } from '@skrteeeeee/profile-domain/dist/flows/error.registry';
import { ErrorCodes } from '@skrteeeeee/profile-domain/dist/flows/error.type';

@Injectable()
export class OctokitConfig {
  protected octokitPromise: Promise<any>;

  constructor() {
    this.octokitPromise = this.initialize();
  }

  private async initialize() {
    if (!process.env.GITHUB_TOKEN)
      throw createDomainError(
        ErrorCodes.SET_ENV,
        OctokitConfig,
        'initialize',
        undefined,
        { variable: 'GITHUB_TOKEN' },
      );
    const { Octokit } = await import('@octokit/rest');
    return new Octokit({ auth: process.env.GITHUB_TOKEN });
  }

  protected async getOctokit() {
    return this.octokitPromise;
  }
}
