module.exports = function (grunt) {
    var exec = require('child_process').exec;
    var fs = require('fs');
    var path = require('path');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        jade: {
            inputDir: 'static/src/sicki/views',
            outputFile: 'static/built/templates.js',
            namespace: 'sicki.views'
        }
    });

    grunt.registerTask('jade', 'Build the templates', function (inputFile) {
        var config = grunt.config.get ('jade');
        var outputFile = config.outputFile;
        var jade = require ('jade');

        // Check to see if jade templates are defined: Don't clobber templates that 
        // have been brought in
        fs.writeFileSync(outputFile, '');
        
        var walkDir = function (baseDir, prefix) {
            fs.writeFileSync(outputFile, prefix + '={};');
            var candidates = grunt.file.expand(baseDir + '/*');
            candidates.forEach(function (filename, i) {
                var stat = fs.statSync(filename);
                var ext = path.extname(filename);
                if (stat.isDirectory()) {
                    // Later: Do something with namepsace
                    walkDir(filename, prefix + '.' + path.basename(filename));
                }
                else if (ext == '.jade') {
                    var buffer = fs.readFileSync(filename);
                    grunt.log.writeln('Compiling: ' + filename);
                    
                    var fn = jade.compile(buffer, {
                        client: true,
                        compileDebug: false
                    });
                    
                    var basename = path.basename(filename).trim().replace(/.jade$/, '');
                    var jt = prefix + '.' + basename + ' = ';
                    jt += fn.toString() + ';';
                    fs.appendFileSync(outputFile, jt);
                }
            });
        };
        walkDir(config.inputDir, config.namespace);
    });
};
