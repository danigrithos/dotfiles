(function() {
  var ShowTodoView, TodosCollection, path, sample1Path, sample2Path;

  path = require('path');

  ShowTodoView = require('../lib/todo-view');

  TodosCollection = require('../lib/todo-collection');

  sample1Path = path.join(__dirname, 'fixtures/sample1');

  sample2Path = path.join(__dirname, 'fixtures/sample2');

  describe("Show Todo View", function() {
    var collection, ref, showTodoView;
    ref = [], showTodoView = ref[0], collection = ref[1];
    beforeEach(function() {
      var uri;
      atom.config.set('todo-show.findTheseTodos', ['TODO']);
      atom.config.set('todo-show.findUsingRegex', '/\\b(${TODOS}):?\\d*($|\\s.*$)/g');
      atom.project.setPaths([sample1Path]);
      collection = new TodosCollection;
      uri = 'atom://todo-show/todos';
      showTodoView = new ShowTodoView(collection, uri);
      return waitsFor(function() {
        return !showTodoView.isSearching();
      });
    });
    describe("View properties", function() {
      it("has a title, uri, etc.", function() {
        expect(showTodoView.getIconName()).toEqual('checklist');
        expect(showTodoView.getURI()).toEqual('atom://todo-show/todos');
        return expect(showTodoView.find('.btn-group')).toExist();
      });
      it("updates view info", function() {
        var count, getInfo;
        getInfo = function() {
          return showTodoView.todoInfo.text();
        };
        count = showTodoView.getTodosCount();
        expect(getInfo()).toBe("Found " + count + " results in workspace");
        showTodoView.collection.search();
        expect(getInfo()).toBe("Found ... results in workspace");
        waitsFor(function() {
          return !showTodoView.isSearching();
        });
        return runs(function() {
          expect(getInfo()).toBe("Found " + count + " results in workspace");
          showTodoView.collection.todos = ['a single todo'];
          showTodoView.updateInfo();
          return expect(getInfo()).toBe("Found 1 result in workspace");
        });
      });
      return it("updates view info details", function() {
        var getInfo;
        getInfo = function() {
          return showTodoView.todoInfo.text();
        };
        collection.setSearchScope('project');
        waitsFor(function() {
          return !showTodoView.isSearching();
        });
        return runs(function() {
          expect(getInfo()).toBe("Found 3 results in project sample1");
          collection.setSearchScope('open');
          waitsFor(function() {
            return !showTodoView.isSearching();
          });
          return runs(function() {
            return expect(getInfo()).toBe("Found 0 results in open files");
          });
        });
      });
    });
    return describe("Automatic update of todos", function() {
      it("refreshes on save", function() {
        expect(showTodoView.getTodos()).toHaveLength(3);
        waitsForPromise(function() {
          return atom.workspace.open('temp.txt');
        });
        return runs(function() {
          var editor;
          editor = atom.workspace.getActiveTextEditor();
          editor.setText("# TODO: Test");
          editor.save();
          waitsFor(function() {
            return !showTodoView.isSearching();
          });
          return runs(function() {
            expect(showTodoView.getTodos()).toHaveLength(4);
            editor.setText("");
            editor.save();
            waitsFor(function() {
              return !showTodoView.isSearching();
            });
            return runs(function() {
              return expect(showTodoView.getTodos()).toHaveLength(3);
            });
          });
        });
      });
      it("updates on search scope change", function() {
        expect(showTodoView.isSearching()).toBe(false);
        expect(collection.getSearchScope()).toBe('workspace');
        expect(showTodoView.getTodos()).toHaveLength(3);
        expect(collection.toggleSearchScope()).toBe('project');
        expect(showTodoView.isSearching()).toBe(true);
        waitsFor(function() {
          return !showTodoView.isSearching();
        });
        return runs(function() {
          expect(showTodoView.getTodos()).toHaveLength(3);
          expect(collection.toggleSearchScope()).toBe('open');
          expect(showTodoView.isSearching()).toBe(true);
          waitsFor(function() {
            return !showTodoView.isSearching();
          });
          return runs(function() {
            expect(showTodoView.getTodos()).toHaveLength(0);
            expect(collection.toggleSearchScope()).toBe('active');
            expect(showTodoView.isSearching()).toBe(true);
            waitsFor(function() {
              return !showTodoView.isSearching();
            });
            return runs(function() {
              expect(showTodoView.getTodos()).toHaveLength(0);
              expect(collection.toggleSearchScope()).toBe('workspace');
              return expect(showTodoView.isSearching()).toBe(true);
            });
          });
        });
      });
      it("handles search scope 'project'", function() {
        atom.project.addPath(sample2Path);
        waitsForPromise(function() {
          return atom.workspace.open(path.join(sample2Path, 'sample.txt'));
        });
        return runs(function() {
          collection.setSearchScope('workspace');
          waitsFor(function() {
            return !showTodoView.isSearching();
          });
          return runs(function() {
            expect(showTodoView.getTodos()).toHaveLength(9);
            collection.setSearchScope('project');
            expect(showTodoView.isSearching()).toBe(true);
            waitsFor(function() {
              return !showTodoView.isSearching();
            });
            return runs(function() {
              expect(showTodoView.getTodos()).toHaveLength(6);
              waitsForPromise(function() {
                return atom.workspace.open(path.join(sample1Path, 'sample.c'));
              });
              waitsFor(function() {
                return !showTodoView.isSearching();
              });
              return runs(function() {
                return expect(showTodoView.getTodos()).toHaveLength(3);
              });
            });
          });
        });
      });
      it("handles search scope 'open'", function() {
        waitsForPromise(function() {
          return atom.workspace.open('sample.c');
        });
        waitsFor(function() {
          return !showTodoView.isSearching();
        });
        return runs(function() {
          expect(showTodoView.getTodos()).toHaveLength(3);
          collection.setSearchScope('open');
          expect(showTodoView.isSearching()).toBe(true);
          waitsFor(function() {
            return !showTodoView.isSearching();
          });
          return runs(function() {
            expect(showTodoView.getTodos()).toHaveLength(1);
            waitsForPromise(function() {
              return atom.workspace.open('sample.js');
            });
            waitsFor(function() {
              return !showTodoView.isSearching();
            });
            return runs(function() {
              expect(showTodoView.getTodos()).toHaveLength(3);
              atom.workspace.getActivePane().itemAtIndex(0).destroy();
              waitsFor(function() {
                return !showTodoView.isSearching();
              });
              return runs(function() {
                return expect(showTodoView.getTodos()).toHaveLength(2);
              });
            });
          });
        });
      });
      return it("handles search scope 'active'", function() {
        waitsForPromise(function() {
          return atom.workspace.open('sample.c');
        });
        waitsForPromise(function() {
          return atom.workspace.open('sample.js');
        });
        waitsFor(function() {
          return !showTodoView.isSearching();
        });
        return runs(function() {
          expect(showTodoView.getTodos()).toHaveLength(3);
          collection.setSearchScope('active');
          expect(showTodoView.isSearching()).toBe(true);
          waitsFor(function() {
            return !showTodoView.isSearching();
          });
          return runs(function() {
            expect(showTodoView.getTodos()).toHaveLength(2);
            atom.workspace.getActivePane().activateItemAtIndex(0);
            waitsFor(function() {
              return !showTodoView.isSearching();
            });
            return runs(function() {
              return expect(showTodoView.getTodos()).toHaveLength(1);
            });
          });
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvZGRld2V5Ly5hdG9tL3BhY2thZ2VzL3RvZG8tc2hvdy9zcGVjL3RvZG8tdmlldy1zcGVjLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUVQLFlBQUEsR0FBZSxPQUFBLENBQVEsa0JBQVI7O0VBQ2YsZUFBQSxHQUFrQixPQUFBLENBQVEsd0JBQVI7O0VBRWxCLFdBQUEsR0FBYyxJQUFJLENBQUMsSUFBTCxDQUFVLFNBQVYsRUFBcUIsa0JBQXJCOztFQUNkLFdBQUEsR0FBYyxJQUFJLENBQUMsSUFBTCxDQUFVLFNBQVYsRUFBcUIsa0JBQXJCOztFQUVkLFFBQUEsQ0FBUyxnQkFBVCxFQUEyQixTQUFBO0FBQ3pCLFFBQUE7SUFBQSxNQUE2QixFQUE3QixFQUFDLHFCQUFELEVBQWU7SUFFZixVQUFBLENBQVcsU0FBQTtBQUNULFVBQUE7TUFBQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsMEJBQWhCLEVBQTRDLENBQUMsTUFBRCxDQUE1QztNQUNBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiwwQkFBaEIsRUFBNEMsa0NBQTVDO01BRUEsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFiLENBQXNCLENBQUMsV0FBRCxDQUF0QjtNQUNBLFVBQUEsR0FBYSxJQUFJO01BQ2pCLEdBQUEsR0FBTTtNQUNOLFlBQUEsR0FBbUIsSUFBQSxZQUFBLENBQWEsVUFBYixFQUF5QixHQUF6QjthQUNuQixRQUFBLENBQVMsU0FBQTtlQUFHLENBQUMsWUFBWSxDQUFDLFdBQWIsQ0FBQTtNQUFKLENBQVQ7SUFSUyxDQUFYO0lBVUEsUUFBQSxDQUFTLGlCQUFULEVBQTRCLFNBQUE7TUFDMUIsRUFBQSxDQUFHLHdCQUFILEVBQTZCLFNBQUE7UUFDM0IsTUFBQSxDQUFPLFlBQVksQ0FBQyxXQUFiLENBQUEsQ0FB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QUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLFVBQXBCO1FBQUgsQ0FBaEI7UUFDQSxlQUFBLENBQWdCLFNBQUE7aUJBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLFdBQXBCO1FBQUgsQ0FBaEI7UUFDQSxRQUFBLENBQVMsU0FBQTtpQkFBRyxDQUFDLFlBQVksQ0FBQyxXQUFiLENBQUE7UUFBSixDQUFUO2VBQ0EsSUFBQSxDQUFLLFNBQUE7VUFDSCxNQUFBLENBQU8sWUFBWSxDQUFDLFFBQWIsQ0FBQSxDQUFQLENBQStCLENBQUMsWUFBaEMsQ0FBNkMsQ0FBN0M7VUFDQSxVQUFVLENBQUMsY0FBWCxDQUEwQixRQUExQjtVQUNBLE1BQUEsQ0FBTyxZQUFZLENBQUMsV0FBYixDQUFBLENBQVAsQ0FBa0MsQ0FBQyxJQUFuQyxDQUF3QyxJQUF4QztVQUVBLFFBQUEsQ0FBUyxTQUFBO21CQUFHLENBQUMsWUFBWSxDQUFDLFdBQWIsQ0FBQTtVQUFKLENBQVQ7aUJBQ0EsSUFBQSxDQUFLLFNBQUE7WUFDSCxNQUFBLENBQU8sWUFBWSxDQUFDLFFBQWIsQ0FBQSxDQUFQLENBQStCLENBQUMsWUFBaEMsQ0FBNkMsQ0FBN0M7WUFDQSxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWYsQ0FBQSxDQUE4QixDQUFDLG1CQUEvQixDQUFtRCxDQUFuRDtZQUVBLFFBQUEsQ0FBUyxTQUFBO3FCQUFHLENBQUMsWUFBWSxDQUFDLFdBQWIsQ0FBQTtZQUFKLENBQVQ7bUJBQ0EsSUFBQSxDQUFLLFNBQUE7cUJBQ0gsTUFBQSxDQUFPLFlBQVksQ0FBQyxRQUFiLENBQUEsQ0FBUCxDQUErQixDQUFDLFlBQWhDLENBQTZDLENBQTdDO1lBREcsQ0FBTDtVQUxHLENBQUw7UUFORyxDQUFMO01BSmtDLENBQXBDO0lBM0ZvQyxDQUF0QztFQS9DeUIsQ0FBM0I7QUFSQSIsInNvdXJjZXNDb250ZW50IjpbInBhdGggPSByZXF1aXJlICdwYXRoJ1xuXG5TaG93VG9kb1ZpZXcgPSByZXF1aXJlICcuLi9saWIvdG9kby12aWV3J1xuVG9kb3NDb2xsZWN0aW9uID0gcmVxdWlyZSAnLi4vbGliL3RvZG8tY29sbGVjdGlvbidcblxuc2FtcGxlMVBhdGggPSBwYXRoLmpvaW4oX19kaXJuYW1lLCAnZml4dHVyZXMvc2FtcGxlMScpXG5zYW1wbGUyUGF0aCA9IHBhdGguam9pbihfX2Rpcm5hbWUsICdmaXh0dXJlcy9zYW1wbGUyJylcblxuZGVzY3JpYmUgXCJTaG93IFRvZG8gVmlld1wiLCAtPlxuICBbc2hvd1RvZG9WaWV3LCBjb2xsZWN0aW9uXSA9IFtdXG5cbiAgYmVmb3JlRWFjaCAtPlxuICAgIGF0b20uY29uZmlnLnNldCAndG9kby1zaG93LmZpbmRUaGVzZVRvZG9zJywgWydUT0RPJ11cbiAgICBhdG9tLmNvbmZpZy5zZXQgJ3RvZG8tc2hvdy5maW5kVXNpbmdSZWdleCcsICcvXFxcXGIoJHtUT0RPU30pOj9cXFxcZCooJHxcXFxccy4qJCkvZydcblxuICAgIGF0b20ucHJvamVjdC5zZXRQYXRocyBbc2FtcGxlMVBhdGhdXG4gICAgY29sbGVjdGlvbiA9IG5ldyBUb2Rvc0NvbGxlY3Rpb25cbiAgICB1cmkgPSAnYXRvbTovL3RvZG8tc2hvdy90b2RvcydcbiAgICBzaG93VG9kb1ZpZXcgPSBuZXcgU2hvd1RvZG9WaWV3KGNvbGxlY3Rpb24sIHVyaSlcbiAgICB3YWl0c0ZvciAtPiAhc2hvd1RvZG9WaWV3LmlzU2VhcmNoaW5nKClcblxuICBkZXNjcmliZSBcIlZpZXcgcHJvcGVydGllc1wiLCAtPlxuICAgIGl0IFwiaGFzIGEgdGl0bGUsIHVyaSwgZXRjLlwiLCAtPlxuICAgICAgZXhwZWN0KHNob3dUb2RvVmlldy5nZXRJY29uTmFtZSgpKS50b0VxdWFsICdjaGVja2xpc3QnXG4gICAgICBleHBlY3Qoc2hvd1RvZG9WaWV3LmdldFVSSSgpKS50b0VxdWFsICdhdG9tOi8vdG9kby1zaG93L3RvZG9zJ1xuICAgICAgZXhwZWN0KHNob3dUb2RvVmlldy5maW5kKCcuYnRuLWdyb3VwJykpLnRvRXhpc3QoKVxuXG4gICAgaXQgXCJ1cGRhdGVzIHZpZXcgaW5mb1wiLCAtPlxuICAgICAgZ2V0SW5mbyA9IC0+IHNob3dUb2RvVmlldy50b2RvSW5mby50ZXh0KClcblxuICAgICAgY291bnQgPSBzaG93VG9kb1ZpZXcuZ2V0VG9kb3NDb3VudCgpXG4gICAgICBleHBlY3QoZ2V0SW5mbygpKS50b0JlIFwiRm91bmQgI3tjb3VudH0gcmVzdWx0cyBpbiB3b3Jrc3BhY2VcIlxuICAgICAgc2hvd1RvZG9WaWV3LmNvbGxlY3Rpb24uc2VhcmNoKClcbiAgICAgIGV4cGVjdChnZXRJbmZvKCkpLnRvQmUgXCJGb3VuZCAuLi4gcmVzdWx0cyBpbiB3b3Jrc3BhY2VcIlxuXG4gICAgICB3YWl0c0ZvciAtPiAhc2hvd1RvZG9WaWV3LmlzU2VhcmNoaW5nKClcbiAgICAgIHJ1bnMgLT5cbiAgICAgICAgZXhwZWN0KGdldEluZm8oKSkudG9CZSBcIkZvdW5kICN7Y291bnR9IHJlc3VsdHMgaW4gd29ya3NwYWNlXCJcbiAgICAgICAgc2hvd1RvZG9WaWV3LmNvbGxlY3Rpb24udG9kb3MgPSBbJ2Egc2luZ2xlIHRvZG8nXVxuICAgICAgICBzaG93VG9kb1ZpZXcudXBkYXRlSW5mbygpXG4gICAgICAgIGV4cGVjdChnZXRJbmZvKCkpLnRvQmUgXCJGb3VuZCAxIHJlc3VsdCBpbiB3b3Jrc3BhY2VcIlxuXG4gICAgaXQgXCJ1cGRhdGVzIHZpZXcgaW5mbyBkZXRhaWxzXCIsIC0+XG4gICAgICBnZXRJbmZvID0gLT4gc2hvd1RvZG9WaWV3LnRvZG9JbmZvLnRleHQoKVxuXG4gICAgICBjb2xsZWN0aW9uLnNldFNlYXJjaFNjb3BlKCdwcm9qZWN0JylcbiAgICAgIHdhaXRzRm9yIC0+ICFzaG93VG9kb1ZpZXcuaXNTZWFyY2hpbmcoKVxuICAgICAgcnVucyAtPlxuICAgICAgICBleHBlY3QoZ2V0SW5mbygpKS50b0JlIFwiRm91bmQgMyByZXN1bHRzIGluIHByb2plY3Qgc2FtcGxlMVwiXG5cbiAgICAgICAgY29sbGVjdGlvbi5zZXRTZWFyY2hTY29wZSgnb3BlbicpXG4gICAgICAgIHdhaXRzRm9yIC0+ICFzaG93VG9kb1ZpZXcuaXNTZWFyY2hpbmcoKVxuICAgICAgICBydW5zIC0+XG4gICAgICAgICAgZXhwZWN0KGdldEluZm8oKSkudG9CZSBcIkZvdW5kIDAgcmVzdWx0cyBpbiBvcGVuIGZpbGVzXCJcblxuICBkZXNjcmliZSBcIkF1dG9tYXRpYyB1cGRhdGUgb2YgdG9kb3NcIiwgLT5cbiAgICBpdCBcInJlZnJlc2hlcyBvbiBzYXZlXCIsIC0+XG4gICAgICBleHBlY3Qoc2hvd1RvZG9WaWV3LmdldFRvZG9zKCkpLnRvSGF2ZUxlbmd0aCAzXG5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPiBhdG9tLndvcmtzcGFjZS5vcGVuICd0ZW1wLnR4dCdcbiAgICAgIHJ1bnMgLT5cbiAgICAgICAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgICAgIGVkaXRvci5zZXRUZXh0KFwiIyBUT0RPOiBUZXN0XCIpXG4gICAgICAgIGVkaXRvci5zYXZlKClcblxuICAgICAgICB3YWl0c0ZvciAtPiAhc2hvd1RvZG9WaWV3LmlzU2VhcmNoaW5nKClcbiAgICAgICAgcnVucyAtPlxuICAgICAgICAgIGV4cGVjdChzaG93VG9kb1ZpZXcuZ2V0VG9kb3MoKSkudG9IYXZlTGVuZ3RoIDRcbiAgICAgICAgICBlZGl0b3Iuc2V0VGV4dChcIlwiKVxuICAgICAgICAgIGVkaXRvci5zYXZlKClcblxuICAgICAgICAgIHdhaXRzRm9yIC0+ICFzaG93VG9kb1ZpZXcuaXNTZWFyY2hpbmcoKVxuICAgICAgICAgIHJ1bnMgLT5cbiAgICAgICAgICAgIGV4cGVjdChzaG93VG9kb1ZpZXcuZ2V0VG9kb3MoKSkudG9IYXZlTGVuZ3RoIDNcblxuICAgIGl0IFwidXBkYXRlcyBvbiBzZWFyY2ggc2NvcGUgY2hhbmdlXCIsIC0+XG4gICAgICBleHBlY3Qoc2hvd1RvZG9WaWV3LmlzU2VhcmNoaW5nKCkpLnRvQmUgZmFsc2VcbiAgICAgIGV4cGVjdChjb2xsZWN0aW9uLmdldFNlYXJjaFNjb3BlKCkpLnRvQmUgJ3dvcmtzcGFjZSdcbiAgICAgIGV4cGVjdChzaG93VG9kb1ZpZXcuZ2V0VG9kb3MoKSkudG9IYXZlTGVuZ3RoIDNcbiAgICAgIGV4cGVjdChjb2xsZWN0aW9uLnRvZ2dsZVNlYXJjaFNjb3BlKCkpLnRvQmUgJ3Byb2plY3QnXG4gICAgICBleHBlY3Qoc2hvd1RvZG9WaWV3LmlzU2VhcmNoaW5nKCkpLnRvQmUgdHJ1ZVxuXG4gICAgICB3YWl0c0ZvciAtPiAhc2hvd1RvZG9WaWV3LmlzU2VhcmNoaW5nKClcbiAgICAgIHJ1bnMgLT5cbiAgICAgICAgZXhwZWN0KHNob3dUb2RvVmlldy5nZXRUb2RvcygpKS50b0hhdmVMZW5ndGggM1xuICAgICAgICBleHBlY3QoY29sbGVjdGlvbi50b2dnbGVTZWFyY2hTY29wZSgpKS50b0JlICdvcGVuJ1xuICAgICAgICBleHBlY3Qoc2hvd1RvZG9WaWV3LmlzU2VhcmNoaW5nKCkpLnRvQmUgdHJ1ZVxuXG4gICAgICAgIHdhaXRzRm9yIC0+ICFzaG93VG9kb1ZpZXcuaXNTZWFyY2hpbmcoKVxuICAgICAgICBydW5zIC0+XG4gICAgICAgICAgZXhwZWN0KHNob3dUb2RvVmlldy5nZXRUb2RvcygpKS50b0hhdmVMZW5ndGggMFxuICAgICAgICAgIGV4cGVjdChjb2xsZWN0aW9uLnRvZ2dsZVNlYXJjaFNjb3BlKCkpLnRvQmUgJ2FjdGl2ZSdcbiAgICAgICAgICBleHBlY3Qoc2hvd1RvZG9WaWV3LmlzU2VhcmNoaW5nKCkpLnRvQmUgdHJ1ZVxuXG4gICAgICAgICAgd2FpdHNGb3IgLT4gIXNob3dUb2RvVmlldy5pc1NlYXJjaGluZygpXG4gICAgICAgICAgcnVucyAtPlxuICAgICAgICAgICAgZXhwZWN0KHNob3dUb2RvVmlldy5nZXRUb2RvcygpKS50b0hhdmVMZW5ndGggMFxuICAgICAgICAgICAgZXhwZWN0KGNvbGxlY3Rpb24udG9nZ2xlU2VhcmNoU2NvcGUoKSkudG9CZSAnd29ya3NwYWNlJ1xuICAgICAgICAgICAgZXhwZWN0KHNob3dUb2RvVmlldy5pc1NlYXJjaGluZygpKS50b0JlIHRydWVcblxuICAgIGl0IFwiaGFuZGxlcyBzZWFyY2ggc2NvcGUgJ3Byb2plY3QnXCIsIC0+XG4gICAgICBhdG9tLnByb2plY3QuYWRkUGF0aCBzYW1wbGUyUGF0aFxuXG4gICAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgICAgYXRvbS53b3Jrc3BhY2Uub3BlbiBwYXRoLmpvaW4oc2FtcGxlMlBhdGgsICdzYW1wbGUudHh0JylcbiAgICAgIHJ1bnMgLT5cbiAgICAgICAgY29sbGVjdGlvbi5zZXRTZWFyY2hTY29wZSAnd29ya3NwYWNlJ1xuXG4gICAgICAgIHdhaXRzRm9yIC0+ICFzaG93VG9kb1ZpZXcuaXNTZWFyY2hpbmcoKVxuICAgICAgICBydW5zIC0+XG4gICAgICAgICAgZXhwZWN0KHNob3dUb2RvVmlldy5nZXRUb2RvcygpKS50b0hhdmVMZW5ndGggOVxuICAgICAgICAgIGNvbGxlY3Rpb24uc2V0U2VhcmNoU2NvcGUgJ3Byb2plY3QnXG4gICAgICAgICAgZXhwZWN0KHNob3dUb2RvVmlldy5pc1NlYXJjaGluZygpKS50b0JlIHRydWVcblxuICAgICAgICAgIHdhaXRzRm9yIC0+ICFzaG93VG9kb1ZpZXcuaXNTZWFyY2hpbmcoKVxuICAgICAgICAgIHJ1bnMgLT5cbiAgICAgICAgICAgIGV4cGVjdChzaG93VG9kb1ZpZXcuZ2V0VG9kb3MoKSkudG9IYXZlTGVuZ3RoIDZcblxuICAgICAgICAgICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICAgICAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4gcGF0aC5qb2luKHNhbXBsZTFQYXRoLCAnc2FtcGxlLmMnKVxuICAgICAgICAgICAgd2FpdHNGb3IgLT4gIXNob3dUb2RvVmlldy5pc1NlYXJjaGluZygpXG4gICAgICAgICAgICBydW5zIC0+XG4gICAgICAgICAgICAgIGV4cGVjdChzaG93VG9kb1ZpZXcuZ2V0VG9kb3MoKSkudG9IYXZlTGVuZ3RoIDNcblxuICAgIGl0IFwiaGFuZGxlcyBzZWFyY2ggc2NvcGUgJ29wZW4nXCIsIC0+XG4gICAgICB3YWl0c0ZvclByb21pc2UgLT4gYXRvbS53b3Jrc3BhY2Uub3BlbiAnc2FtcGxlLmMnXG4gICAgICB3YWl0c0ZvciAtPiAhc2hvd1RvZG9WaWV3LmlzU2VhcmNoaW5nKClcbiAgICAgIHJ1bnMgLT5cbiAgICAgICAgZXhwZWN0KHNob3dUb2RvVmlldy5nZXRUb2RvcygpKS50b0hhdmVMZW5ndGggM1xuICAgICAgICBjb2xsZWN0aW9uLnNldFNlYXJjaFNjb3BlICdvcGVuJ1xuICAgICAgICBleHBlY3Qoc2hvd1RvZG9WaWV3LmlzU2VhcmNoaW5nKCkpLnRvQmUgdHJ1ZVxuXG4gICAgICAgIHdhaXRzRm9yIC0+ICFzaG93VG9kb1ZpZXcuaXNTZWFyY2hpbmcoKVxuICAgICAgICBydW5zIC0+XG4gICAgICAgICAgZXhwZWN0KHNob3dUb2RvVmlldy5nZXRUb2RvcygpKS50b0hhdmVMZW5ndGggMVxuXG4gICAgICAgICAgd2FpdHNGb3JQcm9taXNlIC0+IGF0b20ud29ya3NwYWNlLm9wZW4gJ3NhbXBsZS5qcydcbiAgICAgICAgICB3YWl0c0ZvciAtPiAhc2hvd1RvZG9WaWV3LmlzU2VhcmNoaW5nKClcbiAgICAgICAgICBydW5zIC0+XG4gICAgICAgICAgICBleHBlY3Qoc2hvd1RvZG9WaWV3LmdldFRvZG9zKCkpLnRvSGF2ZUxlbmd0aCAzXG4gICAgICAgICAgICBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lKCkuaXRlbUF0SW5kZXgoMCkuZGVzdHJveSgpXG5cbiAgICAgICAgICAgIHdhaXRzRm9yIC0+ICFzaG93VG9kb1ZpZXcuaXNTZWFyY2hpbmcoKVxuICAgICAgICAgICAgcnVucyAtPlxuICAgICAgICAgICAgICBleHBlY3Qoc2hvd1RvZG9WaWV3LmdldFRvZG9zKCkpLnRvSGF2ZUxlbmd0aCAyXG5cbiAgICBpdCBcImhhbmRsZXMgc2VhcmNoIHNjb3BlICdhY3RpdmUnXCIsIC0+XG4gICAgICB3YWl0c0ZvclByb21pc2UgLT4gYXRvbS53b3Jrc3BhY2Uub3BlbiAnc2FtcGxlLmMnXG4gICAgICB3YWl0c0ZvclByb21pc2UgLT4gYXRvbS53b3Jrc3BhY2Uub3BlbiAnc2FtcGxlLmpzJ1xuICAgICAgd2FpdHNGb3IgLT4gIXNob3dUb2RvVmlldy5pc1NlYXJjaGluZygpXG4gICAgICBydW5zIC0+XG4gICAgICAgIGV4cGVjdChzaG93VG9kb1ZpZXcuZ2V0VG9kb3MoKSkudG9IYXZlTGVuZ3RoIDNcbiAgICAgICAgY29sbGVjdGlvbi5zZXRTZWFyY2hTY29wZSAnYWN0aXZlJ1xuICAgICAgICBleHBlY3Qoc2hvd1RvZG9WaWV3LmlzU2VhcmNoaW5nKCkpLnRvQmUgdHJ1ZVxuXG4gICAgICAgIHdhaXRzRm9yIC0+ICFzaG93VG9kb1ZpZXcuaXNTZWFyY2hpbmcoKVxuICAgICAgICBydW5zIC0+XG4gICAgICAgICAgZXhwZWN0KHNob3dUb2RvVmlldy5nZXRUb2RvcygpKS50b0hhdmVMZW5ndGggMlxuICAgICAgICAgIGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmUoKS5hY3RpdmF0ZUl0ZW1BdEluZGV4IDBcblxuICAgICAgICAgIHdhaXRzRm9yIC0+ICFzaG93VG9kb1ZpZXcuaXNTZWFyY2hpbmcoKVxuICAgICAgICAgIHJ1bnMgLT5cbiAgICAgICAgICAgIGV4cGVjdChzaG93VG9kb1ZpZXcuZ2V0VG9kb3MoKSkudG9IYXZlTGVuZ3RoIDFcbiJdfQ==
