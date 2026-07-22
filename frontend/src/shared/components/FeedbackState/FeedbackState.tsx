import type { ReactNode } from "react";
import { Button } from "@mui/material";
import "./FeedbackState.scss";

interface FeedbackAction {
	label: string;
	onClick: () => void;
	variant?: "text" | "outlined" | "contained";
}

interface FeedbackStateProps {
	title: string;
	description?: string;
	image: string;
	imageAlt?: string;
	eyebrow?: string;
	primaryAction?: FeedbackAction;
	secondaryAction?: FeedbackAction;
	children?: ReactNode;
	className?: string;
}

const FeedbackState = ({
	title,
	description,
	image,
	imageAlt = "",
	eyebrow,
	primaryAction,
	secondaryAction,
	children,
	className = "",
}: FeedbackStateProps) => {
	return (
		<div className={`feedback-state ${className}`.trim()}>
			<div className="feedback-state__content">
				{eyebrow && <span className="feedback-state__eyebrow">{eyebrow}</span>}
				<h1>{title}</h1>
				{description && <p>{description}</p>}
				{children}
			</div>

			<img className="feedback-state__image" src={image} alt={imageAlt} />

			{(primaryAction || secondaryAction) && (
				<div className="feedback-state__actions">
					{primaryAction && (
						<Button
							variant={primaryAction.variant ?? "outlined"}
							onClick={primaryAction.onClick}
							className="feedback-state__primary-action"
						>
							{primaryAction.label}
						</Button>
					)}
					{secondaryAction && (
						<Button
							variant={secondaryAction.variant ?? "text"}
							onClick={secondaryAction.onClick}
						>
							{secondaryAction.label}
						</Button>
					)}
				</div>
			)}
		</div>
	);
};

export default FeedbackState;
