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
                expr: true,
                esnext: true
            },
            all: ['forager/forager.js']
        },
        sass: {
            dist: {
                files: {
                    'forager/css/interface.css': 'src/css/interface.scss'
                }
            }
        },
        concat: {
            dist: {
                src: ['src/attributes.js', 'src/objects.js', 'src/markup.js',
                    'src/selector.js', 'src/page.js', 'src/preview.js',
                    'src/ui/previewView.js',
                    'src/controller.js', 'src/chrome.js', 'src/utility.js',
                    'src/ui/topbar.js', 'src/ui/ruleView.js', 
                    'src/ui/pageView.js', 'src/ui/selectorView.js',
                    'src/ui/treeView.js', 'src/ui/optionsView.js',
                    'src/ui/ui.js', 'src/forager.js'],
                dest: 'forager/forager.js',
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
