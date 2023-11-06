import gulp from "gulp";
const { series, watch, src, dest } = gulp;
import sass from 'gulp-dart-sass';
import plumber from "gulp-plumber";
import postcss from "gulp-postcss";
import autoprefixer from "autoprefixer";
import concat from "gulp-concat-css";
import minify from "gulp-csso";
import server from "browser-sync";
import gulpclean from 'gulp-clean';
import rename from "gulp-rename";
import convertwebp from "gulp-webp";
import jsmin from 'gulp-jsmin';
import htmlmin from 'gulp-htmlmin';

function clean() {
    return src('dist/', { read: false })
        .pipe(gulpclean());
}

function html() {
    return src("source/*.html")
        .pipe(htmlmin({ collapseWhitespace: true }))
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
        .pipe(minify())
        .pipe(rename("index.min.css"))
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

function webp() {
    return src("dist/img/*.{png,jpg}")
        .pipe(convertwebp({ quality: 90 }))
        .pipe(dest("dist/img/"));
}

function scripts() {
    return src("source/js/*.js")
        .pipe(jsmin())
        .pipe(rename({ suffix: '.min' }))
        .pipe(dest('dist/js'))
}

function serve() {
    server.create().init({
        server: 'dist',
        cors: true
    });

    watch("source/*.html").on("change", series(html, server.reload));
    watch("source/**/*.{scss,sass}").on("change", series(style, server.reload));
    watch("source/**/*.js").on("change", series(scripts, server.reload));
}

export const build = series(clean, html, fonts, images, webp, style, scripts);
export default series(clean, html, fonts, images, webp, style, scripts, serve);
