const gulp = require('gulp');
const mocha = require('gulp-mocha');
const jscs = require('gulp-jscs');
const nodemon = require('gulp-nodemon');
const browserSync = require('browser-sync').create();

const paths =  {
  scripts: './*.js',
  sandbox: './sandbox/**/*.js',
  tests: './test/**/*.js'
};

const BROWSER_SYNC_RELOAD_DELAY = 500;

// test task
gulp.task('test', function () {
  gulp.src(paths.tests)
    .pipe(mocha())
    .on('error', function (error) {
      this.emit('end');
    });
});

//linter task
gulp.task('lint', () => {
  gulp.src(paths.scripts)
  .pipe(jscs())
  .pipe(jscs.reporter());
});

// browser sync
gulp.task('browserSync', ['nodemon'], () => {
  browserSync.init({
    proxy: 'http://localhost:3000',
    port: '4000',
    browser: ['google-chrome']
  });

});

gulp.task('bs-reload', browserSync.reload);

// reload the node server
gulp.task('nodemon', (cb) => {
  var called = false;
  return nodemon({

    // nodemon our expressjs server
    script: 'index.js',

    // watch core server file(s) that require server restart on change
    watch: ['index.js', 'api.js', 'models.js']
  })
    .on('start', function onStart() {
      // ensure start only got called once
      if (!called) { cb(); }

      called = true;
    })
    .on('restart', function onRestart() {
      // reload connected browsers after a slight delay
      setTimeout(function reload() {
        browserSync.reload({
          stream: false
        });
      }, BROWSER_SYNC_RELOAD_DELAY);
    });
});

// monitor js file changes and on changes run task
gulp.task('watch', ['browserSync', 'lint'], () => {
  gulp.watch(paths.scripts, ['bs-reload']);
});

gulp.task('default', ['watch']);
