import { render, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PageTitle from "./PageTitle";

describe("PageTitle", () => {
	it("atualiza o título do documento com o padrão da aplicação", async () => {
		render(
			<PageTitle title="Pessoas">
				<div>Pessoas</div>
			</PageTitle>,
		);

		await waitFor(() => {
			expect(document.title).toBe("Sistema de Gastos | Pessoas");
		});
	});
});
