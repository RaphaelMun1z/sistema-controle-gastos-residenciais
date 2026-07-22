import "./PageHeader.scss";

// Componentes do Material UI
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";

// React Router
import { Link as RouterLink } from "react-router";

// Interfaces
interface IHeaderData {
	sector: string;
	sectorPath: string;
	currentPage?: string;
	title?: string;
}

interface PageHeaderProps {
	data: IHeaderData;
}

const PageHeader = ({ data }: PageHeaderProps) => {
	return (
		<header>
			<Breadcrumbs aria-label="breadcrumb">
				<Link
					component={RouterLink}
					to={data.sectorPath}
					underline="hover"
					color="inherit"
				>
					{data.sector}
				</Link>

				<Typography sx={{ color: "text.primary" }}>
					{data.currentPage}
				</Typography>
			</Breadcrumbs>

			<h1 className="page-title">{data.title}</h1>
		</header>
	);
};

export default PageHeader;