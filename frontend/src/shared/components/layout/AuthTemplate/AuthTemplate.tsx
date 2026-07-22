import "./AuthTemplate.scss";

// Assets
import logo from "../../../../assets/images/rm-logo-branco.png";
import pagePreview from "../../../../assets/images/preview.png";

// React Router
import { Outlet } from "react-router";

const AuthTemplate = () => {
	return (
		<section className="auth-container">
			<div className="left-container">
				<div className="content-container">
					<header>
						<img src={logo} alt="Logo Raphael Muniz" />

						<h1 className="title">
							Sistema de Controle de Gastos Residenciais
						</h1>

						<p className="description">
							Gerencie suas receitas e despesas de forma simples,
							acompanhe seus gastos e tenha uma visão clara da sua
							vida financeira.
						</p>
					</header>

					<div className="image-container">
						<img src={pagePreview} alt="Preview do Sistema" />
					</div>
				</div>
			</div>

			<div className="right-container">
				<Outlet />
			</div>
		</section>
	);
};

export default AuthTemplate;
