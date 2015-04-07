module.exports = function(grunt){
    
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            options: {
                browser: true,
                validthis: true,
                globalstrict: true,
                globals: {
                    chrome: true,
                    d3: true
                },
                devel: true,
                expr: true
            },
            all: ['collector/collector.js']
        },
        sass: {
            dist: {
                files: {
                    'collector/css/interface.css': 'src/css/interface.scss'
                }
            }
        },
        concat: {
            dist: {
                src: ['src/attributes.js', 'src/objects.js', 'src/markup.js',
                    'src/selector.js', 'src/page.js', 'src/preview.js',
                    'src/controller.js',
                    'src/topbar.js', 'src/chrome.js', 'src/utility.js',
                    'src/ruleView.js', 'src/pageView.js',
                    'src/selectorView.js', 'src/treeView.js',
                    'src/ui.js', 'src/collector.js'],
                dest: 'collector/collector.js',
                options: {
                    banner: "'use strict';\n",
                    process: function(src, filepath) {
                      return '// Source: ' + filepath + '\n' +
                        src.replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1');
                    },
                }
            },
        },
        jasmine: {
            utility: {
                src: 'src/utility.js',
                options: {
                    specs: 'tests/UtilitySpec.js'
                }
            },
            attributes: {
                src: 'src/attributes.js',
                options: {
                    specs: 'tests/AttributesSpec.js'
                }
            }
        }
    });
    
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-concat');
    
    grunt.registerTask('default', ['sass', 'concat', 'jshint']);

    grunt.registerTask('test', ['jasmine']);
}
