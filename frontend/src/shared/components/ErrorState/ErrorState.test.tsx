import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import ErrorState from "./ErrorState";

describe("ErrorState", () => {
	it("renderiza título, descrição e imagem", () => {
		render(
			<ErrorState
				title="Não foi possível carregar suas transações."
				description="Tente novamente em alguns instantes."
			/>,
		);

		expect(
			screen.getByRole("heading", {
				name: "Não foi possível carregar suas transações.",
			}),
		).toBeInTheDocument();
		expect(
			screen.getByText("Tente novamente em alguns instantes."),
		).toBeInTheDocument();
		expect(screen.getByAltText("Ilustração de erro")).toBeInTheDocument();
	});

	it("executa ação de tentar novamente", async () => {
		const onRetry = vi.fn();

		render(
			<ErrorState
				title="Não foi possível carregar as pessoas cadastradas."
				description="Tente novamente em alguns instantes."
				onRetry={onRetry}
			/>,
		);

		await userEvent.click(
			screen.getByRole("button", { name: "Tentar novamente" }),
		);

		expect(onRetry).toHaveBeenCalledTimes(1);
	});

	it("não renderiza botão quando não há ação", () => {
		render(
			<ErrorState
				title="Algo deu errado."
				description="Não conseguimos concluir essa ação agora."
			/>,
		);

		expect(screen.queryByRole("button")).not.toBeInTheDocument();
	});
});
