import { Module } from "@nestjs/common";
import { OctokitRepo } from "../infrastructure/octokit.service";
import { OctokitConfig } from "../infrastructure/octokit.conn";
import { OctokitController } from "./octokit.controller";
import { ChartService } from "src/shareds/chart/chart.service";


@Module({
  controllers: [OctokitController],
  providers: [
    OctokitConfig,OctokitRepo,ChartService
  ],
  exports: [
    OctokitConfig,OctokitRepo,
  ],
})
export class OctokitModule {}