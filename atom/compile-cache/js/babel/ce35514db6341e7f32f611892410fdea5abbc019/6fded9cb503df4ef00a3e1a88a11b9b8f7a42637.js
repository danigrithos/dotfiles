function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _path = require('path');

var path = _interopRequireWildcard(_path);

'use babel';

var cleanPath = path.join(__dirname, 'fixtures', 'clean.sh');
var badPath = path.join(__dirname, 'fixtures', 'bad.sh');

describe('The ShellCheck provider for Linter', function () {
  var lint = require('../lib/main.js').provideLinter().lint;

  beforeEach(function () {
    atom.workspace.destroyActivePaneItem();

    // Info about this beforeEach() implementation:
    // https://github.com/AtomLinter/Meta/issues/15
    var activationPromise = atom.packages.activatePackage('linter-shellcheck');

    waitsForPromise(function () {
      return atom.packages.activatePackage('language-shellscript').then(function () {
        return atom.workspace.open(cleanPath);
      });
    });

    atom.packages.triggerDeferredActivationHooks();
    waitsForPromise(function () {
      return activationPromise;
    });
  });

  it('finds nothing wrong with a valid file', function () {
    waitsForPromise(function () {
      return atom.workspace.open(cleanPath).then(function (editor) {
        return lint(editor);
      }).then(function (messages) {
        expect(messages.length).toBe(0);
      });
    });
  });

  it('handles messages from ShellCheck', function () {
    var expectedMsg = 'Tips depend on target shell and yours is unknown. Add a shebang. ' + '[<a href="https://github.com/koalaman/shellcheck/wiki/SC2148">SC2148</a>]';
    waitsForPromise(function () {
      return atom.workspace.open(badPath).then(function (editor) {
        return lint(editor);
      }).then(function (messages) {
        expect(messages.length).toBe(1);
        expect(messages[0].type).toBe('error');
        expect(messages[0].text).not.toBeDefined();
        expect(messages[0].html).toBe(expectedMsg);
        expect(messages[0].filePath).toBe(badPath);
        expect(messages[0].range).toEqual([[0, 0], [0, 4]]);
      });
    });
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2RkZXdleS8uYXRvbS9wYWNrYWdlcy9saW50ZXItc2hlbGxjaGVjay9zcGVjL2xpbnRlci1zaGVsbGNoZWNrLXNwZWMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7b0JBRXNCLE1BQU07O0lBQWhCLElBQUk7O0FBRmhCLFdBQVcsQ0FBQzs7QUFJWixJQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFDL0QsSUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsVUFBVSxFQUFFLFFBQVEsQ0FBQyxDQUFDOztBQUUzRCxRQUFRLENBQUMsb0NBQW9DLEVBQUUsWUFBTTtBQUNuRCxNQUFNLElBQUksR0FBRyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxJQUFJLENBQUM7O0FBRTVELFlBQVUsQ0FBQyxZQUFNO0FBQ2YsUUFBSSxDQUFDLFNBQVMsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDOzs7O0FBSXZDLFFBQU0saUJBQWlCLEdBQ3JCLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLG1CQUFtQixDQUFDLENBQUM7O0FBRXJELG1CQUFlLENBQUM7YUFDZCxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLElBQUksQ0FBQztlQUN6RCxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUM7T0FBQSxDQUFDO0tBQUEsQ0FDbEMsQ0FBQzs7QUFFRixRQUFJLENBQUMsUUFBUSxDQUFDLDhCQUE4QixFQUFFLENBQUM7QUFDL0MsbUJBQWUsQ0FBQzthQUFNLGlCQUFpQjtLQUFBLENBQUMsQ0FBQztHQUMxQyxDQUFDLENBQUM7O0FBRUgsSUFBRSxDQUFDLHVDQUF1QyxFQUFFLFlBQU07QUFDaEQsbUJBQWUsQ0FBQzthQUNkLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFBLE1BQU07ZUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDO09BQUEsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFDLFFBQVEsRUFBSztBQUM3RSxjQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztPQUNqQyxDQUFDO0tBQUEsQ0FDSCxDQUFDO0dBQ0gsQ0FBQyxDQUFDOztBQUVILElBQUUsQ0FBQyxrQ0FBa0MsRUFBRSxZQUFNO0FBQzNDLFFBQU0sV0FBVyxHQUFHLG1FQUFtRSxHQUNyRiwyRUFBMkUsQ0FBQztBQUM5RSxtQkFBZSxDQUFDO2FBQ2QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUEsTUFBTTtlQUFJLElBQUksQ0FBQyxNQUFNLENBQUM7T0FBQSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUMsUUFBUSxFQUFLO0FBQzNFLGNBQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2hDLGNBQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ3ZDLGNBQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxDQUFDO0FBQzNDLGNBQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQzNDLGNBQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzNDLGNBQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO09BQ3JELENBQUM7S0FBQSxDQUNILENBQUM7R0FDSCxDQUFDLENBQUM7Q0FDSixDQUFDLENBQUMiLCJmaWxlIjoiL2hvbWUvZGRld2V5Ly5hdG9tL3BhY2thZ2VzL2xpbnRlci1zaGVsbGNoZWNrL3NwZWMvbGludGVyLXNoZWxsY2hlY2stc3BlYy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuXG5jb25zdCBjbGVhblBhdGggPSBwYXRoLmpvaW4oX19kaXJuYW1lLCAnZml4dHVyZXMnLCAnY2xlYW4uc2gnKTtcbmNvbnN0IGJhZFBhdGggPSBwYXRoLmpvaW4oX19kaXJuYW1lLCAnZml4dHVyZXMnLCAnYmFkLnNoJyk7XG5cbmRlc2NyaWJlKCdUaGUgU2hlbGxDaGVjayBwcm92aWRlciBmb3IgTGludGVyJywgKCkgPT4ge1xuICBjb25zdCBsaW50ID0gcmVxdWlyZSgnLi4vbGliL21haW4uanMnKS5wcm92aWRlTGludGVyKCkubGludDtcblxuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICBhdG9tLndvcmtzcGFjZS5kZXN0cm95QWN0aXZlUGFuZUl0ZW0oKTtcblxuICAgIC8vIEluZm8gYWJvdXQgdGhpcyBiZWZvcmVFYWNoKCkgaW1wbGVtZW50YXRpb246XG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL0F0b21MaW50ZXIvTWV0YS9pc3N1ZXMvMTVcbiAgICBjb25zdCBhY3RpdmF0aW9uUHJvbWlzZSA9XG4gICAgICBhdG9tLnBhY2thZ2VzLmFjdGl2YXRlUGFja2FnZSgnbGludGVyLXNoZWxsY2hlY2snKTtcblxuICAgIHdhaXRzRm9yUHJvbWlzZSgoKSA9PlxuICAgICAgYXRvbS5wYWNrYWdlcy5hY3RpdmF0ZVBhY2thZ2UoJ2xhbmd1YWdlLXNoZWxsc2NyaXB0JykudGhlbigoKSA9PlxuICAgICAgICBhdG9tLndvcmtzcGFjZS5vcGVuKGNsZWFuUGF0aCkpLFxuICAgICk7XG5cbiAgICBhdG9tLnBhY2thZ2VzLnRyaWdnZXJEZWZlcnJlZEFjdGl2YXRpb25Ib29rcygpO1xuICAgIHdhaXRzRm9yUHJvbWlzZSgoKSA9PiBhY3RpdmF0aW9uUHJvbWlzZSk7XG4gIH0pO1xuXG4gIGl0KCdmaW5kcyBub3RoaW5nIHdyb25nIHdpdGggYSB2YWxpZCBmaWxlJywgKCkgPT4ge1xuICAgIHdhaXRzRm9yUHJvbWlzZSgoKSA9PlxuICAgICAgYXRvbS53b3Jrc3BhY2Uub3BlbihjbGVhblBhdGgpLnRoZW4oZWRpdG9yID0+IGxpbnQoZWRpdG9yKSkudGhlbigobWVzc2FnZXMpID0+IHtcbiAgICAgICAgZXhwZWN0KG1lc3NhZ2VzLmxlbmd0aCkudG9CZSgwKTtcbiAgICAgIH0pLFxuICAgICk7XG4gIH0pO1xuXG4gIGl0KCdoYW5kbGVzIG1lc3NhZ2VzIGZyb20gU2hlbGxDaGVjaycsICgpID0+IHtcbiAgICBjb25zdCBleHBlY3RlZE1zZyA9ICdUaXBzIGRlcGVuZCBvbiB0YXJnZXQgc2hlbGwgYW5kIHlvdXJzIGlzIHVua25vd24uIEFkZCBhIHNoZWJhbmcuICcgK1xuICAgICAgJ1s8YSBocmVmPVwiaHR0cHM6Ly9naXRodWIuY29tL2tvYWxhbWFuL3NoZWxsY2hlY2svd2lraS9TQzIxNDhcIj5TQzIxNDg8L2E+XSc7XG4gICAgd2FpdHNGb3JQcm9taXNlKCgpID0+XG4gICAgICBhdG9tLndvcmtzcGFjZS5vcGVuKGJhZFBhdGgpLnRoZW4oZWRpdG9yID0+IGxpbnQoZWRpdG9yKSkudGhlbigobWVzc2FnZXMpID0+IHtcbiAgICAgICAgZXhwZWN0KG1lc3NhZ2VzLmxlbmd0aCkudG9CZSgxKTtcbiAgICAgICAgZXhwZWN0KG1lc3NhZ2VzWzBdLnR5cGUpLnRvQmUoJ2Vycm9yJyk7XG4gICAgICAgIGV4cGVjdChtZXNzYWdlc1swXS50ZXh0KS5ub3QudG9CZURlZmluZWQoKTtcbiAgICAgICAgZXhwZWN0KG1lc3NhZ2VzWzBdLmh0bWwpLnRvQmUoZXhwZWN0ZWRNc2cpO1xuICAgICAgICBleHBlY3QobWVzc2FnZXNbMF0uZmlsZVBhdGgpLnRvQmUoYmFkUGF0aCk7XG4gICAgICAgIGV4cGVjdChtZXNzYWdlc1swXS5yYW5nZSkudG9FcXVhbChbWzAsIDBdLCBbMCwgNF1dKTtcbiAgICAgIH0pLFxuICAgICk7XG4gIH0pO1xufSk7XG4iXX0=