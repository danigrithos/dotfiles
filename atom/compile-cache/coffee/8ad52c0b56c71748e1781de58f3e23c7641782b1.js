(function() {
  describe('Commands', function() {
    var getMessage, linter;
    linter = null;
    beforeEach(function() {
      return waitsForPromise(function() {
        return atom.packages.activatePackage('linter').then(function() {
          linter = atom.packages.getActivePackage('linter').mainModule.instance;
          return atom.workspace.open(__dirname + '/fixtures/file.txt');
        });
      });
    });
    getMessage = require('./common').getMessage;
    describe('linter:togglePanel', function() {
      return it('toggles the panel visibility', function() {
        var visibility;
        linter.views.bottomPanel.scope = 'Project';
        linter.getActiveEditorLinter().addMessage(getMessage('Error'));
        linter.views.render({
          added: [getMessage('Error')],
          removed: [],
          messages: []
        });
        visibility = linter.views.bottomPanel.getVisibility();
        expect(visibility).toBe(true);
        linter.commands.togglePanel();
        expect(linter.views.bottomPanel.getVisibility()).toBe(!visibility);
        linter.commands.togglePanel();
        return expect(linter.views.bottomPanel.getVisibility()).toBe(visibility);
      });
    });
    return describe('linter:toggle', function() {
      return it('relint when enabled', function() {
        return waitsForPromise(function() {
          return atom.workspace.open(__dirname + '/fixtures/file.txt').then(function() {
            spyOn(linter.commands, 'lint');
            linter.commands.toggleLinter();
            linter.commands.toggleLinter();
            return expect(linter.commands.lint).toHaveBeenCalled();
          });
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvZGRld2V5Ly5hdG9tL3BhY2thZ2VzL2xpbnRlci9zcGVjL2NvbW1hbmRzLXNwZWMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQUEsUUFBQSxDQUFTLFVBQVQsRUFBcUIsU0FBQTtBQUNuQixRQUFBO0lBQUEsTUFBQSxHQUFTO0lBRVQsVUFBQSxDQUFXLFNBQUE7YUFDVCxlQUFBLENBQWdCLFNBQUE7ZUFDZCxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWQsQ0FBOEIsUUFBOUIsQ0FBdUMsQ0FBQyxJQUF4QyxDQUE2QyxTQUFBO1VBQzNDLE1BQUEsR0FBUyxJQUFJLENBQUMsUUFBUSxDQUFDLGdCQUFkLENBQStCLFFBQS9CLENBQXdDLENBQUMsVUFBVSxDQUFDO2lCQUM3RCxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsU0FBQSxHQUFZLG9CQUFoQztRQUYyQyxDQUE3QztNQURjLENBQWhCO0lBRFMsQ0FBWDtJQU1DLGFBQWMsT0FBQSxDQUFRLFVBQVI7SUFFZixRQUFBLENBQVMsb0JBQVQsRUFBK0IsU0FBQTthQUM3QixFQUFBLENBQUcsOEJBQUgsRUFBbUMsU0FBQTtBQUVqQyxZQUFBO1FBQUEsTUFBTSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsS0FBekIsR0FBaUM7UUFDakMsTUFBTSxDQUFDLHFCQUFQLENBQUEsQ0FBOEIsQ0FBQyxVQUEvQixDQUEwQyxVQUFBLENBQVcsT0FBWCxDQUExQztRQUNBLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBYixDQUFvQjtVQUFDLEtBQUEsRUFBTyxDQUFDLFVBQUEsQ0FBVyxPQUFYLENBQUQsQ0FBUjtVQUErQixPQUFBLEVBQVMsRUFBeEM7VUFBNEMsUUFBQSxFQUFVLEVBQXREO1NBQXBCO1FBRUEsVUFBQSxHQUFhLE1BQU0sQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLGFBQXpCLENBQUE7UUFDYixNQUFBLENBQU8sVUFBUCxDQUFrQixDQUFDLElBQW5CLENBQXdCLElBQXhCO1FBQ0EsTUFBTSxDQUFDLFFBQVEsQ0FBQyxXQUFoQixDQUFBO1FBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLGFBQXpCLENBQUEsQ0FBUCxDQUFnRCxDQUFDLElBQWpELENBQXNELENBQUksVUFBMUQ7UUFDQSxNQUFNLENBQUMsUUFBUSxDQUFDLFdBQWhCLENBQUE7ZUFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsYUFBekIsQ0FBQSxDQUFQLENBQWdELENBQUMsSUFBakQsQ0FBc0QsVUFBdEQ7TUFYaUMsQ0FBbkM7SUFENkIsQ0FBL0I7V0FjQSxRQUFBLENBQVMsZUFBVCxFQUEwQixTQUFBO2FBQ3hCLEVBQUEsQ0FBRyxxQkFBSCxFQUEwQixTQUFBO2VBQ3hCLGVBQUEsQ0FBZ0IsU0FBQTtpQkFDZCxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsU0FBQSxHQUFZLG9CQUFoQyxDQUFxRCxDQUFDLElBQXRELENBQTJELFNBQUE7WUFDekQsS0FBQSxDQUFNLE1BQU0sQ0FBQyxRQUFiLEVBQXVCLE1BQXZCO1lBQ0EsTUFBTSxDQUFDLFFBQVEsQ0FBQyxZQUFoQixDQUFBO1lBQ0EsTUFBTSxDQUFDLFFBQVEsQ0FBQyxZQUFoQixDQUFBO21CQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQXZCLENBQTRCLENBQUMsZ0JBQTdCLENBQUE7VUFKeUQsQ0FBM0Q7UUFEYyxDQUFoQjtNQUR3QixDQUExQjtJQUR3QixDQUExQjtFQXpCbUIsQ0FBckI7QUFBQSIsInNvdXJjZXNDb250ZW50IjpbImRlc2NyaWJlICdDb21tYW5kcycsIC0+XG4gIGxpbnRlciA9IG51bGxcblxuICBiZWZvcmVFYWNoIC0+XG4gICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICBhdG9tLnBhY2thZ2VzLmFjdGl2YXRlUGFja2FnZSgnbGludGVyJykudGhlbiAtPlxuICAgICAgICBsaW50ZXIgPSBhdG9tLnBhY2thZ2VzLmdldEFjdGl2ZVBhY2thZ2UoJ2xpbnRlcicpLm1haW5Nb2R1bGUuaW5zdGFuY2VcbiAgICAgICAgYXRvbS53b3Jrc3BhY2Uub3BlbihfX2Rpcm5hbWUgKyAnL2ZpeHR1cmVzL2ZpbGUudHh0JylcblxuICB7Z2V0TWVzc2FnZX0gPSByZXF1aXJlKCcuL2NvbW1vbicpXG5cbiAgZGVzY3JpYmUgJ2xpbnRlcjp0b2dnbGVQYW5lbCcsIC0+XG4gICAgaXQgJ3RvZ2dsZXMgdGhlIHBhbmVsIHZpc2liaWxpdHknLCAtPlxuICAgICAgIyBTZXQgdXAgdmlzaWJpbGl0eS5cbiAgICAgIGxpbnRlci52aWV3cy5ib3R0b21QYW5lbC5zY29wZSA9ICdQcm9qZWN0J1xuICAgICAgbGludGVyLmdldEFjdGl2ZUVkaXRvckxpbnRlcigpLmFkZE1lc3NhZ2UoZ2V0TWVzc2FnZSgnRXJyb3InKSlcbiAgICAgIGxpbnRlci52aWV3cy5yZW5kZXIoe2FkZGVkOiBbZ2V0TWVzc2FnZSgnRXJyb3InKV0sIHJlbW92ZWQ6IFtdLCBtZXNzYWdlczogW119KVxuXG4gICAgICB2aXNpYmlsaXR5ID0gbGludGVyLnZpZXdzLmJvdHRvbVBhbmVsLmdldFZpc2liaWxpdHkoKVxuICAgICAgZXhwZWN0KHZpc2liaWxpdHkpLnRvQmUodHJ1ZSlcbiAgICAgIGxpbnRlci5jb21tYW5kcy50b2dnbGVQYW5lbCgpXG4gICAgICBleHBlY3QobGludGVyLnZpZXdzLmJvdHRvbVBhbmVsLmdldFZpc2liaWxpdHkoKSkudG9CZShub3QgdmlzaWJpbGl0eSlcbiAgICAgIGxpbnRlci5jb21tYW5kcy50b2dnbGVQYW5lbCgpXG4gICAgICBleHBlY3QobGludGVyLnZpZXdzLmJvdHRvbVBhbmVsLmdldFZpc2liaWxpdHkoKSkudG9CZSh2aXNpYmlsaXR5KVxuXG4gIGRlc2NyaWJlICdsaW50ZXI6dG9nZ2xlJywgLT5cbiAgICBpdCAncmVsaW50IHdoZW4gZW5hYmxlZCcsIC0+XG4gICAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgICAgYXRvbS53b3Jrc3BhY2Uub3BlbihfX2Rpcm5hbWUgKyAnL2ZpeHR1cmVzL2ZpbGUudHh0JykudGhlbiAtPlxuICAgICAgICAgIHNweU9uKGxpbnRlci5jb21tYW5kcywgJ2xpbnQnKVxuICAgICAgICAgIGxpbnRlci5jb21tYW5kcy50b2dnbGVMaW50ZXIoKVxuICAgICAgICAgIGxpbnRlci5jb21tYW5kcy50b2dnbGVMaW50ZXIoKVxuICAgICAgICAgIGV4cGVjdChsaW50ZXIuY29tbWFuZHMubGludCkudG9IYXZlQmVlbkNhbGxlZCgpXG4iXX0=
