import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CreateTransactionDto,
  UpdateTransactionDto,
} from './dto/transaction.dto';
// import { S3Service } from './services/s3.service';

@Injectable()
export class AppService {
  constructor(
    @InjectModel('Transaction') private readonly transactionModel: Model<any>,
    // private readonly s3Service: S3Service,
  ) {}

  async createTransaction(data: CreateTransactionDto) {
    try {
      const transactionData = { ...data };
      delete transactionData.receiptBase64;

      const newTransaction = new this.transactionModel(transactionData);
      const savedTransaction = await newTransaction.save();

      // Upload receipt if provided
      if (data.receiptBase64) {
        // const receiptUrl = await this.s3Service.uploadReceipt(
        //   data.userId,
        //   savedTransaction._id.toString(),
        //   data.receiptBase64,
        // );

        // savedTransaction.receiptUrl = receiptUrl;

        await savedTransaction.save();
      }

      return {
        statusCode: HttpStatus.CREATED,
        message: 'Transaction created successfully',
        data: savedTransaction,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Error creating transaction',
        error: error.message,
      };
    }
  }

  async getAllTransactions(userId: string) {
    console.log('userId', userId);
    try {
      const transactions = await this.transactionModel
        .find({ userId })
        .sort({ date: -1 });

      return {
        statusCode: HttpStatus.OK,
        message: 'Transactions retrieved successfully',
        data: transactions,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Error retrieving transactions',
        error: error.message,
      };
    }
  }

  async getTransaction(id: string) {
    try {
      const transaction = await this.transactionModel.findById(id);

      if (!transaction) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Transaction not found',
        };
      }

      return {
        statusCode: HttpStatus.OK,
        message: 'Transaction retrieved successfully',
        data: transaction,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Error retrieving transaction',
        error: error.message,
      };
    }
  }

  async updateTransaction(id: string, updateData: UpdateTransactionDto) {
    try {
      const transaction = await this.transactionModel.findByIdAndUpdate(
        id,
        { ...updateData, updatedAt: new Date() },
        { new: true },
      );

      if (!transaction) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Transaction not found',
        };
      }

      return {
        statusCode: HttpStatus.OK,
        message: 'Transaction updated successfully',
        data: transaction,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Error updating transaction',
        error: error.message,
      };
    }
  }

  async deleteTransaction(id: string) {
    try {
      const transaction = await this.transactionModel.findByIdAndDelete(id);

      if (!transaction) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Transaction not found',
        };
      }

      return {
        statusCode: HttpStatus.OK,
        message: 'Transaction deleted successfully',
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Error deleting transaction',
        error: error.message,
      };
    }
  }
}
