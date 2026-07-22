import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { describe, expect, it, vi } from "vitest";
import { API_ENDPOINTS } from "../../../../shared/api/apiEndpoints";
import { renderWithProviders } from "../../../../test/renderWithProviders";
import { server } from "../../../../test/server";
import { TransactionType } from "../../types/transaction";
import TransactionRegisterPage from "./TransactionRegisterPage";

const adultPersonId = "11111111-1111-4111-8111-111111111111";
const underAgePersonId = "22222222-2222-4222-8222-222222222222";
const localPersonId = "person-1";

const people = [
	{
		id: adultPersonId,
		name: "Maria Oliveira",
		birthDate: "1994-07-18",
		age: 32,
	},
	{
		id: underAgePersonId,
		name: "Joao Souza",
		birthDate: "2011-07-18",
		age: 15,
	},
];

const pagedPeople = {
	content: people,
	page: 1,
	pageSize: 10,
	totalElements: 2,
	totalPages: 1,
};

describe("TransactionRegisterPage", () => {
	it("exibe estado vazio quando nao ha pessoas cadastradas", async () => {
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

		renderWithProviders(<TransactionRegisterPage />);

		expect(
			await screen.findByText("Nenhuma pessoa encontrada."),
		).toBeInTheDocument();
	});

	it("corrige receita para despesa quando a pessoa selecionada e menor de idade", async () => {
		const createTransactionHandler = vi.fn(async ({ request }) => {
			const body = (await request.json()) as {
				personId: string;
				type: number;
				description: string;
				amount: number;
				transactionDate: string;
			};

			expect(body).toMatchObject({
				personId: underAgePersonId,
				type: TransactionType.Expense,
				description: "Mesada",
				amount: 50,
				transactionDate: expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/),
			});

			return HttpResponse.json({
				data: {
					id: "33333333-3333-4333-8333-333333333333",
					...body,
				},
				links: {},
			});
		});

		server.use(
			http.get(`*${API_ENDPOINTS.people}`, () =>
				HttpResponse.json(pagedPeople),
			),
			http.post(`*${API_ENDPOINTS.transactions}`, createTransactionHandler),
		);

		renderWithProviders(<TransactionRegisterPage />);

		await userEvent.click(await screen.findByLabelText("Pessoa"));
		await userEvent.click(
			screen.getByRole("option", { name: "Maria Oliveira" }),
		);

		await userEvent.click(screen.getByRole("radio", { name: "Receita" }));

		await userEvent.click(screen.getByLabelText("Pessoa"));
		await userEvent.click(screen.getByRole("option", { name: "Joao Souza" }));

		expect(
			screen.getByRole("radio", { name: "Receita" }),
		).toBeDisabled();

		await userEvent.type(screen.getByLabelText("Descrição"), "Mesada");
		await userEvent.clear(screen.getByLabelText("Valor"));
		await userEvent.type(screen.getByLabelText("Valor"), "50");
		await userEvent.click(screen.getByRole("button", { name: /salvar/i }));

		await waitFor(() => {
			expect(createTransactionHandler).toHaveBeenCalledTimes(1);
		});
	}, 10000);

	it("seleciona pessoa pelo UUID, limpa validacao e envia payload correto", async () => {
		const createTransactionHandler = vi.fn(async ({ request }) => {
			const body = (await request.json()) as {
				personId: string;
				type: number;
				description: string;
				amount: number;
				transactionDate: string;
			};

			expect(body).toMatchObject({
				personId: adultPersonId,
				type: TransactionType.Expense,
				description: "Aluguel",
				amount: 1200,
				transactionDate: expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/),
			});

			return HttpResponse.json({
				data: {
					id: "33333333-3333-4333-8333-333333333333",
					...body,
				},
				links: {},
			});
		});

		server.use(
			http.get(`*${API_ENDPOINTS.people}`, () =>
				HttpResponse.json(pagedPeople),
			),
			http.post(`*${API_ENDPOINTS.transactions}`, createTransactionHandler),
		);

		renderWithProviders(<TransactionRegisterPage />);

		await screen.findByLabelText("Pessoa");
		await userEvent.click(screen.getByRole("button", { name: /salvar/i }));
		expect(
			await screen.findByText("Selecione uma pessoa."),
		).toBeInTheDocument();

		await userEvent.click(screen.getByLabelText("Pessoa"));
		await userEvent.click(
			screen.getByRole("option", { name: "Maria Oliveira" }),
		);

		expect(screen.getByDisplayValue("Maria Oliveira")).toBeInTheDocument();
		await waitFor(() => {
			expect(
				screen.queryByText("Selecione uma pessoa."),
			).not.toBeInTheDocument();
		});

		await userEvent.type(screen.getByLabelText(/Descri/i), "Aluguel");
		await userEvent.clear(screen.getByLabelText("Valor"));
		await userEvent.type(screen.getByLabelText("Valor"), "1200");
		await userEvent.click(screen.getByRole("button", { name: /salvar/i }));

		await waitFor(() => {
			expect(createTransactionHandler).toHaveBeenCalledTimes(1);
		});
	});

	it("aceita pessoa selecionada com id textual", async () => {
		const createTransactionHandler = vi.fn(async ({ request }) => {
			const body = (await request.json()) as {
				personId: string;
				type: number;
				description: string;
				amount: number;
				transactionDate: string;
			};

			expect(body).toMatchObject({
				personId: localPersonId,
				description: "Mercado",
				amount: 80,
			});

			return HttpResponse.json({
				data: {
					id: "33333333-3333-4333-8333-333333333333",
					...body,
				},
				links: {},
			});
		});

		server.use(
			http.get(`*${API_ENDPOINTS.people}`, () =>
				HttpResponse.json({
					content: [
						{
							id: localPersonId,
							name: "Pessoa Local",
							birthDate: "1990-01-01",
							age: 36,
						},
					],
					page: 1,
					pageSize: 10,
					totalElements: 1,
					totalPages: 1,
				}),
			),
			http.post(`*${API_ENDPOINTS.transactions}`, createTransactionHandler),
		);

		renderWithProviders(<TransactionRegisterPage />);

		await userEvent.click(await screen.findByLabelText("Pessoa"));
		await userEvent.click(screen.getByRole("option", { name: "Pessoa Local" }));
		await userEvent.type(screen.getByLabelText(/Descri/i), "Mercado");
		await userEvent.clear(screen.getByLabelText("Valor"));
		await userEvent.type(screen.getByLabelText("Valor"), "80");
		await userEvent.click(screen.getByRole("button", { name: /salvar/i }));

		await waitFor(() => {
			expect(createTransactionHandler).toHaveBeenCalledTimes(1);
		});
	});
});
