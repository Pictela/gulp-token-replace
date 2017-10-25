var should = require('should');

var fs = require("fs");
var es = require('event-stream');
var gulp = require("gulp");
var replace = require('../');
var concat = require('concat-stream');

describe('source1.html', function() {
  var source1_tokens = require('./fixtures/source1_tokens.js');

  describe('with replace()', function() {
    it('should match source1_output1.html', function(cb) {
      TestReplace('source1.html', null, 'source1_output1.html', true, cb);
    });
  });
  describe('with replace({preserveUnknownTokens: true})', function() {
    it('should match source1.html', function(cb) {
      TestReplace('source1.html', {preserveUnknownTokens: true}, 'source1.html', true, cb);
    });
  });
  describe('with replace({preserveUnknownTokens: false})', function() {
    it('should match source1_output1.html', function(cb) {
      TestReplace('source1.html', {preserveUnknownTokens: false}, 'source1_output1.html', true, cb);
    });
    it('should NOT match source1.html', function(cb) {
      TestReplace('source1.html', {preserveUnknownTokens: false}, 'source1.html', false, cb);
    });
  });
  describe('with replace({tokens: source1_tokens})', function() {
    it('should match source1_output2.html', function(cb) {
      TestReplace('source1.html', {tokens: source1_tokens}, 'source1_output2.html', true, cb);
    });
  });
  describe('with replace({prefix: \'{{\', tokens: source1_tokens})', function() {
    it('should match source1_output2.html', function(cb) {
      TestReplace('source1.html', {prefix: '{{', tokens: source1_tokens}, 'source1_output2.html', true, cb);
    });
  });
  describe('with replace({suffix: \'}}\', tokens: source1_tokens})', function() {
    it('should match source1_output2.html', function(cb) {
      TestReplace('source1.html', {suffix: '}}', tokens: source1_tokens}, 'source1_output2.html', true, cb);
    });
  });
  describe('with replace({prefix: \'{{\', suffix: \'}}\', tokens: source1_tokens})', function() {
    it('should match source1_output2.html', function(cb) {
      TestReplace('source1.html', {prefix: '{{', suffix: '}}', tokens: source1_tokens}, 'source1_output2.html', true, cb);
    });
  });
});

describe('source2.css', function() {
  var source2_tokens = require('./fixtures/source2_tokens.js');

  describe('with replace()', function() {
    it('should match source2.css', function(cb) {
      TestReplace('source2.css', null, 'source2.css', true, cb);
    });
  });
  describe('with replace({prefix: \'[[\', suffix: \']]\', tokens: source2_tokens})', function() {
    it('should match source2_output1.css', function(cb) {
      TestReplace('source2.css', {prefix: '[[', suffix: ']]', tokens: source2_tokens}, 'source2_output1.css', true, cb);
    });
  });
});

describe('source3.txt', function() {
  var source3_tokens = require('./fixtures/source3_tokens.js');

  describe('with replace({preserveUnknownTokens: true})', function() {
    it('should match source3.txt', function(cb) {
      TestReplace('source3.txt', {preserveUnknownTokens: true}, 'source3.txt', true, cb);
    });
  });
  describe('with replace({preserveUnknownTokens: false})', function() {
    it('should match source3_output1.txt', function(cb) {
      TestReplace('source3.txt', {preserveUnknownTokens: false}, 'source3_output1.txt', true, cb);
    });
  });
  describe('with replace({tokens: source3_tokens})', function() {
    it('should match source3_output2.txt', function(cb) {
      TestReplace('source3.txt', {tokens: source3_tokens}, 'source3_output2.txt', true, cb);
    });
  });
});

describe('source4.js', function() {
  var source4_tokens = require('./fixtures/source4_tokens.js');

  describe('with replace({tokens: source4_tokens, preserveUnknownTokens: true})', function() {
    it('should match source4_output1.js', function(cb) {
      TestReplace('source4.js', {tokens: source4_tokens, preserveUnknownTokens: true}, 'source4_output1.js', true, cb);
    });
  });
  describe('with replace({prefix: \'[[\', suffix: \']]\', tokens: source4_tokens})', function() {
    it('should match source4_output2.js', function(cb) {
      TestReplace('source4.js', {prefix: '[[', suffix: ']]', tokens: source4_tokens, preserveUnknownTokens: true}, 'source4_output2.js', true, cb);
    });
  });
});

describe('source5.js', function() {
  describe('Simple replace case {tokens: myvar:"hello"}', function() {
    it('should match source5_output1.js', function(cb) {
      TestReplace('source5.js', {tokens: {myVar:'hello'}, preserveUnknownTokens: true}, 'source5_output1.js', true, cb);
    });
  });
});

describe('source6.js', function() {
  describe('A more complex case where the token value is an object {tokens: myVar:{"hello":{"nested":"object"}}}', function() {
    it('should match source6_output1.js', function(cb) {
      TestReplace('source6.js', {tokens: {myVar:{"hello":{"nested":"object"}}}, preserveUnknownTokens: true}, 'source6_output1.js', true, cb);
    });
  });
});

describe('source7.html', function() {
  var source7_tokens = require('./fixtures/source7_tokens.js');

  describe('with replace({tokens: source7_tokens})', function() {
    it('should NOT match source7_output1.html', function(cb) {
      TestReplace('source7.html', {tokens: source7_tokens}, 'source7_output1.html', false, cb);
    });
  });
  describe('with replace({delimiter: \'.\', tokens: source7_tokens})', function() {
    it('should NOT match source7_output1.html', function(cb) {
      TestReplace('source7.html', {delimiter: '.', tokens: source7_tokens}, 'source7_output1.html', false, cb);
    });
  });
  describe('with replace({delimiter: \'/\', tokens: source7_tokens})', function() {
    it('should match source7_output1.html', function(cb) {
      TestReplace('source7.html', {delimiter: '/', tokens: source7_tokens}, 'source7_output1.html', true, cb);
    });
  });
});

describe('source8.js', function() {
  describe('Nested Array case', function() {
    it('should match source8_output1.js', function(cb) {
      TestReplace('source8.js', {tokens: {"myVar": "test", "array": [ "Headline 1", "Headline 2", "Headline 3" ], "hello":{"nested":"object"}}, preserveUnknownTokens: true}, 'source8_output1.js', true, cb);
    });
  });
});

function TestReplace(sourceFile, options, testFile, shouldEqual, cb) {
  fs.readFile("./test/fixtures/" + testFile, function(err, expectedOutput) {
    if (err) { return cb(err); }

    function _assertOutput(output, expectedOutput) {
      if (shouldEqual) {
        console.log(output, 'should equal', expectedOutput);
        output.should.equal(expectedOutput);
      } else {
        console.log(output, 'should not equal', expectedOutput);
        output.should.not.equal(expectedOutput);
      }
      cb();
    }

    gulp.src("test/fixtures/" + sourceFile)
      .pipe(replace(options))
      .pipe(es.through(function(file) {
        if (file.isStream()) {
          file.contents.pipe(concat(function(output) {
            _assertOutput(String(output), String(expectedOutput));
          }));
        } else if (file.isBuffer()) {
          _assertOutput(String(file.contents), String(expectedOutput));
        } else {
          cb(new Error('unknown file type'));
        }
      }));
  });
}
