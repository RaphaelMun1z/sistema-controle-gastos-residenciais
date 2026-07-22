import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
	palette: {
		primary: {
			main: "#310026",
			dark: "#24001c",
			light: "#4c0f3f",
			contrastText: "#ffffff",
		},
		success: {
			main: "#2e7d32",
		},
		error: {
			main: "#d32f2f",
		},
		background: {
			default: "#f5f5f5",
			paper: "#ffffff",
		},
	},
	typography: {
		fontFamily: '"Poppins", sans-serif',
		button: {
			textTransform: "none",
			fontWeight: 600,
		},
	},
	shape: {
		borderRadius: 8,
	},
	components: {
		MuiButton: {
			styleOverrides: {
				root: {
					boxShadow: "none",
					"&:hover": {
						boxShadow: "none",
					},
				},
			},
		},
		MuiTextField: {
			defaultProps: {
				size: "small",
			},
		},
		MuiFormControl: {
			defaultProps: {
				size: "small",
			},
		},
	},
});
