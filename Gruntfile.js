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
                    //tabs: true
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
        html_to_js_str: {
            test: {
                files: {
                  'src/collector_with_html.js': 'src/collector.js'
                }
            }
        },
        concat: {
            dist: {
                src: ['src/utility.js', 'src/selector.js', 'src/rule.js', 
                    'src/cycle.js', 'src/collector_with_html.js'],
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
            collector: {
                src: 'src/collector_with_html.js',
                options: {
                    specs: 'tests/CollectorSpec.js',
                    helpers: ['src/utility.js', 'src/Cycle.js', 'tests/CollectorHelper.js']
                }
            },
            utility: {
                src: 'src/utility.js',
                options: {
                    specs: 'tests/UtilitySpec.js'
                }
            },
            rule: {
                src: 'src/rule.js',
                options: {
                    specs: 'tests/RuleSpec.js',
                    helpers: 'src/utility.js'
                }
            }
        }
    });
    
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-html-to-js-str');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-concat');
    
    grunt.registerTask('default', ['sass', 'html_to_js_str', 'concat', 'jshint']);

    grunt.registerTask('test', ['html_to_js_str', 'jasmine']);
}
