const gulp = require('gulp');
const GulpSSH = require('gulp-ssh');
const stylus = require('gulp-stylus');
const nodemon = require('gulp-nodemon');
const gulpif = require('gulp-if');
const rsync = require('gulp-rsync');
const browserSync = require('browser-sync');
const fs = require('fs');

const { reload } = browserSync;
const config = require('./config/config');

const sshConfig = {
  host: '145.14.157.75',
  port: 22,
  username: 'root',
  privateKey: fs.readFileSync('./config/devoir_eu_server_rsa')
};

const serverDestination = '/var/www/html/';

let gulpSSH = new GulpSSH ({
  ignoreErrors: false,
  sshConfig: sshConfig
});

gulp.task('dest', function() {
  return gulp
    .src(['./**', '!./node_modules', '!./node_modules/**', '!./public', '!./public/**'])
    .pipe(gulpSSH.dest(''))
});

gulp.task('stylus', () => {
  gulp.src('./public/styl/*.styl')
    .pipe(stylus())
    .pipe(gulp.dest('./public/css'))
    .pipe(reload({ stream: true }));
});

gulp.task('watch', () => {
  gulp.watch('./public/styl/*.styl', ['stylus']);
});

gulp.task('browser-sync', ['nodemon'], () => {
  browserSync.init(null, {
    proxy: `http://localhost:${config.server.port}`,
    files: ['public/**/*.*', '**.js'],
    browser: 'google chrome',
    port: 80,
  });
});

gulp.task('nodemon', cb => nodemon({
  exec: 'node --inspect',
  script: 'app.js',
  ext: 'js pug',
  env: { NODE_ENV: 'development', DEBUG: 'myapp:*' },
}).once('start', cb)
  .on('restart', () => {
    setTimeout(() => {
      browserSync.reload({ stream: false });
    }, 1000);
  }));

gulp.task('deploy', function() {
  
  // Dirs and Files to sync
  rsyncPaths = [ './public/**', './config/**', './app/**' ];
  
  // Default options for rsync
  rsyncConf = {
    progress: true,
    incremental: true,
    relative: true,
    emptyDirectories: true,
    recursive: true,
    clean: true,
    exclude: [],
  };
  
  // Staging
  // if (argv.staging) {
    
    rsyncConf.hostname = sshConfig.host; // hostname
    rsyncConf.username = sshConfig.username; // ssh username
    rsyncConf.destination = serverDestination; // path where uploaded files go
    
  // // Production
  // } else if (argv.production) {

  //   rsyncConf.hostname = ''; // hostname
  //   rsyncConf.username = ''; // ssh username
  //   rsyncConf.destination = ''; // path where uploaded files go
    
  
  // // Missing/Invalid Target  
  // } else {
  //   throwError('deploy', gutil.colors.red('Missing or invalid target'));
  // }
  

  // Use gulp-rsync to sync the files 
  return gulp.src(rsyncPaths)
  // .pipe(gulpif(
      // argv.production, 
      // prompt.confirm({
        // message: 'Heads Up! Are you SURE you want to push to PRODUCTION?',
        // default: false
      // })
  // ))
  .pipe(rsync(rsyncConf));

});


function throwError(taskName, msg) {
  throw new gutil.PluginError({
      plugin: taskName,
      message: msg
    });
}

gulp.task('default', [
  'stylus',
  'nodemon',
  'watch',
  'browser-sync',
]);
