export const env = {
	apiUrl: import.meta.env.VITE_API_URL ?? "http://localhost:7201/api/v1",
	// Bypass temporario apenas para desenvolvimento local; a autenticacao real continua disponivel.
	bypassAuth: import.meta.env.VITE_BYPASS_AUTH === "true",
};
