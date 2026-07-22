import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { peopleService } from "../services/peopleService";
import type { PaginationParams } from "../../../shared/api/apiTypes";
import type { CreatePersonInput } from "../types/person";

export const peopleQueryKey = ["people"] as const;
export const peopleSearchQueryKey = ["people-search"] as const;
export const personQueryKey = (id: string) => ["people", id] as const;

export const usePeople = (params: PaginationParams) =>
	useQuery({
		queryKey: [
			...peopleQueryKey,
			params.page,
			params.pageSize,
			params.search ?? "",
		] as const,
		queryFn: () => peopleService.getPeople(params),
		placeholderData: keepPreviousData,
		staleTime: 60 * 1000,
	});

export const usePeopleSearch = (params: PaginationParams, enabled = true) =>
	useQuery({
		queryKey: [peopleSearchQueryKey[0], params] as const,
		queryFn: () => peopleService.getPeople(params),
		placeholderData: keepPreviousData,
		staleTime: 60 * 1000,
		enabled,
	});

export const usePerson = (id: string) =>
	useQuery({
		queryKey: personQueryKey(id),
		queryFn: () => peopleService.getPersonById(id),
		enabled: id.length > 0,
	});

export const useCreatePerson = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (input: CreatePersonInput) => peopleService.createPerson(input),
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: peopleQueryKey });
			void queryClient.invalidateQueries({ queryKey: peopleSearchQueryKey });
			void queryClient.invalidateQueries({ queryKey: ["financial-summary"] });
		},
	});
};

export const useDeletePerson = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => peopleService.deletePerson(id),
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: peopleQueryKey });
			void queryClient.invalidateQueries({ queryKey: peopleSearchQueryKey });
			void queryClient.invalidateQueries({ queryKey: ["transactions"] });
			void queryClient.invalidateQueries({ queryKey: ["financial-summary"] });
		},
	});
};

export const useRemovePerson = useDeletePerson;
