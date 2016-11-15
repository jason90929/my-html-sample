import gulp from 'gulp';
var gulpsync = require('gulp-sync')(gulp);
import gulpLoadPlugins from 'gulp-load-plugins';
import mainBowerFiles from 'main-bower-files';
import browserify from 'browserify';
import browserSync from 'browser-sync';
import source from 'vinyl-source-stream';
import minifyCSS  from 'gulp-clean-css';
import rimraf from 'gulp-rimraf';
import uglify from 'gulp-uglify';
import buffer from 'vinyl-buffer';
import htmlmin from 'gulp-htmlmin';
import bom from 'gulp-bom';
import babelify from 'babelify';
import fileinclude from 'gulp-file-include';

const $ = gulpLoadPlugins();
const reload = browserSync.reload;

// 監聽所有項目
gulp.task('watch', ['browserify', 'scss', 'fonts', 'images', 'models', 'html'], () => {
    gulp.watch('app/assets/scripts/**', ['browserify']);
    gulp.watch('app/assets/styles/**', ['scss']);
    gulp.watch('app/assets/fonts/**', ['fonts']);
    gulp.watch('app/assets/images/**', ['images']);
    gulp.watch('app/assets/models/**', ['models']);
    gulp.watch(['app/*.html', 'app/**/*.html'], ['html']);
});

// 啟動伺服器
gulp.task('connect', () => {
    browserSync({
        notify: false,
        port: 9001,
        server: {
            'baseDir': "./dist"
        }
    });
});

// 監聽 app.js
gulp.task('browserify', () => {
    return browserify({
        entries: 'app/assets/scripts/main.js', // Only need initial file, browserify finds the deps
        debug: true, // Gives us sourcemapping
        cache: {}, packageCache: {}, fullPaths: true // Requirement of watchify
    })
        .transform(babelify, {presets: ['es2015']}) // We want to convert JSX to normal javascript
        .bundle()
        .on('error', function (err) {
            console.error(err);
            this.emit('end');
        })
        .pipe(source('main.js'))
        .pipe(buffer()) // js 壓縮前置準備
        // .pipe(uglify()) // 壓縮 js
        .pipe(bom()) // 解決中文亂碼
        .pipe(gulp.dest('./dist/assets/scripts/'))
        .pipe(reload({stream: true}));
});

// 監聽 scss
gulp.task('scss', () => {
    return gulp.src('app/assets/styles/*.scss')
        .pipe($.plumber())
        .pipe($.sourcemaps.init())
        .pipe($.sass.sync({
            outputStyle: 'expanded',
            precision: 10,
            includePaths: ['.']
        }).on('error', $.sass.logError))
        .pipe($.autoprefixer({browsers: ['> 1%', 'last 2 versions', 'Firefox ESR']}))
        .pipe($.sourcemaps.write()) // 若有 import node_modules 內的 css，在 minifyCSS 時此行要註解
        // .pipe(minifyCSS({keepBreaks: false}))
        .pipe(gulp.dest('./dist/assets/styles/'))
        .pipe(reload({stream: true}));
});

// 監聽 Models
gulp.task('models', () => {
    return gulp.src('app/assets/models/*')
        .pipe(gulp.dest('./dist/assets/models/'))
        .pipe(reload({stream: true}));
});

// 監聽字型
gulp.task('fonts', () => {
    return gulp.src(mainBowerFiles('app/assets/fonts/*.{eot,svg,ttf,woff,woff2}', function (err) {
    })
        .concat([
            'app/assets/fonts/**/*', // My custom fonts
            'node_modules/font-awesome/fonts/*' // Font Awesome
        ]))
        .pipe(gulp.dest('./dist/assets/fonts'))
        .pipe(reload({stream: true}));
});

// 監聽圖片
gulp.task('images', () => {
    return gulp.src('app/assets/images/**/*')
        .pipe($.if($.if.isFile, $.cache($.imagemin({
            progressive: true,
            interlaced: true,
            // don't remove IDs from SVGs, they are often used
            // as hooks for embedding and styling
            svgoPlugins: [{cleanupIDs: false}]
        }))
            .on('error', function (err) {
                console.log(err);
                this.end();
            })))
        .pipe(gulp.dest('./dist/assets/images'));
});

// 監聽網頁
gulp.task('html', () => {
    return gulp.src(mainBowerFiles('app/*.html', function (err) {
    })
        .concat('app/*'))
        // .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(bom()) // 解決中文亂碼
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest('dist'))
        .pipe(reload({stream: true}));
});

// 清除所有輸出靜態頁面內容
gulp.task('clean', () => {
    return gulp.src('./dist', {read: false})
        .pipe(rimraf());
});

// 打包所有頁面
gulp.task('build', gulpsync.sync([
    'clean',
    ['browserify', 'scss', 'fonts', 'images', 'models', 'html']
]));

// 啟動打包、伺服器後監聽
gulp.task('serve', gulpsync.sync([
    'build', 'connect', 'watch'
]));

// 預設指令：build
gulp.task('default', ['build']);