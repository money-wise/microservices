import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';
import { CreateBudgetDto, UpdateBudgetDto } from './dto/budget.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: 'CREATE_BUDGET' })
  createBudget(@Payload() data: CreateBudgetDto) {
    return this.appService.createBudget(data);
  }

  @MessagePattern({ cmd: 'GET_ALL_BUDGETS' })
  getAllBudgets(@Payload() data: { userId: string }) {
    return this.appService.getAllBudgets(data.userId);
  }

  @MessagePattern({ cmd: 'UPDATE_BUDGET' })
  updateBudget(@Payload() data: { id: string } & UpdateBudgetDto) {
    const { id, ...updateData } = data;
    return this.appService.updateBudget(id, updateData);
  }

  @MessagePattern({ cmd: 'DELETE_BUDGET' })
  deleteBudget(@Payload() data: { id: string }) {
    return this.appService.deleteBudget(data.id);
  }

  @MessagePattern({ cmd: 'GET_BUDGET_PROGRESS' })
  getBudgetProgress(@Payload() data: { budgetId: string }) {
    return this.appService.getBudgetProgress(data.budgetId);
  }
}
