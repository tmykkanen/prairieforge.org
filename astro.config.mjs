// @ts-check

import alpinejs from "@astrojs/alpinejs";
import netlify from "@astrojs/netlify";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
	vite: {
		plugins: [tailwindcss()],
		server: {
			allowedHosts: ["edgar-persuasive-hudson.ngrok-free.dev"],
		},
	},

	integrations: [icon(), alpinejs({ entrypoint: "/src/entrypoints/alpine" })],
	adapter: netlify(),
});
