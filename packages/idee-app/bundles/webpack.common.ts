import CopyWebpackPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import webpack from 'webpack';
import * as webpackDevServer from 'webpack-dev-server';
import * as url from 'url';

export type Configuration = webpack.Configuration & {
    devServer?: webpackDevServer.Configuration;
};

interface ConfigParams {
    mode: 'production' | 'development';
    target?: string;
    buildDir?: string;
    tsLoaderOptions?: object;
    relocatable: boolean;
    extractCss: boolean;
    cssIdentifier: string;
    publicPath?: string;
}

const CONFIG_PATH = 'static/config.[contenthash].json';

export function configure(params: ConfigParams): Partial<Configuration> {
    return {
        mode: params.mode,
        target: params.target,
        entry: {
            'app': ['./src/app.tsx'],
        },
        output: {
            path: params.buildDir,
            publicPath: params.publicPath,
            filename: 'static/js/[name].[contenthash].js',
            chunkFilename: 'static/js/[name].[contenthash].js',
            assetModuleFilename: 'static/assets/[name].[contenthash][ext]',
            webassemblyModuleFilename: 'static/wasm/[hash].wasm',
            globalObject: 'globalThis',
            clean: true,
        },
        resolve: {
            extensions: ['.ts', '.tsx', '.js', '.mjs', '.jsx', '.css', '.wasm'],
            extensionAlias: {
                '.js': ['.js', '.jsx', '.ts', '.tsx'],
            },
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    loader: 'ts-loader',
                    exclude: /node_modules/,
                    options: {
                        ...params.tsLoaderOptions,
                        configFile: 'tsconfig.json',
                    },
                },
                {
                    test: /\.css$/,
                    use: [
                        params.extractCss ? MiniCssExtractPlugin.loader : 'style-loader',
                        {
                            loader: 'css-loader',
                            options: {
                                modules: {
                                    mode: 'local',
                                    auto: true,
                                    exportGlobals: true,
                                    localIdentName: params.cssIdentifier,
                                    localIdentContext: url.fileURLToPath(new URL('src', import.meta.url)),
                                },
                            },
                        },
                    ],
                },
                {
                    test: /\.(png|jpe?g|gif|svg|ico)$/i,
                    type: 'asset/resource',
                    generator: {
                        filename: 'static/img/[name].[contenthash][ext]',
                    },
                },
                {
                    test: /\.(ttf)$/i,
                    type: 'asset/resource',
                    generator: {
                        filename: 'static/fonts/[name].[contenthash][ext]',
                    },
                },
                {
                    test: /.*\/static\/config\.json$/i,
                    type: 'asset/resource',
                    generator: {
                        filename: CONFIG_PATH,
                    },
                }
            ],
        },
        optimization: {
            chunkIds: 'deterministic',
            moduleIds: 'deterministic',
        },
        plugins: [
            new webpack.DefinePlugin({
                'process.env.PUBLIC_URL': JSON.stringify(params.publicPath ?? '/'),
            }),
            new ForkTsCheckerWebpackPlugin(),
            new HtmlWebpackPlugin({
                chunks: ['app'],
                template: './static/index.html',
                filename: './index.html',
                base: '/'
            }),
            new MiniCssExtractPlugin({
                filename: './static/css/[id].[contenthash].css',
                chunkFilename: './static/css/[id].[contenthash].css',
            }),
        ]
    };
}
