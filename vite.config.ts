import devtoolsJson from 'vite-plugin-devtools-json';
import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';
import { optimizeCss } from 'carbon-preprocess-svelte';

export default defineConfig({
	plugins: [sveltekit(), optimizeCss(), devtoolsJson()],
	ssr: {
		noExternal: process.env.NODE_ENV === 'production' ? ['sigma'] : []
	},
	css: {
		preprocessorOptions: { scss: { silenceDeprecations: ['global-builtin'] } }
	},
	test: {
		expect: { requireAssertions: true },
		projects: [
			{
				extends: './vite.config.ts',
				test: {
					name: 'server',
					environment: 'node',
					include: ['src/**/*.{test,spec}.{js,ts}'],
					exclude: ['src/**/*.svelte.{test,spec}.{js,ts}']
				}
			}
		]
	},
	optimizeDeps: {
		include: ['@dagrejs/dagre > @dagrejs/graphlib']
	}
});
