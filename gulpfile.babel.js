import gulp from 'gulp';
import del from 'del';
import gulpLoadPlugins from 'gulp-load-plugins';

const $ = gulpLoadPlugins();

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

gulp.task('watch', ['styles', 'images'], () => {
  gulp.watch(['assets/styles/**/*.{scss,css}'], ['styles']);
  gulp.watch(['assets/images/**/*'], ['images']);
});

gulp.task('clean', () => del(['app/assets/styles/*', 'app/assets/images/*']));

gulp.task('default', ['styles', 'images']);
