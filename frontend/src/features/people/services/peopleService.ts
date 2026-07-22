import { API_ENDPOINTS } from "../../../shared/api/apiEndpoints";
import type { PagedResponse, PaginationParams, Resource } from "../../../shared/api/apiTypes";
import { httpClient } from "../../../shared/api/httpClient";
import type { CreatePersonInput, Person } from "../types/person";
import type {
	CreatePersonRequestDTO,
	PersonResponseDTO,
} from "../types/personDtos";
import { mapPersonResponseToPerson } from "../types/personDtos";

export const peopleService = {
	async getPeople(params: PaginationParams): Promise<PagedResponse<Person>> {
		const response = await httpClient.get<PagedResponse<PersonResponseDTO>>(
			API_ENDPOINTS.people,
			{
				params: {
					page: params.page,
					pageSize: params.pageSize,
					search: params.search,
				},
			},
		);

		return {
			...response,
			content: response.content.map(mapPersonResponseToPerson),
		};
	},

	async getPersonById(id: string): Promise<Person> {
		const resource = await httpClient.get<Resource<PersonResponseDTO>>(
			API_ENDPOINTS.personById(id),
		);

		return mapPersonResponseToPerson(resource.data);
	},

	async createPerson(input: CreatePersonInput): Promise<Person> {
		const resource = await httpClient.post<
			Resource<PersonResponseDTO>,
			CreatePersonRequestDTO
		>(API_ENDPOINTS.people, input);

		return mapPersonResponseToPerson(resource.data);
	},

	async deletePerson(id: string): Promise<void> {
		await httpClient.delete<void>(API_ENDPOINTS.personById(id));
	},
};
