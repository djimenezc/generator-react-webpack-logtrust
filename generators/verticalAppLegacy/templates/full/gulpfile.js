'use strict';

var caspers = ['cc_self:snWEy964', 'cc_self:eBVbj130'];

var argv = require('yargs').argv;
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');
var concat = require('gulp-concat');
var browserify = require('browserify');
var watchify = require('watchify');
var debowerify = require('debowerify');
var streamify = require('gulp-streamify');
var inject = require('gulp-inject');
var injectStr = require('gulp-inject-string');
var inline = require('gulp-inline');
var source = require('vinyl-source-stream');
var rename = require('gulp-rename');
var del = require('del');
var gutil = require('gulp-util');
var gulpif = require('gulp-if');

var production = argv.production;
var dir = process.cwd();
var dist = dir + '/dist/';

gulp.task('clean', function() {
  return del([dist]);
});

gulp.task('styles', ['clean'], function() {
  return gulp.src(dir + '/styles/*.css')
    .pipe(gulpif(production, minifyCss()))
    .pipe(gulpif(production, concat('styles.min.css')))
    .pipe(gulpif(!production, concat('styles.css')))
    .pipe(gulp.dest(dist));
});

gulp.task('scripts', ['clean'], function() {
  var bundler = browserify({
    entries : dir + '/app.js',
    debug : true,
    transform : [debowerify]
  });

  bundler.on('log', gutil.log);

  function rebundle() {
    return bundler.bundle().on('error', gutil.log
      .bind(gutil, 'Browserify Error'))
      .pipe(source('app.js'))
      .pipe(gulpif(production, streamify(uglify())))
      .pipe(gulpif(production, rename({suffix : '.min'})))
      .pipe(gulp.dest(dist));
  }

  return rebundle();
});

gulp.task('inject', ['scripts', 'styles'], function() {
  var sources = gulp.src(['../../appUtils/cryptojs.js',
                          '../../appUtils/ResizeSensor.js',
                          '../../appUtils/ElementQueries.js',
                          '../../appUtils/newTemplateUtils.js',
                          '../../appUtils/widgetUtils.js',
                          dist + '/*.js', dist + '/*.css'],
                         {read : false});
  /* CASPERABLES */
  var caspersTot = caspers.length;
  var caspStr = '';
  if(caspersTot > 0) {
    caspStr += '<script>/* CASPERCONF';
    for(var i=0; i < caspersTot; i++) {
      caspStr+= ' -'+caspers[i];
    }
    caspStr += ' */</script>\n';
  }

  return gulp.src(dir + '/index.html')
    .pipe(inject(sources))
    .pipe(injectStr.prepend(caspStr))
    .pipe(gulp.dest(dist));
});

gulp.task('inline', ['inject'], function() {
  return gulp.src(dist + 'index.html')
    .pipe(inline({base : dir}))
    .pipe(gulp.dest(dist));
});

gulp.task('build', ['inline']);

gulp.task('watch', ['build'], function() {
  gulp.watch([dir + '/styles/*.css',
              dir + '/index.html',
              dir + '/app.js',
              dir + '/scripts/**/*.js'], ['build']);
});

gulp.task('default', ['build', 'watch']);
