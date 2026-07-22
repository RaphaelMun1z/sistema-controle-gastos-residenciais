import type { ReactNode } from "react";

// Componentes do Material UI
import {
	IconButton,
	Paper,
	Table as MuiTable,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Tooltip,
} from "@mui/material";

// Interfaces
interface AccessorTableColumn<T> {
	key: keyof T;
	label: ReactNode;
	align?: "left" | "center" | "right";
	render?: never;
}

interface RenderTableColumn<T> {
	key: string;
	label: ReactNode;
	align?: "left" | "center" | "right";
	render: (row: T) => ReactNode;
}

export type TableColumn<T> = AccessorTableColumn<T> | RenderTableColumn<T>;

export interface TableAction<T> {
	label: string;
	icon: ReactNode;
	color?:
		| "inherit"
		| "primary"
		| "secondary"
		| "error"
		| "info"
		| "success"
		| "warning";
	onClick: (row: T) => void;
}

interface TableProps<T> {
	columns: TableColumn<T>[];
	rows: T[];
	getRowId: (row: T) => string | number;
	actions?: TableAction<T>[];
	emptyMessage?: string;
}

const Table = <T,>({
	columns,
	rows,
	getRowId,
	actions = [],
	emptyMessage = "Nenhum registro encontrado.",
}: TableProps<T>) => {
	return (
		<TableContainer
			component={Paper}
			elevation={0}
			sx={{
				backgroundColor: "#fff",
				maxWidth: "100%",
				overflowX: "auto",
				border: "1px solid #e5e7eb",
				borderRadius: "8px",
			}}
		>
			<MuiTable sx={{ minWidth: 640 }}>
				<TableHead>
					<TableRow
						sx={{
							backgroundColor: "#f8fafc",
						}}
					>
						{columns.map((column) => (
							<TableCell
								key={String(column.key)}
								align={column.align ?? "left"}
								sx={{
									color: "#374151",
									fontSize: "0.78rem",
									fontWeight: 700,
									borderBottom: "1px solid #d1d5db",
								}}
							>
								{column.label}
							</TableCell>
						))}

						{actions.length > 0 && (
							<TableCell
								align="center"
								sx={{
									color: "#374151",
									fontSize: "0.78rem",
									fontWeight: 700,
									borderBottom: "1px solid #d1d5db",
								}}
							>
								Ações
							</TableCell>
						)}
					</TableRow>
				</TableHead>

				<TableBody>
					{rows.length > 0 ? (
						rows.map((row) => (
							<TableRow
								key={getRowId(row)}
								hover
								sx={{
									"&:nth-of-type(odd)": {
										backgroundColor: "#ffffff",
									},
									"&:nth-of-type(even)": {
										backgroundColor: "#f9fafb",
									},
									"&:hover": {
										backgroundColor: "#f3f4f6 !important",
									},
								}}
							>
								{columns.map((column) => (
									<TableCell
										key={String(column.key)}
										align={column.align ?? "left"}
										sx={{
											borderBottom: "1px solid #e5e7eb",
											color: "#374151",
										}}
									>
										{column.render
											? column.render(row)
											: String(
													row[
														column.key as keyof T
													] ?? "",
												)}
									</TableCell>
								))}

								{actions.length > 0 && (
									<TableCell align="center">
										{actions.map((action) => (
											<Tooltip
												key={action.label}
												title={action.label}
											>
												<IconButton
													aria-label={action.label}
													color={action.color}
													onClick={() =>
														action.onClick(row)
													}
													sx={{ minWidth: 44, minHeight: 44 }}
												>
													{action.icon}
												</IconButton>
											</Tooltip>
										))}
									</TableCell>
								)}
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell
								colSpan={
									columns.length +
									(actions.length > 0 ? 1 : 0)
								}
								align="center"
							>
								{emptyMessage}
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</MuiTable>
		</TableContainer>
	);
};

export default Table;
