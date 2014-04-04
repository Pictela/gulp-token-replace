'use strict';

var concat = require('concat-stream'),
  es = require('event-stream'),
  PluginError = require('gulp-util').PluginError;

module.exports = function(options) {
  //gutil.log(JSON.stringify(options);
  options = options || {};
  var prefix = options.prefix || '{{';
  var suffix = options.suffix || '}}';
  var global = options.global || {};
  var includeRegExp = new RegExp(/({{.*?}})/g);

  function tokenReplace(file) {
    var self = this;
    if (file.isNull()) {
      self.emit('data', file);
    } else if (file.isStream()) {
      file.contents.pipe(concat(function(data) {
        var text = String(data);
        self.emit('data', replace(file, text, includeRegExp, prefix, suffix, global));
      }));
    } else if (file.isBuffer()) {
      try {
        self.emit('data', replace(file, String(file.contents), includeRegExp, prefix, suffix, global));
      } catch (e) {
        self.emit('error', new PluginError('gulp-token-replace', e));
      }
    }
  }

  return es.through(tokenReplace);
};

function replace(file, text, includeRegExp, prefix, suffix, global) {
  prefix = prefix || ''; //TODO(martin.wojtala): implement prefix and suffix
  suffix = suffix || '';
  global = global || {};
  var matches = includeRegExp.exec(text);
  while (matches) {
    var match = matches[0],
      tempName = matches[1].split('{{')[1];
    var token = tempName.split('}}')[0].toString();
    var tokenValue = ref(global, token);
    if(typeof tokenValue === 'object'){
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
  for(var i = 0; i < ps.length; i++)
  {
    co = (co[ps[i]])? co[ps[i]] : co[ps[i]] = {};
  }
  return co;
}
