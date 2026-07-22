import FeedbackState from "../FeedbackState/FeedbackState";
import { defaultSystemErrorImage } from "./errorStateAssets";

interface ErrorStateProps {
	title: string;
	description: string;
	image?: string;
	imageAlt?: string;
	actionLabel?: string;
	onRetry?: () => void;
	secondaryActionLabel?: string;
	onSecondaryAction?: () => void;
}

const ErrorState = ({
	title,
	description,
	image = defaultSystemErrorImage,
	imageAlt = "Ilustração de erro",
	actionLabel = "Tentar novamente",
	onRetry,
	secondaryActionLabel,
	onSecondaryAction,
}: ErrorStateProps) => {
	return (
		<div role="alert">
			<FeedbackState
				title={title}
				description={description}
				image={image}
				imageAlt={imageAlt}
				primaryAction={
					onRetry
						? {
								label: actionLabel,
								onClick: onRetry,
							}
						: undefined
				}
				secondaryAction={
					onSecondaryAction && secondaryActionLabel
						? {
								label: secondaryActionLabel,
								onClick: onSecondaryAction,
							}
						: undefined
				}
				className="error-state"
			/>
		</div>
	);
};

export default ErrorState;
