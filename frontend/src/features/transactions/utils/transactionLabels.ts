import { TransactionType } from "../types/transaction";

export const transactionTypeLabels: Record<TransactionType, string> = {
	[TransactionType.Expense]: "Despesa",
	[TransactionType.Revenue]: "Receita",
};

export const transactionTypeOptions = [
	{ value: TransactionType.Expense, label: transactionTypeLabels[TransactionType.Expense] },
	{ value: TransactionType.Revenue, label: transactionTypeLabels[TransactionType.Revenue] },
];
