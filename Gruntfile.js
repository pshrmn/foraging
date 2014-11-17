module.exports = function(grunt){
    
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            options: {
                browser: true,
                validthis: true,
                globalstrict: true,
                globals: {
                    chrome: true
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
                  'src/interface_with_html.js': 'src/interface.js'
                }
            }
        },
        concat: {
            dist: {
                src: ['src/utility.js', 'src/selector.js', 'src/interface_with_html.js',
                    'src/fetch.js', 'src/parent.js', 'src/rule.js', 'src/chrome.js',
                    'src/cycle.js', 'src/views.js', 'src/collector.js'],
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
            interface: {
                src: 'src/interface_with_html.js',
                options: {
                    specs: 'tests/InterfaceSpec.js',
                    helpers: ['src/utility.js']
                }
            },
            fetch: {
                src: 'src/fetch.js',
                options: {
                    specs: 'tests/FetchSpec.js'
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
                    helpers: ['src/utility.js', 'src/parent.js', 'tests/RuleHelper.js']
                }
            },
            parent: {
                src: 'src/parent.js',
                options: {
                    specs: 'tests/ParentSpec.js',
                    helpers: ['src/utility.js', 'src/fetch.js']
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
