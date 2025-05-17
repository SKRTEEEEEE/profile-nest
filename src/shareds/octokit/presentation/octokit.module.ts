import { Module } from "@nestjs/common";
import { OctokitRepo } from "../infrastructure/octokit.service";
import { OctokitConfig } from "../infrastructure/octokit.conn";


@Module({
  providers: [
    OctokitConfig,OctokitRepo,
  ],
  exports: [
    OctokitConfig,OctokitRepo,
  ],
})
export class OctokitModule {}