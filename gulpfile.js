const { src, dest, series, watch } = require('gulp')
const sass = require('gulp-sass')
const csso = require('gulp-csso')
const include = require('gulp-file-include')
const htmlmin = require('gulp-htmlmin')
const del = require('del')
const sync = require('browser-sync').create()
const concat = require('gulp-concat')
const autoprefixer = require('gulp-autoprefixer')


function html() {
    return src('src/**.html')
        .pipe(include({
            prefix: '@@'
        }))
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(dest('dist'))
}

function scss() {
    return src('src/scss/**.scss')
        .pipe(sass())
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
        .pipe(csso())
        .pipe(concat('index.css'))
        .pipe(dest('dist'))
}

function clear() {
    return del('dist')
}

function serve() {
    sync.init({
        server: {
            baseDir: './dist'
        },
        notify: false,
        version: {
            value: '%MDS%',
            append: {
                key: 'v',
                to: ['css', 'js'],
            },
        }
    })
    watch('src/**.html', series(html)).on('change', sync.reload)
    watch('src/scss/**.scss', series(scss)).on('change', sync.reload)
}

exports.build = series(clear, scss, html)
exports.serve = series(clear, scss, html, serve)
exports.clear = clear