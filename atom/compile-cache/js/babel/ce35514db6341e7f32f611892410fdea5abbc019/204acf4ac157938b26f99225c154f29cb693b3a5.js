function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _path = require('path');

var path = _interopRequireWildcard(_path);

'use babel';

var lint = require('../lib/index.js').provideLinter().lint;

describe('The htmlhint provider for Linter', function () {
  beforeEach(function () {
    atom.workspace.destroyActivePaneItem();
    waitsForPromise(function () {
      return Promise.all([atom.packages.activatePackage('linter-htmlhint'), atom.packages.activatePackage('language-html')]);
    });
  });

  it('detects invalid coding style in bad.html and report as error', function () {
    waitsForPromise(function () {
      var bad = path.join(__dirname, 'fixtures', 'bad.html');
      return atom.workspace.open(bad).then(function (editor) {
        return lint(editor);
      }).then(function (messages) {
        expect(messages.length).toEqual(1);

        // test only the first error
        expect(messages[0].type).toBe('error');
        expect(messages[0].text).toBe('Doctype must be declared first.');
        expect(messages[0].filePath).toBe(bad);
        expect(messages[0].range).toEqual([[0, 0], [0, 5]]);
      });
    });
  });

  it('finds nothing wrong with a valid file (good.html)', function () {
    waitsForPromise(function () {
      var good = path.join(__dirname, 'fixtures', 'good.html');
      return atom.workspace.open(good).then(function (editor) {
        return lint(editor);
      }).then(function (messages) {
        expect(messages.length).toBe(0);
      });
    });
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2RkZXdleS8uYXRvbS9wYWNrYWdlcy9saW50ZXItaHRtbGhpbnQvc3BlYy9saW50ZXItaHRtbGhpbnQtc3BlYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztvQkFFc0IsTUFBTTs7SUFBaEIsSUFBSTs7QUFGaEIsV0FBVyxDQUFDOztBQUlaLElBQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLGFBQWEsRUFBRSxDQUFDLElBQUksQ0FBQzs7QUFFN0QsUUFBUSxDQUFDLGtDQUFrQyxFQUFFLFlBQU07QUFDakQsWUFBVSxDQUFDLFlBQU07QUFDZixRQUFJLENBQUMsU0FBUyxDQUFDLHFCQUFxQixFQUFFLENBQUM7QUFDdkMsbUJBQWUsQ0FBQzthQUNkLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FDVixJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxpQkFBaUIsQ0FBQyxFQUNoRCxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxlQUFlLENBQUMsQ0FDL0MsQ0FBQztLQUFBLENBQ0gsQ0FBQztHQUNILENBQUMsQ0FBQzs7QUFFSCxJQUFFLENBQUMsOERBQThELEVBQUUsWUFBTTtBQUN2RSxtQkFBZSxDQUFDLFlBQU07QUFDcEIsVUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsVUFBVSxFQUFFLFVBQVUsQ0FBQyxDQUFDO0FBQ3pELGFBQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUEsTUFBTTtlQUFJLElBQUksQ0FBQyxNQUFNLENBQUM7T0FBQSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUMsUUFBUSxFQUFLO0FBQzlFLGNBQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDOzs7QUFHbkMsY0FBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDdkMsY0FBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsaUNBQWlDLENBQUMsQ0FBQztBQUNqRSxjQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUN2QyxjQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztPQUNyRCxDQUFDLENBQUM7S0FDSixDQUFDLENBQUM7R0FDSixDQUFDLENBQUM7O0FBRUgsSUFBRSxDQUFDLG1EQUFtRCxFQUFFLFlBQU07QUFDNUQsbUJBQWUsQ0FBQyxZQUFNO0FBQ3BCLFVBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFVBQVUsRUFBRSxXQUFXLENBQUMsQ0FBQztBQUMzRCxhQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFBLE1BQU07ZUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDO09BQUEsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFDLFFBQVEsRUFBSztBQUMvRSxjQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztPQUNqQyxDQUFDLENBQUM7S0FDSixDQUFDLENBQUM7R0FDSixDQUFDLENBQUM7Q0FDSixDQUFDLENBQUMiLCJmaWxlIjoiL2hvbWUvZGRld2V5Ly5hdG9tL3BhY2thZ2VzL2xpbnRlci1odG1saGludC9zcGVjL2xpbnRlci1odG1saGludC1zcGVjLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5cbmNvbnN0IGxpbnQgPSByZXF1aXJlKCcuLi9saWIvaW5kZXguanMnKS5wcm92aWRlTGludGVyKCkubGludDtcblxuZGVzY3JpYmUoJ1RoZSBodG1saGludCBwcm92aWRlciBmb3IgTGludGVyJywgKCkgPT4ge1xuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICBhdG9tLndvcmtzcGFjZS5kZXN0cm95QWN0aXZlUGFuZUl0ZW0oKTtcbiAgICB3YWl0c0ZvclByb21pc2UoKCkgPT5cbiAgICAgIFByb21pc2UuYWxsKFtcbiAgICAgICAgYXRvbS5wYWNrYWdlcy5hY3RpdmF0ZVBhY2thZ2UoJ2xpbnRlci1odG1saGludCcpLFxuICAgICAgICBhdG9tLnBhY2thZ2VzLmFjdGl2YXRlUGFja2FnZSgnbGFuZ3VhZ2UtaHRtbCcpXG4gICAgICBdKVxuICAgICk7XG4gIH0pO1xuXG4gIGl0KCdkZXRlY3RzIGludmFsaWQgY29kaW5nIHN0eWxlIGluIGJhZC5odG1sIGFuZCByZXBvcnQgYXMgZXJyb3InLCAoKSA9PiB7XG4gICAgd2FpdHNGb3JQcm9taXNlKCgpID0+IHtcbiAgICAgIGNvbnN0IGJhZCA9IHBhdGguam9pbihfX2Rpcm5hbWUsICdmaXh0dXJlcycsICdiYWQuaHRtbCcpO1xuICAgICAgcmV0dXJuIGF0b20ud29ya3NwYWNlLm9wZW4oYmFkKS50aGVuKGVkaXRvciA9PiBsaW50KGVkaXRvcikpLnRoZW4oKG1lc3NhZ2VzKSA9PiB7XG4gICAgICAgIGV4cGVjdChtZXNzYWdlcy5sZW5ndGgpLnRvRXF1YWwoMSk7XG5cbiAgICAgICAgLy8gdGVzdCBvbmx5IHRoZSBmaXJzdCBlcnJvclxuICAgICAgICBleHBlY3QobWVzc2FnZXNbMF0udHlwZSkudG9CZSgnZXJyb3InKTtcbiAgICAgICAgZXhwZWN0KG1lc3NhZ2VzWzBdLnRleHQpLnRvQmUoJ0RvY3R5cGUgbXVzdCBiZSBkZWNsYXJlZCBmaXJzdC4nKTtcbiAgICAgICAgZXhwZWN0KG1lc3NhZ2VzWzBdLmZpbGVQYXRoKS50b0JlKGJhZCk7XG4gICAgICAgIGV4cGVjdChtZXNzYWdlc1swXS5yYW5nZSkudG9FcXVhbChbWzAsIDBdLCBbMCwgNV1dKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcblxuICBpdCgnZmluZHMgbm90aGluZyB3cm9uZyB3aXRoIGEgdmFsaWQgZmlsZSAoZ29vZC5odG1sKScsICgpID0+IHtcbiAgICB3YWl0c0ZvclByb21pc2UoKCkgPT4ge1xuICAgICAgY29uc3QgZ29vZCA9IHBhdGguam9pbihfX2Rpcm5hbWUsICdmaXh0dXJlcycsICdnb29kLmh0bWwnKTtcbiAgICAgIHJldHVybiBhdG9tLndvcmtzcGFjZS5vcGVuKGdvb2QpLnRoZW4oZWRpdG9yID0+IGxpbnQoZWRpdG9yKSkudGhlbigobWVzc2FnZXMpID0+IHtcbiAgICAgICAgZXhwZWN0KG1lc3NhZ2VzLmxlbmd0aCkudG9CZSgwKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuIl19