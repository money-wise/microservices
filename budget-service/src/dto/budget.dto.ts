export class CreateBudgetDto {
  readonly userId: string;
  readonly name: string;
  readonly amount: number;
  readonly category: string;
  readonly period?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  readonly startDate?: Date;
  readonly endDate?: Date;
  readonly isRecurring?: boolean;
}

export class UpdateBudgetDto {
  readonly name?: string;
  readonly amount?: number;
  readonly category?: string;
  readonly period?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  readonly startDate?: Date;
  readonly endDate?: Date;
  readonly isRecurring?: boolean;
}
