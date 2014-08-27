# gulp-token-replace [![NPM version][npm-image]][npm-url] [![Build status][travis-image]][travis-url]

> A token replace plugin for gulp 3

## Installation

First, install `gulp-token-replace` as a development dependency:

`npm install --save-dev gulp-token-replace`

## Usage

Add it to your `gulpfile.js`:

```javascript
var replace = require('gulp-token-replace');

gulp.task('token-replace', function(){
  // regex to find tokens ({{.*?}})
  var config = require('./configuration/config.json');
  return gulp.src(['src/*.js', 'src/*.html'])
    .pipe(replace({global:config}))
    .pipe(gulp.dest('dist/'))
});
```

## Example config

```javascript
{
  "tokens":{
    "RMLibs":"http://ads.pictela.com/ads/jsapi/ADTECH.js",
    "size":"320x50",
    "Copyrights":"Copyright 2010-2014 AOL Platforms.",
    "Author":"Martin Wojtala"
  },
  "main":{
      "name":"example",
      "title":"EXAMPLE TITLE"
    }
}
```

In a file (also works for JavaScript)
```html
<!--{{tokens.Copyrights}}-->
<!--canvasSize:{{tokens.size}}-->
<!DOCTYPE html>
<html lang="en">
<head><title>{{main.title}}</title>
    <meta http-equiv="X-UA-Compatible" content="IE=9">
    <meta charset="UTF-8">
    <script src="{{tokens.RMLibs}}"></script>
    <script src="swipe.min.js"></script>
    <link rel="stylesheet" href="{{main.name}}.css">
    <script src="{{main.name}}.debug.js"></script>
</head>
<body>
<div id="content"></div>
<div id="debug"></div>
</body>
</html>
```

## API

gulp-token-replace can be called with an object [prefix, suffix, globals]

### replace(object)

#### object
Type: `Object`

configuration object.

### replace(object)

*Note:* gulp-token-replace cannot perform regex replacement on streams.

#### regex
Type: `RegExp`

The regex pattern to search for. See the [MDN documentation for RegExp] for details.

[MDN documentation for RegExp]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp
[MDN documentation for String.replace]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace#Specifying_a_string_as_a_parameter

[travis-url]: http://travis-ci.org/lazd/gulp-token-replace
[travis-image]: https://secure.travis-ci.org/lazd/gulp-token-replace.png?branch=master
[npm-url]: https://npmjs.org/package/gulp-token-replace
[npm-image]: https://badge.fury.io/js/gulp-token-replace.png
