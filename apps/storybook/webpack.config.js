/**
 * Storybook-specific webpack config.
 */

// Library Imports
const path = require('path');

const { DefinePlugin } = require('webpack');
const sassExportData = require('@theme-tools/sass-export-data');

// Plugins
const RunScriptOnFiletypeChange = require('../../tools/webpack/run-script-on-filetype-change');
const particle = require('../../particle');

// Constants: environment
const { NODE_ENV, PARTICLE_STORYBOOK_HOST = '' } = process.env;
// Constants: root
const { PATH_DIST } = require('../../particle.root.config');
// Constants: app
const appConfig = require('./storybook.app.config');

const { APP_NAME, APP_PATH, APP_DIST, APP_DIST_PUBLIC } = appConfig;

const shared = {
  entry: {
    app: [path.resolve(__dirname, 'index.js')],
  },
  output: {
    path: APP_DIST,
    publicPath: APP_DIST_PUBLIC,
  },
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                // Used to generate JSON about variables like colors, fonts
                functions: {
                  ...sassExportData({
                    name: 'export_data',
                    path: path.resolve(APP_PATH, '_data/'),
                  }),
                },
              },
            },
          },
        ],
      },
      {
        test: /\.twig$/,
        use: [
          {
            loader: 'twig-loader',
          },
        ],
      },
      // Non-standard assets on the dependency chain
      {
        test: /\.(yml|md)$/,
        loader: 'file-loader',
        options: {
          emitFile: false,
        },
      },
    ],
  },
  plugins: [
    new DefinePlugin({
      BUILD_TARGET: JSON.stringify(APP_NAME),
    }),
  ],
  stats: {
    children: false,
  },
};

const dev = {
  devServer: {
    host: '0.0.0.0',
    port: '8080',
    allowedHosts: ['.docksal', '.vm', '0.0.0.0', 'localhost'],
    // dev server starts from this folder.
    contentBase: PATH_DIST,
    // local host name for devServer
    public: PARTICLE_STORYBOOK_HOST,
    // Refresh devServer when dist/ changes (Pattern Lab)
    watchContentBase: true,
    watchOptions: {
      // Ignore all folders inside dist/app-storybbook so storybook rebuilds refresh.
      // Note: prevents Webpack from watching many storybook files,
      ignored: /app-storybook/,
    },
    // Open browser immediately
    open: true,
    // Open browser to the storybook landing page so it's very clear where to go
    openPage: `${APP_NAME}/storybook`,
    // Inject css/js into page without full refresh
    hot: true,
    // Finds default index.html files at folder root
    historyApiFallback: true,
    // Injects all the webpack dev server code right in the page
    inline: true,
    // All stats available here: https://webpack.js.org/configuration/stats/
    stats: {
      depth: true,
      entrypoints: true,
      chunkModules: true,
      chunkOrigins: true,
      env: true,
      colors: true,
      hash: true,
      version: true,
      timings: true,
      assets: true,
      chunks: false,
      modules: false,
      reasons: true,
      source: true,
      errors: true,
      errorDetails: true,
      warnings: true,
      publicPath: true,
    },
  },
  plugins: [
    // Recompile Storybook on any globbed Storybook file (see glob.js)
    new RunScriptOnFiletypeChange({
      test: /\.(twig|yml|md|json)$/,
      exec: [`npm run storybook`],
    }),
  ],
};

const prod = {};

module.exports = particle(
  // app: webpack
  { shared, dev, prod },
  // app: config
  appConfig,
  // Options
  {
    cssMode: NODE_ENV === 'development' ? 'hot' : 'extract',
  }
);
