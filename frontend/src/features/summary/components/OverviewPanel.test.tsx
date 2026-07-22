import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import OverviewPanel from "./OverviewPanel";

describe("OverviewPanel", () => {
	it("renderiza totais gerais recebidos do backend sem textos Positivo ou Negativo", () => {
		render(
			<OverviewPanel
				totalRevenue={10000}
				totalExpense={600}
				balance={9400}
			/>,
		);

		const overview = screen.getByRole("region", { name: "Visão Geral" });

		expect(within(overview).getByText(/R\$\s*10.000,00/)).toBeInTheDocument();
		expect(within(overview).getByText(/-\s*R\$\s*600,00/)).toBeInTheDocument();
		expect(within(overview).getByText(/R\$\s*9.400,00/)).toBeInTheDocument();
		expect(within(overview).queryByText(/Positivo/)).not.toBeInTheDocument();
		expect(within(overview).queryByText(/Negativo/)).not.toBeInTheDocument();
	});

	it("mostra saldo negativo e zero apenas pelo sinal/valor", () => {
		const { rerender } = render(
			<OverviewPanel totalRevenue={100} totalExpense={300} balance={-200} />,
		);

		const overview = screen.getByRole("region", { name: "Visão Geral" });

		expect(within(overview).getByText(/-R\$\s*200,00/)).toBeInTheDocument();
		expect(within(overview).queryByText(/Negativo/)).not.toBeInTheDocument();

		rerender(<OverviewPanel totalRevenue={0} totalExpense={0} balance={0} />);

		expect(within(overview).getAllByText(/R\$\s*0,00/).length).toBeGreaterThan(0);
		expect(within(overview).queryByText(/Positivo|Negativo/)).not.toBeInTheDocument();
	});
});
