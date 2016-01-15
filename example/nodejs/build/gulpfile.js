// npm install gulp -g
// npm install --save-dev gulp-util gulp-imagemin  gulp-ruby-sass gulp-minify-css gulp-jshint gulp-uglify gulp-rename gulp-concat gulp-clean gulp-livereload tiny-lr

var gulp = require('gulp');
// 引入组件
var imagemin = require('gulp-imagemin');
var minifycss = require('gulp-minify-css');
var uglify = require('gulp-uglify');
// var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var clean = require('gulp-clean');          //清空文件夹
// 压缩图片
gulp.task('images', function() {
  return gulp.src('./images/**/*')
    .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
    .pipe(gulp.dest('./dist/images'))
});
// 合并、压缩、重命名css
gulp.task('minifycss', function() {
  return gulp.src('./css/*.css')
    .pipe(minifycss())
    .pipe(concat('all.min.css'))
    .pipe(gulp.dest('./dist/css'));
});

// 合并，压缩js文件
gulp.task('minifyjs', function() {
  return gulp.src('./js/**/*.js')
    .pipe(uglify())
    //.pipe(concat('all.min.js'))
    .pipe(gulp.dest('./dist/js'));
});

// 清空图片、样式、js
gulp.task('clean', function() {
  return gulp.src(['./dist/js','./dist/css'], {read: false})
    .pipe(clean({force: true}));
});

// gulp.task('watch', function(){
  // gulp.watch('./images/**/*', ['images']);
  // gulp.watch('./css/*.css', ['minifycss']);
  // gulp.watch('./js/*.js', ['lint', 'javascripts']);
// })


// 默认任务
// gulp.task('default', ['images', 'minifycss', 'minifyjs']);
gulp.task('default', function(){
  gulp.run('images', 'minifycss',  'minifyjs');

});
