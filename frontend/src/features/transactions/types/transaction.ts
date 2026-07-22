export const TransactionType = {
	Expense: 0,
	Revenue: 1,
} as const;

export type TransactionType =
	(typeof TransactionType)[keyof typeof TransactionType];

export interface Transaction {
	id: string;
	personId: string;
	personName: string;
	description: string;
	type: TransactionType;
	amount: number;
	transactionDate: string;
	createdAt: string;
}

export interface CreateTransactionInput {
	personId: string;
	type: TransactionType;
	description: string;
	amount: number;
	transactionDate: string;
}
