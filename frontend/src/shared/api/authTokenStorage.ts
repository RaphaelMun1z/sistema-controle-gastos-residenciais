const AUTH_TOKEN_STORAGE_KEY = "residential-expenses.auth";

export interface StoredAuthToken {
	accessToken: string;
	expiresAt: string;
}

const isStoredAuthToken = (value: unknown): value is StoredAuthToken => {
	return (
		typeof value === "object" &&
		value !== null &&
		"accessToken" in value &&
		"expiresAt" in value &&
		typeof value.accessToken === "string" &&
		typeof value.expiresAt === "string"
	);
};

export const authTokenStorage = {
	get(): StoredAuthToken | null {
		const rawValue = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);

		if (!rawValue) {
			return null;
		}

		try {
			const parsedValue: unknown = JSON.parse(rawValue);

			return isStoredAuthToken(parsedValue) ? parsedValue : null;
		} catch {
			return null;
		}
	},

	set(token: StoredAuthToken) {
		localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, JSON.stringify(token));
	},

	clear() {
		localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
	},

	isExpired(token: StoredAuthToken) {
		return new Date(token.expiresAt).getTime() <= Date.now();
	},
};
