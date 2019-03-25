var gulp = require('gulp'),
sass = require('gulp-sass'),
browserSync = require('browser-sync'),
fileinclude = require('gulp-file-include'),
autoprefixer = require('gulp-autoprefixer'),
babel = require('gulp-babel'),
uglify = require('gulp-uglify-es').default,
cleanss = require('gulp-cleancss'),
imagemin = require('gulp-imagemin'),
clean = require('gulp-clean');

gulp.task('sass', function(){
    return gulp.src('app/sass/**/*.sass')
    .pipe(sass())
    .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
    .pipe(gulp.dest('app/css'))
	.pipe(browserSync.reload({stream: true}));
});

gulp.task('html', function() {
	return gulp.src('app/html/*.html')
    .pipe(fileinclude())
    .pipe(gulp.dest('app'))
	.pipe(browserSync.reload({stream: true}))
});

gulp.task('html:dist', function(){
    return gulp.src('app/*.html')
    .pipe(gulp.dest('dist'));
});

gulp.task('css:dist', function() {
    return gulp.src('app/css/*.css')
    .pipe(cleanss({keepBreaks: false}))
    .pipe(gulp.dest('./dist/css'))
});

gulp.task('js:dist', function() {
    return gulp.src('app/js/*.js')
    .pipe(babel({
        presets: ['@babel/env']
    }))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'))
});

gulp.task('img:dist', function() {
    return gulp.src('app/img/*')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/img'))
});

gulp.task('fonts:dist', function() {
    return gulp.src('fonts/**/*.*')
    .pipe(gulp.dest('dist/fonts'))
});

gulp.task('clean', function(){
    return gulp.src('dist')
    .pipe(clean());
});

gulp.task('browser-sync', function(){
    browserSync({
        server: {
            baseDir: 'app'
        },
        notify: false
    })
});


gulp.task('watch', function(){
    gulp.watch('app/sass/**/*.sass', gulp.parallel('sass'));
    gulp.watch('app/html/**/*.html', gulp.parallel('html'));
    gulp.watch('app/js/*.js', browserSync.reload);    
});

gulp.task('build', gulp.series('clean', gulp.parallel('html:dist', 'css:dist', 'js:dist', 'img:dist', 'fonts:dist')))

gulp.task('default', gulp.series('sass', 'html', gulp.parallel('browser-sync', 'watch')));

