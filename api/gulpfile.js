"use strict";
let gulp = require("gulp");
let sourcemaps = require("gulp-sourcemaps");
let typescript = require("gulp-typescript");
let nodemon = require("gulp-nodemon");
let tslint = require("gulp-tslint");
let runSequence = require("run-sequence");
let rimraf = require("rimraf");
let typedoc = require("gulp-typedoc");
let mocha = require("gulp-mocha");
let istanbul = require("gulp-istanbul");
let plumber = require("gulp-plumber");
let remapIstanbul = require("remap-istanbul/lib/gulpRemapIstanbul");

const CLEAN_BUILD = "clean:build";
const CLEAN_COVERAGE = "clean:coverage";
const CLEAN_DOC = "clean:doc";
const TSLINT = "tslint";
const TSLINT_DEV = "tslint:dev";
const COMPILE_TYPESCRIPT = "compile:typescript";
const BUILD = "build";
const BUILD_DEV = "build:dev";
const GENERATE_DOC = "generate:doc";
const PRETEST = "pretest";
const RUN_TESTS = "run:tests";
const COPY_FIXTURES = "copy:fixtures";
const LOAD_FIXTURES = "load:fixtures";
const TEST = "test";
const TEST_NATIVE = "test:native";
const REMAP_COVERAGE = "remap:coverage";
const WATCH = "watch";
const WATCH_POLL = "watch:poll";
const DEBUG = "debug";
const INSPECT = "inspect";

const SRC_GLOB = "./src/**/*";
const TS_SRC_GLOB = SRC_GLOB + ".ts";
const TEST_GLOB = "./test/**/*";
const TS_TEST_GLOB = TEST_GLOB + ".ts";
const FIXTURES_GLOB = "./fixtures/**/*";
const TS_FIXTURES_GLOB = FIXTURES_GLOB + ".ts";

const BUILD_GLOB = "./build/";
const BUILD_TEST_GLOB = BUILD_GLOB + "test/**/*";
const JS_TEST_GLOB = BUILD_TEST_GLOB + ".js";
const BUILD_SRC_GLOB = BUILD_GLOB + "src/**/*";
const JS_SRC_GLOB = BUILD_SRC_GLOB + ".js";
const TS_GLOB = [TS_SRC_GLOB, TS_TEST_GLOB, TS_FIXTURES_GLOB];

const tsProject = typescript.createProject("tsconfig.json");

// Removes the ./build directory with all its content.
gulp.task(CLEAN_BUILD, function (callback) {
  rimraf("./build", callback);
});

// Removes the ./coverage directory with all its content.
gulp.task(CLEAN_COVERAGE, function (callback) {
  rimraf("./coverage", callback);
});

// Removes the ./docs directory with all its content.
gulp.task(CLEAN_DOC, function (callback) {
  rimraf("./docs", callback);
});

// Checks all *.ts-files if they are conform to the rules specified in tslint.json.
gulp.task(TSLINT, function () {
  return gulp.src(TS_GLOB)
    .pipe(tslint({formatter: "verbose"}))
    .pipe(tslint.report({
      // set this to true, if you want the build process to fail on tslint errors.
      emitError: true
    }));
});

// Checks all *.ts-files if they are conform to the rules specified in tslint.json. WON'T ERROR ON LINTING ERROR.
gulp.task(TSLINT_DEV, function () {
  return gulp.src(TS_GLOB)
    .pipe(tslint({formatter: "verbose"}))
    .pipe(tslint.report({
      // set this to true, if you want the build process to fail on tslint errors.
      emitError: false
    }));
});

// Compiles all *.ts-files to *.js-files.
gulp.task(COMPILE_TYPESCRIPT, function () {
  return gulp.src(TS_GLOB, {base: "."})
    .pipe(sourcemaps.init())
    .pipe(tsProject())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest("./build"));
});

gulp.task(COPY_FIXTURES, function () {
  return gulp.src([FIXTURES_GLOB, "!" + TS_FIXTURES_GLOB], {base: "."})
    .pipe(gulp.dest(BUILD_GLOB));
})

// Runs all required steps for the build in sequence.
gulp.task(BUILD, function (callback) {
  runSequence(CLEAN_BUILD, TSLINT, COMPILE_TYPESCRIPT, COPY_FIXTURES, callback);
});

// Runs all required steps for the build in sequence FOR DEVELOP
gulp.task(BUILD_DEV, function (callback) {
  runSequence(CLEAN_BUILD, TSLINT_DEV, COMPILE_TYPESCRIPT, COPY_FIXTURES, callback);
});

// Generates a documentation based on the code comments in the *.ts files.
gulp.task(GENERATE_DOC, [CLEAN_DOC], function () {
  return gulp.src(TS_SRC_GLOB)
    .pipe(typedoc({
      out: "./docs",
      readme: "readme.md",
      version: true,
      module: "commonjs"
    }));
});

// Sets up the istanbul coverage
gulp.task(PRETEST, function () {
  gulp.src(JS_SRC_GLOB)
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(istanbul({includeUntested: true}))
    .pipe(istanbul.hookRequire())
});

// Run the tests via mocha and generate a istanbul json report.
gulp.task(RUN_TESTS, function (callback) {
  let mochaError;
  gulp.src(JS_TEST_GLOB)
    .pipe(plumber())
    .pipe(mocha({reporter: "spec"}))
    .on("error", function (err) {
      mochaError = err;
    })
    .pipe(istanbul.writeReports({
      reporters: ["json"]
    }))
    .on("end", function () {
      callback(mochaError);
    });
});

// Remap Coverage to *.ts-files and generate html, text and json summary
gulp.task(REMAP_COVERAGE, function () {
  return gulp.src("./coverage/coverage-final.json")
    .pipe(remapIstanbul({
      // basePath: ".",
      fail: true,
      reports: {
        "html": "./coverage",
        "json": "./coverage/coverage-report.json",
        "text-summary": null,
        "lcovonly": "./coverage/lcov.info"
      }
    }))
    .pipe(gulp.dest("coverage"))
    .on("end", function () {
      console.log("--> For a more detailed report, check the ./coverage directory <--")
    });
});

// Runs all required steps for testing in sequence.
gulp.task(TEST, function (callback) {
  runSequence(BUILD, CLEAN_COVERAGE, PRETEST, RUN_TESTS, REMAP_COVERAGE, callback);
});

gulp.task(TEST_NATIVE, function (callback) {
  runSequence(BUILD, CLEAN_COVERAGE, callback);
});

// Runs the build task and starts the server every time changes are detected.
gulp.task(WATCH, [BUILD_DEV], function () {
  return nodemon({
    ext: "ts js json",
    script: "build/src/server.js",
    watch: ["src/*", "test/*"],
    tasks: [BUILD_DEV]
  });
});

// Runs the build task and starts the server every time changes are detected WITH LEGACY-WATCH ENABLED.
gulp.task(WATCH_POLL, [BUILD_DEV], function () {
  return nodemon({
    ext: "ts js json",
    script: "build/src/server.js",
    watch: ["src/*", "test/*"],
    legacyWatch: true, // Uses the legacy polling to get changes even on docker/vagrant-mounts
    tasks: [BUILD_DEV]
  });
});

gulp.task(LOAD_FIXTURES, [BUILD_DEV], function () {
  require(__dirname + "/build/fixtures/load");
});

gulp.task(DEBUG, [BUILD_DEV], function () {
  return nodemon({
    ext: "ts js json",
    script: "build/src/server.js",
    watch: ["src/*", "test/*"],
    tasks: [BUILD_DEV],
    nodeArgs: ["--debug=9000"]
  });
});

gulp.task(INSPECT, [BUILD_DEV], function () {
  return nodemon({
    ext: "ts js json",
    script: "build/src/server.js",
    watch: ["src/*", "test/*"],
    tasks: [BUILD_DEV],
    nodeArgs: ["--inspect=0.0.0.0:9229"]
  });
});
