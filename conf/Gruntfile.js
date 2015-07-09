// npm install -g grunt-cli grunt-init
// npm init 
// npm install grunt matchdep load-grunt-tasks grunt-contrib-imagemin grunt-contrib-jshint grunt-contrib-concat grunt-contrib-uglify grunt-contrib-watch --save-dev

module.exports = function(grunt) {
	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);  ///
	//require('load-grunt-tasks')(grunt); //加载所有的任务
	
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        imagemin: {
            /* 压缩图片大小 */
            dist: {
                files: [{
                    expand: true,
                    cwd: "images/",
                    src: ["**/*.{jpg,png,gif}"],
                    dest: "dist/images/"
                }]
            }
        },
        concat: {
            options: {
              separator: ';',
              stripBanners: true
            },
            js: {
              src: [
                "src/js/*.js"
              ],
              dest: "dist/js/app.js"
            },
            css:{
              src: [
                "src/css/*.css"
              ],
              dest: "dist/css/main.css"
            }
          }
    });
	/*grunt.loadNpmTasks('grunt-contrib-imagemin'); //图像压缩
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-concat');  */
	
    // 注册任务
    grunt.registerTask('default', ['imagemin','concat']);
};