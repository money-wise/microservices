import { Injectable, HttpStatus, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AppService {
  constructor(
    @Inject('NATS_SERVICE') private readonly natsClient: ClientProxy,
  ) {}

  async getSpendingAnalytics(userId: string) {
    try {
      // Get all transactions from transaction service
      const transactionsResponse = await firstValueFrom(
        this.natsClient.send({ cmd: 'GET_ALL_TRANSACTIONS' }, { userId }),
      );

      if (transactionsResponse.statusCode !== HttpStatus.OK) {
        return transactionsResponse;
      }

      const transactions = transactionsResponse.data;
      const expenses = transactions.filter((t) => t.type === 'expense');

      // Calculate analytics
      const totalSpent = expenses.reduce((sum, t) => sum + t.amount, 0);

      // Group by category
      const categorySpending = {};
      expenses.forEach((t) => {
        if (!categorySpending[t.category]) {
          categorySpending[t.category] = 0;
        }
        categorySpending[t.category] += t.amount;
      });

      // Convert to array and sort by amount
      const spendingByCategory = Object.entries(categorySpending)
        .map(([category, amount]) => ({ category, amount }))
        .sort((a, b) => (b.amount as number) - (a.amount as number));

      // Get budgets to calculate progress
      const budgetsResponse = await firstValueFrom(
        this.natsClient.send({ cmd: 'GET_ALL_BUDGETS' }, { userId }),
      );

      let budgetComparison = [];
      if (budgetsResponse.statusCode === HttpStatus.OK) {
        const budgets = budgetsResponse.data;

        // For each budget, calculate spending vs budget
        budgetComparison = budgets.map((budget) => {
          const categorySpent = categorySpending[budget.category] || 0;
          const remaining = budget.amount - categorySpent;
          const percentUsed = (categorySpent / budget.amount) * 100;

          return {
            category: budget.category,
            budgeted: budget.amount,
            spent: categorySpent,
            remaining,
            percentUsed,
          };
        });
      }

      return {
        statusCode: HttpStatus.OK,
        message: 'Spending analytics retrieved successfully',
        data: {
          totalSpent,
          spendingByCategory,
          budgetComparison,
        },
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Error retrieving spending analytics',
        error: error.message,
      };
    }
  }

  async getIncomeAnalytics(userId: string) {
    try {
      // Get all transactions from transaction service
      const transactionsResponse = await firstValueFrom(
        this.natsClient.send({ cmd: 'GET_ALL_TRANSACTIONS' }, { userId }),
      );

      if (transactionsResponse.statusCode !== HttpStatus.OK) {
        return transactionsResponse;
      }

      const transactions = transactionsResponse.data;
      const incomes = transactions.filter((t) => t.type === 'income');

      // Calculate analytics
      const totalIncome = incomes.reduce((sum, t) => sum + t.amount, 0);

      // Group by category
      const categoryIncome = {};
      incomes.forEach((t) => {
        if (!categoryIncome[t.category]) {
          categoryIncome[t.category] = 0;
        }
        categoryIncome[t.category] += t.amount;
      });

      // Convert to array and sort by amount
      const incomeByCategory = Object.entries(categoryIncome)
        .map(([category, amount]) => ({ category, amount }))
        .sort((a, b) => (b.amount as number) - (a.amount as number));

      return {
        statusCode: HttpStatus.OK,
        message: 'Income analytics retrieved successfully',
        data: {
          totalIncome,
          incomeByCategory,
        },
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Error retrieving income analytics',
        error: error.message,
      };
    }
  }

  async getBudgetAnalytics(userId: string) {
    try {
      // Get all budgets and transactions
      const [budgetsResponse, transactionsResponse] = await Promise.all([
        firstValueFrom(
          this.natsClient.send({ cmd: 'GET_ALL_BUDGETS' }, { userId }),
        ),
        firstValueFrom(
          this.natsClient.send({ cmd: 'GET_ALL_TRANSACTIONS' }, { userId }),
        ),
      ]);

      if (budgetsResponse.statusCode !== HttpStatus.OK) {
        return budgetsResponse;
      }

      if (transactionsResponse.statusCode !== HttpStatus.OK) {
        return transactionsResponse;
      }

      const budgets = budgetsResponse.data;
      const transactions = transactionsResponse.data;
      const expenses = transactions.filter((t) => t.type === 'expense');

      // Group expenses by category
      const categorySpending = {};
      expenses.forEach((t) => {
        if (!categorySpending[t.category]) {
          categorySpending[t.category] = 0;
        }
        categorySpending[t.category] += t.amount;
      });

      // Calculate budget progress
      const budgetProgress = budgets.map((budget) => {
        const spent = categorySpending[budget.category] || 0;
        const remaining = budget.amount - spent;
        const percentUsed = (spent / budget.amount) * 100;
        const status =
          percentUsed > 100
            ? 'over-budget'
            : percentUsed > 80
              ? 'warning'
              : 'on-track';

        return {
          id: budget._id,
          name: budget.name,
          category: budget.category,
          budgeted: budget.amount,
          spent,
          remaining,
          percentUsed,
          status,
        };
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'Budget analytics retrieved successfully',
        data: {
          budgetProgress,
          totalBudgeted: budgets.reduce((sum, b) => sum + b.amount, 0),
          totalSpent: expenses.reduce((sum, t) => sum + t.amount, 0),
        },
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Error retrieving budget analytics',
        error: error.message,
      };
    }
  }

  async getSpendingTrends(userId: string, period: string = 'monthly') {
    try {
      // Get all transactions
      const transactionsResponse = await firstValueFrom(
        this.natsClient.send({ cmd: 'GET_ALL_TRANSACTIONS' }, { userId }),
      );

      if (transactionsResponse.statusCode !== HttpStatus.OK) {
        return transactionsResponse;
      }

      const transactions = transactionsResponse.data;
      const expenses = transactions.filter((t) => t.type === 'expense');

      // Prepare time-based grouping
      const now = new Date();
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(now.getMonth() - 6);

      // Filter transactions within the time range
      const recentExpenses = expenses.filter(
        (t) => new Date(t.date) >= sixMonthsAgo && new Date(t.date) <= now,
      );

      // Group by month or week based on period
      const trends = this.groupTransactionsByTime(recentExpenses, period);

      return {
        statusCode: HttpStatus.OK,
        message: 'Spending trends retrieved successfully',
        data: {
          period,
          trends,
        },
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Error retrieving spending trends',
        error: error.message,
      };
    }
  }

  private groupTransactionsByTime(transactions, period: string) {
    const grouped = {};

    transactions.forEach((transaction) => {
      const date = new Date(transaction.date);
      let key;

      if (period === 'weekly') {
        // Get week number and year
        const weekNumber = this.getWeekNumber(date);
        key = `${date.getFullYear()}-W${weekNumber}`;
      } else if (period === 'daily') {
        // Format as YYYY-MM-DD
        key = date.toISOString().split('T')[0];
      } else {
        // Default to monthly - format as YYYY-MM
        key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      }

      if (!grouped[key]) {
        grouped[key] = {
          period: key,
          total: 0,
          byCategory: {},
        };
      }

      grouped[key].total += transaction.amount;

      if (!grouped[key].byCategory[transaction.category]) {
        grouped[key].byCategory[transaction.category] = 0;
      }

      grouped[key].byCategory[transaction.category] += transaction.amount;
    });

    // Convert to array and sort by period
    return Object.values(grouped).sort((a: any, b: any) =>
      a.period.localeCompare(b.period),
    );
  }

  private getWeekNumber(date: Date): number {
    const d = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
    );
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  }
}
