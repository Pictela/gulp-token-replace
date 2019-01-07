'use strict';

var concat = require('concat-stream');
var es = require('event-stream');
var PluginError = require('plugin-error');

module.exports = function(options) {
  options = injectDefaultOptions(options);

  return es.through(function(file) {
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
  });
};

function injectDefaultOptions(options) {
  options = options || {};
  options.prefix = options.prefix || '{{';
  options.suffix = options.suffix || '}}';
  options.tokens = options.tokens || options.global || {};
  options.preserveUnknownTokens = options.preserveUnknownTokens || false;
  options.delimiter = options.delimiter || '.';
  return options;
}

function replace(text, options) {
  options = injectDefaultOptions(options);

  var includeRegExp = new RegExp(escapeRegExp(options.prefix) + "(.+?)" + escapeRegExp(options.suffix), "g");

  var retVal = text;
  var regExpResult;
  while (regExpResult = includeRegExp.exec(text)) {
    var arrayDetected = false;
    var arrayItemId = -1;
    var fullMatch = regExpResult[0];
    var tokenName = regExpResult[1];
    if (tokenName.indexOf('[') > 0) {
      arrayItemId = tokenName.toString().split('[')[1].split(']')[0];
      tokenName = tokenName.toString().split('[')[0];
    }
    var tokenValue = getTokenValue(options.tokens, tokenName, options.delimiter);
    if (tokenValue === null && !options.preserveUnknownTokens) {
      tokenValue = '';
    }
    if (tokenValue !== null) {
      if (typeof tokenValue == 'object') {
        if (Array.isArray(tokenValue)) {
          if (arrayItemId > -1) {
            tokenValue = tokenValue[arrayItemId];
          } else {
            tokenValue = JSON.stringify(tokenValue).split(',');
          }
        } else {
          tokenValue = JSON.stringify(tokenValue);
        }
      }
      retVal = retVal.replace(fullMatch, tokenValue);
    }
  }
  return retVal;
}

function escapeRegExp(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

function getTokenValue(tokens, tokenName, delimiter) {
  var tmpTokens = tokens;
  var tokenNameParts = tokenName.split(delimiter);
  for (var i = 0; i < tokenNameParts.length; i++) {
    if (tmpTokens.hasOwnProperty(tokenNameParts[i])) {
      tmpTokens = tmpTokens[tokenNameParts[i]];
    } else {
      return null;
    }
  }
  return tmpTokens;
}
