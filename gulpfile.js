/* globals require */


var gulp                  = require('gulp');
var autoprefixer          = require('gulp-autoprefixer');
var concat                = require('gulp-concat');
var cssmin                = require('gulp-cssmin');
var del                   = require('del');
var insert                = require('gulp-insert');
var jscs                  = require('gulp-jscs');
var jsdoc                 = require('gulp-jsdoc');
var jshint                = require('gulp-jshint');
var jshintStylishReporter = require('jshint-stylish');
var merge                 = require('merge-stream');
var path                  = require('path');
var rename                = require('gulp-rename');
var replace               = require('gulp-replace');
var runSequence           = require('run-sequence');
var uglify                = require('gulp-uglify');
var util                  = require('gulp-util');
var wrapUMD               = require('gulp-wrap-umd');



// ------------------------- //
// Helpers                   //
// ------------------------- //

String.EMPTY = '';
String.SPACE = ' ';




// ------------------------- //
// Configuration             //
// ------------------------- //

var config = {
  pkg: require('./package.json'),

  build:   { dir: 'build/' },
  dist:    { dir: 'dist/' },
  docs:    { dir: 'docs/' },
  lint:    {},
  reports: { dir: 'reports/' },
  src:     { dir: 'src/' },
  tests:   { dir: 'test/' },
  umd:     {
    exports: '(function() {\n'
           + '  var ret = {};\n'
           + '  Object.defineProperties(ret, {\n'
           + '    disableStickyTableHeader: {\n'
           + '      configurable: false,\n'
           + '      enumerable:   true,\n'
           + '      writable:     false,\n'
           + '      value:        disableStickyTableHeader\n'
           + '    },\n'
           + '    enableStickyTableHeader: {\n'
           + '      configurable: false,\n'
           + '      enumerable:   true,\n'
           + '      writable:     false,\n'
           + '      value:        enableStickyTableHeader\n'
           + '    },\n'
           + '    manager: {\n'
           + '      configurable: false,\n'
           + '      enumerable:   true,\n'
           + '      writable:     false,\n'
           + '      value:        _globalSTHManager\n'
           + '    },\n'
           + '    StickyTableHeader: {\n'
           + '      configurable: false,\n'
           + '      enumerable:   true,\n'
           + '      writable:     false,\n'
           + '      value:        StickyTableHeader\n'
           + '    }\n'
           + '  });\n'
           + '  return ret;\n'
           + '})()',
    namespace: 'STH'
  }
};

config.fileHeader = "/*!\n * sticky-table-headers.js (" + config.pkg.version + ")\n *\n * Copyright (c) " + (new Date()).getFullYear() + " Brandon Sara (http://bsara.github.io)\n * Licensed under the CPOL-1.02 (https://github.com/bsara/stickytableheaders.js/blob/v" + config.pkg.version + "/LICENSE.md)\n */\n\n";

config.lint.selectors = [
  'gulpfile.js',
  path.join(config.src.dir, '**/*.js'),
  path.join(config.tests.dir, '**/*.js')
];




// ------------------------- //
// Tasks                     //
// ------------------------- //

gulp.task('default', [ 'help' ]);



gulp.task('help', function() {
  var header = util.colors.bold.blue;
  var task = util.colors.green;

  console.log(String.EMPTY);
  console.log(header("sticky-table-headers.js Gulp Tasks"));
  console.log(header("------------------------------------------------------------------------------"));
  console.log("  " + task("help") + " (" + util.colors.yellow("default") + ") - Displays this message.");
  console.log(String.EMPTY);
  console.log("  " + task("build") + "          - Builds the project.");
  console.log("  " + task("rebuild") + "        - Cleans the build folder, then builds the project.");
  console.log("  " + task("docs") + "           - Generates documentation based on inline JSDoc comments.");
  console.log("  " + task("dist") + "           - Performs all needed tasks to prepare the built project");
  console.log("                   for a new release.");
  // console.log(String.EMPTY);
  // console.log("  " + task("test") + "           - Runs the project's tests.");
  console.log(String.EMPTY);
  console.log("  " + task("clean") + "          - Runs all available cleaning tasks in parallel.");
  console.log("  " + task("clean:build") + "    - Cleans the build output directory.");
  console.log("  " + task("clean:docs") + "     - Cleans the documentation output directory.");
  console.log("  " + task("clean:dist") + "     - Cleans the distribution output directory.");
  console.log("  " + task("clean:reports") + "  - Cleans the reports output directory.");
  console.log(String.EMPTY);
  console.log("  " + task("lint") + "           - Runs all available linting tasks in parallel.");
  console.log("  " + task("jshint") + "         - Runs JSHint on the project source files.");
  console.log("  " + task("jscs") + "           - Runs JSCS on the project source files.");
  console.log(String.EMPTY);
});



// Build Tasks
// ----------------

gulp.task('build', function() {
  var manualInitScripts = gulp.src([
                                path.join(config.src.dir, '_sth.js'),
                                path.join(config.src.dir, 'sticky-table-header.js'),
                                path.join(config.src.dir, 'sticky-table-header-manager.js'),
                                path.join(config.src.dir, 'enable-disable.js')
                              ])
                              .pipe(concat('sticky-table-headers.js'));

  var autoInitScripts = gulp.src([
                                path.join(config.src.dir, '_sth.js'),
                                path.join(config.src.dir, 'sticky-table-header.js'),
                                path.join(config.src.dir, 'sticky-table-header-manager.js'),
                                path.join(config.src.dir, 'enable-disable.js'),
                                path.join(config.src.dir, 'auto-init.js')
                              ])
                              .pipe(concat('sticky-table-headers.auto-init.js'));

  var scripts = merge(manualInitScripts, autoInitScripts)
                  .pipe(replace(/\s*\/\/\s*js(hint\s|cs:).*$/gmi, String.EMPTY))
                  .pipe(replace(/\s*\/\*\s*(js(hint|lint|cs:)|global(|s)|export(ed|s))\s.*?\*\/\s*\n/gmi, String.EMPTY))
                  .pipe(wrapUMD({
                    namespace: config.umd.namespace,
                    exports:   config.umd.exports
                  }));

  var styles = gulp.src(path.join(config.src.dir, "**/*.css"))
                   .pipe(autoprefixer({
                     browsers: [ 'last 10 versions' ],
                     remove:   true
                   }))
                   .pipe(rename({ basename: 'sticky-table-headers' }));

  return merge(scripts, styles)
          .pipe(insert.prepend(config.fileHeader))
          .pipe(gulp.dest(config.build.dir));
});


gulp.task('rebuild', function(callback) {
  return runSequence('clean:build', 'build', callback);
});


gulp.task('dist', [ 'clean:build', 'clean:dist' ],  function(callback) {
  return runSequence('lint', 'build', 'test', 'docs', function(err) {
    if (err) {
      callback(err);
      return;
    }

    var srcFiles = gulp.src(path.join(config.build.dir, '**/*'));

    var minifyScripts = gulp.src(path.join(config.build.dir, '**/*.js'))
                            .pipe(uglify({ preserveComments: 'some' }));

    var minifyStyles = gulp.src(path.join(config.build.dir, '**/*.css'))
                           .pipe(cssmin());

    var renameMinifiedFiles = merge(minifyScripts, minifyStyles)
                                .pipe(rename({ suffix: '.min' }));

    merge(srcFiles, renameMinifiedFiles)
      .pipe(gulp.dest(config.dist.dir));

    callback();
  });
});


gulp.task('docs', [ 'clean:docs' ], function() {
  return gulp.src([ path.join(config.src.dir, '**/*.js'), 'README.md' ])
             .pipe(jsdoc.parser(null, 'sticky-table-headers.js'))
             .pipe(jsdoc.generator(config.docs.dir));
});



// Test Tasks
// ----------------

gulp.task('test', [ 'lint' ], function() {
  util.log(util.colors.yellow("Tests are not yet implemented!"));
});



// Clean Tasks
// ----------------

gulp.task('clean', [ 'clean:build', 'clean:dist', 'clean:docs', 'clean:reports' ]);


gulp.task('clean:build', function() {
  return del(config.build.dir);
});


gulp.task('clean:dist', function() {
  return del(config.dist.dir);
});


gulp.task('clean:docs', function() {
  return del(config.docs.dir);
});


gulp.task('clean:reports', function() {
  return del(config.reports.dir);
});



// Lint Tasks
// ----------------

gulp.task('lint', [ 'jshint', 'jscs' ]);


gulp.task('jshint', function() {
  return gulp.src(config.lint.selectors)
             .pipe(jshint())
             .pipe(jshint.reporter(jshintStylishReporter, { verbose: true }))
             .pipe(jshint.reporter('fail', { verbose: true }));
});


gulp.task('jscs', function() {
  return gulp.src(config.lint.selectors)
             .pipe(jscs({ verbose: true }));
});
