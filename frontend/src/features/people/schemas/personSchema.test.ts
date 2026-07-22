import { describe, expect, it } from "vitest";
import { personSchema } from "./personSchema";

describe("personSchema", () => {
	it("aceita uma pessoa válida", () => {
		const result = personSchema.safeParse({
			name: "Maria",
			birthDate: "1994-07-18",
		});

		expect(result.success).toBe(true);
	});

	it("rejeita data inválida", () => {
		const result = personSchema.safeParse({
			name: "Maria",
			birthDate: "",
		});

		expect(result.success).toBe(false);
	});
});
