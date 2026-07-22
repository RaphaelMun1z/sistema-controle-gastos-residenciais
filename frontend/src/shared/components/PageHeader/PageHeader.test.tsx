import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";
import PageHeader from "./PageHeader";

describe("PageHeader", () => {
	it("renderiza breadcrumb e título", () => {
		render(
			<MemoryRouter>
				<PageHeader
					data={{
						sector: "Pessoas",
						sectorPath: "/pessoas",
						currentPage: "Consultar",
						title: "Pessoas Registradas",
					}}
				/>
			</MemoryRouter>,
		);

		expect(screen.getByRole("link", { name: "Pessoas" })).toHaveAttribute(
			"href",
			"/pessoas",
		);
		expect(
			screen.getByRole("heading", { name: "Pessoas Registradas" }),
		).toBeInTheDocument();
	});
});
