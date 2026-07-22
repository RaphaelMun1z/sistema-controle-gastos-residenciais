export interface LinkDto {
	href?: string;
	method?: string;
}

export interface Resource<T> {
	data: T;
	links?: Record<string, LinkDto>;
}

export interface PagedResponse<T> {
	content: T[];
	page: number;
	pageSize: number;
	totalElements: number;
	totalPages: number;
}

export interface ProblemDetails {
	type?: string;
	title?: string;
	status?: number;
	detail?: string;
	instance?: string;
	errors?: Record<string, string[]>;
	[key: string]: unknown;
}

export interface PaginationParams {
	page: number;
	pageSize: number;
	search?: string;
}
