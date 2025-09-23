import { Module } from '@nestjs/common';
import { TopicCalculatorModule } from 'src/shareds/topic/presentation/topic-calculator.module';
import { TopicChartUseCase } from '../application/topic-chart.usecase';
import { TopicQuickChartRepo } from '../infrastructure/topic-quickchart.repo';
import { TopicChartInterface } from '../application/topic-chart.interface';

@Module({
  imports: [TopicCalculatorModule],
  providers: [
    TopicChartUseCase,
    {
      provide: TopicChartInterface,
      useClass: TopicQuickChartRepo,
    },
  ],
  exports: [TopicChartUseCase],
})
export class TopicQuickChartModule {}
