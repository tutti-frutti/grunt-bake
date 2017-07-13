module.exports = function (grunt) {
    var MARKUP_MAIN     = 'Markup/def.com';

    function markupMain(url) {
        return [MARKUP_MAIN, url || ''].join('/');
    }

    // load all grunt tasks matching the `grunt-*` pattern
    require('load-grunt-tasks')(grunt);

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        clean: {
            def: 'compile'
        },

        copy: {
            def: {
                expand: true,
                flatten: true,
                cwd: markupMain(),
                src: [
                    'blocks/**/*.{png,gif,jpg,jpeg,svg,ico}'
                ],
                dest: markupMain('dist/images/')
            },
            fonts: {
                expand: true,
                flatten: true,
                src: [
                    'node_modules/font-awesome/fonts/*',
                    'node_modules/bootstrap/fonts/*',
                    'Markup/def.com/blocks/**/fonts/*'
                ],
                dest: markupMain('dist/fonts/')
            }
        },

        concat: {
            options: {
                separator: ';'
            },
            def: {
                files: {
                    'Markup/def.com/dist/js/def-base.js': [
                        // Base libraries
                        'node_modules/jquery/dist/jquery.js',
                        'node_modules/bootstrap/dist/js/bootstrap.js',
                        'node_modules/owl.carousel/dist/owl.carousel.min.js',
                        'node_modules/slick-carousel/slick/slick.min.js',
                    ],
                    'Markup/def.com/dist/js/def-run.js': [
                        // Blocks
                        markupMain('blocks/**/*.js')
                    ]
                }
            }
        },

        bake: {
            main: {
                expand: true,
                src   : [
                    'Markup/def.com/templates/*.html'
                ],
                ext   : '.html',
                rename: function (destBase, destPath)
                {
                    return destPath.replace(/\/templates\//, '/');
                }
            }
        },
        
        uglify: {
            def: {
                files: {
                    'Markup/def.com/dist/js/def-base.js': [
                        markupMain('dist/js/def-base.js')
                    ],
                    'Markup/def.com/dist/js/def-run.js': [
                        markupMain('dist/js/def-run.js')
                    ]
                }
            }
        },

        less: {
            def: {
                files: {
                    'Markup/def.com/dist/css/def.css': markupMain('def.less')
                }
            }
        },

        autoprefixer: {
            options: {
                browsers: [
                    "Android 2.3",
                    "Android >= 4",
                    "Chrome >= 20",
                    "Firefox >= 24",
                    "Explorer >= 8",
                    "iOS >= 6",
                    "Opera >= 12",
                    "Safari >= 6"
                ]
            },
            def: {
                src: markupMain('dist/css/*.css')
            }
        },

        cssmin: {
            def: {
                files: {
                    'Markup/def.com/dist/css/def.css': [
                        markupMain('dist/css/def.css')
                    ]
                }
            }
        },

        watch: {
            styles: {
                files: [
                    markupMain('blocks/**/*.less'),
                    markupMain('less/*')
                ],
                tasks: ['less:def', 'autoprefixer']
            },
            js: {
                files: [
                    markupMain('blocks/**/*.js'),
                    markupMain('js/**/*.js'),
                ],
                tasks: ['js']
            },
            images: {
                files: [markupMain('blocks/**/*.{png,gif,jpg,jpeg,svg}')],
                task: ['copy:def']
            },
            bake: {
                files: [
                    markupMain('templates/*')
                ],
                tasks: ["bake:main"]
            },
            livereload: {
                files: [markupMain('dist/**/*'), markupMain('*.html')],
                options: {
                    livereload: 1337,
                    base: markupMain()
                }
            }
        },

        connect: {
            server: {
                options: {
                    open: {
                        appName: 'Firefox'
                    },
                    port: 8000,
                    base: markupMain(),
                    livereload: 1337
                }
            }
        }
    });

    grunt.registerTask('css',           ['less', 'autoprefixer']);
    grunt.registerTask('js',            ['concat']);
    grunt.registerTask('minify',        ['uglify', 'cssmin']);

    // Default task(s).
    grunt.registerTask('default',       ['clean', 'copy', 'css', 'js', 'minify']);
    grunt.registerTask('dev',           ['clean', 'copy', 'css', 'js']);

    // Helpers
    grunt.registerTask('serve',         ['dev', 'connect', 'watch']);
};
