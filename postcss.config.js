/**
 * PostCSS config
 */

const postcssPresetEnv = require('postcss-preset-env');
const cssnano = require('cssnano');
const tailwindcss = require('tailwindcss');
const nested = require('postcss-nested');

module.exports = ({ options, env }) => {
  return {
    plugins: [
      // Nest like Sass
      nested(),
      // tailwindConfig is set per *design system* webpack.config.js.
      options.tailwindConfig && tailwindcss(options.tailwindConfig),
      // Use .browserslistrc to determine CSS mutations
      postcssPresetEnv(),
      // Heavy processing for production
      env === 'production' && cssnano(),
    ],
  };
};
