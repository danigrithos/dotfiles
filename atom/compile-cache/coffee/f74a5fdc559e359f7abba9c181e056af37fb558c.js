(function() {
  describe('Bottom Status Element', function() {
    var BottomStatus, bottomStatus;
    BottomStatus = require('../../lib/ui/bottom-status');
    bottomStatus = null;
    beforeEach(function() {
      return bottomStatus = new BottomStatus;
    });
    return describe('::visibility', function() {
      it('adds and removes the hidden attribute', function() {
        expect(bottomStatus.hasAttribute('hidden')).toBe(false);
        bottomStatus.visibility = true;
        expect(bottomStatus.hasAttribute('hidden')).toBe(false);
        bottomStatus.visibility = false;
        expect(bottomStatus.hasAttribute('hidden')).toBe(true);
        bottomStatus.visibility = true;
        return expect(bottomStatus.hasAttribute('hidden')).toBe(false);
      });
      return it('reports the visibility when getter is invoked', function() {
        expect(bottomStatus.visibility).toBe(true);
        bottomStatus.visibility = true;
        expect(bottomStatus.visibility).toBe(true);
        bottomStatus.visibility = false;
        expect(bottomStatus.visibility).toBe(false);
        bottomStatus.visibility = true;
        return expect(bottomStatus.visibility).toBe(true);
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvZGRld2V5Ly5hdG9tL3BhY2thZ2VzL2xpbnRlci9zcGVjL3VpL2JvdHRvbS1zdGF0dXMtc3BlYy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFBQSxRQUFBLENBQVMsdUJBQVQsRUFBa0MsU0FBQTtBQUNoQyxRQUFBO0lBQUEsWUFBQSxHQUFlLE9BQUEsQ0FBUSw0QkFBUjtJQUNmLFlBQUEsR0FBZTtJQUVmLFVBQUEsQ0FBVyxTQUFBO2FBQ1QsWUFBQSxHQUFlLElBQUk7SUFEVixDQUFYO1dBR0EsUUFBQSxDQUFTLGNBQVQsRUFBeUIsU0FBQTtNQUN2QixFQUFBLENBQUcsdUNBQUgsRUFBNEMsU0FBQTtRQUMxQyxNQUFBLENBQU8sWUFBWSxDQUFDLFlBQWIsQ0FBMEIsUUFBMUIsQ0FBUCxDQUEyQyxDQUFDLElBQTVDLENBQWlELEtBQWpEO1FBQ0EsWUFBWSxDQUFDLFVBQWIsR0FBMEI7UUFDMUIsTUFBQSxDQUFPLFlBQVksQ0FBQyxZQUFiLENBQTBCLFFBQTFCLENBQVAsQ0FBMkMsQ0FBQyxJQUE1QyxDQUFpRCxLQUFqRDtRQUNBLFlBQVksQ0FBQyxVQUFiLEdBQTBCO1FBQzFCLE1BQUEsQ0FBTyxZQUFZLENBQUMsWUFBYixDQUEwQixRQUExQixDQUFQLENBQTJDLENBQUMsSUFBNUMsQ0FBaUQsSUFBakQ7UUFDQSxZQUFZLENBQUMsVUFBYixHQUEwQjtlQUMxQixNQUFBLENBQU8sWUFBWSxDQUFDLFlBQWIsQ0FBMEIsUUFBMUIsQ0FBUCxDQUEyQyxDQUFDLElBQTVDLENBQWlELEtBQWpEO01BUDBDLENBQTVDO2FBU0EsRUFBQSxDQUFHLCtDQUFILEVBQW9ELFNBQUE7UUFDbEQsTUFBQSxDQUFPLFlBQVksQ0FBQyxVQUFwQixDQUErQixDQUFDLElBQWhDLENBQXFDLElBQXJDO1FBQ0EsWUFBWSxDQUFDLFVBQWIsR0FBMEI7UUFDMUIsTUFBQSxDQUFPLFlBQVksQ0FBQyxVQUFwQixDQUErQixDQUFDLElBQWhDLENBQXFDLElBQXJDO1FBQ0EsWUFBWSxDQUFDLFVBQWIsR0FBMEI7UUFDMUIsTUFBQSxDQUFPLFlBQVksQ0FBQyxVQUFwQixDQUErQixDQUFDLElBQWhDLENBQXFDLEtBQXJDO1FBQ0EsWUFBWSxDQUFDLFVBQWIsR0FBMEI7ZUFDMUIsTUFBQSxDQUFPLFlBQVksQ0FBQyxVQUFwQixDQUErQixDQUFDLElBQWhDLENBQXFDLElBQXJDO01BUGtELENBQXBEO0lBVnVCLENBQXpCO0VBUGdDLENBQWxDO0FBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJkZXNjcmliZSAnQm90dG9tIFN0YXR1cyBFbGVtZW50JywgLT5cbiAgQm90dG9tU3RhdHVzID0gcmVxdWlyZSgnLi4vLi4vbGliL3VpL2JvdHRvbS1zdGF0dXMnKVxuICBib3R0b21TdGF0dXMgPSBudWxsXG5cbiAgYmVmb3JlRWFjaCAtPlxuICAgIGJvdHRvbVN0YXR1cyA9IG5ldyBCb3R0b21TdGF0dXNcblxuICBkZXNjcmliZSAnOjp2aXNpYmlsaXR5JywgLT5cbiAgICBpdCAnYWRkcyBhbmQgcmVtb3ZlcyB0aGUgaGlkZGVuIGF0dHJpYnV0ZScsIC0+XG4gICAgICBleHBlY3QoYm90dG9tU3RhdHVzLmhhc0F0dHJpYnV0ZSgnaGlkZGVuJykpLnRvQmUoZmFsc2UpXG4gICAgICBib3R0b21TdGF0dXMudmlzaWJpbGl0eSA9IHRydWVcbiAgICAgIGV4cGVjdChib3R0b21TdGF0dXMuaGFzQXR0cmlidXRlKCdoaWRkZW4nKSkudG9CZShmYWxzZSlcbiAgICAgIGJvdHRvbVN0YXR1cy52aXNpYmlsaXR5ID0gZmFsc2VcbiAgICAgIGV4cGVjdChib3R0b21TdGF0dXMuaGFzQXR0cmlidXRlKCdoaWRkZW4nKSkudG9CZSh0cnVlKVxuICAgICAgYm90dG9tU3RhdHVzLnZpc2liaWxpdHkgPSB0cnVlXG4gICAgICBleHBlY3QoYm90dG9tU3RhdHVzLmhhc0F0dHJpYnV0ZSgnaGlkZGVuJykpLnRvQmUoZmFsc2UpXG5cbiAgICBpdCAncmVwb3J0cyB0aGUgdmlzaWJpbGl0eSB3aGVuIGdldHRlciBpcyBpbnZva2VkJywgLT5cbiAgICAgIGV4cGVjdChib3R0b21TdGF0dXMudmlzaWJpbGl0eSkudG9CZSh0cnVlKVxuICAgICAgYm90dG9tU3RhdHVzLnZpc2liaWxpdHkgPSB0cnVlXG4gICAgICBleHBlY3QoYm90dG9tU3RhdHVzLnZpc2liaWxpdHkpLnRvQmUodHJ1ZSlcbiAgICAgIGJvdHRvbVN0YXR1cy52aXNpYmlsaXR5ID0gZmFsc2VcbiAgICAgIGV4cGVjdChib3R0b21TdGF0dXMudmlzaWJpbGl0eSkudG9CZShmYWxzZSlcbiAgICAgIGJvdHRvbVN0YXR1cy52aXNpYmlsaXR5ID0gdHJ1ZVxuICAgICAgZXhwZWN0KGJvdHRvbVN0YXR1cy52aXNpYmlsaXR5KS50b0JlKHRydWUpXG4iXX0=
