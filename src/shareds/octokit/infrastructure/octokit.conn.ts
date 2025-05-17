import { Injectable } from "@nestjs/common";

@Injectable()
export class OctokitConfig {
  protected octokitPromise: Promise<any>;

  constructor() {
    this.octokitPromise = this.initialize();
  }

  private async initialize() {
    if (!process.env.GITHUB_TOKEN) throw new Error("github token missing");
    const { Octokit } = await import("@octokit/rest");
    return new Octokit({ auth: process.env.GITHUB_TOKEN });
  }

  protected async getOctokit() {
    return this.octokitPromise;
  }
}