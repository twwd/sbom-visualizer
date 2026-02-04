import devtoolsJson from 'vite-plugin-devtools-json';
import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';
import { optimizeCss } from 'carbon-preprocess-svelte';

import fs from 'fs';
import type { Plugin, UserConfig } from 'vite';

/**
 * Vite plugin to fix @dagrejs/dagre's dynamic require of @dagrejs/graphlib.
 * From https://github.com/dagrejs/dagre/issues/492#issuecomment-3831937463
 *
 * Uses esbuild's onLoad hook during pre-bundling to inject the graphlib import
 * and replace dynamic require calls before the code is bundled.
 *
 * See: https://github.com/dagrejs/dagre/issues/492
 */
function dagreGraphlibPlugin(): Plugin {
	return {
		name: 'dagre-graphlib-fix',
		config(): Omit<UserConfig, 'plugins'> {
			return {
				optimizeDeps: {
					esbuildOptions: {
						plugins: [
							{
								name: 'dagre-graphlib-esbuild',
								setup(build) {
									// Intercept the dagre ESM file during pre-bundling
									build.onLoad({ filter: /dagre\.esm\.js$/ }, async (args) => {
										let contents = await fs.promises.readFile(args.path, 'utf8');

										// Add graphlib import at the top
										const graphlibImport = `import * as __graphlib__ from '@dagrejs/graphlib';\n`;
										contents = graphlibImport + contents;

										// Replace all dynamic require patterns
										contents = contents.replace(
											/g\(\s*["']@dagrejs\/graphlib["']\s*\)/g,
											'__graphlib__'
										);

										return {
											contents,
											loader: 'js' as const
										};
									});
								}
							}
						]
					}
				}
			};
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
	}
});
