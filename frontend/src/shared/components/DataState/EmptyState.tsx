import "./DataState.scss";

interface EmptyStateProps {
	title: string;
	description?: string;
	image?: string;
	imageAlt?: string;
}

const EmptyState = ({
	title,
	description,
	image,
	imageAlt = "",
}: EmptyStateProps) => {
	return (
		<div className={`data-state ${image ? "data-state--illustrated" : ""}`.trim()}>
			{image && <img src={image} alt={imageAlt} className="data-state__image" />}
			<div className="data-state__content">
				<h2>{title}</h2>
				{description && <p>{description}</p>}
			</div>
		</div>
	);
};

export default EmptyState;
