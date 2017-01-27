(function() {
  var fs, path, temp;

  path = require('path');

  fs = require('fs-plus');

  temp = require('temp');

  describe('ShowTodo opening panes and executing commands', function() {
    var activationPromise, executeCommand, ref, showTodoModule, showTodoPane, workspaceElement;
    ref = [], workspaceElement = ref[0], activationPromise = ref[1], showTodoModule = ref[2], showTodoPane = ref[3];
    executeCommand = function(callback) {
      var wasVisible;
      wasVisible = showTodoModule != null ? showTodoModule.showTodoView.isVisible() : void 0;
      atom.commands.dispatch(workspaceElement, 'todo-show:find-in-workspace');
      waitsForPromise(function() {
        return activationPromise;
      });
      return runs(function() {
        waitsFor(function() {
          if (wasVisible) {
            return !showTodoModule.showTodoView.isVisible();
          }
          return !showTodoModule.showTodoView.isSearching() && showTodoModule.showTodoView.isVisible();
        });
        return runs(function() {
          showTodoPane = atom.workspace.paneForItem(showTodoModule.showTodoView);
          return callback();
        });
      });
    };
    beforeEach(function() {
      atom.project.setPaths([path.join(__dirname, 'fixtures/sample1')]);
      workspaceElement = atom.views.getView(atom.workspace);
      jasmine.attachToDOM(workspaceElement);
      return activationPromise = atom.packages.activatePackage('todo-show').then(function(opts) {
        return showTodoModule = opts.mainModule;
      });
    });
    describe('when the show-todo:find-in-workspace event is triggered', function() {
      it('attaches and then detaches the pane view', function() {
        expect(atom.packages.loadedPackages['todo-show']).toBeDefined();
        expect(workspaceElement.querySelector('.show-todo-preview')).not.toExist();
        return executeCommand(function() {
          expect(workspaceElement.querySelector('.show-todo-preview')).toExist();
          expect(showTodoPane.parent.orientation).toBe('horizontal');
          return executeCommand(function() {
            return expect(workspaceElement.querySelector('.show-todo-preview')).not.toExist();
          });
        });
      });
      it('can open in vertical split', function() {
        atom.config.set('todo-show.openListInDirection', 'down');
        return executeCommand(function() {
          expect(workspaceElement.querySelector('.show-todo-preview')).toExist();
          return expect(showTodoPane.parent.orientation).toBe('vertical');
        });
      });
      it('can open ontop of current view', function() {
        atom.config.set('todo-show.openListInDirection', 'ontop');
        return executeCommand(function() {
          expect(workspaceElement.querySelector('.show-todo-preview')).toExist();
          return expect(showTodoPane.parent.orientation).not.toExist();
        });
      });
      it('has visible elements in view', function() {
        return executeCommand(function() {
          var element;
          element = showTodoModule.showTodoView.find('td').last();
          expect(element.text()).toEqual('sample.js');
          return expect(element.isVisible()).toBe(true);
        });
      });
      it('persists pane width', function() {
        return executeCommand(function() {
          var newFlex, originalFlex;
          originalFlex = showTodoPane.getFlexScale();
          newFlex = originalFlex * 1.1;
          expect(typeof originalFlex).toEqual("number");
          expect(showTodoModule.showTodoView).toBeVisible();
          showTodoPane.setFlexScale(newFlex);
          return executeCommand(function() {
            expect(showTodoPane).not.toExist();
            expect(showTodoModule.showTodoView).not.toBeVisible();
            return executeCommand(function() {
              expect(showTodoPane.getFlexScale()).toEqual(newFlex);
              return showTodoPane.setFlexScale(originalFlex);
            });
          });
        });
      });
      it('does not persist pane width if asked not to', function() {
        atom.config.set('todo-show.rememberViewSize', false);
        return executeCommand(function() {
          var newFlex, originalFlex;
          originalFlex = showTodoPane.getFlexScale();
          newFlex = originalFlex * 1.1;
          expect(typeof originalFlex).toEqual("number");
          showTodoPane.setFlexScale(newFlex);
          return executeCommand(function() {
            return executeCommand(function() {
              expect(showTodoPane.getFlexScale()).not.toEqual(newFlex);
              return expect(showTodoPane.getFlexScale()).toEqual(originalFlex);
            });
          });
        });
      });
      return it('persists horizontal pane height', function() {
        atom.config.set('todo-show.openListInDirection', 'down');
        return executeCommand(function() {
          var newFlex, originalFlex;
          originalFlex = showTodoPane.getFlexScale();
          newFlex = originalFlex * 1.1;
          expect(typeof originalFlex).toEqual("number");
          showTodoPane.setFlexScale(newFlex);
          return executeCommand(function() {
            expect(showTodoPane).not.toExist();
            return executeCommand(function() {
              expect(showTodoPane.getFlexScale()).toEqual(newFlex);
              return showTodoPane.setFlexScale(originalFlex);
            });
          });
        });
      });
    });
    describe('when the show-todo:find-in-workspace event is triggered', function() {
      return it('activates', function() {
        expect(atom.packages.loadedPackages['todo-show']).toBeDefined();
        return expect(workspaceElement.querySelector('.show-todo-preview')).not.toExist();
      });
    });
    describe('when todo item is clicked', function() {
      it('opens the file', function() {
        return executeCommand(function() {
          var element, item;
          element = showTodoModule.showTodoView.find('td').last();
          item = atom.workspace.getActivePaneItem();
          expect(item).not.toBeDefined();
          element.click();
          waitsFor(function() {
            return item = atom.workspace.getActivePaneItem();
          });
          return runs(function() {
            return expect(item.getTitle()).toBe('sample.js');
          });
        });
      });
      return it('opens file other project', function() {
        atom.project.addPath(path.join(__dirname, 'fixtures/sample2'));
        return executeCommand(function() {
          var element, item;
          element = showTodoModule.showTodoView.find('td')[3];
          item = atom.workspace.getActivePaneItem();
          expect(item).not.toBeDefined();
          element.click();
          waitsFor(function() {
            return item = atom.workspace.getActivePaneItem();
          });
          return runs(function() {
            return expect(item.getTitle()).toBe('sample.txt');
          });
        });
      });
    });
    describe('when save-as button is clicked', function() {
      it('saves the list in markdown and opens it', function() {
        var expectedFilePath, expectedOutput, outputPath;
        outputPath = temp.path({
          suffix: '.md'
        });
        expectedFilePath = atom.project.getDirectories()[0].resolve('../saved-output.md');
        expectedOutput = fs.readFileSync(expectedFilePath).toString();
        atom.config.set('todo-show.sortBy', 'Type');
        expect(fs.isFileSync(outputPath)).toBe(false);
        executeCommand(function() {
          spyOn(atom, 'showSaveDialogSync').andReturn(outputPath);
          return showTodoModule.showTodoView.saveAs();
        });
        waitsFor(function() {
          var ref1;
          return fs.existsSync(outputPath) && ((ref1 = atom.workspace.getActiveTextEditor()) != null ? ref1.getPath() : void 0) === fs.realpathSync(outputPath);
        });
        return runs(function() {
          expect(fs.isFileSync(outputPath)).toBe(true);
          return expect(atom.workspace.getActiveTextEditor().getText()).toBe(expectedOutput);
        });
      });
      return it('saves another list sorted differently in markdown', function() {
        var outputPath;
        outputPath = temp.path({
          suffix: '.md'
        });
        atom.config.set('todo-show.findTheseTodos', ['TODO']);
        atom.config.set('todo-show.showInTable', ['Text', 'Type', 'File', 'Line']);
        atom.config.set('todo-show.sortBy', 'File');
        expect(fs.isFileSync(outputPath)).toBe(false);
        executeCommand(function() {
          spyOn(atom, 'showSaveDialogSync').andReturn(outputPath);
          return showTodoModule.showTodoView.saveAs();
        });
        waitsFor(function() {
          var ref1;
          return fs.existsSync(outputPath) && ((ref1 = atom.workspace.getActiveTextEditor()) != null ? ref1.getPath() : void 0) === fs.realpathSync(outputPath);
        });
        return runs(function() {
          expect(fs.isFileSync(outputPath)).toBe(true);
          return expect(atom.workspace.getActiveTextEditor().getText()).toBe("- Comment in C __TODO__ [sample.c](sample.c) _:5_\n- This is the first todo __TODO__ [sample.js](sample.js) _:3_\n- This is the second todo __TODO__ [sample.js](sample.js) _:20_\n");
        });
      });
    });
    describe('when core:refresh is triggered', function() {
      return it('refreshes the list', function() {
        return executeCommand(function() {
          atom.commands.dispatch(workspaceElement.querySelector('.show-todo-preview'), 'core:refresh');
          expect(showTodoModule.showTodoView.isSearching()).toBe(true);
          expect(showTodoModule.showTodoView.find('.markdown-spinner')).toBeVisible();
          waitsFor(function() {
            return !showTodoModule.showTodoView.isSearching();
          });
          return runs(function() {
            expect(showTodoModule.showTodoView.find('.markdown-spinner')).not.toBeVisible();
            return expect(showTodoModule.showTodoView.isSearching()).toBe(false);
          });
        });
      });
    });
    describe('when the show-todo:find-in-open-files event is triggered', function() {
      beforeEach(function() {
        atom.commands.dispatch(workspaceElement, 'todo-show:find-in-open-files');
        waitsForPromise(function() {
          return activationPromise;
        });
        return runs(function() {
          return waitsFor(function() {
            return !showTodoModule.showTodoView.isSearching() && showTodoModule.showTodoView.isVisible();
          });
        });
      });
      it('does not show any results with no open files', function() {
        var element;
        element = showTodoModule.showTodoView.find('p').last();
        expect(showTodoModule.showTodoView.getTodos()).toHaveLength(0);
        expect(element.text()).toContain('No results...');
        return expect(element.isVisible()).toBe(true);
      });
      return it('only shows todos from open files', function() {
        waitsForPromise(function() {
          return atom.workspace.open('sample.c');
        });
        waitsFor(function() {
          return !showTodoModule.showTodoView.isSearching();
        });
        return runs(function() {
          var todos;
          todos = showTodoModule.showTodoView.getTodos();
          expect(todos).toHaveLength(1);
          expect(todos[0].type).toBe('TODO');
          expect(todos[0].text).toBe('Comment in C');
          return expect(todos[0].file).toBe('sample.c');
        });
      });
    });
    return describe('status bar indicator', function() {
      var todoIndicatorClass;
      todoIndicatorClass = '.status-bar .todo-status-bar-indicator';
      return it('shows the current number of todos', function() {
        atom.packages.activatePackage('status-bar');
        return executeCommand(function() {
          var indicatorElement, nTodos;
          expect(workspaceElement.querySelector(todoIndicatorClass)).not.toExist();
          atom.config.set('todo-show.statusBarIndicator', true);
          expect(workspaceElement.querySelector(todoIndicatorClass)).toExist();
          nTodos = showTodoModule.showTodoView.getTodosCount();
          expect(nTodos).not.toBe(0);
          indicatorElement = workspaceElement.querySelector(todoIndicatorClass);
          return expect(indicatorElement.innerText).toBe(nTodos.toString());
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvZGRld2V5Ly5hdG9tL3BhY2thZ2VzL3RvZG8tc2hvdy9zcGVjL3Nob3ctdG9kby1zcGVjLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUNQLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUjs7RUFDTCxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBRVAsUUFBQSxDQUFTLCtDQUFULEVBQTBELFNBQUE7QUFDeEQsUUFBQTtJQUFBLE1BQXNFLEVBQXRFLEVBQUMseUJBQUQsRUFBbUIsMEJBQW5CLEVBQXNDLHVCQUF0QyxFQUFzRDtJQUl0RCxjQUFBLEdBQWlCLFNBQUMsUUFBRDtBQUNmLFVBQUE7TUFBQSxVQUFBLDRCQUFhLGNBQWMsQ0FBRSxZQUFZLENBQUMsU0FBN0IsQ0FBQTtNQUNiLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBZCxDQUF1QixnQkFBdkIsRUFBeUMsNkJBQXpDO01BQ0EsZUFBQSxDQUFnQixTQUFBO2VBQUc7TUFBSCxDQUFoQjthQUNBLElBQUEsQ0FBSyxTQUFBO1FBQ0gsUUFBQSxDQUFTLFNBQUE7VUFDUCxJQUFtRCxVQUFuRDtBQUFBLG1CQUFPLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQyxTQUE1QixDQUFBLEVBQVI7O2lCQUNBLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQyxXQUE1QixDQUFBLENBQUQsSUFBK0MsY0FBYyxDQUFDLFlBQVksQ0FBQyxTQUE1QixDQUFBO1FBRnhDLENBQVQ7ZUFHQSxJQUFBLENBQUssU0FBQTtVQUNILFlBQUEsR0FBZSxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQWYsQ0FBMkIsY0FBYyxDQUFDLFlBQTFDO2lCQUNmLFFBQUEsQ0FBQTtRQUZHLENBQUw7TUFKRyxDQUFMO0lBSmU7SUFZakIsVUFBQSxDQUFXLFNBQUE7TUFDVCxJQUFJLENBQUMsT0FBTyxD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QkFDQSxNQUFBLENBQU8sS0FBTSxDQUFBLENBQUEsQ0FBRSxDQUFDLElBQWhCLENBQXFCLENBQUMsSUFBdEIsQ0FBMkIsVUFBM0I7UUFMRyxDQUFMO01BTHFDLENBQXZDO0lBZm1FLENBQXJFO1dBMkJBLFFBQUEsQ0FBUyxzQkFBVCxFQUFpQyxTQUFBO0FBQy9CLFVBQUE7TUFBQSxrQkFBQSxHQUFxQjthQUVyQixFQUFBLENBQUcsbUNBQUgsRUFBd0MsU0FBQTtRQUN0QyxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWQsQ0FBOEIsWUFBOUI7ZUFFQSxjQUFBLENBQWUsU0FBQTtBQUNiLGNBQUE7VUFBQSxNQUFBLENBQU8sZ0JBQWdCLENBQUMsYUFBakIsQ0FBK0Isa0JBQS9CLENBQVAsQ0FBMEQsQ0FBQyxHQUFHLENBQUMsT0FBL0QsQ0FBQTtVQUNBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiw4QkFBaEIsRUFBZ0QsSUFBaEQ7VUFDQSxNQUFBLENBQU8sZ0JBQWdCLENBQUMsYUFBakIsQ0FBK0Isa0JBQS9CLENBQVAsQ0FBMEQsQ0FBQyxPQUEzRCxDQUFBO1VBRUEsTUFBQSxHQUFTLGNBQWMsQ0FBQyxZQUFZLENBQUMsYUFBNUIsQ0FBQTtVQUNULE1BQUEsQ0FBTyxNQUFQLENBQWMsQ0FBQyxHQUFHLENBQUMsSUFBbkIsQ0FBd0IsQ0FBeEI7VUFDQSxnQkFBQSxHQUFtQixnQkFBZ0IsQ0FBQyxhQUFqQixDQUErQixrQkFBL0I7aUJBQ25CLE1BQUEsQ0FBTyxnQkFBZ0IsQ0FBQyxTQUF4QixDQUFrQyxDQUFDLElBQW5DLENBQXdDLE1BQU0sQ0FBQyxRQUFQLENBQUEsQ0FBeEM7UUFSYSxDQUFmO01BSHNDLENBQXhDO0lBSCtCLENBQWpDO0VBck53RCxDQUExRDtBQUpBIiwic291cmNlc0NvbnRlbnQiOlsicGF0aCA9IHJlcXVpcmUgJ3BhdGgnXG5mcyA9IHJlcXVpcmUgJ2ZzLXBsdXMnXG50ZW1wID0gcmVxdWlyZSAndGVtcCdcblxuZGVzY3JpYmUgJ1Nob3dUb2RvIG9wZW5pbmcgcGFuZXMgYW5kIGV4ZWN1dGluZyBjb21tYW5kcycsIC0+XG4gIFt3b3Jrc3BhY2VFbGVtZW50LCBhY3RpdmF0aW9uUHJvbWlzZSwgc2hvd1RvZG9Nb2R1bGUsIHNob3dUb2RvUGFuZV0gPSBbXVxuXG4gICMgTmVlZGVkIHRvIGFjdGl2YXRlIHBhY2thZ2VzIHRoYXQgYXJlIHVzaW5nIGFjdGl2YXRpb25Db21tYW5kc1xuICAjIGFuZCB3YWl0IGZvciBsb2FkaW5nIHRvIHN0b3BcbiAgZXhlY3V0ZUNvbW1hbmQgPSAoY2FsbGJhY2spIC0+XG4gICAgd2FzVmlzaWJsZSA9IHNob3dUb2RvTW9kdWxlPy5zaG93VG9kb1ZpZXcuaXNWaXNpYmxlKClcbiAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKHdvcmtzcGFjZUVsZW1lbnQsICd0b2RvLXNob3c6ZmluZC1pbi13b3Jrc3BhY2UnKVxuICAgIHdhaXRzRm9yUHJvbWlzZSAtPiBhY3RpdmF0aW9uUHJvbWlzZVxuICAgIHJ1bnMgLT5cbiAgICAgIHdhaXRzRm9yIC0+XG4gICAgICAgIHJldHVybiAhc2hvd1RvZG9Nb2R1bGUuc2hvd1RvZG9WaWV3LmlzVmlzaWJsZSgpIGlmIHdhc1Zpc2libGVcbiAgICAgICAgIXNob3dUb2RvTW9kdWxlLnNob3dUb2RvVmlldy5pc1NlYXJjaGluZygpIGFuZCBzaG93VG9kb01vZHVsZS5zaG93VG9kb1ZpZXcuaXNWaXNpYmxlKClcbiAgICAgIHJ1bnMgLT5cbiAgICAgICAgc2hvd1RvZG9QYW5lID0gYXRvbS53b3Jrc3BhY2UucGFuZUZvckl0ZW0oc2hvd1RvZG9Nb2R1bGUuc2hvd1RvZG9WaWV3KVxuICAgICAgICBjYWxsYmFjaygpXG5cbiAgYmVmb3JlRWFjaCAtPlxuICAgIGF0b20ucHJvamVjdC5zZXRQYXRocyBbcGF0aC5qb2luKF9fZGlybmFtZSwgJ2ZpeHR1cmVzL3NhbXBsZTEnKV1cbiAgICB3b3Jrc3BhY2VFbGVtZW50ID0gYXRvbS52aWV3cy5nZXRWaWV3KGF0b20ud29ya3NwYWNlKVxuICAgIGphc21pbmUuYXR0YWNoVG9ET00od29ya3NwYWNlRWxlbWVudClcbiAgICBhY3RpdmF0aW9uUHJvbWlzZSA9IGF0b20ucGFja2FnZXMuYWN0aXZhdGVQYWNrYWdlKCd0b2RvLXNob3cnKS50aGVuIChvcHRzKSAtPlxuICAgICAgc2hvd1RvZG9Nb2R1bGUgPSBvcHRzLm1haW5Nb2R1bGVcblxuICBkZXNjcmliZSAnd2hlbiB0aGUgc2hvdy10b2RvOmZpbmQtaW4td29ya3NwYWNlIGV2ZW50IGlzIHRyaWdnZXJlZCcsIC0+XG4gICAgaXQgJ2F0dGFjaGVzIGFuZCB0aGVuIGRldGFjaGVzIHRoZSBwYW5lIHZpZXcnLCAtPlxuICAgICAgZXhwZWN0KGF0b20ucGFja2FnZXMubG9hZGVkUGFja2FnZXNbJ3RvZG8tc2hvdyddKS50b0JlRGVmaW5lZCgpXG4gICAgICBleHBlY3Qod29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuc2hvdy10b2RvLXByZXZpZXcnKSkubm90LnRvRXhpc3QoKVxuXG4gICAgICAjIG9wZW4gdG9kby1zaG93XG4gICAgICBleGVjdXRlQ29tbWFuZCAtPlxuICAgICAgICBleHBlY3Qod29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuc2hvdy10b2RvLXByZXZpZXcnKSkudG9FeGlzdCgpXG4gICAgICAgIGV4cGVjdChzaG93VG9kb1BhbmUucGFyZW50Lm9yaWVudGF0aW9uKS50b0JlICdob3Jpem9udGFsJ1xuXG4gICAgICAgICMgY2xvc2UgdG9kby1zaG93IGFnYWluXG4gICAgICAgIGV4ZWN1dGVDb21tYW5kIC0+XG4gICAgICAgICAgZXhwZWN0KHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLnNob3ctdG9kby1wcmV2aWV3JykpLm5vdC50b0V4aXN0KClcblxuICAgIGl0ICdjYW4gb3BlbiBpbiB2ZXJ0aWNhbCBzcGxpdCcsIC0+XG4gICAgICBhdG9tLmNvbmZpZy5zZXQgJ3RvZG8tc2hvdy5vcGVuTGlzdEluRGlyZWN0aW9uJywgJ2Rvd24nXG5cbiAgICAgIGV4ZWN1dGVDb21tYW5kIC0+XG4gICAgICAgIGV4cGVjdCh3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zaG93LXRvZG8tcHJldmlldycpKS50b0V4aXN0KClcbiAgICAgICAgZXhwZWN0KHNob3dUb2RvUGFuZS5wYXJlbnQub3JpZW50YXRpb24pLnRvQmUgJ3ZlcnRpY2FsJ1xuXG4gICAgaXQgJ2NhbiBvcGVuIG9udG9wIG9mIGN1cnJlbnQgdmlldycsIC0+XG4gICAgICBhdG9tLmNvbmZpZy5zZXQgJ3RvZG8tc2hvdy5vcGVuTGlzdEluRGlyZWN0aW9uJywgJ29udG9wJ1xuXG4gICAgICBleGVjdXRlQ29tbWFuZCAtPlxuICAgICAgICBleHBlY3Qod29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuc2hvdy10b2RvLXByZXZpZXcnKSkudG9FeGlzdCgpXG4gICAgICAgIGV4cGVjdChzaG93VG9kb1BhbmUucGFyZW50Lm9yaWVudGF0aW9uKS5ub3QudG9FeGlzdCgpXG5cbiAgICBpdCAnaGFzIHZpc2libGUgZWxlbWVudHMgaW4gdmlldycsIC0+XG4gICAgICBleGVjdXRlQ29tbWFuZCAtPlxuICAgICAgICBlbGVtZW50ID0gc2hvd1RvZG9Nb2R1bGUuc2hvd1RvZG9WaWV3LmZpbmQoJ3RkJykubGFzdCgpXG4gICAgICAgIGV4cGVjdChlbGVtZW50LnRleHQoKSkudG9FcXVhbCAnc2FtcGxlLmpzJ1xuICAgICAgICBleHBlY3QoZWxlbWVudC5pc1Zpc2libGUoKSkudG9CZSB0cnVlXG5cbiAgICBpdCAncGVyc2lzdHMgcGFuZSB3aWR0aCcsIC0+XG4gICAgICBleGVjdXRlQ29tbWFuZCAtPlxuICAgICAgICBvcmlnaW5hbEZsZXggPSBzaG93VG9kb1BhbmUuZ2V0RmxleFNjYWxlKClcbiAgICAgICAgbmV3RmxleCA9IG9yaWdpbmFsRmxleCAqIDEuMVxuICAgICAgICBleHBlY3QodHlwZW9mIG9yaWdpbmFsRmxleCkudG9FcXVhbCBcIm51bWJlclwiXG4gICAgICAgIGV4cGVjdChzaG93VG9kb01vZHVsZS5zaG93VG9kb1ZpZXcpLnRvQmVWaXNpYmxlKClcbiAgICAgICAgc2hvd1RvZG9QYW5lLnNldEZsZXhTY2FsZShuZXdGbGV4KVxuXG4gICAgICAgIGV4ZWN1dGVDb21tYW5kIC0+XG4gICAgICAgICAgZXhwZWN0KHNob3dUb2RvUGFuZSkubm90LnRvRXhpc3QoKVxuICAgICAgICAgIGV4cGVjdChzaG93VG9kb01vZHVsZS5zaG93VG9kb1ZpZXcpLm5vdC50b0JlVmlzaWJsZSgpXG5cbiAgICAgICAgICBleGVjdXRlQ29tbWFuZCAtPlxuICAgICAgICAgICAgZXhwZWN0KHNob3dUb2RvUGFuZS5nZXRGbGV4U2NhbGUoKSkudG9FcXVhbCBuZXdGbGV4XG4gICAgICAgICAgICBzaG93VG9kb1BhbmUuc2V0RmxleFNjYWxlKG9yaWdpbmFsRmxleClcblxuICAgIGl0ICdkb2VzIG5vdCBwZXJzaXN0IHBhbmUgd2lkdGggaWYgYXNrZWQgbm90IHRvJywgLT5cbiAgICAgIGF0b20uY29uZmlnLnNldCgndG9kby1zaG93LnJlbWVtYmVyVmlld1NpemUnLCBmYWxzZSlcblxuICAgICAgZXhlY3V0ZUNvbW1hbmQgLT5cbiAgICAgICAgb3JpZ2luYWxGbGV4ID0gc2hvd1RvZG9QYW5lLmdldEZsZXhTY2FsZSgpXG4gICAgICAgIG5ld0ZsZXggPSBvcmlnaW5hbEZsZXggKiAxLjFcbiAgICAgICAgZXhwZWN0KHR5cGVvZiBvcmlnaW5hbEZsZXgpLnRvRXF1YWwgXCJudW1iZXJcIlxuXG4gICAgICAgIHNob3dUb2RvUGFuZS5zZXRGbGV4U2NhbGUobmV3RmxleClcbiAgICAgICAgZXhlY3V0ZUNvbW1hbmQgLT5cbiAgICAgICAgICBleGVjdXRlQ29tbWFuZCAtPlxuICAgICAgICAgICAgZXhwZWN0KHNob3dUb2RvUGFuZS5nZXRGbGV4U2NhbGUoKSkubm90LnRvRXF1YWwgbmV3RmxleFxuICAgICAgICAgICAgZXhwZWN0KHNob3dUb2RvUGFuZS5nZXRGbGV4U2NhbGUoKSkudG9FcXVhbCBvcmlnaW5hbEZsZXhcblxuICAgIGl0ICdwZXJzaXN0cyBob3Jpem9udGFsIHBhbmUgaGVpZ2h0JywgLT5cbiAgICAgIGF0b20uY29uZmlnLnNldCgndG9kby1zaG93Lm9wZW5MaXN0SW5EaXJlY3Rpb24nLCAnZG93bicpXG5cbiAgICAgIGV4ZWN1dGVDb21tYW5kIC0+XG4gICAgICAgIG9yaWdpbmFsRmxleCA9IHNob3dUb2RvUGFuZS5nZXRGbGV4U2NhbGUoKVxuICAgICAgICBuZXdGbGV4ID0gb3JpZ2luYWxGbGV4ICogMS4xXG4gICAgICAgIGV4cGVjdCh0eXBlb2Ygb3JpZ2luYWxGbGV4KS50b0VxdWFsIFwibnVtYmVyXCJcblxuICAgICAgICBzaG93VG9kb1BhbmUuc2V0RmxleFNjYWxlKG5ld0ZsZXgpXG4gICAgICAgIGV4ZWN1dGVDb21tYW5kIC0+XG4gICAgICAgICAgZXhwZWN0KHNob3dUb2RvUGFuZSkubm90LnRvRXhpc3QoKVxuICAgICAgICAgIGV4ZWN1dGVDb21tYW5kIC0+XG4gICAgICAgICAgICBleHBlY3Qoc2hvd1RvZG9QYW5lLmdldEZsZXhTY2FsZSgpKS50b0VxdWFsIG5ld0ZsZXhcbiAgICAgICAgICAgIHNob3dUb2RvUGFuZS5zZXRGbGV4U2NhbGUob3JpZ2luYWxGbGV4KVxuXG4gIGRlc2NyaWJlICd3aGVuIHRoZSBzaG93LXRvZG86ZmluZC1pbi13b3Jrc3BhY2UgZXZlbnQgaXMgdHJpZ2dlcmVkJywgLT5cbiAgICBpdCAnYWN0aXZhdGVzJywgLT5cbiAgICAgIGV4cGVjdChhdG9tLnBhY2thZ2VzLmxvYWRlZFBhY2thZ2VzWyd0b2RvLXNob3cnXSkudG9CZURlZmluZWQoKVxuICAgICAgZXhwZWN0KHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLnNob3ctdG9kby1wcmV2aWV3JykpLm5vdC50b0V4aXN0KClcblxuICBkZXNjcmliZSAnd2hlbiB0b2RvIGl0ZW0gaXMgY2xpY2tlZCcsIC0+XG4gICAgaXQgJ29wZW5zIHRoZSBmaWxlJywgLT5cbiAgICAgIGV4ZWN1dGVDb21tYW5kIC0+XG4gICAgICAgIGVsZW1lbnQgPSBzaG93VG9kb01vZHVsZS5zaG93VG9kb1ZpZXcuZmluZCgndGQnKS5sYXN0KClcbiAgICAgICAgaXRlbSA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmVJdGVtKClcbiAgICAgICAgZXhwZWN0KGl0ZW0pLm5vdC50b0JlRGVmaW5lZCgpXG4gICAgICAgIGVsZW1lbnQuY2xpY2soKVxuXG4gICAgICAgIHdhaXRzRm9yIC0+IGl0ZW0gPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lSXRlbSgpXG4gICAgICAgIHJ1bnMgLT4gZXhwZWN0KGl0ZW0uZ2V0VGl0bGUoKSkudG9CZSAnc2FtcGxlLmpzJ1xuXG4gICAgaXQgJ29wZW5zIGZpbGUgb3RoZXIgcHJvamVjdCcsIC0+XG4gICAgICBhdG9tLnByb2plY3QuYWRkUGF0aCBwYXRoLmpvaW4oX19kaXJuYW1lLCAnZml4dHVyZXMvc2FtcGxlMicpXG5cbiAgICAgIGV4ZWN1dGVDb21tYW5kIC0+XG4gICAgICAgIGVsZW1lbnQgPSBzaG93VG9kb01vZHVsZS5zaG93VG9kb1ZpZXcuZmluZCgndGQnKVszXVxuICAgICAgICBpdGVtID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZUl0ZW0oKVxuICAgICAgICBleHBlY3QoaXRlbSkubm90LnRvQmVEZWZpbmVkKClcbiAgICAgICAgZWxlbWVudC5jbGljaygpXG5cbiAgICAgICAgd2FpdHNGb3IgLT4gaXRlbSA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmVJdGVtKClcbiAgICAgICAgcnVucyAtPiBleHBlY3QoaXRlbS5nZXRUaXRsZSgpKS50b0JlICdzYW1wbGUudHh0J1xuXG4gIGRlc2NyaWJlICd3aGVuIHNhdmUtYXMgYnV0dG9uIGlzIGNsaWNrZWQnLCAtPlxuICAgIGl0ICdzYXZlcyB0aGUgbGlzdCBpbiBtYXJrZG93biBhbmQgb3BlbnMgaXQnLCAtPlxuICAgICAgb3V0cHV0UGF0aCA9IHRlbXAucGF0aChzdWZmaXg6ICcubWQnKVxuICAgICAgZXhwZWN0ZWRGaWxlUGF0aCA9IGF0b20ucHJvamVjdC5nZXREaXJlY3RvcmllcygpWzBdLnJlc29sdmUoJy4uL3NhdmVkLW91dHB1dC5tZCcpXG4gICAgICBleHBlY3RlZE91dHB1dCA9IGZzLnJlYWRGaWxlU3luYyhleHBlY3RlZEZpbGVQYXRoKS50b1N0cmluZygpXG4gICAgICBhdG9tLmNvbmZpZy5zZXQgJ3RvZG8tc2hvdy5zb3J0QnknLCAnVHlwZSdcblxuICAgICAgZXhwZWN0KGZzLmlzRmlsZVN5bmMob3V0cHV0UGF0aCkpLnRvQmUgZmFsc2VcblxuICAgICAgZXhlY3V0ZUNvbW1hbmQgLT5cbiAgICAgICAgc3B5T24oYXRvbSwgJ3Nob3dTYXZlRGlhbG9nU3luYycpLmFuZFJldHVybihvdXRwdXRQYXRoKVxuICAgICAgICBzaG93VG9kb01vZHVsZS5zaG93VG9kb1ZpZXcuc2F2ZUFzKClcblxuICAgICAgd2FpdHNGb3IgLT5cbiAgICAgICAgZnMuZXhpc3RzU3luYyhvdXRwdXRQYXRoKSAmJiBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCk/LmdldFBhdGgoKSBpcyBmcy5yZWFscGF0aFN5bmMob3V0cHV0UGF0aClcblxuICAgICAgcnVucyAtPlxuICAgICAgICBleHBlY3QoZnMuaXNGaWxlU3luYyhvdXRwdXRQYXRoKSkudG9CZSB0cnVlXG4gICAgICAgIGV4cGVjdChhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCkuZ2V0VGV4dCgpKS50b0JlIGV4cGVjdGVkT3V0cHV0XG5cbiAgICBpdCAnc2F2ZXMgYW5vdGhlciBsaXN0IHNvcnRlZCBkaWZmZXJlbnRseSBpbiBtYXJrZG93bicsIC0+XG4gICAgICBvdXRwdXRQYXRoID0gdGVtcC5wYXRoKHN1ZmZpeDogJy5tZCcpXG4gICAgICBhdG9tLmNvbmZpZy5zZXQgJ3RvZG8tc2hvdy5maW5kVGhlc2VUb2RvcycsIFsnVE9ETyddXG4gICAgICBhdG9tLmNvbmZpZy5zZXQgJ3RvZG8tc2hvdy5zaG93SW5UYWJsZScsIFsnVGV4dCcsICdUeXBlJywgJ0ZpbGUnLCAnTGluZSddXG4gICAgICBhdG9tLmNvbmZpZy5zZXQgJ3RvZG8tc2hvdy5zb3J0QnknLCAnRmlsZSdcbiAgICAgIGV4cGVjdChmcy5pc0ZpbGVTeW5jKG91dHB1dFBhdGgpKS50b0JlIGZhbHNlXG5cbiAgICAgIGV4ZWN1dGVDb21tYW5kIC0+XG4gICAgICAgIHNweU9uKGF0b20sICdzaG93U2F2ZURpYWxvZ1N5bmMnKS5hbmRSZXR1cm4ob3V0cHV0UGF0aClcbiAgICAgICAgc2hvd1RvZG9Nb2R1bGUuc2hvd1RvZG9WaWV3LnNhdmVBcygpXG5cbiAgICAgIHdhaXRzRm9yIC0+XG4gICAgICAgIGZzLmV4aXN0c1N5bmMob3V0cHV0UGF0aCkgJiYgYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpPy5nZXRQYXRoKCkgaXMgZnMucmVhbHBhdGhTeW5jKG91dHB1dFBhdGgpXG5cbiAgICAgIHJ1bnMgLT5cbiAgICAgICAgZXhwZWN0KGZzLmlzRmlsZVN5bmMob3V0cHV0UGF0aCkpLnRvQmUgdHJ1ZVxuICAgICAgICBleHBlY3QoYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpLmdldFRleHQoKSkudG9CZSBcIlwiXCJcbiAgICAgICAgICAtIENvbW1lbnQgaW4gQyBfX1RPRE9fXyBbc2FtcGxlLmNdKHNhbXBsZS5jKSBfOjVfXG4gICAgICAgICAgLSBUaGlzIGlzIHRoZSBmaXJzdCB0b2RvIF9fVE9ET19fIFtzYW1wbGUuanNdKHNhbXBsZS5qcykgXzozX1xuICAgICAgICAgIC0gVGhpcyBpcyB0aGUgc2Vjb25kIHRvZG8gX19UT0RPX18gW3NhbXBsZS5qc10oc2FtcGxlLmpzKSBfOjIwX1xcblxuICAgICAgICBcIlwiXCJcblxuICBkZXNjcmliZSAnd2hlbiBjb3JlOnJlZnJlc2ggaXMgdHJpZ2dlcmVkJywgLT5cbiAgICBpdCAncmVmcmVzaGVzIHRoZSBsaXN0JywgLT5cbiAgICAgIGV4ZWN1dGVDb21tYW5kIC0+XG4gICAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2ggd29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuc2hvdy10b2RvLXByZXZpZXcnKSwgJ2NvcmU6cmVmcmVzaCdcblxuICAgICAgICBleHBlY3Qoc2hvd1RvZG9Nb2R1bGUuc2hvd1RvZG9WaWV3LmlzU2VhcmNoaW5nKCkpLnRvQmUgdHJ1ZVxuICAgICAgICBleHBlY3Qoc2hvd1RvZG9Nb2R1bGUuc2hvd1RvZG9WaWV3LmZpbmQoJy5tYXJrZG93bi1zcGlubmVyJykpLnRvQmVWaXNpYmxlKClcblxuICAgICAgICB3YWl0c0ZvciAtPiAhc2hvd1RvZG9Nb2R1bGUuc2hvd1RvZG9WaWV3LmlzU2VhcmNoaW5nKClcbiAgICAgICAgcnVucyAtPlxuICAgICAgICAgIGV4cGVjdChzaG93VG9kb01vZHVsZS5zaG93VG9kb1ZpZXcuZmluZCgnLm1hcmtkb3duLXNwaW5uZXInKSkubm90LnRvQmVWaXNpYmxlKClcbiAgICAgICAgICBleHBlY3Qoc2hvd1RvZG9Nb2R1bGUuc2hvd1RvZG9WaWV3LmlzU2VhcmNoaW5nKCkpLnRvQmUgZmFsc2VcblxuICBkZXNjcmliZSAnd2hlbiB0aGUgc2hvdy10b2RvOmZpbmQtaW4tb3Blbi1maWxlcyBldmVudCBpcyB0cmlnZ2VyZWQnLCAtPlxuICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2god29ya3NwYWNlRWxlbWVudCwgJ3RvZG8tc2hvdzpmaW5kLWluLW9wZW4tZmlsZXMnKVxuICAgICAgd2FpdHNGb3JQcm9taXNlIC0+IGFjdGl2YXRpb25Qcm9taXNlXG4gICAgICBydW5zIC0+XG4gICAgICAgIHdhaXRzRm9yIC0+XG4gICAgICAgICAgIXNob3dUb2RvTW9kdWxlLnNob3dUb2RvVmlldy5pc1NlYXJjaGluZygpIGFuZCBzaG93VG9kb01vZHVsZS5zaG93VG9kb1ZpZXcuaXNWaXNpYmxlKClcblxuICAgIGl0ICdkb2VzIG5vdCBzaG93IGFueSByZXN1bHRzIHdpdGggbm8gb3BlbiBmaWxlcycsIC0+XG4gICAgICBlbGVtZW50ID0gc2hvd1RvZG9Nb2R1bGUuc2hvd1RvZG9WaWV3LmZpbmQoJ3AnKS5sYXN0KClcblxuICAgICAgZXhwZWN0KHNob3dUb2RvTW9kdWxlLnNob3dUb2RvVmlldy5nZXRUb2RvcygpKS50b0hhdmVMZW5ndGggMFxuICAgICAgZXhwZWN0KGVsZW1lbnQudGV4dCgpKS50b0NvbnRhaW4gJ05vIHJlc3VsdHMuLi4nXG4gICAgICBleHBlY3QoZWxlbWVudC5pc1Zpc2libGUoKSkudG9CZSB0cnVlXG5cbiAgICBpdCAnb25seSBzaG93cyB0b2RvcyBmcm9tIG9wZW4gZmlsZXMnLCAtPlxuICAgICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4gJ3NhbXBsZS5jJ1xuXG4gICAgICB3YWl0c0ZvciAtPiAhc2hvd1RvZG9Nb2R1bGUuc2hvd1RvZG9WaWV3LmlzU2VhcmNoaW5nKClcbiAgICAgIHJ1bnMgLT5cbiAgICAgICAgdG9kb3MgPSBzaG93VG9kb01vZHVsZS5zaG93VG9kb1ZpZXcuZ2V0VG9kb3MoKVxuICAgICAgICBleHBlY3QodG9kb3MpLnRvSGF2ZUxlbmd0aCAxXG4gICAgICAgIGV4cGVjdCh0b2Rvc1swXS50eXBlKS50b0JlICdUT0RPJ1xuICAgICAgICBleHBlY3QodG9kb3NbMF0udGV4dCkudG9CZSAnQ29tbWVudCBpbiBDJ1xuICAgICAgICBleHBlY3QodG9kb3NbMF0uZmlsZSkudG9CZSAnc2FtcGxlLmMnXG5cbiAgZGVzY3JpYmUgJ3N0YXR1cyBiYXIgaW5kaWNhdG9yJywgLT5cbiAgICB0b2RvSW5kaWNhdG9yQ2xhc3MgPSAnLnN0YXR1cy1iYXIgLnRvZG8tc3RhdHVzLWJhci1pbmRpY2F0b3InXG5cbiAgICBpdCAnc2hvd3MgdGhlIGN1cnJlbnQgbnVtYmVyIG9mIHRvZG9zJywgLT5cbiAgICAgIGF0b20ucGFja2FnZXMuYWN0aXZhdGVQYWNrYWdlICdzdGF0dXMtYmFyJ1xuXG4gICAgICBleGVjdXRlQ29tbWFuZCAtPlxuICAgICAgICBleHBlY3Qod29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKHRvZG9JbmRpY2F0b3JDbGFzcykpLm5vdC50b0V4aXN0KClcbiAgICAgICAgYXRvbS5jb25maWcuc2V0KCd0b2RvLXNob3cuc3RhdHVzQmFySW5kaWNhdG9yJywgdHJ1ZSlcbiAgICAgICAgZXhwZWN0KHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3Rvcih0b2RvSW5kaWNhdG9yQ2xhc3MpKS50b0V4aXN0KClcblxuICAgICAgICBuVG9kb3MgPSBzaG93VG9kb01vZHVsZS5zaG93VG9kb1ZpZXcuZ2V0VG9kb3NDb3VudCgpXG4gICAgICAgIGV4cGVjdChuVG9kb3MpLm5vdC50b0JlIDBcbiAgICAgICAgaW5kaWNhdG9yRWxlbWVudCA9IHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3Rvcih0b2RvSW5kaWNhdG9yQ2xhc3MpXG4gICAgICAgIGV4cGVjdChpbmRpY2F0b3JFbGVtZW50LmlubmVyVGV4dCkudG9CZSBuVG9kb3MudG9TdHJpbmcoKVxuIl19
