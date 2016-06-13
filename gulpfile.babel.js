import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';

const $ = gulpLoadPlugins();

gulp.task('scripts', () =>
  gulp.src('assets/scripts/**/*.js')
    .pipe($.sourcemaps.init())
    .pipe($.concat('main.js'))
    .pipe($.size({ title: 'scripts' }))
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('app/assets/scripts'))
);

gulp.task('styles', () => {
  gulp.src(['assets/styles/**/*.scss', 'assets/styles/**/*.css'])
    .pipe($.sourcemaps.init())
    .pipe($.sass({
      precision: 10,
    }).on('error', $.sass.logError))
    .pipe($.autoprefixer('last 2 versions'))
    .pipe($.if('*.css', $.cssnano()))
    .pipe($.size({ title: 'styles' }))
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest('app/assets/styles'));
});

gulp.task('images', () =>
  gulp.src('assets/images/**/*')
    .pipe($.cache($.imagemin({
      progressive: true,
      interlaced: true,
    })))
    .pipe(gulp.dest('app/assets/images'))
    .pipe($.size({ title: 'images' }))
);

gulp.task('watch', ['scripts', 'styles', 'images'], () => {
  gulp.watch(['assets/scripts/**/*.js'], ['scripts']);
  gulp.watch(['assets/styles/**/*.{scss,css}'], ['styles']);
  gulp.watch(['assets/images/**/*'], ['images']);
});

gulp.task('default', ['scripts', 'styles', 'images']);
