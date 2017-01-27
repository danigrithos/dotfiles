(function() {
  describe('message-registry', function() {
    var EditorLinter, LinterRegistry, MessageRegistry, getLinterRegistry, getMessage, messageRegistry, objectSize, ref;
    messageRegistry = null;
    MessageRegistry = require('../lib/message-registry');
    EditorLinter = require('../lib/editor-linter');
    LinterRegistry = require('../lib/linter-registry');
    objectSize = function(obj) {
      var size, value;
      size = 0;
      for (value in obj) {
        size++;
      }
      return size;
    };
    ref = require('./common'), getLinterRegistry = ref.getLinterRegistry, getMessage = ref.getMessage;
    beforeEach(function() {
      return waitsForPromise(function() {
        atom.workspace.destroyActivePaneItem();
        return atom.workspace.open('test.txt').then(function() {
          if (messageRegistry != null) {
            messageRegistry.dispose();
          }
          return messageRegistry = new MessageRegistry();
        });
      });
    });
    describe('::set', function() {
      it('accepts info from LinterRegistry::lint', function() {
        var editorLinter, linterRegistry, ref1, wasUpdated;
        ref1 = getLinterRegistry(), linterRegistry = ref1.linterRegistry, editorLinter = ref1.editorLinter;
        wasUpdated = false;
        linterRegistry.onDidUpdateMessages(function(linterInfo) {
          wasUpdated = true;
          messageRegistry.set(linterInfo);
          return expect(messageRegistry.hasChanged).toBe(true);
        });
        return waitsForPromise(function() {
          return linterRegistry.lint({
            onChange: false,
            editorLinter: editorLinter
          }).then(function() {
            expect(wasUpdated).toBe(true);
            return linterRegistry.dispose();
          });
        });
      });
      return it('ignores deactivated linters', function() {
        var editorLinter, linter, linterRegistry, ref1;
        ref1 = getLinterRegistry(), linterRegistry = ref1.linterRegistry, editorLinter = ref1.editorLinter, linter = ref1.linter;
        messageRegistry.set({
          linter: linter,
          messages: [getMessage('Error'), getMessage('Warning')]
        });
        messageRegistry.updatePublic();
        expect(messageRegistry.publicMessages.length).toBe(2);
        linter.deactivated = true;
        messageRegistry.set({
          linter: linter,
          messages: [getMessage('Error')]
        });
        messageRegistry.updatePublic();
        expect(messageRegistry.publicMessages.length).toBe(2);
        linter.deactivated = false;
        messageRegistry.set({
          linter: linter,
          messages: [getMessage('Error')]
        });
        messageRegistry.updatePublic();
        return expect(messageRegistry.publicMessages.length).toBe(1);
      });
    });
    describe('::onDidUpdateMessages', function() {
      it('is triggered asyncly with results and provides a diff', function() {
        var editorLinter, linterRegistry, ref1, wasUpdated;
        wasUpdated = false;
        ref1 = getLinterRegistry(), linterRegistry = ref1.linterRegistry, editorLinter = ref1.editorLinter;
        linterRegistry.onDidUpdateMessages(function(linterInfo) {
          messageRegistry.set(linterInfo);
          expect(messageRegistry.hasChanged).toBe(true);
          return messageRegistry.updatePublic();
        });
        messageRegistry.onDidUpdateMessages(function(arg) {
          var added, messages, removed;
          added = arg.added, removed = arg.removed, messages = arg.messages;
          wasUpdated = true;
          expect(added.length).toBe(1);
          expect(removed.length).toBe(0);
          return expect(messages.length).toBe(1);
        });
        return waitsForPromise(function() {
          return linterRegistry.lint({
            onChange: false,
            editorLinter: editorLinter
          }).then(function() {
            expect(wasUpdated).toBe(true);
            return linterRegistry.dispose();
          });
        });
      });
      return it('provides the same objects when they dont change', function() {
        var disposable, editorLinter, linterRegistry, ref1, wasUpdated;
        wasUpdated = false;
        ref1 = getLinterRegistry(), linterRegistry = ref1.linterRegistry, editorLinter = ref1.editorLinter;
        linterRegistry.onDidUpdateMessages(function(linterInfo) {
          messageRegistry.set(linterInfo);
          return messageRegistry.updatePublic();
        });
        disposable = messageRegistry.onDidUpdateMessages(function(arg) {
          var added, obj;
          added = arg.added;
          expect(added.length).toBe(1);
          obj = added[0];
          disposable.dispose();
          return messageRegistry.onDidUpdateMessages(function(arg1) {
            var messages;
            messages = arg1.messages;
            wasUpdated = true;
            return expect(messages[0]).toBe(obj);
          });
        });
        return waitsForPromise(function() {
          return linterRegistry.lint({
            onChange: false,
            editorLinter: editorLinter
          }).then(function() {
            return linterRegistry.lint({
              onChange: false,
              editorLinter: editorLinter
            });
          }).then(function() {
            expect(wasUpdated).toBe(true);
            return linterRegistry.dispose();
          });
        });
      });
    });
    return describe('::deleteEditorMessages', function() {
      return it('removes messages for that editor', function() {
        var editor, editorLinter, linterRegistry, ref1, wasUpdated;
        wasUpdated = 0;
        ref1 = getLinterRegistry(), linterRegistry = ref1.linterRegistry, editorLinter = ref1.editorLinter;
        editor = editorLinter.editor;
        linterRegistry.onDidUpdateMessages(function(linterInfo) {
          messageRegistry.set(linterInfo);
          expect(messageRegistry.hasChanged).toBe(true);
          return messageRegistry.updatePublic();
        });
        messageRegistry.onDidUpdateMessages(function(arg) {
          var messages;
          messages = arg.messages;
          wasUpdated = 1;
          expect(objectSize(messages)).toBe(1);
          return messageRegistry.deleteEditorMessages(editor);
        });
        return waitsForPromise(function() {
          return linterRegistry.lint({
            onChange: false,
            editorLinter: editorLinter
          }).then(function() {
            expect(wasUpdated).toBe(1);
            return linterRegistry.dispose();
          });
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvZGRld2V5Ly5hdG9tL3BhY2thZ2VzL2xpbnRlci9zcGVjL21lc3NhZ2UtcmVnaXN0cnktc3BlYy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFBQSxRQUFBLENBQVMsa0JBQVQsRUFBNkIsU0FBQTtBQUMzQixRQUFBO0lBQUEsZUFBQSxHQUFrQjtJQUNsQixlQUFBLEdBQWtCLE9BQUEsQ0FBUSx5QkFBUjtJQUNsQixZQUFBLEdBQWUsT0FBQSxDQUFRLHNCQUFSO0lBQ2YsY0FBQSxHQUFpQixPQUFBLENBQVEsd0JBQVI7SUFDakIsVUFBQSxHQUFhLFNBQUMsR0FBRDtBQUNYLFVBQUE7TUFBQSxJQUFBLEdBQU87QUFDUCxXQUFBLFlBQUE7UUFBQSxJQUFBO0FBQUE7QUFDQSxhQUFPO0lBSEk7SUFJYixNQUFrQyxPQUFBLENBQVEsVUFBUixDQUFsQyxFQUFDLHlDQUFELEVBQW9CO0lBRXBCLFVBQUEsQ0FBVyxTQUFBO2FBQ1QsZUFBQSxDQUFnQixTQUFBO1FBQ2QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxxQkFBZixDQUFBO2VBQ0EsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLFVBQXBCLENBQStCLENBQUMsSUFBaEMsQ0FBcUMsU0FBQTs7WUFDbkMsZUFBZSxDQUFFLE9BQWpCLENBQUE7O2lCQUNBLGVBQUEsR0FBc0IsSUFBQSxlQUFBLENBQUE7UUFGYSxDQUFyQztNQUZjLENBQWhCO0lBRFMsQ0FBWDtJQU9BLFFBQUEsQ0FBUyxPQUFULEVBQWtCLFNBQUE7TUFDaEIsRUFBQSxDQUFHLHdDQUFILEVBQTZDLFNBQUE7QUFDM0MsWUFBQTtRQUFBLE9BQWlDLGlCQUFBLENBQUEsQ0FBakMsRUFBQyxvQ0FBRCxFQUFpQjtRQUNqQixVQUFBLEdBQWE7UUFDYixjQUFjLENBQUMsbUJBQWYsQ0FBbUMsU0FBQyxVQUFEO1VBQ2pDLFVBQUEsR0FBYTtVQUNiLGVBQWUsQ0FBQyxHQUFo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N0I7QUFBQSIsInNvdXJjZXNDb250ZW50IjpbImRlc2NyaWJlICdtZXNzYWdlLXJlZ2lzdHJ5JywgLT5cbiAgbWVzc2FnZVJlZ2lzdHJ5ID0gbnVsbFxuICBNZXNzYWdlUmVnaXN0cnkgPSByZXF1aXJlKCcuLi9saWIvbWVzc2FnZS1yZWdpc3RyeScpXG4gIEVkaXRvckxpbnRlciA9IHJlcXVpcmUoJy4uL2xpYi9lZGl0b3ItbGludGVyJylcbiAgTGludGVyUmVnaXN0cnkgPSByZXF1aXJlKCcuLi9saWIvbGludGVyLXJlZ2lzdHJ5JylcbiAgb2JqZWN0U2l6ZSA9IChvYmopIC0+XG4gICAgc2l6ZSA9IDBcbiAgICBzaXplKysgZm9yIHZhbHVlIG9mIG9ialxuICAgIHJldHVybiBzaXplXG4gIHtnZXRMaW50ZXJSZWdpc3RyeSwgZ2V0TWVzc2FnZX0gPSByZXF1aXJlKCcuL2NvbW1vbicpXG5cbiAgYmVmb3JlRWFjaCAtPlxuICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgYXRvbS53b3Jrc3BhY2UuZGVzdHJveUFjdGl2ZVBhbmVJdGVtKClcbiAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4oJ3Rlc3QudHh0JykudGhlbiAtPlxuICAgICAgICBtZXNzYWdlUmVnaXN0cnk/LmRpc3Bvc2UoKVxuICAgICAgICBtZXNzYWdlUmVnaXN0cnkgPSBuZXcgTWVzc2FnZVJlZ2lzdHJ5KClcblxuICBkZXNjcmliZSAnOjpzZXQnLCAtPlxuICAgIGl0ICdhY2NlcHRzIGluZm8gZnJvbSBMaW50ZXJSZWdpc3RyeTo6bGludCcsIC0+XG4gICAgICB7bGludGVyUmVnaXN0cnksIGVkaXRvckxpbnRlcn0gPSBnZXRMaW50ZXJSZWdpc3RyeSgpXG4gICAgICB3YXNVcGRhdGVkID0gZmFsc2VcbiAgICAgIGxpbnRlclJlZ2lzdHJ5Lm9uRGlkVXBkYXRlTWVzc2FnZXMgKGxpbnRlckluZm8pIC0+XG4gICAgICAgIHdhc1VwZGF0ZWQgPSB0cnVlXG4gICAgICAgIG1lc3NhZ2VSZWdpc3RyeS5zZXQobGludGVySW5mbylcbiAgICAgICAgZXhwZWN0KG1lc3NhZ2VSZWdpc3RyeS5oYXNDaGFuZ2VkKS50b0JlKHRydWUpXG4gICAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgICAgbGludGVyUmVnaXN0cnkubGludCh7b25DaGFuZ2U6IGZhbHNlLCBlZGl0b3JMaW50ZXJ9KS50aGVuIC0+XG4gICAgICAgICAgZXhwZWN0KHdhc1VwZGF0ZWQpLnRvQmUodHJ1ZSlcbiAgICAgICAgICBsaW50ZXJSZWdpc3RyeS5kaXNwb3NlKClcbiAgICBpdCAnaWdub3JlcyBkZWFjdGl2YXRlZCBsaW50ZXJzJywgLT5cbiAgICAgIHtsaW50ZXJSZWdpc3RyeSwgZWRpdG9yTGludGVyLCBsaW50ZXJ9ID0gZ2V0TGludGVyUmVnaXN0cnkoKVxuICAgICAgbWVzc2FnZVJlZ2lzdHJ5LnNldCh7bGludGVyLCBtZXNzYWdlczogW2dldE1lc3NhZ2UoJ0Vycm9yJyksIGdldE1lc3NhZ2UoJ1dhcm5pbmcnKV19KVxuICAgICAgbWVzc2FnZVJlZ2lzdHJ5LnVwZGF0ZVB1YmxpYygpXG4gICAgICBleHBlY3QobWVzc2FnZVJlZ2lzdHJ5LnB1YmxpY01lc3NhZ2VzLmxlbmd0aCkudG9CZSgyKVxuICAgICAgbGludGVyLmRlYWN0aXZhdGVkID0gdHJ1ZVxuICAgICAgbWVzc2FnZVJlZ2lzdHJ5LnNldCh7bGludGVyLCBtZXNzYWdlczogW2dldE1lc3NhZ2UoJ0Vycm9yJyldfSlcbiAgICAgIG1lc3NhZ2VSZWdpc3RyeS51cGRhdGVQdWJsaWMoKVxuICAgICAgZXhwZWN0KG1lc3NhZ2VSZWdpc3RyeS5wdWJsaWNNZXNzYWdlcy5sZW5ndGgpLnRvQmUoMilcbiAgICAgIGxpbnRlci5kZWFjdGl2YXRlZCA9IGZhbHNlXG4gICAgICBtZXNzYWdlUmVnaXN0cnkuc2V0KHtsaW50ZXIsIG1lc3NhZ2VzOiBbZ2V0TWVzc2FnZSgnRXJyb3InKV19KVxuICAgICAgbWVzc2FnZVJlZ2lzdHJ5LnVwZGF0ZVB1YmxpYygpXG4gICAgICBleHBlY3QobWVzc2FnZVJlZ2lzdHJ5LnB1YmxpY01lc3NhZ2VzLmxlbmd0aCkudG9CZSgxKVxuXG4gIGRlc2NyaWJlICc6Om9uRGlkVXBkYXRlTWVzc2FnZXMnLCAtPlxuICAgIGl0ICdpcyB0cmlnZ2VyZWQgYXN5bmNseSB3aXRoIHJlc3VsdHMgYW5kIHByb3ZpZGVzIGEgZGlmZicsIC0+XG4gICAgICB3YXNVcGRhdGVkID0gZmFsc2VcbiAgICAgIHtsaW50ZXJSZWdpc3RyeSwgZWRpdG9yTGludGVyfSA9IGdldExpbnRlclJlZ2lzdHJ5KClcbiAgICAgIGxpbnRlclJlZ2lzdHJ5Lm9uRGlkVXBkYXRlTWVzc2FnZXMgKGxpbnRlckluZm8pIC0+XG4gICAgICAgIG1lc3NhZ2VSZWdpc3RyeS5zZXQobGludGVySW5mbylcbiAgICAgICAgZXhwZWN0KG1lc3NhZ2VSZWdpc3RyeS5oYXNDaGFuZ2VkKS50b0JlKHRydWUpXG4gICAgICAgIG1lc3NhZ2VSZWdpc3RyeS51cGRhdGVQdWJsaWMoKVxuICAgICAgbWVzc2FnZVJlZ2lzdHJ5Lm9uRGlkVXBkYXRlTWVzc2FnZXMgKHthZGRlZCwgcmVtb3ZlZCwgbWVzc2FnZXN9KSAtPlxuICAgICAgICB3YXNVcGRhdGVkID0gdHJ1ZVxuICAgICAgICBleHBlY3QoYWRkZWQubGVuZ3RoKS50b0JlKDEpXG4gICAgICAgIGV4cGVjdChyZW1vdmVkLmxlbmd0aCkudG9CZSgwKVxuICAgICAgICBleHBlY3QobWVzc2FnZXMubGVuZ3RoKS50b0JlKDEpXG4gICAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgICAgbGludGVyUmVnaXN0cnkubGludCh7b25DaGFuZ2U6IGZhbHNlLCBlZGl0b3JMaW50ZXJ9KS50aGVuIC0+XG4gICAgICAgICAgZXhwZWN0KHdhc1VwZGF0ZWQpLnRvQmUodHJ1ZSlcbiAgICAgICAgICBsaW50ZXJSZWdpc3RyeS5kaXNwb3NlKClcbiAgICBpdCAncHJvdmlkZXMgdGhlIHNhbWUgb2JqZWN0cyB3aGVuIHRoZXkgZG9udCBjaGFuZ2UnLCAtPlxuICAgICAgd2FzVXBkYXRlZCA9IGZhbHNlXG4gICAgICB7bGludGVyUmVnaXN0cnksIGVkaXRvckxpbnRlcn0gPSBnZXRMaW50ZXJSZWdpc3RyeSgpXG4gICAgICBsaW50ZXJSZWdpc3RyeS5vbkRpZFVwZGF0ZU1lc3NhZ2VzIChsaW50ZXJJbmZvKSAtPlxuICAgICAgICBtZXNzYWdlUmVnaXN0cnkuc2V0KGxpbnRlckluZm8pXG4gICAgICAgIG1lc3NhZ2VSZWdpc3RyeS51cGRhdGVQdWJsaWMoKVxuICAgICAgZGlzcG9zYWJsZSA9IG1lc3NhZ2VSZWdpc3RyeS5vbkRpZFVwZGF0ZU1lc3NhZ2VzICh7YWRkZWR9KSAtPlxuICAgICAgICBleHBlY3QoYWRkZWQubGVuZ3RoKS50b0JlKDEpXG4gICAgICAgIG9iaiA9IGFkZGVkWzBdXG4gICAgICAgIGRpc3Bvc2FibGUuZGlzcG9zZSgpXG4gICAgICAgIG1lc3NhZ2VSZWdpc3RyeS5vbkRpZFVwZGF0ZU1lc3NhZ2VzICh7bWVzc2FnZXN9KSAtPlxuICAgICAgICAgIHdhc1VwZGF0ZWQgPSB0cnVlXG4gICAgICAgICAgZXhwZWN0KG1lc3NhZ2VzWzBdKS50b0JlKG9iailcbiAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgICBsaW50ZXJSZWdpc3RyeS5saW50KHtvbkNoYW5nZTogZmFsc2UsIGVkaXRvckxpbnRlcn0pLnRoZW4oIC0+XG4gICAgICAgICAgcmV0dXJuIGxpbnRlclJlZ2lzdHJ5LmxpbnQoe29uQ2hhbmdlOiBmYWxzZSwgZWRpdG9yTGludGVyfSlcbiAgICAgICAgKS50aGVuIC0+XG4gICAgICAgICAgZXhwZWN0KHdhc1VwZGF0ZWQpLnRvQmUodHJ1ZSlcbiAgICAgICAgICBsaW50ZXJSZWdpc3RyeS5kaXNwb3NlKClcblxuICBkZXNjcmliZSAnOjpkZWxldGVFZGl0b3JNZXNzYWdlcycsIC0+XG4gICAgaXQgJ3JlbW92ZXMgbWVzc2FnZXMgZm9yIHRoYXQgZWRpdG9yJywgLT5cbiAgICAgIHdhc1VwZGF0ZWQgPSAwXG4gICAgICB7bGludGVyUmVnaXN0cnksIGVkaXRvckxpbnRlcn0gPSBnZXRMaW50ZXJSZWdpc3RyeSgpXG4gICAgICBlZGl0b3IgPSBlZGl0b3JMaW50ZXIuZWRpdG9yXG4gICAgICBsaW50ZXJSZWdpc3RyeS5vbkRpZFVwZGF0ZU1lc3NhZ2VzIChsaW50ZXJJbmZvKSAtPlxuICAgICAgICBtZXNzYWdlUmVnaXN0cnkuc2V0KGxpbnRlckluZm8pXG4gICAgICAgIGV4cGVjdChtZXNzYWdlUmVnaXN0cnkuaGFzQ2hhbmdlZCkudG9CZSh0cnVlKVxuICAgICAgICBtZXNzYWdlUmVnaXN0cnkudXBkYXRlUHVibGljKClcbiAgICAgIG1lc3NhZ2VSZWdpc3RyeS5vbkRpZFVwZGF0ZU1lc3NhZ2VzICh7bWVzc2FnZXN9KSAtPlxuICAgICAgICB3YXNVcGRhdGVkID0gMVxuICAgICAgICBleHBlY3Qob2JqZWN0U2l6ZShtZXNzYWdlcykpLnRvQmUoMSlcbiAgICAgICAgbWVzc2FnZVJlZ2lzdHJ5LmRlbGV0ZUVkaXRvck1lc3NhZ2VzKGVkaXRvcilcbiAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgICBsaW50ZXJSZWdpc3RyeS5saW50KHtvbkNoYW5nZTogZmFsc2UsIGVkaXRvckxpbnRlcn0pLnRoZW4gLT5cbiAgICAgICAgICBleHBlY3Qod2FzVXBkYXRlZCkudG9CZSgxKVxuICAgICAgICAgIGxpbnRlclJlZ2lzdHJ5LmRpc3Bvc2UoKVxuIl19
