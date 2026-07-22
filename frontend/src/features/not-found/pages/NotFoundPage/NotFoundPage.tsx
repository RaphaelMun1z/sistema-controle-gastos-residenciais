import "./NotFoundPage.scss";
import notFoundImage from "../../../../assets/images/notFoundImage.png";
import { useNavigate } from "react-router";
import { ROUTES } from "../../../../app/routes/paths";
import FeedbackState from "../../../../shared/components/FeedbackState/FeedbackState";

const NotFoundPage = () => {
	const navigate = useNavigate();

	return (
		<main className="main-container">
			<FeedbackState
				eyebrow="404"
				title="Página não encontrada."
				description="Não encontramos a página que você tentou acessar."
				image={notFoundImage}
				imageAlt="Imagem - Página não encontrada"
				primaryAction={{
					label: "Ir para Resumo",
					onClick: () => navigate(ROUTES.summary),
				}}
				className="not-found-state"
			/>
		</main>
	);
};

export default NotFoundPage;
