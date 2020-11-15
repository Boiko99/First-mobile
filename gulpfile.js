var gulp =              require('gulp'),
    browserSync  =      require('browser-sync'),
    gulpIf =            require('gulp-if'),
    concat = require('gulp-concat'),
    eslint =            require('gulp-eslint'),
    sass =              require('gulp-sass'),
    autoprefixer =      require('gulp-autoprefixer'),
    sourcemaps =        require('gulp-sourcemaps'),
    imagemin =          require('gulp-imagemin'),
    pngquant =          require('imagemin-pngquant');


/**
 * @task move:fonts
 * Copy fonts to build
 */
gulp.task('move:fonts', function() {
    gulp.src('./src/fonts/**/*.{otf,ttf,woff,woff2,eof,svg}')
        .pipe(gulp.dest('./build/fonts'));
});

/**
 * @task move:fontawesome
 * Copy fonts to build
 */
gulp.task('move:fontawesome', function() {
    return gulp.src('node_modules/font-awesome/fonts/*.{woff,woff2}')
        .pipe(gulp.dest('build/fonts/fa'))
});

/**
 * @task move:html
 * Copy html files to build
 */
gulp.task('move:html', function() {
    gulp.src('./src/**/*.{html,htm}')
        .pipe(gulp.dest('./build'));
});

/**
 * @task move:css
 * Copy static css to build
 */
gulp.task('move:css', function() {
    gulp.src('./src/css/**/*.{css}')
        .pipe(gulp.dest('./build/css'));
});

/**
 * @task move:img
 * Compress images & Copy to build
 */
gulp.task('move:img', function () {
    return gulp.src('./src/img/**/*.*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('./build/img'));
});

/**
 * @task compile:sass
 * Compile SCSS to CSS & move to build
 */
gulp.task('compile:sass', function () {
    gulp.src('./src/sass/style.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            //outputStyle: 'compressed',
            includePaths: [
                'node_modules/normalize.css/',
                'node_modules/font-awesome/scss/'
            ]
        }).on('error', sass.logError))
        .pipe(autoprefixer('last 2 version'))
        .pipe(sourcemaps.write('./'))
        .pipe(browserSync.reload({stream:true}))
        .pipe(gulp.dest('./build/css/'));
});

/**
 * @task compile:js
 * Copy and combine custom JS files
 */
gulp.task('compile:js', function() {
    return gulp.src([
        './src/js/**/*.js',
        //'node_modules/bootstrap/dist/js/bootstrap.js',
    ])
        .pipe(concat('app.js'))
        .pipe(gulp.dest('./build/js'));
});

/**
 * @task move:extra-js
 * Copy extra JS files
 */
gulp.task('move:extra-js', function() {
    return gulp.src([
        'src/js/jquery-3.4.1.min.js',
    ])
        .pipe(gulp.dest('./build/js'));
});

/**
 * @task browser-sync
 * Launch the Server
 */
gulp.task('browser-sync', ['compile:sass'], function() {
    browserSync.init({
        server: {
            baseDir: './build'
        },
        open: true,
        notify: false
    });
});

/**
 * @task watch
 * Wathes changes on files
 */
gulp.task('watch', function(){
    gulp.watch('./src/sass/**/*.scss', ['compile:sass']);
    gulp.watch('./src/img/**/*.*', ['move:img']);
    gulp.watch('./src/**/*.html', ['move:html']);
});

/**
 * @task build
 * Builds the theme
 */
gulp.task('build', [
    'move:fonts',
    'move:fontawesome',
    'move:html',
    'move:img',
    'move:css',
    'compile:sass',
    'compile:js',
    'move:extra-js'
]);

/**
 * Default task, running just `gulp` will
 * compile Sass files, launch BrowserSync & watch files.
 */
gulp.task('default', [
    'build',
    'browser-sync',
    'watch'
]);