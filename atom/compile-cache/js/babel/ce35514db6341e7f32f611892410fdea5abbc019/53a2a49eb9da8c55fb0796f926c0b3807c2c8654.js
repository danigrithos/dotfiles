Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

// eslint-disable-next-line import/extensions, import/no-extraneous-dependencies

var _atom = require('atom');

var _fsPlus = require('fs-plus');

var _fsPlus2 = _interopRequireDefault(_fsPlus);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _atomLinter = require('atom-linter');

var helpers = _interopRequireWildcard(_atomLinter);

// Local variables
'use babel';var parseRegex = /(\d+):(\d+):\s(([A-Z])\d{2,3})\s+(.*)/g;

var applySubstitutions = function applySubstitutions(givenExecPath, projDir) {
  var execPath = givenExecPath;
  var projectName = _path2['default'].basename(projDir);
  execPath = execPath.replace(/\$PROJECT_NAME/ig, projectName);
  execPath = execPath.replace(/\$PROJECT/ig, projDir);
  var paths = execPath.split(';');
  for (var i = 0; i < paths.length; i += 1) {
    if (_fsPlus2['default'].existsSync(paths[i])) {
      return paths[i];
    }
  }
  return execPath;
};

var getVersionString = _asyncToGenerator(function* (versionPath) {
  if (!Object.hasOwnProperty.call(getVersionString, 'cache')) {
    getVersionString.cache = new Map();
  }
  if (!getVersionString.cache.has(versionPath)) {
    getVersionString.cache.set(versionPath, (yield helpers.exec(versionPath, ['--version'])));
  }
  return getVersionString.cache.get(versionPath);
});

var generateInvalidPointTrace = _asyncToGenerator(function* (execPath, match, filePath, textEditor, point) {
  var flake8Version = yield getVersionString(execPath);
  var issueURL = 'https://github.com/AtomLinter/linter-flake8/issues/new';
  var title = encodeURIComponent('Flake8 rule \'' + match[3] + '\' reported an invalid point');
  var body = encodeURIComponent(['Flake8 reported an invalid point for the rule `' + match[3] + '`, ' + ('with the messge `' + match[5] + '`.'), '', '', '<!-- If at all possible, please include code that shows this issue! -->', '', '', 'Debug information:', 'Atom version: ' + atom.getVersion(), 'Flake8 version: `' + flake8Version + '`'].join('\n'));
  var newIssueURL = issueURL + '?title=' + title + '&body=' + body;
  return {
    type: 'Error',
    severity: 'error',
    html: 'ERROR: Flake8 provided an invalid point! See the trace for details. ' + ('<a href="' + newIssueURL + '">Report this!</a>'),
    filePath: filePath,
    range: helpers.rangeFromLineNumber(textEditor, 0),
    trace: [{
      type: 'Trace',
      text: 'Original message: ' + match[3] + ' — ' + match[5],
      filePath: filePath,
      severity: 'info'
    }, {
      type: 'Trace',
      text: 'Requested point: ' + (point.line + 1) + ':' + (point.col + 1),
      filePath: filePath,
      severity: 'info'
    }]
  };
});

exports['default'] = {
  activate: function activate() {
    var _this = this;

    require('atom-package-deps').install('linter-flake8');

    this.subscriptions = new _atom.CompositeDisposable();
    this.subscriptions.add(atom.config.observe('linter-flake8.disableTimeout', function (value) {
      _this.disableTimeout = value;
    }));
    this.subscriptions.add(atom.config.observe('linter-flake8.projectConfigFile', function (value) {
      _this.projectConfigFile = value;
    }));
    this.subscriptions.add(atom.config.observe('linter-flake8.maxLineLength', function (value) {
      _this.maxLineLength = value;
    }));
    this.subscriptions.add(atom.config.observe('linter-flake8.ignoreErrorCodes', function (value) {
      _this.ignoreErrorCodes = value;
    }));
    this.subscriptions.add(atom.config.observe('linter-flake8.maxComplexity', function (value) {
      _this.maxComplexity = value;
    }));
    this.subscriptions.add(atom.config.observe('linter-flake8.selectErrors', function (value) {
      _this.selectErrors = value;
    }));
    this.subscriptions.add(atom.config.observe('linter-flake8.hangClosing', function (value) {
      _this.hangClosing = value;
    }));
    this.subscriptions.add(atom.config.observe('linter-flake8.executablePath', function (value) {
      _this.executablePath = value;
    }));
    this.subscriptions.add(atom.config.observe('linter-flake8.pycodestyleErrorsToWarnings', function (value) {
      _this.pycodestyleErrorsToWarnings = value;
    }));
    this.subscriptions.add(atom.config.observe('linter-flake8.flakeErrors', function (value) {
      _this.flakeErrors = value;
    }));
  },

  deactivate: function deactivate() {
    this.subscriptions.dispose();
  },

  provideLinter: function provideLinter() {
    var _this2 = this;

    return {
      name: 'Flake8',
      grammarScopes: ['source.python', 'source.python.django'],
      scope: 'file',
      lintOnFly: true,
      lint: _asyncToGenerator(function* (textEditor) {
        var filePath = textEditor.getPath();
        var fileText = textEditor.getText();

        var parameters = ['--format=default'];

        var projectPath = atom.project.relativizePath(filePath)[0];
        var baseDir = projectPath !== null ? projectPath : _path2['default'].dirname(filePath);
        var configFilePath = yield helpers.findCachedAsync(baseDir, _this2.projectConfigFile);

        if (_this2.projectConfigFile && baseDir !== null && configFilePath !== null) {
          parameters.push('--config', configFilePath);
        } else {
          if (_this2.maxLineLength) {
            parameters.push('--max-line-length', _this2.maxLineLength);
          }
          if (_this2.ignoreErrorCodes.length) {
            parameters.push('--ignore', _this2.ignoreErrorCodes.join(','));
          }
          if (_this2.maxComplexity) {
            parameters.push('--max-complexity', _this2.maxComplexity);
          }
          if (_this2.hangClosing) {
            parameters.push('--hang-closing');
          }
          if (_this2.selectErrors.length) {
            parameters.push('--select', _this2.selectErrors.join(','));
          }
        }

        parameters.push('-');

        var execPath = _fsPlus2['default'].normalize(applySubstitutions(_this2.executablePath, baseDir));
        var options = {
          stdin: fileText,
          cwd: _path2['default'].dirname(textEditor.getPath()),
          stream: 'both'
        };
        if (_this2.disableTimeout) {
          options.timeout = Infinity;
        }

        var result = yield helpers.exec(execPath, parameters, options);

        if (textEditor.getText() !== fileText) {
          // Editor contents have changed, tell Linter not to update
          return null;
        }

        if (result.stderr && result.stderr.length && atom.inDevMode()) {
          // eslint-disable-next-line no-console
          console.log('flake8 stderr: ' + result.stderr);
        }
        var messages = [];

        var match = parseRegex.exec(result.stdout);
        while (match !== null) {
          // Note that these positions are being converted to 0-indexed
          var line = Number.parseInt(match[1], 10) - 1 || 0;
          var col = Number.parseInt(match[2], 10) - 1 || undefined;

          var isErr = match[4] === 'E' && !_this2.pycodestyleErrorsToWarnings || match[4] === 'F' && _this2.flakeErrors;

          try {
            messages.push({
              type: isErr ? 'Error' : 'Warning',
              text: match[3] + ' — ' + match[5],
              filePath: filePath,
              range: helpers.rangeFromLineNumber(textEditor, line, col)
            });
          } catch (point) {
            // rangeFromLineNumber encountered an invalid point
            messages.push(generateInvalidPointTrace(execPath, match, filePath, textEditor, point));
          }

          match = parseRegex.exec(result.stdout);
        }
        // Ensure that any invalid point messages have finished resolving
        return Promise.all(messages);
      })
    };
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2RkZXdleS8uYXRvbS9wYWNrYWdlcy9saW50ZXItZmxha2U4L2xpYi9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztvQkFHb0MsTUFBTTs7c0JBQzNCLFNBQVM7Ozs7b0JBQ1AsTUFBTTs7OzswQkFDRSxhQUFhOztJQUExQixPQUFPOzs7QUFObkIsV0FBVyxDQUFDLEFBU1osSUFBTSxVQUFVLEdBQUcsd0NBQXdDLENBQUM7O0FBRTVELElBQU0sa0JBQWtCLEdBQUcsU0FBckIsa0JBQWtCLENBQUksYUFBYSxFQUFFLE9BQU8sRUFBSztBQUNyRCxNQUFJLFFBQVEsR0FBRyxhQUFhLENBQUM7QUFDN0IsTUFBTSxXQUFXLEdBQUcsa0JBQUssUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzNDLFVBQVEsR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDLGtCQUFrQixFQUFFLFdBQVcsQ0FBQyxDQUFDO0FBQzdELFVBQVEsR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDLGFBQWEsRUFBRSxPQUFPLENBQUMsQ0FBQztBQUNwRCxNQUFNLEtBQUssR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ2xDLE9BQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUU7QUFDeEMsUUFBSSxvQkFBRyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7QUFDM0IsYUFBTyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDakI7R0FDRjtBQUNELFNBQU8sUUFBUSxDQUFDO0NBQ2pCLENBQUM7O0FBRUYsSUFBTSxnQkFBZ0IscUJBQUcsV0FBTyxXQUFXLEVBQUs7QUFDOUMsTUFBSSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLGdCQUFnQixFQUFFLE9BQU8sQ0FBQyxFQUFFO0FBQzFELG9CQUFn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LENBQUMsV0FBTSxLQUFLLENBQUMsQ0FBQyxDQUFDLEFBQUU7QUFDakMsc0JBQVEsRUFBUixRQUFRO0FBQ1IsbUJBQUssRUFBRSxPQUFPLENBQUMsbUJBQW1CLENBQUMsVUFBVSxFQUFFLElBQUksRUFBRSxHQUFHLENBQUM7YUFDMUQsQ0FBQyxDQUFDO1dBQ0osQ0FBQyxPQUFPLEtBQUssRUFBRTs7QUFFZCxvQkFBUSxDQUFDLElBQUksQ0FBQyx5QkFBeUIsQ0FDckMsUUFBUSxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsVUFBVSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7V0FDbEQ7O0FBRUQsZUFBSyxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQ3hDOztBQUVELGVBQU8sT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztPQUM5QixDQUFBO0tBQ0YsQ0FBQztHQUNIO0NBQ0YiLCJmaWxlIjoiL2hvbWUvZGRld2V5Ly5hdG9tL3BhY2thZ2VzL2xpbnRlci1mbGFrZTgvbGliL21haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9leHRlbnNpb25zLCBpbXBvcnQvbm8tZXh0cmFuZW91cy1kZXBlbmRlbmNpZXNcbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUgfSBmcm9tICdhdG9tJztcbmltcG9ydCBmcyBmcm9tICdmcy1wbHVzJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0ICogYXMgaGVscGVycyBmcm9tICdhdG9tLWxpbnRlcic7XG5cbi8vIExvY2FsIHZhcmlhYmxlc1xuY29uc3QgcGFyc2VSZWdleCA9IC8oXFxkKyk6KFxcZCspOlxccygoW0EtWl0pXFxkezIsM30pXFxzKyguKikvZztcblxuY29uc3QgYXBwbHlTdWJzdGl0dXRpb25zID0gKGdpdmVuRXhlY1BhdGgsIHByb2pEaXIpID0+IHtcbiAgbGV0IGV4ZWNQYXRoID0gZ2l2ZW5FeGVjUGF0aDtcbiAgY29uc3QgcHJvamVjdE5hbWUgPSBwYXRoLmJhc2VuYW1lKHByb2pEaXIpO1xuICBleGVjUGF0aCA9IGV4ZWNQYXRoLnJlcGxhY2UoL1xcJFBST0pFQ1RfTkFNRS9pZywgcHJvamVjdE5hbWUpO1xuICBleGVjUGF0aCA9IGV4ZWNQYXRoLnJlcGxhY2UoL1xcJFBST0pFQ1QvaWcsIHByb2pEaXIpO1xuICBjb25zdCBwYXRocyA9IGV4ZWNQYXRoLnNwbGl0KCc7Jyk7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgcGF0aHMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICBpZiAoZnMuZXhpc3RzU3luYyhwYXRoc1tpXSkpIHtcbiAgICAgIHJldHVybiBwYXRoc1tpXTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGV4ZWNQYXRoO1xufTtcblxuY29uc3QgZ2V0VmVyc2lvblN0cmluZyA9IGFzeW5jICh2ZXJzaW9uUGF0aCkgPT4ge1xuICBpZiAoIU9iamVjdC5oYXNPd25Qcm9wZXJ0eS5jYWxsKGdldFZlcnNpb25TdHJpbmcsICdjYWNoZScpKSB7XG4gICAgZ2V0VmVyc2lvblN0cmluZy5jYWNoZSA9IG5ldyBNYXAoKTtcbiAgfVxuICBpZiAoIWdldFZlcnNpb25TdHJpbmcuY2FjaGUuaGFzKHZlcnNpb25QYXRoKSkge1xuICAgIGdldFZlcnNpb25TdHJpbmcuY2FjaGUuc2V0KHZlcnNpb25QYXRoLFxuICAgICAgYXdhaXQgaGVscGVycy5leGVjKHZlcnNpb25QYXRoLCBbJy0tdmVyc2lvbiddKSk7XG4gIH1cbiAgcmV0dXJuIGdldFZlcnNpb25TdHJpbmcuY2FjaGUuZ2V0KHZlcnNpb25QYXRoKTtcbn07XG5cbmNvbnN0IGdlbmVyYXRlSW52YWxpZFBvaW50VHJhY2UgPSBhc3luYyAoZXhlY1BhdGgsIG1hdGNoLCBmaWxlUGF0aCwgdGV4dEVkaXRvciwgcG9pbnQpID0+IHtcbiAgY29uc3QgZmxha2U4VmVyc2lvbiA9IGF3YWl0IGdldFZlcnNpb25TdHJpbmcoZXhlY1BhdGgpO1xuICBjb25zdCBpc3N1ZVVSTCA9ICdodHRwczovL2dpdGh1Yi5jb20vQXRvbUxpbnRlci9saW50ZXItZmxha2U4L2lzc3Vlcy9uZXcnO1xuICBjb25zdCB0aXRsZSA9IGVuY29kZVVSSUNvbXBvbmVudChgRmxha2U4IHJ1bGUgJyR7bWF0Y2hbM119JyByZXBvcnRlZCBhbiBpbnZhbGlkIHBvaW50YCk7XG4gIGNvbnN0IGJvZHkgPSBlbmNvZGVVUklDb21wb25lbnQoW1xuICAgIGBGbGFrZTggcmVwb3J0ZWQgYW4gaW52YWxpZCBwb2ludCBmb3IgdGhlIHJ1bGUgXFxgJHttYXRjaFszXX1cXGAsIGAgK1xuICAgIGB3aXRoIHRoZSBtZXNzZ2UgXFxgJHttYXRjaFs1XX1cXGAuYCxcbiAgICAnJywgJycsXG4gICAgJzwhLS0gSWYgYXQgYWxsIHBvc3NpYmxlLCBwbGVhc2UgaW5jbHVkZSBjb2RlIHRoYXQgc2hvd3MgdGhpcyBpc3N1ZSEgLS0+JyxcbiAgICAnJywgJycsXG4gICAgJ0RlYnVnIGluZm9ybWF0aW9uOicsXG4gICAgYEF0b20gdmVyc2lvbjogJHthdG9tLmdldFZlcnNpb24oKX1gLFxuICAgIGBGbGFrZTggdmVyc2lvbjogXFxgJHtmbGFrZThWZXJzaW9ufVxcYGAsXG4gIF0uam9pbignXFxuJykpO1xuICBjb25zdCBuZXdJc3N1ZVVSTCA9IGAke2lzc3VlVVJMfT90aXRsZT0ke3RpdGxlfSZib2R5PSR7Ym9keX1gO1xuICByZXR1cm4ge1xuICAgIHR5cGU6ICdFcnJvcicsXG4gICAgc2V2ZXJpdHk6ICdlcnJvcicsXG4gICAgaHRtbDogJ0VSUk9SOiBGbGFrZTggcHJvdmlkZWQgYW4gaW52YWxpZCBwb2ludCEgU2VlIHRoZSB0cmFjZSBmb3IgZGV0YWlscy4gJyArXG4gICAgICBgPGEgaHJlZj1cIiR7bmV3SXNzdWVVUkx9XCI+UmVwb3J0IHRoaXMhPC9hPmAsXG4gICAgZmlsZVBhdGgsXG4gICAgcmFuZ2U6IGhlbHBlcnMucmFuZ2VGcm9tTGluZU51bWJlcih0ZXh0RWRpdG9yLCAwKSxcbiAgICB0cmFjZTogW1xuICAgICAge1xuICAgICAgICB0eXBlOiAnVHJhY2UnLFxuICAgICAgICB0ZXh0OiBgT3JpZ2luYWwgbWVzc2FnZTogJHttYXRjaFszXX0g4oCUICR7bWF0Y2hbNV19YCxcbiAgICAgICAgZmlsZVBhdGgsXG4gICAgICAgIHNldmVyaXR5OiAnaW5mbycsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0eXBlOiAnVHJhY2UnLFxuICAgICAgICB0ZXh0OiBgUmVxdWVzdGVkIHBvaW50OiAke3BvaW50LmxpbmUgKyAxfToke3BvaW50LmNvbCArIDF9YCxcbiAgICAgICAgZmlsZVBhdGgsXG4gICAgICAgIHNldmVyaXR5OiAnaW5mbycsXG4gICAgICB9LFxuICAgIF0sXG4gIH07XG59O1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGFjdGl2YXRlKCkge1xuICAgIHJlcXVpcmUoJ2F0b20tcGFja2FnZS1kZXBzJykuaW5zdGFsbCgnbGludGVyLWZsYWtlOCcpO1xuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKTtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLWZsYWtlOC5kaXNhYmxlVGltZW91dCcsICh2YWx1ZSkgPT4ge1xuICAgICAgICB0aGlzLmRpc2FibGVUaW1lb3V0ID0gdmFsdWU7XG4gICAgICB9KSxcbiAgICApO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICBhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXItZmxha2U4LnByb2plY3RDb25maWdGaWxlJywgKHZhbHVlKSA9PiB7XG4gICAgICAgIHRoaXMucHJvamVjdENvbmZpZ0ZpbGUgPSB2YWx1ZTtcbiAgICAgIH0pLFxuICAgICk7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci1mbGFrZTgubWF4TGluZUxlbmd0aCcsICh2YWx1ZSkgPT4ge1xuICAgICAgICB0aGlzLm1heExpbmVMZW5ndGggPSB2YWx1ZTtcbiAgICAgIH0pLFxuICAgICk7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci1mbGFrZTguaWdub3JlRXJyb3JDb2RlcycsICh2YWx1ZSkgPT4ge1xuICAgICAgICB0aGlzLmlnbm9yZUVycm9yQ29kZXMgPSB2YWx1ZTtcbiAgICAgIH0pLFxuICAgICk7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci1mbGFrZTgubWF4Q29tcGxleGl0eScsICh2YWx1ZSkgPT4ge1xuICAgICAgICB0aGlzLm1heENvbXBsZXhpdHkgPSB2YWx1ZTtcbiAgICAgIH0pLFxuICAgICk7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci1mbGFrZTguc2VsZWN0RXJyb3JzJywgKHZhbHVlKSA9PiB7XG4gICAgICAgIHRoaXMuc2VsZWN0RXJyb3JzID0gdmFsdWU7XG4gICAgICB9KSxcbiAgICApO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICBhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXItZmxha2U4LmhhbmdDbG9zaW5nJywgKHZhbHVlKSA9PiB7XG4gICAgICAgIHRoaXMuaGFuZ0Nsb3NpbmcgPSB2YWx1ZTtcbiAgICAgIH0pLFxuICAgICk7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci1mbGFrZTguZXhlY3V0YWJsZVBhdGgnLCAodmFsdWUpID0+IHtcbiAgICAgICAgdGhpcy5leGVjdXRhYmxlUGF0aCA9IHZhbHVlO1xuICAgICAgfSksXG4gICAgKTtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLWZsYWtlOC5weWNvZGVzdHlsZUVycm9yc1RvV2FybmluZ3MnLCAodmFsdWUpID0+IHtcbiAgICAgICAgdGhpcy5weWNvZGVzdHlsZUVycm9yc1RvV2FybmluZ3MgPSB2YWx1ZTtcbiAgICAgIH0pLFxuICAgICk7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci1mbGFrZTguZmxha2VFcnJvcnMnLCAodmFsdWUpID0+IHtcbiAgICAgICAgdGhpcy5mbGFrZUVycm9ycyA9IHZhbHVlO1xuICAgICAgfSksXG4gICAgKTtcbiAgfSxcblxuICBkZWFjdGl2YXRlKCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKCk7XG4gIH0sXG5cbiAgcHJvdmlkZUxpbnRlcigpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZTogJ0ZsYWtlOCcsXG4gICAgICBncmFtbWFyU2NvcGVzOiBbJ3NvdXJjZS5weXRob24nLCAnc291cmNlLnB5dGhvbi5kamFuZ28nXSxcbiAgICAgIHNjb3BlOiAnZmlsZScsXG4gICAgICBsaW50T25GbHk6IHRydWUsXG4gICAgICBsaW50OiBhc3luYyAodGV4dEVkaXRvcikgPT4ge1xuICAgICAgICBjb25zdCBmaWxlUGF0aCA9IHRleHRFZGl0b3IuZ2V0UGF0aCgpO1xuICAgICAgICBjb25zdCBmaWxlVGV4dCA9IHRleHRFZGl0b3IuZ2V0VGV4dCgpO1xuXG4gICAgICAgIGNvbnN0IHBhcmFtZXRlcnMgPSBbJy0tZm9ybWF0PWRlZmF1bHQnXTtcblxuICAgICAgICBjb25zdCBwcm9qZWN0UGF0aCA9IGF0b20ucHJvamVjdC5yZWxhdGl2aXplUGF0aChmaWxlUGF0aClbMF07XG4gICAgICAgIGNvbnN0IGJhc2VEaXIgPSBwcm9qZWN0UGF0aCAhPT0gbnVsbCA/IHByb2plY3RQYXRoIDogcGF0aC5kaXJuYW1lKGZpbGVQYXRoKTtcbiAgICAgICAgY29uc3QgY29uZmlnRmlsZVBhdGggPSBhd2FpdCBoZWxwZXJzLmZpbmRDYWNoZWRBc3luYyhiYXNlRGlyLCB0aGlzLnByb2plY3RDb25maWdGaWxlKTtcblxuICAgICAgICBpZiAodGhpcy5wcm9qZWN0Q29uZmlnRmlsZSAmJiBiYXNlRGlyICE9PSBudWxsICYmIGNvbmZpZ0ZpbGVQYXRoICE9PSBudWxsKSB7XG4gICAgICAgICAgcGFyYW1ldGVycy5wdXNoKCctLWNvbmZpZycsIGNvbmZpZ0ZpbGVQYXRoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAodGhpcy5tYXhMaW5lTGVuZ3RoKSB7XG4gICAgICAgICAgICBwYXJhbWV0ZXJzLnB1c2goJy0tbWF4LWxpbmUtbGVuZ3RoJywgdGhpcy5tYXhMaW5lTGVuZ3RoKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHRoaXMuaWdub3JlRXJyb3JDb2Rlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHBhcmFtZXRlcnMucHVzaCgnLS1pZ25vcmUnLCB0aGlzLmlnbm9yZUVycm9yQ29kZXMuam9pbignLCcpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHRoaXMubWF4Q29tcGxleGl0eSkge1xuICAgICAgICAgICAgcGFyYW1ldGVycy5wdXNoKCctLW1heC1jb21wbGV4aXR5JywgdGhpcy5tYXhDb21wbGV4aXR5KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHRoaXMuaGFuZ0Nsb3NpbmcpIHtcbiAgICAgICAgICAgIHBhcmFtZXRlcnMucHVzaCgnLS1oYW5nLWNsb3NpbmcnKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHRoaXMuc2VsZWN0RXJyb3JzLmxlbmd0aCkge1xuICAgICAgICAgICAgcGFyYW1ldGVycy5wdXNoKCctLXNlbGVjdCcsIHRoaXMuc2VsZWN0RXJyb3JzLmpvaW4oJywnKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcGFyYW1ldGVycy5wdXNoKCctJyk7XG5cbiAgICAgICAgY29uc3QgZXhlY1BhdGggPSBmcy5ub3JtYWxpemUoYXBwbHlTdWJzdGl0dXRpb25zKHRoaXMuZXhlY3V0YWJsZVBhdGgsIGJhc2VEaXIpKTtcbiAgICAgICAgY29uc3Qgb3B0aW9ucyA9IHtcbiAgICAgICAgICBzdGRpbjogZmlsZVRleHQsXG4gICAgICAgICAgY3dkOiBwYXRoLmRpcm5hbWUodGV4dEVkaXRvci5nZXRQYXRoKCkpLFxuICAgICAgICAgIHN0cmVhbTogJ2JvdGgnLFxuICAgICAgICB9O1xuICAgICAgICBpZiAodGhpcy5kaXNhYmxlVGltZW91dCkge1xuICAgICAgICAgIG9wdGlvbnMudGltZW91dCA9IEluZmluaXR5O1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgaGVscGVycy5leGVjKGV4ZWNQYXRoLCBwYXJhbWV0ZXJzLCBvcHRpb25zKTtcblxuICAgICAgICBpZiAodGV4dEVkaXRvci5nZXRUZXh0KCkgIT09IGZpbGVUZXh0KSB7XG4gICAgICAgICAgLy8gRWRpdG9yIGNvbnRlbnRzIGhhdmUgY2hhbmdlZCwgdGVsbCBMaW50ZXIgbm90IHRvIHVwZGF0ZVxuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHJlc3VsdC5zdGRlcnIgJiYgcmVzdWx0LnN0ZGVyci5sZW5ndGggJiYgYXRvbS5pbkRldk1vZGUoKSkge1xuICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXG4gICAgICAgICAgY29uc29sZS5sb2coYGZsYWtlOCBzdGRlcnI6ICR7cmVzdWx0LnN0ZGVycn1gKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBtZXNzYWdlcyA9IFtdO1xuXG4gICAgICAgIGxldCBtYXRjaCA9IHBhcnNlUmVnZXguZXhlYyhyZXN1bHQuc3Rkb3V0KTtcbiAgICAgICAgd2hpbGUgKG1hdGNoICE9PSBudWxsKSB7XG4gICAgICAgICAgLy8gTm90ZSB0aGF0IHRoZXNlIHBvc2l0aW9ucyBhcmUgYmVpbmcgY29udmVydGVkIHRvIDAtaW5kZXhlZFxuICAgICAgICAgIGNvbnN0IGxpbmUgPSBOdW1iZXIucGFyc2VJbnQobWF0Y2hbMV0sIDEwKSAtIDEgfHwgMDtcbiAgICAgICAgICBjb25zdCBjb2wgPSBOdW1iZXIucGFyc2VJbnQobWF0Y2hbMl0sIDEwKSAtIDEgfHwgdW5kZWZpbmVkO1xuXG4gICAgICAgICAgY29uc3QgaXNFcnIgPSAobWF0Y2hbNF0gPT09ICdFJyAmJiAhdGhpcy5weWNvZGVzdHlsZUVycm9yc1RvV2FybmluZ3MpXG4gICAgICAgICAgICB8fCAobWF0Y2hbNF0gPT09ICdGJyAmJiB0aGlzLmZsYWtlRXJyb3JzKTtcblxuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBtZXNzYWdlcy5wdXNoKHtcbiAgICAgICAgICAgICAgdHlwZTogaXNFcnIgPyAnRXJyb3InIDogJ1dhcm5pbmcnLFxuICAgICAgICAgICAgICB0ZXh0OiBgJHttYXRjaFszXX0g4oCUICR7bWF0Y2hbNV19YCxcbiAgICAgICAgICAgICAgZmlsZVBhdGgsXG4gICAgICAgICAgICAgIHJhbmdlOiBoZWxwZXJzLnJhbmdlRnJvbUxpbmVOdW1iZXIodGV4dEVkaXRvciwgbGluZSwgY29sKSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0gY2F0Y2ggKHBvaW50KSB7XG4gICAgICAgICAgICAvLyByYW5nZUZyb21MaW5lTnVtYmVyIGVuY291bnRlcmVkIGFuIGludmFsaWQgcG9pbnRcbiAgICAgICAgICAgIG1lc3NhZ2VzLnB1c2goZ2VuZXJhdGVJbnZhbGlkUG9pbnRUcmFjZShcbiAgICAgICAgICAgICAgZXhlY1BhdGgsIG1hdGNoLCBmaWxlUGF0aCwgdGV4dEVkaXRvciwgcG9pbnQpKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBtYXRjaCA9IHBhcnNlUmVnZXguZXhlYyhyZXN1bHQuc3Rkb3V0KTtcbiAgICAgICAgfVxuICAgICAgICAvLyBFbnN1cmUgdGhhdCBhbnkgaW52YWxpZCBwb2ludCBtZXNzYWdlcyBoYXZlIGZpbmlzaGVkIHJlc29sdmluZ1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwobWVzc2FnZXMpO1xuICAgICAgfSxcbiAgICB9O1xuICB9LFxufTtcbiJdfQ==