import dotEnvExtended from 'dotenv-extended';
dotEnvExtended.load();
import preprocess from 'svelte-preprocess';
import path from 'path';
import adapter from '@sveltejs/adapter-node';

/** @type {import('@sveltejs/kit').Config} */
export default {
	preprocess: [
		preprocess({
			postcss: true
		})
	],
	kit: {
		adapter: adapter({
			out: 'build'
		}),
		target: '#svelte',
		hostHeader: 'X-Forwarded-Host',
		floc: true,
		prerender: {
			enabled: false
		},
		vite: {
			server: {
				proxy: {
					'/api':process.env.NODE_ENV === 'production' ? `https://${process.env.DOMAIN}` : 'http://127.0.0.1:3001'
				},
				hmr: {
					port: 23456
				}
			},
			resolve: {
				alias: {
					$components: path.resolve('./src/components/'),
					$store: path.resolve('./src/store/index.ts'),
					$models: path.resolve('./src/models/')
				}
			}
		}
	}
};
