import { defineConfig, loadEnv } from 'vite';
import solidPlugin from 'vite-plugin-solid';


export default defineConfig({
    plugins: [
        /* 
        Uncomment the following line to enable solid-devtools.
        For more info see https://github.com/thetarnav/solid-devtools/tree/main/packages/extension#readme
        */
        // devtools(),
        solidPlugin(),
    ],
    server: {
        port: 3001,
    },
    build: {
        target: 'esnext',
    },
});
