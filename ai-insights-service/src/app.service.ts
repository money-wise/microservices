import { Injectable, HttpStatus, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AppService {
  constructor(
    @Inject('NATS_SERVICE') private readonly natsClient: ClientProxy,
  ) {}

  async getFinancialInsights(userId: string) {
    try {
      // Get transactions and budgets for analysis
      const [transactionsResponse, budgetsResponse] = await Promise.all([
        firstValueFrom(
          this.natsClient.send({ cmd: 'GET_ALL_TRANSACTIONS' }, { userId }),
        ),
        firstValueFrom(
          this.natsClient.send({ cmd: 'GET_ALL_BUDGETS' }, { userId }),
        ),
      ]);

      if (transactionsResponse.statusCode !== HttpStatus.OK) {
        return transactionsResponse;
      }

      const transactions = transactionsResponse.data;
      const budgets =
        budgetsResponse.statusCode === HttpStatus.OK
          ? budgetsResponse.data
          : [];

      // Generate insights
      const insights: Array<{
        type: string;
        severity: string;
        title: string;
        description: string;
        data: Record<string, unknown>;
      }> = [];

      // Income vs Expenses
      const incomes = transactions.filter((t) => t.type === 'income');
      const expenses = transactions.filter((t) => t.type === 'expense');
      const totalIncome = incomes.reduce((sum, t) => sum + t.amount, 0);
      const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
      const savingsRate =
        totalIncome > 0
          ? ((totalIncome - totalExpenses) / totalIncome) * 100
          : 0;

      if (savingsRate < 20) {
        insights.push({
          type: 'saving_rate',
          severity: savingsRate < 0 ? 'high' : 'medium',
          title: 'Your savings rate is below recommended levels',
          description:
            savingsRate < 0
              ? 'You are spending more than your income. This is not sustainable in the long term.'
              : 'Financial experts recommend saving at least 20% of your income.',
          data: { savingsRate, totalIncome, totalExpenses },
        });
      } else {
        insights.push({
          type: 'saving_rate',
          severity: 'low',
          title: 'Great savings rate!',
          description: `You're saving ${savingsRate.toFixed(1)}% of your income, which is excellent.`,
          data: { savingsRate, totalIncome, totalExpenses },
        });
      }

      // Budget analysis
      if (budgets.length > 0) {
        // Calculate spending by category
        const categorySpending: Record<string, number> = {};
        expenses.forEach((t) => {
          if (!categorySpending[t.category]) {
            categorySpending[t.category] = 0;
          }
          categorySpending[t.category] += t.amount;
        });

        // Find overbudget categories
        const overbudgetCategories: Array<{
          category: string;
          budgeted: number;
          spent: number;
          percentUsed: number;
          overspent: number;
        }> = [];
        budgets.forEach((budget: { category: string; amount: number }) => {
          const spent = categorySpending[budget.category] || 0;
          const percentUsed = (spent / budget.amount) * 100;

          if (percentUsed > 100) {
            overbudgetCategories.push({
              category: budget.category,
              budgeted: budget.amount,
              spent,
              percentUsed,
              overspent: spent - budget.amount,
            });
          }
        });

        if (overbudgetCategories.length > 0) {
          insights.push({
            type: 'budget_alert',
            severity: 'medium',
            title: `You've exceeded budget in ${overbudgetCategories.length} ${
              overbudgetCategories.length === 1 ? 'category' : 'categories'
            }`,
            description: `Your spending is over budget in: ${overbudgetCategories
              .map((c) => c.category)
              .join(', ')}`,
            data: { overbudgetCategories },
          });
        }
      } else {
        insights.push({
          type: 'budget_recommendation',
          severity: 'low',
          title: 'Create a budget to track your spending',
          description:
            'Setting up budgets helps you control spending and reach financial goals faster.',
          data: {
            topCategories: this.getTopSpendingCategories(expenses, 3),
          },
        });
      }

      // Expense trend analysis
      const recentExpenses = expenses.filter(
        (t) => new Date(t.date) >= this.getDateDaysAgo(90),
      );

      const monthlyExpenses = this.groupExpensesByMonth(recentExpenses);

      if (monthlyExpenses.length >= 2) {
        const currentMonth = monthlyExpenses[monthlyExpenses.length - 1] as {
          month: string;
          total: number;
          byCategory: Record<string, number>;
        };
        const previousMonth = monthlyExpenses[monthlyExpenses.length - 2] as {
          month: string;
          total: number;
          byCategory: Record<string, number>;
        };

        const changePercent =
          ((currentMonth.total - previousMonth.total) / previousMonth.total) *
          100;

        if (changePercent > 15) {
          insights.push({
            type: 'spending_trend',
            severity: 'medium',
            title: 'Your spending has increased significantly',
            description: `Your spending this month is ${changePercent.toFixed(1)}% higher than last month.`,
            data: { currentMonth, previousMonth, changePercent },
          });
        } else if (changePercent < -15) {
          insights.push({
            type: 'spending_trend',
            severity: 'low',
            title: "You've reduced your spending - great job!",
            description: `Your spending this month is ${Math.abs(changePercent).toFixed(1)}% lower than last month.`,
            data: { currentMonth, previousMonth, changePercent },
          });
        }
      }

      return {
        statusCode: HttpStatus.OK,
        message: 'Financial insights retrieved successfully',
        data: {
          insights,
          summary: {
            totalIncome,
            totalExpenses,
            savingsRate,
            netCashflow: totalIncome - totalExpenses,
          },
        },
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Error retrieving financial insights',
        error: error.message,
      };
    }
  }

  async getSavingRecommendations(userId: string) {
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

      // Get top spending categories
      const topCategories = this.getTopSpendingCategories(expenses, 5);

      // Generate recommendations based on spending patterns
      const recommendations: Array<{
        category: string;
        title: string;
        description: string;
        potentialSavings: number | null;
      }> = [];

      topCategories.forEach(
        (category: { category: string; amount: number }) => {
          switch (category.category.toLowerCase()) {
            case 'dining':
            case 'restaurants':
            case 'food':
              recommendations.push({
                category: category.category,
                title: 'Reduce dining out expenses',
                description:
                  'Try meal prepping at home to save on restaurant costs. Even reducing eating out by one meal per week can save hundreds per year.',
                potentialSavings: Math.round(category.amount * 0.2), // Assume 20% potential savings
              });
              break;

            case 'entertainment':
            case 'subscriptions':
              recommendations.push({
                category: category.category,
                title: 'Review your subscriptions',
                description:
                  'Check for unused or redundant subscription services. Many people save over $100/month by auditing their recurring payments.',
                potentialSavings: Math.round(category.amount * 0.3), // Assume 30% potential savings
              });
              break;

            case 'shopping':
            case 'clothing':
              recommendations.push({
                category: category.category,
                title: 'Consider a shopping pause',
                description:
                  'Try a 30-day break from non-essential purchases. This can reset spending habits and significantly boost savings.',
                potentialSavings: Math.round(category.amount * 0.4), // Assume 40% potential savings
              });
              break;

            case 'transportation':
            case 'uber':
            case 'lyft':
            case 'taxi':
              recommendations.push({
                category: category.category,
                title: 'Optimize transportation costs',
                description:
                  'Consider public transit, carpooling, or biking for some trips to reduce rideshare expenses.',
                potentialSavings: Math.round(category.amount * 0.25), // Assume 25% potential savings
              });
              break;

            default:
              // General recommendation for other categories
              recommendations.push({
                category: category.category,
                title: `Reduce ${category.category} expenses`,
                description: `This is one of your top spending categories. Review if there are opportunities to cut back without significantly impacting your lifestyle.`,
                potentialSavings: Math.round(category.amount * 0.15), // Assume 15% potential savings
              });
          }
        },
      );

      // Add general recommendations
      recommendations.push({
        category: 'General',
        title: 'Set up automatic savings',
        description:
          'Transfer a fixed amount to savings right after payday before you can spend it. Even small regular amounts add up over time.',
        potentialSavings: null,
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'Saving recommendations retrieved successfully',
        data: {
          recommendations,
          totalPotentialSavings: recommendations
            .filter((r) => r.potentialSavings)
            .reduce((sum, r) => sum + (r.potentialSavings ?? 0), 0),
        },
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Error retrieving saving recommendations',
        error: error.message,
      };
    }
  }

  async getSpendingAnomalies(userId: string) {
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

      // Group expenses by category and calculate average spending
      const anomalies: Array<{
        transaction: { amount: number; date: string };
        category: string;
        average: number;
        percentAboveAverage: number;
      }> = [];
      const categoryStats: Record<
        string,
        { transactions: Array<{ amount: number; date: string }>; total: number }
      > = {};
      expenses.forEach((t) => {
        if (!categoryStats[t.category]) {
          categoryStats[t.category] = {
            transactions: [],
            total: 0,
          };
        }
        categoryStats[t.category].transactions.push(t);
        categoryStats[t.category].total += t.amount;
      });

      Object.entries(categoryStats).forEach(([category, data]) => {
        const transactions = data.transactions;
        const total = data.total;
        const count = transactions.length;
        const average = total / count;

        // Find transactions that are significantly higher than average
        const significantlyHigher = transactions.filter(
          (t) => t.amount > average * 2 && t.amount > 50, // At least double the average and over $50
        );

        significantlyHigher.forEach((transaction) => {
          anomalies.push({
            transaction,
            category,
            average,
            percentAboveAverage:
              ((transaction.amount - average) / average) * 100,
          });
        });
      });

      // Sort anomalies by percent difference (highest first)
      anomalies.sort((a, b) => b.percentAboveAverage - a.percentAboveAverage);

      return {
        statusCode: HttpStatus.OK,
        message: 'Spending anomalies retrieved successfully',
        data: {
          anomalies,
          count: anomalies.length,
        },
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Error retrieving spending anomalies',
        error: error.message,
      };
    }
  }

  // Helper methods
  private getTopSpendingCategories(expenses, limit = 5) {
    const categorySpending = {};

    expenses.forEach((t) => {
      if (!categorySpending[t.category]) {
        categorySpending[t.category] = 0;
      }
      categorySpending[t.category] += t.amount;
    });

    return Object.entries(categorySpending)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => (b.amount as number) - (a.amount as number))
      .slice(0, limit);
  }

  private groupExpensesByMonth(expenses): Array<{
    month: string;
    total: number;
    byCategory: Record<string, number>;
  }> {
    const grouped = {};

    expenses.forEach((transaction) => {
      const date = new Date(transaction.date);
      const key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;

      if (!grouped[key]) {
        grouped[key] = {
          month: key,
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

    return Object.values(grouped)
      .map(
        (value) =>
          value as {
            month: string;
            total: number;
            byCategory: Record<string, number>;
          },
      )
      .sort((a, b) => a.month.localeCompare(b.month));
  }

  private getDateDaysAgo(days: number): Date {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date;
  }

  // private groupExpensesByMonth(expenses) {
  //   const grouped = {};

  //   expenses.forEach((transaction) => {
  //     const date = new Date(transaction.date);
  //     const key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;

  //     if (!grouped[key]) {
  //       grouped[key] = {
  //         month: key,
  //         total: 0,
  //         byCategory: {},
  //       };
  //     }

  //     grouped[key].total += transaction.amount;

  //     if (!grouped[key].byCategory[transaction.category]) {
  //       grouped[key].byCategory[transaction.category] = 0;
  //     }

  //     grouped[key].byCategory[transaction.category] += transaction.amount;
  //   });

  //   return Object.values(grouped).sort((a: any, b: any) =>
  //     a.month.localeCompare(b.month),
  //   );
  // }
}
