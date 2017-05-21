var gulp = require('gulp'); 
var plugins =  require('gulp-load-plugins')();
var config = require('./gulp.config')();


var nodemon = plugins.nodemon;
var env = plugins.env;

gulp.task('default', ['nodemon']); 



gulp.task('nodemon',function () { 
     const envs = env.set({
        NODE_ENV: 'development'
    }); 

     nodemon({
        script: config.nodeServer,
        ext: 'js'      
        // ignore: [config.nodemonIgnore]
    })
    .on('restart', function () {
        console.log('Restarting');
    });
 })

// gulp.task('build', ['jshintBuild'], function() {
//     gulp.src('/')
//         //pipe through other tasks such as sass or coffee compile tasks
//         .pipe(notify({
//             title: 'Task Builder',
//             message: 'Successfully built application'
//         }))
// });
