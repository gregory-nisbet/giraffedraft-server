var gulp = require('gulp');
var mocha = require('gulp-mocha');

gulp.task('default',['test']);

gulp.task('test', function (){
	// what does read do?
	return gulp.src('test/tests.js', {read : false})
		.pipe(mocha({reporter : 'nyan'}));
});