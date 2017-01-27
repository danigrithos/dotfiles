(function() {
  var ShowTodo, TodoCollection, TodoModel, TodoRegex, fixturesPath, path, sample1Path, sample2Path;

  path = require('path');

  TodoCollection = require('../lib/todo-collection');

  ShowTodo = require('../lib/show-todo');

  TodoModel = require('../lib/todo-model');

  TodoRegex = require('../lib/todo-regex');

  sample1Path = path.join(__dirname, 'fixtures/sample1');

  sample2Path = path.join(__dirname, 'fixtures/sample2');

  fixturesPath = path.join(__dirname, 'fixtures');

  describe('Todo Collection', function() {
    var addTestTodos, collection, defaultShowInTable, ref, todoRegex;
    ref = [], collection = ref[0], todoRegex = ref[1], defaultShowInTable = ref[2];
    addTestTodos = function() {
      collection.addTodo(new TodoModel({
        all: '#FIXME: fixme 1',
        loc: 'file1.txt',
        position: [[3, 6], [3, 10]],
        regex: todoRegex.regex,
        regexp: todoRegex.regexp
      }));
      collection.addTodo(new TodoModel({
        all: '#TODO: todo 1',
        loc: 'file1.txt',
        position: [[4, 5], [4, 9]],
        regex: todoRegex.regex,
        regexp: todoRegex.regexp
      }));
      return collection.addTodo(new TodoModel({
        all: '#FIXME: fixme 2',
        loc: 'file2.txt',
        position: [[5, 7], [5, 11]],
        regex: todoRegex.regex,
        regexp: todoRegex.regexp
      }));
    };
    beforeEach(function() {
      todoRegex = new TodoRegex(ShowTodo.config.findUsingRegex["default"], ['FIXME', 'TODO']);
      defaultShowInTable = ['Text', 'Type', 'File'];
      collection = new TodoCollection;
      return atom.project.setPaths([sample1Path]);
    });
    describe('fetchRegexItem(todoRegex)', function() {
      it('scans project for regex', function() {
        waitsForPromise(function() {
          return collection.fetchRegexItem(todoRegex);
        });
        return runs(function() {
          expect(collection.todos).toHaveLength(4);
          expect(collection.todos[0].text).toBe('Comment in C');
          expect(collection.todos[1].text).toBe('This is the first todo');
          expect(collection.todos[2].text).toBe('This is the second todo');
          return expect(collection.todos[3].text).toBe('Add more annnotations :)');
        });
      });
      it('scans full workspace', function() {
        atom.project.addPath(sample2Path);
        waitsForPromise(function() {
          return collection.fetchRegexItem(todoRegex);
        });
        return runs(function() {
          return expect(collection.todos).toHaveLength(10);
        });
      });
      it('should handle other regexes', function() {
        waitsForPromise(function() {
          todoRegex.regexp = /#include(.+)/g;
          return collection.fetchRegexItem(todoRegex);
        });
        return runs(function() {
          expect(collection.todos).toHaveLength(1);
          return expect(collection.todos[0].text).toBe('<stdio.h>');
        });
      });
      it('should handle special character regexes', function() {
        waitsForPromise(function() {
          todoRegex.regexp = /This is the (?:first|second) todo/g;
          return collection.fetchRegexItem(todoRegex);
        });
        return runs(function() {
          expect(collection.todos).toHaveLength(2);
          expect(collection.todos[0].text).toBe('This is the first todo');
          return expect(collection.todos[1].text).toBe('This is the second todo');
        });
      });
      it('should handle regex without capture group', function() {
        var lookup;
        lookup = {
          title: 'This is Code',
          regex: ''
        };
        waitsForPromise(function() {
          todoRegex.regexp = /[\w\s]+code[\w\s]*/g;
          return collection.fetchRegexItem(todoRegex);
        });
        return runs(function() {
          expect(collection.todos).toHaveLength(1);
          return expect(collection.todos[0].text).toBe('Sample quicksort code');
        });
      });
      it('should handle post-annotations with special regex', function() {
        waitsForPromise(function() {
          todoRegex.regexp = /(.+).{3}DEBUG\s*$/g;
          return collection.fetchRegexItem(todoRegex);
        });
        return runs(function() {
          expect(collection.todos).toHaveLength(1);
          return expect(collection.todos[0].text).toBe('return sort(Array.apply(this, arguments));');
        });
      });
      it('should handle post-annotations with non-capturing group', function() {
        waitsForPromise(function() {
          todoRegex.regexp = /(.+?(?=.{3}DEBUG\s*$))/;
          return collection.fetchRegexItem(todoRegex);
        });
        return runs(function() {
          expect(collection.todos).toHaveLength(1);
          return expect(collection.todos[0].text).toBe('return sort(Array.apply(this, arguments));');
        });
      });
      it('should truncate todos longer than the defined max length of 120', function() {
        waitsForPromise(function() {
          todoRegex.regexp = /LOONG:?(.+$)/g;
          return collection.fetchRegexItem(todoRegex);
        });
        return runs(function() {
          var text, text2;
          text = 'Lorem ipsum dolor sit amet, dapibus rhoncus. Scelerisque quam,';
          text += ' id ante molestias, ipsum lorem magnis et. A eleifend i...';
          text2 = '_SpgLE84Ms1K4DSumtJDoNn8ZECZLL+VR0DoGydy54vUoSpgLE84Ms1K4DSum';
          text2 += 'tJDoNn8ZECZLLVR0DoGydy54vUonRClXwLbFhX2gMwZgjx250ay+V0lF...';
          expect(collection.todos[0].text).toHaveLength(120);
          expect(collection.todos[0].text).toBe(text);
          expect(collection.todos[1].text).toHaveLength(120);
          return expect(collection.todos[1].text).toBe(text2);
        });
      });
      return it('should strip common block comment endings', function() {
        atom.project.setPaths([sample2Path]);
        waitsForPromise(function() {
          return collection.fetchRegexItem(todoRegex);
        });
        return runs(function() {
          expect(collection.todos).toHaveLength(6);
          expect(collection.todos[0].text).toBe('C block comment');
          expect(collection.todos[1].text).toBe('HTML comment');
          expect(collection.todos[2].text).toBe('PowerShell comment');
          expect(collection.todos[3].text).toBe('Haskell comment');
          expect(collection.todos[4].text).toBe('Lua comment');
          return expect(collection.todos[5].text).toBe('PHP comment');
        });
      });
    });
    describe('fetchRegexItem(todoRegex, activeProjectOnly)', function() {
      beforeEach(function() {
        return atom.project.addPath(sample2Path);
      });
      it('scans active project for regex', function() {
        collection.setActiveProject(sample1Path);
        waitsForPromise(function() {
          return collection.fetchRegexItem(todoRegex, true);
        });
        return runs(function() {
          expect(collection.todos).toHaveLength(4);
          expect(collection.todos[0].text).toBe('Comment in C');
          expect(collection.todos[1].text).toBe('This is the first todo');
          expect(collection.todos[2].text).toBe('This is the second todo');
          return expect(collection.todos[3].text).toBe('Add more annnotations :)');
        });
      });
      it('changes active project', function() {
        collection.setActiveProject(sample2Path);
        waitsForPromise(function() {
          return collection.fetchRegexItem(todoRegex, true);
        });
        return runs(function() {
          expect(collection.todos).toHaveLength(6);
          collection.clear();
          collection.setActiveProject(sample1Path);
          waitsForPromise(function() {
            return collection.fetchRegexItem(todoRegex, true);
          });
          return runs(function() {
            return expect(collection.todos).toHaveLength(4);
          });
        });
      });
      it('still respects ignored paths', function() {
        atom.config.set('todo-show.ignoreThesePaths', ['sample.js']);
        waitsForPromise(function() {
          return collection.fetchRegexItem(todoRegex, true);
        });
        return runs(function() {
          expect(collection.todos).toHaveLength(1);
          return expect(collection.todos[0].text).toBe('Comment in C');
        });
      });
      return it('handles no project situations', function() {
        expect(collection.activeProject).not.toBeDefined();
        expect(path.basename(collection.getActiveProject())).toBe('sample1');
        atom.project.setPaths([]);
        collection.activeProject = void 0;
        waitsForPromise(function() {
          return collection.fetchRegexItem(todoRegex, true);
        });
        return runs(function() {
          return expect(collection.todos).toHaveLength(0);
        });
      });
    });
    describe('ignore path rules', function() {
      it('works with no paths added', function() {
        atom.config.set('todo-show.ignoreThesePaths', []);
        waitsForPromise(function() {
          return collection.fetchRegexItem(todoRegex);
        });
        return runs(function() {
          return expect(collection.todos).toHaveLength(4);
        });
      });
      it('must be an array', function() {
        var notificationSpy;
        collection.onDidFailSearch(notificationSpy = jasmine.createSpy());
        atom.config.set('todo-show.ignoreThesePaths', '123');
        waitsForPromise(function() {
          return collection.fetchRegexItem(todoRegex);
        });
        return runs(function() {
          var notification;
          expect(collection.todos).toHaveLength(4);
          notification = notificationSpy.mostRecentCall.args[0];
          expect(notificationSpy).toHaveBeenCalled();
          return expect(notification.indexOf('ignoreThesePaths')).not.toBe(-1);
        });
      });
      it('respects ignored files', function() {
        atom.config.set('todo-show.ignoreThesePaths', ['sample.js']);
        waitsForPromise(function() {
          return collection.fetchRegexItem(todoRegex);
        });
        return runs(function() {
          expect(collection.todos).toHaveLength(1);
          return expect(collection.todos[0].text).toBe('Comment in C');
        });
      });
      it('respects ignored directories and filetypes', function() {
        atom.project.setPaths([fixturesPath]);
        atom.config.set('todo-show.ignoreThesePaths', ['sample1', '*.md']);
        waitsForPromise(function() {
          return collection.fetchRegexItem(todoRegex);
        });
        return runs(function() {
          expect(collection.todos).toHaveLength(6);
          return expect(collection.todos[0].text).toBe('C block comment');
        });
      });
      it('respects ignored wildcard directories', function() {
        atom.project.setPaths([fixturesPath]);
        atom.config.set('todo-show.ignoreThesePaths', ['**/sample.js', '**/sample.txt', '*.md']);
        waitsForPromise(function() {
          return collection.fetchRegexItem(todoRegex);
        });
        return runs(function() {
          expect(collection.todos).toHaveLength(1);
          return expect(collection.todos[0].text).toBe('Comment in C');
        });
      });
      return it('respects more advanced ignores', function() {
        atom.project.setPaths([fixturesPath]);
        atom.config.set('todo-show.ignoreThesePaths', ['output(-grouped)?\\.*', '*1/**']);
        waitsForPromise(function() {
          return collection.fetchRegexItem(todoRegex);
        });
        return runs(function() {
          expect(collection.todos).toHaveLength(6);
          return expect(collection.todos[0].text).toBe('C block comment');
        });
      });
    });
    describe('fetchOpenRegexItem(lookupObj)', function() {
      var editor;
      editor = null;
      beforeEach(function() {
        waitsForPromise(function() {
          return atom.workspace.open('sample.c');
        });
        return runs(function() {
          return editor = atom.workspace.getActiveTextEditor();
        });
      });
      it('scans open files for the regex that is passed and fill lookup results', function() {
        waitsForPromise(function() {
          return collection.fetchOpenRegexItem(todoRegex);
        });
        return runs(function() {
          expect(collection.todos).toHaveLength(1);
          expect(collection.todos.length).toBe(1);
          return expect(collection.todos[0].text).toBe('Comment in C');
        });
      });
      it('works with files outside of workspace', function() {
        waitsForPromise(function() {
          return atom.workspace.open('../sample2/sample.txt');
        });
        return runs(function() {
          waitsForPromise(function() {
            return collection.fetchOpenRegexItem(todoRegex);
          });
          return runs(function() {
            expect(collection.todos).toHaveLength(7);
            expect(collection.todos[0].text).toBe('Comment in C');
            expect(collection.todos[1].text).toBe('C block comment');
            return expect(collection.todos[6].text).toBe('PHP comment');
          });
        });
      });
      it('handles unsaved documents', function() {
        editor.setText('TODO: New todo');
        waitsForPromise(function() {
          return collection.fetchOpenRegexItem(todoRegex);
        });
        return runs(function() {
          expect(collection.todos).toHaveLength(1);
          expect(collection.todos[0].type).toBe('TODO');
          return expect(collection.todos[0].text).toBe('New todo');
        });
      });
      it('ignores todo without leading space', function() {
        editor.setText('A line // TODO:text');
        waitsForPromise(function() {
          return collection.fetchOpenRegexItem(todoRegex);
        });
        return runs(function() {
          return expect(collection.todos).toHaveLength(0);
        });
      });
      it('ignores todo with unwanted characters', function() {
        editor.setText('define("_JS_TODO_ALERT_", "js:alert(&quot;TODO&quot;);");');
        waitsForPromise(function() {
          return collection.fetchOpenRegexItem(todoRegex);
        });
        return runs(function() {
          return expect(collection.todos).toHaveLength(0);
        });
      });
      it('ignores binary data', function() {
        editor.setText('// TODOe�d��RPPP0�');
        waitsForPromise(function() {
          return collection.fetchOpenRegexItem(todoRegex);
        });
        return runs(function() {
          return expect(collection.todos).toHaveLength(0);
        });
      });
      return it('does not add duplicates', function() {
        addTestTodos();
        expect(collection.todos).toHaveLength(3);
        addTestTodos();
        return expect(collection.todos).toHaveLength(3);
      });
    });
    describe('getActiveProject', function() {
      beforeEach(function() {
        return atom.project.addPath(sample2Path);
      });
      it('returns active project', function() {
        collection.activeProject = sample2Path;
        return expect(collection.getActiveProject()).toBe(sample2Path);
      });
      it('falls back to first project', function() {
        return expect(collection.getActiveProject()).toBe(sample1Path);
      });
      it('falls back to first open item', function() {
        waitsForPromise(function() {
          return atom.workspace.open(path.join(sample2Path, 'sample.txt'));
        });
        return runs(function() {
          return expect(collection.getActiveProject()).toBe(sample2Path);
        });
      });
      return it('handles no project paths', function() {
        atom.project.setPaths([]);
        expect(collection.getActiveProject()).toBeFalsy();
        return expect(collection.activeProject).not.toBeDefined();
      });
    });
    describe('setActiveProject', function() {
      it('sets active project from file path and returns true if changed', function() {
        var res;
        atom.project.addPath(sample2Path);
        expect(collection.getActiveProject()).toBe(sample1Path);
        res = collection.setActiveProject(path.join(sample2Path, 'sample.txt'));
        expect(res).toBe(true);
        expect(collection.getActiveProject()).toBe(sample2Path);
        res = collection.setActiveProject(path.join(sample2Path, 'sample.txt'));
        return expect(res).toBe(false);
      });
      it('ignores if file is not in project', function() {
        var res;
        res = collection.setActiveProject(path.join(sample2Path, 'sample.txt'));
        expect(res).toBe(false);
        return expect(collection.getActiveProject()).toBe(sample1Path);
      });
      return it('handles invalid arguments', function() {
        expect(collection.setActiveProject()).toBe(false);
        expect(collection.activeProject).not.toBeDefined();
        expect(collection.setActiveProject(false)).toBe(false);
        expect(collection.activeProject).not.toBeDefined();
        expect(collection.setActiveProject({})).toBe(false);
        return expect(collection.activeProject).not.toBeDefined();
      });
    });
    describe('Sort todos', function() {
      var sortSpy;
      sortSpy = [].sortSpy;
      beforeEach(function() {
        addTestTodos();
        collection.addTodo(new TodoModel({
          all: '#FIXME: fixme 3',
          loc: 'file1.txt',
          position: [[12, 14], [12, 16]],
          regex: todoRegex.regex,
          regexp: todoRegex.regexp
        }));
        atom.config.set('todo-show.findTheseTodos', ['FIXME', 'TODO']);
        sortSpy = jasmine.createSpy();
        return collection.onDidSortTodos(sortSpy);
      });
      it('can sort simple todos', function() {
        collection.sortTodos({
          sortBy: 'Text',
          sortAsc: false
        });
        expect(collection.todos[0].text).toBe('todo 1');
        expect(collection.todos[3].text).toBe('fixme 1');
        collection.sortTodos({
          sortBy: 'Text',
          sortAsc: true
        });
        expect(collection.todos[0].text).toBe('fixme 1');
        expect(collection.todos[3].text).toBe('todo 1');
        collection.sortTodos({
          sortBy: 'Text'
        });
        expect(collection.todos[0].text).toBe('todo 1');
        expect(collection.todos[3].text).toBe('fixme 1');
        collection.sortTodos({
          sortAsc: true
        });
        expect(collection.todos[0].text).toBe('fixme 1');
        expect(collection.todos[3].text).toBe('todo 1');
        collection.sortTodos();
        expect(collection.todos[0].text).toBe('todo 1');
        return expect(collection.todos[3].text).toBe('fixme 1');
      });
      it('sort by other values', function() {
        collection.sortTodos({
          sortBy: 'Range',
          sortAsc: true
        });
        expect(collection.todos[0].range).toBe('3,6,3,10');
        expect(collection.todos[2].range).toBe('5,7,5,11');
        expect(collection.todos[3].range).toBe('12,14,12,16');
        collection.sortTodos({
          sortBy: 'File',
          sortAsc: false
        });
        expect(collection.todos[0].path).toBe('file2.txt');
        return expect(collection.todos[3].path).toBe('file1.txt');
      });
      it('sort line as number', function() {
        collection.sortTodos({
          sortBy: 'Line',
          sortAsc: true
        });
        expect(collection.todos[0].line).toBe('4');
        expect(collection.todos[1].line).toBe('5');
        expect(collection.todos[2].line).toBe('6');
        expect(collection.todos[3].line).toBe('13');
        collection.sortTodos({
          sortBy: 'Range',
          sortAsc: true
        });
        expect(collection.todos[0].range).toBe('3,6,3,10');
        expect(collection.todos[1].range).toBe('4,5,4,9');
        expect(collection.todos[2].range).toBe('5,7,5,11');
        return expect(collection.todos[3].range).toBe('12,14,12,16');
      });
      it('performs a stable sort', function() {
        collection.sortTodos({
          sortBy: 'File',
          sortAsc: true
        });
        expect(collection.todos[0].text).toBe('fixme 1');
        expect(collection.todos[1].text).toBe('fixme 3');
        expect(collection.todos[2].text).toBe('todo 1');
        expect(collection.todos[3].text).toBe('fixme 2');
        collection.sortTodos({
          sortBy: 'Text',
          sortAsc: false
        });
        expect(collection.todos[0].text).toBe('todo 1');
        expect(collection.todos[1].text).toBe('fixme 3');
        expect(collection.todos[2].text).toBe('fixme 2');
        expect(collection.todos[3].text).toBe('fixme 1');
        collection.sortTodos({
          sortBy: 'File',
          sortAsc: true
        });
        expect(collection.todos[0].text).toBe('todo 1');
        expect(collection.todos[1].text).toBe('fixme 3');
        expect(collection.todos[2].text).toBe('fixme 1');
        expect(collection.todos[3].text).toBe('fixme 2');
        collection.sortTodos({
          sortBy: 'Type',
          sortAsc: true
        });
        expect(collection.todos[0].text).toBe('fixme 3');
        expect(collection.todos[1].text).toBe('fixme 1');
        expect(collection.todos[2].text).toBe('fixme 2');
        return expect(collection.todos[3].text).toBe('todo 1');
      });
      return it('sorts type in the defined order', function() {
        collection.sortTodos({
          sortBy: 'Type',
          sortAsc: true
        });
        expect(collection.todos[0].text).toBe('fixme 1');
        expect(collection.todos[1].text).toBe('fixme 2');
        expect(collection.todos[2].text).toBe('fixme 3');
        expect(collection.todos[3].text).toBe('todo 1');
        atom.config.set('todo-show.findTheseTodos', ['TODO', 'FIXME']);
        collection.sortTodos({
          sortBy: 'Type',
          sortAsc: true
        });
        expect(collection.todos[0].text).toBe('todo 1');
        expect(collection.todos[1].text).toBe('fixme 1');
        expect(collection.todos[2].text).toBe('fixme 2');
        expect(collection.todos[3].text).toBe('fixme 3');
        collection.sortTodos({
          sortBy: 'Type',
          sortAsc: false
        });
        expect(collection.todos[0].text).toBe('fixme 3');
        expect(collection.todos[1].text).toBe('fixme 2');
        expect(collection.todos[2].text).toBe('fixme 1');
        return expect(collection.todos[3].text).toBe('todo 1');
      });
    });
    describe('Filter todos', function() {
      var filterSpy;
      filterSpy = [].filterSpy;
      beforeEach(function() {
        atom.config.set('todo-show.showInTable', defaultShowInTable);
        addTestTodos();
        filterSpy = jasmine.createSpy();
        return collection.onDidFilterTodos(filterSpy);
      });
      it('can filter simple todos', function() {
        collection.filterTodos('TODO');
        expect(filterSpy.callCount).toBe(1);
        return expect(filterSpy.calls[0].args[0]).toHaveLength(1);
      });
      it('can filter todos with multiple results', function() {
        collection.filterTodos('file1');
        expect(filterSpy.callCount).toBe(1);
        return expect(filterSpy.calls[0].args[0]).toHaveLength(2);
      });
      it('handles no results', function() {
        collection.filterTodos('XYZ');
        expect(filterSpy.callCount).toBe(1);
        return expect(filterSpy.calls[0].args[0]).toHaveLength(0);
      });
      it('handles empty filter', function() {
        collection.filterTodos('');
        expect(filterSpy.callCount).toBe(1);
        return expect(filterSpy.calls[0].args[0]).toHaveLength(3);
      });
      return it('case insensitive filter', function() {
        var result;
        collection.addTodo(new TodoModel({
          all: '#FIXME: THIS IS WITH CAPS',
          loc: 'file2.txt',
          position: [[6, 7], [6, 11]],
          regex: todoRegex.regex,
          regexp: todoRegex.regexp
        }));
        collection.filterTodos('FIXME 1');
        result = filterSpy.calls[0].args[0];
        expect(filterSpy.callCount).toBe(1);
        expect(result).toHaveLength(1);
        expect(result[0].text).toBe('fixme 1');
        collection.filterTodos('caps');
        result = filterSpy.calls[1].args[0];
        expect(filterSpy.callCount).toBe(2);
        expect(result).toHaveLength(1);
        expect(result[0].text).toBe('THIS IS WITH CAPS');
        collection.filterTodos('NONEXISTING');
        result = filterSpy.calls[2].args[0];
        expect(filterSpy.callCount).toBe(3);
        return expect(result).toHaveLength(0);
      });
    });
    return describe('Markdown', function() {
      beforeEach(function() {
        atom.config.set('todo-show.findTheseTodos', ['FIXME', 'TODO']);
        return atom.config.set('todo-show.showInTable', defaultShowInTable);
      });
      it('creates a markdown string from regexes', function() {
        addTestTodos();
        return expect(collection.getMarkdown()).toEqual("- fixme 1 __FIXME__ [file1.txt](file1.txt)\n- todo 1 __TODO__ [file1.txt](file1.txt)\n- fixme 2 __FIXME__ [file2.txt](file2.txt)\n");
      });
      it('creates markdown with sorting', function() {
        addTestTodos();
        collection.sortTodos({
          sortBy: 'Text',
          sortAsc: true
        });
        return expect(collection.getMarkdown()).toEqual("- fixme 1 __FIXME__ [file1.txt](file1.txt)\n- fixme 2 __FIXME__ [file2.txt](file2.txt)\n- todo 1 __TODO__ [file1.txt](file1.txt)\n");
      });
      it('creates markdown with inverse sorting', function() {
        addTestTodos();
        collection.sortTodos({
          sortBy: 'Text',
          sortAsc: false
        });
        return expect(collection.getMarkdown()).toEqual("- todo 1 __TODO__ [file1.txt](file1.txt)\n- fixme 2 __FIXME__ [file2.txt](file2.txt)\n- fixme 1 __FIXME__ [file1.txt](file1.txt)\n");
      });
      it('creates markdown with different items', function() {
        addTestTodos();
        atom.config.set('todo-show.showInTable', ['Type', 'File', 'Range']);
        return expect(collection.getMarkdown()).toEqual("- __FIXME__ [file1.txt](file1.txt) _:3,6,3,10_\n- __TODO__ [file1.txt](file1.txt) _:4,5,4,9_\n- __FIXME__ [file2.txt](file2.txt) _:5,7,5,11_\n");
      });
      it('creates markdown as table', function() {
        addTestTodos();
        atom.config.set('todo-show.saveOutputAs', 'Table');
        return expect(collection.getMarkdown()).toEqual("| Text | Type | File |\n|--------------------|\n| fixme 1 | __FIXME__ | [file1.txt](file1.txt) |\n| todo 1 | __TODO__ | [file1.txt](file1.txt) |\n| fixme 2 | __FIXME__ | [file2.txt](file2.txt) |\n");
      });
      it('creates markdown as table with different items', function() {
        addTestTodos();
        atom.config.set('todo-show.saveOutputAs', 'Table');
        atom.config.set('todo-show.showInTable', ['Type', 'File', 'Range']);
        return expect(collection.getMarkdown()).toEqual("| Type | File | Range |\n|---------------------|\n| __FIXME__ | [file1.txt](file1.txt) | _:3,6,3,10_ |\n| __TODO__ | [file1.txt](file1.txt) | _:4,5,4,9_ |\n| __FIXME__ | [file2.txt](file2.txt) | _:5,7,5,11_ |\n");
      });
      it('accepts missing ranges and paths in regexes', function() {
        var markdown;
        collection.addTodo(new TodoModel({
          text: 'fixme 1',
          type: 'FIXME'
        }, {
          plain: true
        }));
        expect(collection.getMarkdown()).toEqual("- fixme 1 __FIXME__\n");
        atom.config.set('todo-show.showInTable', ['Type', 'File', 'Range', 'Text']);
        markdown = '\n## Unknown File\n\n- fixme 1 `FIXMEs`\n';
        return expect(collection.getMarkdown()).toEqual("- __FIXME__ fixme 1\n");
      });
      it('accepts missing title in regexes', function() {
        collection.addTodo(new TodoModel({
          text: 'fixme 1',
          file: 'file1.txt'
        }, {
          plain: true
        }));
        expect(collection.getMarkdown()).toEqual("- fixme 1 [file1.txt](file1.txt)\n");
        atom.config.set('todo-show.showInTable', ['Title']);
        return expect(collection.getMarkdown()).toEqual("- No details\n");
      });
      return it('accepts missing items in table output', function() {
        collection.addTodo(new TodoModel({
          text: 'fixme 1',
          type: 'FIXME'
        }, {
          plain: true
        }));
        atom.config.set('todo-show.saveOutputAs', 'Table');
        expect(collection.getMarkdown()).toEqual("| Text | Type | File |\n|--------------------|\n| fixme 1 | __FIXME__ | |\n");
        atom.config.set('todo-show.showInTable', ['Line']);
        return expect(collection.getMarkdown()).toEqual("| Line |\n|------|\n| |\n");
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvZGRld2V5Ly5hdG9tL3BhY2thZ2VzL3RvZG8tc2hvdy9zcGVjL3RvZG8tY29sbGVjdGlvbi1zcGVjLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUVQLGNBQUEsR0FBaUIsT0FBQSxDQUFRLHdCQUFSOztFQUNqQixRQUFBLEdBQVcsT0FBQSxDQUFRLGtCQUFSOztFQUNYLFNBQUEsR0FBWSxPQUFBLENBQVEsbUJBQVI7O0VBQ1osU0FBQSxHQUFZLE9BQUEsQ0FBUSxtQkFBUjs7RUFFWixXQUFBLEdBQWMsSUFBSSxDQUFDLElBQUwsQ0FBVSxTQUFWLEVBQXFCLGtCQUFyQjs7RUFDZCxXQUFBLEdBQWMsSUFBSSxDQUFDLElBQUwsQ0FBVSxTQUFWLEVBQXFCLGtCQUFyQjs7RUFDZCxZQUFBLEdBQWUsSUFBSSxDQUFDLElBQUwsQ0FBVSxTQUFWLEVBQXFCLFVBQXJCOztFQUVmLFFBQUEsQ0FBUyxpQkFBVCxFQUE0QixTQUFBO0FBQzFCLFFBQUE7SUFBQSxNQUE4QyxFQUE5QyxFQUFDLG1CQUFELEVBQWEsa0JBQWIsRUFBd0I7SUFFeEIsWUFBQSxHQUFlLFNBQUE7TUFDYixVQUFVLENBQUMsT0FBWCxDQUNNLElBQUEsU0FBQSxDQUNGO1FBQUEsR0FBQSxFQUFLLGlCQUFMO1FBQ0EsR0FBQSxFQUFLLFdBREw7UUFFQSxRQUFBLEVBQVUsQ0FBQyxDQUFDLENBQUQsRUFBRyxDQUFILENBQUQsRUFBUSxDQUFDLENBQUQsRUFBRyxFQUFILENBQVIsQ0FGVjtRQUdBLEtBQUEsRUFBTyxTQUFTLENBQUMsS0FIakI7UUFJQSxNQUFBLEVBQVEsU0FBUyxDQUFDLE1BSmxCO09BREUsQ0FETjtNQVNBLFVBQVUsQ0FBQyxPQUFYLENBQ00sSUFBQSxTQUFBLENBQ0Y7UUFBQSxHQUFBLEVBQUssZUFBTDtRQUNBLEdBQUEsRUFB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LElBQUEsRUFBTSxPQUROO1NBREUsRUFHRjtVQUFBLEtBQUEsRUFBTyxJQUFQO1NBSEUsQ0FETjtRQU1BLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix3QkFBaEIsRUFBMEMsT0FBMUM7UUFDQSxNQUFBLENBQU8sVUFBVSxDQUFDLFdBQVgsQ0FBQSxDQUFQLENBQWdDLENBQUMsT0FBakMsQ0FBeUMsNkVBQXpDO1FBTUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHVCQUFoQixFQUF5QyxDQUFDLE1BQUQsQ0FBekM7ZUFDQSxNQUFBLENBQU8sVUFBVSxDQUFDLFdBQVgsQ0FBQSxDQUFQLENBQWdDLENBQUMsT0FBakMsQ0FBeUMsMkJBQXpDO01BZjBDLENBQTVDO0lBaEdtQixDQUFyQjtFQTVnQjBCLENBQTVCO0FBWEEiLCJzb3VyY2VzQ29udGVudCI6WyJwYXRoID0gcmVxdWlyZSAncGF0aCdcblxuVG9kb0NvbGxlY3Rpb24gPSByZXF1aXJlICcuLi9saWIvdG9kby1jb2xsZWN0aW9uJ1xuU2hvd1RvZG8gPSByZXF1aXJlICcuLi9saWIvc2hvdy10b2RvJ1xuVG9kb01vZGVsID0gcmVxdWlyZSAnLi4vbGliL3RvZG8tbW9kZWwnXG5Ub2RvUmVnZXggPSByZXF1aXJlICcuLi9saWIvdG9kby1yZWdleCdcblxuc2FtcGxlMVBhdGggPSBwYXRoLmpvaW4oX19kaXJuYW1lLCAnZml4dHVyZXMvc2FtcGxlMScpXG5zYW1wbGUyUGF0aCA9IHBhdGguam9pbihfX2Rpcm5hbWUsICdmaXh0dXJlcy9zYW1wbGUyJylcbmZpeHR1cmVzUGF0aCA9IHBhdGguam9pbihfX2Rpcm5hbWUsICdmaXh0dXJlcycpXG5cbmRlc2NyaWJlICdUb2RvIENvbGxlY3Rpb24nLCAtPlxuICBbY29sbGVjdGlvbiwgdG9kb1JlZ2V4LCBkZWZhdWx0U2hvd0luVGFibGVdID0gW11cblxuICBhZGRUZXN0VG9kb3MgPSAtPlxuICAgIGNvbGxlY3Rpb24uYWRkVG9kbyhcbiAgICAgIG5ldyBUb2RvTW9kZWwoXG4gICAgICAgIGFsbDogJyNGSVhNRTogZml4bWUgMSdcbiAgICAgICAgbG9jOiAnZmlsZTEudHh0J1xuICAgICAgICBwb3NpdGlvbjogW1szLDZdLCBbMywxMF1dXG4gICAgICAgIHJlZ2V4OiB0b2RvUmVnZXgucmVnZXhcbiAgICAgICAgcmVnZXhwOiB0b2RvUmVnZXgucmVnZXhwXG4gICAgICApXG4gICAgKVxuICAgIGNvbGxlY3Rpb24uYWRkVG9kbyhcbiAgICAgIG5ldyBUb2RvTW9kZWwoXG4gICAgICAgIGFsbDogJyNUT0RPOiB0b2RvIDEnXG4gICAgICAgIGxvYzogJ2ZpbGUxLnR4dCdcbiAgICAgICAgcG9zaXRpb246IFtbNCw1XSwgWzQsOV1dXG4gICAgICAgIHJlZ2V4OiB0b2RvUmVnZXgucmVnZXhcbiAgICAgICAgcmVnZXhwOiB0b2RvUmVnZXgucmVnZXhwXG4gICAgICApXG4gICAgKVxuICAgIGNvbGxlY3Rpb24uYWRkVG9kbyhcbiAgICAgIG5ldyBUb2RvTW9kZWwoXG4gICAgICAgIGFsbDogJyNGSVhNRTogZml4bWUgMidcbiAgICAgICAgbG9jOiAnZmlsZTIudHh0J1xuICAgICAgICBwb3NpdGlvbjogW1s1LDddLCBbNSwxMV1dXG4gICAgICAgIHJlZ2V4OiB0b2RvUmVnZXgucmVnZXhcbiAgICAgICAgcmVnZXhwOiB0b2RvUmVnZXgucmVnZXhwXG4gICAgICApXG4gICAgKVxuXG4gIGJlZm9yZUVhY2ggLT5cbiAgICB0b2RvUmVnZXggPSBuZXcgVG9kb1JlZ2V4KFxuICAgICAgU2hvd1RvZG8uY29uZmlnLmZpbmRVc2luZ1JlZ2V4LmRlZmF1bHRcbiAgICAgIFsnRklYTUUnLCAnVE9ETyddXG4gICAgKVxuICAgIGRlZmF1bHRTaG93SW5UYWJsZSA9IFsnVGV4dCcsICdUeXBlJywgJ0ZpbGUnXVxuXG4gICAgY29sbGVjdGlvbiA9IG5ldyBUb2RvQ29sbGVjdGlvblxuICAgIGF0b20ucHJvamVjdC5zZXRQYXRocyBbc2FtcGxlMVBhdGhdXG5cbiAgZGVzY3JpYmUgJ2ZldGNoUmVnZXhJdGVtKHRvZG9SZWdleCknLCAtPlxuICAgIGl0ICdzY2FucyBwcm9qZWN0IGZvciByZWdleCcsIC0+XG4gICAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgICAgY29sbGVjdGlvbi5mZXRjaFJlZ2V4SXRlbSh0b2RvUmVnZXgpXG5cbiAgICAgIHJ1bnMgLT5cbiAgICAgICAgZXhwZWN0KGNvbGxlY3Rpb24udG9kb3MpLnRvSGF2ZUxlbmd0aCA0XG4gICAgICAgIGV4cGVjdChjb2xsZWN0aW9uLnRvZG9zWzBdLnRleHQpLnRvQmUgJ0NvbW1lbnQgaW4gQydcbiAgICAgICAgZXhwZWN0KGNvbGxlY3Rpb24udG9kb3NbMV0udGV4dCkudG9CZSAnVGhpcyBpcyB0aGUgZmlyc3QgdG9kbydcbiAgICAgICAgZXhwZWN0KGNvbGxlY3Rpb24udG9kb3NbMl0udGV4dCkudG9CZSAnVGhpcyBpcyB0aGUgc2Vjb25kIHRvZG8nXG4gICAgICAgIGV4cGVjdChjb2xsZWN0aW9uLnRvZG9zWzNdLnRleHQpLnRvQmUgJ0FkZCBtb3JlIGFubm5vdGF0aW9ucyA6KSdcblxuICAgIGl0ICdzY2FucyBmdWxsIHdvcmtzcGFjZScsIC0+XG4gICAgICBhdG9tLnByb2plY3QuYWRkUGF0aCBzYW1wbGUyUGF0aFxuICAgICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICAgIGNvbGxlY3Rpb24uZmV0Y2hSZWdleEl0ZW0odG9kb1JlZ2V4KVxuICAgICAgcnVucyAtPlxuICAgICAgICBleHBlY3QoY29sbGVjdGlvbi50b2RvcykudG9IYXZlTGVuZ3RoIDEwXG5cbiAgICBpdCAnc2hvdWxkIGhhbmRsZSBvdGhlciByZWdleGVzJywgLT5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgICB0b2RvUmVnZXgucmVnZXhwID0gLyNpbmNsdWRlKC4rKS9nXG4gICAgICAgIGNvbGxlY3Rpb24uZmV0Y2hSZWdleEl0ZW0odG9kb1JlZ2V4KVxuICAgICAgcnVucyAtPlxuICAgICAgICBleHBlY3QoY29sbGVjdGlvbi50b2RvcykudG9IYXZlTGVuZ3RoIDFcbiAgICAgICAgZXhwZWN0KGNvbGxlY3Rpb24udG9kb3NbMF0udGV4dCkudG9CZSAnPHN0ZGlvLmg+J1xuXG4gICAgaXQgJ3Nob3VsZCBoYW5kbGUgc3BlY2lhbCBjaGFyYWN0ZXIgcmVnZXhlcycsIC0+XG4gICAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgICAgdG9kb1JlZ2V4LnJlZ2V4cCA9IC9UaGlzIGlzIHRoZSAoPzpmaXJzdHxzZWNvbmQpIHRvZG8vZ1xuICAgICAgICBjb2xsZWN0aW9uLmZldGNoUmVnZXhJdGVtKHRvZG9SZWdleClcbiAgICAgIHJ1bnMgLT5cbiAgICAgICAgZXhwZWN0KGNvbGxlY3Rpb24udG9kb3MpLnRvSGF2ZUxlbmd0aCAyXG4gICAgICAgIGV4cGVjdChjb2xsZWN0aW9uLnRvZG9zWzBdLnRleHQpLnRvQmUgJ1RoaXMgaXMgdGhlIGZpcnN0IHRvZG8nXG4gICAgICAgIGV4cGVjdChjb2xsZWN0aW9uLnRvZG9zWzFdLnRleHQpLnRvQmUgJ1RoaXMgaXMgdGhlIHNlY29uZCB0b2RvJ1xuXG4gICAgaXQgJ3Nob3VsZCBoYW5kbGUgcmVnZXggd2l0aG91dCBjYXB0dXJlIGdyb3VwJywgLT5cbiAgICAgIGxvb2t1cCA9XG4gICAgICAgIHRpdGxlOiAnVGhpcyBpcyBDb2RlJ1xuICAgICAgICByZWdleDogJydcblxuICAgICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICAgIHRvZG9SZWdleC5yZWdleHAgPSAvW1xcd1xcc10rY29kZVtcXHdcXHNdKi9nXG4gICAgICAgIGNvbGxlY3Rpb24uZmV0Y2hSZWdleEl0ZW0odG9kb1JlZ2V4KVxuICAgICAgcnVucyAtPlxuICAgICAgICBleHBlY3QoY29sbGVjdGlvbi50b2RvcykudG9IYXZlTGVuZ3RoIDFcbiAgICAgICAgZXhwZWN0KGNvbGxlY3Rpb24udG9kb3NbMF0udGV4dCkudG9CZSAnU2FtcGxlIHF1aWNrc29ydCBjb2RlJ1xuXG4gICAgaXQgJ3Nob3VsZCBoYW5kbGUgcG9zdC1hbm5vdGF0aW9ucyB3aXRoIHNwZWNpYWwgcmVnZXgnLCAtPlxuICAgICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICAgIHRvZG9SZWdleC5yZWdleHAgPSAvKC4rKS57M31ERUJVR1xccyokL2dcbiAgICAgICAgY29sbGVjdGlvbi5mZXRjaFJlZ2V4SXRlbSh0b2RvUmVnZXgpXG4gICAgICBydW5zIC0+XG4gICAgICAgIGV4cGVjdChjb2xsZWN0aW9uLnRvZG9zKS50b0hhdmVMZW5ndGggMVxuICAgICAgICBleHBlY3QoY29sbGVjdGlvbi50b2Rvc1swXS50ZXh0KS50b0JlICdyZXR1cm4gc29ydChBcnJheS5hcHBseSh0aGlzLCBhcmd1bWVudHMpKTsnXG5cbiAgICBpdCAnc2hvdWxkIGhhbmRsZSBwb3N0LWFubm90YXRpb25zIHdpdGggbm9uLWNhcHR1cmluZyBncm91cCcsIC0+XG4gICAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgICAgdG9kb1JlZ2V4LnJlZ2V4cCA9IC8oLis/KD89LnszfURFQlVHXFxzKiQpKS9cbiAgICAgICAgY29sbGVjdGlvbi5mZXRjaFJlZ2V4SXRlbSh0b2RvUmVnZXgpXG4gICAgICBydW5zIC0+XG4gICAgICAgIGV4cGVjdChjb2xsZWN0aW9uLnRvZG9zKS50b0hhdmVMZW5ndGggMVxuICAgICAgICBleHBlY3QoY29sbGVjdGlvbi50b2Rvc1swXS50ZXh0KS50b0JlICdyZXR1cm4gc29ydChBcnJheS5hcHBseSh0aGlzLCBhcmd1bWVudHMpKTsnXG5cbiAgICBpdCAnc2hvdWxkIHRydW5jYXRlIHRvZG9zIGxvbmdlciB0aGFuIHRoZSBkZWZpbmVkIG1heCBsZW5ndGggb2YgMTIwJywgLT5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgICB0b2RvUmVnZXgucmVnZXhwID0gL0xPT05HOj8oLiskKS9nXG4gICAgICAgIGNvbGxlY3Rpb24uZmV0Y2hSZWdleEl0ZW0odG9kb1JlZ2V4KVxuICAgICAgcnVucyAtPlxuICAgICAgICB0ZXh0ID0gJ0xvcmVtIGlwc3VtIGRvbG9yIHNpdCBhbWV0LCBkYXBpYnVzIHJob25jdXMuIFNjZWxlcmlzcXVlIHF1YW0sJ1xuICAgICAgICB0ZXh0ICs9ICcgaWQgYW50ZSBtb2xlc3RpYXMsIGlwc3VtIGxvcmVtIG1hZ25pcyBldC4gQSBlbGVpZmVuZCBpLi4uJ1xuXG4gICAgICAgIHRleHQyID0gJ19TcGdMRTg0TXMxSzREU3VtdEpEb05uOFpFQ1pMTCtWUjBEb0d5ZHk1NHZVb1NwZ0xFODRNczFLNERTdW0nXG4gICAgICAgIHRleHQyICs9ICd0SkRvTm44WkVDWkxMVlIwRG9HeWR5NTR2VW9uUkNsWHdMYkZoWDJnTXdaZ2p4MjUwYXkrVjBsRi4uLidcblxuICAgICAgICBleHBlY3QoY29sbGVjdGlvbi50b2Rvc1swXS50ZXh0KS50b0hhdmVMZW5ndGggMTIwXG4gICAgICAgIGV4cGVjdChjb2xsZWN0aW9uLnRvZG9zWzBdLnRleHQpLnRvQmUgdGV4dFxuXG4gICAgICAgIGV4cGVjdChjb2xsZWN0aW9uLnRvZG9zWzFdLnRleHQpLnRvSGF2ZUxlbmd0aCAxMjBcbiAgICAgICAgZXhwZWN0KGNvbGxlY3Rpb24udG9kb3NbMV0udGV4dCkudG9CZSB0ZXh0MlxuXG4gICAgaXQgJ3Nob3VsZCBzdHJpcCBjb21tb24gYmxvY2sgY29tbWVudCBlbmRpbmdzJywgLT5cbiAgICAgIGF0b20ucHJvamVjdC5zZXRQYXRocyBbc2FtcGxlMlBhdGhdXG5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPiBjb2xsZWN0aW9uLmZldGNoUmVnZXhJdGVtKHRvZG9SZWdleClcbiAgICAgIHJ1bnMgLT5cbiAgICAgICAgZXhwZWN0KGNvbGxlY3Rpb24udG9kb3MpLnRvSGF2ZUxlbmd0aCA2XG4gICAgICAgIGV4cGVjdChjb2xsZWN0aW9uLnRvZG9zWzBdLnRleHQpLnRvQmUgJ0MgYmxvY2sgY29tbWVudCdcbiAgICAgICAgZXhwZWN0KGNvbGxlY3Rpb24udG9kb3NbMV0udGV4dCkudG9CZSAnSFRNTCBjb21tZW50J1xuICAgICAgICBleHBlY3QoY29sbGVjdGlvbi50b2Rvc1syXS50ZXh0KS50b0JlICdQb3dlclNoZWxsIGNvbW1lbnQnXG4gICAgICAgIGV4cGVjdChjb2xsZWN0aW9uLnRvZG9zWzNdLnRleHQpLnRvQmUgJ0hhc2tlbGwgY29tbWVudCdcbiAgICAgICAgZXhwZWN0KGNvbGxlY3Rpb24udG9kb3NbNF0udGV4dCkudG9CZSAnTHVhIGNvbW1lbnQnXG4gICAgICAgIGV4cGVjdChjb2xsZWN0aW9uLnRvZG9zWzVdLnRleHQpLnRvQmUgJ1BIUCBjb21tZW50J1xuXG4gIGRlc2NyaWJlICdmZXRjaFJlZ2V4SXRlbSh0b2RvUmVnZXgsIGFjdGl2ZVByb2plY3RPbmx5KScsIC0+XG4gICAgYmVmb3JlRWFjaCAtPlxuICAgICAgYXRvbS5wcm9qZWN0LmFkZFBhdGggc2FtcGxlMlBhdGhcblxuICAgIGl0ICdzY2FucyBhY3RpdmUgcHJvamVjdCBmb3IgcmVnZXgnLCAtPlxuICAgICAgY29sbGVjdGlvbi5zZXRBY3RpdmVQcm9qZWN0KHNhbXBsZTFQYXRoKVxuXG4gICAgICB3YWl0c0ZvclByb21pc2UgLT4gY29sbGVjdGlvbi5mZXRjaFJlZ2V4SXRlbSh0b2RvUmVnZXgsIHRydWUpXG4gICAgICBydW5zIC0+XG4gICAgICAgIGV4cGVjdChjb2xsZWN0aW9uLnRvZG9zKS50b0hhdmVMZW5ndGggNFxuICAgICAgICBleHBlY3QoY29sbGVjdGlvbi50b2Rvc1swXS50ZXh0KS50b0JlICdDb21tZW50IGluIEMnXG4gICAgICAgIGV4cGVjdChjb2xsZWN0aW9uLnRvZG9zWzFdLnRleHQpLnRvQmUgJ1RoaXMgaXMgdGhlIGZpcnN0IHRvZG8nXG4gICAgICAgIGV4cGVjdChjb2xsZWN0aW9uLnRvZG9zWzJdLnRleHQpLnRvQmUgJ1RoaXMgaXMgdGhlIHNlY29uZCB0b2RvJ1xuICAgICAgICBleHBlY3QoY29sbGVjdGlvbi50b2Rvc1szXS50ZXh0KS50b0JlICdBZGQgbW9yZSBhbm5ub3RhdGlvbnMgOiknXG5cbiAgICBpdCAnY2hhbmdlcyBhY3RpdmUgcHJvamVjdCcsIC0+XG4gICAgICBjb2xsZWN0aW9uLnNldEFjdGl2ZVByb2plY3Qoc2FtcGxlMlBhdGgpXG5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPiBjb2xsZWN0aW9uLmZldGNoUmVnZXhJdGVtKHRvZG9SZWdleCwgdHJ1ZSlcbiAgICAgIHJ1bnMgLT5cbiAgICAgICAgZXhwZWN0KGNvbGxlY3Rpb24udG9kb3MpLnRvSGF2ZUxlbmd0aCA2XG4gICAgICAgIGNvbGxlY3Rpb24uY2xlYXIoKVxuICAgICAgICBjb2xsZWN0aW9uLnNldEFjdGl2ZVByb2plY3Qoc2FtcGxlMVBhdGgpXG5cbiAgICAgICAgd2FpdHNGb3JQcm9taXNlIC0+IGNvbGxlY3Rpb24uZmV0Y2hSZWdleEl0ZW0odG9kb1JlZ2V4LCB0cnVlKVxuICAgICAgICBydW5zIC0+XG4gICAgICAgICAgZXhwZWN0KGNvbGxlY3Rpb24udG9kb3MpLnRvSGF2ZUxlbmd0aCA0XG5cbiAgICBpdCAnc3RpbGwgcmVzcGVjdHMgaWdub3JlZCBwYXRocycsIC0+XG4gICAgICBhdG9tLmNvbmZpZy5zZXQoJ3RvZG8tc2hvdy5pZ25vcmVUaGVzZVBhdGhzJywgWydzYW1wbGUuanMnXSlcbiAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgICBjb2xsZWN0aW9uLmZldGNoUmVnZXhJdGVtKHRvZG9SZWdleCwgdHJ1ZSlcbiAgICAgIHJ1bnMgLT5cbiAgICAgICAgZXhwZWN0KGNvbGxlY3Rpb24udG9kb3MpLnRvSGF2ZUxlbmd0aCAxXG4gICAgICAgIGV4cGVjdChjb2xsZWN0aW9uLnRvZG9zWzBdLnRleHQpLnRvQmUgJ0NvbW1lbnQgaW4gQydcblxuICAgIGl0ICdoYW5kbGVzIG5vIHByb2plY3Qgc2l0dWF0aW9ucycsIC0+XG4gICAgICBleHBlY3QoY29sbGVjdGlvbi5hY3RpdmVQcm9qZWN0KS5ub3QudG9CZURlZmluZWQoKVxuICAgICAgZXhwZWN0KHBhdGguYmFzZW5hbWUoY29sbGVjdGlvbi5nZXRBY3RpdmVQcm9qZWN0KCkpKS50b0JlICdzYW1wbGUxJ1xuXG4gICAgICBhdG9tLnByb2plY3Quc2V0UGF0aHMgW11cbiAgICAgIGNvbGxlY3Rpb24uYWN0aXZlUHJvamVjdCA9IHVuZGVmaW5lZFxuICAgICAgd2FpdHNGb3JQcm9taXNlIC0+IGNvbGxlY3Rpb24uZmV0Y2hSZWdleEl0ZW0odG9kb1JlZ2V4LCB0cnVlKVxuICAgICAgcnVucyAtPlxuICAgICAgICBleHBlY3QoY29sbGVjdGlvbi50b2RvcykudG9IYXZlTGVuZ3RoIDBcblxuICBkZXNjcmliZSAnaWdub3JlIHBhdGggcnVsZXMnLCAtPlxuICAgIGl0ICd3b3JrcyB3aXRoIG5vIHBhdGhzIGFkZGVkJywgLT5cbiAgICAgIGF0b20uY29uZmlnLnNldCgndG9kby1zaG93Lmlnbm9yZVRoZXNlUGF0aHMnLCBbXSlcbiAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgICBjb2xsZWN0aW9uLmZldGNoUmVnZXhJdGVtKHRvZG9SZWdleClcbiAgICAgIHJ1bnMgLT5cbiAgICAgICAgZXhwZWN0KGNvbGxlY3Rpb24udG9kb3MpLnRvSGF2ZUxlbmd0aCA0XG5cbiAgICBpdCAnbXVzdCBiZSBhbiBhcnJheScsIC0+XG4gICAgICBjb2xsZWN0aW9uLm9uRGlkRmFpbFNlYXJjaCBub3RpZmljYXRpb25TcHkgPSBqYXNtaW5lLmNyZWF0ZVNweSgpXG5cbiAgICAgIGF0b20uY29uZmlnLnNldCgndG9kby1zaG93Lmlnbm9yZVRoZXNlUGF0aHMnLCAnMTIzJylcbiAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgICBjb2xsZWN0aW9uLmZldGNoUmVnZXhJdGVtKHRvZG9SZWdleClcbiAgICAgIHJ1bnMgLT5cbiAgICAgICAgZXhwZWN0KGNvbGxlY3Rpb24udG9kb3MpLnRvSGF2ZUxlbmd0aCA0XG5cbiAgICAgICAgbm90aWZpY2F0aW9uID0gbm90aWZpY2F0aW9uU3B5Lm1vc3RSZWNlbnRDYWxsLmFyZ3NbMF1cbiAgICAgICAgZXhwZWN0KG5vdGlmaWNhdGlvblNweSkudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICAgIGV4cGVjdChub3RpZmljYXRpb24uaW5kZXhPZignaWdub3JlVGhlc2VQYXRocycpKS5ub3QudG9CZSAtMVxuXG4gICAgaXQgJ3Jlc3BlY3RzIGlnbm9yZWQgZmlsZXMnLCAtPlxuICAgICAgYXRvbS5jb25maWcuc2V0KCd0b2RvLXNob3cuaWdub3JlVGhlc2VQYXRocycsIFsnc2FtcGxlLmpzJ10pXG4gICAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgICAgY29sbGVjdGlvbi5mZXRjaFJlZ2V4SXRlbSh0b2RvUmVnZXgpXG4gICAgICBydW5zIC0+XG4gICAgICAgIGV4cGVjdChjb2xsZWN0aW9uLnRvZG9zKS50b0hhdmVMZW5ndGggMVxuICAgICAgICBleHBlY3QoY29sbGVjdGlvbi50b2Rvc1swXS50ZXh0KS50b0JlICdDb21tZW50IGluIEMnXG5cbiAgICBpdCAncmVzcGVjdHMgaWdub3JlZCBkaXJlY3RvcmllcyBhbmQgZmlsZXR5cGVzJywgLT5cbiAgICAgIGF0b20ucHJvamVjdC5zZXRQYXRocyBbZml4dHVyZXNQYXRoXVxuICAgICAgYXRvbS5jb25maWcuc2V0KCd0b2RvLXNob3cuaWdub3JlVGhlc2VQYXRocycsIFsnc2FtcGxlMScsICcqLm1kJ10pXG5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgICBjb2xsZWN0aW9uLmZldGNoUmVnZXhJdGVtKHRvZG9SZWdleClcbiAgICAgIHJ1bnMgLT5cbiAgICAgICAgZXhwZWN0KGNvbGxlY3Rpb24udG9kb3MpLnRvSGF2ZUxlbmd0aCA2XG4gICAgICAgIGV4cGVjdChjb2xsZWN0aW9uLnRvZG9zWzBdLnRleHQpLnRvQmUgJ0MgYmxvY2sgY29tbWVudCdcblxuICAgIGl0ICdyZXNwZWN0cyBpZ25vcmVkIHdpbGRjYXJkIGRpcmVjdG9yaWVzJywgLT5cbiAgICAgIGF0b20ucHJvamVjdC5zZXRQYXRocyBbZml4dHVyZXNQYXRoXVxuICAgICAgYXRvbS5jb25maWcuc2V0KCd0b2RvLXNob3cuaWdub3JlVGhlc2VQYXRocycsIFsnKiovc2FtcGxlLmpzJywgJyoqL3NhbXBsZS50eHQnLCAnKi5tZCddKVxuXG4gICAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgICAgY29sbGVjdGlvbi5mZXRjaFJlZ2V4SXRlbSh0b2RvUmVnZXgpXG4gICAgICBydW5zIC0+XG4gICAgICAgIGV4cGVjdChjb2xsZWN0aW9uLnRvZG9zKS50b0hhdmVMZW5ndGggMVxuICAgICAgICBleHBlY3QoY29sbGVjdGlvbi50b2Rvc1swXS50ZXh0KS50b0JlICdDb21tZW50IGluIEMnXG5cbiAgICBpdCAncmVzcGVjdHMgbW9yZSBhZHZhbmNlZCBpZ25vcmVzJywgLT5cbiAgICAgIGF0b20ucHJvamVjdC5zZXRQYXRocyBbZml4dHVyZXNQYXRoXVxuICAgICAgYXRvbS5jb25maWcuc2V0KCd0b2RvLXNob3cuaWdub3JlVGhlc2VQYXRocycsIFsnb3V0cHV0KC1ncm91cGVkKT9cXFxcLionLCAnKjEvKionXSlcblxuICAgICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICAgIGNvbGxlY3Rpb24uZmV0Y2hSZWdleEl0ZW0odG9kb1JlZ2V4KVxuICAgICAgcnVucyAtPlxuICAgICAgICBleHBlY3QoY29sbGVjdGlvbi50b2RvcykudG9IYXZlTGVuZ3RoIDZcbiAgICAgICAgZXhwZWN0KGNvbGxlY3Rpb24udG9kb3NbMF0udGV4dCkudG9CZSAnQyBibG9jayBjb21tZW50J1xuXG4gIGRlc2NyaWJlICdmZXRjaE9wZW5SZWdleEl0ZW0obG9va3VwT2JqKScsIC0+XG4gICAgZWRpdG9yID0gbnVsbFxuXG4gICAgYmVmb3JlRWFjaCAtPlxuICAgICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4gJ3NhbXBsZS5jJ1xuICAgICAgcnVucyAtPlxuICAgICAgICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcblxuICAgIGl0ICdzY2FucyBvcGVuIGZpbGVzIGZvciB0aGUgcmVnZXggdGhhdCBpcyBwYXNzZWQgYW5kIGZpbGwgbG9va3VwIHJlc3VsdHMnLCAtPlxuICAgICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICAgIGNvbGxlY3Rpb24uZmV0Y2hPcGVuUmVnZXhJdGVtKHRvZG9SZWdleClcblxuICAgICAgcnVucyAtPlxuICAgICAgICBleHBlY3QoY29sbGVjdGlvbi50b2RvcykudG9IYXZlTGVuZ3RoIDFcbiAgICAgICAgZXhwZWN0KGNvbGxlY3Rpb24udG9kb3MubGVuZ3RoKS50b0JlIDFcbiAgICAgICAgZXhwZWN0KGNvbGxlY3Rpb24udG9kb3NbMF0udGV4dCkudG9CZSAnQ29tbWVudCBpbiBDJ1xuXG4gICAgaXQgJ3dvcmtzIHdpdGggZmlsZXMgb3V0c2lkZSBvZiB3b3Jrc3BhY2UnLCAtPlxuICAgICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4gJy4uL3NhbXBsZTIvc2FtcGxlLnR4dCdcblxuICAgICAgcnVucyAtPlxuICAgICAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgICAgICBjb2xsZWN0aW9uLmZldGNoT3BlblJlZ2V4SXRlbSh0b2RvUmVnZXgpXG5cbiAgICAgICAgcnVucyAtPlxuICAgICAgICAgIGV4cGVjdChjb2xsZWN0aW9uLnRvZG9zKS50b0hhdmVMZW5ndGggN1xuICAgICAgICAgIGV4cGVjdChjb2xsZWN0aW9uLnRvZG9zWzBdLnRleHQpLnRvQmUgJ0NvbW1lbnQgaW4gQydcbiAgICAgICAgICBleHBlY3QoY29sbGVjdGlvbi50b2Rvc1sxXS50ZXh0KS50b0JlICdDIGJsb2NrIGNvbW1lbnQnXG4gICAgICAgICAgZXhwZWN0KGNvbGxlY3Rpb24udG9kb3NbNl0udGV4dCkudG9CZSAnUEhQIGNvbW1lbnQnXG5cbiAgICBpdCAnaGFuZGxlcyB1bnNhdmVkIGRvY3VtZW50cycsIC0+XG4gICAgICBlZGl0b3Iuc2V0VGV4dCAnVE9ETzogTmV3IHRvZG8nXG5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgICBjb2xsZWN0aW9uLmZldGNoT3BlblJlZ2V4SXRlbSh0b2RvUmVnZXgpXG4gICAgICBydW5zIC0+XG4gICAgICAgIGV4cGVjdChjb2xsZWN0aW9uLnRvZG9zKS50b0hhdmVMZW5ndGggMVxuICAgICAgICBleHBlY3QoY29sbGVjdGlvbi50b2Rvc1swXS50eXBlKS50b0JlICdUT0RPJ1xuICAgICAgICBleHBlY3QoY29sbGVjdGlvbi50b2Rvc1swXS50ZXh0KS50b0JlICdOZXcgdG9kbydcblxuICAgIGl0ICdpZ25vcmVzIHRvZG8gd2l0aG91dCBsZWFkaW5nIHNwYWNlJywgLT5cbiAgICAgIGVkaXRvci5zZXRUZXh0ICdBIGxpbmUgLy8gVE9ETzp0ZXh0J1xuXG4gICAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgICAgY29sbGVjdGlvbi5mZXRjaE9wZW5SZWdleEl0ZW0odG9kb1JlZ2V4KVxuICAgICAgcnVucyAtPlxuICAgICAgICBleHBlY3QoY29sbGVjdGlvbi50b2RvcykudG9IYXZlTGVuZ3RoIDBcblxuICAgIGl0ICdpZ25vcmVzIHRvZG8gd2l0aCB1bndhbnRlZCBjaGFyYWN0ZXJzJywgLT5cbiAgICAgIGVkaXRvci5zZXRUZXh0ICdkZWZpbmUoXCJfSlNfVE9ET19BTEVSVF9cIiwgXCJqczphbGVydCgmcXVvdDtUT0RPJnF1b3Q7KTtcIik7J1xuXG4gICAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgICAgY29sbGVjdGlvbi5mZXRjaE9wZW5SZWdleEl0ZW0odG9kb1JlZ2V4KVxuICAgICAgcnVucyAtPlxuICAgICAgICBleHBlY3QoY29sbGVjdGlvbi50b2RvcykudG9IYXZlTGVuZ3RoIDBcblxuICAgIGl0ICdpZ25vcmVzIGJpbmFyeSBkYXRhJywgLT5cbiAgICAgIGVkaXRvci5zZXRUZXh0ICcvLyBUT0RPZe+/vWTvv73vv71SUFBQMFx1MDAwNu+/vVx1MDAwZidcblxuICAgICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICAgIGNvbGxlY3Rpb24uZmV0Y2hPcGVuUmVnZXhJdGVtKHRvZG9SZWdleClcbiAgICAgIHJ1bnMgLT5cbiAgICAgICAgZXhwZWN0KGNvbGxlY3Rpb24udG9kb3MpLnRvSGF2ZUxlbmd0aCAwXG5cbiAgICBpdCAnZG9lcyBub3QgYWRkIGR1cGxpY2F0ZXMnLCAtPlxuICAgICAgYWRkVGVzdFRvZG9zKClcbiAgICAgIGV4cGVjdChjb2xsZWN0aW9uLnRvZG9zKS50b0hhdmVMZW5ndGggM1xuICAgICAgYWRkVGVzdFRvZG9zKClcbiAgICAgIGV4cGVjdChjb2xsZWN0aW9uLnRvZG9zKS50b0hhdmVMZW5ndGggM1xuXG4gIGRlc2NyaWJlICdnZXRBY3RpdmVQcm9qZWN0JywgLT5cbiAgICBiZWZvcmVFYWNoIC0+XG4gICAgICBhdG9tLnByb2plY3QuYWRkUGF0aCBzYW1wbGUyUGF0aFxuXG4gICAgaXQgJ3JldHVybnMgYWN0aXZlIHByb2plY3QnLCAtPlxuICAgICAgY29sbGVjdGlvbi5hY3RpdmVQcm9qZWN0ID0gc2FtcGxlMlBhdGhcbiAgICAgIGV4cGVjdChjb2xsZWN0aW9uLmdldEFjdGl2ZVByb2plY3QoKSkudG9CZSBzYW1wbGUyUGF0aFxuXG4gICAgaXQgJ2ZhbGxzIGJhY2sgdG8gZmlyc3QgcHJvamVjdCcsIC0+XG4gICAgICBleHBlY3QoY29sbGVjdGlvbi5nZXRBY3RpdmVQcm9qZWN0KCkpLnRvQmUgc2FtcGxlMVBhdGhcblxuICAgIGl0ICdmYWxscyBiYWNrIHRvIGZpcnN0IG9wZW4gaXRlbScsIC0+XG4gICAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgICAgYXRvbS53b3Jrc3BhY2Uub3BlbiBwYXRoLmpvaW4oc2FtcGxlMlBhdGgsICdzYW1wbGUudHh0JylcbiAgICAgIHJ1bnMgLT5cbiAgICAgICAgZXhwZWN0KGNvbGxlY3Rpb24uZ2V0QWN0aXZlUHJvamVjdCgpKS50b0JlIHNhbXBsZTJQYXRoXG5cbiAgICBpdCAnaGFuZGxlcyBubyBwcm9qZWN0IHBhdGhzJywgLT5cbiAgICAgIGF0b20ucHJvamVjdC5zZXRQYXRocyBbXVxuICAgICAgZXhwZWN0KGNvbGxlY3Rpb24uZ2V0QWN0aXZlUHJvamVjdCgpKS50b0JlRmFsc3koKVxuICAgICAgZXhwZWN0KGNvbGxlY3Rpb24uYWN0aXZlUHJvamVjdCkubm90LnRvQmVEZWZpbmVkKClcblxuICBkZXNjcmliZSAnc2V0QWN0aXZlUHJvamVjdCcsIC0+XG4gICAgaXQgJ3NldHMgYWN0aXZlIHByb2plY3QgZnJvbSBmaWxlIHBhdGggYW5kIHJldHVybnMgdHJ1ZSBpZiBjaGFuZ2VkJywgLT5cbiAgICAgIGF0b20ucHJvamVjdC5hZGRQYXRoIHNhbXBsZTJQYXRoXG4gICAgICBleHBlY3QoY29sbGVjdGlvbi5nZXRBY3RpdmVQcm9qZWN0KCkpLnRvQmUgc2FtcGxlMVBhdGhcbiAgICAgIHJlcyA9IGNvbGxlY3Rpb24uc2V0QWN0aXZlUHJvamVjdCBwYXRoLmpvaW4oc2FtcGxlMlBhdGgsICdzYW1wbGUudHh0JylcbiAgICAgIGV4cGVjdChyZXMpLnRvQmUgdHJ1ZVxuICAgICAgZXhwZWN0KGNvbGxlY3Rpb24uZ2V0QWN0aXZlUHJvamVjdCgpKS50b0JlIHNhbXBsZTJQYXRoXG4gICAgICByZXMgPSBjb2xsZWN0aW9uLnNldEFjdGl2ZVByb2plY3QgcGF0aC5qb2luKHNhbXBsZTJQYXRoLCAnc2FtcGxlLnR4dCcpXG4gICAgICBleHBlY3QocmVzKS50b0JlIGZhbHNlXG5cbiAgICBpdCAnaWdub3JlcyBpZiBmaWxlIGlzIG5vdCBpbiBwcm9qZWN0JywgLT5cbiAgICAgIHJlcyA9IGNvbGxlY3Rpb24uc2V0QWN0aXZlUHJvamVjdCBwYXRoLmpvaW4oc2FtcGxlMlBhdGgsICdzYW1wbGUudHh0JylcbiAgICAgIGV4cGVjdChyZXMpLnRvQmUgZmFsc2VcbiAgICAgIGV4cGVjdChjb2xsZWN0aW9uLmdldEFjdGl2ZVByb2plY3QoKSkudG9CZSBzYW1wbGUxUGF0aFxuXG4gICAgaXQgJ2hhbmRsZXMgaW52YWxpZCBhcmd1bWVudHMnLCAtPlxuICAgICAgZXhwZWN0KGNvbGxlY3Rpb24uc2V0QWN0aXZlUHJvamVjdCgpKS50b0JlIGZhbHNlXG4gICAgICBleHBlY3QoY29sbGVjdGlvbi5hY3RpdmVQcm9qZWN0KS5ub3QudG9CZURlZmluZWQoKVxuXG4gICAgICBleHBlY3QoY29sbGVjdGlvbi5zZXRBY3RpdmVQcm9qZWN0KGZhbHNlKSkudG9CZSBmYWxzZVxuICAgICAgZXhwZWN0KGNvbGxlY3Rpb24uYWN0aXZlUHJvamVjdCkubm90LnRvQmVEZWZpbmVkKClcblxuICAgICAgZXhwZWN0KGNvbGxlY3Rpb24uc2V0QWN0aXZlUHJvamVjdCh7fSkpLnRvQmUgZmFsc2VcbiAgICAgIGV4cGVjdChjb2xsZWN0aW9uLmFjdGl2ZVByb2plY3QpLm5vdC50b0JlRGVmaW5lZCgpXG5cbiAgZGVzY3JpYmUgJ1NvcnQgdG9kb3MnLCAtPlxuICAgIHtzb3J0U3B5fSA9IFtdXG5cbiAgICBiZWZvcmVFYWNoIC0+XG4gICAgICBhZGRUZXN0VG9kb3MoKVxuICAgICAgY29sbGVjdGlvbi5hZGRUb2RvKFxuICAgICAgICBuZXcgVG9kb01vZGVsKFxuICAgICAgICAgIGFsbDogJyNGSVhNRTogZml4bWUgMydcbiAgICAgICAgICBsb2M6ICdmaWxlMS50eHQnXG4gICAgICAgICAgcG9zaXRpb246IFtbMTIsMTRdLCBbMTIsMTZdXVxuICAgICAgICAgIHJlZ2V4OiB0b2RvUmVnZXgucmVnZXhcbiAgICAgICAgICByZWdleHA6IHRvZG9SZWdleC5yZWdleHBcbiAgICAgICAgKVxuICAgICAgKVxuICAgICAgYXRvbS5jb25maWcuc2V0ICd0b2RvLXNob3cuZmluZFRoZXNlVG9kb3MnLCBbJ0ZJWE1FJywgJ1RPRE8nXVxuICAgICAgc29ydFNweSA9IGphc21pbmUuY3JlYXRlU3B5KClcbiAgICAgIGNvbGxlY3Rpb24ub25EaWRTb3J0VG9kb3Mgc29ydFNweVxuXG4gICAgaXQgJ2NhbiBzb3J0IHNpbXBsZSB0b2RvcycsIC0+XG4gICAgICBjb2xsZWN0aW9uLnNvcnRUb2Rvcyhzb3J0Qnk6ICdUZXh0Jywgc29ydEFzYzogZmFsc2UpXG4gICAgICBleHBlY3QoY29sbGVjdGlvbi50b2Rvc1swXS50ZXh0KS50b0JlICd0b2RvIDEnXG4gICAgICBleHBlY3QoY29sbGVjdGlvbi50b2Rvc1szXS50ZXh0KS50b0JlICdmaXhtZSAxJ1xuXG4gICAgICBjb2xsZWN0aW9uLnNvcnRUb2Rvcyhzb3J0Qnk6ICdUZXh0Jywgc29ydEFzYzogdHJ1ZSlcbiAgICAgIGV4cGVjdChjb2xsZWN0aW9uLnRvZG9zWzBdLnRleHQpLnRvQmUgJ2ZpeG1lIDEnXG4gICAgICBleHBlY3QoY29sbGVjdGlvbi50b2Rvc1szXS50ZXh0KS50b0JlICd0b2RvIDEnXG5cbiAgICAgIGNvbGxlY3Rpb24uc29ydFRvZG9zKHNvcnRCeTogJ1RleHQnKVxuICAgICAgZXhwZWN0KGNvbGxlY3Rpb24udG9kb3NbMF0udGV4dCkudG9CZSAndG9kbyAxJ1xuICAgICAgZXhwZWN0KGNvbGxlY3Rpb24udG9kb3NbM10udGV4dCkudG9CZSAnZml4bWUgMSdcblxuICAgICAgY29sbGVjdGlvbi5zb3J0VG9kb3Moc29ydEFzYzogdHJ1ZSlcbiAgICAgIGV4cGVjdChjb2xsZWN0aW9uLnRvZG9zWzBdLnRleHQpLnRvQmUgJ2ZpeG1lIDEnXG4gICAgICBleHBlY3QoY29sbGVjdGlvbi50b2Rvc1szXS50ZXh0KS50b0JlICd0b2RvIDEnXG5cbiAgICAgIGNvbGxlY3Rpb24uc29ydFRvZG9zKClcbiAgICAgIGV4cGVjdChjb2xsZWN0aW9uLnRvZG9zWzBdLnRleHQpLnRvQmUgJ3RvZG8gMSdcbiAgICAgIGV4cGVjdChjb2xsZWN0aW9uLnRvZG9zWzNdLnRleHQpLnRvQmUgJ2ZpeG1lIDEnXG5cbiAgICBpdCAnc29ydCBieSBvdGhlciB2YWx1ZXMnLCAtPlxuICAgICAgY29sbGVjdGlvbi5zb3J0VG9kb3Moc29ydEJ5OiAnUmFuZ2UnLCBzb3J0QXNjOiB0cnVlKVxuICAgICAgZXhwZWN0KGNvbGxlY3Rpb24udG9kb3NbMF0ucmFuZ2UpLnRvQmUgJzMsNiwzLDEwJ1xuICAgICAgZXhwZWN0KGNvbGxlY3Rpb24udG9kb3NbMl0ucmFuZ2UpLnRvQmUgJzUsNyw1LDExJ1xuICAgICAgZXhwZWN0KGNvbGxlY3Rpb24udG9kb3NbM10ucmFuZ2UpLnRvQmUgJzEyLDE0LDEyLDE2J1xuXG4gICAgICBjb2xsZWN0aW9uLnNvcnRUb2Rvcyhzb3J0Qnk6ICdGaWxlJywgc29ydEFzYzogZmFsc2UpXG4gICAgICBleHBlY3QoY29sbGVjdGlvbi50b2Rvc1swXS5wYXRoKS50b0JlICdmaWxlMi50eHQnXG4gICAgICBleHBlY3QoY29sbGVjdGlvbi50b2Rvc1szXS5wYXRoKS50b0JlICdmaWxlMS50eHQnXG5cbiAgICBpdCAnc29ydCBsaW5lIGFzIG51bWJlcicsIC0+XG4gICAgICBjb2xsZWN0aW9uLnNvcnRUb2Rvcyhzb3J0Qnk6ICdMaW5lJywgc29ydEFzYzogdHJ1ZSlcbiAgICAgIGV4cGVjdChjb2xsZWN0aW9uLnRvZG9zWzBdLmxpbmUpLnRvQmUgJzQnXG4gICAgICBleHBlY3QoY29sbGVjdGlvbi50b2Rvc1sxXS5saW5lKS50b0JlICc1J1xuICAgICAgZXhwZWN0KGNvbGxlY3Rpb24udG9kb3NbMl0ubGluZSkudG9CZSAnNidcbiAgICAgIGV4cGVjdChjb2xsZWN0aW9uLnRvZG9zWzNdLmxpbmUpLnRvQmUgJzEzJ1xuXG4gICAgICBjb2xsZWN0aW9uLnNvcnRUb2Rvcyhzb3J0Qnk6ICdSYW5nZScsIHNvcnRBc2M6IHRydWUpXG4gICAgICBleHBlY3QoY29sbGVjdGlvbi50b2Rvc1swXS5yYW5nZSkudG9CZSAnMyw2LDMsMTAnXG4gICAgICBleHBlY3QoY29sbGVjdGlvbi50b2Rvc1sxXS5yYW5nZSkudG9CZSAnNCw1LDQsOSdcbiAgICAgIGV4cGVjdChjb2xsZWN0aW9uLnRvZG9zWzJdLnJhbmdlKS50b0JlICc1LDcsNSwxMSdcbiAgICAgIGV4cGVjdChjb2xsZWN0aW9uLnRvZG9zWzNdLnJhbmdlKS50b0JlICcxMiwxNCwxMiwxNidcblxuICAgIGl0ICdwZXJmb3JtcyBhIHN0YWJsZSBzb3J0JywgLT5cbiAgICAgIGNvbGxlY3Rpb24uc29ydFRvZG9zKHNvcnRCeTogJ0ZpbGUnLCBzb3J0QXNjOiB0cnVlKVxuICAgICAgZXhwZWN0KGNvbGxlY3Rpb24udG9kb3NbMF0udGV4dCkudG9CZSAnZml4bWUgMSdcbiAgICAgIGV4cGVjdChjb2xsZWN0aW9uLnRvZG9zWzFdLnRleHQpLnRvQmUgJ2ZpeG1lIDMnXG4gICAgICBleHBlY3QoY29sbGVjdGlvbi50b2Rvc1syXS50ZXh0KS50b0JlICd0b2RvIDEnXG4gICAgICBleHBlY3QoY29sbGVjdGlvbi50b2Rvc1szXS50ZXh0KS50b0JlICdmaXhtZSAyJ1xuXG4gICAgICBjb2xsZWN0aW9uLnNvcnRUb2Rvcyhzb3J0Qnk6ICdUZXh0Jywgc29ydEFzYzogZmFsc2UpXG4gICAgICBleHBlY3QoY29sbGVjdGlvbi50b2Rvc1swXS50ZXh0KS50b0JlICd0b2RvIDEnXG4gICAgICBleHBlY3QoY29sbGVjdGlvbi50b2Rvc1sxXS50ZXh0KS50b0JlICdmaXhtZSAzJ1xuICAgICAgZXhwZWN0KGNvbGxlY3Rpb24udG9kb3NbMl0udGV4dCkudG9CZSAnZml4bWUgMidcbiAgICAgIGV4cGVjdChjb2xsZWN0aW9uLnRvZG9zWzNdLnRleHQpLnRvQmUgJ2ZpeG1lIDEnXG5cbiAgICAgIGNvbGxlY3Rpb24uc29ydFRvZG9zKHNvcnRCeTogJ0ZpbGUnLCBzb3J0QXNjOiB0cnVlKVxuICAgICAgZXhwZWN0KGNvbGxlY3Rpb24udG9kb3NbMF0udGV4dCkudG9CZSAndG9kbyAxJ1xuICAgICAgZXhwZWN0KGNvbGxlY3Rpb24udG9kb3NbMV0udGV4dCkudG9CZSAnZml4bWUgMydcbiAgICAgIGV4cGVjdChjb2xsZWN0aW9uLnRvZG9zWzJdLnRleHQpLnRvQmUgJ2ZpeG1lIDEnXG4gICAgICBleHBlY3QoY29sbGVjdGlvbi50b2Rvc1szXS50ZXh0KS50b0JlICdmaXhtZSAyJ1xuXG4gICAgICBjb2xsZWN0aW9uLnNvcnRUb2Rvcyhzb3J0Qnk6ICdUeXBlJywgc29ydEFzYzogdHJ1ZSlcbiAgICAgIGV4cGVjdChjb2xsZWN0aW9uLnRvZG9zWzBdLnRleHQpLnRvQmUgJ2ZpeG1lIDMnXG4gICAgICBleHBlY3QoY29sbGVjdGlvbi50b2Rvc1sxXS50ZXh0KS50b0JlICdmaXhtZSAxJ1xuICAgICAgZXhwZWN0KGNvbGxlY3Rpb24udG9kb3NbMl0udGV4dCkudG9CZSAnZml4bWUgMidcbiAgICAgIGV4cGVjdChjb2xsZWN0aW9uLnRvZG9zWzNdLnRleHQpLnRvQmUgJ3RvZG8gMSdcblxuICAgIGl0ICdzb3J0cyB0eXBlIGluIHRoZSBkZWZpbmVkIG9yZGVyJywgLT5cbiAgICAgIGNvbGxlY3Rpb24uc29ydFRvZG9zKHNvcnRCeTogJ1R5cGUnLCBzb3J0QXNjOiB0cnVlKVxuICAgICAgZXhwZWN0KGNvbGxlY3Rpb24udG9kb3NbMF0udGV4dCkudG9CZSAnZml4bWUgMSdcbiAgICAgIGV4cGVjdChjb2xsZWN0aW9uLnRvZG9zWzFdLnRleHQpLnRvQmUgJ2ZpeG1lIDInXG4gICAgICBleHBlY3QoY29sbGVjdGlvbi50b2Rvc1syXS50ZXh0KS50b0JlICdmaXhtZSAzJ1xuICAgICAgZXhwZWN0KGNvbGxlY3Rpb24udG9kb3NbM10udGV4dCkudG9CZSAndG9kbyAxJ1xuXG4gICAgICBhdG9tLmNvbmZpZy5zZXQgJ3RvZG8tc2hvdy5maW5kVGhlc2VUb2RvcycsIFsnVE9ETycsICdGSVhNRSddXG4gICAgICBjb2xsZWN0aW9uLnNvcnRUb2Rvcyhzb3J0Qnk6ICdUeXBlJywgc29ydEFzYzogdHJ1ZSlcbiAgICAgIGV4cGVjdChjb2xsZWN0aW9uLnRvZG9zWzBdLnRleHQpLnRvQmUgJ3RvZG8gMSdcbiAgICAgIGV4cGVjdChjb2xsZWN0aW9uLnRvZG9zWzFdLnRleHQpLnRvQmUgJ2ZpeG1lIDEnXG4gICAgICBleHBlY3QoY29sbGVjdGlvbi50b2Rvc1syXS50ZXh0KS50b0JlICdmaXhtZSAyJ1xuICAgICAgZXhwZWN0KGNvbGxlY3Rpb24udG9kb3NbM10udGV4dCkudG9CZSAnZml4bWUgMydcblxuICAgICAgY29sbGVjdGlvbi5zb3J0VG9kb3Moc29ydEJ5OiAnVHlwZScsIHNvcnRBc2M6IGZhbHNlKVxuICAgICAgZXhwZWN0KGNvbGxlY3Rpb24udG9kb3NbMF0udGV4dCkudG9CZSAnZml4bWUgMydcbiAgICAgIGV4cGVjdChjb2xsZWN0aW9uLnRvZG9zWzFdLnRleHQpLnRvQmUgJ2ZpeG1lIDInXG4gICAgICBleHBlY3QoY29sbGVjdGlvbi50b2Rvc1syXS50ZXh0KS50b0JlICdmaXhtZSAxJ1xuICAgICAgZXhwZWN0KGNvbGxlY3Rpb24udG9kb3NbM10udGV4dCkudG9CZSAndG9kbyAxJ1xuXG4gIGRlc2NyaWJlICdGaWx0ZXIgdG9kb3MnLCAtPlxuICAgIHtmaWx0ZXJTcHl9ID0gW11cblxuICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgIGF0b20uY29uZmlnLnNldCAndG9kby1zaG93LnNob3dJblRhYmxlJywgZGVmYXVsdFNob3dJblRhYmxlXG4gICAgICBhZGRUZXN0VG9kb3MoKVxuICAgICAgZmlsdGVyU3B5ID0gamFzbWluZS5jcmVhdGVTcHkoKVxuICAgICAgY29sbGVjdGlvbi5vbkRpZEZpbHRlclRvZG9zIGZpbHRlclNweVxuXG4gICAgaXQgJ2NhbiBmaWx0ZXIgc2ltcGxlIHRvZG9zJywgLT5cbiAgICAgIGNvbGxlY3Rpb24uZmlsdGVyVG9kb3MoJ1RPRE8nKVxuICAgICAgZXhwZWN0KGZpbHRlclNweS5jYWxsQ291bnQpLnRvQmUgMVxuICAgICAgZXhwZWN0KGZpbHRlclNweS5jYWxsc1swXS5hcmdzWzBdKS50b0hhdmVMZW5ndGggMVxuXG4gICAgaXQgJ2NhbiBmaWx0ZXIgdG9kb3Mgd2l0aCBtdWx0aXBsZSByZXN1bHRzJywgLT5cbiAgICAgIGNvbGxlY3Rpb24uZmlsdGVyVG9kb3MoJ2ZpbGUxJylcbiAgICAgIGV4cGVjdChmaWx0ZXJTcHkuY2FsbENvdW50KS50b0JlIDFcbiAgICAgIGV4cGVjdChmaWx0ZXJTcHkuY2FsbHNbMF0uYXJnc1swXSkudG9IYXZlTGVuZ3RoIDJcblxuICAgIGl0ICdoYW5kbGVzIG5vIHJlc3VsdHMnLCAtPlxuICAgICAgY29sbGVjdGlvbi5maWx0ZXJUb2RvcygnWFlaJylcbiAgICAgIGV4cGVjdChmaWx0ZXJTcHkuY2FsbENvdW50KS50b0JlIDFcbiAgICAgIGV4cGVjdChmaWx0ZXJTcHkuY2FsbHNbMF0uYXJnc1swXSkudG9IYXZlTGVuZ3RoIDBcblxuICAgIGl0ICdoYW5kbGVzIGVtcHR5IGZpbHRlcicsIC0+XG4gICAgICBjb2xsZWN0aW9uLmZpbHRlclRvZG9zKCcnKVxuICAgICAgZXhwZWN0KGZpbHRlclNweS5jYWxsQ291bnQpLnRvQmUgMVxuICAgICAgZXhwZWN0KGZpbHRlclNweS5jYWxsc1swXS5hcmdzWzBdKS50b0hhdmVMZW5ndGggM1xuXG4gICAgaXQgJ2Nhc2UgaW5zZW5zaXRpdmUgZmlsdGVyJywgLT5cbiAgICAgIGNvbGxlY3Rpb24uYWRkVG9kbyhcbiAgICAgICAgbmV3IFRvZG9Nb2RlbChcbiAgICAgICAgICBhbGw6ICcjRklYTUU6IFRISVMgSVMgV0lUSCBDQVBTJ1xuICAgICAgICAgIGxvYzogJ2ZpbGUyLnR4dCdcbiAgICAgICAgICBwb3NpdGlvbjogW1s2LDddLCBbNiwxMV1dXG4gICAgICAgICAgcmVnZXg6IHRvZG9SZWdleC5yZWdleFxuICAgICAgICAgIHJlZ2V4cDogdG9kb1JlZ2V4LnJlZ2V4cFxuICAgICAgICApXG4gICAgICApXG5cbiAgICAgIGNvbGxlY3Rpb24uZmlsdGVyVG9kb3MoJ0ZJWE1FIDEnKVxuICAgICAgcmVzdWx0ID0gZmlsdGVyU3B5LmNhbGxzWzBdLmFyZ3NbMF1cbiAgICAgIGV4cGVjdChmaWx0ZXJTcHkuY2FsbENvdW50KS50b0JlIDFcbiAgICAgIGV4cGVjdChyZXN1bHQpLnRvSGF2ZUxlbmd0aCAxXG4gICAgICBleHBlY3QocmVzdWx0WzBdLnRleHQpLnRvQmUgJ2ZpeG1lIDEnXG5cbiAgICAgIGNvbGxlY3Rpb24uZmlsdGVyVG9kb3MoJ2NhcHMnKVxuICAgICAgcmVzdWx0ID0gZmlsdGVyU3B5LmNhbGxzWzFdLmFyZ3NbMF1cbiAgICAgIGV4cGVjdChmaWx0ZXJTcHkuY2FsbENvdW50KS50b0JlIDJcbiAgICAgIGV4cGVjdChyZXN1bHQpLnRvSGF2ZUxlbmd0aCAxXG4gICAgICBleHBlY3QocmVzdWx0WzBdLnRleHQpLnRvQmUgJ1RISVMgSVMgV0lUSCBDQVBTJ1xuXG4gICAgICBjb2xsZWN0aW9uLmZpbHRlclRvZG9zKCdOT05FWElTVElORycpXG4gICAgICByZXN1bHQgPSBmaWx0ZXJTcHkuY2FsbHNbMl0uYXJnc1swXVxuICAgICAgZXhwZWN0KGZpbHRlclNweS5jYWxsQ291bnQpLnRvQmUgM1xuICAgICAgZXhwZWN0KHJlc3VsdCkudG9IYXZlTGVuZ3RoIDBcblxuICBkZXNjcmliZSAnTWFya2Rvd24nLCAtPlxuICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgIGF0b20uY29uZmlnLnNldCAndG9kby1zaG93LmZpbmRUaGVzZVRvZG9zJywgWydGSVhNRScsICdUT0RPJ11cbiAgICAgIGF0b20uY29uZmlnLnNldCAndG9kby1zaG93LnNob3dJblRhYmxlJywgZGVmYXVsdFNob3dJblRhYmxlXG5cbiAgICBpdCAnY3JlYXRlcyBhIG1hcmtkb3duIHN0cmluZyBmcm9tIHJlZ2V4ZXMnLCAtPlxuICAgICAgYWRkVGVzdFRvZG9zKClcbiAgICAgIGV4cGVjdChjb2xsZWN0aW9uLmdldE1hcmtkb3duKCkpLnRvRXF1YWwgXCJcIlwiXG4gICAgICAgIC0gZml4bWUgMSBfX0ZJWE1FX18gW2ZpbGUxLnR4dF0oZmlsZTEudHh0KVxuICAgICAgICAtIHRvZG8gMSBfX1RPRE9fXyBbZmlsZTEudHh0XShmaWxlMS50eHQpXG4gICAgICAgIC0gZml4bWUgMiBfX0ZJWE1FX18gW2ZpbGUyLnR4dF0oZmlsZTIudHh0KVxcblxuICAgICAgXCJcIlwiXG5cbiAgICBpdCAnY3JlYXRlcyBtYXJrZG93biB3aXRoIHNvcnRpbmcnLCAtPlxuICAgICAgYWRkVGVzdFRvZG9zKClcbiAgICAgIGNvbGxlY3Rpb24uc29ydFRvZG9zKHNvcnRCeTogJ1RleHQnLCBzb3J0QXNjOiB0cnVlKVxuICAgICAgZXhwZWN0KGNvbGxlY3Rpb24uZ2V0TWFya2Rvd24oKSkudG9FcXVhbCBcIlwiXCJcbiAgICAgICAgLSBmaXhtZSAxIF9fRklYTUVfXyBbZmlsZTEudHh0XShmaWxlMS50eHQpXG4gICAgICAgIC0gZml4bWUgMiBfX0ZJWE1FX18gW2ZpbGUyLnR4dF0oZmlsZTIudHh0KVxuICAgICAgICAtIHRvZG8gMSBfX1RPRE9fXyBbZmlsZTEudHh0XShmaWxlMS50eHQpXFxuXG4gICAgICBcIlwiXCJcblxuICAgIGl0ICdjcmVhdGVzIG1hcmtkb3duIHdpdGggaW52ZXJzZSBzb3J0aW5nJywgLT5cbiAgICAgIGFkZFRlc3RUb2RvcygpXG4gICAgICBjb2xsZWN0aW9uLnNvcnRUb2Rvcyhzb3J0Qnk6ICdUZXh0Jywgc29ydEFzYzogZmFsc2UpXG4gICAgICBleHBlY3QoY29sbGVjdGlvbi5nZXRNYXJrZG93bigpKS50b0VxdWFsIFwiXCJcIlxuICAgICAgICAtIHRvZG8gMSBfX1RPRE9fXyBbZmlsZTEudHh0XShmaWxlMS50eHQpXG4gICAgICAgIC0gZml4bWUgMiBfX0ZJWE1FX18gW2ZpbGUyLnR4dF0oZmlsZTIudHh0KVxuICAgICAgICAtIGZpeG1lIDEgX19GSVhNRV9fIFtmaWxlMS50eHRdKGZpbGUxLnR4dClcXG5cbiAgICAgIFwiXCJcIlxuXG4gICAgaXQgJ2NyZWF0ZXMgbWFya2Rvd24gd2l0aCBkaWZmZXJlbnQgaXRlbXMnLCAtPlxuICAgICAgYWRkVGVzdFRvZG9zKClcbiAgICAgIGF0b20uY29uZmlnLnNldCAndG9kby1zaG93LnNob3dJblRhYmxlJywgWydUeXBlJywgJ0ZpbGUnLCAnUmFuZ2UnXVxuICAgICAgZXhwZWN0KGNvbGxlY3Rpb24uZ2V0TWFya2Rvd24oKSkudG9FcXVhbCBcIlwiXCJcbiAgICAgICAgLSBfX0ZJWE1FX18gW2ZpbGUxLnR4dF0oZmlsZTEudHh0KSBfOjMsNiwzLDEwX1xuICAgICAgICAtIF9fVE9ET19fIFtmaWxlMS50eHRdKGZpbGUxLnR4dCkgXzo0LDUsNCw5X1xuICAgICAgICAtIF9fRklYTUVfXyBbZmlsZTIudHh0XShmaWxlMi50eHQpIF86NSw3LDUsMTFfXFxuXG4gICAgICBcIlwiXCJcblxuICAgIGl0ICdjcmVhdGVzIG1hcmtkb3duIGFzIHRhYmxlJywgLT5cbiAgICAgIGFkZFRlc3RUb2RvcygpXG4gICAgICBhdG9tLmNvbmZpZy5zZXQgJ3RvZG8tc2hvdy5zYXZlT3V0cHV0QXMnLCAnVGFibGUnXG4gICAgICBleHBlY3QoY29sbGVjdGlvbi5nZXRNYXJrZG93bigpKS50b0VxdWFsIFwiXCJcIlxuICAgICAgICB8IFRleHQgfCBUeXBlIHwgRmlsZSB8XG4gICAgICAgIHwtLS0tLS0tLS0tLS0tLS0tLS0tLXxcbiAgICAgICAgfCBmaXhtZSAxIHwgX19GSVhNRV9fIHwgW2ZpbGUxLnR4dF0oZmlsZTEudHh0KSB8XG4gICAgICAgIHwgdG9kbyAxIHwgX19UT0RPX18gfCBbZmlsZTEudHh0XShmaWxlMS50eHQpIHxcbiAgICAgICAgfCBmaXhtZSAyIHwgX19GSVhNRV9fIHwgW2ZpbGUyLnR4dF0oZmlsZTIudHh0KSB8XFxuXG4gICAgICBcIlwiXCJcblxuICAgIGl0ICdjcmVhdGVzIG1hcmtkb3duIGFzIHRhYmxlIHdpdGggZGlmZmVyZW50IGl0ZW1zJywgLT5cbiAgICAgIGFkZFRlc3RUb2RvcygpXG4gICAgICBhdG9tLmNvbmZpZy5zZXQgJ3RvZG8tc2hvdy5zYXZlT3V0cHV0QXMnLCAnVGFibGUnXG4gICAgICBhdG9tLmNvbmZpZy5zZXQgJ3RvZG8tc2hvdy5zaG93SW5UYWJsZScsIFsnVHlwZScsICdGaWxlJywgJ1JhbmdlJ11cbiAgICAgIGV4cGVjdChjb2xsZWN0aW9uLmdldE1hcmtkb3duKCkpLnRvRXF1YWwgXCJcIlwiXG4gICAgICAgIHwgVHlwZSB8IEZpbGUgfCBSYW5nZSB8XG4gICAgICAgIHwtLS0tLS0tLS0tLS0tLS0tLS0tLS18XG4gICAgICAgIHwgX19GSVhNRV9fIHwgW2ZpbGUxLnR4dF0oZmlsZTEudHh0KSB8IF86Myw2LDMsMTBfIHxcbiAgICAgICAgfCBfX1RPRE9fXyB8IFtmaWxlMS50eHRdKGZpbGUxLnR4dCkgfCBfOjQsNSw0LDlfIHxcbiAgICAgICAgfCBfX0ZJWE1FX18gfCBbZmlsZTIudHh0XShmaWxlMi50eHQpIHwgXzo1LDcsNSwxMV8gfFxcblxuICAgICAgXCJcIlwiXG5cbiAgICBpdCAnYWNjZXB0cyBtaXNzaW5nIHJhbmdlcyBhbmQgcGF0aHMgaW4gcmVnZXhlcycsIC0+XG4gICAgICBjb2xsZWN0aW9uLmFkZFRvZG8oXG4gICAgICAgIG5ldyBUb2RvTW9kZWwoXG4gICAgICAgICAgdGV4dDogJ2ZpeG1lIDEnXG4gICAgICAgICAgdHlwZTogJ0ZJWE1FJ1xuICAgICAgICAsIHBsYWluOiB0cnVlKVxuICAgICAgKVxuICAgICAgZXhwZWN0KGNvbGxlY3Rpb24uZ2V0TWFya2Rvd24oKSkudG9FcXVhbCBcIlwiXCJcbiAgICAgICAgLSBmaXhtZSAxIF9fRklYTUVfX1xcblxuICAgICAgXCJcIlwiXG5cbiAgICAgIGF0b20uY29uZmlnLnNldCAndG9kby1zaG93LnNob3dJblRhYmxlJywgWydUeXBlJywgJ0ZpbGUnLCAnUmFuZ2UnLCAnVGV4dCddXG4gICAgICBtYXJrZG93biA9ICdcXG4jIyBVbmtub3duIEZpbGVcXG5cXG4tIGZpeG1lIDEgYEZJWE1Fc2BcXG4nXG4gICAgICBleHBlY3QoY29sbGVjdGlvbi5nZXRNYXJrZG93bigpKS50b0VxdWFsIFwiXCJcIlxuICAgICAgICAtIF9fRklYTUVfXyBmaXhtZSAxXFxuXG4gICAgICBcIlwiXCJcblxuICAgIGl0ICdhY2NlcHRzIG1pc3NpbmcgdGl0bGUgaW4gcmVnZXhlcycsIC0+XG4gICAgICBjb2xsZWN0aW9uLmFkZFRvZG8oXG4gICAgICAgIG5ldyBUb2RvTW9kZWwoXG4gICAgICAgICAgdGV4dDogJ2ZpeG1lIDEnXG4gICAgICAgICAgZmlsZTogJ2ZpbGUxLnR4dCdcbiAgICAgICAgLCBwbGFpbjogdHJ1ZSlcbiAgICAgIClcbiAgICAgIGV4cGVjdChjb2xsZWN0aW9uLmdldE1hcmtkb3duKCkpLnRvRXF1YWwgXCJcIlwiXG4gICAgICAgIC0gZml4bWUgMSBbZmlsZTEudHh0XShmaWxlMS50eHQpXFxuXG4gICAgICBcIlwiXCJcblxuICAgICAgYXRvbS5jb25maWcuc2V0ICd0b2RvLXNob3cuc2hvd0luVGFibGUnLCBbJ1RpdGxlJ11cbiAgICAgIGV4cGVjdChjb2xsZWN0aW9uLmdldE1hcmtkb3duKCkpLnRvRXF1YWwgXCJcIlwiXG4gICAgICAgIC0gTm8gZGV0YWlsc1xcblxuICAgICAgXCJcIlwiXG5cbiAgICBpdCAnYWNjZXB0cyBtaXNzaW5nIGl0ZW1zIGluIHRhYmxlIG91dHB1dCcsIC0+XG4gICAgICBjb2xsZWN0aW9uLmFkZFRvZG8oXG4gICAgICAgIG5ldyBUb2RvTW9kZWwoXG4gICAgICAgICAgdGV4dDogJ2ZpeG1lIDEnXG4gICAgICAgICAgdHlwZTogJ0ZJWE1FJ1xuICAgICAgICAsIHBsYWluOiB0cnVlKVxuICAgICAgKVxuICAgICAgYXRvbS5jb25maWcuc2V0ICd0b2RvLXNob3cuc2F2ZU91dHB1dEFzJywgJ1RhYmxlJ1xuICAgICAgZXhwZWN0KGNvbGxlY3Rpb24uZ2V0TWFya2Rvd24oKSkudG9FcXVhbCBcIlwiXCJcbiAgICAgICAgfCBUZXh0IHwgVHlwZSB8IEZpbGUgfFxuICAgICAgICB8LS0tLS0tLS0tLS0tLS0tLS0tLS18XG4gICAgICAgIHwgZml4bWUgMSB8IF9fRklYTUVfXyB8IHxcXG5cbiAgICAgIFwiXCJcIlxuXG4gICAgICBhdG9tLmNvbmZpZy5zZXQgJ3RvZG8tc2hvdy5zaG93SW5UYWJsZScsIFsnTGluZSddXG4gICAgICBleHBlY3QoY29sbGVjdGlvbi5nZXRNYXJrZG93bigpKS50b0VxdWFsIFwiXCJcIlxuICAgICAgICB8IExpbmUgfFxuICAgICAgICB8LS0tLS0tfFxuICAgICAgICB8IHxcXG5cbiAgICAgIFwiXCJcIlxuIl19
