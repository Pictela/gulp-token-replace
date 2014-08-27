'use strict';

var concat = require('concat-stream');
var es = require('event-stream');
var PluginError = require('gulp-util').PluginError;

module.exports = function(options) {
  //gutil.log(JSON.stringify(options);
  options = injectDefaultOptions(options);

  function tokenReplace(file) {
    var self = this;
    try {
      if (file.isNull()) {
        self.emit('data', file);
      } else if (file.isStream()) {
        file.contents.pipe(concat(function(data) {
          file.contents = new Buffer(replace(String(data), options));
          self.emit('data', file);
        }));
      } else if (file.isBuffer()) {
        file.contents = new Buffer(replace(String(file.contents), options));
        self.emit('data', file);
      } else {
        self.emit('error', new PluginError('gulp-token-replace', new Error('unknown type of file')));
      }
    } catch (e) {
      self.emit('error', new PluginError('gulp-token-replace', e));
    }
  }

  return es.through(tokenReplace);
};

function injectDefaultOptions(options) {
  options = options || {};
  options.prefix = options.prefix || '{{';
  options.suffix = options.suffix || '}}';
  options.tokens = options.tokens || options.global || {};
  options.preserveUnknownTokens = options.preserveUnknownTokens || false;
  return options;
}

function replace(text, options) {
  options = injectDefaultOptions(options);

  var includeRegExp = new RegExp(escapeRegExp(options.prefix) + "(.+?)" + escapeRegExp(options.suffix), "g");

  var regExpResult;
  while (regExpResult = includeRegExp.exec(text)) {
    var fullMatch = regExpResult[0];
    var tokenName = regExpResult[1];
    var tokenValue = getTokenValue(options.tokens, tokenName);
    if (tokenValue === null && !options.preserveUnknownTokens) {
      tokenValue = '';
    }
    if (tokenValue !== null) {
      text = text.replace(fullMatch, tokenValue);
    }
  }
  return text;
}

function escapeRegExp(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

function getTokenValue(tokens, tokenName) {
  var tmpTokens = tokens;
  var tokenNameParts = tokenName.split('.');
  for (var i = 0; i < tokenNameParts.length; i++) {
    if (tmpTokens.hasOwnProperty(tokenNameParts[i])) {
      tmpTokens = tmpTokens[tokenNameParts[i]];
    } else {
      return null;
    }
  }
  return tmpTokens;
}