import type {
	CreateTransactionInput,
	Transaction,
} from "./transaction";
import { TransactionType } from "./transaction";

export interface TransactionResponseDTO {
	id: string;
	personId: string;
	personName: string;
	description: string;
	type: number;
	amount: number;
	transactionDate: string;
	createdAt: string;
}

export type CreateTransactionRequestDTO = CreateTransactionInput;

const mapTransactionType = (type: number) =>
	type === TransactionType.Revenue
		? TransactionType.Revenue
		: TransactionType.Expense;

export const mapTransactionResponseToTransaction = (
	transaction: TransactionResponseDTO,
): Transaction => ({
	id: transaction.id,
	personId: transaction.personId,
	personName: transaction.personName,
	description: transaction.description,
	type: mapTransactionType(transaction.type),
	amount: transaction.amount,
	transactionDate: transaction.transactionDate,
	createdAt: transaction.createdAt,
});
