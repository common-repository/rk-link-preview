var {src, dest, watch, series} = require('gulp');
var rename = require('gulp-rename');
var browserify = require('gulp-browserify');
var uglify = require("gulp-uglify");
var less = require('gulp-less');

function jsTask(cb) {
    src('./js/**/*.js')
        .pipe(browserify({ transform: ['babelify'] }))
        .on('error', errorAlert)
        // .pipe(rename('../build/js/bundle.js'))
        // .pipe(uglify())
        .pipe(dest('../build/js'));
    cb();
}

function lessTask(cb) {
    src('less/style.less')
        .pipe(less())
        .pipe(dest('../build/css'));
    src('less/front.less')
        .pipe(less())
        .pipe(dest('../build/css'));
    cb();
}

exports.default = function() {
    watch('js/**/*.js', jsTask);
    watch('less/*.less', lessTask);
};

function errorAlert(e) {
    console.log(e);
}
