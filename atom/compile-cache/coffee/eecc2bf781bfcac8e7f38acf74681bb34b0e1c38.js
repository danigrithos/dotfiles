(function() {
  describe('linter-registry', function() {
    var EditorLinter, LinterRegistry, getLinter, getMessage, linterRegistry, ref;
    LinterRegistry = require('../lib/linter-registry');
    EditorLinter = require('../lib/editor-linter');
    linterRegistry = null;
    ref = require('./common'), getLinter = ref.getLinter, getMessage = ref.getMessage;
    beforeEach(function() {
      waitsForPromise(function() {
        atom.workspace.destroyActivePaneItem();
        return atom.workspace.open('file.txt');
      });
      if (linterRegistry != null) {
        linterRegistry.dispose();
      }
      return linterRegistry = new LinterRegistry;
    });
    describe('::addLinter', function() {
      it('adds error notification if linter is invalid', function() {
        linterRegistry.addLinter({});
        return expect(atom.notifications.getNotifications().length).toBe(1);
      });
      it('pushes linter into registry when valid', function() {
        var linter;
        linter = getLinter();
        linterRegistry.addLinter(linter);
        return expect(linterRegistry.linters.size).toBe(1);
      });
      return it('set deactivated to false on linter', function() {
        var linter;
        linter = getLinter();
        linterRegistry.addLinter(linter);
        return expect(linter.deactivated).toBe(false);
      });
    });
    describe('::hasLinter', function() {
      it('returns true if present', function() {
        var linter;
        linter = getLinter();
        linterRegistry.addLinter(linter);
        return expect(linterRegistry.hasLinter(linter)).toBe(true);
      });
      return it('returns false if not', function() {
        var linter;
        linter = getLinter();
        return expect(linterRegistry.hasLinter(linter)).toBe(false);
      });
    });
    describe('::deleteLinter', function() {
      it('deletes the linter from registry', function() {
        var linter;
        linter = getLinter();
        linterRegistry.addLinter(linter);
        expect(linterRegistry.hasLinter(linter)).toBe(true);
        linterRegistry.deleteLinter(linter);
        return expect(linterRegistry.hasLinter(linter)).toBe(false);
      });
      return it('sets deactivated to true on linter', function() {
        var linter;
        linter = getLinter();
        linterRegistry.addLinter(linter);
        linterRegistry.deleteLinter(linter);
        return expect(linter.deactivated).toBe(true);
      });
    });
    describe('::lint', function() {
      it("doesn't lint if textEditor isn't active one", function() {
        var editorLinter, linter;
        editorLinter = new EditorLinter(atom.workspace.getActiveTextEditor());
        linter = {
          grammarScopes: ['*'],
          lintOnFly: false,
          modifiesBuffer: false,
          scope: 'file',
          lint: function() {}
        };
        linterRegistry.addLinter(linter);
        return waitsForPromise(function() {
          return atom.workspace.open('test2.txt').then(function() {
            return expect(linterRegistry.lint({
              onChange: false,
              editorLinter: editorLinter
            })).toBeUndefined();
          });
        });
      });
      it("doesn't lint if textEditor doesn't have a path", function() {
        var editorLinter, linter;
        editorLinter = new EditorLinter(atom.workspace.getActiveTextEditor());
        linter = {
          grammarScopes: ['*'],
          lintOnFly: false,
          scope: 'file',
          lint: function() {}
        };
        linterRegistry.addLinter(linter);
        return waitsForPromise(function() {
          return atom.workspace.open('someNonExistingFile.txt').then(function() {
            return expect(linterRegistry.lint({
              onChange: false,
              editorLinter: editorLinter
            })).toBeUndefined();
          });
        });
      });
      return it('disallows two co-current lints of same type', function() {
        var editorLinter, linter;
        editorLinter = new EditorLinter(atom.workspace.getActiveTextEditor());
        linter = {
          grammarScopes: ['*'],
          lintOnFly: false,
          scope: 'file',
          lint: function() {}
        };
        linterRegistry.addLinter(linter);
        expect(linterRegistry.lint({
          onChange: false,
          editorLinter: editorLinter
        })).toBeDefined();
        return expect(linterRegistry.lint({
          onChange: false,
          editorLinter: editorLinter
        })).toBeUndefined();
      });
    });
    return describe('::onDidUpdateMessages', function() {
      return it('is triggered whenever messages change', function() {
        var editorLinter, info, linter;
        editorLinter = new EditorLinter(atom.workspace.getActiveTextEditor());
        linter = {
          grammarScopes: ['*'],
          lintOnFly: false,
          scope: 'file',
          lint: function() {
            return [
              {
                type: 'Error',
                text: 'Something'
              }
            ];
          }
        };
        info = void 0;
        linterRegistry.addLinter(linter);
        linterRegistry.onDidUpdateMessages(function(linterInfo) {
          return info = linterInfo;
        });
        return waitsForPromise(function() {
          return linterRegistry.lint({
            onChange: false,
            editorLinter: editorLinter
          }).then(function() {
            expect(info).toBeDefined();
            return expect(info.messages.length).toBe(1);
          });
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvZGRld2V5Ly5hdG9tL3BhY2thZ2VzL2xpbnRlci9zcGVjL2xpbnRlci1yZWdpc3RyeS1zcGVjLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUFBLFFBQUEsQ0FBUyxpQkFBVCxFQUE0QixTQUFBO0FBQzFCLFFBQUE7SUFBQSxjQUFBLEdBQWlCLE9BQUEsQ0FBUSx3QkFBUjtJQUNqQixZQUFBLEdBQWUsT0FBQSxDQUFRLHNCQUFSO0lBQ2YsY0FBQSxHQUFpQjtJQUNqQixNQUEwQixPQUFBLENBQVEsVUFBUixDQUExQixFQUFDLHlCQUFELEVBQVk7SUFFWixVQUFBLENBQVcsU0FBQTtNQUNULGVBQUEsQ0FBZ0IsU0FBQTtRQUNkLElBQUksQ0FBQyxTQUFTLENBQUMscUJBQWYsQ0FBQTtlQUNBLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixVQUFwQjtNQUZjLENBQWhCOztRQUdBLGNBQWMsQ0FBRSxPQUFoQixDQUFBOzthQUNBLGNBQUEsR0FBaUIsSUFBSTtJQUxaLENBQVg7SUFPQSxRQUFBLENBQVMsYUFBVCxFQUF3QixTQUFBO01BQ3RCLEVBQUEsQ0FBRyw4Q0FBSCxFQUFtRCxTQUFBO1FBQ2pELGNBQWMsQ0FBQyxTQUFmLENBQXlCLEVBQXpCO2VBQ0EsTUFBQSxDQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsZ0JBQW5CLENBQUEsQ0FBcUMsQ0FBQyxNQUE3QyxDQUFvRCxDQUFDLElBQXJELENBQTBELENBQTFEO01BRmlELENBQW5EO01BR0EsRUFBQSxDQUFHLHdDQUFILEVBQTZDLFNBQUE7QUFDM0MsWUFBQTtRQUFBLE1BQUEsR0FBUyxTQUFBLENBQUE7UUFDVCxjQUFjLENBQUMsU0FBZixDQUF5QixNQUF6QjtlQUNBLE1BQUEsQ0FBTyxjQUFjLENBQUMsT0FBTyxDQUFDLElBQTlCLENBQW1DLENBQUMsSUFBcEMsQ0FBeUMsQ0FBekM7TUFIMkMsQ0FBN0M7YUFJQSxF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SCxFQUE0QyxTQUFBO0FBQzFDLFlBQUE7UUFBQSxZQUFBLEdBQW1CLElBQUEsWUFBQSxDQUFhLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQUFiO1FBQ25CLE1BQUEsR0FBUztVQUNQLGFBQUEsRUFBZSxDQUFDLEdBQUQsQ0FEUjtVQUVQLFNBQUEsRUFBVyxLQUZKO1VBR1AsS0FBQSxFQUFPLE1BSEE7VUFJUCxJQUFBLEVBQU0sU0FBQTtBQUFHLG1CQUFPO2NBQUM7Z0JBQUMsSUFBQSxFQUFNLE9BQVA7Z0JBQWdCLElBQUEsRUFBTSxXQUF0QjtlQUFEOztVQUFWLENBSkM7O1FBTVQsSUFBQSxHQUFPO1FBQ1AsY0FBYyxDQUFDLFNBQWYsQ0FBeUIsTUFBekI7UUFDQSxjQUFjLENBQUMsbUJBQWYsQ0FBbUMsU0FBQyxVQUFEO2lCQUNqQyxJQUFBLEdBQU87UUFEMEIsQ0FBbkM7ZUFFQSxlQUFBLENBQWdCLFNBQUE7aUJBQ2QsY0FBYyxDQUFDLElBQWYsQ0FBb0I7WUFBQyxRQUFBLEVBQVUsS0FBWDtZQUFrQixjQUFBLFlBQWxCO1dBQXBCLENBQW9ELENBQUMsSUFBckQsQ0FBMEQsU0FBQTtZQUN4RCxNQUFBLENBQU8sSUFBUCxDQUFZLENBQUMsV0FBYixDQUFBO21CQUNBLE1BQUEsQ0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQXJCLENBQTRCLENBQUMsSUFBN0IsQ0FBa0MsQ0FBbEM7VUFGd0QsQ0FBMUQ7UUFEYyxDQUFoQjtNQVowQyxDQUE1QztJQURnQyxDQUFsQztFQXRGMEIsQ0FBNUI7QUFBQSIsInNvdXJjZXNDb250ZW50IjpbImRlc2NyaWJlICdsaW50ZXItcmVnaXN0cnknLCAtPlxuICBMaW50ZXJSZWdpc3RyeSA9IHJlcXVpcmUoJy4uL2xpYi9saW50ZXItcmVnaXN0cnknKVxuICBFZGl0b3JMaW50ZXIgPSByZXF1aXJlKCcuLi9saWIvZWRpdG9yLWxpbnRlcicpXG4gIGxpbnRlclJlZ2lzdHJ5ID0gbnVsbFxuICB7Z2V0TGludGVyLCBnZXRNZXNzYWdlfSA9IHJlcXVpcmUoJy4vY29tbW9uJylcblxuICBiZWZvcmVFYWNoIC0+XG4gICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICBhdG9tLndvcmtzcGFjZS5kZXN0cm95QWN0aXZlUGFuZUl0ZW0oKVxuICAgICAgYXRvbS53b3Jrc3BhY2Uub3BlbignZmlsZS50eHQnKVxuICAgIGxpbnRlclJlZ2lzdHJ5Py5kaXNwb3NlKClcbiAgICBsaW50ZXJSZWdpc3RyeSA9IG5ldyBMaW50ZXJSZWdpc3RyeVxuXG4gIGRlc2NyaWJlICc6OmFkZExpbnRlcicsIC0+XG4gICAgaXQgJ2FkZHMgZXJyb3Igbm90aWZpY2F0aW9uIGlmIGxpbnRlciBpcyBpbnZhbGlkJywgLT5cbiAgICAgIGxpbnRlclJlZ2lzdHJ5LmFkZExpbnRlcih7fSlcbiAgICAgIGV4cGVjdChhdG9tLm5vdGlmaWNhdGlvbnMuZ2V0Tm90aWZpY2F0aW9ucygpLmxlbmd0aCkudG9CZSgxKVxuICAgIGl0ICdwdXNoZXMgbGludGVyIGludG8gcmVnaXN0cnkgd2hlbiB2YWxpZCcsIC0+XG4gICAgICBsaW50ZXIgPSBnZXRMaW50ZXIoKVxuICAgICAgbGludGVyUmVnaXN0cnkuYWRkTGludGVyKGxpbnRlcilcbiAgICAgIGV4cGVjdChsaW50ZXJSZWdpc3RyeS5saW50ZXJzLnNpemUpLnRvQmUoMSlcbiAgICBpdCAnc2V0IGRlYWN0aXZhdGVkIHRvIGZhbHNlIG9uIGxpbnRlcicsIC0+XG4gICAgICBsaW50ZXIgPSBnZXRMaW50ZXIoKVxuICAgICAgbGludGVyUmVnaXN0cnkuYWRkTGludGVyKGxpbnRlcilcbiAgICAgIGV4cGVjdChsaW50ZXIuZGVhY3RpdmF0ZWQpLnRvQmUoZmFsc2UpXG5cbiAgZGVzY3JpYmUgJzo6aGFzTGludGVyJywgLT5cbiAgICBpdCAncmV0dXJucyB0cnVlIGlmIHByZXNlbnQnLCAtPlxuICAgICAgbGludGVyID0gZ2V0TGludGVyKClcbiAgICAgIGxpbnRlclJlZ2lzdHJ5LmFkZExpbnRlcihsaW50ZXIpXG4gICAgICBleHBlY3QobGludGVyUmVnaXN0cnkuaGFzTGludGVyKGxpbnRlcikpLnRvQmUodHJ1ZSlcbiAgICBpdCAncmV0dXJucyBmYWxzZSBpZiBub3QnLCAtPlxuICAgICAgbGludGVyID0gZ2V0TGludGVyKClcbiAgICAgIGV4cGVjdChsaW50ZXJSZWdpc3RyeS5oYXNMaW50ZXIobGludGVyKSkudG9CZShmYWxzZSlcblxuICBkZXNjcmliZSAnOjpkZWxldGVMaW50ZXInLCAtPlxuICAgIGl0ICdkZWxldGVzIHRoZSBsaW50ZXIgZnJvbSByZWdpc3RyeScsIC0+XG4gICAgICBsaW50ZXIgPSBnZXRMaW50ZXIoKVxuICAgICAgbGludGVyUmVnaXN0cnkuYWRkTGludGVyKGxpbnRlcilcbiAgICAgIGV4cGVjdChsaW50ZXJSZWdpc3RyeS5oYXNMaW50ZXIobGludGVyKSkudG9CZSh0cnVlKVxuICAgICAgbGludGVyUmVnaXN0cnkuZGVsZXRlTGludGVyKGxpbnRlcilcbiAgICAgIGV4cGVjdChsaW50ZXJSZWdpc3RyeS5oYXNMaW50ZXIobGludGVyKSkudG9CZShmYWxzZSlcbiAgICBpdCAnc2V0cyBkZWFjdGl2YXRlZCB0byB0cnVlIG9uIGxpbnRlcicsIC0+XG4gICAgICBsaW50ZXIgPSBnZXRMaW50ZXIoKVxuICAgICAgbGludGVyUmVnaXN0cnkuYWRkTGludGVyKGxpbnRlcilcbiAgICAgIGxpbnRlclJlZ2lzdHJ5LmRlbGV0ZUxpbnRlcihsaW50ZXIpXG4gICAgICBleHBlY3QobGludGVyLmRlYWN0aXZhdGVkKS50b0JlKHRydWUpXG5cbiAgZGVzY3JpYmUgJzo6bGludCcsIC0+XG4gICAgaXQgXCJkb2Vzbid0IGxpbnQgaWYgdGV4dEVkaXRvciBpc24ndCBhY3RpdmUgb25lXCIsIC0+XG4gICAgICBlZGl0b3JMaW50ZXIgPSBuZXcgRWRpdG9yTGludGVyKGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKSlcbiAgICAgIGxpbnRlciA9IHtcbiAgICAgICAgZ3JhbW1hclNjb3BlczogWycqJ11cbiAgICAgICAgbGludE9uRmx5OiBmYWxzZVxuICAgICAgICBtb2RpZmllc0J1ZmZlcjogZmFsc2VcbiAgICAgICAgc2NvcGU6ICdmaWxlJ1xuICAgICAgICBsaW50OiAtPlxuICAgICAgfVxuICAgICAgbGludGVyUmVnaXN0cnkuYWRkTGludGVyKGxpbnRlcilcbiAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgICBhdG9tLndvcmtzcGFjZS5vcGVuKCd0ZXN0Mi50eHQnKS50aGVuIC0+XG4gICAgICAgICAgZXhwZWN0KGxpbnRlclJlZ2lzdHJ5LmxpbnQoe29uQ2hhbmdlOiBmYWxzZSwgZWRpdG9yTGludGVyfSkpLnRvQmVVbmRlZmluZWQoKVxuICAgIGl0IFwiZG9lc24ndCBsaW50IGlmIHRleHRFZGl0b3IgZG9lc24ndCBoYXZlIGEgcGF0aFwiLCAtPlxuICAgICAgZWRpdG9yTGludGVyID0gbmV3IEVkaXRvckxpbnRlcihhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCkpXG4gICAgICBsaW50ZXIgPSB7XG4gICAgICAgIGdyYW1tYXJTY29wZXM6IFsnKiddXG4gICAgICAgIGxpbnRPbkZseTogZmFsc2VcbiAgICAgICAgc2NvcGU6ICdmaWxlJ1xuICAgICAgICBsaW50OiAtPlxuICAgICAgfVxuICAgICAgbGludGVyUmVnaXN0cnkuYWRkTGludGVyKGxpbnRlcilcbiAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgICBhdG9tLndvcmtzcGFjZS5vcGVuKCdzb21lTm9uRXhpc3RpbmdGaWxlLnR4dCcpLnRoZW4gLT5cbiAgICAgICAgICBleHBlY3QobGludGVyUmVnaXN0cnkubGludCh7b25DaGFuZ2U6IGZhbHNlLCBlZGl0b3JMaW50ZXJ9KSkudG9CZVVuZGVmaW5lZCgpXG4gICAgaXQgJ2Rpc2FsbG93cyB0d28gY28tY3VycmVudCBsaW50cyBvZiBzYW1lIHR5cGUnLCAtPlxuICAgICAgZWRpdG9yTGludGVyID0gbmV3IEVkaXRvckxpbnRlcihhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCkpXG4gICAgICBsaW50ZXIgPSB7XG4gICAgICAgIGdyYW1tYXJTY29wZXM6IFsnKiddXG4gICAgICAgIGxpbnRPbkZseTogZmFsc2VcbiAgICAgICAgc2NvcGU6ICdmaWxlJ1xuICAgICAgICBsaW50OiAtPlxuICAgICAgfVxuICAgICAgbGludGVyUmVnaXN0cnkuYWRkTGludGVyKGxpbnRlcilcbiAgICAgIGV4cGVjdChsaW50ZXJSZWdpc3RyeS5saW50KHtvbkNoYW5nZTogZmFsc2UsIGVkaXRvckxpbnRlcn0pKS50b0JlRGVmaW5lZCgpXG4gICAgICBleHBlY3QobGludGVyUmVnaXN0cnkubGludCh7b25DaGFuZ2U6IGZhbHNlLCBlZGl0b3JMaW50ZXJ9KSkudG9CZVVuZGVmaW5lZCgpXG5cbiAgZGVzY3JpYmUgJzo6b25EaWRVcGRhdGVNZXNzYWdlcycsIC0+XG4gICAgaXQgJ2lzIHRyaWdnZXJlZCB3aGVuZXZlciBtZXNzYWdlcyBjaGFuZ2UnLCAtPlxuICAgICAgZWRpdG9yTGludGVyID0gbmV3IEVkaXRvckxpbnRlcihhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCkpXG4gICAgICBsaW50ZXIgPSB7XG4gICAgICAgIGdyYW1tYXJTY29wZXM6IFsnKiddXG4gICAgICAgIGxpbnRPbkZseTogZmFsc2VcbiAgICAgICAgc2NvcGU6ICdmaWxlJ1xuICAgICAgICBsaW50OiAtPiByZXR1cm4gW3t0eXBlOiAnRXJyb3InLCB0ZXh0OiAnU29tZXRoaW5nJ31dXG4gICAgICB9XG4gICAgICBpbmZvID0gdW5kZWZpbmVkXG4gICAgICBsaW50ZXJSZWdpc3RyeS5hZGRMaW50ZXIobGludGVyKVxuICAgICAgbGludGVyUmVnaXN0cnkub25EaWRVcGRhdGVNZXNzYWdlcyAobGludGVySW5mbykgLT5cbiAgICAgICAgaW5mbyA9IGxpbnRlckluZm9cbiAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgICBsaW50ZXJSZWdpc3RyeS5saW50KHtvbkNoYW5nZTogZmFsc2UsIGVkaXRvckxpbnRlcn0pLnRoZW4gLT5cbiAgICAgICAgICBleHBlY3QoaW5mbykudG9CZURlZmluZWQoKVxuICAgICAgICAgIGV4cGVjdChpbmZvLm1lc3NhZ2VzLmxlbmd0aCkudG9CZSgxKVxuIl19
