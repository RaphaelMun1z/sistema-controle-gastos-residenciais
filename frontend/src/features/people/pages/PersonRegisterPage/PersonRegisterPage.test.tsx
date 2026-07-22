import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { describe, expect, it, vi } from "vitest";
import { API_ENDPOINTS } from "../../../../shared/api/apiEndpoints";
import { renderWithProviders } from "../../../../test/renderWithProviders";
import { server } from "../../../../test/server";
import PersonRegisterPage from "./PersonRegisterPage";

describe("PersonRegisterPage", () => {
	it("envia cadastro de pessoa para a API", async () => {
		const createPersonHandler = vi.fn(async ({ request }) => {
			const body = (await request.json()) as {
				name: string;
				birthDate: string;
			};

			expect(body).toEqual({
				name: "Maria Souza",
				birthDate: "1994-07-18",
			});

			return HttpResponse.json({
				data: {
					id: "11111111-1111-4111-8111-111111111111",
					age: 32,
					...body,
				},
				links: {},
			});
		});

		server.use(http.post(`*${API_ENDPOINTS.people}`, createPersonHandler));

		renderWithProviders(<PersonRegisterPage />);

		await userEvent.type(screen.getByLabelText("Nome"), "Maria Souza");
		await userEvent.type(
			screen.getByLabelText("Data de nascimento"),
			"1994-07-18",
		);
		await userEvent.click(screen.getByRole("button", { name: /salvar/i }));

		await waitFor(() => {
			expect(createPersonHandler).toHaveBeenCalledTimes(1);
		});
	});

	it("exibe erro amigável quando cadastro falha", async () => {
		server.use(
			http.post(
				`*${API_ENDPOINTS.people}`,
				() => new HttpResponse(null, { status: 409 }),
			),
		);

		renderWithProviders(<PersonRegisterPage />);

		await userEvent.type(screen.getByLabelText("Nome"), "Maria Souza");
		await userEvent.type(
			screen.getByLabelText("Data de nascimento"),
			"1994-07-18",
		);
		await userEvent.click(screen.getByRole("button", { name: /salvar/i }));

		expect(
			await screen.findByText(
				"Já existe uma pessoa cadastrada com essas informações.",
			),
		).toBeInTheDocument();
	});
	it("exibe detalhe limpo do ProblemDetails quando data de nascimento e futura", async () => {
		server.use(
			http.post(`*${API_ENDPOINTS.people}`, () =>
				HttpResponse.json(
					{
						title: "Requisicao invalida",
						status: 400,
						detail:
							"A data de nascimento nao pode ser uma data futura (Parameter 'birthDate')",
						instance: "/api/v1/people",
					},
					{
						status: 400,
						headers: { "Content-Type": "application/problem+json" },
					},
				),
			),
		);

		renderWithProviders(<PersonRegisterPage />);

		await userEvent.type(screen.getByLabelText("Nome"), "Maria Souza");
		await userEvent.type(
			screen.getByLabelText("Data de nascimento"),
			"2099-07-18",
		);
		await userEvent.click(screen.getByRole("button", { name: /salvar/i }));

		expect(
			await screen.findByText(
				"A data de nascimento nao pode ser uma data futura.",
			),
		).toBeInTheDocument();
		expect(
			screen.queryByText("Alguns dados precisam de atenÃ§Ã£o."),
		).not.toBeInTheDocument();
		expect(screen.queryByText(/Parameter 'birthDate'/)).not.toBeInTheDocument();
	});
});
