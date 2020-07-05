module.exports = {
  plugins: [
    require('autoprefixer'), // eslint-disable-line global-require
    require('cssnano')({ // eslint-disable-line global-require
      preset: 'default',
    }),
  ],
};
