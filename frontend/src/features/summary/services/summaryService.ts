import { API_ENDPOINTS } from "../../../shared/api/apiEndpoints";
import { httpClient } from "../../../shared/api/httpClient";
import type {
	FinancialSummaryResponse,
	SummaryFilters,
} from "../types/summary";

export const summaryService = {
	async getSummary(filters: SummaryFilters): Promise<FinancialSummaryResponse> {
		return httpClient.get<FinancialSummaryResponse>(
			API_ENDPOINTS.financialSummary,
			{
				params: {
					page: filters.page,
					pageSize: filters.pageSize,
					startDate: filters.startDate || undefined,
					endDate: filters.endDate || undefined,
				},
			},
		);
	},
};
