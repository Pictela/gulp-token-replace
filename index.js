'use strict';

var concat = require('concat-stream');
var es = require('event-stream');
var PluginError = require('gulp-util').PluginError;

module.exports = function(options) {
  //gutil.log(JSON.stringify(options);
  options = injectDefaultOptions(options);

  function tokenReplace(file) {
    var self = this;
    if (file.isNull()) {
      self.emit('data', file);
    } else if (file.isStream()) {
      file.contents.pipe(concat(function(data) {
        var text = String(data);
        self.emit('data', replace(file, text, options));
      }));
    } else if (file.isBuffer()) {
      try {
        self.emit('data', replace(file, String(file.contents), options));
      } catch (e) {
        self.emit('error', new PluginError('gulp-token-replace', e));
      }
    }
  }

  return es.through(tokenReplace);
};

function injectDefaultOptions(options) {
  options = options || {};
  options.prefix = options.prefix || '{{';
  options.suffix = options.suffix || '}}';
  options.tokens = options.tokens || options.global || {};
  return options;
}

function replace(file, text, options) {
  options = injectDefaultOptions(options);

  var includeRegExp = new RegExp("(" + options.prefix + ".*?" + options.suffix + ")", "g");

  var matches = includeRegExp.exec(text);
  while (matches) {
    var match = matches[0];
    var tempName = matches[1].split(options.prefix)[1];
    var token = tempName.split(options.suffix)[0].toString();
    var tokenValue = ref(options.tokens, token);
    if (typeof tokenValue === 'object') {
      tokenValue = JSON.stringify(tokenValue);
    }
    text = text.replace(match, tokenValue);
    if (matches[3]) {
      // replace variables
      var data = JSON.parse(matches[3]);
      for (var k in data) {
        text = text.replace(new RegExp(prefix + k, 'g'), data[k]);
      }
    }

    matches = includeRegExp.exec(text);
  }
  file.contents = new Buffer(text);
  return file;
}

function ref(obj, str) {
  var ps = str.split('.'), co = obj;
  for (var i = 0; i < ps.length; i++) {
    co = (co[ps[i]]) ? co[ps[i]] : co[ps[i]] = {};
  }
  return co;
}
