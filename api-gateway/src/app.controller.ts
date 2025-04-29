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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { RegisterUserDto, LoginUserDto, AuthResponseDto } from './dto/auth.dto';
import {
  CreateTransactionDto,
  UpdateTransactionDto,
} from './dto/transaction.dto';
import { CreateBudgetDto, UpdateBudgetDto } from './dto/budget.dto';

@Controller('api')
export class AppController {
  constructor(
    @Inject('NATS_SERVICE') private readonly natsClient: ClientProxy,
  ) {}

  // Authentication endpoints
  @ApiTags('auth')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
    // type: AuthResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiBody({ type: RegisterUserDto })
  @Post('auth/register')
  register(@Body() body: RegisterUserDto) {
    return this.natsClient.send({ cmd: 'REGISTER_USER' }, body);
  }

  @ApiTags('auth')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged in',
    // type: AuthResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBody({ type: LoginUserDto })
  @Post('auth/login')
  login(@Body() body: LoginUserDto) {
    return this.natsClient.send({ cmd: 'LOGIN_USER' }, body);
  }

  // Transaction endpoints
  @ApiTags('transactions')
  @ApiOperation({ summary: 'Create a new transaction' })
  @ApiBearerAuth()
  @ApiResponse({ status: 201, description: 'Transaction created successfully' })
  @ApiBody({ type: CreateTransactionDto })
  @Post('transactions')
  createTransaction(@Body() body: CreateTransactionDto) {
    return this.natsClient.send({ cmd: 'CREATE_TRANSACTION' }, body);
  }

  @ApiTags('transactions')
  @ApiOperation({ summary: 'Get all user transactions' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Return all transactions' })
  @UseGuards(AuthGuard('jwt'))
  @Get('transactions')
  getTransactions(@Req() req: Request) {
    return this.natsClient.send(
      { cmd: 'GET_ALL_TRANSACTIONS' },
      { userId: req['user']['userId'] },
    );
  }

  @ApiTags('transactions')
  @ApiOperation({ summary: 'Get a transaction by ID' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'Transaction ID' })
  @ApiResponse({ status: 200, description: 'Return the transaction' })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  @Get('transactions/:id')
  getTransaction(@Param('id') id: string) {
    return this.natsClient.send({ cmd: 'GET_TRANSACTION' }, { id });
  }

  @ApiTags('transactions')
  @ApiOperation({ summary: 'Update a transaction' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'Transaction ID' })
  @ApiBody({ type: UpdateTransactionDto })
  @ApiResponse({ status: 200, description: 'Transaction updated successfully' })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  @Put('transactions/:id')
  updateTransaction(
    @Param('id') id: string,
    @Body() body: UpdateTransactionDto,
  ) {
    return this.natsClient.send({ cmd: 'UPDATE_TRANSACTION' }, { id, ...body });
  }

  @ApiTags('transactions')
  @ApiOperation({ summary: 'Delete a transaction' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'Transaction ID' })
  @ApiResponse({ status: 200, description: 'Transaction deleted successfully' })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  @Delete('transactions/:id')
  deleteTransaction(@Param('id') id: string) {
    return this.natsClient.send({ cmd: 'DELETE_TRANSACTION' }, { id });
  }

  // Budget endpoints
  @ApiTags('budgets')
  @ApiOperation({ summary: 'Create a new budget' })
  @ApiBearerAuth()
  @ApiBody({ type: CreateBudgetDto })
  @ApiResponse({ status: 201, description: 'Budget created successfully' })
  @Post('budgets')
  createBudget(@Body() body: CreateBudgetDto) {
    return this.natsClient.send({ cmd: 'CREATE_BUDGET' }, body);
  }

  @ApiTags('budgets')
  @ApiOperation({ summary: 'Get all user budgets' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Return all budgets' })
  @UseGuards(AuthGuard('jwt'))
  @Get('budgets')
  getBudgets(@Req() req: Request) {
    return this.natsClient.send(
      { cmd: 'GET_ALL_BUDGETS' },
      { userId: req['user']['userId'] },
    );
  }

  @ApiTags('budgets')
  @ApiOperation({ summary: 'Update a budget' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'Budget ID' })
  @ApiBody({ type: UpdateBudgetDto })
  @ApiResponse({ status: 200, description: 'Budget updated successfully' })
  @ApiResponse({ status: 404, description: 'Budget not found' })
  @Put('budgets/:id')
  updateBudget(@Param('id') id: string, @Body() body: UpdateBudgetDto) {
    return this.natsClient.send({ cmd: 'UPDATE_BUDGET' }, { id, ...body });
  }

  // Analytics endpoints
  @ApiTags('analytics')
  @ApiOperation({ summary: 'Get spending analytics' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Return spending analytics' })
  @UseGuards(AuthGuard('jwt'))
  @Get('analytics/spending')
  getSpendingAnalytics(@Req() req: Request) {
    return this.natsClient.send(
      { cmd: 'GET_SPENDING_ANALYTICS' },
      { userId: req['user']['userId'] },
    );
  }

  // AI Insights endpoints
  @ApiTags('insights')
  @ApiOperation({ summary: 'Get AI-powered financial insights' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Return financial insights' })
  @UseGuards(AuthGuard('jwt'))
  @Get('insights')
  getInsights(@Req() req: Request) {
    return this.natsClient.send(
      { cmd: 'GET_FINANCIAL_INSIGHTS' },
      { userId: req['user']['userId'] },
    );
  }
}
