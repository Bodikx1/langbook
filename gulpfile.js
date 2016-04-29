var
    gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    minifyCss = require('gulp-minify-css'),
    concatCss = require('gulp-concat-css'),
    concat = require('gulp-concat'),
    bower = require('gulp-bower'),
    sass = require('gulp-sass');

//=============== paths to main working directories ===================
var sourcesDir = './app/',
    destDir = './public/dist/';

var bowDir = 'bower_components/';

//global options
var uglifyMinify = false;
var concatCssOpt = {rebaseUrls: false}; //
var j = 'js',
    c = 'css';
var colorTheme = 'default';

//=============== routine tasks (same for each project) ===================

function min(stream, type) {
    if (uglifyMinify) {
        if (type == 'css')
            return stream.pipe(minifyCss());
        else if (type == 'js')
            return stream.pipe(uglify());
    }
    return stream;
}

gulp.task('main', function () {
    var workDir = sourcesDir + bowDir;

    //js
    var stream = gulp.src([sourcesDir + "/js/**/*.js"]).pipe(concat('app.js'));
    min(stream, j);
    stream.pipe(gulp.dest(destDir + 'js/'));

    // css
    stream = gulp.src([
            sourcesDir + 'css/**/*.scss'
        ])
        .pipe(sass().on('error', sass.logError))
        .pipe(concatCss("app.css", concatCssOpt));
    min(stream, c);
    stream.pipe(gulp.dest(destDir + 'css'));
});

/** Default */
gulp.task('default', ['bower', 'vendors', 'main']);

/** Vendors */
gulp.task('vendors', function () {
    gulp.src([sourcesDir + bowDir + 'jquery-mousewheel/jquery.mousewheel.min.js']).pipe(gulp.dest(destDir + 'vendor/jquery-mousewheel/'));
    gulp.src([sourcesDir + bowDir + 'jquery-ui/jquery-ui.min.js']).pipe(gulp.dest(destDir + 'vendor/jquery-ui/'));
    gulp.src([sourcesDir + bowDir + 'jquery-ui/themes/dark-hive/*']).pipe(gulp.dest(destDir + 'vendor/jquery-ui/themes/dark-hive/'));
    gulp.src([sourcesDir + bowDir + 'jquery-ui/themes/dark-hive/*']).pipe(gulp.dest(destDir + 'vendor/jquery-ui/themes/dark-hive/'));
    gulp.src([sourcesDir + bowDir + 'bootstrap/dist/css/bootstrap.min.css']).pipe(gulp.dest(destDir + 'vendor/bootstrap/css/'));
    gulp.src([sourcesDir + bowDir + 'bootstrap/dist/fonts/*']).pipe(gulp.dest(destDir + 'vendor/bootstrap/fonts/'));
    gulp.src([sourcesDir + bowDir + 'bootstrap/dist/js/bootstrap.min.js']).pipe(gulp.dest(destDir + 'vendor/bootstrap/js/'));
});

/** Bower */
gulp.task('bower', function () {
    return bower({cwd: sourcesDir});
});

gulp.task('watch', function () {
    gulp.watch([sourcesDir + 'js/**/*.js', sourcesDir + "css/**/*"], ['main']);
});
