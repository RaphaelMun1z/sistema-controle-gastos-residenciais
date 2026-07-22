import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { PaginationParams } from "../../../shared/api/apiTypes";
import { transactionsService } from "../services/transactionsService";
import type { CreateTransactionInput } from "../types/transaction";

export const transactionsQueryKey = ["transactions"] as const;
export const transactionQueryKey = (id: string) =>
	["transactions", id] as const;
export const transactionsByPersonQueryKey = ["transactions-person"] as const;

export interface TransactionsParams extends PaginationParams {
	personId?: string;
}

export const useTransactions = (params: TransactionsParams) =>
	useQuery({
		queryKey: [
			...transactionsQueryKey,
			params.page,
			params.pageSize,
			params.personId ?? "",
		] as const,
		queryFn: () =>
			params.personId
				? transactionsService.getTransactionsByPerson(params.personId, params)
				: transactionsService.getTransactions(params),
		placeholderData: keepPreviousData,
		staleTime: 60 * 1000,
	});

export const useTransaction = (id: string) =>
	useQuery({
		queryKey: transactionQueryKey(id),
		queryFn: () => transactionsService.getTransactionById(id),
		enabled: id.length > 0,
	});

export const useCreateTransaction = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (input: CreateTransactionInput) =>
			transactionsService.createTransaction(input),
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: transactionsQueryKey });
			void queryClient.invalidateQueries({
				queryKey: transactionsByPersonQueryKey,
			});
			void queryClient.invalidateQueries({ queryKey: ["financial-summary"] });
		},
	});
};
