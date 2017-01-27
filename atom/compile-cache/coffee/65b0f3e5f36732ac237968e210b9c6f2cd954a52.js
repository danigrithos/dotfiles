(function() {
  describe('The Issue Underline Configuration Option', function() {
    var configString;
    configString = 'linter.underlineIssues';
    beforeEach(function() {
      return waitsForPromise(function() {
        return atom.packages.activatePackage('linter');
      });
    });
    return it('is `true` by default.', function() {
      var packageSetting;
      packageSetting = atom.config.get(configString);
      return expect(packageSetting).toBe(true);
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvZGRld2V5Ly5hdG9tL3BhY2thZ2VzL2xpbnRlci9zcGVjL2NvbmZpZy91bmRlcmxpbmUtaXNzdWUtc3BlYy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFBQSxRQUFBLENBQVMsMENBQVQsRUFBcUQsU0FBQTtBQUVuRCxRQUFBO0lBQUEsWUFBQSxHQUFlO0lBRWYsVUFBQSxDQUFXLFNBQUE7YUFDVCxlQUFBLENBQWdCLFNBQUE7ZUFDZCxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWQsQ0FBOEIsUUFBOUI7TUFEYyxDQUFoQjtJQURTLENBQVg7V0FJQSxFQUFBLENBQUcsdUJBQUgsRUFBNEIsU0FBQTtBQUMxQixVQUFBO01BQUEsY0FBQSxHQUFpQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsWUFBaEI7YUFDakIsTUFBQSxDQUFPLGNBQVAsQ0FBc0IsQ0FBQyxJQUF2QixDQUE0QixJQUE1QjtJQUYwQixDQUE1QjtFQVJtRCxDQUFyRDtBQUFBIiwic291cmNlc0NvbnRlbnQiOlsiZGVzY3JpYmUgJ1RoZSBJc3N1ZSBVbmRlcmxpbmUgQ29uZmlndXJhdGlvbiBPcHRpb24nLCAtPlxuXG4gIGNvbmZpZ1N0cmluZyA9ICdsaW50ZXIudW5kZXJsaW5lSXNzdWVzJ1xuXG4gIGJlZm9yZUVhY2ggLT5cbiAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgIGF0b20ucGFja2FnZXMuYWN0aXZhdGVQYWNrYWdlKCdsaW50ZXInKVxuXG4gIGl0ICdpcyBgdHJ1ZWAgYnkgZGVmYXVsdC4nLCAtPlxuICAgIHBhY2thZ2VTZXR0aW5nID0gYXRvbS5jb25maWcuZ2V0IGNvbmZpZ1N0cmluZ1xuICAgIGV4cGVjdChwYWNrYWdlU2V0dGluZykudG9CZSB0cnVlXG4iXX0=
