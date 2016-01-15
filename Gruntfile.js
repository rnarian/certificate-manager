module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        dirs: {
            bower: 'bower_components',
            css: 'assets/css',
            fonts: 'assets/fonts',
            images: 'assets/images',
            icons: 'assets/icons',
            js: 'assets/js'
        },

        // SCSS
        sass: {
            dev: {
                options: {
                    outputStyle: 'expanded',
                    loadPath: '.'
                },
                files: {
                    '<%= dirs.css %>/style.css': '<%= dirs.css %>/style.scss'
                }
            },
            build: {
                options: {
                    outputStyle: 'compressed',
                    loadPath: '.'
                },
                files: {
                    '<%= dirs.css %>/style.css': '<%= dirs.css %>/style.scss'
                }
            }
        },

        // Copy
        copy: {
            main: {
                files: [
                    // Font Awesome icon font
                    {cwd: '<%= dirs.bower %>/font-awesome/fonts', src: ['**/*'], dest: '<%= dirs.fonts %>', expand: true}
                ],
            },
        },

        // CSS autoprefixer
        autoprefixer: {
            options: {
                browsers: ['last 2 versions']
            },
            dist: {
                files: {
                    '<%= dirs.css %>/style.css': '<%= dirs.css %>/style.css'
                }
            }
        },

        // Connect Server
        connect: {
            server: {
                options: {
                    port: 9001,
                    base: ''
                }
            }
        },

        // Concat
        concat: {
            options: {
                separator: ';',
            },
            dist: {
                src: [
                '<%= dirs.bower %>/jquery/dist/jquery.js',
                '<%= dirs.bower %>/AdminLTE/dist/js/app.js',
                '<%= dirs.js %>/*.js',
                '!<%= dirs.js %>/modernizr.js',
                '!<%= dirs.js %>/build.js'
                ],
                dest: '<%= dirs.js %>/build.js',
            },
        },

        // JShint
        jshint: {
            all: [
            'Gruntfile.js',
            '<%= dirs.js %>/*.js',
            '!<%= dirs.js %>/modernizr.js',
            '!<%= dirs.js %>/build.js'
            ]
        },

        // HTMLhint
        htmlhint: {
            html: {
                options: {
                    'tag-pair': true
                },
                src: ['*.html']
            }
        },

        // Uglify
        uglify: {
            all: {
                files: {
                    '<%= dirs.js %>/build.js': ['<%= dirs.js %>/build.js'],
                    '<%= dirs.js %>/modernizr.js': ['<%= dirs.bower %>/modernizr/modernizr.js']
                }
            }
        },

        // Imagemin
        imagemin: {
            dynamic: {
                files: [{
                    expand: true,
                    cwd: '<%= dirs.images %>',
                    src: ['**/*.{png,jpg,gif}'],
                    dest: '<%= dirs.images %>'
                }]
            }
        },

        // Browser Sync
        browser_sync: {
            dev: {
                bsFiles: {
                    src : 'assets/css/style.css'
                },
                options: {
                    watchTask: true,
                    server: {
                        baseDir: ""
                    },
                    ghostMode: {
                        clicks: true,
                        scroll: true,
                        links: true,
                        forms: true
                    },
                }
            }
        },

        // Watch
        watch: {
            options: {
                livereload: true
            },
            sass: {
                files: ['<%= dirs.css %>/*.scss'],
                tasks: ['sass:dev', 'autoprefixer']
            },
            images: {
                files: ['<%= dirs.images %>/*.{png,jpg,gif}'],
                tasks: ['imagemin']
            },
            html: {
                files: ['*.html'],
                tasks: ['htmlhint']
            },
            scripts: {
                files: ['Gruntfile.js', '<%= dirs.js %>/*.js'],
                tasks: ['jshint', 'concat'],
                options: {
                    spawn: false
                }
            }
        }
    });

grunt.registerTask('default', ['copy', 'sass:build', 'autoprefixer', 'concat', 'uglify', 'imagemin']);
grunt.registerTask('dev', ['copy', 'connect', 'watch', 'notify']);
grunt.registerTask('dev:sync', ['browser_sync', 'watch', 'notify']);
};