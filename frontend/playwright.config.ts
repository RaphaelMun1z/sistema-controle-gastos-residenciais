import { defineConfig, devices } from "@playwright/test";
import { loadEnv } from "vite";

const viteEnv = loadEnv("test", process.cwd(), "VITE_");
process.env.VITE_BYPASS_AUTH ??= viteEnv.VITE_BYPASS_AUTH;

export default defineConfig({
	testDir: "./tests/e2e",
	webServer: {
		command: "npm run dev -- --host 127.0.0.1",
		url: "http://127.0.0.1:5173",
		reuseExistingServer: true,
		env: {
			...process.env,
			...viteEnv,
		},
	},
	use: {
		baseURL: "http://127.0.0.1:5173",
		trace: "on-first-retry",
	},
	projects: [
		{
			name: "desktop",
			use: {
				...devices["Desktop Chrome"],
				viewport: { width: 1280, height: 720 },
			},
		},
		{
			name: "tablet",
			use: {
				...devices["Desktop Chrome"],
				viewport: { width: 768, height: 1024 },
			},
		},
		{
			name: "mobile",
			use: {
				...devices["Desktop Chrome"],
				viewport: { width: 375, height: 812 },
				isMobile: true,
			},
		},
	],
});
