import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: 'GET_SPENDING_ANALYTICS' })
  getSpendingAnalytics(@Payload() data: { userId: string }) {
    return this.appService.getSpendingAnalytics(data.userId);
  }

  @MessagePattern({ cmd: 'GET_INCOME_ANALYTICS' })
  getIncomeAnalytics(@Payload() data: { userId: string }) {
    return this.appService.getIncomeAnalytics(data.userId);
  }

  @MessagePattern({ cmd: 'GET_BUDGET_ANALYTICS' })
  getBudgetAnalytics(@Payload() data: { userId: string }) {
    return this.appService.getBudgetAnalytics(data.userId);
  }

  @MessagePattern({ cmd: 'GET_SPENDING_TRENDS' })
  getSpendingTrends(@Payload() data: { userId: string; period: string }) {
    return this.appService.getSpendingTrends(data.userId, data.period);
  }
}
