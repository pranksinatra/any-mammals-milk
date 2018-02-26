module.exports = {
  files: {
    javascripts: {joinTo: 'app.js'},
    stylesheets: {joinTo: 'app.css'}
  },
  paths: {
    public: '../docs'
  },
  plugins: {
    babel: { presets: ['env'] },
    postcss: { processors: [
      require('postcss-import'),
      require('autoprefixer')
      ] }
  },
  modules: {
    autoRequire: {
      'app.js': ['initialize']
    }
  },
  npm: {
    styles: { chartist: ['dist/chartist.css'] }
  }
};