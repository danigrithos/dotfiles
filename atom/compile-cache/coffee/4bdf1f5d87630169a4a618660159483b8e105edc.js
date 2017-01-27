(function() {
  describe('Linter Config', function() {
    var CP, FS, Helpers, getLinter, getMessage, linter, ref;
    linter = null;
    ref = require('./common'), getLinter = ref.getLinter, getMessage = ref.getMessage;
    CP = require('child_process');
    FS = require('fs');
    Helpers = require('../lib/helpers');
    beforeEach(function() {
      return waitsForPromise(function() {
        return atom.packages.activatePackage('linter').then(function() {
          return linter = atom.packages.getActivePackage('linter').mainModule.instance;
        });
      });
    });
    describe('ignoredMessageTypes', function() {
      return it('ignores certain types of messages', function() {
        var linterProvider;
        linterProvider = getLinter();
        expect(linter.messages.publicMessages.length).toBe(0);
        linter.messages.set({
          linter: linterProvider,
          messages: [getMessage('Error'), getMessage('Warning')]
        });
        linter.messages.updatePublic();
        expect(linter.messages.publicMessages.length).toBe(2);
        atom.config.set('linter.ignoredMessageTypes', ['Error']);
        linter.messages.set({
          linter: linterProvider,
          messages: [getMessage('Error'), getMessage('Warning')]
        });
        linter.messages.updatePublic();
        return expect(linter.messages.publicMessages.length).toBe(1);
      });
    });
    describe('statusIconScope', function() {
      return it('only shows messages of the current scope', function() {
        var linterProvider;
        linterProvider = getLinter();
        expect(linter.views.bottomContainer.status.count).toBe(0);
        linter.messages.set({
          linter: linterProvider,
          messages: [getMessage('Error', '/tmp/test.coffee')]
        });
        linter.messages.updatePublic();
        expect(linter.views.bottomContainer.status.count).toBe(1);
        atom.config.set('linter.statusIconScope', 'File');
        expect(linter.views.bottomContainer.status.count).toBe(0);
        atom.config.set('linter.statusIconScope', 'Project');
        return expect(linter.views.bottomContainer.status.count).toBe(1);
      });
    });
    describe('ignoreVCSIgnoredFiles', function() {
      return it('ignores the file if its ignored by the VCS', function() {
        var filePath, linterProvider;
        filePath = "/tmp/linter_test_file";
        FS.writeFileSync(filePath, "'use strict'\n");
        atom.config.set('linter.ignoreVCSIgnoredFiles', true);
        linterProvider = getLinter();
        spyOn(linterProvider, 'lint');
        spyOn(Helpers, 'isPathIgnored').andCallFake(function() {
          return true;
        });
        linter.addLinter(linterProvider);
        return waitsForPromise(function() {
          return atom.workspace.open(filePath).then(function() {
            linter.commands.lint();
            expect(linterProvider.lint).not.toHaveBeenCalled();
            atom.config.set('linter.ignoreVCSIgnoredFiles', false);
            linter.commands.lint();
            expect(linterProvider.lint).toHaveBeenCalled();
            return CP.execSync("rm -f " + filePath);
          });
        });
      });
    });
    return describe('ignoreMatchedFiles', function() {
      return it('ignores the file if it matches pattern', function() {
        var filePath, linterProvider;
        filePath = '/tmp/linter_spec_test.min.js';
        FS.writeFileSync(filePath, "'use strict'\n");
        atom.config.set('linter.ignoreMatchedFiles', '/**/*.min.{js,css}');
        linterProvider = getLinter();
        spyOn(linterProvider, 'lint');
        linter.addLinter(linterProvider);
        return waitsForPromise(function() {
          return atom.workspace.open(filePath).then(function() {
            linter.commands.lint();
            expect(linterProvider.lint).not.toHaveBeenCalled();
            atom.config.set('linter.ignoreMatchedFiles', '/**/*.min.css');
            linter.commands.lint();
            expect(linterProvider.lint).toHaveBeenCalled();
            return CP.execSync("rm -f " + filePath);
          });
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvZGRld2V5Ly5hdG9tL3BhY2thZ2VzL2xpbnRlci9zcGVjL2NvbmZpZy1zcGVjLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUFBLFFBQUEsQ0FBUyxlQUFULEVBQTBCLFNBQUE7QUFDeEIsUUFBQTtJQUFBLE1BQUEsR0FBUztJQUNULE1BQTBCLE9BQUEsQ0FBUSxVQUFSLENBQTFCLEVBQUMseUJBQUQsRUFBWTtJQUNaLEVBQUEsR0FBSyxPQUFBLENBQVEsZUFBUjtJQUNMLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUjtJQUNMLE9BQUEsR0FBVSxPQUFBLENBQVEsZ0JBQVI7SUFDVixVQUFBLENBQVcsU0FBQTthQUNULGVBQUEsQ0FBZ0IsU0FBQTtlQUNkLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZCxDQUE4QixRQUE5QixDQUF1QyxDQUFDLElBQXhDLENBQTZDLFNBQUE7aUJBQzNDLE1BQUEsR0FBUyxJQUFJLENBQUMsUUFBUSxDQUFDLGdCQUFkLENBQStCLFFBQS9CLENBQXdDLENBQUMsVUFBVSxDQUFDO1FBRGxCLENBQTdDO01BRGMsQ0FBaEI7SUFEUyxDQUFYO0lBS0EsUUFBQSxDQUFTLHFCQUFULEVBQWdDLFNBQUE7YUFDOUIsRUFBQSxDQUFHLG1DQUFILEVBQXdDLFNBQUE7QUFDdEMsWUFBQTtRQUFBLGNBQUEsR0FBaUIsU0FBQSxDQUFBO1FBQ2pCLE1BQUEsQ0FBTyxNQUFNLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxNQUF0QyxDQUE2QyxDQUFDLElBQTlDLENBQW1ELENBQW5EO1FBQ0EsTUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFoQixDQUFvQjtVQUFDLE1BQUEsRUFBUSxjQUFUO1VBQXlCLFFBQUEsRUFBVSxDQUFDLFVBQUEsQ0FBVyxPQUFYLENBQUQsRUFBc0IsVUFBQSxDQUFXLFNBQVgsQ0FBdEIsQ0FBbkM7U0FBcEI7UUFDQSxNQUFNLENBQUMsUUFBUSxDQUFD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QUEiLCJzb3VyY2VzQ29udGVudCI6WyJkZXNjcmliZSAnTGludGVyIENvbmZpZycsIC0+XG4gIGxpbnRlciA9IG51bGxcbiAge2dldExpbnRlciwgZ2V0TWVzc2FnZX0gPSByZXF1aXJlKCcuL2NvbW1vbicpXG4gIENQID0gcmVxdWlyZSgnY2hpbGRfcHJvY2VzcycpXG4gIEZTID0gcmVxdWlyZSgnZnMnKVxuICBIZWxwZXJzID0gcmVxdWlyZSgnLi4vbGliL2hlbHBlcnMnKVxuICBiZWZvcmVFYWNoIC0+XG4gICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICBhdG9tLnBhY2thZ2VzLmFjdGl2YXRlUGFja2FnZSgnbGludGVyJykudGhlbiAtPlxuICAgICAgICBsaW50ZXIgPSBhdG9tLnBhY2thZ2VzLmdldEFjdGl2ZVBhY2thZ2UoJ2xpbnRlcicpLm1haW5Nb2R1bGUuaW5zdGFuY2VcblxuICBkZXNjcmliZSAnaWdub3JlZE1lc3NhZ2VUeXBlcycsIC0+XG4gICAgaXQgJ2lnbm9yZXMgY2VydGFpbiB0eXBlcyBvZiBtZXNzYWdlcycsIC0+XG4gICAgICBsaW50ZXJQcm92aWRlciA9IGdldExpbnRlcigpXG4gICAgICBleHBlY3QobGludGVyLm1lc3NhZ2VzLnB1YmxpY01lc3NhZ2VzLmxlbmd0aCkudG9CZSgwKVxuICAgICAgbGludGVyLm1lc3NhZ2VzLnNldCh7bGludGVyOiBsaW50ZXJQcm92aWRlciwgbWVzc2FnZXM6IFtnZXRNZXNzYWdlKCdFcnJvcicpLCBnZXRNZXNzYWdlKCdXYXJuaW5nJyldfSlcbiAgICAgIGxpbnRlci5tZXNzYWdlcy51cGRhdGVQdWJsaWMoKVxuICAgICAgZXhwZWN0KGxpbnRlci5tZXNzYWdlcy5wdWJsaWNNZXNzYWdlcy5sZW5ndGgpLnRvQmUoMilcbiAgICAgIGF0b20uY29uZmlnLnNldCgnbGludGVyLmlnbm9yZWRNZXNzYWdlVHlwZXMnLCBbJ0Vycm9yJ10pXG4gICAgICBsaW50ZXIubWVzc2FnZXMuc2V0KHtsaW50ZXI6IGxpbnRlclByb3ZpZGVyLCBtZXNzYWdlczogW2dldE1lc3NhZ2UoJ0Vycm9yJyksIGdldE1lc3NhZ2UoJ1dhcm5pbmcnKV19KVxuICAgICAgbGludGVyLm1lc3NhZ2VzLnVwZGF0ZVB1YmxpYygpXG4gICAgICBleHBlY3QobGludGVyLm1lc3NhZ2VzLnB1YmxpY01lc3NhZ2VzLmxlbmd0aCkudG9CZSgxKVxuXG4gIGRlc2NyaWJlICdzdGF0dXNJY29uU2NvcGUnLCAtPlxuICAgIGl0ICdvbmx5IHNob3dzIG1lc3NhZ2VzIG9mIHRoZSBjdXJyZW50IHNjb3BlJywgLT5cbiAgICAgIGxpbnRlclByb3ZpZGVyID0gZ2V0TGludGVyKClcbiAgICAgIGV4cGVjdChsaW50ZXIudmlld3MuYm90dG9tQ29udGFpbmVyLnN0YXR1cy5jb3VudCkudG9CZSgwKVxuICAgICAgbGludGVyLm1lc3NhZ2VzLnNldCh7bGludGVyOiBsaW50ZXJQcm92aWRlciwgbWVzc2FnZXM6IFtnZXRNZXNzYWdlKCdFcnJvcicsICcvdG1wL3Rlc3QuY29mZmVlJyldfSlcbiAgICAgIGxpbnRlci5tZXNzYWdlcy51cGRhdGVQdWJsaWMoKVxuICAgICAgZXhwZWN0KGxpbnRlci52aWV3cy5ib3R0b21Db250YWluZXIuc3RhdHVzLmNvdW50KS50b0JlKDEpXG4gICAgICBhdG9tLmNvbmZpZy5zZXQoJ2xpbnRlci5zdGF0dXNJY29uU2NvcGUnLCAnRmlsZScpXG4gICAgICBleHBlY3QobGludGVyLnZpZXdzLmJvdHRvbUNvbnRhaW5lci5zdGF0dXMuY291bnQpLnRvQmUoMClcbiAgICAgIGF0b20uY29uZmlnLnNldCgnbGludGVyLnN0YXR1c0ljb25TY29wZScsICdQcm9qZWN0JylcbiAgICAgIGV4cGVjdChsaW50ZXIudmlld3MuYm90dG9tQ29udGFpbmVyLnN0YXR1cy5jb3VudCkudG9CZSgxKVxuICBkZXNjcmliZSAnaWdub3JlVkNTSWdub3JlZEZpbGVzJywgLT5cbiAgICBpdCAnaWdub3JlcyB0aGUgZmlsZSBpZiBpdHMgaWdub3JlZCBieSB0aGUgVkNTJywgLT5cbiAgICAgIGZpbGVQYXRoID0gXCIvdG1wL2xpbnRlcl90ZXN0X2ZpbGVcIlxuICAgICAgRlMud3JpdGVGaWxlU3luYyhmaWxlUGF0aCwgXCIndXNlIHN0cmljdCdcXG5cIilcblxuICAgICAgYXRvbS5jb25maWcuc2V0KCdsaW50ZXIuaWdub3JlVkNTSWdub3JlZEZpbGVzJywgdHJ1ZSlcbiAgICAgIGxpbnRlclByb3ZpZGVyID0gZ2V0TGludGVyKClcbiAgICAgIHNweU9uKGxpbnRlclByb3ZpZGVyLCAnbGludCcpXG4gICAgICBzcHlPbihIZWxwZXJzLCAnaXNQYXRoSWdub3JlZCcpLmFuZENhbGxGYWtlKCAtPiB0cnVlKVxuXG4gICAgICBsaW50ZXIuYWRkTGludGVyKGxpbnRlclByb3ZpZGVyKVxuXG4gICAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgICAgYXRvbS53b3Jrc3BhY2Uub3BlbihmaWxlUGF0aCkudGhlbiAtPlxuICAgICAgICAgIGxpbnRlci5jb21tYW5kcy5saW50KClcbiAgICAgICAgICBleHBlY3QobGludGVyUHJvdmlkZXIubGludCkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgICAgIGF0b20uY29uZmlnLnNldCgnbGludGVyLmlnbm9yZVZDU0lnbm9yZWRGaWxlcycsIGZhbHNlKVxuICAgICAgICAgIGxpbnRlci5jb21tYW5kcy5saW50KClcbiAgICAgICAgICBleHBlY3QobGludGVyUHJvdmlkZXIubGludCkudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICAgICAgQ1AuZXhlY1N5bmMoXCJybSAtZiAje2ZpbGVQYXRofVwiKVxuXG4gIGRlc2NyaWJlICdpZ25vcmVNYXRjaGVkRmlsZXMnLCAtPlxuICAgIGl0ICdpZ25vcmVzIHRoZSBmaWxlIGlmIGl0IG1hdGNoZXMgcGF0dGVybicsIC0+XG4gICAgICBmaWxlUGF0aCA9ICcvdG1wL2xpbnRlcl9zcGVjX3Rlc3QubWluLmpzJ1xuICAgICAgRlMud3JpdGVGaWxlU3luYyhmaWxlUGF0aCwgXCIndXNlIHN0cmljdCdcXG5cIilcblxuICAgICAgYXRvbS5jb25maWcuc2V0KCdsaW50ZXIuaWdub3JlTWF0Y2hlZEZpbGVzJywgJy8qKi8qLm1pbi57anMsY3NzfScpXG4gICAgICBsaW50ZXJQcm92aWRlciA9IGdldExpbnRlcigpXG4gICAgICBzcHlPbihsaW50ZXJQcm92aWRlciwgJ2xpbnQnKVxuXG4gICAgICBsaW50ZXIuYWRkTGludGVyKGxpbnRlclByb3ZpZGVyKVxuXG4gICAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgICAgYXRvbS53b3Jrc3BhY2Uub3BlbihmaWxlUGF0aCkudGhlbiAtPlxuICAgICAgICAgIGxpbnRlci5jb21tYW5kcy5saW50KClcbiAgICAgICAgICBleHBlY3QobGludGVyUHJvdmlkZXIubGludCkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgICAgIGF0b20uY29uZmlnLnNldCgnbGludGVyLmlnbm9yZU1hdGNoZWRGaWxlcycsICcvKiovKi5taW4uY3NzJylcbiAgICAgICAgICBsaW50ZXIuY29tbWFuZHMubGludCgpXG4gICAgICAgICAgZXhwZWN0KGxpbnRlclByb3ZpZGVyLmxpbnQpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgICAgIENQLmV4ZWNTeW5jKFwicm0gLWYgI3tmaWxlUGF0aH1cIilcbiJdfQ==
