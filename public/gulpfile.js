var	gulp = require('gulp');
	var sass = require('gulp-sass');
	var autoprefixer = require('gulp-autoprefixer');
	var minifyCSS = require('gulp-minify-css');
	var jade = require('gulp-jade');
	var uglify = require('gulp-uglify');
	var rename = require('gulp-rename');
	var concat = require('gulp-concat');
	//var connect = require('gulp-connect');
	var browserSync = require('browser-sync');

	gulp.task('css', function () {
	    gulp.src('source/sass/*.scss')
	        .pipe(sass().on('error',sass.logError))
	        .pipe(autoprefixer())
	        .pipe(minifyCSS())
	        .pipe(rename('style.css'))
	        .pipe(gulp.dest('build'))
					.pipe(browserSync.reload({stream:true}))
	});

	gulp.task('html', function() {
	  gulp.src('source/jade/*.jade')
	    .pipe(jade())
	    .pipe(gulp.dest('build'))
			.pipe(browserSync.reload({stream:true}))
	});

	gulp.task('js', function() {
  gulp.src([
    'bower_components/jquery/dist/jquery.js',
    'bower_components/modernizr/modernizr.js'
  ])
    .pipe( concat('output.min.js') ) // concat pulls all our files together before minifying them
    .pipe(uglify())
    .pipe(gulp.dest('build'))
});

gulp.task('watch', function () {
   gulp.watch('source/sass/*.scss', ['css']);
   gulp.watch('source/jade/*.jade', ['html']);
});


gulp.task('default', ['css', 'html', 'js']);

gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: "build"
    }
  });
});

gulp.task('start', ['browser-sync', 'watch']);
