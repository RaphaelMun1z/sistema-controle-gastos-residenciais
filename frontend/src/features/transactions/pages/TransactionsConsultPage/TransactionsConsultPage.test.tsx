import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { describe, expect, it, vi } from "vitest";
import { API_ENDPOINTS } from "../../../../shared/api/apiEndpoints";
import { renderWithProviders } from "../../../../test/renderWithProviders";
import { server } from "../../../../test/server";
import { TransactionType } from "../../types/transaction";
import TransactionsConsultPage from "./TransactionsConsultPage";

const personId = "11111111-1111-4111-8111-111111111111";

const transaction = {
	id: "22222222-2222-4222-8222-222222222222",
	personId,
	personName: "Maria Oliveira",
	description: "Salario",
	type: TransactionType.Revenue,
	amount: 1500,
	transactionDate: "2026-07-21",
	createdAt: "2026-07-21T10:00:00Z",
};

const pagedTransactions = {
	content: [transaction],
	page: 1,
	pageSize: 10,
	totalElements: 1,
	totalPages: 1,
};

const pagedPeople = {
	content: [
		{
			id: personId,
			name: "Maria Oliveira",
			birthDate: "1994-07-18",
			age: 32,
		},
	],
	page: 1,
	pageSize: 10,
	totalElements: 1,
	totalPages: 1,
};

describe("TransactionsConsultPage", () => {
	it("exibe loading e renderiza transacoes retornadas pela API", async () => {
		server.use(
			http.get(`*${API_ENDPOINTS.transactions}`, async () => {
				await new Promise((resolve) => globalThis.setTimeout(resolve, 100));

				return HttpResponse.json(pagedTransactions);
			}),
		);

		renderWithProviders(<TransactionsConsultPage />);

		expect(
			screen.getByRole("status", { name: "Carregando dados" }),
		).toBeInTheDocument();
		expect(await screen.findByText("Maria Oliveira")).toBeInTheDocument();
		expect(screen.getByText("Salario")).toBeInTheDocument();
		expect(screen.getByText("Receita")).toBeInTheDocument();
		expect(screen.getByText("21/07/2026")).toBeInTheDocument();
		expect(screen.getByText(/R\$\s*1.500,00/)).toBeInTheDocument();
	});

	it("renderiza estado vazio quando a API retorna lista vazia", async () => {
		server.use(
			http.get(`*${API_ENDPOINTS.transactions}`, () =>
				HttpResponse.json({
					content: [],
					page: 1,
					pageSize: 10,
					totalElements: 0,
					totalPages: 0,
				}),
			),
		);

		renderWithProviders(<TransactionsConsultPage />);

		expect(
			await screen.findByText("Nenhuma transação encontrada."),
		).toBeInTheDocument();
	});

	it("exibe erro e permite tentar novamente", async () => {
		const transactionsHandler = vi
			.fn()
			.mockImplementationOnce(() => HttpResponse.error())
			.mockImplementationOnce(() => HttpResponse.json(pagedTransactions));

		server.use(http.get(`*${API_ENDPOINTS.transactions}`, transactionsHandler));

		renderWithProviders(<TransactionsConsultPage />);

		expect(
			await screen.findByText("Não foi possível carregar suas transações."),
		).toBeInTheDocument();

		await userEvent.click(
			screen.getByRole("button", { name: "Tentar novamente" }),
		);

		await waitFor(() => {
			expect(transactionsHandler).toHaveBeenCalledTimes(2);
		});
		expect(await screen.findByText("Maria Oliveira")).toBeInTheDocument();
	});

	it("carrega paginas sob demanda e reaproveita cache ao voltar", async () => {
		const requestedPages: string[] = [];

		server.use(
			http.get(`*${API_ENDPOINTS.transactions}`, ({ request }) => {
				const page = new URL(request.url).searchParams.get("page") ?? "1";
				requestedPages.push(page);

				return HttpResponse.json({
					content: [
						{
							...transaction,
							id: `${page}${page}${page}${page}${page}${page}${page}${page}-2222-4222-8222-222222222222`,
							description: `Transacao pagina ${page}`,
						},
					],
					page: Number(page),
					pageSize: 10,
					totalElements: 20,
					totalPages: 20,
				});
			}),
		);

		renderWithProviders(<TransactionsConsultPage />);

		expect(await screen.findByText("Transacao pagina 1")).toBeInTheDocument();
		expect(requestedPages).toEqual(["1"]);

		await userEvent.click(screen.getByText("2"));

		expect(await screen.findByText("Transacao pagina 2")).toBeInTheDocument();
		expect(requestedPages).toEqual(["1", "2"]);

		await userEvent.click(screen.getByText("1"));

		expect(await screen.findByText("Transacao pagina 1")).toBeInTheDocument();
		expect(requestedPages).toEqual(["1", "2"]);
		expect(requestedPages).not.toContain("3");
	});

	it("filtra transacoes por pessoa selecionada", async () => {
		const transactionsByPersonHandler = vi.fn(() =>
			HttpResponse.json({
				content: [
					{
						...transaction,
						description: "Mercado da Maria",
					},
				],
				page: 1,
				pageSize: 10,
				totalElements: 1,
				totalPages: 1,
			}),
		);

		server.use(
			http.get(`*${API_ENDPOINTS.people}`, () =>
				HttpResponse.json(pagedPeople),
			),
			http.get(`*${API_ENDPOINTS.transactions}`, () =>
				HttpResponse.json({
					content: [],
					page: 1,
					pageSize: 10,
					totalElements: 0,
					totalPages: 0,
				}),
			),
			http.get(
				`*${API_ENDPOINTS.transactionsByPerson(personId)}`,
				transactionsByPersonHandler,
			),
		);

		renderWithProviders(<TransactionsConsultPage />);

		await userEvent.click(await screen.findByLabelText("Filtrar por pessoa"));
		await userEvent.click(
			await screen.findByRole("option", { name: "Maria Oliveira" }),
		);

		expect(await screen.findByText("Mercado da Maria")).toBeInTheDocument();
		expect(transactionsByPersonHandler).toHaveBeenCalledTimes(1);
	});
});
