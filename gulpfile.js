const gulp = require('gulp');
const browserify = require('browserify');
const responsive = require('gulp-responsive-images');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer')
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const minifyCSS = require('gulp-minify-css');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync');
const imagemin = require('gulp-imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const resizer = require('gulp-image-resize');
const webp = require('gulp-webp');

gulp.task("images", () => {
    return gulp
        .src('source/img/**/*')
        .pipe(imagemin([
            imageminMozjpeg({
                quality: 50
            })
        ], {
            verbose: true
        }))
        .pipe(responsive({
            '*': [{
                    width: 360,
                    quality: 70,
                    suffix: '-small'
                },
                {
                    width: 800,
                    quality: 70,
                    suffix: '-medium'
                },
                {
                    width: 100,
                    percentage: true,
                    quality: 70,
                    suffix: '-original'
                }
            ]
        }))
        .pipe(webp())
        .pipe(gulp.dest("buildTool/img"));
});

gulp.task('styles', function() {
    gulp.src('source/sass/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions']
        }))
        .pipe(concat('main.css'))
        .pipe(minifyCSS())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('buildTool/css'))
        .pipe(browserSync.reload({ stream: true }));
});

gulp.task('scripts', function() {
    gulp.src('source/js/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('buildTool/js'))
        .pipe(browserSync.reload({ stream: true }));
});

gulp.task('browser-sync', function() {
    const config = {
        server: { baseDir: './' },
        port: process.env.PORT || 3000
    };

    return browserSync(config);
});

gulp.task('default', ['images', 'styles', 'scripts', 'watch', 'browser-sync']);

gulp.task('watch', function() {
    gulp.watch('source/js/**/*.js', ['scripts']);
    gulp.watch('source/img/**/*', ['images']);
    gulp.watch('source/sass/**/*.scss', ['styles']);
    gulp.watch('./**/*.html', function() {
        return gulp.src('')
            .pipe(browserSync.reload({ stream: true }))
    });
});