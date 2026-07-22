import { useEffect, type ReactNode } from "react";
import { formatPageTitle } from "../../../app/routes/pageTitles";

interface PageTitleProps {
	title?: string;
	children: ReactNode;
}

const PageTitle = ({ title, children }: PageTitleProps) => {
	useEffect(() => {
		document.title = formatPageTitle(title);
	}, [title]);

	return children;
};

export default PageTitle;
