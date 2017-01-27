(function() {
  describe('IndieRegistry', function() {
    var IndieRegistry, indieRegistry;
    IndieRegistry = require('../lib/indie-registry');
    indieRegistry = null;
    beforeEach(function() {
      if (indieRegistry != null) {
        indieRegistry.dispose();
      }
      return indieRegistry = new IndieRegistry();
    });
    describe('register', function() {
      return it('validates the args', function() {
        expect(function() {
          return indieRegistry.register({
            name: 2
          });
        }).toThrow();
        indieRegistry.register({});
        return indieRegistry.register({
          name: 'wow'
        });
      });
    });
    return describe('all of it', function() {
      return it('works', function() {
        var indie, listener, messages, observeListener;
        indie = indieRegistry.register({
          name: 'Wow'
        });
        expect(indieRegistry.has(indie)).toBe(false);
        expect(indieRegistry.has(0)).toBe(false);
        listener = jasmine.createSpy('linter.indie.messaging');
        observeListener = jasmine.createSpy('linter.indie.observe');
        messages = [{}];
        indieRegistry.onDidUpdateMessages(listener);
        indieRegistry.observe(observeListener);
        indie.setMessages(messages);
        expect(observeListener).toHaveBeenCalled();
        expect(observeListener).toHaveBeenCalledWith(indie);
        expect(listener).toHaveBeenCalled();
        expect(listener.mostRecentCall.args[0].linter.toBe(indie));
        expect(listener.mostRecentCall.args[0].messages.toBe(messages));
        indie.dispose();
        return expect(indieRegistry.has(indie)).toBe(false);
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvZGRld2V5Ly5hdG9tL3BhY2thZ2VzL2xpbnRlci9zcGVjL2luZGllLXJlZ2lzdHJ5LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUFBLFFBQUEsQ0FBUyxlQUFULEVBQTBCLFNBQUE7QUFDeEIsUUFBQTtJQUFBLGFBQUEsR0FBZ0IsT0FBQSxDQUFRLHVCQUFSO0lBQ2hCLGFBQUEsR0FBZ0I7SUFFaEIsVUFBQSxDQUFXLFNBQUE7O1FBQ1QsYUFBYSxDQUFFLE9BQWYsQ0FBQTs7YUFDQSxhQUFBLEdBQW9CLElBQUEsYUFBQSxDQUFBO0lBRlgsQ0FBWDtJQUlBLFFBQUEsQ0FBUyxVQUFULEVBQXFCLFNBQUE7YUFDbkIsRUFBQSxDQUFHLG9CQUFILEVBQXlCLFNBQUE7UUFDdkIsTUFBQSxDQUFPLFNBQUE7aUJBQ0wsYUFBYSxDQUFDLFFBQWQsQ0FBdUI7WUFBQyxJQUFBLEVBQU0sQ0FBUDtXQUF2QjtRQURLLENBQVAsQ0FFQSxDQUFDLE9BRkQsQ0FBQTtRQUdBLGFBQWEsQ0FBQyxRQUFkLENBQXVCLEVBQXZCO2VBQ0EsYUFBYSxDQUFDLFFBQWQsQ0FBdUI7VUFBQyxJQUFBLEVBQU0sS0FBUDtTQUF2QjtNQUx1QixDQUF6QjtJQURtQixDQUFyQjtXQVFBLFFBQUEsQ0FBUyxXQUFULEVBQXNCLFNBQUE7YUFDcEIsRUFBQSxDQUFHLE9BQUgsRUFBWSxTQUFBO0FBQ1YsWUFBQTtRQUFBLEtBQUEsR0FBUSxhQUFhLENBQUMsUUFBZCxDQUF1QjtVQUFDLElBQUEsRUFBTSxLQUFQO1NBQXZCO1FBQ1IsTUFBQSxDQUFPLGFBQWEsQ0FBQyxHQUFkLENBQWtCLEtBQWxCLENBQVAsQ0FBZ0MsQ0FBQyxJQUFqQyxDQUFzQyxLQUF0QztRQUNBLE1BQUEsQ0FBTyxhQUFhLENBQUMsR0FBZCxDQUFrQixDQUFsQixDQUFQLENBQTRCLENBQUMsSUFBN0IsQ0FBa0MsS0FBbEM7UUFFQSxRQUFBLEdBQVcsT0FBTyxDQUFDLFNBQVIsQ0FBa0Isd0JBQWxCO1FBQ1gsZUFBQSxHQUFrQixPQUFPLENBQUMsU0FBUixDQUFrQixzQkFBbEI7UUFDbEIsUUFBQSxHQUFXLENBQUMsRUFBRDtRQUNYLGFBQWEsQ0FBQyxtQkFBZCxDQUFrQyxRQUFsQztRQUNBLGFBQWEsQ0FBQyxPQUFkLENBQXNCLGVBQXRCO1FBQ0EsS0FBSyxDQUFDLFdBQU4sQ0FBa0IsUUFBbEI7UUFDQSxNQUFBLENBQU8sZUFBUCxDQUF1QixDQUFDLGdCQUF4QixDQUFBO1FBQ0EsTUFBQSxDQUFPLGVBQVAsQ0FBdUIsQ0FBQyxvQkFBeEIsQ0FBNkMsS0FBN0M7UUFDQSxNQUFBLENBQU8sUUFBUCxDQUFnQixDQUFDLGdCQUFqQixDQUFBO1FBQ0EsTUFBQSxDQUFPLFFBQVEsQ0FBQyxjQUFjLENBQUMsSUFBSyxDQUFBLENBQUEsQ0FBRSxDQUFDLE1BQU0sQ0FBQyxJQUF2QyxDQUE0QyxLQUE1QyxDQUFQO1FBQ0EsTUFBQSxDQUFPLFFBQVEsQ0FBQyxjQUFjLENBQUMsSUFBSyxDQUFBLENBQUEsQ0FBRSxDQUFDLFFBQVEsQ0FBQyxJQUF6QyxDQUE4QyxRQUE5QyxDQUFQO1FBQ0EsS0FBSyxDQUFDLE9BQU4sQ0FBQTtlQUNBLE1BQUEsQ0FBTyxhQUFhLENBQUMsR0FBZCxDQUFrQixLQUFsQixDQUFQLENBQWdDLENBQUMsSUFBakMsQ0FBc0MsS0FBdEM7TUFqQlUsQ0FBWjtJQURvQixDQUF0QjtFQWhCd0IsQ0FBMUI7QUFBQSIsInNvdXJjZXNDb250ZW50IjpbImRlc2NyaWJlICdJbmRpZVJlZ2lzdHJ5JywgLT5cbiAgSW5kaWVSZWdpc3RyeSA9IHJlcXVpcmUoJy4uL2xpYi9pbmRpZS1yZWdpc3RyeScpXG4gIGluZGllUmVnaXN0cnkgPSBudWxsXG5cbiAgYmVmb3JlRWFjaCAtPlxuICAgIGluZGllUmVnaXN0cnk/LmRpc3Bvc2UoKVxuICAgIGluZGllUmVnaXN0cnkgPSBuZXcgSW5kaWVSZWdpc3RyeSgpXG5cbiAgZGVzY3JpYmUgJ3JlZ2lzdGVyJywgLT5cbiAgICBpdCAndmFsaWRhdGVzIHRoZSBhcmdzJywgLT5cbiAgICAgIGV4cGVjdCAtPlxuICAgICAgICBpbmRpZVJlZ2lzdHJ5LnJlZ2lzdGVyKHtuYW1lOiAyfSlcbiAgICAgIC50b1Rocm93KClcbiAgICAgIGluZGllUmVnaXN0cnkucmVnaXN0ZXIoe30pXG4gICAgICBpbmRpZVJlZ2lzdHJ5LnJlZ2lzdGVyKHtuYW1lOiAnd293J30pXG5cbiAgZGVzY3JpYmUgJ2FsbCBvZiBpdCcsIC0+XG4gICAgaXQgJ3dvcmtzJywgLT5cbiAgICAgIGluZGllID0gaW5kaWVSZWdpc3RyeS5yZWdpc3Rlcih7bmFtZTogJ1dvdyd9KVxuICAgICAgZXhwZWN0KGluZGllUmVnaXN0cnkuaGFzKGluZGllKSkudG9CZShmYWxzZSlcbiAgICAgIGV4cGVjdChpbmRpZVJlZ2lzdHJ5LmhhcygwKSkudG9CZShmYWxzZSlcblxuICAgICAgbGlzdGVuZXIgPSBqYXNtaW5lLmNyZWF0ZVNweSgnbGludGVyLmluZGllLm1lc3NhZ2luZycpXG4gICAgICBvYnNlcnZlTGlzdGVuZXIgPSBqYXNtaW5lLmNyZWF0ZVNweSgnbGludGVyLmluZGllLm9ic2VydmUnKVxuICAgICAgbWVzc2FnZXMgPSBbe31dXG4gICAgICBpbmRpZVJlZ2lzdHJ5Lm9uRGlkVXBkYXRlTWVzc2FnZXMobGlzdGVuZXIpXG4gICAgICBpbmRpZVJlZ2lzdHJ5Lm9ic2VydmUob2JzZXJ2ZUxpc3RlbmVyKVxuICAgICAgaW5kaWUuc2V0TWVzc2FnZXMobWVzc2FnZXMpXG4gICAgICBleHBlY3Qob2JzZXJ2ZUxpc3RlbmVyKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIGV4cGVjdChvYnNlcnZlTGlzdGVuZXIpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKGluZGllKVxuICAgICAgZXhwZWN0KGxpc3RlbmVyKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIGV4cGVjdChsaXN0ZW5lci5tb3N0UmVjZW50Q2FsbC5hcmdzWzBdLmxpbnRlci50b0JlKGluZGllKSlcbiAgICAgIGV4cGVjdChsaXN0ZW5lci5tb3N0UmVjZW50Q2FsbC5hcmdzWzBdLm1lc3NhZ2VzLnRvQmUobWVzc2FnZXMpKVxuICAgICAgaW5kaWUuZGlzcG9zZSgpXG4gICAgICBleHBlY3QoaW5kaWVSZWdpc3RyeS5oYXMoaW5kaWUpKS50b0JlKGZhbHNlKVxuIl19
