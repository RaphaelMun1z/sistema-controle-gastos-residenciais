import { QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import type { ReactElement } from "react";
import { MemoryRouter } from "react-router";
import { describe, expect, it, vi } from "vitest";
import { API_ENDPOINTS } from "../../../../shared/api/apiEndpoints";
import {
	createTestQueryClient,
	renderWithProviders,
} from "../../../../test/renderWithProviders";
import { server } from "../../../../test/server";
import PeopleConsultPage from "./PeopleConsultPage";

const personId = "11111111-1111-4111-8111-111111111111";
const pagedPeople = {
	content: [
		{
			id: personId,
			name: "Raphael Muniz",
			birthDate: "2001-07-18",
			age: 25,
		},
	],
	page: 1,
	pageSize: 10,
	totalElements: 1,
	totalPages: 1,
};

const renderWithRouteFeedback = (ui: ReactElement) => {
	const queryClient = createTestQueryClient();

	return render(
		<QueryClientProvider client={queryClient}>
			<MemoryRouter
				initialEntries={[
					{
						pathname: "/pessoas",
						state: { feedbackMessage: "Pessoa cadastrada com sucesso." },
					},
				]}
			>
				{ui}
			</MemoryRouter>
		</QueryClientProvider>,
	);
};

describe("PeopleConsultPage", () => {
	it("renderiza pessoas retornadas pela API", async () => {
		server.use(
			http.get(`*${API_ENDPOINTS.people}`, () =>
				HttpResponse.json(pagedPeople),
			),
		);

		renderWithProviders(<PeopleConsultPage />);

		expect(screen.getByRole("status")).toBeInTheDocument();
		expect(await screen.findByText("Raphael Muniz")).toBeInTheDocument();
	});

	it("renderiza estado vazio quando a API retorna lista vazia", async () => {
		server.use(
			http.get(`*${API_ENDPOINTS.people}`, () =>
				HttpResponse.json({
					content: [],
					page: 1,
					pageSize: 10,
					totalElements: 0,
					totalPages: 0,
				}),
			),
		);

		renderWithProviders(<PeopleConsultPage />);

		expect(
			await screen.findByText("Nenhuma pessoa cadastrada ainda."),
		).toBeInTheDocument();
	});

	it("permite tentar novamente depois de erro de conexão", async () => {
		const peopleHandler = vi
			.fn()
			.mockImplementationOnce(() => HttpResponse.error())
			.mockImplementationOnce(() => HttpResponse.json(pagedPeople));

		server.use(http.get(`*${API_ENDPOINTS.people}`, peopleHandler));

		renderWithProviders(<PeopleConsultPage />);

		expect(
			await screen.findByText(
				"Não foi possível carregar as pessoas cadastradas.",
			),
		).toBeInTheDocument();
		expect(
			screen.getByText("Tente novamente em alguns instantes."),
		).toBeInTheDocument();
		expect(screen.getByAltText("Ilustração de erro")).toBeInTheDocument();

		await userEvent.click(
			screen.getByRole("button", { name: "Tentar novamente" }),
		);

		await waitFor(() => {
			expect(peopleHandler).toHaveBeenCalledTimes(2);
		});
		expect(await screen.findByText("Raphael Muniz")).toBeInTheDocument();
	});

	it("confirma e exclui pessoa pela API", async () => {
		const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(true);
		const deletePersonHandler = vi.fn(
			() => new HttpResponse(null, { status: 204 }),
		);

		server.use(
			http.get(`*${API_ENDPOINTS.people}`, () =>
				HttpResponse.json(pagedPeople),
			),
			http.delete(
				`*${API_ENDPOINTS.personById(personId)}`,
				deletePersonHandler,
			),
		);

		renderWithProviders(<PeopleConsultPage />);

		await screen.findByText("Raphael Muniz");
		await userEvent.click(screen.getByRole("button", { name: "Excluir" }));

		expect(confirmSpy).toHaveBeenCalledWith(
			"Deseja excluir Raphael Muniz? As transações dessa pessoa também serão removidas.",
		);
		await waitFor(() => {
			expect(deletePersonHandler).toHaveBeenCalledTimes(1);
		});
		expect(
			await screen.findByText("Pessoa excluída com sucesso."),
		).toBeInTheDocument();

		confirmSpy.mockRestore();
	});

	it("exibe feedback de sucesso recebido do cadastro de pessoa", async () => {
		server.use(
			http.get(`*${API_ENDPOINTS.people}`, () =>
				HttpResponse.json({
					content: [],
					page: 1,
					pageSize: 10,
					totalElements: 0,
					totalPages: 0,
				}),
			),
		);

		renderWithRouteFeedback(<PeopleConsultPage />);

		expect(
			await screen.findByText("Pessoa cadastrada com sucesso."),
		).toBeInTheDocument();
	});

	it("carrega paginas sob demanda e reaproveita cache ao voltar", async () => {
		const requestedPages: string[] = [];

		server.use(
			http.get(`*${API_ENDPOINTS.people}`, ({ request }) => {
				const page = new URL(request.url).searchParams.get("page") ?? "1";
				requestedPages.push(page);

				return HttpResponse.json({
					content: [
						{
							id: `${page}${page}${page}${page}${page}${page}${page}${page}-1111-4111-8111-111111111111`,
							name: `Pessoa pagina ${page}`,
							birthDate: "2001-07-18",
							age: 25,
						},
					],
					page: Number(page),
					pageSize: 10,
					totalElements: 20,
					totalPages: 20,
				});
			}),
		);

		renderWithProviders(<PeopleConsultPage />);

		expect(await screen.findByText("Pessoa pagina 1")).toBeInTheDocument();
		expect(requestedPages).toEqual(["1"]);

		await userEvent.click(screen.getByText("2"));

		expect(await screen.findByText("Pessoa pagina 2")).toBeInTheDocument();
		expect(requestedPages).toEqual(["1", "2"]);

		await userEvent.click(screen.getByText("1"));

		expect(await screen.findByText("Pessoa pagina 1")).toBeInTheDocument();
		expect(requestedPages).toEqual(["1", "2"]);
		expect(requestedPages).not.toContain("3");
	});
});
