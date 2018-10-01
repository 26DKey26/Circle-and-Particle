"use strict";

var gulp                 = require('gulp'),
		pug                  = require('gulp-pug'),
		rename               = require('gulp-rename'),
		sass                 = require('gulp-sass'),
		concat               = require('gulp-concat'),
		plumber              = require('gulp-plumber'),
		prefix               = require('gulp-autoprefixer'),
		mmq                  = require('gulp-merge-media-queries'),
		imagemin             = require('gulp-imagemin'),
		browserSync          = require('browser-sync').create();

var useref               = require('gulp-useref'),
		gulpif               = require('gulp-if'),
		cssmin               = require('gulp-clean-css'),
		uglify               = require('gulp-uglify'),
		rimraf               = require('rimraf'),
		notify               = require('gulp-notify'),
		ftp                  = require('vinyl-ftp');

var paths = {
			blocks: 'blocks/',
			devDir: 'app/',
			outputDir: 'build/'
		};


/*********************************
		Developer tasks
*********************************/

//pug compile
gulp.task('pug', function() {
	return gulp.src([paths.blocks + 'pages/**/*.pug' ])
		.pipe(plumber())
		.pipe(pug({pretty: true}))
		.pipe(rename({dirname: ''}))
		.pipe(gulp.dest(paths.devDir))
		.pipe(browserSync.stream())
});

//sass compile
gulp.task('sass', function() {
	return gulp.src(paths.blocks +'*.scss')
		.pipe(plumber())
		.pipe(sass({
      sourcemaps: true,
    }).on('error', sass.logError))
		.pipe(prefix({
			browsers: ['last 10 versions'],
			cascade: true
		}))
		.pipe(mmq())
		.pipe(gulp.dest(paths.devDir + 'css/'))
		.pipe(browserSync.stream());
});

//js compile
gulp.task('scripts', function() {
	return gulp.src([
			paths.blocks + '**/*.js',
			'!' + paths.blocks + '_assets/**/*.js'
		])
		.pipe(concat('main.js'))
		.pipe(gulp.dest(paths.devDir + 'js/'))
		.pipe(browserSync.stream());
});

//watch
gulp.task('watch', function() {
	gulp.watch(paths.blocks + '**/*.pug', ['pug']);
	gulp.watch(paths.blocks + '**/*.scss', ['sass']);
	gulp.watch(paths.devDir + '**/*.js', ['scripts']);
});

//server
gulp.task('browser-sync', function() {
	browserSync.init({
		port: 9000,
		server: {
			baseDir: paths.devDir
		}
	});
});


/*********************************
		Production tasks
*********************************/

//clean
gulp.task('clean', function(cb) {
	rimraf(paths.outputDir, cb);
});

//css + js
gulp.task('build', ['clean'], function () {
  return gulp.src(paths.devDir + '*.html')
		.pipe( useref() )
		.pipe( gulpif('*.js', uglify()) )
		.pipe( gulpif('*.css', cssmin()) )
		.pipe( gulp.dest(paths.outputDir) );
});

//copy images to outputDir
gulp.task('imgBuild', ['clean'], function() {
	return gulp.src(paths.devDir + 'img/**/*.*')
		.pipe(imagemin())
		.pipe(gulp.dest(paths.outputDir + 'img/'));
});

//copy fonts to outputDir
gulp.task('fontsBuild', ['clean'], function() {
	return gulp.src(paths.devDir + '/fonts/*')
		.pipe(gulp.dest(paths.outputDir + 'fonts/'));
});
//copy no minify scripts to outputDir
gulp.task('mainJS', ['clean'], function() {
	return gulp.src(paths.devDir + '/js/main.js')
		.pipe(gulp.dest(paths.outputDir + 'js'));
});

//ftp
gulp.task('send', function() {
	var conn = ftp.create({
		host:     '',
		user:     '',
		password: '',
		parallel: 5
	});

	/* list all files you wish to ftp in the glob variable */
	var globs = [
		'build/**/*',
		'!node_modules/**' // if you wish to exclude directories, start the item with an !
	];

	return gulp.src( globs, { base: '.', buffer: false } )
		.pipe( conn.newer( '/' ) ) // only upload newer files
		.pipe( conn.dest( '/' ) )
		.pipe(notify("Dev site updated!"));

});


//default
gulp.task('default', ['browser-sync', 'watch', 'pug', 'sass', 'scripts']);

//production
gulp.task('prod', ['build', 'imgBuild', 'fontsBuild', 'mainJS']);
