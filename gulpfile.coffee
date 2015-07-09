require('./lib/reload.js')(require)

gulp =             require('gulp')
$ =                require('gulp-load-plugins')()
open =             require('open')

autoprefixer =     require('autoprefixer-core')
postcssInlineSVG = require('./index.coffee')

gulp.task 'styles', ->
  postcssInlineSVG = require.reload('./index.coffee')

  postcssProcessors = [
    postcssInlineSVG(
      paths: ['example']
      debug: true
      svgo: true
      ei:
        defaults: '[fill]: green'
    )
    autoprefixer(browsers: [ 'last 1 version' ])
  ]

  gulp.src('example/style.css')
    .pipe $.postcss(postcssProcessors)
    .pipe $.rename 'output.css'
    .pipe gulp.dest('example')
    .pipe $.livereload()

gulp.task 'build', ->
  gulp.src(['lib/*.coffee'])
    .pipe $.coffee()
    .pipe gulp.dest('dist/lib')

  gulp.src(['index.coffee'])
    .pipe $.coffee()
    .pipe gulp.dest('dist')

gulp.task 'html', ->
  gulp.src(['example/index.html'])
    .pipe $.livereload()


gulp.task 'watch', ['styles'], ->
  $.livereload.listen()

  gulp.watch ['example/style.css', 'example/*.svg'], ['styles']
  gulp.watch ['index.coffee', 'lib/*.coffee'], ['styles', 'build']
  gulp.watch ['example/index.html'], ['html']

  open('index.html', 'google chrome')
