const gulp = require("gulp");
const mocha = require("gulp-mocha");

// test task
gulp.task("test", () => {
  gulp.src("./test.js")
    .pipe(mocha())
    .on("error", function(error){
      //console.log(error);
      this.emit("end");
    });
});

// monitor js file changes and on changes run task
gulp.task("watch", () => {
  gulp.watch("./*.js", ["test"]);
});
