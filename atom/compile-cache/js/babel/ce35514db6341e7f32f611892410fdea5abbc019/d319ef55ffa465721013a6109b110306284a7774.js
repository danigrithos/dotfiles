function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

// eslint-disable-next-line import/extensions, import/no-extraneous-dependencies

var _atom = require('atom');

'use babel';

module.exports = {
  config: {
    executablePath: {
      type: 'string',
      'default': _path2['default'].join(__dirname, '..', 'node_modules', 'jshint', 'bin', 'jshint'),
      description: 'Path of the `jshint` node script'
    },
    lintInlineJavaScript: {
      type: 'boolean',
      'default': false,
      description: 'Lint JavaScript inside `<script>` blocks in HTML or PHP files.'
    },
    disableWhenNoJshintrcFileInPath: {
      type: 'boolean',
      'default': false,
      description: 'Disable linter when no `.jshintrc` is found in project.'
    },
    jshintFileName: {
      type: 'string',
      'default': '.jshintrc',
      description: 'jshint file name'
    }
  },

  activate: function activate() {
    var _this = this;

    require('atom-package-deps').install('linter-jshint');

    this.scopes = ['source.js', 'source.js-semantic'];
    this.subscriptions = new _atom.CompositeDisposable();
    this.subscriptions.add(atom.config.observe('linter-jshint.executablePath', function (executablePath) {
      _this.executablePath = executablePath;
    }));
    this.subscriptions.add(atom.config.observe('linter-jshint.disableWhenNoJshintrcFileInPath', function (disableWhenNoJshintrcFileInPath) {
      _this.disableWhenNoJshintrcFileInPath = disableWhenNoJshintrcFileInPath;
    }));

    this.subscriptions.add(atom.config.observe('linter-jshint.jshintFileName', function (jshintFileName) {
      _this.jshintFileName = jshintFileName;
    }));

    var scopeEmbedded = 'source.js.embedded.html';
    this.subscriptions.add(atom.config.observe('linter-jshint.lintInlineJavaScript', function (lintInlineJavaScript) {
      _this.lintInlineJavaScript = lintInlineJavaScript;
      if (lintInlineJavaScript) {
        _this.scopes.push(scopeEmbedded);
      } else if (_this.scopes.indexOf(scopeEmbedded) !== -1) {
        _this.scopes.splice(_this.scopes.indexOf(scopeEmbedded), 1);
      }
    }));
  },

  deactivate: function deactivate() {
    this.subscriptions.dispose();
  },

  provideLinter: function provideLinter() {
    var _this2 = this;

    var Helpers = require('atom-linter');
    var Reporter = require('jshint-json');

    return {
      name: 'JSHint',
      grammarScopes: this.scopes,
      scope: 'file',
      lintOnFly: true,
      lint: _asyncToGenerator(function* (textEditor) {
        var results = [];
        var filePath = textEditor.getPath();
        var fileContents = textEditor.getText();
        var parameters = ['--reporter', Reporter, '--filename', filePath];

        var configFile = yield Helpers.findCachedAsync(_path2['default'].dirname(filePath), _this2.jshintFileName);

        if (configFile) {
          parameters.push('--config', configFile);
        } else if (_this2.disableWhenNoJshintrcFileInPath) {
          return results;
        }

        if (_this2.lintInlineJavaScript && textEditor.getGrammar().scopeName.indexOf('text.html') !== -1) {
          parameters.push('--extract', 'always');
        }
        parameters.push('-');

        var execOpts = { stdin: fileContents, ignoreExitCode: true };
        var result = yield Helpers.execNode(_this2.executablePath, parameters, execOpts);

        if (textEditor.getText() !== fileContents) {
          // File has changed since the lint was triggered, tell Linter not to update
          return null;
        }

        var parsed = undefined;
        try {
          parsed = JSON.parse(result);
        } catch (_) {
          // eslint-disable-next-line no-console
          console.error('[Linter-JSHint]', _, result);
          atom.notifications.addWarning('[Linter-JSHint]', { detail: 'JSHint return an invalid response, check your console for more info' });
          return results;
        }

        Object.keys(parsed.result).forEach(function (entryID) {
          var entry = parsed.result[entryID];

          if (!entry.error.id) {
            return;
          }

          var error = entry.error;
          var errorType = error.code.substr(0, 1);
          var type = 'Info';
          if (errorType === 'E') {
            type = 'Error';
          } else if (errorType === 'W') {
            type = 'Warning';
          }
          var errorLine = error.line > 0 ? error.line - 1 : 0;
          var range = undefined;

          // TODO: Remove workaround of jshint/jshint#2846
          if (error.character === null) {
            range = Helpers.rangeFromLineNumber(textEditor, errorLine);
          } else {
            var character = error.character > 0 ? error.character - 1 : 0;
            var line = errorLine;
            var buffer = textEditor.getBuffer();
            var maxLine = buffer.getLineCount();
            // TODO: Remove workaround of jshint/jshint#2894
            if (errorLine >= maxLine) {
              line = maxLine;
            }
            var maxCharacter = buffer.lineLengthForRow(line);
            // TODO: Remove workaround of jquery/esprima#1457
            if (character > maxCharacter) {
              character = maxCharacter;
            }
            range = Helpers.rangeFromLineNumber(textEditor, line, character);
          }

          results.push({
            type: type,
            text: error.code + ' - ' + error.reason,
            filePath: filePath,
            range: range
          });
        });
        return results;
      })
    };
  }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2RkZXdleS8uYXRvbS9wYWNrYWdlcy9saW50ZXItanNoaW50L2xpYi9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7b0JBSWlCLE1BQU07Ozs7OztvQkFFYSxNQUFNOztBQU4xQyxXQUFXLENBQUM7O0FBUVosTUFBTSxDQUFDLE9BQU8sR0FBRztBQUNmLFFBQU0sRUFBRTtBQUNOLGtCQUFjLEVBQUU7QUFDZCxVQUFJLEVBQUUsUUFBUTtBQUNkLGlCQUFTLGtCQUFLLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLGNBQWMsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLFFBQVEsQ0FBQztBQUM5RSxpQkFBVyxFQUFFLGtDQUFrQztLQUNoRDtBQUNELHdCQUFvQixFQUFFO0FBQ3BCLFVBQUksRUFBRSxTQUFTO0FBQ2YsaUJBQVMsS0FBSztBQUNkLGlCQUFXLEVBQUUsZ0VBQWdFO0tBQzlFO0FBQ0QsbUNBQStCLEVBQUU7QUFDL0IsVUFBSSxFQUFFLFNBQVM7QUFDZixpQkFBUyxLQUFLO0FBQ2QsaUJBQVcsRUFBRSx5REFBeUQ7S0FDdkU7QUFDRCxrQkFBYyxFQUFFO0FBQ2QsVUFBSSxFQUFFLFFBQVE7QUFDZCxpQkFBUyxXQUFXO0FBQ3BCLGlCQUFXLEVBQUUsa0JBQWtCO0tBQ2hDO0dBQ0Y7O0FBRUQsVUFBUSxFQUFBLG9CQUFHOzs7QUFDVCxXQUFPLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7O0FBRXRELFFBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxXQUFXLEVBQUUsb0JBQW9CLENBQUMsQ0FBQztBQUNsRCxRQUFJLENBQUMsYUFBYSxHQUFHLCtCQUF5QixDQUFDO0FBQy9DLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLDhCQUE4QixFQUFFLFVBQUMsY0FBYyxFQUFLO0FBQzdGLFlBQUssY0FBYyxHQUFHLGNBQWMsQ0FB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O09BQ2hCLENBQUE7S0FDRixDQUFDO0dBQ0g7Q0FDRixDQUFDIiwiZmlsZSI6Ii9ob21lL2RkZXdleS8uYXRvbS9wYWNrYWdlcy9saW50ZXItanNoaW50L2xpYi9tYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbi8qIEBmbG93ICovXG5cbmltcG9ydCBQYXRoIGZyb20gJ3BhdGgnO1xuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9leHRlbnNpb25zLCBpbXBvcnQvbm8tZXh0cmFuZW91cy1kZXBlbmRlbmNpZXNcbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUgfSBmcm9tICdhdG9tJztcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGNvbmZpZzoge1xuICAgIGV4ZWN1dGFibGVQYXRoOiB7XG4gICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgIGRlZmF1bHQ6IFBhdGguam9pbihfX2Rpcm5hbWUsICcuLicsICdub2RlX21vZHVsZXMnLCAnanNoaW50JywgJ2JpbicsICdqc2hpbnQnKSxcbiAgICAgIGRlc2NyaXB0aW9uOiAnUGF0aCBvZiB0aGUgYGpzaGludGAgbm9kZSBzY3JpcHQnLFxuICAgIH0sXG4gICAgbGludElubGluZUphdmFTY3JpcHQ6IHtcbiAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgICAgZGVzY3JpcHRpb246ICdMaW50IEphdmFTY3JpcHQgaW5zaWRlIGA8c2NyaXB0PmAgYmxvY2tzIGluIEhUTUwgb3IgUEhQIGZpbGVzLicsXG4gICAgfSxcbiAgICBkaXNhYmxlV2hlbk5vSnNoaW50cmNGaWxlSW5QYXRoOiB7XG4gICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICAgIGRlc2NyaXB0aW9uOiAnRGlzYWJsZSBsaW50ZXIgd2hlbiBubyBgLmpzaGludHJjYCBpcyBmb3VuZCBpbiBwcm9qZWN0LicsXG4gICAgfSxcbiAgICBqc2hpbnRGaWxlTmFtZToge1xuICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICBkZWZhdWx0OiAnLmpzaGludHJjJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnanNoaW50IGZpbGUgbmFtZScsXG4gICAgfSxcbiAgfSxcblxuICBhY3RpdmF0ZSgpIHtcbiAgICByZXF1aXJlKCdhdG9tLXBhY2thZ2UtZGVwcycpLmluc3RhbGwoJ2xpbnRlci1qc2hpbnQnKTtcblxuICAgIHRoaXMuc2NvcGVzID0gWydzb3VyY2UuanMnLCAnc291cmNlLmpzLXNlbWFudGljJ107XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKTtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci1qc2hpbnQuZXhlY3V0YWJsZVBhdGgnLCAoZXhlY3V0YWJsZVBhdGgpID0+IHtcbiAgICAgIHRoaXMuZXhlY3V0YWJsZVBhdGggPSBleGVjdXRhYmxlUGF0aDtcbiAgICB9KSk7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci1qc2hpbnQuZGlzYWJsZVdoZW5Ob0pzaGludHJjRmlsZUluUGF0aCcsXG4gICAgICAgIChkaXNhYmxlV2hlbk5vSnNoaW50cmNGaWxlSW5QYXRoKSA9PiB7XG4gICAgICAgICAgdGhpcy5kaXNhYmxlV2hlbk5vSnNoaW50cmNGaWxlSW5QYXRoID0gZGlzYWJsZVdoZW5Ob0pzaGludHJjRmlsZUluUGF0aDtcbiAgICAgICAgfSxcbiAgICAgICksXG4gICAgKTtcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLWpzaGludC5qc2hpbnRGaWxlTmFtZScsIChqc2hpbnRGaWxlTmFtZSkgPT4ge1xuICAgICAgdGhpcy5qc2hpbnRGaWxlTmFtZSA9IGpzaGludEZpbGVOYW1lO1xuICAgIH0pKTtcblxuICAgIGNvbnN0IHNjb3BlRW1iZWRkZWQgPSAnc291cmNlLmpzLmVtYmVkZGVkLmh0bWwnO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLWpzaGludC5saW50SW5saW5lSmF2YVNjcmlwdCcsXG4gICAgICAobGludElubGluZUphdmFTY3JpcHQpID0+IHtcbiAgICAgICAgdGhpcy5saW50SW5saW5lSmF2YVNjcmlwdCA9IGxpbnRJbmxpbmVKYXZhU2NyaXB0O1xuICAgICAgICBpZiAobGludElubGluZUphdmFTY3JpcHQpIHtcbiAgICAgICAgICB0aGlzLnNjb3Blcy5wdXNoKHNjb3BlRW1iZWRkZWQpO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuc2NvcGVzLmluZGV4T2Yoc2NvcGVFbWJlZGRlZCkgIT09IC0xKSB7XG4gICAgICAgICAgdGhpcy5zY29wZXMuc3BsaWNlKHRoaXMuc2NvcGVzLmluZGV4T2Yoc2NvcGVFbWJlZGRlZCksIDEpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICkpO1xuICB9LFxuXG4gIGRlYWN0aXZhdGUoKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKTtcbiAgfSxcblxuICBwcm92aWRlTGludGVyKCkge1xuICAgIGNvbnN0IEhlbHBlcnMgPSByZXF1aXJlKCdhdG9tLWxpbnRlcicpO1xuICAgIGNvbnN0IFJlcG9ydGVyID0gcmVxdWlyZSgnanNoaW50LWpzb24nKTtcblxuICAgIHJldHVybiB7XG4gICAgICBuYW1lOiAnSlNIaW50JyxcbiAgICAgIGdyYW1tYXJTY29wZXM6IHRoaXMuc2NvcGVzLFxuICAgICAgc2NvcGU6ICdmaWxlJyxcbiAgICAgIGxpbnRPbkZseTogdHJ1ZSxcbiAgICAgIGxpbnQ6IGFzeW5jICh0ZXh0RWRpdG9yKSA9PiB7XG4gICAgICAgIGNvbnN0IHJlc3VsdHMgPSBbXTtcbiAgICAgICAgY29uc3QgZmlsZVBhdGggPSB0ZXh0RWRpdG9yLmdldFBhdGgoKTtcbiAgICAgICAgY29uc3QgZmlsZUNvbnRlbnRzID0gdGV4dEVkaXRvci5nZXRUZXh0KCk7XG4gICAgICAgIGNvbnN0IHBhcmFtZXRlcnMgPSBbJy0tcmVwb3J0ZXInLCBSZXBvcnRlciwgJy0tZmlsZW5hbWUnLCBmaWxlUGF0aF07XG5cbiAgICAgICAgY29uc3QgY29uZmlnRmlsZSA9IGF3YWl0IEhlbHBlcnMuZmluZENhY2hlZEFzeW5jKFxuICAgICAgICAgIFBhdGguZGlybmFtZShmaWxlUGF0aCksIHRoaXMuanNoaW50RmlsZU5hbWUsXG4gICAgICAgICk7XG5cbiAgICAgICAgaWYgKGNvbmZpZ0ZpbGUpIHtcbiAgICAgICAgICBwYXJhbWV0ZXJzLnB1c2goJy0tY29uZmlnJywgY29uZmlnRmlsZSk7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5kaXNhYmxlV2hlbk5vSnNoaW50cmNGaWxlSW5QYXRoKSB7XG4gICAgICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5saW50SW5saW5lSmF2YVNjcmlwdCAmJlxuICAgICAgICAgIHRleHRFZGl0b3IuZ2V0R3JhbW1hcigpLnNjb3BlTmFtZS5pbmRleE9mKCd0ZXh0Lmh0bWwnKSAhPT0gLTFcbiAgICAgICAgKSB7XG4gICAgICAgICAgcGFyYW1ldGVycy5wdXNoKCctLWV4dHJhY3QnLCAnYWx3YXlzJyk7XG4gICAgICAgIH1cbiAgICAgICAgcGFyYW1ldGVycy5wdXNoKCctJyk7XG5cbiAgICAgICAgY29uc3QgZXhlY09wdHMgPSB7IHN0ZGluOiBmaWxlQ29udGVudHMsIGlnbm9yZUV4aXRDb2RlOiB0cnVlIH07XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IEhlbHBlcnMuZXhlY05vZGUoXG4gICAgICAgICAgdGhpcy5leGVjdXRhYmxlUGF0aCwgcGFyYW1ldGVycywgZXhlY09wdHMsXG4gICAgICAgICk7XG5cbiAgICAgICAgaWYgKHRleHRFZGl0b3IuZ2V0VGV4dCgpICE9PSBmaWxlQ29udGVudHMpIHtcbiAgICAgICAgICAvLyBGaWxlIGhhcyBjaGFuZ2VkIHNpbmNlIHRoZSBsaW50IHdhcyB0cmlnZ2VyZWQsIHRlbGwgTGludGVyIG5vdCB0byB1cGRhdGVcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBwYXJzZWQ7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgcGFyc2VkID0gSlNPTi5wYXJzZShyZXN1bHQpO1xuICAgICAgICB9IGNhdGNoIChfKSB7XG4gICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcbiAgICAgICAgICBjb25zb2xlLmVycm9yKCdbTGludGVyLUpTSGludF0nLCBfLCByZXN1bHQpO1xuICAgICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRXYXJuaW5nKCdbTGludGVyLUpTSGludF0nLFxuICAgICAgICAgICAgeyBkZXRhaWw6ICdKU0hpbnQgcmV0dXJuIGFuIGludmFsaWQgcmVzcG9uc2UsIGNoZWNrIHlvdXIgY29uc29sZSBmb3IgbW9yZSBpbmZvJyB9LFxuICAgICAgICAgICk7XG4gICAgICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgICAgIH1cblxuICAgICAgICBPYmplY3Qua2V5cyhwYXJzZWQucmVzdWx0KS5mb3JFYWNoKChlbnRyeUlEKSA9PiB7XG4gICAgICAgICAgY29uc3QgZW50cnkgPSBwYXJzZWQucmVzdWx0W2VudHJ5SURdO1xuXG4gICAgICAgICAgaWYgKCFlbnRyeS5lcnJvci5pZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbnN0IGVycm9yID0gZW50cnkuZXJyb3I7XG4gICAgICAgICAgY29uc3QgZXJyb3JUeXBlID0gZXJyb3IuY29kZS5zdWJzdHIoMCwgMSk7XG4gICAgICAgICAgbGV0IHR5cGUgPSAnSW5mbyc7XG4gICAgICAgICAgaWYgKGVycm9yVHlwZSA9PT0gJ0UnKSB7XG4gICAgICAgICAgICB0eXBlID0gJ0Vycm9yJztcbiAgICAgICAgICB9IGVsc2UgaWYgKGVycm9yVHlwZSA9PT0gJ1cnKSB7XG4gICAgICAgICAgICB0eXBlID0gJ1dhcm5pbmcnO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb25zdCBlcnJvckxpbmUgPSBlcnJvci5saW5lID4gMCA/IGVycm9yLmxpbmUgLSAxIDogMDtcbiAgICAgICAgICBsZXQgcmFuZ2U7XG5cbiAgICAgICAgICAvLyBUT0RPOiBSZW1vdmUgd29ya2Fyb3VuZCBvZiBqc2hpbnQvanNoaW50IzI4NDZcbiAgICAgICAgICBpZiAoZXJyb3IuY2hhcmFjdGVyID09PSBudWxsKSB7XG4gICAgICAgICAgICByYW5nZSA9IEhlbHBlcnMucmFuZ2VGcm9tTGluZU51bWJlcih0ZXh0RWRpdG9yLCBlcnJvckxpbmUpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgY2hhcmFjdGVyID0gZXJyb3IuY2hhcmFjdGVyID4gMCA/IGVycm9yLmNoYXJhY3RlciAtIDEgOiAwO1xuICAgICAgICAgICAgbGV0IGxpbmUgPSBlcnJvckxpbmU7XG4gICAgICAgICAgICBjb25zdCBidWZmZXIgPSB0ZXh0RWRpdG9yLmdldEJ1ZmZlcigpO1xuICAgICAgICAgICAgY29uc3QgbWF4TGluZSA9IGJ1ZmZlci5nZXRMaW5lQ291bnQoKTtcbiAgICAgICAgICAgIC8vIFRPRE86IFJlbW92ZSB3b3JrYXJvdW5kIG9mIGpzaGludC9qc2hpbnQjMjg5NFxuICAgICAgICAgICAgaWYgKGVycm9yTGluZSA+PSBtYXhMaW5lKSB7XG4gICAgICAgICAgICAgIGxpbmUgPSBtYXhMaW5lO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgbWF4Q2hhcmFjdGVyID0gYnVmZmVyLmxpbmVMZW5ndGhGb3JSb3cobGluZSk7XG4gICAgICAgICAgICAvLyBUT0RPOiBSZW1vdmUgd29ya2Fyb3VuZCBvZiBqcXVlcnkvZXNwcmltYSMxNDU3XG4gICAgICAgICAgICBpZiAoY2hhcmFjdGVyID4gbWF4Q2hhcmFjdGVyKSB7XG4gICAgICAgICAgICAgIGNoYXJhY3RlciA9IG1heENoYXJhY3RlcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJhbmdlID0gSGVscGVycy5yYW5nZUZyb21MaW5lTnVtYmVyKHRleHRFZGl0b3IsIGxpbmUsIGNoYXJhY3Rlcik7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmVzdWx0cy5wdXNoKHtcbiAgICAgICAgICAgIHR5cGUsXG4gICAgICAgICAgICB0ZXh0OiBgJHtlcnJvci5jb2RlfSAtICR7ZXJyb3IucmVhc29ufWAsXG4gICAgICAgICAgICBmaWxlUGF0aCxcbiAgICAgICAgICAgIHJhbmdlLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgICB9LFxuICAgIH07XG4gIH0sXG59O1xuIl19