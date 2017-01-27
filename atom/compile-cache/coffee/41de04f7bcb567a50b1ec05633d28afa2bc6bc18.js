(function() {
  describe('Message Element', function() {
    var Message, filePath, getMessage, visibleText;
    Message = require('../../lib/ui/message-element').Message;
    filePath = __dirname + '/fixtures/file.txt';
    getMessage = function(type) {
      return {
        type: type,
        text: 'Some Message',
        filePath: filePath
      };
    };
    visibleText = function(element) {
      var cloned;
      cloned = element.cloneNode(true);
      Array.prototype.forEach.call(cloned.querySelectorAll('[hidden]'), function(item) {
        return item.remove();
      });
      return cloned.textContent;
    };
    it('works', function() {
      var message, messageElement;
      message = getMessage('Error');
      messageElement = Message.fromMessage(message, 'Project');
      messageElement.attachedCallback();
      expect(visibleText(messageElement).indexOf(filePath) !== -1).toBe(true);
      messageElement.updateVisibility('Line');
      expect(messageElement.hasAttribute('hidden')).toBe(true);
      message.currentLine = true;
      messageElement.updateVisibility('Line');
      return expect(visibleText(messageElement).indexOf(filePath) === -1).toBe(true);
    });
    return it('plays nice with class attribute', function() {
      var message, messageElement;
      message = getMessage('Error');
      message["class"] = 'Well Hello';
      messageElement = Message.fromMessage(message, 'Project');
      messageElement.attachedCallback();
      expect(messageElement.querySelector('.Well') instanceof Element).toBe(true);
      expect(messageElement.querySelector('.Hello') instanceof Element).toBe(true);
      return expect(messageElement.querySelector('.haha')).toBe(null);
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvZGRld2V5Ly5hdG9tL3BhY2thZ2VzL2xpbnRlci9zcGVjL3VpL21lc3NhZ2UtZWxlbWVudC1zcGVjLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUFBLFFBQUEsQ0FBUyxpQkFBVCxFQUE0QixTQUFBO0FBQzFCLFFBQUE7SUFBQyxVQUFXLE9BQUEsQ0FBUSw4QkFBUjtJQUNaLFFBQUEsR0FBVyxTQUFBLEdBQVk7SUFFdkIsVUFBQSxHQUFhLFNBQUMsSUFBRDtBQUNYLGFBQU87UUFBQyxNQUFBLElBQUQ7UUFBTyxJQUFBLEVBQU0sY0FBYjtRQUE2QixVQUFBLFFBQTdCOztJQURJO0lBRWIsV0FBQSxHQUFjLFNBQUMsT0FBRDtBQUNaLFVBQUE7TUFBQSxNQUFBLEdBQVMsT0FBTyxDQUFDLFNBQVIsQ0FBa0IsSUFBbEI7TUFDVCxLQUFLLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxJQUF4QixDQUE2QixNQUFNLENBQUMsZ0JBQVAsQ0FBd0IsVUFBeEIsQ0FBN0IsRUFBa0UsU0FBQyxJQUFEO2VBQ2hFLElBQUksQ0FBQyxNQUFMLENBQUE7TUFEZ0UsQ0FBbEU7QUFHQSxhQUFPLE1BQU0sQ0FBQztJQUxGO0lBT2QsRUFBQSxDQUFHLE9BQUgsRUFBWSxTQUFBO0FBQ1YsVUFBQTtNQUFBLE9BQUEsR0FBVSxVQUFBLENBQVcsT0FBWDtNQUNWLGNBQUEsR0FBaUIsT0FBTyxDQUFDLFdBQVIsQ0FBb0IsT0FBcEIsRUFBNkIsU0FBN0I7TUFDakIsY0FBYyxDQUFDLGdCQUFmLENBQUE7TUFFQSxNQUFBLENBQU8sV0FBQSxDQUFZLGNBQVosQ0FBMkIsQ0FBQyxPQUE1QixDQUFvQyxRQUFwQyxDQUFBLEtBQW1ELENBQUMsQ0FBM0QsQ0FBNkQsQ0FBQyxJQUE5RCxDQUFtRSxJQUFuRTtNQUVBLGNBQWMsQ0FBQyxnQkFBZixDQUFnQyxNQUFoQztNQUNBLE1BQUEsQ0FBTyxjQUFjLENBQUMsWUFBZixDQUE0QixRQUE1QixDQUFQLENBQTZDLENBQUMsSUFBOUMsQ0FBbUQsSUFBbkQ7TUFDQSxPQUFPLENBQUMsV0FBUixHQUFzQjtNQUN0QixjQUFjLENBQUMsZ0JBQWYsQ0FBZ0MsTUFBaEM7YUFDQSxNQUFBLENBQU8sV0FBQSxDQUFZLGNBQVosQ0FBMkIsQ0FBQyxPQUE1QixDQUFvQyxRQUFwQyxDQUFBLEtBQWlELENBQUMsQ0FBekQsQ0FBMkQsQ0FBQyxJQUE1RCxDQUFpRSxJQUFqRTtJQVhVLENBQVo7V0FhQSxFQUFBLENBQUcsaUNBQUgsRUFBc0MsU0FBQTtBQUNwQyxVQUFBO01BQUEsT0FBQSxHQUFVLFVBQUEsQ0FBVyxPQUFYO01BQ1YsT0FBTyxFQUFDLEtBQUQsRUFBUCxHQUFnQjtNQUNoQixjQUFBLEdBQWlCLE9BQU8sQ0FBQyxXQUFSLENBQW9CLE9BQXBCLEVBQTZCLFNBQTdCO01BQ2pCLGNBQWMsQ0FBQyxnQkFBZixDQUFBO01BRUEsTUFBQSxDQUFPLGNBQWMsQ0FBQyxhQUFmLENBQTZCLE9BQTdCLENBQUEsWUFBaUQsT0FBeEQsQ0FBZ0UsQ0FBQyxJQUFqRSxDQUFzRSxJQUF0RTtNQUNBLE1BQUEsQ0FBTyxjQUFjLENBQUMsYUFBZixDQUE2QixRQUE3QixDQUFBLFlBQWtELE9BQXpELENBQWlFLENBQUMsSUFBbEUsQ0FBdUUsSUFBdkU7YUFDQSxNQUFBLENBQU8sY0FBYyxDQUFDLGFBQWYsQ0FBNkIsT0FBN0IsQ0FBUCxDQUE2QyxDQUFDLElBQTlDLENBQW1ELElBQW5EO0lBUm9DLENBQXRDO0VBMUIwQixDQUE1QjtBQUFBIiwic291cmNlc0NvbnRlbnQiOlsiZGVzY3JpYmUgJ01lc3NhZ2UgRWxlbWVudCcsIC0+XG4gIHtNZXNzYWdlfSA9IHJlcXVpcmUoJy4uLy4uL2xpYi91aS9tZXNzYWdlLWVsZW1lbnQnKVxuICBmaWxlUGF0aCA9IF9fZGlybmFtZSArICcvZml4dHVyZXMvZmlsZS50eHQnXG5cbiAgZ2V0TWVzc2FnZSA9ICh0eXBlKSAtPlxuICAgIHJldHVybiB7dHlwZSwgdGV4dDogJ1NvbWUgTWVzc2FnZScsIGZpbGVQYXRofVxuICB2aXNpYmxlVGV4dCA9IChlbGVtZW50KSAtPlxuICAgIGNsb25lZCA9IGVsZW1lbnQuY2xvbmVOb2RlKHRydWUpXG4gICAgQXJyYXkucHJvdG90eXBlLmZvckVhY2guY2FsbChjbG9uZWQucXVlcnlTZWxlY3RvckFsbCgnW2hpZGRlbl0nKSwgKGl0ZW0pIC0+XG4gICAgICBpdGVtLnJlbW92ZSgpXG4gICAgKVxuICAgIHJldHVybiBjbG9uZWQudGV4dENvbnRlbnRcblxuICBpdCAnd29ya3MnLCAtPlxuICAgIG1lc3NhZ2UgPSBnZXRNZXNzYWdlKCdFcnJvcicpXG4gICAgbWVzc2FnZUVsZW1lbnQgPSBNZXNzYWdlLmZyb21NZXNzYWdlKG1lc3NhZ2UsICdQcm9qZWN0JylcbiAgICBtZXNzYWdlRWxlbWVudC5hdHRhY2hlZENhbGxiYWNrKClcblxuICAgIGV4cGVjdCh2aXNpYmxlVGV4dChtZXNzYWdlRWxlbWVudCkuaW5kZXhPZihmaWxlUGF0aCkgaXNudCAtMSkudG9CZSh0cnVlKVxuXG4gICAgbWVzc2FnZUVsZW1lbnQudXBkYXRlVmlzaWJpbGl0eSgnTGluZScpXG4gICAgZXhwZWN0KG1lc3NhZ2VFbGVtZW50Lmhhc0F0dHJpYnV0ZSgnaGlkZGVuJykpLnRvQmUodHJ1ZSlcbiAgICBtZXNzYWdlLmN1cnJlbnRMaW5lID0gdHJ1ZVxuICAgIG1lc3NhZ2VFbGVtZW50LnVwZGF0ZVZpc2liaWxpdHkoJ0xpbmUnKVxuICAgIGV4cGVjdCh2aXNpYmxlVGV4dChtZXNzYWdlRWxlbWVudCkuaW5kZXhPZihmaWxlUGF0aCkgaXMgLTEpLnRvQmUodHJ1ZSlcblxuICBpdCAncGxheXMgbmljZSB3aXRoIGNsYXNzIGF0dHJpYnV0ZScsIC0+XG4gICAgbWVzc2FnZSA9IGdldE1lc3NhZ2UoJ0Vycm9yJylcbiAgICBtZXNzYWdlLmNsYXNzID0gJ1dlbGwgSGVsbG8nXG4gICAgbWVzc2FnZUVsZW1lbnQgPSBNZXNzYWdlLmZyb21NZXNzYWdlKG1lc3NhZ2UsICdQcm9qZWN0JylcbiAgICBtZXNzYWdlRWxlbWVudC5hdHRhY2hlZENhbGxiYWNrKClcblxuICAgIGV4cGVjdChtZXNzYWdlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuV2VsbCcpIGluc3RhbmNlb2YgRWxlbWVudCkudG9CZSh0cnVlKVxuICAgIGV4cGVjdChtZXNzYWdlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuSGVsbG8nKSBpbnN0YW5jZW9mIEVsZW1lbnQpLnRvQmUodHJ1ZSlcbiAgICBleHBlY3QobWVzc2FnZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLmhhaGEnKSkudG9CZShudWxsKVxuIl19
