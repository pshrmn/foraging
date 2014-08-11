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
                    SelectorFamily: true,
                    tabs: true
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
                  'collector/collector.js': 'src/collector.js'
                }
            }
        },
        jasmine: {
            pivotal: {
                src: 'collector/collector.js',
                options: {
                    specs: 'tests/CollectorSpec.js',
                    helpers: 'tests/CollectorHelper.js'
                }
            }
        }
    });
    
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-html-to-js-str');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    
    grunt.registerTask('default', ['sass', 'html_to_js_str', 'jshint']);

    grunt.registerTask('test', ['html_to_js_str', 'jasmine']);
}
