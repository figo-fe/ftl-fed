module.exports = function (grunt){

    require('load-grunt-tasks')(grunt); //加载所有的任务

    grunt.initConfig({
        // Metadata.
        pkg: grunt.file.readJSON('package.json'),
        banner: '',
        connect: require('./grunt/server')
    });

    grunt.registerTask('default', ['connect']);
};