import webpack from 'webpack';
import * as webpackDevServer from 'webpack-dev-server';
import * as url from 'url';

import { configure } from './webpack.common.js';

export type Configuration = webpack.Configuration & {
    devServer?: webpackDevServer.Configuration;
};

const base = configure({
    mode: 'development',
    target: 'web',
    buildDir: url.fileURLToPath(new URL('../build/dev', import.meta.url)),
    tsLoaderOptions: {
        compilerOptions: {
            sourceMap: true,
        },
    },
    relocatable: false,
    extractCss: false,
    cssIdentifier: '[local]_[hash:base64]',
});

const config: Configuration = {
    ...base,
    watchOptions: {
        ignored: ['node_modules/**', 'build/**'],
    },
    performance: {
        hints: false,
    },
    devtool: 'source-map',
    devServer: {
        historyApiFallback: true,
        compress: true,
        hot: true,
        liveReload: true,
        port: 9002,
        static: {
            directory: url.fileURLToPath(new URL('./build/pwa/dev/static', import.meta.url)),
        },
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
            'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
        },
    },
};
export default config;
