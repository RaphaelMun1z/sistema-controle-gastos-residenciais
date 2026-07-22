import { Navigate, Outlet, useLocation } from "react-router";
import { ROUTES } from "../../../app/routes/paths";
import { env } from "../../../shared/config/env";
import PageSkeleton from "../../../shared/components/skeletons/PageSkeleton";
import { useAuth } from "../hooks/useAuth";

const PrivateRoute = () => {
	const { isAuthenticated, isLoading } = useAuth();
	const location = useLocation();

	if (env.bypassAuth) {
		return <Outlet />;
	}

	if (isLoading) {
		return <PageSkeleton />;
	}

	if (!isAuthenticated) {
		return <Navigate to={ROUTES.signIn} replace state={{ from: location }} />;
	}

	return <Outlet />;
};

export default PrivateRoute;
