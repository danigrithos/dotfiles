(function() {
  describe('The Lint on the Fly Configuration Option', function() {
    var configString;
    configString = 'linter.lintOnFly';
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvZGRld2V5Ly5hdG9tL3BhY2thZ2VzL2xpbnRlci9zcGVjL2NvbmZpZy9saW50LW9uLWZseS1zcGVjLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUFBLFFBQUEsQ0FBUywwQ0FBVCxFQUFxRCxTQUFBO0FBRW5ELFFBQUE7SUFBQSxZQUFBLEdBQWU7SUFFZixVQUFBLENBQVcsU0FBQTthQUNULGVBQUEsQ0FBZ0IsU0FBQTtlQUNkLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZCxDQUE4QixRQUE5QjtNQURjLENBQWhCO0lBRFMsQ0FBWDtXQUlBLEVBQUEsQ0FBRyx1QkFBSCxFQUE0QixTQUFBO0FBQzFCLFVBQUE7TUFBQSxjQUFBLEdBQWlCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixZQUFoQjthQUNqQixNQUFBLENBQU8sY0FBUCxDQUFzQixDQUFDLElBQXZCLENBQTRCLElBQTVCO0lBRjBCLENBQTVCO0VBUm1ELENBQXJEO0FBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJkZXNjcmliZSAnVGhlIExpbnQgb24gdGhlIEZseSBDb25maWd1cmF0aW9uIE9wdGlvbicsIC0+XG5cbiAgY29uZmlnU3RyaW5nID0gJ2xpbnRlci5saW50T25GbHknXG5cbiAgYmVmb3JlRWFjaCAtPlxuICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgYXRvbS5wYWNrYWdlcy5hY3RpdmF0ZVBhY2thZ2UoJ2xpbnRlcicpXG5cbiAgaXQgJ2lzIGB0cnVlYCBieSBkZWZhdWx0LicsIC0+XG4gICAgcGFja2FnZVNldHRpbmcgPSBhdG9tLmNvbmZpZy5nZXQgY29uZmlnU3RyaW5nXG4gICAgZXhwZWN0KHBhY2thZ2VTZXR0aW5nKS50b0JlIHRydWVcbiJdfQ==
