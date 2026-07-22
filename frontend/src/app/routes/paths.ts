export const ROUTES = {
	root: "/",
	signIn: "/entrar",
	signUp: "/cadastrar",
	people: "/pessoas",
	personRegister: "/pessoas/registrar",
	transactions: "/transacoes",
	transactionRegister: "/transacoes/registrar",
	summary: "/resumo",
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
