export class CreateTransactionDto {
  readonly userId: string;
  readonly amount: number;
  readonly type: 'income' | 'expense';
  readonly category: string;
  readonly description?: string;
  readonly date?: Date;
  readonly receiptBase64?: string; // Base64 encoded image for receipt
}

export class UpdateTransactionDto {
  readonly amount?: number;
  readonly type?: 'income' | 'expense';
  readonly category?: string;
  readonly description?: string;
  readonly date?: Date;
}
