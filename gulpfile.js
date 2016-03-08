const gulp = require('gulp');
const mocha = require('gulp-mocha');
const jscs = require('gulp-jscs');

// test task
gulp.task('test', () => {
  gulp.src('./test/test.js')
    .pipe(mocha())
    .on('error', function(error){
      //console.log(error);
      this.emit('end');
    });
});
//linter task
gulp.task('lint', () => {
  gulp.src('./sandbox/wagner.js')
  .pipe(jscs())
  .pipe(jscs.reporter());
});

// monitor js file changes and on changes run task
gulp.task('watch', () => {
  gulp.watch('./sandbox/wagner.js', ['lint']);
});
