/**
 * PostCSS config
 */

const postcssPresetEnv = require('postcss-preset-env');
const cssnano = require('cssnano');
const tailwindcss = require('tailwindcss');

module.exports = ({ options, env }) => {
  return {
    plugins: [
      // tailwindConfig is set per *design system* webpack.config.js.
      options.tailwindConfig && tailwindcss(options.tailwindConfig),
      // Use .browserslistrc to determine CSS mutations
      postcssPresetEnv(),
      // Heavy processing for production
      env === 'production' && cssnano(),
    ],
  };
};
