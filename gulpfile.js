const gulp = require("gulp");
const pug = require("gulp-pug");
const sass = require("gulp-sass")(require("sass"));
const autoprefixer = require("gulp-autoprefixer");
const plumber = require("gulp-plumber");
const browsersync = require("browser-sync").create();

/* Options
 * ------ */
const options = {
  pug: {
    src: ["src/views/pages/**/*.pug", "src/views/layout/**/*.pug"],
    dest: "public",
  },
  styles: {
    src: "src/styles/styles.scss",
    dest: "public/styles",
  },
  browserSync: {
    baseDir: "public",
  },
};

/* Views */
function views() {
  return gulp
    .src(options.pug.src)
    .pipe(
      plumber(function (err) {
        console.log("Pug Task Error");
        console.log(err);
        this.emit("end");
      })
    )
    .pipe(pug({ pretty: true }))
    .pipe(gulp.dest(options.pug.dest))
    .pipe(
      browsersync.reload({
        stream: true,
      })
    );
}

/* Styles */
function styles() {
  return gulp
    .src(options.styles.src)
    .pipe(
      plumber(function (err) {
        console.log("Styles Task Error");
        console.log(err);
        this.emit("end");
      })
    )
    .pipe(sass().on("error", sass.logError))
    .pipe(autoprefixer({ browsers: ["last 2 versions"], cascade: false }))
    .pipe(gulp.dest(options.styles.dest))
    .pipe(browsersync.reload({ stream: true }));
}

/* Dev task */
function dev() {
  browsersync.init({
    server: {
      baseDir: options.browserSync.baseDir,
    },
    port: 3000,
  });
  gulp.watch("src/**/*.pug", views);
  gulp.watch("src/**/*.scss", styles);
}

exports.views = views;
exports.styles = styles;
exports.dev = dev;
exports.default = dev;
