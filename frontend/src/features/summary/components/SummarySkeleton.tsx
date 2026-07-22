import { Skeleton } from "@mui/material";

const SummarySkeleton = () => {
	return (
		<div className="summary-skeleton" role="status" aria-label="Carregando resumo financeiro">
			<div className="summary-skeleton__filters">
				<Skeleton animation="wave" width={120} height={32} />
				<Skeleton animation="wave" height={40} />
				<Skeleton animation="wave" height={40} />
				<Skeleton animation="wave" height={40} />
				<Skeleton animation="wave" height={40} />
			</div>

			<div className="summary-skeleton__layout">
				<div className="summary-skeleton__cards">
					{Array.from({ length: 2 }).map((_, cardIndex) => (
						<div className="summary-skeleton__card" key={cardIndex}>
							<Skeleton animation="wave" width={180} height={34} />
							{Array.from({ length: 3 }).map((__, rowIndex) => (
								<div className="summary-skeleton__item" key={rowIndex}>
									<Skeleton animation="wave" variant="circular" width={42} height={42} />
									<Skeleton animation="wave" width="45%" height={34} />
									<Skeleton animation="wave" width={120} height={28} />
								</div>
							))}
						</div>
					))}
				</div>

				<aside className="summary-skeleton__aside">
					<Skeleton animation="wave" width={130} height={32} />
					<Skeleton animation="wave" height={38} />
					<Skeleton animation="wave" height={38} />
					<Skeleton animation="wave" height={38} />
					<Skeleton animation="wave" height={170} />
				</aside>
			</div>
		</div>
	);
};

export default SummarySkeleton;
