# gulp-token-replace [![NPM version][npm-image]][npm-url] [![Build status][travis-image]][travis-url]
> A token replace plugin for gulp 3

## Usage

First, install `gulp-token-replace` as a development dependency:

```shell
npm install --save-dev gulp-token-replace
```

Then, add it to your `gulpfile.js`:

```javascript
var jshint = require('gulp-token-replace');

gulp.task('templates', function(){
  gulp.src(['file.txt'])
    .pipe(replace(/foo(.{3})/g, '$1foo'))
    .pipe(gulp.dest('build/file.txt'));
});
gulp.task('token-replace', function(){
  // regex to find tokens ({{.*?}})
  var config = require('./configuration/config.json');
  return gulp.src(['src/*.js', src/*.html'])
    .pipe(tokenReplace({global:config}))
    .pipe(gulp.dest('dist/'))
})
```


## API

gulp-token-replace can be called with an object [prefix, suffix, globals]

### replace(object)

#### object
Type: `Object`

configuration object.

### tokenReplace(object)

*Note:* gulp-token-replace cannot perform regex replacement on streams.

#### regex
Type: `RegExp`

The regex pattern to search for. See the [MDN documentation for RegExp] for details.

#### replacement
Type: `String` or `Function`

The replacement string or function. See the [MDN documentation for String.replace] for details.


[MDN documentation for RegExp]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp
[MDN documentation for String.replace]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace#Specifying_a_string_as_a_parameter

[travis-url]: http://travis-ci.org/lazd/gulp-token-replace
[travis-image]: https://secure.travis-ci.org/lazd/gulp-token-replace.png?branch=master
[npm-url]: https://npmjs.org/package/gulp-token-replace
[npm-image]: https://badge.fury.io/js/gulp-token-replace.png
