(function() {
  describe('BottomPanelMount', function() {
    var ref, statusBar, statusBarService, workspaceElement;
    ref = [], statusBar = ref[0], statusBarService = ref[1], workspaceElement = ref[2];
    beforeEach(function() {
      workspaceElement = atom.views.getView(atom.workspace);
      waitsForPromise(function() {
        return atom.packages.activatePackage('status-bar').then(function(pack) {
          statusBar = workspaceElement.querySelector('status-bar');
          return statusBarService = pack.mainModule.provideStatusBar();
        });
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage('linter').then(function() {
          return atom.packages.getActivePackage('linter').mainModule.consumeStatusBar(statusBar);
        });
      });
      return waitsForPromise(function() {
        return atom.workspace.open();
      });
    });
    it('can mount to left status-bar', function() {
      var tile;
      tile = statusBar.getLeftTiles()[0];
      return expect(tile.item.localName).toBe('linter-bottom-container');
    });
    it('can mount to right status-bar', function() {
      var tile;
      atom.config.set('linter.statusIconPosition', 'Right');
      tile = statusBar.getRightTiles()[0];
      return expect(tile.item.localName).toBe('linter-bottom-container');
    });
    return it('defaults to visible', function() {
      var tile;
      tile = statusBar.getLeftTiles()[0];
      return expect(tile.item.visibility).toBe(true);
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvZGRld2V5Ly5hdG9tL3BhY2thZ2VzL2xpbnRlci9zcGVjL3VpL2JvdHRvbS1wYW5lbC1tb3VudC1zcGVjLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUFBLFFBQUEsQ0FBUyxrQkFBVCxFQUE2QixTQUFBO0FBQzNCLFFBQUE7SUFBQSxNQUFrRCxFQUFsRCxFQUFDLGtCQUFELEVBQVkseUJBQVosRUFBOEI7SUFDOUIsVUFBQSxDQUFXLFNBQUE7TUFDVCxnQkFBQSxHQUFtQixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIsSUFBSSxDQUFDLFNBQXhCO01BQ25CLGVBQUEsQ0FBZ0IsU0FBQTtlQUNkLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZCxDQUE4QixZQUE5QixDQUEyQyxDQUFDLElBQTVDLENBQWlELFNBQUMsSUFBRDtVQUMvQyxTQUFBLEdBQVksZ0JBQWdCLENBQUMsYUFBakIsQ0FBK0IsWUFBL0I7aUJBQ1osZ0JBQUEsR0FBbUIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxnQkFBaEIsQ0FBQTtRQUY0QixDQUFqRDtNQURjLENBQWhCO01BSUEsZUFBQSxDQUFnQixTQUFBO2VBQ2QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFkLENBQThCLFFBQTlCLENBQXVDLENBQUMsSUFBeEMsQ0FBNkMsU0FBQTtpQkFDM0MsSUFBSSxDQUFDLFFBQVEsQ0FBQyxnQkFBZCxDQUErQixRQUEvQixDQUF3QyxDQUFDLFVBQVUsQ0FBQyxnQkFBcEQsQ0FBcUUsU0FBckU7UUFEMkMsQ0FBN0M7TUFEYyxDQUFoQjthQUdBLGVBQUEsQ0FBZ0IsU0FBQTtlQUNkLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFBO01BRGMsQ0FBaEI7SUFUUyxDQUFYO0lBWUEsRUFBQSxDQUFHLDhCQUFILEVBQW1DLFNBQUE7QUFDakMsVUFBQTtNQUFBLElBQUEsR0FBTyxTQUFTLENBQUMsWUFBVixDQUFBLENBQXlCLENBQUEsQ0FBQTthQUNoQyxNQUFBLENBQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFqQixDQUEyQixDQUFDLElBQTVCLENBQWlDLHlCQUFqQztJQUZpQyxDQUFuQztJQUlBLEVBQUEsQ0FBRywrQkFBSCxFQUFvQyxTQUFBO0FBQ2xDLFVBQUE7TUFBQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsMkJBQWhCLEVBQTZDLE9BQTdDO01BQ0EsSUFBQSxHQUFPLFNBQVMsQ0FBQyxhQUFWLENBQUEsQ0FBMEIsQ0FBQSxDQUFBO2FBQ2pDLE1BQUEsQ0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQWpCLENBQTJCLENBQUMsSUFBNUIsQ0FBaUMseUJBQWpDO0lBSGtDLENBQXBDO1dBS0EsRUFBQSxDQUFHLHFCQUFILEVBQTBCLFNBQUE7QUFDeEIsVUFBQTtNQUFBLElBQUEsR0FBTyxTQUFTLENBQUMsWUFBVixDQUFBLENBQXlCLENBQUEsQ0FBQTthQUNoQyxNQUFBLENBQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFqQixDQUE0QixDQUFDLElBQTdCLENBQWtDLElBQWxDO0lBRndCLENBQTFCO0VBdkIyQixDQUE3QjtBQUFBIiwic291cmNlc0NvbnRlbnQiOlsiZGVzY3JpYmUgJ0JvdHRvbVBhbmVsTW91bnQnLCAtPlxuICBbc3RhdHVzQmFyLCBzdGF0dXNCYXJTZXJ2aWNlLCB3b3Jrc3BhY2VFbGVtZW50XSA9IFtdXG4gIGJlZm9yZUVhY2ggLT5cbiAgICB3b3Jrc3BhY2VFbGVtZW50ID0gYXRvbS52aWV3cy5nZXRWaWV3KGF0b20ud29ya3NwYWNlKVxuICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgYXRvbS5wYWNrYWdlcy5hY3RpdmF0ZVBhY2thZ2UoJ3N0YXR1cy1iYXInKS50aGVuIChwYWNrKSAtPlxuICAgICAgICBzdGF0dXNCYXIgPSB3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ3N0YXR1cy1iYXInKVxuICAgICAgICBzdGF0dXNCYXJTZXJ2aWNlID0gcGFjay5tYWluTW9kdWxlLnByb3ZpZGVTdGF0dXNCYXIoKVxuICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgYXRvbS5wYWNrYWdlcy5hY3RpdmF0ZVBhY2thZ2UoJ2xpbnRlcicpLnRoZW4gLT5cbiAgICAgICAgYXRvbS5wYWNrYWdlcy5nZXRBY3RpdmVQYWNrYWdlKCdsaW50ZXInKS5tYWluTW9kdWxlLmNvbnN1bWVTdGF0dXNCYXIoc3RhdHVzQmFyKVxuICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgYXRvbS53b3Jrc3BhY2Uub3BlbigpXG5cbiAgaXQgJ2NhbiBtb3VudCB0byBsZWZ0IHN0YXR1cy1iYXInLCAtPlxuICAgIHRpbGUgPSBzdGF0dXNCYXIuZ2V0TGVmdFRpbGVzKClbMF1cbiAgICBleHBlY3QodGlsZS5pdGVtLmxvY2FsTmFtZSkudG9CZSgnbGludGVyLWJvdHRvbS1jb250YWluZXInKVxuXG4gIGl0ICdjYW4gbW91bnQgdG8gcmlnaHQgc3RhdHVzLWJhcicsIC0+XG4gICAgYXRvbS5jb25maWcuc2V0KCdsaW50ZXIuc3RhdHVzSWNvblBvc2l0aW9uJywgJ1JpZ2h0JylcbiAgICB0aWxlID0gc3RhdHVzQmFyLmdldFJpZ2h0VGlsZXMoKVswXVxuICAgIGV4cGVjdCh0aWxlLml0ZW0ubG9jYWxOYW1lKS50b0JlKCdsaW50ZXItYm90dG9tLWNvbnRhaW5lcicpXG5cbiAgaXQgJ2RlZmF1bHRzIHRvIHZpc2libGUnLCAtPlxuICAgIHRpbGUgPSBzdGF0dXNCYXIuZ2V0TGVmdFRpbGVzKClbMF1cbiAgICBleHBlY3QodGlsZS5pdGVtLnZpc2liaWxpdHkpLnRvQmUodHJ1ZSlcbiJdfQ==
