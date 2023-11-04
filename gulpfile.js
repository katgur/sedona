const { series, watch, src, dest } = require("gulp");
const sass = require('gulp-sass')(require('sass'));
const plumber = require("gulp-plumber");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const concat = require("gulp-concat-css")
const replace = require("gulp-replace")
const server = require("browser-sync").create();
const gulpclean = require('gulp-clean');

function clean() {
    return src('dist/', { read: false })
        .pipe(gulpclean());
}

function html() {
    return src("source/*.html")
        .pipe(dest("dist/"));
}

function style() {
    return src("source/sass/*/*.scss")
        .pipe(plumber())
        .pipe(sass())
        .pipe(postcss([
            autoprefixer()
        ]))
        .pipe(concat("index.css"))
        .pipe(dest("dist/style/"));
}

function fonts() {
    return src('source/font/*.woff')
        .pipe(dest('dist/font/'))
}

function images() {
    return src("source/img/*.{png,svg,webp,jpg}")
        .pipe(dest('dist/img'))
}

function scripts() {
    return src("source/js/*.js")
        .pipe(dest('dist/js'))
}

function serve() {
    server.init({
        server: 'dist',
        cors: true
    });

    watch("source/*.html").on("change", series(html, server.reload));
    watch("source/**/*.{scss,sass}").on("change", series(style, server.reload));
    watch("source/**/*.js").on("change", series(scripts, server.reload));
}

exports.build = series(clean, html, fonts, images, style, scripts)
exports.default = series(clean, html, fonts, images, style, scripts, serve)