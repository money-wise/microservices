import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';
import {
  CreateTransactionDto,
  UpdateTransactionDto,
} from './dto/transaction.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: 'CREATE_TRANSACTION' })
  createTransaction(@Payload() data: CreateTransactionDto) {
    return this.appService.createTransaction(data);
  }

  @MessagePattern({ cmd: 'GET_ALL_TRANSACTIONS' })
  getAllTransactions(@Payload() data: { userId: string }) {
    return this.appService.getAllTransactions(data.userId);
  }

  @MessagePattern({ cmd: 'GET_TRANSACTION' })
  getTransaction(@Payload() data: { id: string }) {
    return this.appService.getTransaction(data.id);
  }

  @MessagePattern({ cmd: 'UPDATE_TRANSACTION' })
  updateTransaction(@Payload() data: { id: string } & UpdateTransactionDto) {
    const { id, ...updateData } = data;
    return this.appService.updateTransaction(id, updateData);
  }

  @MessagePattern({ cmd: 'DELETE_TRANSACTION' })
  deleteTransaction(@Payload() data: { id: string }) {
    return this.appService.deleteTransaction(data.id);
  }
}
