import { env } from "../config/env";
import { authTokenStorage } from "./authTokenStorage";
import { createApiError, createHttpError } from "./apiError";
import type { ProblemDetails } from "./apiTypes";

const API_BASE_URL = env.apiUrl;
const DEFAULT_TIMEOUT_IN_MS = 10000;

const buildUrl = (path: string) => `${API_BASE_URL}${path}`;
let onUnauthorized: (() => void) | null = null;

export const setUnauthorizedHandler = (handler: (() => void) | null) => {
	onUnauthorized = handler;
};

const buildQueryString = (
	params?: Record<string, string | number | undefined>,
) => {
	if (!params) {
		return "";
	}

	const searchParams = new URLSearchParams();

	Object.entries(params).forEach(([key, value]) => {
		if (value !== undefined && value !== "") {
			searchParams.set(key, String(value));
		}
	});

	const queryString = searchParams.toString();

	return queryString ? `?${queryString}` : "";
};

interface HttpRequestOptions extends RequestInit {
	params?: Record<string, string | number | undefined>;
	timeoutInMs?: number;
}

export const httpClient = {
	async get<TResponse>(
		path: string,
		init?: HttpRequestOptions,
	): Promise<TResponse> {
		return request<TResponse>(path, { ...init, method: "GET" });
	},

	async post<TResponse, TBody>(
		path: string,
		body: TBody,
		init?: HttpRequestOptions,
	): Promise<TResponse> {
		return request<TResponse>(path, {
			...init,
			method: "POST",
			body: JSON.stringify(body),
		});
	},

	async put<TResponse, TBody>(
		path: string,
		body: TBody,
		init?: HttpRequestOptions,
	): Promise<TResponse> {
		return request<TResponse>(path, {
			...init,
			method: "PUT",
			body: JSON.stringify(body),
		});
	},

	async delete<TResponse>(
		path: string,
		init?: HttpRequestOptions,
	): Promise<TResponse> {
		return request<TResponse>(path, { ...init, method: "DELETE" });
	},
};

const request = async <TResponse>(
	path: string,
	init: HttpRequestOptions,
): Promise<TResponse> => {
	const controller = new AbortController();
	const timeout = globalThis.setTimeout(
		() => controller.abort(),
		init.timeoutInMs ?? DEFAULT_TIMEOUT_IN_MS,
	);

	try {
		const requestInit = { ...init };
		const params = requestInit.params;

		delete requestInit.params;
		delete requestInit.timeoutInMs;

		const headers = new Headers(requestInit.headers);
		headers.set("Content-Type", "application/json");
		const authorizationHeader = getAuthorizationHeader();

		if (authorizationHeader.Authorization) {
			headers.set("Authorization", authorizationHeader.Authorization);
		}
		delete requestInit.headers;

		const response = await fetch(
			`${buildUrl(path)}${buildQueryString(params)}`,
			{
				headers,
				signal: controller.signal,
				...requestInit,
			},
		);

		if (!response.ok) {
			const problemDetails = await readProblemDetails(response);

			if (response.status === 401 && path !== "/auth/login") {
				onUnauthorized?.();
			}

			throw createHttpError(response.status, problemDetails);
		}

		if (response.status === 204) {
			return undefined as TResponse;
		}

		return response.json() as Promise<TResponse>;
	} catch (error) {
		throw createApiError(error);
	} finally {
		globalThis.clearTimeout(timeout);
	}
};

const getAuthorizationHeader = () => {
	const token = authTokenStorage.get();

	if (!token || authTokenStorage.isExpired(token)) {
		authTokenStorage.clear();
		return {};
	}

	return {
		Authorization: `Bearer ${token.accessToken}`,
	};
};

const readProblemDetails = async (
	response: Response,
): Promise<ProblemDetails | undefined> => {
	const contentType = response.headers.get("Content-Type");

	if (!contentType?.includes("json")) {
		return undefined;
	}

	try {
		return (await response.json()) as ProblemDetails;
	} catch {
		return undefined;
	}
};
