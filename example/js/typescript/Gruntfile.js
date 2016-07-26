module.exports = function (grunt) {
    "use strict";

    grunt.initConfig({
        ts:  //用来编译typescript的任务
        {
            options: 
            {
               compile: true,  
                sourceMap: true,   
                comments: false,               // 删除注释
                target: 'es5',                 // es5,默认为es3
                module: 'system',            // 
                declaration: true,             // 生成.d.ts
            },

            build: 
            {
                src: ["./ts/*.ts"],  
               // reference: 'core/reference.ts',  //第一次生成reference.ts,之后手动修改顺序,之后注释掉
                out: './build/all.js', 
            }
        },


        uglify: //uglify插件用来代码压缩,生成min.js
        {
            min: 
            {
              files: {'build/all.min.js': ['build/all.js']}
            }
        },

        //copy插件把build目录下的所有文件复制到test文件夹
        copy:
        {
           builds: {expand: true, cwd: 'build/', src: '*', dest: 'test/'}
        }

    });

 
    grunt.loadNpmTasks("grunt-ts");     
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-uglify");

    //任务顺序: 编译typescript -> 生成min.js -> 复制build目录里的文件到ProjectA_Test
    grunt.registerTask("default", ["ts:build" , "uglify:min" , "copy:builds"]);
};