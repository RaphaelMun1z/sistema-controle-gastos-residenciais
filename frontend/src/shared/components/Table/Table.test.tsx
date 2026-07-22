import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import DeleteIcon from "@mui/icons-material/Delete";
import Table, { type TableColumn } from "./Table";

interface Row {
	id: number;
	name: string;
}

const columns: TableColumn<Row>[] = [{ key: "name", label: "Nome" }];

describe("Table", () => {
	it("renderiza mensagem de estado vazio", () => {
		render(<Table columns={columns} rows={[]} getRowId={(row) => row.id} />);

		expect(screen.getByText("Nenhum registro encontrado.")).toBeInTheDocument();
	});

	it("executa ação da linha", async () => {
		const onClick = vi.fn();

		render(
			<Table
				columns={columns}
				rows={[{ id: 1, name: "Raphael" }]}
				getRowId={(row) => row.id}
				actions={[
					{
						label: "Excluir",
						icon: <DeleteIcon />,
						onClick,
					},
				]}
			/>,
		);

		await userEvent.click(screen.getByRole("button", { name: "Excluir" }));

		expect(onClick).toHaveBeenCalledWith({ id: 1, name: "Raphael" });
	});
});
