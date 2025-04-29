import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBudgetDto {
  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'User ID who owns this budget',
  })
  readonly userId: string;

  @ApiProperty({
    example: 'Groceries Budget',
    description: 'Budget name',
  })
  readonly name: string;

  @ApiProperty({
    example: 500,
    description: 'Budget amount limit in dollars',
  })
  readonly amount: number;

  @ApiProperty({
    example: 'groceries',
    description: 'Budget category',
  })
  readonly category: string;

  @ApiPropertyOptional({
    example: 'monthly',
    enum: ['daily', 'weekly', 'monthly', 'yearly'],
    description:
      'Budget period frequency (defaults to monthly if not specified)',
  })
  readonly period?: 'daily' | 'weekly' | 'monthly' | 'yearly';

  @ApiPropertyOptional({
    example: '2025-04-01T00:00:00.000Z',
    description:
      'Budget start date (defaults to first day of current month if not specified)',
  })
  readonly startDate?: Date;

  @ApiPropertyOptional({
    example: '2025-04-30T23:59:59.999Z',
    description:
      'Budget end date (defaults to last day of period if not specified)',
  })
  readonly endDate?: Date;

  @ApiPropertyOptional({
    example: true,
    description:
      'Whether the budget should automatically recur after its end date',
  })
  readonly isRecurring?: boolean;
}

export class UpdateBudgetDto {
  @ApiPropertyOptional({
    example: 'Updated Groceries Budget',
    description: 'Updated budget name',
  })
  readonly name?: string;

  @ApiPropertyOptional({
    example: 600,
    description: 'Updated budget amount limit',
  })
  readonly amount?: number;

  @ApiPropertyOptional({
    example: 'food',
    description: 'Updated budget category',
  })
  readonly category?: string;

  @ApiPropertyOptional({
    example: 'weekly',
    enum: ['daily', 'weekly', 'monthly', 'yearly'],
    description: 'Updated budget period frequency',
  })
  readonly period?: 'daily' | 'weekly' | 'monthly' | 'yearly';

  @ApiPropertyOptional({
    example: '2025-05-01T00:00:00.000Z',
    description: 'Updated budget start date',
  })
  readonly startDate?: Date;

  @ApiPropertyOptional({
    example: '2025-05-31T23:59:59.999Z',
    description: 'Updated budget end date',
  })
  readonly endDate?: Date;

  @ApiPropertyOptional({
    example: false,
    description: 'Updated recurring status',
  })
  readonly isRecurring?: boolean;
}

export class BudgetResponseDto {
  @ApiProperty({
    example: '507f1f77bcf86cd799439013',
    description: 'Budget ID',
  })
  id: string;

  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'User ID who owns this budget',
  })
  userId: string;

  @ApiProperty({
    example: 'Groceries Budget',
    description: 'Budget name',
  })
  name: string;

  @ApiProperty({
    example: 500,
    description: 'Budget amount limit',
  })
  amount: number;

  @ApiProperty({
    example: 'groceries',
    description: 'Budget category',
  })
  category: string;

  @ApiProperty({
    example: 'monthly',
    enum: ['daily', 'weekly', 'monthly', 'yearly'],
    description: 'Budget period frequency',
  })
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';

  @ApiProperty({
    example: '2025-04-01T00:00:00.000Z',
    description: 'Budget start date',
  })
  startDate: Date;

  @ApiProperty({
    example: '2025-04-30T23:59:59.999Z',
    description: 'Budget end date',
  })
  endDate: Date;

  @ApiProperty({
    example: true,
    description: 'Whether the budget automatically recurs',
  })
  isRecurring: boolean;

  @ApiProperty({
    example: 325.75,
    description: 'Current amount spent within this budget period',
  })
  currentSpent: number;

  @ApiProperty({
    example: 174.25,
    description: 'Remaining budget amount',
  })
  remaining: number;

  @ApiProperty({
    example: 65.15,
    description: 'Percentage of budget used (0-100)',
  })
  percentUsed: number;

  @ApiProperty({
    example: '2025-04-01T12:00:00.000Z',
    description: 'Budget creation timestamp',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2025-04-10T14:30:00.000Z',
    description: 'Budget last update timestamp',
  })
  updatedAt: Date;
}
