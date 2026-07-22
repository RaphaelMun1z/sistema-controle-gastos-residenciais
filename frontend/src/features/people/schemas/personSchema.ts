import { z } from "zod";

export const personSchema = z.object({
	name: z.string().min(1, "Informe o nome."),
	birthDate: z
		.string()
		.min(1, "Informe a data de nascimento.")
		.regex(/^\d{4}-\d{2}-\d{2}$/, "Informe uma data válida."),
});

export type PersonFormData = z.infer<typeof personSchema>;
