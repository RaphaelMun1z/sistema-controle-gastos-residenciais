import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { summaryService } from "../services/summaryService";
import type { SummaryFilters } from "../types/summary";

export const financialSummaryQueryKey = ["financial-summary"] as const;

export const useSummary = (filters: SummaryFilters, enabled = true) =>
	useQuery({
		queryKey: [financialSummaryQueryKey[0], filters],
		queryFn: () => summaryService.getSummary(filters),
		placeholderData: keepPreviousData,
		staleTime: 60 * 1000,
		enabled,
	});
