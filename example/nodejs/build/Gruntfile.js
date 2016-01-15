// npm install -g grunt-cli grunt-init
// npm init
// npm install grunt matchdep load-grunt-tasks grunt-contrib-imagemin grunt-contrib-jshint grunt-contrib-concat grunt-contrib-uglify grunt-contrib-watch --save-dev

module.exports = function (grunt) {
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);  ///
  //require('load-grunt-tasks')(grunt); //加载所有的任务

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    //清除目录
    clean: {
      all: ['dist/**'],
      image: 'dist/images',
      css: 'dist/css',
    },
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
    //压缩CSS
    cssmin: {
      options: {
        report: "min"
      },
      minify:
      {
        expand: true,
        cwd: 'css/',
        src: ['**/*.css', '!*.min.css'],
        dest: 'dist/css/'
      },
      combine: {
        files: {
          'dist/css/yin.css': ['build/css/speak.css', 'css/swiper.min.css']
        }
      }

    },
    //压缩JS
    uglify: {
      prod: {
        options: {
          report: "min",
          sourceMap: true,
          mangle: {
            except: ['require', 'exports', 'module', 'window']
          },
          compress: {
            global_defs: {
              PROD: true
            },
            dead_code: true,
            pure_funcs: [
              "console.log",
              "console.info"
            ]
          }
        },

        files: [{
          expand: true,
          cwd: 'js',
          src: ['**/*.js', '!*.min.js'],
          dest: 'dist/js'
        }]
      },
      release: {
        options: {
          sourceMap: true,
        },
        files: {
          'dist/js/yin.js': ['js/jquery-1.10.1.min.js', 'js/jquery.query-object.js','js/swiper.min.js', 'js/wechat/wechat.js', 'js/speaker/speaker-global.js', 'js/sea.js', 'js/push/socket.io.js', 'js/push/yunba-1.0.1.js', 'js/base64.js', 'js/json2.js' , 'js/tap.js', 'js/tap.js', 'js/cloud/coap.js', 'js/all.js'],

        }
      }
    },
    dataUri: {  // 图片转换成base64链接地址   image -> base64 data url
      dist: {
        // src file
        src: ['css/speak.css'],
        // output dir
        dest: 'build/css',
        options: {
          // specified files are only encoding
          target: ['images/*.*'],
          // adjust relative path?
          fixDirLevel: true,
          // img detecting base dir
          // baseDir: './'

          // Do not inline any images larger
          // than this size. 2048 is a size
          // recommended by Google's mod_pagespeed.
          maxBytes: 12048
        }
      }
    },

    transport: {  // sea.js 模块文件合并 需要转化
        speaker: {
            options: {
                // 是否采用相对地址
                relative: true,
                // 生成具名函数的id的格式 默认值为 {{family}}/{{name}}/{{version}}/{{filename}}
                format: '{{filename}}',
                paths: ['js']
            },
            files: [{
                expand: true,
                // 相对路径地址
                'cwd':'js/',
                // 需要生成具名函数的文件集合
                'src':['function_file.js','swiper_theevent.js','tap_theevent.js','cloud/mq.js' ,'cloud/cloudapi.js' ,'speaker/speaker-pojo.js' , 'speaker/speaker-init.js', 'speaker/speaker-online.js', 'speaker/speaker-view-left.js','speaker/speaker-view-mid.js' ,'speaker/speaker-view-right.js','speaker/speaker-status-recovery.js', 'speaker/speaker-push.js' , 'speaker/speaker-nearby.js' ,'integration.js' ],
                // 生成存放的文件目录。里面的目录结构与 src 里各个文件名带有的目录结构保持一致
                'dest':'build'
            }]
        }
    },
    concat: {
      speaker: {
        options: {
          noncmd: true
        },
        files: {
          'js/all.js': ['build/function_file.js', 'build/swiper_theevent.js', 'build/tap_theevent.js','build/cloud/mq.js' ,'build/cloud/cloudapi.js' ,'build/speaker/speaker-pojo.js' , 'build/speaker/speaker-init.js', 'build/speaker/speaker-online.js', 'build/speaker/speaker-view-left.js','build/speaker/speaker-view-mid.js' ,'build/speaker/speaker-view-right.js','build/speaker/speaker-status-recovery.js', 'build/speaker/speaker-push.js' , 'build/speaker/speaker-nearby.js' ,'build/integration.js'],
        }
      }
    }
    /* concat: {
         options: {
           separator: ';',
           stripBanners: true
         },
         js: {
           src: [
             "js/*.js"
           ],
           dest: "dist/js/app.js"
         },
         css:{
           src: [
             "css/*.css"
           ],
           dest: "dist/css/main.css"
         }
       } */
  });
	/*grunt.loadNpmTasks('grunt-contrib-imagemin'); //图像压缩
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-concat');
 */
  grunt.loadNpmTasks('grunt-data-uri');
  grunt.loadNpmTasks('grunt-cmd-transport');
  grunt.loadNpmTasks('grunt-cmd-concat');

  // 注册任务
  grunt.registerTask('default', ['clean', 'imagemin', 'cssmin', 'uglify', 'dataUri' , 'transport', 'concat']);
  grunt.registerTask('jsbuild', [ 'clean','transport', 'concat' ,'uglify'] );
  grunt.registerTask('cssbuild', [ 'clean','dataUri', 'cssmin'] );

};
