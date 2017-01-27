(function() {
  var HighlightSelected, Point, Range, path, ref;

  path = require('path');

  ref = require('atom'), Range = ref.Range, Point = ref.Point;

  HighlightSelected = require('../lib/highlight-selected');

  describe("HighlightSelected", function() {
    var activationPromise, editor, editorElement, hasMinimap, hasStatusBar, highlightSelected, minimap, minimapHS, minimapModule, ref1, statusBar, workspaceElement;
    ref1 = [], activationPromise = ref1[0], workspaceElement = ref1[1], minimap = ref1[2], statusBar = ref1[3], editor = ref1[4], editorElement = ref1[5], highlightSelected = ref1[6], minimapHS = ref1[7], minimapModule = ref1[8];
    hasMinimap = atom.packages.getAvailablePackageNames().indexOf('minimap') !== -1 && atom.packages.getAvailablePackageNames().indexOf('minimap-highlight-selected') !== -1;
    hasStatusBar = atom.packages.getAvailablePackageNames().indexOf('status-bar') !== -1;
    beforeEach(function() {
      workspaceElement = atom.views.getView(atom.workspace);
      return atom.project.setPaths([path.join(__dirname, 'fixtures')]);
    });
    afterEach(function() {
      highlightSelected.deactivate();
      if (minimapHS != null) {
        minimapHS.deactivate();
      }
      return minimapModule != null ? minimapModule.deactivate() : void 0;
    });
    describe("when opening a coffee file", function() {
      beforeEach(function() {
        waitsForPromise(function() {
          return atom.packages.activatePackage('status-bar').then(function(pack) {
            return statusBar = workspaceElement.querySelector("status-bar");
          });
        });
        waitsForPromise(function() {
          return atom.packages.activatePackage('highlight-selected').then(function(arg) {
            var mainModule;
            mainModule = arg.mainModule;
            return highlightSelected = mainModule;
          });
        });
        waitsForPromise(function() {
          return atom.workspace.open('sample.coffee').then(function(editor) {
            return editor;
          }, function(error) {
            throw error.stack;
          });
        });
        return runs(function() {
          jasmine.attachToDOM(workspaceElement);
          editor = atom.workspace.getActiveTextEditor();
          return editorElement = atom.views.getView(editor);
        });
      });
      describe("updates debounce when config is changed", function() {
        beforeEach(function() {
          spyOn(highlightSelected.areaView, 'debouncedHandleSelection');
          return atom.config.set('highlight-selected.timeout', 20000);
        });
        return it('calls createDebouce', function() {
          return expect(highlightSelected.areaView.debouncedHandleSelection).toHaveBeenCalled();
        });
      });
      describe("when a whole word is selected", function() {
        beforeEach(function() {
          var range;
          range = new Range(new Point(8, 2), new Point(8, 8));
          editor.setSelectedBufferRange(range);
          return advanceClock(20000);
        });
        it("adds the decoration to all words", function() {
          return expect(editorElement.querySelectorAll('.highlight-selected .region')).toHaveLength(4);
        });
        it("creates the highlight selected status bar element", function() {
          expect(workspaceElement.querySelector('status-bar')).toExist();
          return expect(workspaceElement.querySelector('.highlight-selected-status')).toExist();
        });
        it("updates the status bar with highlights number", function() {
          var content;
          content = workspaceElement.querySelector('.highlight-selected-status').innerHTML;
          return expect(content).toBe('Highlighted: 4');
        });
        return describe("when the status bar is disabled", function() {
          beforeEach(function() {
            return atom.config.set('highlight-selected.showInStatusBar', false);
          });
          return it("highlight isn't attached", function() {
            expect(workspaceElement.querySelector('status-bar')).toExist();
            return expect(workspaceElement.querySelector('.highlight-selected-status')).not.toExist();
          });
        });
      });
      describe("when hide highlight on selected word is enabled", function() {
        beforeEach(function() {
          return atom.config.set('highlight-selected.hideHighlightOnSelectedWord', true);
        });
        describe("when a single line is selected", function() {
          beforeEach(function() {
            var range;
            range = new Range(new Point(8, 2), new Point(8, 8));
            editor.setSelectedBufferRange(range);
            return advanceClock(20000);
          });
          return it("adds the decoration only no selected words", function() {
            return expect(editorElement.querySelectorAll('.highlight-selected .region')).toHaveLength(3);
          });
        });
        return describe("when multi lines are selected", function() {
          beforeEach(function() {
            var range1, range2;
            range1 = new Range(new Point(8, 2), new Point(8, 8));
            range2 = new Range(new Point(9, 2), new Point(9, 8));
            editor.setSelectedBufferRanges([range1, range2]);
            return advanceClock(20000);
          });
          return it("adds the decoration only no selected words", function() {
            return expect(editorElement.querySelectorAll('.highlight-selected .region')).toHaveLength(2);
          });
        });
      });
      describe("leading whitespace doesn't get used", function() {
        beforeEach(function() {
          var range;
          range = new Range(new Point(8, 0), new Point(8, 8));
          editor.setSelectedBufferRange(range);
          return advanceClock(20000);
        });
        return it("doesn't add regions", function() {
          return expect(editorElement.querySelectorAll('.highlight-selected .region')).toHaveLength(0);
        });
      });
      describe("will highlight non whole words", function() {
        beforeEach(function() {
          var range;
          atom.config.set('highlight-selected.onlyHighlightWholeWords', false);
          range = new Range(new Point(10, 13), new Point(10, 17));
          editor.setSelectedBufferRange(range);
          return advanceClock(20000);
        });
        return it("does add regions", function() {
          return expect(editorElement.querySelectorAll('.highlight-selected .region')).toHaveLength(3);
        });
      });
      describe("will not highlight non whole words", function() {
        beforeEach(function() {
          var range;
          atom.config.set('highlight-selected.onlyHighlightWholeWords', true);
          range = new Range(new Point(10, 13), new Point(10, 17));
          editor.setSelectedBufferRange(range);
          return advanceClock(20000);
        });
        return it("does add regions", function() {
          return expect(editorElement.querySelectorAll('.highlight-selected .region')).toHaveLength(2);
        });
      });
      describe("will not highlight less than minimum length", function() {
        beforeEach(function() {
          var range;
          atom.config.set('highlight-selected.minimumLength', 7);
          range = new Range(new Point(4, 0), new Point(4, 6));
          editor.setSelectedBufferRange(range);
          return advanceClock(20000);
        });
        return it("doesn't add regions", function() {
          return expect(editorElement.querySelectorAll('.highlight-selected .region')).toHaveLength(0);
        });
      });
      describe("will not highlight words in different case", function() {
        beforeEach(function() {
          var range;
          range = new Range(new Point(4, 0), new Point(4, 6));
          editor.setSelectedBufferRange(range);
          return advanceClock(20000);
        });
        return it("does add regions", function() {
          return expect(editorElement.querySelectorAll('.highlight-selected .region')).toHaveLength(2);
        });
      });
      return describe("will highlight words in different case", function() {
        beforeEach(function() {
          var range;
          atom.config.set('highlight-selected.ignoreCase', true);
          range = new Range(new Point(4, 0), new Point(4, 6));
          editor.setSelectedBufferRange(range);
          return advanceClock(20000);
        });
        it("does add regions", function() {
          return expect(editorElement.querySelectorAll('.highlight-selected .region')).toHaveLength(5);
        });
        describe("adds background to selected", function() {
          beforeEach(function() {
            var range;
            atom.config.set('highlight-selected.highlightBackground', true);
            range = new Range(new Point(8, 2), new Point(8, 8));
            editor.setSelectedBufferRange(range);
            return advanceClock(20000);
          });
          return it("adds the background to all highlights", function() {
            return expect(editorElement.querySelectorAll('.highlight-selected.background .region')).toHaveLength(4);
          });
        });
        return describe("adds light theme to selected", function() {
          beforeEach(function() {
            var range;
            atom.config.set('highlight-selected.lightTheme', true);
            range = new Range(new Point(8, 2), new Point(8, 8));
            editor.setSelectedBufferRange(range);
            return advanceClock(20000);
          });
          return it("adds the background to all highlights", function() {
            return expect(editorElement.querySelectorAll('.highlight-selected.light-theme .region')).toHaveLength(4);
          });
        });
      });
    });
    return describe("when opening a php file", function() {
      beforeEach(function() {
        waitsForPromise(function() {
          return atom.packages.activatePackage('highlight-selected').then(function(arg) {
            var mainModule;
            mainModule = arg.mainModule;
            return highlightSelected = mainModule;
          });
        });
        waitsForPromise(function() {
          return atom.workspace.open('sample.php').then(function(editor) {
            return editor;
          }, function(error) {
            throw error.stack;
          });
        });
        waitsForPromise(function() {
          return atom.packages.activatePackage('language-php');
        });
        return runs(function() {
          jasmine.attachToDOM(workspaceElement);
          editor = atom.workspace.getActiveTextEditor();
          return editorElement = atom.views.getView(editor);
        });
      });
      describe("being able to highlight variables with '$'", function() {
        beforeEach(function() {
          var range;
          atom.config.set('highlight-selected.onlyHighlightWholeWords', true);
          range = new Range(new Point(1, 2), new Point(1, 7));
          editor.setSelectedBufferRange(range);
          return advanceClock(20000);
        });
        return it("finds 3 regions", function() {
          return expect(editorElement.querySelectorAll('.highlight-selected .region')).toHaveLength(3);
        });
      });
      return describe("being able to highlight variables when not selecting '$'", function() {
        beforeEach(function() {
          var range;
          atom.config.set('highlight-selected.onlyHighlightWholeWords', true);
          range = new Range(new Point(1, 3), new Point(1, 7));
          editor.setSelectedBufferRange(range);
          return advanceClock(20000);
        });
        return it("finds 4 regions", function() {
          return expect(editorElement.querySelectorAll('.highlight-selected .region')).toHaveLength(4);
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvZGRld2V5Ly5hdG9tL3BhY2thZ2VzL2hpZ2hsaWdodC1zZWxlY3RlZC9zcGVjL2hpZ2hsaWdodC1zZWxlY3RlZC1zcGVjLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUNQLE1BQWlCLE9BQUEsQ0FBUSxNQUFSLENBQWpCLEVBQUMsaUJBQUQsRUFBUTs7RUFDUixpQkFBQSxHQUFvQixPQUFBLENBQVEsMkJBQVI7O0VBSXBCLFFBQUEsQ0FBUyxtQkFBVCxFQUE4QixTQUFBO0FBQzVCLFFBQUE7SUFBQSxPQUN1RSxFQUR2RSxFQUFDLDJCQUFELEVBQW9CLDBCQUFwQixFQUFzQyxpQkFBdEMsRUFBK0MsbUJBQS9DLEVBQ0MsZ0JBREQsRUFDUyx1QkFEVCxFQUN3QiwyQkFEeEIsRUFDMkMsbUJBRDNDLEVBQ3NEO0lBRXRELFVBQUEsR0FBYSxJQUFJLENBQUMsUUFBUSxDQUFDLHdCQUFkLENBQUEsQ0FDWCxDQUFDLE9BRFUsQ0FDRixTQURFLENBQUEsS0FDYyxDQUFDLENBRGYsSUFDcUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyx3QkFBZCxDQUFBLENBQ2hDLENBQUMsT0FEK0IsQ0FDdkIsNEJBRHVCLENBQUEsS0FDWSxDQUFDO0lBRS9DLFlBQUEsR0FBZSxJQUFJLENBQUMsUUFBUSxDQUFDLHdCQUFkLENBQUEsQ0FDYixDQUFDLE9BRFksQ0FDSixZQURJLENBQUEsS0FDZSxDQUFDO0lBRS9CLFVBQUEsQ0FBVyxTQUFBO01BQ1QsZ0JBQUEsR0FBbUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLElBQUksQ0FBQyxTQUF4QjthQUNuQixJQUFJLENBQUMsT0FBTyxDQUFDLFFBQWIsQ0FBc0IsQ0FBQyxJQUFJLENBQUMsSUFBTCxDQUFVLFNBQVYsRUFBcUIsVUFBckIsQ0FBRCxDQUF0QjtJQUZTLENBQVg7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LEVBQThELElBQTlEO1VBQ0EsS0FBQSxHQUFZLElBQUEsS0FBQSxDQUFVLElBQUEsS0FBQSxDQUFNLENBQU4sRUFBUyxDQUFULENBQVYsRUFBMkIsSUFBQSxLQUFBLENBQU0sQ0FBTixFQUFTLENBQVQsQ0FBM0I7VUFDWixNQUFNLENBQUMsc0JBQVAsQ0FBOEIsS0FBOUI7aUJBQ0EsWUFBQSxDQUFhLEtBQWI7UUFKUyxDQUFYO2VBTUEsRUFBQSxDQUFHLGlCQUFILEVBQXNCLFNBQUE7aUJBQ3BCLE1BQUEsQ0FBTyxhQUFhLENBQUMsZ0JBQWQsQ0FDTCw2QkFESyxDQUFQLENBQ2lDLENBQUMsWUFEbEMsQ0FDK0MsQ0FEL0M7UUFEb0IsQ0FBdEI7TUFQcUQsQ0FBdkQ7YUFXQSxRQUFBLENBQVMsMERBQVQsRUFBcUUsU0FBQTtRQUNuRSxVQUFBLENBQVcsU0FBQTtBQUNULGNBQUE7VUFBQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsNENBQWhCLEVBQThELElBQTlEO1VBQ0EsS0FBQSxHQUFZLElBQUEsS0FBQSxDQUFVLElBQUEsS0FBQSxDQUFNLENBQU4sRUFBUyxDQUFULENBQVYsRUFBMkIsSUFBQSxLQUFBLENBQU0sQ0FBTixFQUFTLENBQVQsQ0FBM0I7VUFDWixNQUFNLENBQUMsc0JBQVAsQ0FBOEIsS0FBOUI7aUJBQ0EsWUFBQSxDQUFhLEtBQWI7UUFKUyxDQUFYO2VBTUEsRUFBQSxDQUFHLGlCQUFILEVBQXNCLFNBQUE7aUJBQ3BCLE1BQUEsQ0FBTyxhQUFhLENBQUMsZ0JBQWQsQ0FDTCw2QkFESyxDQUFQLENBQ2lDLENBQUMsWUFEbEMsQ0FDK0MsQ0FEL0M7UUFEb0IsQ0FBdEI7TUFQbUUsQ0FBckU7SUFqQ2tDLENBQXBDO0VBM040QixDQUE5QjtBQU5BIiwic291cmNlc0NvbnRlbnQiOlsicGF0aCA9IHJlcXVpcmUgJ3BhdGgnXG57UmFuZ2UsIFBvaW50fSA9IHJlcXVpcmUgJ2F0b20nXG5IaWdobGlnaHRTZWxlY3RlZCA9IHJlcXVpcmUgJy4uL2xpYi9oaWdobGlnaHQtc2VsZWN0ZWQnXG5cbiMgVXNlIHRoZSBjb21tYW5kIGB3aW5kb3c6cnVuLXBhY2thZ2Utc3BlY3NgIChjbWQtYWx0LWN0cmwtcCkgdG8gcnVuIHNwZWNzLlxuXG5kZXNjcmliZSBcIkhpZ2hsaWdodFNlbGVjdGVkXCIsIC0+XG4gIFthY3RpdmF0aW9uUHJvbWlzZSwgd29ya3NwYWNlRWxlbWVudCwgbWluaW1hcCwgc3RhdHVzQmFyLFxuICAgZWRpdG9yLCBlZGl0b3JFbGVtZW50LCBoaWdobGlnaHRTZWxlY3RlZCwgbWluaW1hcEhTLCBtaW5pbWFwTW9kdWxlXSA9IFtdXG5cbiAgaGFzTWluaW1hcCA9IGF0b20ucGFja2FnZXMuZ2V0QXZhaWxhYmxlUGFja2FnZU5hbWVzKClcbiAgICAuaW5kZXhPZignbWluaW1hcCcpIGlzbnQgLTEgYW5kIGF0b20ucGFja2FnZXMuZ2V0QXZhaWxhYmxlUGFja2FnZU5hbWVzKClcbiAgICAuaW5kZXhPZignbWluaW1hcC1oaWdobGlnaHQtc2VsZWN0ZWQnKSBpc250IC0xXG5cbiAgaGFzU3RhdHVzQmFyID0gYXRvbS5wYWNrYWdlcy5nZXRBdmFpbGFibGVQYWNrYWdlTmFtZXMoKVxuICAgIC5pbmRleE9mKCdzdGF0dXMtYmFyJykgaXNudCAtMVxuXG4gIGJlZm9yZUVhY2ggLT5cbiAgICB3b3Jrc3BhY2VFbGVtZW50ID0gYXRvbS52aWV3cy5nZXRWaWV3KGF0b20ud29ya3NwYWNlKVxuICAgIGF0b20ucHJvamVjdC5zZXRQYXRocyhbcGF0aC5qb2luKF9fZGlybmFtZSwgJ2ZpeHR1cmVzJyldKVxuXG4gIGFmdGVyRWFjaCAtPlxuICAgIGhpZ2hsaWdodFNlbGVjdGVkLmRlYWN0aXZhdGUoKVxuICAgIG1pbmltYXBIUz8uZGVhY3RpdmF0ZSgpXG4gICAgbWluaW1hcE1vZHVsZT8uZGVhY3RpdmF0ZSgpXG5cbiAgZGVzY3JpYmUgXCJ3aGVuIG9wZW5pbmcgYSBjb2ZmZWUgZmlsZVwiLCAtPlxuICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgICBhdG9tLnBhY2thZ2VzLmFjdGl2YXRlUGFja2FnZSgnc3RhdHVzLWJhcicpLnRoZW4gKHBhY2spIC0+XG4gICAgICAgICAgc3RhdHVzQmFyID0gd29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKFwic3RhdHVzLWJhclwiKVxuXG4gICAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgICAgYXRvbS5wYWNrYWdlcy5hY3RpdmF0ZVBhY2thZ2UoJ2hpZ2hsaWdodC1zZWxlY3RlZCcpXG4gICAgICAgICAgLnRoZW4gKHttYWluTW9kdWxlfSkgLT5cbiAgICAgICAgICAgIGhpZ2hsaWdodFNlbGVjdGVkID0gbWFpbk1vZHVsZVxuXG4gICAgICAjIERpc2FibGVkIHVudGlsIG1pbmltYXAtaGlnaGxpZ2h0LXNlbGVjdGVkIGJyYW5jaFxuICAgICAgIyBmZWF0dXJlLWhpZ2hsaWdodC1zZWxlY3RlZC1hcGkgaXMgbWVyZ2VkIGluXG4gICAgICAjIGlmIGhhc01pbmltYXBcbiAgICAgICMgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgICMgICAgIGF0b20ucGFja2FnZXMuYWN0aXZhdGVQYWNrYWdlKCdtaW5pbWFwJykudGhlbiAoe21haW5Nb2R1bGV9KSAtPlxuICAgICAgIyAgICAgICBtaW5pbWFwTW9kdWxlID0gbWFpbk1vZHVsZVxuICAgICAgIyAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgIyAgICAgYXRvbS5wYWNrYWdlcy5hY3RpdmF0ZVBhY2thZ2UoJ21pbmltYXAtaGlnaGxpZ2h0LXNlbGVjdGVkJylcbiAgICAgICMgICAgICAgLnRoZW4gKHttYWluTW9kdWxlfSkgLT5cbiAgICAgICMgICAgICAgICBtaW5pbWFwSFMgPSBtYWluTW9kdWxlXG5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgICBhdG9tLndvcmtzcGFjZS5vcGVuKCdzYW1wbGUuY29mZmVlJykudGhlbihcbiAgICAgICAgICAoZWRpdG9yKSAtPiBlZGl0b3JcbiAgICAgICAgICAsXG4gICAgICAgICAgKGVycm9yKSAtPiB0aHJvdyhlcnJvci5zdGFjaylcbiAgICAgICAgKVxuXG4gICAgICBydW5zIC0+XG4gICAgICAgIGphc21pbmUuYXR0YWNoVG9ET00od29ya3NwYWNlRWxlbWVudClcbiAgICAgICAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgICAgIGVkaXRvckVsZW1lbnQgPSBhdG9tLnZpZXdzLmdldFZpZXcoZWRpdG9yKVxuXG4gICAgZGVzY3JpYmUgXCJ1cGRhdGVzIGRlYm91bmNlIHdoZW4gY29uZmlnIGlzIGNoYW5nZWRcIiwgLT5cbiAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgc3B5T24oaGlnaGxpZ2h0U2VsZWN0ZWQuYXJlYVZpZXcsICdkZWJvdW5jZWRIYW5kbGVTZWxlY3Rpb24nKVxuICAgICAgICBhdG9tLmNvbmZpZy5zZXQoJ2hpZ2hsaWdodC1zZWxlY3RlZC50aW1lb3V0JywgMjAwMDApXG5cbiAgICAgIGl0ICdjYWxscyBjcmVhdGVEZWJvdWNlJywgLT5cbiAgICAgICAgZXhwZWN0KGhpZ2hsaWdodFNlbGVjdGVkLmFyZWFWaWV3LmRlYm91bmNlZEhhbmRsZVNlbGVjdGlvbilcbiAgICAgICAgICAudG9IYXZlQmVlbkNhbGxlZCgpXG5cbiAgICBkZXNjcmliZSBcIndoZW4gYSB3aG9sZSB3b3JkIGlzIHNlbGVjdGVkXCIsIC0+XG4gICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgIHJhbmdlID0gbmV3IFJhbmdlKG5ldyBQb2ludCg4LCAyKSwgbmV3IFBvaW50KDgsIDgpKVxuICAgICAgICBlZGl0b3Iuc2V0U2VsZWN0ZWRCdWZmZXJSYW5nZShyYW5nZSlcbiAgICAgICAgYWR2YW5jZUNsb2NrKDIwMDAwKVxuXG4gICAgICBpdCBcImFkZHMgdGhlIGRlY29yYXRpb24gdG8gYWxsIHdvcmRzXCIsIC0+XG4gICAgICAgIGV4cGVjdChlZGl0b3JFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXG4gICAgICAgICAgJy5oaWdobGlnaHQtc2VsZWN0ZWQgLnJlZ2lvbicpKS50b0hhdmVMZW5ndGgoNClcblxuICAgICAgaXQgXCJjcmVhdGVzIHRoZSBoaWdobGlnaHQgc2VsZWN0ZWQgc3RhdHVzIGJhciBlbGVtZW50XCIsIC0+XG4gICAgICAgIGV4cGVjdCh3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ3N0YXR1cy1iYXInKSkudG9FeGlzdCgpXG4gICAgICAgIGV4cGVjdCh3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oaWdobGlnaHQtc2VsZWN0ZWQtc3RhdHVzJykpXG4gICAgICAgICAgLnRvRXhpc3QoKVxuXG4gICAgICBpdCBcInVwZGF0ZXMgdGhlIHN0YXR1cyBiYXIgd2l0aCBoaWdobGlnaHRzIG51bWJlclwiLCAtPlxuICAgICAgICBjb250ZW50ID0gd29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKFxuICAgICAgICAgICcuaGlnaGxpZ2h0LXNlbGVjdGVkLXN0YXR1cycpLmlubmVySFRNTFxuICAgICAgICBleHBlY3QoY29udGVudCkudG9CZSgnSGlnaGxpZ2h0ZWQ6IDQnKVxuXG4gICAgICBkZXNjcmliZSBcIndoZW4gdGhlIHN0YXR1cyBiYXIgaXMgZGlzYWJsZWRcIiwgLT5cbiAgICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICAgIGF0b20uY29uZmlnLnNldCgnaGlnaGxpZ2h0LXNlbGVjdGVkLnNob3dJblN0YXR1c0JhcicsIGZhbHNlKVxuXG4gICAgICAgIGl0IFwiaGlnaGxpZ2h0IGlzbid0IGF0dGFjaGVkXCIsIC0+XG4gICAgICAgICAgZXhwZWN0KHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3Rvcignc3RhdHVzLWJhcicpKS50b0V4aXN0KClcbiAgICAgICAgICBleHBlY3Qod29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuaGlnaGxpZ2h0LXNlbGVjdGVkLXN0YXR1cycpKVxuICAgICAgICAgICAgLm5vdC50b0V4aXN0KClcblxuICAgIGRlc2NyaWJlIFwid2hlbiBoaWRlIGhpZ2hsaWdodCBvbiBzZWxlY3RlZCB3b3JkIGlzIGVuYWJsZWRcIiwgLT5cbiAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgYXRvbS5jb25maWcuc2V0KCdoaWdobGlnaHQtc2VsZWN0ZWQuaGlkZUhpZ2hsaWdodE9uU2VsZWN0ZWRXb3JkJywgdHJ1ZSlcblxuICAgICAgZGVzY3JpYmUgXCJ3aGVuIGEgc2luZ2xlIGxpbmUgaXMgc2VsZWN0ZWRcIiwgLT5cbiAgICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICAgIHJhbmdlID0gbmV3IFJhbmdlKG5ldyBQb2ludCg4LCAyKSwgbmV3IFBvaW50KDgsIDgpKVxuICAgICAgICAgIGVkaXRvci5zZXRTZWxlY3RlZEJ1ZmZlclJhbmdlKHJhbmdlKVxuICAgICAgICAgIGFkdmFuY2VDbG9jaygyMDAwMClcblxuICAgICAgICBpdCBcImFkZHMgdGhlIGRlY29yYXRpb24gb25seSBubyBzZWxlY3RlZCB3b3Jkc1wiLCAtPlxuICAgICAgICAgIGV4cGVjdChlZGl0b3JFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXG4gICAgICAgICAgICAnLmhpZ2hsaWdodC1zZWxlY3RlZCAucmVnaW9uJykpLnRvSGF2ZUxlbmd0aCgzKVxuXG4gICAgICBkZXNjcmliZSBcIndoZW4gbXVsdGkgbGluZXMgYXJlIHNlbGVjdGVkXCIsIC0+XG4gICAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgICByYW5nZTEgPSBuZXcgUmFuZ2UobmV3IFBvaW50KDgsIDIpLCBuZXcgUG9pbnQoOCwgOCkpXG4gICAgICAgICAgcmFuZ2UyID0gbmV3IFJhbmdlKG5ldyBQb2ludCg5LCAyKSwgbmV3IFBvaW50KDksIDgpKVxuICAgICAgICAgIGVkaXRvci5zZXRTZWxlY3RlZEJ1ZmZlclJhbmdlcyhbcmFuZ2UxLCByYW5nZTJdKVxuICAgICAgICAgIGFkdmFuY2VDbG9jaygyMDAwMClcblxuICAgICAgICBpdCBcImFkZHMgdGhlIGRlY29yYXRpb24gb25seSBubyBzZWxlY3RlZCB3b3Jkc1wiLCAtPlxuICAgICAgICAgIGV4cGVjdChlZGl0b3JFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXG4gICAgICAgICAgICAnLmhpZ2hsaWdodC1zZWxlY3RlZCAucmVnaW9uJykpLnRvSGF2ZUxlbmd0aCgyKVxuXG4gICAgZGVzY3JpYmUgXCJsZWFkaW5nIHdoaXRlc3BhY2UgZG9lc24ndCBnZXQgdXNlZFwiLCAtPlxuICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICByYW5nZSA9IG5ldyBSYW5nZShuZXcgUG9pbnQoOCwgMCksIG5ldyBQb2ludCg4LCA4KSlcbiAgICAgICAgZWRpdG9yLnNldFNlbGVjdGVkQnVmZmVyUmFuZ2UocmFuZ2UpXG4gICAgICAgIGFkdmFuY2VDbG9jaygyMDAwMClcblxuICAgICAgaXQgXCJkb2Vzbid0IGFkZCByZWdpb25zXCIsIC0+XG4gICAgICAgIGV4cGVjdChlZGl0b3JFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXG4gICAgICAgICAgJy5oaWdobGlnaHQtc2VsZWN0ZWQgLnJlZ2lvbicpKS50b0hhdmVMZW5ndGgoMClcblxuICAgIGRlc2NyaWJlIFwid2lsbCBoaWdobGlnaHQgbm9uIHdob2xlIHdvcmRzXCIsIC0+XG4gICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgIGF0b20uY29uZmlnLnNldCgnaGlnaGxpZ2h0LXNlbGVjdGVkLm9ubHlIaWdobGlnaHRXaG9sZVdvcmRzJywgZmFsc2UpXG4gICAgICAgIHJhbmdlID0gbmV3IFJhbmdlKG5ldyBQb2ludCgxMCwgMTMpLCBuZXcgUG9pbnQoMTAsIDE3KSlcbiAgICAgICAgZWRpdG9yLnNldFNlbGVjdGVkQnVmZmVyUmFuZ2UocmFuZ2UpXG4gICAgICAgIGFkdmFuY2VDbG9jaygyMDAwMClcblxuICAgICAgaXQgXCJkb2VzIGFkZCByZWdpb25zXCIsIC0+XG4gICAgICAgIGV4cGVjdChlZGl0b3JFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXG4gICAgICAgICAgJy5oaWdobGlnaHQtc2VsZWN0ZWQgLnJlZ2lvbicpKS50b0hhdmVMZW5ndGgoMylcblxuICAgIGRlc2NyaWJlIFwid2lsbCBub3QgaGlnaGxpZ2h0IG5vbiB3aG9sZSB3b3Jkc1wiLCAtPlxuICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICBhdG9tLmNvbmZpZy5zZXQoJ2hpZ2hsaWdodC1zZWxlY3RlZC5vbmx5SGlnaGxpZ2h0V2hvbGVXb3JkcycsIHRydWUpXG4gICAgICAgIHJhbmdlID0gbmV3IFJhbmdlKG5ldyBQb2ludCgxMCwgMTMpLCBuZXcgUG9pbnQoMTAsIDE3KSlcbiAgICAgICAgZWRpdG9yLnNldFNlbGVjdGVkQnVmZmVyUmFuZ2UocmFuZ2UpXG4gICAgICAgIGFkdmFuY2VDbG9jaygyMDAwMClcblxuICAgICAgaXQgXCJkb2VzIGFkZCByZWdpb25zXCIsIC0+XG4gICAgICAgIGV4cGVjdChlZGl0b3JFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXG4gICAgICAgICAgJy5oaWdobGlnaHQtc2VsZWN0ZWQgLnJlZ2lvbicpKS50b0hhdmVMZW5ndGgoMilcblxuICAgIGRlc2NyaWJlIFwid2lsbCBub3QgaGlnaGxpZ2h0IGxlc3MgdGhhbiBtaW5pbXVtIGxlbmd0aFwiLCAtPlxuICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICBhdG9tLmNvbmZpZy5zZXQoJ2hpZ2hsaWdodC1zZWxlY3RlZC5taW5pbXVtTGVuZ3RoJywgNylcbiAgICAgICAgcmFuZ2UgPSBuZXcgUmFuZ2UobmV3IFBvaW50KDQsIDApLCBuZXcgUG9pbnQoNCwgNikpXG4gICAgICAgIGVkaXRvci5zZXRTZWxlY3RlZEJ1ZmZlclJhbmdlKHJhbmdlKVxuICAgICAgICBhZHZhbmNlQ2xvY2soMjAwMDApXG5cbiAgICAgIGl0IFwiZG9lc24ndCBhZGQgcmVnaW9uc1wiLCAtPlxuICAgICAgICBleHBlY3QoZWRpdG9yRWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKFxuICAgICAgICAgICcuaGlnaGxpZ2h0LXNlbGVjdGVkIC5yZWdpb24nKSkudG9IYXZlTGVuZ3RoKDApXG5cbiAgICBkZXNjcmliZSBcIndpbGwgbm90IGhpZ2hsaWdodCB3b3JkcyBpbiBkaWZmZXJlbnQgY2FzZVwiLCAtPlxuICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICByYW5nZSA9IG5ldyBSYW5nZShuZXcgUG9pbnQoNCwgMCksIG5ldyBQb2ludCg0LCA2KSlcbiAgICAgICAgZWRpdG9yLnNldFNlbGVjdGVkQnVmZmVyUmFuZ2UocmFuZ2UpXG4gICAgICAgIGFkdmFuY2VDbG9jaygyMDAwMClcblxuICAgICAgaXQgXCJkb2VzIGFkZCByZWdpb25zXCIsIC0+XG4gICAgICAgIGV4cGVjdChlZGl0b3JFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1xuICAgICAgICAgIC5oaWdobGlnaHQtc2VsZWN0ZWQgLnJlZ2lvbicpKS50b0hhdmVMZW5ndGgoMilcblxuICAgIGRlc2NyaWJlIFwid2lsbCBoaWdobGlnaHQgd29yZHMgaW4gZGlmZmVyZW50IGNhc2VcIiwgLT5cbiAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgYXRvbS5jb25maWcuc2V0KCdoaWdobGlnaHQtc2VsZWN0ZWQuaWdub3JlQ2FzZScsIHRydWUpXG4gICAgICAgIHJhbmdlID0gbmV3IFJhbmdlKG5ldyBQb2ludCg0LCAwKSwgbmV3IFBvaW50KDQsIDYpKVxuICAgICAgICBlZGl0b3Iuc2V0U2VsZWN0ZWRCdWZmZXJSYW5nZShyYW5nZSlcbiAgICAgICAgYWR2YW5jZUNsb2NrKDIwMDAwKVxuXG4gICAgICBpdCBcImRvZXMgYWRkIHJlZ2lvbnNcIiwgLT5cbiAgICAgICAgZXhwZWN0KGVkaXRvckVsZW1lbnQucXVlcnlTZWxlY3RvckFsbChcbiAgICAgICAgICAnLmhpZ2hsaWdodC1zZWxlY3RlZCAucmVnaW9uJykpLnRvSGF2ZUxlbmd0aCg1KVxuXG4gICAgICBkZXNjcmliZSBcImFkZHMgYmFja2dyb3VuZCB0byBzZWxlY3RlZFwiLCAtPlxuICAgICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgICAgYXRvbS5jb25maWcuc2V0KCdoaWdobGlnaHQtc2VsZWN0ZWQuaGlnaGxpZ2h0QmFja2dyb3VuZCcsIHRydWUpXG4gICAgICAgICAgcmFuZ2UgPSBuZXcgUmFuZ2UobmV3IFBvaW50KDgsIDIpLCBuZXcgUG9pbnQoOCwgOCkpXG4gICAgICAgICAgZWRpdG9yLnNldFNlbGVjdGVkQnVmZmVyUmFuZ2UocmFuZ2UpXG4gICAgICAgICAgYWR2YW5jZUNsb2NrKDIwMDAwKVxuXG4gICAgICAgIGl0IFwiYWRkcyB0aGUgYmFja2dyb3VuZCB0byBhbGwgaGlnaGxpZ2h0c1wiLCAtPlxuICAgICAgICAgIGV4cGVjdChlZGl0b3JFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5oaWdobGlnaHQtc2VsZWN0ZWQuYmFja2dyb3VuZFxuICAgICAgICAgICAgLnJlZ2lvbicpKS50b0hhdmVMZW5ndGgoNClcblxuICAgICAgZGVzY3JpYmUgXCJhZGRzIGxpZ2h0IHRoZW1lIHRvIHNlbGVjdGVkXCIsIC0+XG4gICAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgICBhdG9tLmNvbmZpZy5zZXQoJ2hpZ2hsaWdodC1zZWxlY3RlZC5saWdodFRoZW1lJywgdHJ1ZSlcbiAgICAgICAgICByYW5nZSA9IG5ldyBSYW5nZShuZXcgUG9pbnQoOCwgMiksIG5ldyBQb2ludCg4LCA4KSlcbiAgICAgICAgICBlZGl0b3Iuc2V0U2VsZWN0ZWRCdWZmZXJSYW5nZShyYW5nZSlcbiAgICAgICAgICBhZHZhbmNlQ2xvY2soMjAwMDApXG5cbiAgICAgICAgaXQgXCJhZGRzIHRoZSBiYWNrZ3JvdW5kIHRvIGFsbCBoaWdobGlnaHRzXCIsIC0+XG4gICAgICAgICAgZXhwZWN0KGVkaXRvckVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmhpZ2hsaWdodC1zZWxlY3RlZC5saWdodC10aGVtZVxuICAgICAgICAgICAgLnJlZ2lvbicpKS50b0hhdmVMZW5ndGgoNClcblxuICAgICMgRGlzYWJsZWQgdW50aWwgbWluaW1hcC1oaWdobGlnaHQtc2VsZWN0ZWQgYnJhbmNoXG4gICAgIyBmZWF0dXJlLWhpZ2hsaWdodC1zZWxlY3RlZC1hcGkgaXMgbWVyZ2VkIGluXG4gICAgIyBpZiBoYXNNaW5pbWFwXG4gICAgIyAgIGRlc2NyaWJlIFwibWluaW1hcCBoaWdobGlnaHQgc2VsZWN0ZWQgc3RpbGwgd29ya3NcIiwgLT5cbiAgICAjICAgICBiZWZvcmVFYWNoIC0+XG4gICAgIyAgICAgICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICAjICAgICAgIG1pbmltYXAgPSBtaW5pbWFwTW9kdWxlLm1pbmltYXBGb3JFZGl0b3IoZWRpdG9yKVxuICAgICNcbiAgICAjICAgICAgIHNweU9uKG1pbmltYXAsICdkZWNvcmF0ZU1hcmtlcicpLmFuZENhbGxUaHJvdWdoKClcbiAgICAjICAgICAgIHJhbmdlID0gbmV3IFJhbmdlKG5ldyBQb2ludCg4LCAyKSwgbmV3IFBvaW50KDgsIDgpKVxuICAgICMgICAgICAgZWRpdG9yLnNldFNlbGVjdGVkQnVmZmVyUmFuZ2UocmFuZ2UpXG4gICAgIyAgICAgICBhZHZhbmNlQ2xvY2soMjAwMDApXG4gICAgI1xuICAgICMgICAgIGl0ICdhZGRzIGEgZGVjb3JhdGlvbiBmb3IgdGhlIHNlbGVjdGlvbiBpbiB0aGUgbWluaW1hcCcsIC0+XG4gICAgIyAgICAgICBleHBlY3QobWluaW1hcC5kZWNvcmF0ZU1hcmtlcikudG9IYXZlQmVlbkNhbGxlZCgpXG5cbiAgZGVzY3JpYmUgXCJ3aGVuIG9wZW5pbmcgYSBwaHAgZmlsZVwiLCAtPlxuICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgICBhdG9tLnBhY2thZ2VzLmFjdGl2YXRlUGFja2FnZSgnaGlnaGxpZ2h0LXNlbGVjdGVkJylcbiAgICAgICAgICAudGhlbiAoe21haW5Nb2R1bGV9KSAtPlxuICAgICAgICAgICAgaGlnaGxpZ2h0U2VsZWN0ZWQgPSBtYWluTW9kdWxlXG5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgICBhdG9tLndvcmtzcGFjZS5vcGVuKCdzYW1wbGUucGhwJykudGhlbihcbiAgICAgICAgICAoZWRpdG9yKSAtPiBlZGl0b3JcbiAgICAgICAgICAsXG4gICAgICAgICAgKGVycm9yKSAtPiB0aHJvdyhlcnJvci5zdGFjaylcbiAgICAgICAgKVxuXG4gICAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgICAgYXRvbS5wYWNrYWdlcy5hY3RpdmF0ZVBhY2thZ2UoJ2xhbmd1YWdlLXBocCcpXG5cbiAgICAgIHJ1bnMgLT5cbiAgICAgICAgamFzbWluZS5hdHRhY2hUb0RPTSh3b3Jrc3BhY2VFbGVtZW50KVxuICAgICAgICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICAgICAgZWRpdG9yRWxlbWVudCA9IGF0b20udmlld3MuZ2V0VmlldyhlZGl0b3IpXG5cbiAgICBkZXNjcmliZSBcImJlaW5nIGFibGUgdG8gaGlnaGxpZ2h0IHZhcmlhYmxlcyB3aXRoICckJ1wiLCAtPlxuICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICBhdG9tLmNvbmZpZy5zZXQoJ2hpZ2hsaWdodC1zZWxlY3RlZC5vbmx5SGlnaGxpZ2h0V2hvbGVXb3JkcycsIHRydWUpXG4gICAgICAgIHJhbmdlID0gbmV3IFJhbmdlKG5ldyBQb2ludCgxLCAyKSwgbmV3IFBvaW50KDEsIDcpKVxuICAgICAgICBlZGl0b3Iuc2V0U2VsZWN0ZWRCdWZmZXJSYW5nZShyYW5nZSlcbiAgICAgICAgYWR2YW5jZUNsb2NrKDIwMDAwKVxuXG4gICAgICBpdCBcImZpbmRzIDMgcmVnaW9uc1wiLCAtPlxuICAgICAgICBleHBlY3QoZWRpdG9yRWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKFxuICAgICAgICAgICcuaGlnaGxpZ2h0LXNlbGVjdGVkIC5yZWdpb24nKSkudG9IYXZlTGVuZ3RoKDMpXG5cbiAgICBkZXNjcmliZSBcImJlaW5nIGFibGUgdG8gaGlnaGxpZ2h0IHZhcmlhYmxlcyB3aGVuIG5vdCBzZWxlY3RpbmcgJyQnXCIsIC0+XG4gICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgIGF0b20uY29uZmlnLnNldCgnaGlnaGxpZ2h0LXNlbGVjdGVkLm9ubHlIaWdobGlnaHRXaG9sZVdvcmRzJywgdHJ1ZSlcbiAgICAgICAgcmFuZ2UgPSBuZXcgUmFuZ2UobmV3IFBvaW50KDEsIDMpLCBuZXcgUG9pbnQoMSwgNykpXG4gICAgICAgIGVkaXRvci5zZXRTZWxlY3RlZEJ1ZmZlclJhbmdlKHJhbmdlKVxuICAgICAgICBhZHZhbmNlQ2xvY2soMjAwMDApXG5cbiAgICAgIGl0IFwiZmluZHMgNCByZWdpb25zXCIsIC0+XG4gICAgICAgIGV4cGVjdChlZGl0b3JFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXG4gICAgICAgICAgJy5oaWdobGlnaHQtc2VsZWN0ZWQgLnJlZ2lvbicpKS50b0hhdmVMZW5ndGgoNClcbiJdfQ==
