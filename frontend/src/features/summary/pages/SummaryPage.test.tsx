import { screen } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import { API_ENDPOINTS } from "../../../shared/api/apiEndpoints";
import { renderWithProviders } from "../../../test/renderWithProviders";
import { server } from "../../../test/server";
import SummaryPage from "./SummaryPage";

const personId = "11111111-1111-4111-8111-111111111111";

const setupHandlers = () => {
	server.use(
		http.get(`*${API_ENDPOINTS.financialSummary}`, () =>
			HttpResponse.json({
				totalRevenue: 10000,
				totalExpense: 3500,
				balance: 6500,
				people: {
					content: [
						{
							personId,
							name: "Raphael Muniz",
							totalRevenue: 2000,
							totalExpense: 300,
							balance: 1700,
						},
					],
					page: 1,
					pageSize: 10,
					totalElements: 1,
					totalPages: 1,
				},
			}),
		),
	);
};

describe("SummaryPage", () => {
	it("renderiza resumo financeiro usando o endpoint agregado", async () => {
		setupHandlers();

		renderWithProviders(<SummaryPage />);

		expect(
			await screen.findByRole("heading", { name: "Raphael Muniz" }),
		).toBeInTheDocument();
		expect(screen.getByText(/R\$\s*10.000,00/)).toBeInTheDocument();
		expect(screen.getAllByText(/R\$\s*2.000,00/)[0]).toBeInTheDocument();
		expect(screen.getAllByText(/R\$\s*300,00/)[0]).toBeInTheDocument();
	});

	it("não renderiza a ação de análise removida", async () => {
		setupHandlers();

		renderWithProviders(<SummaryPage />);

		await screen.findByRole("heading", { name: "Raphael Muniz" });
		const removedActionName = ["Analisar", "transações"].join(" ");
		expect(
			screen.queryByRole("button", { name: new RegExp(removedActionName, "i") }),
		).not.toBeInTheDocument();
	});
});
