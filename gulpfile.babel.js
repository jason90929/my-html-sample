import gulp from 'gulp';
import sync from 'gulp-sync';
const gulpsync = sync(gulp);
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
import eslint from 'gulp-eslint';
import fileinclude from 'gulp-file-include';

const $ = gulpLoadPlugins();
const reload = browserSync.reload;

// 監聽所有項目
gulp.task('watch', ['browserify', 'scss', 'fonts', 'images', 'html'], () => {
  gulp.watch('app/assets/scripts/**', ['browserify']);
  gulp.watch('app/assets/styles/**', ['scss']);
  gulp.watch('app/assets/fonts/**', ['fonts']);
  gulp.watch('app/assets/images/**', ['images']);
  gulp.watch('app/*.html', ['html']);
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
  if (process.env.NODE_ENV === 'production') {
    return gulp.src('app/assets/scripts/main.js', function (err, files) {
      files.map(function (entry) {
        var fileName = entry.split('app/assets/scripts/')[1];//截取完整路径的文件名
        browserify({
          entries: entry, // Only need initial file, browserify finds the deps
          debug: true, // Gives us sourcemapping
          cache: {}, packageCache: {}, fullPaths: true, // Requirement of watchify
        })
          .transform(babelify, { presets: ['es2016'] })
          .bundle()
          .on('error', function (err) {
            console.error(err);
            this.emit('end');
          })
          .pipe(source(fileName))
          .pipe(buffer()) // js 壓縮前置準備
          .pipe($.sourcemaps.write())
          .pipe(uglify()) // 壓縮 js
          .pipe(bom()) // 解決中文亂碼
          .pipe(gulp.dest('./dist/assets/scripts/'))
          .pipe(reload({ stream: true }));
      });
    });
  }

  return gulp.src('app/assets/scripts/main.js', function (err, files) {
    files.map(function (entry) {
      var fileName = entry.split('app/assets/scripts/')[1];//截取完整路径的文件名
      browserify({
        entries: entry, // Only need initial file, browserify finds the deps
        debug: true, // Gives us sourcemapping
        cache: {}, packageCache: {}, fullPaths: true, // Requirement of watchify
      })
        .transform(babelify, { presets: ['es2016'] })
        .bundle()
        .on('error', function (err) {
          console.error(err);
          this.emit('end');
        })
        .pipe(source(fileName))
        .pipe(buffer()) // js 壓縮前置準備
        .pipe($.sourcemaps.write())
        .pipe(bom()) // 解決中文亂碼
        .pipe(gulp.dest('./dist/assets/scripts/'))
        .pipe(reload({ stream: true }));
    });
  });
});

// 壓縮 react 檔案的前置作業
// loose-envify 必備
gulp.task('apply-prod-environment', function () {
  process.env.NODE_ENV = 'production';
});

gulp.task('apply-dev-environment', function () {
  process.env.NODE_ENV = 'development';
});

// 監聽 scss
gulp.task('scss', () => {
  if (process.env.NODE_ENV === 'production') {
    return gulp.src('app/assets/styles/*.scss')
      .pipe($.plumber())
      .pipe($.sourcemaps.init())
      .pipe($.sass.sync({
        outputStyle: 'expanded',
        precision: 10,
        includePaths: ['.']
      }).on('error', $.sass.logError))
      .pipe($.autoprefixer({ browsers: ['> 1%', 'last 2 versions', 'Firefox ESR'] }))
      .pipe(minifyCSS({ keepBreaks: false }))
      .pipe(gulp.dest('./dist/assets/styles/'))
  }

  return gulp.src('app/assets/styles/*.scss')
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.sass.sync({
      outputStyle: 'expanded',
      precision: 10,
      includePaths: ['.']
    }).on('error', $.sass.logError))
    .pipe($.autoprefixer({ browsers: ['> 1%', 'last 2 versions', 'Firefox ESR'] }))
    .pipe($.sourcemaps.write()) // 若有 import node_modules 內的 css，在 minifyCSS 時此行要註解
    .pipe(gulp.dest('./dist/assets/styles/'))
    .pipe(reload({ stream: true }));
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
    .pipe(reload({ stream: true }));
});

// 監聽圖片
gulp.task('images', () => {
  return gulp.src('app/assets/images/**/*')
    .pipe($.if($.if.isFile, $.cache($.imagemin({
      progressive: true,
      interlaced: true,
      // don't remove IDs from SVGs, they are often used
      // as hooks for embedding and styling
      svgoPlugins: [{ cleanupIDs: false }]
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
    .pipe(reload({ stream: true }));
});

// 清除所有輸出靜態頁面內容
gulp.task('clean', () => {
  return gulp.src('./dist', { read: false })
    .pipe(rimraf());
});

// Es-lint 編碼風格檢查
gulp.task('lint', () => {
  // ESLint ignores files with "node_modules" paths.
  // So, it's best to have gulp ignore the directory as well.
  // Also, Be sure to return the stream from the task;
  // Otherwise, the task may end before the stream has finished.
  return gulp.src(['./app/assets/scripts/*.js', './app/assets/scripts/functions/*.js'])
  // eslint() attaches the lint output to the "eslint" property
  // of the file object so it can be used by other modules.
    .pipe(eslint())
    // eslint.format() outputs the lint results to the console.
    // Alternatively use eslint.formatEach() (see Docs).
    .pipe(eslint.format())
    // To have the process exit with an error code (1) on
    // lint error, return the stream and pipe to failAfterError last.
    .pipe(eslint.failAfterError());
});

// 打包所有頁面
gulp.task('build', gulpsync.sync([
  'apply-prod-environment',
  'clean',
  ['browserify', 'lint', 'scss', 'fonts', 'images', 'html']
]));

// 啟動打包、伺服器後監聽
gulp.task('serve', gulpsync.sync([
  'apply-dev-environment',
  'clean',
  ['browserify', 'scss', 'fonts', 'images', 'html', 'connect', 'watch']
]));

// 預設指令：build
gulp.task('default', ['build']);