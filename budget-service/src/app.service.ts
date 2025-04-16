import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBudgetDto, UpdateBudgetDto } from './dto/budget.dto';

@Injectable()
export class AppService {
  constructor(
    @InjectModel('Budget') private readonly budgetModel: Model<any>,
  ) {}

  async createBudget(data: CreateBudgetDto) {
    try {
      const newBudget = new this.budgetModel(data);
      const savedBudget = await newBudget.save();

      return {
        statusCode: HttpStatus.CREATED,
        message: 'Budget created successfully',
        data: savedBudget,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Error creating budget',
        error: error.message,
      };
    }
  }

  async getAllBudgets(userId: string) {
    try {
      const budgets = await this.budgetModel.find({ userId });

      return {
        statusCode: HttpStatus.OK,
        message: 'Budgets retrieved successfully',
        data: budgets,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Error retrieving budgets',
        error: error.message,
      };
    }
  }

  async updateBudget(id: string, updateData: UpdateBudgetDto) {
    try {
      const budget = await this.budgetModel.findByIdAndUpdate(
        id,
        { ...updateData, updatedAt: new Date() },
        { new: true },
      );

      if (!budget) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Budget not found',
        };
      }

      return {
        statusCode: HttpStatus.OK,
        message: 'Budget updated successfully',
        data: budget,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Error updating budget',
        error: error.message,
      };
    }
  }

  async deleteBudget(id: string) {
    try {
      const budget = await this.budgetModel.findByIdAndDelete(id);

      if (!budget) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Budget not found',
        };
      }

      return {
        statusCode: HttpStatus.OK,
        message: 'Budget deleted successfully',
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Error deleting budget',
        error: error.message,
      };
    }
  }

  async getBudgetProgress(budgetId: string) {
    try {
      const budget = await this.budgetModel.findById(budgetId);

      if (!budget) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Budget not found',
        };
      }

      // In a real implementation, you would query the transaction service
      // to get actual spending data for this budget category
      // For this example, we'll return mock data
      const mockSpent = budget.amount * Math.random() * 0.8;
      const remaining = budget.amount - mockSpent;
      const percentUsed = (mockSpent / budget.amount) * 100;

      return {
        statusCode: HttpStatus.OK,
        message: 'Budget progress retrieved successfully',
        data: {
          budget,
          spent: mockSpent,
          remaining,
          percentUsed,
        },
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Error retrieving budget progress',
        error: error.message,
      };
    }
  }
}
