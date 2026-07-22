import { Paper, Skeleton } from "@mui/material";
import "./Skeletons.scss";

interface TableSkeletonProps {
	columns?: number;
	rows?: number;
	hasActions?: boolean;
}

const TableSkeleton = ({
	columns = 4,
	rows = 5,
	hasActions = true,
}: TableSkeletonProps) => {
	const totalColumns = columns + (hasActions ? 1 : 0);

	return (
		<div className="table-skeleton" role="status" aria-label="Carregando dados">
			<Paper elevation={0} className="table-skeleton__surface">
				<div
					className="table-skeleton__row table-skeleton__row--header"
					style={{ gridTemplateColumns: `repeat(${totalColumns}, minmax(120px, 1fr))` }}
				>
					{Array.from({ length: totalColumns }).map((_, index) => (
						<Skeleton key={index} animation="wave" height={24} />
					))}
				</div>

				{Array.from({ length: rows }).map((_, rowIndex) => (
					<div
						key={rowIndex}
						className="table-skeleton__row"
						style={{ gridTemplateColumns: `repeat(${totalColumns}, minmax(120px, 1fr))` }}
					>
						{Array.from({ length: totalColumns }).map((_, columnIndex) => (
							<Skeleton
								key={columnIndex}
								animation="wave"
								height={22}
								width={columnIndex === totalColumns - 1 && hasActions ? 72 : "85%"}
							/>
						))}
					</div>
				))}
			</Paper>
		</div>
	);
};

export default TableSkeleton;
