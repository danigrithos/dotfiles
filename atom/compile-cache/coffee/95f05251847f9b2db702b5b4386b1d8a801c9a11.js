(function() {
  describe('Indie', function() {
    var Indie, Validate, indie;
    Validate = require('../lib/validate');
    Indie = require('../lib/indie');
    indie = null;
    beforeEach(function() {
      if (indie != null) {
        indie.dispose();
      }
      return indie = new Indie({});
    });
    describe('Validations', function() {
      return it('just cares about a name', function() {
        var linter;
        linter = {};
        Validate.linter(linter, true);
        expect(linter.name).toBe(null);
        linter.name = 'a';
        Validate.linter(linter, true);
        expect(linter.name).toBe('a');
        linter.name = 2;
        return expect(function() {
          return Validate.linter(linter, true);
        }).toThrow();
      });
    });
    describe('constructor', function() {
      return it('sets a scope for message registry to know', function() {
        return expect(indie.scope).toBe('project');
      });
    });
    describe('{set, delete}Messages', function() {
      return it('notifies the event listeners of the change', function() {
        var listener, messages;
        listener = jasmine.createSpy('indie.listener');
        messages = [{}];
        indie.onDidUpdateMessages(listener);
        indie.setMessages(messages);
        expect(listener).toHaveBeenCalled();
        expect(listener.calls.length).toBe(1);
        expect(listener).toHaveBeenCalledWith(messages);
        indie.deleteMessages();
        expect(listener.calls.length).toBe(2);
        expect(listener.mostRecentCall.args[0] instanceof Array);
        return expect(listener.mostRecentCall.args[0].length).toBe(0);
      });
    });
    return describe('dispose', function() {
      return it('triggers the onDidDestroy event', function() {
        var listener;
        listener = jasmine.createSpy('indie.destroy');
        indie.onDidDestroy(listener);
        indie.dispose();
        return expect(listener).toHaveBeenCalled();
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvZGRld2V5Ly5hdG9tL3BhY2thZ2VzL2xpbnRlci9zcGVjL2luZGllLXNwZWMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQUEsUUFBQSxDQUFTLE9BQVQsRUFBa0IsU0FBQTtBQUNoQixRQUFBO0lBQUEsUUFBQSxHQUFXLE9BQUEsQ0FBUSxpQkFBUjtJQUNYLEtBQUEsR0FBUSxPQUFBLENBQVEsY0FBUjtJQUNSLEtBQUEsR0FBUTtJQUVSLFVBQUEsQ0FBVyxTQUFBOztRQUNULEtBQUssQ0FBRSxPQUFQLENBQUE7O2FBQ0EsS0FBQSxHQUFZLElBQUEsS0FBQSxDQUFNLEVBQU47SUFGSCxDQUFYO0lBSUEsUUFBQSxDQUFTLGFBQVQsRUFBd0IsU0FBQTthQUN0QixFQUFBLENBQUcseUJBQUgsRUFBOEIsU0FBQTtBQUM1QixZQUFBO1FBQUEsTUFBQSxHQUFTO1FBQ1QsUUFBUSxDQUFDLE1BQVQsQ0FBZ0IsTUFBaEIsRUFBd0IsSUFBeEI7UUFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLElBQWQsQ0FBbUIsQ0FBQyxJQUFwQixDQUF5QixJQUF6QjtRQUNBLE1BQU0sQ0FBQyxJQUFQLEdBQWM7UUFDZCxRQUFRLENBQUMsTUFBVCxDQUFnQixNQUFoQixFQUF3QixJQUF4QjtRQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsSUFBZCxDQUFtQixDQUFDLElBQXBCLENBQXlCLEdBQXpCO1FBQ0EsTUFBTSxDQUFDLElBQVAsR0FBYztlQUNkLE1BQUEsQ0FBTyxTQUFBO2lCQUNMLFFBQVEsQ0FBQyxNQUFULENBQWdCLE1BQWhCLEVBQXdCLElBQXhCO1FBREssQ0FBUCxDQUVBLENBQUMsT0FGRCxDQUFBO01BUjRCLENBQTlCO0lBRHNCLENBQXhCO0lBYUEsUUFBQSxDQUFTLGFBQVQsRUFBd0IsU0FBQTthQUN0QixFQUFBLENBQUcsMkNBQUgsRUFBZ0QsU0FBQTtlQUM5QyxNQUFBLENBQU8sS0FBSyxDQUFDLEtBQWIsQ0FBbUIsQ0FBQyxJQUFwQixDQUF5QixTQUF6QjtNQUQ4QyxDQUFoRDtJQURzQixDQUF4QjtJQUlBLFFBQUEsQ0FBUyx1QkFBVCxFQUFrQyxTQUFBO2FBQ2hDLEVBQUEsQ0FBRyw0Q0FBSCxFQUFpRCxTQUFBO0FBQy9DLFlBQUE7UUFBQSxRQUFBLEdBQVcsT0FBTyxDQUFDLFNBQVIsQ0FBa0IsZ0JBQWxCO1FBQ1gsUUFBQSxHQUFXLENBQUMsRUFBRDtRQUNYLEtBQUssQ0FBQyxtQkFBTixDQUEwQixRQUExQjtRQUNBLEtBQUssQ0FBQyxXQUFOLENBQWtCLFFBQWxCO1FBQ0EsTUFBQSxDQUFPLFFBQVAsQ0FBZ0IsQ0FBQyxnQkFBakIsQ0FBQTtRQUNBLE1BQUEsQ0FBTyxRQUFRLENBQUMsS0FBSyxDQUFDLE1BQXRCLENBQTZCLENBQUMsSUFBOUIsQ0FBbUMsQ0FBbkM7UUFDQSxNQUFBLENBQU8sUUFBUCxDQUFnQixDQUFDLG9CQUFqQixDQUFzQyxRQUF0QztRQUNBLEtBQUssQ0FBQyxjQUFOLENBQUE7UUFDQSxNQUFBLENBQU8sUUFBUSxDQUFDLEtBQUssQ0FBQyxNQUF0QixDQUE2QixDQUFDLElBQTlCLENBQW1DLENBQW5DO1FBQ0EsTUFBQSxDQUFPLFFBQVEsQ0FBQyxjQUFjLENBQUMsSUFBSyxDQUFBLENBQUEsQ0FBN0IsWUFBMkMsS0FBbEQ7ZUFDQSxNQUFBLENBQU8sUUFBUSxDQUFDLGNBQWMsQ0FBQyxJQUFLLENBQUEsQ0FBQSxDQUFFLENBQUMsTUFBdkMsQ0FBOEMsQ0FBQyxJQUEvQyxDQUFvRCxDQUFwRDtNQVgrQyxDQUFqRDtJQURnQyxDQUFsQztXQWNBLFFBQUEsQ0FBUyxTQUFULEVBQW9CLFNBQUE7YUFDbEIsRUFBQSxDQUFHLGlDQUFILEVBQXNDLFNBQUE7QUFDcEMsWUFBQTtRQUFBLFFBQUEsR0FBVyxPQUFPLENBQUMsU0FBUixDQUFrQixlQUFsQjtRQUNYLEtBQUssQ0FBQyxZQUFOLENBQW1CLFFBQW5CO1FBQ0EsS0FBSyxDQUFDLE9BQU4sQ0FBQTtlQUNBLE1BQUEsQ0FBTyxRQUFQLENBQWdCLENBQUMsZ0JBQWpCLENBQUE7TUFKb0MsQ0FBdEM7SUFEa0IsQ0FBcEI7RUF4Q2dCLENBQWxCO0FBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJkZXNjcmliZSAnSW5kaWUnLCAtPlxuICBWYWxpZGF0ZSA9IHJlcXVpcmUoJy4uL2xpYi92YWxpZGF0ZScpXG4gIEluZGllID0gcmVxdWlyZSgnLi4vbGliL2luZGllJylcbiAgaW5kaWUgPSBudWxsXG5cbiAgYmVmb3JlRWFjaCAtPlxuICAgIGluZGllPy5kaXNwb3NlKClcbiAgICBpbmRpZSA9IG5ldyBJbmRpZSh7fSlcblxuICBkZXNjcmliZSAnVmFsaWRhdGlvbnMnLCAtPlxuICAgIGl0ICdqdXN0IGNhcmVzIGFib3V0IGEgbmFtZScsIC0+XG4gICAgICBsaW50ZXIgPSB7fVxuICAgICAgVmFsaWRhdGUubGludGVyKGxpbnRlciwgdHJ1ZSlcbiAgICAgIGV4cGVjdChsaW50ZXIubmFtZSkudG9CZShudWxsKVxuICAgICAgbGludGVyLm5hbWUgPSAnYSdcbiAgICAgIFZhbGlkYXRlLmxpbnRlcihsaW50ZXIsIHRydWUpXG4gICAgICBleHBlY3QobGludGVyLm5hbWUpLnRvQmUoJ2EnKVxuICAgICAgbGludGVyLm5hbWUgPSAyXG4gICAgICBleHBlY3QgLT5cbiAgICAgICAgVmFsaWRhdGUubGludGVyKGxpbnRlciwgdHJ1ZSlcbiAgICAgIC50b1Rocm93KClcblxuICBkZXNjcmliZSAnY29uc3RydWN0b3InLCAtPlxuICAgIGl0ICdzZXRzIGEgc2NvcGUgZm9yIG1lc3NhZ2UgcmVnaXN0cnkgdG8ga25vdycsIC0+XG4gICAgICBleHBlY3QoaW5kaWUuc2NvcGUpLnRvQmUoJ3Byb2plY3QnKVxuXG4gIGRlc2NyaWJlICd7c2V0LCBkZWxldGV9TWVzc2FnZXMnLCAtPlxuICAgIGl0ICdub3RpZmllcyB0aGUgZXZlbnQgbGlzdGVuZXJzIG9mIHRoZSBjaGFuZ2UnLCAtPlxuICAgICAgbGlzdGVuZXIgPSBqYXNtaW5lLmNyZWF0ZVNweSgnaW5kaWUubGlzdGVuZXInKVxuICAgICAgbWVzc2FnZXMgPSBbe31dXG4gICAgICBpbmRpZS5vbkRpZFVwZGF0ZU1lc3NhZ2VzKGxpc3RlbmVyKVxuICAgICAgaW5kaWUuc2V0TWVzc2FnZXMobWVzc2FnZXMpXG4gICAgICBleHBlY3QobGlzdGVuZXIpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgZXhwZWN0KGxpc3RlbmVyLmNhbGxzLmxlbmd0aCkudG9CZSgxKVxuICAgICAgZXhwZWN0KGxpc3RlbmVyKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChtZXNzYWdlcylcbiAgICAgIGluZGllLmRlbGV0ZU1lc3NhZ2VzKClcbiAgICAgIGV4cGVjdChsaXN0ZW5lci5jYWxscy5sZW5ndGgpLnRvQmUoMilcbiAgICAgIGV4cGVjdChsaXN0ZW5lci5tb3N0UmVjZW50Q2FsbC5hcmdzWzBdIGluc3RhbmNlb2YgQXJyYXkpXG4gICAgICBleHBlY3QobGlzdGVuZXIubW9zdFJlY2VudENhbGwuYXJnc1swXS5sZW5ndGgpLnRvQmUoMClcblxuICBkZXNjcmliZSAnZGlzcG9zZScsIC0+XG4gICAgaXQgJ3RyaWdnZXJzIHRoZSBvbkRpZERlc3Ryb3kgZXZlbnQnLCAtPlxuICAgICAgbGlzdGVuZXIgPSBqYXNtaW5lLmNyZWF0ZVNweSgnaW5kaWUuZGVzdHJveScpXG4gICAgICBpbmRpZS5vbkRpZERlc3Ryb3kobGlzdGVuZXIpXG4gICAgICBpbmRpZS5kaXNwb3NlKClcbiAgICAgIGV4cGVjdChsaXN0ZW5lcikudG9IYXZlQmVlbkNhbGxlZCgpXG4iXX0=
