import { Skeleton } from "@mui/material";
import "./Skeletons.scss";

interface FormSkeletonProps {
	fields?: number;
}

const FormSkeleton = ({ fields = 4 }: FormSkeletonProps) => {
	return (
		<div className="form-skeleton" role="status" aria-label="Carregando formulário">
			<div className="form-skeleton__grid">
				{Array.from({ length: fields }).map((_, index) => (
					<Skeleton key={index} animation="wave" height={56} />
				))}
			</div>
			<Skeleton animation="wave" height={92} />
			<div className="form-skeleton__actions">
				<Skeleton animation="wave" width={120} height={40} />
				<Skeleton animation="wave" width={120} height={40} />
			</div>
		</div>
	);
};

export default FormSkeleton;
