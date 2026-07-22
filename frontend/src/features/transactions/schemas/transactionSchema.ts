import { z } from "zod";

import { getTodayDateOnly } from "../../../shared/utils/dateOnly";
import { TransactionType } from "../types/transaction";

export const transactionSchema = z.object({
	personId: z.string().min(1, "Selecione uma pessoa."),
	type: z.union(
		[z.literal(TransactionType.Expense), z.literal(TransactionType.Revenue)],
		{
			message: "Selecione o tipo da transação.",
		},
	),
	description: z.string().min(1, "Informe uma descrição."),
	amount: z.number().positive("Informe um valor maior que zero."),
	transactionDate: z
		.string()
		.min(1, "Informe a data da transação.")
		.refine(
			(value) => value <= getTodayDateOnly(),
			"A data da transação não pode ser futura.",
		),
});

export type TransactionFormData = z.infer<typeof transactionSchema>;
