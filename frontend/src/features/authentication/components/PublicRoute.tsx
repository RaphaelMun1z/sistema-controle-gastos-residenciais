import { Navigate, Outlet } from "react-router";
import { ROUTES } from "../../../app/routes/paths";
import { env } from "../../../shared/config/env";
import PageSkeleton from "../../../shared/components/skeletons/PageSkeleton";
import { useAuth } from "../hooks/useAuth";

const PublicRoute = () => {
	const { isAuthenticated, isLoading } = useAuth();

	if (env.bypassAuth) {
		return <Outlet />;
	}

	if (isLoading) {
		return <PageSkeleton />;
	}

	if (isAuthenticated) {
		return <Navigate to={ROUTES.people} replace />;
	}

	return <Outlet />;
};

export default PublicRoute;
