var gulp          = require('gulp');
var autoprefixer  = require('gulp-autoprefixer');
var browserSync   = require('browser-sync');
var del           = require('del');
var extend   			= require('gulp-extend');
var minifyCss     = require('gulp-minify-css');
var ngAnnotate    = require('gulp-ng-annotate');
var plumber       = require('gulp-plumber');
var rev           = require('gulp-rev');
var sass          = require('gulp-sass');
var sequence      = require('run-sequence');
var templateCache = require('gulp-angular-templateCache');
var uglify        = require('gulp-uglify');
var usemin        = require('gulp-usemin');
var wiredep       = require('wiredep').stream;
var yaml          = require('gulp-yaml');

// Default task
gulp.task('default', ['wiredep', 'styles', 'yaml', 'serve', 'watch']);

// Build task
gulp.task('build', function() {
	sequence('clean',
		['styles', 'wiredep', 'yaml', 'copy'],
		'usemin');
});

// Watches
gulp.task('watch', function() {
	gulp.watch('**/*.html').on('change', browserSync.reload);
  gulp.watch('scss/**/*.scss', ['styles']);
  gulp.watch('app/**/*.js').on('change', browserSync.reload);
  gulp.watch('templates/**.html', ['templates']);
  gulp.watch('*.yml', ['yaml']);
});

// BrowserSync Server
gulp.task('serve', function() {
	browserSync({
		server: {
			baseDir: './'
		},
		open: true,
		online: false,
    notify: false
	});
});

// SASS + Autoprefixer
gulp.task('styles', function() {
	return gulp.src('scss/**/*.scss')
		.pipe(sass({
      outputStyle: 'nested'
    }).on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      remove: true
    }))
    .pipe(gulp.dest('css'))
    .pipe(browserSync.reload({stream: true}));
});

// Wiredep
gulp.task('wiredep', function() {
  return gulp.src('index.html')
    .pipe(wiredep({
      directory: 'bower_components'
    }))
    .pipe(gulp.dest('./'));
});

// YAML
gulp.task('yaml', function() {
  return gulp.src('data/*.yaml')
    .pipe(yaml())
    .pipe(extend('data.json'))
    .pipe(gulp.dest('data'))
    .pipe(browserSync.reload({stream: true}));
});


/**
 * Build
 */
gulp.task('usemin', function() {
  return gulp.src('index.html')
    .pipe(usemin({
      jsVendor: [uglify(), rev()],
      jsSource: [ngAnnotate(), uglify(), rev()],
      css: [minifyCss(), rev()]
    }))
    .pipe(gulp.dest('dist/'));
});

// Clean Dist
gulp.task('clean', function(cb) {
  del(['dist/'], { force: true }, cb);
});

// Copy
gulp.task('copy', function() {
	gulp.src('images/**/*', { base: './' }).pipe(gulp.dest('dist'));
	gulp.src('fonts/**/*', { base: './' }).pipe(gulp.dest('dist'));
  gulp.src('data.json', { base: './' }).pipe(gulp.dest('dist'));
	gulp.src('favicon.*', { base: './' }).pipe(gulp.dest('dist'));
});

// Concat the templates
gulp.task('templates', function() {
  return gulp.src('templates/**/*.html')
    .pipe(templateCache())
    .pipe(gulp.dest('./app'));
});