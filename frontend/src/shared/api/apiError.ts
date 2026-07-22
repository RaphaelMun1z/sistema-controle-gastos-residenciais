import type { ProblemDetails } from "./apiTypes";

export type ApiErrorType = "network" | "timeout" | "http" | "unknown";

export interface ApiError {
	type: ApiErrorType;
	message: string;
	status?: number;
	problemDetails?: ProblemDetails;
}

export interface UiError {
	title: string;
	description: string;
	actionLabel?: string;
}

export type UiErrorContext =
	| "default"
	| "peopleList"
	| "peopleCreate"
	| "peopleDelete"
	| "transactionsList"
	| "transactionsCreate"
	| "summaryLoad"
	| "peopleOptionsLoad"
	| "signIn"
	| "signUp";

const httpErrorMessages: Record<number, string> = {
	400: "Não foi possível processar os dados enviados.",
	401: "Sua sessão expirou. Entre novamente para continuar.",
	403: "Você não tem permissão para realizar esta ação.",
	404: "Não encontramos as informações que você procurava.",
	409: "Já existe um registro com essas informações.",
	422: "Alguns dados informados são inválidos.",
	500: "Algo deu errado. Não conseguimos concluir essa ação agora.",
};

const defaultDescriptions = {
	retry: "Tente novamente em alguns instantes.",
	later:
		"Não conseguimos concluir essa ação agora. Tente novamente mais tarde.",
};

const contextTitles: Record<UiErrorContext, string> = {
	default: "Não foi possível carregar as informações agora.",
	peopleList: "Não foi possível carregar as pessoas cadastradas.",
	peopleCreate: "Não foi possível cadastrar a pessoa.",
	peopleDelete: "Não foi possível excluir a pessoa.",
	transactionsList: "Não foi possível carregar suas transações.",
	transactionsCreate: "Não foi possível registrar a transação.",
	summaryLoad: "Não foi possível carregar seu resumo financeiro.",
	peopleOptionsLoad: "Não foi possível carregar as pessoas cadastradas.",
	signIn: "Não foi possível entrar agora.",
	signUp: "Não foi possível criar sua conta.",
};

const unsafeMessagePatterns = [
	/\b(exception|stack trace|system\.|microsoft\.|sql|select\s+|insert\s+|update\s+|delete\s+)\b/i,
	/\bat\s+\w+\./i,
	/\b[A-Z][A-Za-z0-9_]+Exception\b/,
	/\/api\/v\d+\//i,
];

const cleanProblemDetailsMessage = (message?: string) => {
	if (!message) {
		return undefined;
	}

	const cleaned = message
		.replace(/\s*\(Parameter '[^']+'\)\s*\.?$/i, "")
		.trim();

	if (
		!cleaned ||
		unsafeMessagePatterns.some((pattern) => pattern.test(cleaned))
	) {
		return undefined;
	}

	return cleaned.endsWith(".") ? cleaned : `${cleaned}.`;
};

const getProblemDetailsDetail = (problemDetails?: ProblemDetails) =>
	cleanProblemDetailsMessage(problemDetails?.detail);

const getProblemDetailsTitle = (problemDetails?: ProblemDetails) =>
	cleanProblemDetailsMessage(problemDetails?.title);

const getProblemDetailsMessage = (problemDetails?: ProblemDetails) =>
	getProblemDetailsDetail(problemDetails) ??
	getProblemDetailsTitle(problemDetails);

export const createApiError = (error: unknown): ApiError => {
	if (isApiError(error)) {
		return error;
	}

	if (error instanceof DOMException && error.name === "AbortError") {
		return {
			type: "timeout",
			message: "Não foi possível carregar as informações agora.",
		};
	}

	if (error instanceof TypeError) {
		return {
			type: "network",
			message: "Não foi possível carregar as informações agora.",
		};
	}

	return {
		type: "unknown",
		message: "Algo deu errado. Não conseguimos concluir essa ação agora.",
	};
};

export const createHttpError = (
	status: number,
	problemDetails?: ProblemDetails,
): ApiError => ({
	type: "http",
	status,
	problemDetails,
	message:
		getProblemDetailsMessage(problemDetails) ??
		httpErrorMessages[status] ??
		"Algo deu errado. Não conseguimos concluir essa ação agora.",
});

export const getApiErrorMessage = (error: unknown) =>
	createApiError(error).message;

export const getValidationFieldErrors = (error: unknown) => {
	const apiError = createApiError(error);
	const errors = apiError.problemDetails?.errors;

	if (!errors || typeof errors !== "object" || Array.isArray(errors)) {
		return {};
	}

	return Object.entries(errors).reduce<Record<string, string>>(
		(fieldErrors, [field, messages]) => {
			if (Array.isArray(messages) && typeof messages[0] === "string") {
				fieldErrors[field.charAt(0).toLowerCase() + field.slice(1)] =
					messages[0];
			}

			return fieldErrors;
		},
		{},
	);
};

const getConflictMessage = (context: UiErrorContext) => {
	if (context === "peopleCreate") {
		return "Já existe uma pessoa cadastrada com essas informações.";
	}

	if (context === "signUp") {
		return "Já existe uma conta com este e-mail.";
	}

	return "Já existe um registro com essas informações.";
};

export const getApiErrorFeedback = (
	error: unknown,
	context: UiErrorContext = "default",
): UiError => {
	const apiError = createApiError(error);

	if (apiError.type === "network" || apiError.type === "timeout") {
		return {
			title: contextTitles[context],
			description: defaultDescriptions.retry,
			actionLabel: "Tentar novamente",
		};
	}

	if (apiError.status === 401) {
		return {
			title:
				context === "signIn"
					? "E-mail ou senha incorretos."
					: "Sua sessão expirou.",
			description:
				context === "signIn"
					? "Verifique os dados informados e tente novamente."
					: "Entre novamente para continuar.",
		};
	}

	const problemDetailsDetail = getProblemDetailsDetail(apiError.problemDetails);
	const problemDetailsTitle = getProblemDetailsTitle(apiError.problemDetails);
	const problemDetailsMessage = problemDetailsDetail ?? problemDetailsTitle;

	if (apiError.status === 403) {
		return {
			title:
				problemDetailsMessage ??
				"Você não tem permissão para realizar esta ação.",
			description:
				"Se precisar continuar, solicite acesso a uma pessoa responsável.",
		};
	}

	if (apiError.status === 404) {
		return {
			title:
				problemDetailsMessage ??
				"Não encontramos as informações que você procurava.",
			description: "Confira os dados e tente novamente.",
		};
	}

	if (apiError.status === 409) {
		return {
			title: problemDetailsDetail ?? getConflictMessage(context),
			description: "Revise as informações e tente novamente.",
		};
	}

	if (apiError.status === 400 || apiError.status === 422) {
		return {
			title:
				problemDetailsMessage ??
				(context === "transactionsCreate"
					? "Não foi possível registrar essa transação."
					: "Alguns dados precisam de atenção."),
			description: "Revise as informações preenchidas e tente novamente.",
		};
	}

	return {
		title: contextTitles[context] ?? "Algo deu errado.",
		description:
			apiError.status && apiError.status >= 500
				? defaultDescriptions.later
				: defaultDescriptions.retry,
		actionLabel: "Tentar novamente",
	};
};

export const getApiErrorTitle = (
	error: unknown,
	context: UiErrorContext = "default",
) => getApiErrorFeedback(error, context).title;

export const isApiError = (error: unknown): error is ApiError => {
	return (
		typeof error === "object" &&
		error !== null &&
		"type" in error &&
		"message" in error
	);
};
