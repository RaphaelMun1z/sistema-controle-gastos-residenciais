import { describe, expect, it } from "vitest";
import { TransactionType } from "../types/transaction";
import { transactionSchema } from "./transactionSchema";

const personId = "11111111-1111-4111-8111-111111111111";

describe("transactionSchema", () => {
	it("aceita uma transação válida", () => {
		const result = transactionSchema.safeParse({
			personId,
			type: TransactionType.Expense,
			description: "Energia",
			amount: 120,
			transactionDate: "2026-07-21",
		});

		expect(result.success).toBe(true);
	});

	it("rejeita valor negativo", () => {
		const result = transactionSchema.safeParse({
			personId,
			type: TransactionType.Expense,
			description: "Energia",
			amount: -120,
			transactionDate: "2026-07-21",
		});

		expect(result.success).toBe(false);
	});

	it("rejeita data futura", () => {
		const result = transactionSchema.safeParse({
			personId,
			type: TransactionType.Expense,
			description: "Energia",
			amount: 120,
			transactionDate: "2999-01-01",
		});

		expect(result.success).toBe(false);
	});
});
