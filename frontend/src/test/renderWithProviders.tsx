import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, type RenderOptions } from "@testing-library/react";
import type { ReactElement } from "react";
import { MemoryRouter } from "react-router";

export const createTestQueryClient = () =>
	new QueryClient({
		defaultOptions: {
			queries: {
				retry: false,
				staleTime: 1000 * 60 * 5,
				gcTime: 1000 * 60 * 30,
			},
			mutations: {
				retry: false,
			},
		},
	});

export const renderWithProviders = (
	ui: ReactElement,
	options?: RenderOptions,
) => {
	const queryClient = createTestQueryClient();

	return render(
		<QueryClientProvider client={queryClient}>
			<MemoryRouter>{ui}</MemoryRouter>
		</QueryClientProvider>,
		options,
	);
};
