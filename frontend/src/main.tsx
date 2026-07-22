import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/global.scss";
import { RouterProvider } from "react-router";
import { router } from "./app/routes.tsx";
import AppProviders from "./app/providers/AppProviders";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<AppProviders>
			<RouterProvider router={router} />
		</AppProviders>
	</StrictMode>,
);
