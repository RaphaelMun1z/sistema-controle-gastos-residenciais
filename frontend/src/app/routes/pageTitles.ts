import { ROUTES } from "./paths";

export const APP_TITLE = "Sistema de Gastos";

export const ROUTE_TITLES = {
	[ROUTES.signIn]: "Entrar",
	[ROUTES.signUp]: "Criar conta",
	[ROUTES.people]: "Pessoas",
	[ROUTES.personRegister]: "Registrar pessoa",
	[ROUTES.transactions]: "Transações",
	[ROUTES.transactionRegister]: "Registrar transação",
	[ROUTES.summary]: "Resumo financeiro",
	notFound: "Página não encontrada",
} as const;

export const formatPageTitle = (pageTitle?: string) =>
	pageTitle ? `${APP_TITLE} | ${pageTitle}` : APP_TITLE;
