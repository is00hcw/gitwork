// npm install gulp -g
// npm install --save-dev gulp-util gulp-imagemin  gulp-ruby-sass gulp-minify-css gulp-jshint gulp-uglify gulp-rename gulp-concat gulp-clean gulp-livereload tiny-lr 

var gulp = require('gulp');
// 引入组件
var imagemin = require('gulp-imagemin');
var minifycss = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
// 压缩图片
gulp.task('images', function() {
  return gulp.src('./src/images/**/*')
    .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
    .pipe(gulp.dest('./dist/images'))
});
// 合并、压缩、重命名css
gulp.task('minifycss', function() {
  return gulp.src('./src/css/*.css')
    .pipe(minifycss())
    .pipe(concat('all.min.css'))
    .pipe(gulp.dest('./dist/css'));
});
// 检查js
gulp.task('lint', function() {
  return gulp.src('./src/js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});
// 合并，压缩js文件
gulp.task('javascripts', function() {
  return gulp.src('./src/js/*.js')
    .pipe(uglify())
    .pipe(concat('all.min.js'))
    .pipe(gulp.dest('./dist/js'));
});
// 默认任务
gulp.task('default', function(){
  gulp.run('images', 'minifycss', 'lint', 'javascripts');
  // Watch image files
  gulp.watch('./src/images/**/*', ['images']);
  // Watch .css files
  gulp.watch('./src/css/*.css', ['minifycss']);
  // Watch .js files
  gulp.watch('./src/js/*.js', ['lint', 'javascripts']);
});
