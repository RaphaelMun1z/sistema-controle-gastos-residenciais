export const API_ENDPOINTS = {
	auth: {
		login: "/auth/login",
		register: "/auth/register",
		me: "/auth/me",
	},
	people: "/people",
	personById: (id: string) => `/people/${id}`,
	transactions: "/transactions",
	transactionById: (id: string) => `/transactions/${id}`,
	transactionsByPerson: (personId: string) => `/transactions/person/${personId}`,
	financialSummary: "/financial-summary",
} as const;
