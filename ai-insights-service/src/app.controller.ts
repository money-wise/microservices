import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: 'GET_FINANCIAL_INSIGHTS' })
  getFinancialInsights(@Payload() data: { userId: string }) {
    return this.appService.getFinancialInsights(data.userId);
  }

  @MessagePattern({ cmd: 'GET_SAVING_RECOMMENDATIONS' })
  getSavingRecommendations(@Payload() data: { userId: string }) {
    return this.appService.getSavingRecommendations(data.userId);
  }

  @MessagePattern({ cmd: 'GET_SPENDING_ANOMALIES' })
  getSpendingAnomalies(@Payload() data: { userId: string }) {
    return this.appService.getSpendingAnomalies(data.userId);
  }
}
