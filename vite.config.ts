import devtoolsJson from 'vite-plugin-devtools-json';
import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';
import { optimizeCss } from 'carbon-preprocess-svelte';
import type { Plugin } from 'vite';

/**
 * HACK: Fixes issue with the CJS reference to @dagrejs/graphlib in @dagrejs/dagre@^2.
 * https://github.com/dagrejs/dagre/issues/492#issuecomment-3853652764
 */
function dagreGraphlibPlugin(): Plugin {
	return {
		name: 'dagre-graphlib-plugin',
		enforce: 'pre',
		transform(code, id) {
			if (!id.includes('dagrejs') || id.includes('graphlib')) return;
			const modifiedCode = `
        import * as __graphlib__ from '@dagrejs/graphlib';
        ${code.replace(/g\(\s*["']@dagrejs\/graphlib["']\s*\)/g, '__graphlib__')}`;
			return { code: modifiedCode, map: null };
		}
	};
}

export default defineConfig({
	plugins: [sveltekit(), optimizeCss(), devtoolsJson(), dagreGraphlibPlugin()],
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
