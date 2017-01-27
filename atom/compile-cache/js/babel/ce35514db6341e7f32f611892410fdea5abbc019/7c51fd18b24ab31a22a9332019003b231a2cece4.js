Object.defineProperty(exports, '__esModule', {
  value: true
});

/* eslint-disable import/no-extraneous-dependencies, import/extensions */

var _atom = require('atom');

/* eslint-enable import/no-extraneous-dependencies, import/extensions */

// Some internal variables
'use babel';var baseUrl = 'https://github.com/koalaman/shellcheck/wiki';
var errorCodeRegex = /SC\d{4}/;
var regex = /.+?:(\d+):(\d+):\s(\w+?):\s(.+)/g;

var linkifyErrorCode = function linkifyErrorCode(text) {
  return text.replace(errorCodeRegex, '<a href="' + baseUrl + '/$&">$&</a>');
};

exports['default'] = {
  activate: function activate() {
    var _this = this;

    require('atom-package-deps').install('linter-shellcheck');

    this.subscriptions = new _atom.CompositeDisposable();
    this.subscriptions.add(atom.config.observe('linter-shellcheck.shellcheckExecutablePath', function (value) {
      _this.executablePath = value;
    }));
    this.subscriptions.add(atom.config.observe('linter-shellcheck.enableNotice', function (value) {
      _this.enableNotice = value;
    }));
    this.subscriptions.add(atom.config.observe('linter-shellcheck.userParameters', function (value) {
      _this.userParameters = value.trim().split(' ').filter(Boolean);
    }));
  },

  deactivate: function deactivate() {
    this.subscriptions.dispose();
  },

  provideLinter: function provideLinter() {
    var _this2 = this;

    var helpers = require('atom-linter');
    var path = require('path');

    return {
      name: 'ShellCheck',
      grammarScopes: ['source.shell'],
      scope: 'file',
      lintOnFly: true,
      lint: function lint(textEditor) {
        var filePath = textEditor.getPath();
        var text = textEditor.getText();
        var cwd = path.dirname(filePath);
        var showAll = _this2.enableNotice;
        // The first -f parameter overrides any others
        var parameters = [].concat(['-f', 'gcc'], _this2.userParameters, ['-']);
        var options = { stdin: text, cwd: cwd, ignoreExitCode: true };
        return helpers.exec(_this2.executablePath, parameters, options).then(function (output) {
          if (textEditor.getText() !== text) {
            // The text has changed since the lint was triggered, tell Linter not to update
            return null;
          }
          var messages = [];
          var match = regex.exec(output);
          while (match !== null) {
            var type = match[3];
            if (showAll || type === 'warning' || type === 'error') {
              var line = Number.parseInt(match[1], 10) - 1;
              var col = Number.parseInt(match[2], 10) - 1;
              messages.push({
                type: type,
                filePath: filePath,
                range: helpers.rangeFromLineNumber(textEditor, line, col),
                html: linkifyErrorCode(match[4])
              });
            }
            match = regex.exec(output);
          }
          return messages;
        });
      }
    };
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2RkZXdleS8uYXRvbS9wYWNrYWdlcy9saW50ZXItc2hlbGxjaGVjay9saWIvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7b0JBR29DLE1BQU07Ozs7O0FBSDFDLFdBQVcsQ0FBQyxBQU9aLElBQU0sT0FBTyxHQUFHLDZDQUE2QyxDQUFDO0FBQzlELElBQU0sY0FBYyxHQUFHLFNBQVMsQ0FBQztBQUNqQyxJQUFNLEtBQUssR0FBRyxrQ0FBa0MsQ0FBQzs7QUFFakQsSUFBTSxnQkFBZ0IsR0FBRyxTQUFuQixnQkFBZ0IsQ0FBRyxJQUFJO1NBQzNCLElBQUksQ0FBQyxPQUFPLENBQUMsY0FBYyxnQkFBYyxPQUFPLGlCQUFjO0NBQUEsQ0FBQzs7cUJBRWxEO0FBQ2IsVUFBUSxFQUFBLG9CQUFHOzs7QUFDVCxXQUFPLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxPQUFPLENBQUMsbUJBQW1CLENBQUMsQ0FBQzs7QUFFMUQsUUFBSSxDQUFDLGFBQWEsR0FBRywrQkFBeUIsQ0FBQztBQUMvQyxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FDcEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsNENBQTRDLEVBQUUsVUFBQyxLQUFLLEVBQUs7QUFDM0UsWUFBSyxjQUFjLEdBQUcsS0FBSyxDQUFDO0tBQzdCLENBQUMsQ0FDSCxDQUFDO0FBQ0YsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQ3BCLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLGdDQUFnQyxFQUFFLFVBQUMsS0FBSyxFQUFLO0FBQy9ELFlBQUssWUFBWSxHQUFHLEtBQUssQ0FBQztLQUMzQixDQUFDLENBQ0gsQ0FBQztBQUNGLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUNwQixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxrQ0FBa0MsRUFBRSxVQUFDLEtBQUssRUFBSztBQUNqRSxZQUFLLGNBQWMsR0FBRyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztLQUMvRCxDQUFDLENBQ0gsQ0FBQztHQUNIOztBQUVELFlBQVUsRUFBQSxzQkFBRztBQUNYLFFBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLENBQUM7R0FDOUI7O0FBRUQsZUFBYSxFQUFBLHlCQUFHOzs7QUFDZCxRQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDdkMsUUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDOztBQUU3QixXQUFPO0FBQ0wsVUFBSSxFQUFFLFlBQVk7QUFDbEIsbUJBQWEsRUFBRSxDQUFDLGNBQWMsQ0FBQztBQUMvQixXQUFLLEVBQUUsTUFBTTtBQUNiLGVBQVMsRUFBRSxJQUFJO0FBQ2YsVUFBSSxFQUFFLGNBQUMsVUFBVSxFQUFLO0FBQ3BCLFlBQU0sUUFBUSxHQUFHLFVBQVUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUN0QyxZQUFNLElBQUksR0FBRyxVQUFVLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDbEMsWUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUNuQyxZQUFNLE9BQU8sR0FBRyxPQUFLLFlBQVksQ0FBQzs7QUFFbEMsWUFBTSxVQUFVLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsRUFBRSxPQUFLLGNBQWMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDeEUsWUFBTSxPQUFPLEdBQUcsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBSCxHQUFHLEVBQUUsY0FBYyxFQUFFLElBQUksRUFBRSxDQUFDO0FBQzNELGVBQU8sT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFLLGNBQWMsRUFBRSxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUMsTUFBTSxFQUFLO0FBQzdFLGNBQUksVUFBVSxDQUFDLE9BQU8sRUFBRSxLQUFLLElBQUksRUFBRTs7QUFFakMsbUJBQU8sSUFBSSxDQUFDO1dBQ2I7QUFDRCxjQUFNLFFBQVEsR0FBRyxFQUFFLENBQUM7QUFDcEIsY0FBSSxLQUFLLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUMvQixpQkFBTyxLQUFLLEtBQUssSUFBSSxFQUFFO0FBQ3JCLGdCQUFNLElBQUksR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDdEIsZ0JBQUksT0FBTyxJQUFJLElBQUksS0FBSyxTQUFTLElBQUksSUFBSSxLQUFLLE9BQU8sRUFBRTtBQUNyRCxrQkFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQy9DLGtCQUFNLEdBQUcsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDOUMsc0JBQVEsQ0FBQyxJQUFJLENBQUM7QUFDWixvQkFBSSxFQUFKLElBQUk7QUFDSix3QkFBUSxFQUFSLFFBQVE7QUFDUixxQkFBSyxFQUFFLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxVQUFVLEVBQUUsSUFBSSxFQUFFLEdBQUcsQ0FBQztBQUN6RCxvQkFBSSxFQUFFLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztlQUNqQyxDQUFDLENBQUM7YUFDSjtBQUNELGlCQUFLLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztXQUM1QjtBQUNELGlCQUFPLFFBQVEsQ0FBQztTQUNqQixDQUFDLENBQUM7T0FDSjtLQUNGLENBQUM7R0FDSDtDQUNGIiwiZmlsZSI6Ii9ob21lL2RkZXdleS8uYXRvbS9wYWNrYWdlcy9saW50ZXItc2hlbGxjaGVjay9saWIvbWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG4vKiBlc2xpbnQtZGlzYWJsZSBpbXBvcnQvbm8tZXh0cmFuZW91cy1kZXBlbmRlbmNpZXMsIGltcG9ydC9leHRlbnNpb25zICovXG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlIH0gZnJvbSAnYXRvbSc7XG4vKiBlc2xpbnQtZW5hYmxlIGltcG9ydC9uby1leHRyYW5lb3VzLWRlcGVuZGVuY2llcywgaW1wb3J0L2V4dGVuc2lvbnMgKi9cblxuLy8gU29tZSBpbnRlcm5hbCB2YXJpYWJsZXNcbmNvbnN0IGJhc2VVcmwgPSAnaHR0cHM6Ly9naXRodWIuY29tL2tvYWxhbWFuL3NoZWxsY2hlY2svd2lraSc7XG5jb25zdCBlcnJvckNvZGVSZWdleCA9IC9TQ1xcZHs0fS87XG5jb25zdCByZWdleCA9IC8uKz86KFxcZCspOihcXGQrKTpcXHMoXFx3Kz8pOlxccyguKykvZztcblxuY29uc3QgbGlua2lmeUVycm9yQ29kZSA9IHRleHQgPT5cbiAgdGV4dC5yZXBsYWNlKGVycm9yQ29kZVJlZ2V4LCBgPGEgaHJlZj1cIiR7YmFzZVVybH0vJCZcIj4kJjwvYT5gKTtcblxuZXhwb3J0IGRlZmF1bHQge1xuICBhY3RpdmF0ZSgpIHtcbiAgICByZXF1aXJlKCdhdG9tLXBhY2thZ2UtZGVwcycpLmluc3RhbGwoJ2xpbnRlci1zaGVsbGNoZWNrJyk7XG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICBhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXItc2hlbGxjaGVjay5zaGVsbGNoZWNrRXhlY3V0YWJsZVBhdGgnLCAodmFsdWUpID0+IHtcbiAgICAgICAgdGhpcy5leGVjdXRhYmxlUGF0aCA9IHZhbHVlO1xuICAgICAgfSksXG4gICAgKTtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLXNoZWxsY2hlY2suZW5hYmxlTm90aWNlJywgKHZhbHVlKSA9PiB7XG4gICAgICAgIHRoaXMuZW5hYmxlTm90aWNlID0gdmFsdWU7XG4gICAgICB9KSxcbiAgICApO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICBhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXItc2hlbGxjaGVjay51c2VyUGFyYW1ldGVycycsICh2YWx1ZSkgPT4ge1xuICAgICAgICB0aGlzLnVzZXJQYXJhbWV0ZXJzID0gdmFsdWUudHJpbSgpLnNwbGl0KCcgJykuZmlsdGVyKEJvb2xlYW4pO1xuICAgICAgfSksXG4gICAgKTtcbiAgfSxcblxuICBkZWFjdGl2YXRlKCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKCk7XG4gIH0sXG5cbiAgcHJvdmlkZUxpbnRlcigpIHtcbiAgICBjb25zdCBoZWxwZXJzID0gcmVxdWlyZSgnYXRvbS1saW50ZXInKTtcbiAgICBjb25zdCBwYXRoID0gcmVxdWlyZSgncGF0aCcpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWU6ICdTaGVsbENoZWNrJyxcbiAgICAgIGdyYW1tYXJTY29wZXM6IFsnc291cmNlLnNoZWxsJ10sXG4gICAgICBzY29wZTogJ2ZpbGUnLFxuICAgICAgbGludE9uRmx5OiB0cnVlLFxuICAgICAgbGludDogKHRleHRFZGl0b3IpID0+IHtcbiAgICAgICAgY29uc3QgZmlsZVBhdGggPSB0ZXh0RWRpdG9yLmdldFBhdGgoKTtcbiAgICAgICAgY29uc3QgdGV4dCA9IHRleHRFZGl0b3IuZ2V0VGV4dCgpO1xuICAgICAgICBjb25zdCBjd2QgPSBwYXRoLmRpcm5hbWUoZmlsZVBhdGgpO1xuICAgICAgICBjb25zdCBzaG93QWxsID0gdGhpcy5lbmFibGVOb3RpY2U7XG4gICAgICAgIC8vIFRoZSBmaXJzdCAtZiBwYXJhbWV0ZXIgb3ZlcnJpZGVzIGFueSBvdGhlcnNcbiAgICAgICAgY29uc3QgcGFyYW1ldGVycyA9IFtdLmNvbmNhdChbJy1mJywgJ2djYyddLCB0aGlzLnVzZXJQYXJhbWV0ZXJzLCBbJy0nXSk7XG4gICAgICAgIGNvbnN0IG9wdGlvbnMgPSB7IHN0ZGluOiB0ZXh0LCBjd2QsIGlnbm9yZUV4aXRDb2RlOiB0cnVlIH07XG4gICAgICAgIHJldHVybiBoZWxwZXJzLmV4ZWModGhpcy5leGVjdXRhYmxlUGF0aCwgcGFyYW1ldGVycywgb3B0aW9ucykudGhlbigob3V0cHV0KSA9PiB7XG4gICAgICAgICAgaWYgKHRleHRFZGl0b3IuZ2V0VGV4dCgpICE9PSB0ZXh0KSB7XG4gICAgICAgICAgICAvLyBUaGUgdGV4dCBoYXMgY2hhbmdlZCBzaW5jZSB0aGUgbGludCB3YXMgdHJpZ2dlcmVkLCB0ZWxsIExpbnRlciBub3QgdG8gdXBkYXRlXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICB9XG4gICAgICAgICAgY29uc3QgbWVzc2FnZXMgPSBbXTtcbiAgICAgICAgICBsZXQgbWF0Y2ggPSByZWdleC5leGVjKG91dHB1dCk7XG4gICAgICAgICAgd2hpbGUgKG1hdGNoICE9PSBudWxsKSB7XG4gICAgICAgICAgICBjb25zdCB0eXBlID0gbWF0Y2hbM107XG4gICAgICAgICAgICBpZiAoc2hvd0FsbCB8fCB0eXBlID09PSAnd2FybmluZycgfHwgdHlwZSA9PT0gJ2Vycm9yJykge1xuICAgICAgICAgICAgICBjb25zdCBsaW5lID0gTnVtYmVyLnBhcnNlSW50KG1hdGNoWzFdLCAxMCkgLSAxO1xuICAgICAgICAgICAgICBjb25zdCBjb2wgPSBOdW1iZXIucGFyc2VJbnQobWF0Y2hbMl0sIDEwKSAtIDE7XG4gICAgICAgICAgICAgIG1lc3NhZ2VzLnB1c2goe1xuICAgICAgICAgICAgICAgIHR5cGUsXG4gICAgICAgICAgICAgICAgZmlsZVBhdGgsXG4gICAgICAgICAgICAgICAgcmFuZ2U6IGhlbHBlcnMucmFuZ2VGcm9tTGluZU51bWJlcih0ZXh0RWRpdG9yLCBsaW5lLCBjb2wpLFxuICAgICAgICAgICAgICAgIGh0bWw6IGxpbmtpZnlFcnJvckNvZGUobWF0Y2hbNF0pLFxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG1hdGNoID0gcmVnZXguZXhlYyhvdXRwdXQpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gbWVzc2FnZXM7XG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICB9O1xuICB9LFxufTtcbiJdfQ==