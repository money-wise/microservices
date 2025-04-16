import { Schema } from 'mongoose';

export const BudgetSchema = new Schema({
  userId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  period: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'yearly'],
    default: 'monthly',
  },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
  isRecurring: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
