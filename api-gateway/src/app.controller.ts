import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Inject,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('api')
export class AppController {
  constructor(
    @Inject('NATS_SERVICE') private readonly natsClient: ClientProxy,
  ) {}

  // Authentication endpoints
  @Post('auth/register')
  register(@Body() body) {
    return this.natsClient.send({ cmd: 'REGISTER_USER' }, body);
  }

  @Post('auth/login')
  login(@Body() body) {
    return this.natsClient.send({ cmd: 'LOGIN_USER' }, body);
  }

  // Transaction endpoints
  @Post('transactions')
  createTransaction(@Body() body) {
    return this.natsClient.send({ cmd: 'CREATE_TRANSACTION' }, body);
  }

  @Get('transactions')
  @UseGuards(AuthGuard('jwt'))
  getTransactions(@Req() req: Request) {
    return this.natsClient.send(
      { cmd: 'GET_ALL_TRANSACTIONS' },
      { userId: req['user']['userId'] },
    );
  }

  @Get('transactions/:id')
  getTransaction(@Param('id') id: string) {
    return this.natsClient.send({ cmd: 'GET_TRANSACTION' }, { id });
  }

  @Put('transactions/:id')
  updateTransaction(@Param('id') id: string, @Body() body) {
    return this.natsClient.send({ cmd: 'UPDATE_TRANSACTION' }, { id, ...body });
  }

  @Delete('transactions/:id')
  deleteTransaction(@Param('id') id: string) {
    return this.natsClient.send({ cmd: 'DELETE_TRANSACTION' }, { id });
  }

  // Budget endpoints
  @Post('budgets')
  createBudget(@Body() body) {
    return this.natsClient.send({ cmd: 'CREATE_BUDGET' }, body);
  }

  @Get('budgets')
  @UseGuards(AuthGuard('jwt'))
  getBudgets(@Req() req: Request) {
    return this.natsClient.send(
      { cmd: 'GET_ALL_BUDGETS' },
      { userId: req['user']['userId'] },
    );
  }

  @Put('budgets/:id')
  updateBudget(@Param('id') id: string, @Body() body) {
    return this.natsClient.send({ cmd: 'UPDATE_BUDGET' }, { id, ...body });
  }

  // Analytics endpoints
  @Get('analytics/spending')
  @UseGuards(AuthGuard('jwt'))
  getSpendingAnalytics(@Req() req: Request) {
    return this.natsClient.send(
      { cmd: 'GET_SPENDING_ANALYTICS' },
      { userId: req['user']['userId'] },
    );
  }

  // AI Insights endpoints
  @Get('insights')
  @UseGuards(AuthGuard('jwt'))
  getInsights(@Req() req: Request) {
    return this.natsClient.send(
      { cmd: 'GET_FINANCIAL_INSIGHTS' },
      { userId: req['user']['userId'] },
    );
  }
}
