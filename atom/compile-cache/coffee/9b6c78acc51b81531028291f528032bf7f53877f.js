(function() {
  describe('helpers', function() {
    var helpers;
    helpers = require('../lib/helpers');
    beforeEach(function() {
      return atom.notifications.clear();
    });
    describe('::error', function() {
      return it('adds an error notification', function() {
        helpers.error(new Error());
        return expect(atom.notifications.getNotifications().length).toBe(1);
      });
    });
    return describe('::shouldTriggerLinter', function() {
      var bufferModifying, lintOnFly, normalLinter;
      normalLinter = {
        grammarScopes: ['*'],
        scope: 'file',
        lintOnFly: false,
        lint: function() {}
      };
      lintOnFly = {
        grammarScopes: ['*'],
        scope: 'file',
        lintOnFly: true,
        lint: function() {}
      };
      bufferModifying = {
        grammarScopes: ['*'],
        scope: 'file',
        lintOnFly: false,
        lint: function() {}
      };
      it('accepts a wildcard grammarScope', function() {
        return expect(helpers.shouldTriggerLinter(normalLinter, false, ['*'])).toBe(true);
      });
      it('runs lintOnFly ones on both save and lintOnFly', function() {
        expect(helpers.shouldTriggerLinter(lintOnFly, false, ['*'])).toBe(true);
        return expect(helpers.shouldTriggerLinter(lintOnFly, true, ['*'])).toBe(true);
      });
      return it("doesn't run save ones on fly", function() {
        return expect(helpers.shouldTriggerLinter(normalLinter, true, ['*'])).toBe(false);
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvZGRld2V5Ly5hdG9tL3BhY2thZ2VzL2xpbnRlci9zcGVjL2hlbHBlcnMtc3BlYy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFBQSxRQUFBLENBQVMsU0FBVCxFQUFvQixTQUFBO0FBQ2xCLFFBQUE7SUFBQSxPQUFBLEdBQVUsT0FBQSxDQUFRLGdCQUFSO0lBQ1YsVUFBQSxDQUFXLFNBQUE7YUFDVCxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQW5CLENBQUE7SUFEUyxDQUFYO0lBR0EsUUFBQSxDQUFTLFNBQVQsRUFBb0IsU0FBQTthQUNsQixFQUFBLENBQUcsNEJBQUgsRUFBaUMsU0FBQTtRQUMvQixPQUFPLENBQUMsS0FBUixDQUFrQixJQUFBLEtBQUEsQ0FBQSxDQUFsQjtlQUNBLE1BQUEsQ0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLGdCQUFuQixDQUFBLENBQXFDLENBQUMsTUFBN0MsQ0FBb0QsQ0FBQyxJQUFyRCxDQUEwRCxDQUExRDtNQUYrQixDQUFqQztJQURrQixDQUFwQjtXQUtBLFFBQUEsQ0FBUyx1QkFBVCxFQUFrQyxTQUFBO0FBQ2hDLFVBQUE7TUFBQSxZQUFBLEdBQ0U7UUFBQSxhQUFBLEVBQWUsQ0FBQyxHQUFELENBQWY7UUFDQSxLQUFBLEVBQU8sTUFEUDtRQUVBLFNBQUEsRUFBVyxLQUZYO1FBR0EsSUFBQSxFQUFNLFNBQUEsR0FBQSxDQUhOOztNQUlGLFNBQUEsR0FDRTtRQUFBLGFBQUEsRUFBZSxDQUFDLEdBQUQsQ0FBZjtRQUNBLEtBQUEsRUFBTyxNQURQO1FBRUEsU0FBQSxFQUFXLElBRlg7UUFHQSxJQUFBLEVBQU0sU0FBQSxHQUFBLENBSE47O01BSUYsZUFBQSxHQUNFO1FBQUEsYUFBQSxFQUFlLENBQUMsR0FBRCxDQUFmO1FBQ0EsS0FBQSxFQUFPLE1BRFA7UUFFQSxTQUFBLEVBQVcsS0FGWDtRQUdBLElBQUEsRUFBTSxTQUFBLEdBQUEsQ0FITjs7TUFJRixFQUFBLENBQUcsaUNBQUgsRUFBc0MsU0FBQTtlQUNwQyxNQUFBLENBQU8sT0FBTyxDQUFDLG1CQUFSLENBQTRCLFlBQTVCLEVBQTBDLEtBQTFDLEVBQWlELENBQUMsR0FBRCxDQUFqRCxDQUFQLENBQStELENBQUMsSUFBaEUsQ0FBcUUsSUFBckU7TUFEb0MsQ0FBdEM7TUFFQSxFQUFBLENBQUcsZ0RBQUgsRUFBcUQsU0FBQTtRQUNuRCxNQUFBLENBQU8sT0FBTyxDQUFDLG1CQUFSLENBQTRCLFNBQTVCLEVBQXVDLEtBQXZDLEVBQThDLENBQUMsR0FBRCxDQUE5QyxDQUFQLENBQTRELENBQUMsSUFBN0QsQ0FBa0UsSUFBbEU7ZUFDQSxNQUFBLENBQU8sT0FBTyxDQUFDLG1CQUFSLENBQTRCLFNBQTVCLEVBQXVDLElBQXZDLEVBQTZDLENBQUMsR0FBRCxDQUE3QyxDQUFQLENBQTJELENBQUMsSUFBNUQsQ0FBaUUsSUFBakU7TUFGbUQsQ0FBckQ7YUFHQSxFQUFBLENBQUcsOEJBQUgsRUFBbUMsU0FBQTtlQUNqQyxNQUFBLENBQU8sT0FBTyxDQUFDLG1CQUFSLENBQTRCLFlBQTVCLEVBQTBDLElBQTFDLEVBQWdELENBQUMsR0FBRCxDQUFoRCxDQUFQLENBQThELENBQUMsSUFBL0QsQ0FBb0UsS0FBcEU7TUFEaUMsQ0FBbkM7SUFyQmdDLENBQWxDO0VBVmtCLENBQXBCO0FBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJkZXNjcmliZSAnaGVscGVycycsIC0+XG4gIGhlbHBlcnMgPSByZXF1aXJlKCcuLi9saWIvaGVscGVycycpXG4gIGJlZm9yZUVhY2ggLT5cbiAgICBhdG9tLm5vdGlmaWNhdGlvbnMuY2xlYXIoKVxuXG4gIGRlc2NyaWJlICc6OmVycm9yJywgLT5cbiAgICBpdCAnYWRkcyBhbiBlcnJvciBub3RpZmljYXRpb24nLCAtPlxuICAgICAgaGVscGVycy5lcnJvcihuZXcgRXJyb3IoKSlcbiAgICAgIGV4cGVjdChhdG9tLm5vdGlmaWNhdGlvbnMuZ2V0Tm90aWZpY2F0aW9ucygpLmxlbmd0aCkudG9CZSgxKVxuXG4gIGRlc2NyaWJlICc6OnNob3VsZFRyaWdnZXJMaW50ZXInLCAtPlxuICAgIG5vcm1hbExpbnRlciA9XG4gICAgICBncmFtbWFyU2NvcGVzOiBbJyonXVxuICAgICAgc2NvcGU6ICdmaWxlJ1xuICAgICAgbGludE9uRmx5OiBmYWxzZVxuICAgICAgbGludDogLT5cbiAgICBsaW50T25GbHkgPVxuICAgICAgZ3JhbW1hclNjb3BlczogWycqJ11cbiAgICAgIHNjb3BlOiAnZmlsZSdcbiAgICAgIGxpbnRPbkZseTogdHJ1ZVxuICAgICAgbGludDogLT5cbiAgICBidWZmZXJNb2RpZnlpbmcgPVxuICAgICAgZ3JhbW1hclNjb3BlczogWycqJ11cbiAgICAgIHNjb3BlOiAnZmlsZSdcbiAgICAgIGxpbnRPbkZseTogZmFsc2VcbiAgICAgIGxpbnQ6IC0+XG4gICAgaXQgJ2FjY2VwdHMgYSB3aWxkY2FyZCBncmFtbWFyU2NvcGUnLCAtPlxuICAgICAgZXhwZWN0KGhlbHBlcnMuc2hvdWxkVHJpZ2dlckxpbnRlcihub3JtYWxMaW50ZXIsIGZhbHNlLCBbJyonXSkpLnRvQmUodHJ1ZSlcbiAgICBpdCAncnVucyBsaW50T25GbHkgb25lcyBvbiBib3RoIHNhdmUgYW5kIGxpbnRPbkZseScsIC0+XG4gICAgICBleHBlY3QoaGVscGVycy5zaG91bGRUcmlnZ2VyTGludGVyKGxpbnRPbkZseSwgZmFsc2UsIFsnKiddKSkudG9CZSh0cnVlKVxuICAgICAgZXhwZWN0KGhlbHBlcnMuc2hvdWxkVHJpZ2dlckxpbnRlcihsaW50T25GbHksIHRydWUsIFsnKiddKSkudG9CZSh0cnVlKVxuICAgIGl0IFwiZG9lc24ndCBydW4gc2F2ZSBvbmVzIG9uIGZseVwiLCAtPlxuICAgICAgZXhwZWN0KGhlbHBlcnMuc2hvdWxkVHJpZ2dlckxpbnRlcihub3JtYWxMaW50ZXIsIHRydWUsIFsnKiddKSkudG9CZShmYWxzZSlcbiJdfQ==
