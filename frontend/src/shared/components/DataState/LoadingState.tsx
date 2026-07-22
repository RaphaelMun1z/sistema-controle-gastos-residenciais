import { Skeleton } from "@mui/material";
import "./DataState.scss";

interface LoadingStateProps {
	label: string;
}

const LoadingState = ({ label }: LoadingStateProps) => {
	return (
		<div className="data-state data-state--loading" role="status" aria-label={label}>
			<Skeleton animation="wave" width="60%" height={28} />
			<Skeleton animation="wave" width="100%" height={44} />
			<Skeleton animation="wave" width="90%" height={44} />
		</div>
	);
};

export default LoadingState;
