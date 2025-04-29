import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTransactionDto {
  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'User ID who owns this transaction',
  })
  readonly userId: string;

  @ApiProperty({
    example: 75.5,
    description: 'Transaction amount in dollars',
  })
  readonly amount: number;

  @ApiProperty({
    example: 'expense',
    enum: ['income', 'expense'],
    description: 'Transaction type',
  })
  readonly type: 'income' | 'expense';

  @ApiProperty({
    example: 'groceries',
    description: 'Transaction category',
  })
  readonly category: string;

  @ApiPropertyOptional({
    example: 'Grocery Shopping at Whole Foods',
    description: 'Optional transaction description',
  })
  readonly description?: string;

  @ApiPropertyOptional({
    example: '2025-04-16T00:00:00.000Z',
    description: 'Transaction date (defaults to current date if not provided)',
  })
  readonly date?: Date;

  @ApiPropertyOptional({
    example: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD...',
    description: 'Base64 encoded image for receipt (optional)',
  })
  readonly receiptBase64?: string;
}

export class UpdateTransactionDto {
  @ApiPropertyOptional({
    example: 80.75,
    description: 'Updated transaction amount',
  })
  readonly amount?: number;

  @ApiPropertyOptional({
    example: 'income',
    enum: ['income', 'expense'],
    description: 'Updated transaction type',
  })
  readonly type?: 'income' | 'expense';

  @ApiPropertyOptional({
    example: 'food',
    description: 'Updated transaction category',
  })
  readonly category?: string;

  @ApiPropertyOptional({
    example: 'Updated grocery receipt',
    description: 'Updated transaction description',
  })
  readonly description?: string;

  @ApiPropertyOptional({
    example: '2025-04-16T00:00:00.000Z',
    description: 'Updated transaction date',
  })
  readonly date?: Date;
}

export class TransactionResponseDto {
  @ApiProperty({
    example: '507f1f77bcf86cd799439012',
    description: 'Transaction ID',
  })
  id: string;

  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'User ID who owns this transaction',
  })
  userId: string;

  @ApiProperty({ example: 75.5, description: 'Transaction amount' })
  amount: number;

  @ApiProperty({
    example: 'expense',
    enum: ['income', 'expense'],
    description: 'Transaction type',
  })
  type: 'income' | 'expense';

  @ApiProperty({ example: 'groceries', description: 'Transaction category' })
  category: string;

  @ApiProperty({
    example: 'Grocery Shopping at Whole Foods',
    description: 'Transaction description',
  })
  description: string;

  @ApiProperty({
    example: '2025-04-16T00:00:00.000Z',
    description: 'Transaction date',
  })
  date: Date;

  @ApiProperty({
    example:
      'https://finance-app-receipts.s3.amazonaws.com/receipts/123456.jpg',
    description: 'URL to receipt image (if uploaded)',
  })
  receiptUrl?: string;

  @ApiProperty({
    example: '2025-04-16T12:00:00.000Z',
    description: 'Transaction creation timestamp',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2025-04-16T14:30:00.000Z',
    description: 'Transaction last update timestamp',
  })
  updatedAt: Date;
}
