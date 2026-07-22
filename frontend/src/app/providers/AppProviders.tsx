import type { ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { queryClient } from "../query/queryClient";
import { theme } from "../theme/theme";
import { AuthProvider } from "../../features/authentication/providers/AuthProvider";

interface AppProvidersProps {
	children: ReactNode;
}

const AppProviders = ({ children }: AppProvidersProps) => {
	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<AuthProvider>{children}</AuthProvider>
			</ThemeProvider>
		</QueryClientProvider>
	);
};

export default AppProviders;
