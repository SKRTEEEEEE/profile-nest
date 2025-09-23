import { Module } from '@nestjs/common';
import { TopicCalculatorUseCase } from '../application/topic-calculator.usecase';

@Module({
  providers: [TopicCalculatorUseCase],
  exports: [TopicCalculatorUseCase],
})
export class TopicCalculatorModule {}
