module.exports = function (grunt) {
    var exec = require('child_process').exec;
    var fs = require('fs');
    var path = require('path');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        jade: {
            inputDir: 'static/src/views',
            outputDir: 'static/built/views',
        },

        stylus: {
            compile: {
                files: {"static/built/style.css": ["static/stylus/*.styl"]}
            }
        },
    });

    grunt.loadNpmTasks('grunt-contrib-stylus');

    grunt.registerTask('jade', 'Build the templates', function (inputFile) {
        var jade = require ('jade');

        var config = grunt.config.get ('jade');
        var outputDir = config.outputDir;
        var inputDir = config.inputDir;

        var walkDir = function (baseDir) {
            if (!fs.existsSync(outputDir + baseDir))
                fs.mkdirSync(outputDir + baseDir);

            var candidates = grunt.file.expand(inputDir + baseDir + '/*');

            candidates.forEach(function (filename, i) {
                var stat = fs.statSync(filename);
                var ext = path.extname(filename);
                var basename = path.basename(filename).trim().replace(/.jade$/, '');

                if (stat.isDirectory()) {
                    walkDir(baseDir + '/' + basename);
                }
                else if (ext == '.jade') {
                    var buffer = fs.readFileSync(filename);
                    grunt.log.writeln('Compiling: ' + filename);
                    
                    var fn = jade.compile(buffer, {
                        client: true,
                        compileDebug: false
                    });
                    
                    var outputFile = outputDir + baseDir + '/' + basename + '.js';
                    fs.writeFileSync(outputFile, 'define([\'jade\'],function(jade){return ');
                    fs.appendFileSync(outputFile, fn.toString() + '})');
                }
            });
        };
        walkDir('');
    });

    grunt.registerTask('default', ['jade', 'stylus']);
};
