import { describe, expect, it, vi } from "vitest";
import { http, HttpResponse } from "msw";
import { API_ENDPOINTS } from "../../../shared/api/apiEndpoints";
import { server } from "../../../test/server";
import { summaryService } from "./summaryService";

describe("summaryService", () => {
	it("usa o endpoint agregado de resumo financeiro com filtros reais", async () => {
		const handler = vi.fn(({ request }) => {
			const url = new URL(request.url);

			expect(url.searchParams.get("page")).toBe("2");
			expect(url.searchParams.get("pageSize")).toBe("10");
			expect(url.searchParams.get("startDate")).toBe("2026-01-01");
			expect(url.searchParams.get("endDate")).toBe("2026-07-31");

			return HttpResponse.json({
				totalRevenue: 10000,
				totalExpense: 3500,
				balance: 6500,
				people: {
					content: [
						{
							personId: "11111111-1111-4111-8111-111111111111",
							name: "Raphael Muniz",
							totalRevenue: 2000,
							totalExpense: 500,
							balance: 1500,
						},
					],
					page: 2,
					pageSize: 10,
					totalElements: 15,
					totalPages: 2,
				},
			});
		});

		server.use(http.get(`*${API_ENDPOINTS.financialSummary}`, handler));

		const summary = await summaryService.getSummary({
			page: 2,
			pageSize: 10,
			startDate: "2026-01-01",
			endDate: "2026-07-31",
		});

		expect(handler).toHaveBeenCalledTimes(1);
		expect(summary.totalRevenue).toBe(10000);
		expect(summary.people.content[0]?.totalRevenue).toBe(2000);
	});
});
