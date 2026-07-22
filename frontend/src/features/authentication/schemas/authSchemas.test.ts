import { describe, expect, it } from "vitest";
import { signInSchema, signUpSchema } from "./authSchemas";

describe("authSchemas", () => {
	it("valida login com email e senha", () => {
		const result = signInSchema.safeParse({
			email: "user@email.com",
			password: "12345678",
		});

		expect(result.success).toBe(true);
	});

	it("rejeita cadastro com confirmação de senha divergente", () => {
		const result = signUpSchema.safeParse({
			name: "Raphael",
			birthDate: "2001-07-18",
			email: "raphael@email.com",
			password: "12345678",
			confirmPassword: "87654321",
		});

		expect(result.success).toBe(false);
	});
});
