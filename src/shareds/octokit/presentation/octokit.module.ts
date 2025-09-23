import { Module } from '@nestjs/common';
import { OctokitRepo } from '../infrastructure/octokit.service';
import { OctokitConfig } from '../infrastructure/octokit.conn';
import { OctokitController } from './octokit.controller';
import { TopicQuickChartModule } from 'src/shareds/chart/presentation/topic-quickchart.module';
import { TopicCalculatorModule } from 'src/shareds/topic/presentation/topic-calculator.module';

@Module({
  imports: [TopicQuickChartModule, TopicCalculatorModule],
  controllers: [OctokitController],
  providers: [OctokitConfig, OctokitRepo],
  exports: [OctokitConfig, OctokitRepo],
})
export class OctokitModule {}
