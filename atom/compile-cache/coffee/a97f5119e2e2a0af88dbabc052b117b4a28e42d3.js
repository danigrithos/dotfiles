(function() {
  describe('The Error Panel Visibility Configuration Option', function() {
    var configString;
    configString = 'linter.showErrorPanel';
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvZGRld2V5Ly5hdG9tL3BhY2thZ2VzL2xpbnRlci9zcGVjL2NvbmZpZy9zaG93LWVycm9yLXBhbmVsLXNwZWMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQUEsUUFBQSxDQUFTLGlEQUFULEVBQTRELFNBQUE7QUFFMUQsUUFBQTtJQUFBLFlBQUEsR0FBZTtJQUVmLFVBQUEsQ0FBVyxTQUFBO2FBQ1QsZUFBQSxDQUFnQixTQUFBO2VBQ2QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFkLENBQThCLFFBQTlCO01BRGMsQ0FBaEI7SUFEUyxDQUFYO1dBSUEsRUFBQSxDQUFHLHVCQUFILEVBQTRCLFNBQUE7QUFDMUIsVUFBQTtNQUFBLGNBQUEsR0FBaUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLFlBQWhCO2FBQ2pCLE1BQUEsQ0FBTyxjQUFQLENBQXNCLENBQUMsSUFBdkIsQ0FBNEIsSUFBNUI7SUFGMEIsQ0FBNUI7RUFSMEQsQ0FBNUQ7QUFBQSIsInNvdXJjZXNDb250ZW50IjpbImRlc2NyaWJlICdUaGUgRXJyb3IgUGFuZWwgVmlzaWJpbGl0eSBDb25maWd1cmF0aW9uIE9wdGlvbicsIC0+XG5cbiAgY29uZmlnU3RyaW5nID0gJ2xpbnRlci5zaG93RXJyb3JQYW5lbCdcblxuICBiZWZvcmVFYWNoIC0+XG4gICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICBhdG9tLnBhY2thZ2VzLmFjdGl2YXRlUGFja2FnZSgnbGludGVyJylcblxuICBpdCAnaXMgYHRydWVgIGJ5IGRlZmF1bHQuJywgLT5cbiAgICBwYWNrYWdlU2V0dGluZyA9IGF0b20uY29uZmlnLmdldCBjb25maWdTdHJpbmdcbiAgICBleHBlY3QocGFja2FnZVNldHRpbmcpLnRvQmUgdHJ1ZVxuIl19
