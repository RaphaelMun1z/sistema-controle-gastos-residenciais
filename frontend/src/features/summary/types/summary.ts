import type { PagedResponse } from "../../../shared/api/apiTypes";

export interface PersonFinancialSummary {
	personId: string;
	name: string;
	totalRevenue: number;
	totalExpense: number;
	balance: number;
}

export interface FinancialSummaryResponse {
	totalRevenue: number;
	totalExpense: number;
	balance: number;
	people: PagedResponse<PersonFinancialSummary>;
}

export interface SummaryFilters {
	page: number;
	pageSize: number;
	startDate: string;
	endDate: string;
}
