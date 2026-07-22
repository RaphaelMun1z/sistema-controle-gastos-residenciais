import { z } from "zod";

export const signInSchema = z.object({
	email: z.email("Informe um e-mail válido."),
	password: z.string().min(1, "Informe sua senha."),
});

export const signUpSchema = z
	.object({
		name: z.string().min(1, "Informe seu nome."),
		birthDate: z
			.string()
			.min(1, "Informe sua data de nascimento.")
			.regex(/^\d{4}-\d{2}-\d{2}$/, "Informe uma data válida."),
		email: z.email("Informe um e-mail válido."),
		password: z
			.string()
			.min(8, "A senha deve possuir pelo menos 8 caracteres."),
		confirmPassword: z.string().min(1, "Confirme sua senha."),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "As senhas não conferem.",
		path: ["confirmPassword"],
	});

export type SignInFormData = z.infer<typeof signInSchema>;
export type SignUpFormData = z.infer<typeof signUpSchema>;
