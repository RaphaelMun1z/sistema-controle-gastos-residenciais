import { Skeleton } from "@mui/material";
import "./Skeletons.scss";

const PageSkeleton = () => {
	return (
		<div className="page-skeleton" role="status" aria-label="Carregando página">
			<Skeleton animation="wave" width={180} height={24} />
			<Skeleton animation="wave" width="min(420px, 85%)" height={56} />
			<Skeleton animation="wave" width={160} height={40} />
			<div className="page-skeleton__content">
				<Skeleton animation="wave" height={58} />
				<Skeleton animation="wave" height={58} />
				<Skeleton animation="wave" height={58} />
			</div>
		</div>
	);
};

export default PageSkeleton;
