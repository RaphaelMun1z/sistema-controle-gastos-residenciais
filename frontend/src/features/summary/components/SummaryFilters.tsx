import { Button, TextField } from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import type { SummaryFilters as SummaryFiltersValue } from "../types/summary";

interface SummaryFiltersProps {
	filters: SummaryFiltersValue;
	error?: string;
	onChange: (filters: SummaryFiltersValue) => void;
	onClear: () => void;
}

const SummaryFilters = ({
	filters,
	error,
	onChange,
	onClear,
}: SummaryFiltersProps) => {
	return (
		<div className="summary-filters">
			<div className="filters-header">
				<FilterAltIcon />

				<div>
					<strong>Filtros</strong>
				</div>
			</div>

			<div className="filters-fields">
				<TextField
					label="Data inicial"
					type="date"
					size="small"
					value={filters.startDate}
					error={Boolean(error)}
					helperText={error}
					onChange={(event) =>
						onChange({
							...filters,
							page: 1,
							startDate: event.target.value,
						})
					}
					slotProps={{
						inputLabel: {
							shrink: true,
						},
					}}
				/>

				<TextField
					label="Data final"
					type="date"
					size="small"
					value={filters.endDate}
					error={Boolean(error)}
					onChange={(event) =>
						onChange({
							...filters,
							page: 1,
							endDate: event.target.value,
						})
					}
					slotProps={{
						inputLabel: {
							shrink: true,
						},
					}}
				/>

				<Button
					variant="text"
					startIcon={<RestartAltIcon />}
					onClick={onClear}
					sx={{
						color: "#6b7280",
						textTransform: "none",
					}}
				>
					Limpar
				</Button>
			</div>
		</div>
	);
};

export default SummaryFilters;
