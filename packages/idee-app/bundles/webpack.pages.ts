import webpack from 'webpack';
import * as webpackDevServer from 'webpack-dev-server';
import * as url from 'url';

import { configure } from './webpack.common.js';

export type Configuration = webpack.Configuration & {
    devServer?: webpackDevServer.Configuration;
};

const base = configure({
    mode: 'production',
    target: 'web',
    buildDir: url.fileURLToPath(new URL('../build/pages', import.meta.url)),
    publicPath: "ideeai",
    tsLoaderOptions: {
        compilerOptions: {
            sourceMap: false,
        },
    },
    relocatable: false,
    extractCss: true,
    cssIdentifier: '[hash:base64]',
});

const config: Configuration = {
    ...base,
    devtool: false,
};

export default config;
