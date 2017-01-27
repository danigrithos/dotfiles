(function() {
  describe('editor-registry', function() {
    var EditorRegistry, editorRegistry;
    EditorRegistry = require('../lib/editor-registry');
    editorRegistry = null;
    beforeEach(function() {
      waitsForPromise(function() {
        atom.workspace.destroyActivePaneItem();
        return atom.workspace.open(__dirname + '/fixtures/file.txt');
      });
      if (editorRegistry != null) {
        editorRegistry.dispose();
      }
      return editorRegistry = new EditorRegistry;
    });
    describe('::create', function() {
      it('cries when invalid TextEditor was provided', function() {
        expect(function() {
          return editorRegistry.create();
        }).toThrow();
        return expect(function() {
          return editorRegistry.create(5);
        }).toThrow();
      });
      it("adds TextEditor to it's registry", function() {
        editorRegistry.create(atom.workspace.getActiveTextEditor());
        return expect(editorRegistry.editorLinters.size).toBe(1);
      });
      return it('automatically clears the TextEditor from registry when destroyed', function() {
        editorRegistry.create(atom.workspace.getActiveTextEditor());
        atom.workspace.destroyActivePaneItem();
        return expect(editorRegistry.editorLinters.size).toBe(0);
      });
    });
    describe('::has', function() {
      return it('returns the status of existence', function() {
        var editor;
        editor = atom.workspace.getActiveTextEditor();
        expect(editorRegistry.has(1)).toBe(false);
        expect(editorRegistry.has(false)).toBe(false);
        expect(editorRegistry.has([])).toBe(false);
        expect(editorRegistry.has(editor)).toBe(false);
        editorRegistry.create(editor);
        expect(editorRegistry.has(editor)).toBe(true);
        atom.workspace.destroyActivePaneItem();
        return expect(editorRegistry.has(editor)).toBe(false);
      });
    });
    describe('::forEach', function() {
      return it('calls the callback once per editorLinter', function() {
        var timesCalled;
        editorRegistry.create(atom.workspace.getActiveTextEditor());
        timesCalled = 0;
        editorRegistry.forEach(function() {
          return ++timesCalled;
        });
        editorRegistry.forEach(function() {
          return ++timesCalled;
        });
        return expect(timesCalled).toBe(2);
      });
    });
    describe('::ofTextEditor', function() {
      it('returns undefined when invalid key is provided', function() {
        expect(editorRegistry.ofTextEditor(null)).toBeUndefined();
        expect(editorRegistry.ofTextEditor(1)).toBeUndefined();
        expect(editorRegistry.ofTextEditor(5)).toBeUndefined();
        return expect(editorRegistry.ofTextEditor('asd')).toBeUndefined();
      });
      return it('returns editorLinter when valid key is provided', function() {
        var activeEditor;
        activeEditor = atom.workspace.getActiveTextEditor();
        expect(editorRegistry.ofTextEditor(activeEditor)).toBeUndefined();
        editorRegistry.create(activeEditor);
        return expect(editorRegistry.ofTextEditor(activeEditor)).toBeDefined();
      });
    });
    describe('::ofPath', function() {
      it('returns undefined when invalid key is provided', function() {
        expect(editorRegistry.ofPath(null)).toBeUndefined();
        expect(editorRegistry.ofPath(1)).toBeUndefined();
        expect(editorRegistry.ofPath(5)).toBeUndefined();
        return expect(editorRegistry.ofPath('asd')).toBeUndefined();
      });
      return it('returns editorLinter when valid key is provided', function() {
        var activeEditor, editorPath;
        activeEditor = atom.workspace.getActiveTextEditor();
        editorPath = activeEditor.getPath();
        expect(editorRegistry.ofPath(editorPath)).toBeUndefined();
        editorRegistry.create(activeEditor);
        return expect(editorRegistry.ofPath(editorPath)).toBeDefined();
      });
    });
    describe('::observe', function() {
      it('calls with the current editorLinters', function() {
        var timesCalled;
        timesCalled = 0;
        editorRegistry.create(atom.workspace.getActiveTextEditor());
        editorRegistry.observe(function() {
          return ++timesCalled;
        });
        return expect(timesCalled).toBe(1);
      });
      return it('calls in the future with new editorLinters', function() {
        var timesCalled;
        timesCalled = 0;
        editorRegistry.observe(function() {
          return ++timesCalled;
        });
        editorRegistry.create(atom.workspace.getActiveTextEditor());
        return waitsForPromise(function() {
          return atom.workspace.open('someNonExistingFile').then(function() {
            editorRegistry.create(atom.workspace.getActiveTextEditor());
            return expect(timesCalled).toBe(2);
          });
        });
      });
    });
    return describe('::ofActiveTextEditor', function() {
      it('returns undefined if active pane is not a text editor', function() {
        return expect(editorRegistry.ofActiveTextEditor()).toBeUndefined();
      });
      return it('returns editorLinter when active pane is a text editor', function() {
        editorRegistry.create(atom.workspace.getActiveTextEditor());
        return expect(editorRegistry.ofActiveTextEditor()).toBeDefined();
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvZGRld2V5Ly5hdG9tL3BhY2thZ2VzL2xpbnRlci9zcGVjL2VkaXRvci1yZWdpc3RyeS1zcGVjLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUFBLFFBQUEsQ0FBUyxpQkFBVCxFQUE0QixTQUFBO0FBQzFCLFFBQUE7SUFBQSxjQUFBLEdBQWlCLE9BQUEsQ0FBUSx3QkFBUjtJQUNqQixjQUFBLEdBQWlCO0lBQ2pCLFVBQUEsQ0FBVyxTQUFBO01BQ1QsZUFBQSxDQUFnQixTQUFBO1FBQ2QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxxQkFBZixDQUFBO2VBQ0EsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLFNBQUEsR0FBWSxvQkFBaEM7TUFGYyxDQUFoQjs7UUFHQSxjQUFjLENBQUUsT0FBaEIsQ0FBQTs7YUFDQSxjQUFBLEdBQWlCLElBQUk7SUFMWixDQUFYO0lBT0EsUUFBQSxDQUFTLFVBQVQsRUFBcUIsU0FBQTtNQUNuQixFQUFBLENBQUcsNENBQUgsRUFBaUQsU0FBQTtRQUMvQyxNQUFBLENBQU8sU0FBQTtpQkFDTCxjQUFjLENBQUMsTUFBZixDQUFBO1FBREssQ0FBUCxDQUVBLENBQUMsT0FGRCxDQUFBO2VBR0EsTUFBQSxDQUFPLFNBQUE7aUJBQ0wsY0FBYyxDQUFDLE1BQWYsQ0FBc0IsQ0FBdEI7UUFESyxDQUFQLENBRUEsQ0FBQyxPQUZELENBQUE7TUFKK0MsQ0FBakQ7TUFPQSxFQUFBLENBQUcsa0NBQUgsRUFBdUMsU0FBQTtRQUNyQyxjQUFjLENBQUMsTUFBZixDQUFzQixJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FBdEI7ZUFDQSxNQUFBLENBQU8sY0FBYyxDQUFDLGFBQWEsQ0FBQyxJQUFwQyxDQUF5QyxDQUFDLElBQTFDLENBQStDLENBQS9DO01BRnFDLENBQXZDO2FBR0EsRUFBQSxDQUFHLGtFQUFILEVBQXVFLFNBQUE7UUFDckUsY0FBYyxD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Q0EsTUFBQSxDQUFPLFdBQVAsQ0FBbUIsQ0FBQyxJQUFwQixDQUF5QixDQUF6QjtNQUp5QyxDQUEzQzthQUtBLEVBQUEsQ0FBRyw0Q0FBSCxFQUFpRCxTQUFBO0FBQy9DLFlBQUE7UUFBQSxXQUFBLEdBQWM7UUFDZCxjQUFjLENBQUMsT0FBZixDQUF1QixTQUFBO2lCQUFHLEVBQUU7UUFBTCxDQUF2QjtRQUNBLGNBQWMsQ0FBQyxNQUFmLENBQXNCLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQUF0QjtlQUNBLGVBQUEsQ0FBZ0IsU0FBQTtpQkFDZCxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IscUJBQXBCLENBQTBDLENBQUMsSUFBM0MsQ0FBZ0QsU0FBQTtZQUM5QyxjQUFjLENBQUMsTUFBZixDQUFzQixJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FBdEI7bUJBQ0EsTUFBQSxDQUFPLFdBQVAsQ0FBbUIsQ0FBQyxJQUFwQixDQUF5QixDQUF6QjtVQUY4QyxDQUFoRDtRQURjLENBQWhCO01BSitDLENBQWpEO0lBTm9CLENBQXRCO1dBZUEsUUFBQSxDQUFTLHNCQUFULEVBQWlDLFNBQUE7TUFDL0IsRUFBQSxDQUFHLHVEQUFILEVBQTRELFNBQUE7ZUFDMUQsTUFBQSxDQUFPLGNBQWMsQ0FBQyxrQkFBZixDQUFBLENBQVAsQ0FBMkMsQ0FBQyxhQUE1QyxDQUFBO01BRDBELENBQTVEO2FBRUEsRUFBQSxDQUFHLHdEQUFILEVBQTZELFNBQUE7UUFDM0QsY0FBYyxDQUFDLE1BQWYsQ0FBc0IsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBLENBQXRCO2VBQ0EsTUFBQSxDQUFPLGNBQWMsQ0FBQyxrQkFBZixDQUFBLENBQVAsQ0FBMkMsQ0FBQyxXQUE1QyxDQUFBO01BRjJELENBQTdEO0lBSCtCLENBQWpDO0VBdEYwQixDQUE1QjtBQUFBIiwic291cmNlc0NvbnRlbnQiOlsiZGVzY3JpYmUgJ2VkaXRvci1yZWdpc3RyeScsIC0+XG4gIEVkaXRvclJlZ2lzdHJ5ID0gcmVxdWlyZSgnLi4vbGliL2VkaXRvci1yZWdpc3RyeScpXG4gIGVkaXRvclJlZ2lzdHJ5ID0gbnVsbFxuICBiZWZvcmVFYWNoIC0+XG4gICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICBhdG9tLndvcmtzcGFjZS5kZXN0cm95QWN0aXZlUGFuZUl0ZW0oKVxuICAgICAgYXRvbS53b3Jrc3BhY2Uub3BlbihfX2Rpcm5hbWUgKyAnL2ZpeHR1cmVzL2ZpbGUudHh0JylcbiAgICBlZGl0b3JSZWdpc3RyeT8uZGlzcG9zZSgpXG4gICAgZWRpdG9yUmVnaXN0cnkgPSBuZXcgRWRpdG9yUmVnaXN0cnlcblxuICBkZXNjcmliZSAnOjpjcmVhdGUnLCAtPlxuICAgIGl0ICdjcmllcyB3aGVuIGludmFsaWQgVGV4dEVkaXRvciB3YXMgcHJvdmlkZWQnLCAtPlxuICAgICAgZXhwZWN0IC0+XG4gICAgICAgIGVkaXRvclJlZ2lzdHJ5LmNyZWF0ZSgpXG4gICAgICAudG9UaHJvdygpXG4gICAgICBleHBlY3QgLT5cbiAgICAgICAgZWRpdG9yUmVnaXN0cnkuY3JlYXRlKDUpXG4gICAgICAudG9UaHJvdygpXG4gICAgaXQgXCJhZGRzIFRleHRFZGl0b3IgdG8gaXQncyByZWdpc3RyeVwiLCAtPlxuICAgICAgZWRpdG9yUmVnaXN0cnkuY3JlYXRlKGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKSlcbiAgICAgIGV4cGVjdChlZGl0b3JSZWdpc3RyeS5lZGl0b3JMaW50ZXJzLnNpemUpLnRvQmUoMSlcbiAgICBpdCAnYXV0b21hdGljYWxseSBjbGVhcnMgdGhlIFRleHRFZGl0b3IgZnJvbSByZWdpc3RyeSB3aGVuIGRlc3Ryb3llZCcsIC0+XG4gICAgICBlZGl0b3JSZWdpc3RyeS5jcmVhdGUoYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpKVxuICAgICAgYXRvbS53b3Jrc3BhY2UuZGVzdHJveUFjdGl2ZVBhbmVJdGVtKClcbiAgICAgIGV4cGVjdChlZGl0b3JSZWdpc3RyeS5lZGl0b3JMaW50ZXJzLnNpemUpLnRvQmUoMClcblxuICBkZXNjcmliZSAnOjpoYXMnLCAtPlxuICAgIGl0ICdyZXR1cm5zIHRoZSBzdGF0dXMgb2YgZXhpc3RlbmNlJywgLT5cbiAgICAgIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgICAgZXhwZWN0KGVkaXRvclJlZ2lzdHJ5LmhhcygxKSkudG9CZShmYWxzZSlcbiAgICAgIGV4cGVjdChlZGl0b3JSZWdpc3RyeS5oYXMoZmFsc2UpKS50b0JlKGZhbHNlKVxuICAgICAgZXhwZWN0KGVkaXRvclJlZ2lzdHJ5LmhhcyhbXSkpLnRvQmUoZmFsc2UpXG4gICAgICBleHBlY3QoZWRpdG9yUmVnaXN0cnkuaGFzKGVkaXRvcikpLnRvQmUoZmFsc2UpXG4gICAgICBlZGl0b3JSZWdpc3RyeS5jcmVhdGUoZWRpdG9yKVxuICAgICAgZXhwZWN0KGVkaXRvclJlZ2lzdHJ5LmhhcyhlZGl0b3IpKS50b0JlKHRydWUpXG4gICAgICBhdG9tLndvcmtzcGFjZS5kZXN0cm95QWN0aXZlUGFuZUl0ZW0oKVxuICAgICAgZXhwZWN0KGVkaXRvclJlZ2lzdHJ5LmhhcyhlZGl0b3IpKS50b0JlKGZhbHNlKVxuXG4gIGRlc2NyaWJlICc6OmZvckVhY2gnLCAtPlxuICAgIGl0ICdjYWxscyB0aGUgY2FsbGJhY2sgb25jZSBwZXIgZWRpdG9yTGludGVyJywgLT5cbiAgICAgIGVkaXRvclJlZ2lzdHJ5LmNyZWF0ZShhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCkpXG4gICAgICB0aW1lc0NhbGxlZCA9IDBcbiAgICAgIGVkaXRvclJlZ2lzdHJ5LmZvckVhY2ggLT4gKyt0aW1lc0NhbGxlZFxuICAgICAgZWRpdG9yUmVnaXN0cnkuZm9yRWFjaCAtPiArK3RpbWVzQ2FsbGVkXG4gICAgICBleHBlY3QodGltZXNDYWxsZWQpLnRvQmUoMilcblxuICBkZXNjcmliZSAnOjpvZlRleHRFZGl0b3InLCAtPlxuICAgIGl0ICdyZXR1cm5zIHVuZGVmaW5lZCB3aGVuIGludmFsaWQga2V5IGlzIHByb3ZpZGVkJywgLT5cbiAgICAgIGV4cGVjdChlZGl0b3JSZWdpc3RyeS5vZlRleHRFZGl0b3IobnVsbCkpLnRvQmVVbmRlZmluZWQoKVxuICAgICAgZXhwZWN0KGVkaXRvclJlZ2lzdHJ5Lm9mVGV4dEVkaXRvcigxKSkudG9CZVVuZGVmaW5lZCgpXG4gICAgICBleHBlY3QoZWRpdG9yUmVnaXN0cnkub2ZUZXh0RWRpdG9yKDUpKS50b0JlVW5kZWZpbmVkKClcbiAgICAgIGV4cGVjdChlZGl0b3JSZWdpc3RyeS5vZlRleHRFZGl0b3IoJ2FzZCcpKS50b0JlVW5kZWZpbmVkKClcbiAgICBpdCAncmV0dXJucyBlZGl0b3JMaW50ZXIgd2hlbiB2YWxpZCBrZXkgaXMgcHJvdmlkZWQnLCAtPlxuICAgICAgYWN0aXZlRWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgICBleHBlY3QoZWRpdG9yUmVnaXN0cnkub2ZUZXh0RWRpdG9yKGFjdGl2ZUVkaXRvcikpLnRvQmVVbmRlZmluZWQoKVxuICAgICAgZWRpdG9yUmVnaXN0cnkuY3JlYXRlKGFjdGl2ZUVkaXRvcilcbiAgICAgIGV4cGVjdChlZGl0b3JSZWdpc3RyeS5vZlRleHRFZGl0b3IoYWN0aXZlRWRpdG9yKSkudG9CZURlZmluZWQoKVxuXG4gIGRlc2NyaWJlICc6Om9mUGF0aCcsIC0+XG4gICAgaXQgJ3JldHVybnMgdW5kZWZpbmVkIHdoZW4gaW52YWxpZCBrZXkgaXMgcHJvdmlkZWQnLCAtPlxuICAgICAgZXhwZWN0KGVkaXRvclJlZ2lzdHJ5Lm9mUGF0aChudWxsKSkudG9CZVVuZGVmaW5lZCgpXG4gICAgICBleHBlY3QoZWRpdG9yUmVnaXN0cnkub2ZQYXRoKDEpKS50b0JlVW5kZWZpbmVkKClcbiAgICAgIGV4cGVjdChlZGl0b3JSZWdpc3RyeS5vZlBhdGgoNSkpLnRvQmVVbmRlZmluZWQoKVxuICAgICAgZXhwZWN0KGVkaXRvclJlZ2lzdHJ5Lm9mUGF0aCgnYXNkJykpLnRvQmVVbmRlZmluZWQoKVxuICAgIGl0ICdyZXR1cm5zIGVkaXRvckxpbnRlciB3aGVuIHZhbGlkIGtleSBpcyBwcm92aWRlZCcsIC0+XG4gICAgICBhY3RpdmVFZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICAgIGVkaXRvclBhdGggPSBhY3RpdmVFZGl0b3IuZ2V0UGF0aCgpXG4gICAgICBleHBlY3QoZWRpdG9yUmVnaXN0cnkub2ZQYXRoKGVkaXRvclBhdGgpKS50b0JlVW5kZWZpbmVkKClcbiAgICAgIGVkaXRvclJlZ2lzdHJ5LmNyZWF0ZShhY3RpdmVFZGl0b3IpXG4gICAgICBleHBlY3QoZWRpdG9yUmVnaXN0cnkub2ZQYXRoKGVkaXRvclBhdGgpKS50b0JlRGVmaW5lZCgpXG5cbiAgZGVzY3JpYmUgJzo6b2JzZXJ2ZScsIC0+XG4gICAgaXQgJ2NhbGxzIHdpdGggdGhlIGN1cnJlbnQgZWRpdG9yTGludGVycycsIC0+XG4gICAgICB0aW1lc0NhbGxlZCA9IDBcbiAgICAgIGVkaXRvclJlZ2lzdHJ5LmNyZWF0ZShhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCkpXG4gICAgICBlZGl0b3JSZWdpc3RyeS5vYnNlcnZlIC0+ICsrdGltZXNDYWxsZWRcbiAgICAgIGV4cGVjdCh0aW1lc0NhbGxlZCkudG9CZSgxKVxuICAgIGl0ICdjYWxscyBpbiB0aGUgZnV0dXJlIHdpdGggbmV3IGVkaXRvckxpbnRlcnMnLCAtPlxuICAgICAgdGltZXNDYWxsZWQgPSAwXG4gICAgICBlZGl0b3JSZWdpc3RyeS5vYnNlcnZlIC0+ICsrdGltZXNDYWxsZWRcbiAgICAgIGVkaXRvclJlZ2lzdHJ5LmNyZWF0ZShhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCkpXG4gICAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgICAgYXRvbS53b3Jrc3BhY2Uub3Blbignc29tZU5vbkV4aXN0aW5nRmlsZScpLnRoZW4gLT5cbiAgICAgICAgICBlZGl0b3JSZWdpc3RyeS5jcmVhdGUoYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpKVxuICAgICAgICAgIGV4cGVjdCh0aW1lc0NhbGxlZCkudG9CZSgyKVxuXG4gIGRlc2NyaWJlICc6Om9mQWN0aXZlVGV4dEVkaXRvcicsIC0+XG4gICAgaXQgJ3JldHVybnMgdW5kZWZpbmVkIGlmIGFjdGl2ZSBwYW5lIGlzIG5vdCBhIHRleHQgZWRpdG9yJywgLT5cbiAgICAgIGV4cGVjdChlZGl0b3JSZWdpc3RyeS5vZkFjdGl2ZVRleHRFZGl0b3IoKSkudG9CZVVuZGVmaW5lZCgpXG4gICAgaXQgJ3JldHVybnMgZWRpdG9yTGludGVyIHdoZW4gYWN0aXZlIHBhbmUgaXMgYSB0ZXh0IGVkaXRvcicsIC0+XG4gICAgICBlZGl0b3JSZWdpc3RyeS5jcmVhdGUoYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpKVxuICAgICAgZXhwZWN0KGVkaXRvclJlZ2lzdHJ5Lm9mQWN0aXZlVGV4dEVkaXRvcigpKS50b0JlRGVmaW5lZCgpXG4iXX0=
