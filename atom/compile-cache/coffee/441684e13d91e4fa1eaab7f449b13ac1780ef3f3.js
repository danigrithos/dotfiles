(function() {
  var Color, ColorMarker, ColorMarkerElement, click, path, stylesheet, stylesheetPath;

  path = require('path');

  Color = require('../lib/color');

  ColorMarker = require('../lib/color-marker');

  ColorMarkerElement = require('../lib/color-marker-element');

  click = require('./helpers/events').click;

  stylesheetPath = path.resolve(__dirname, '..', 'styles', 'pigments.less');

  stylesheet = atom.themes.loadStylesheet(stylesheetPath);

  describe('ColorMarkerElement', function() {
    var colorMarker, colorMarkerElement, editor, jasmineContent, marker, ref;
    ref = [], editor = ref[0], marker = ref[1], colorMarker = ref[2], colorMarkerElement = ref[3], jasmineContent = ref[4];
    beforeEach(function() {
      var color, styleNode, text;
      jasmineContent = document.body.querySelector('#jasmine-content');
      styleNode = document.createElement('style');
      styleNode.textContent = "" + stylesheet;
      jasmineContent.appendChild(styleNode);
      editor = atom.workspace.buildTextEditor({});
      editor.setText("body {\n  color: #f00;\n  bar: foo;\n  foo: bar;\n}");
      marker = editor.markBufferRange([[1, 9], [4, 1]], {
        invalidate: 'touch'
      });
      color = new Color('#ff0000');
      text = '#f00';
      return colorMarker = new ColorMarker({
        marker: marker,
        color: color,
        text: text,
        colorBuffer: {
          editor: editor,
          useNativeDecorations: function() {
            return false;
          },
          selectColorMarkerAndOpenPicker: jasmine.createSpy('select-color'),
          ignoredScopes: [],
          findValidColorMarkers: function() {
            return [];
          }
        }
      });
    });
    it('releases itself when the marker is destroyed', function() {
      var eventSpy;
      colorMarkerElement = new ColorMarkerElement;
      colorMarkerElement.setContainer({
        editor: editor,
        useNativeDecorations: function() {
          return false;
        },
        requestMarkerUpdate: function(arg) {
          var marker;
          marker = arg[0];
          return marker.render();
        }
      });
      colorMarkerElement.setModel(colorMarker);
      eventSpy = jasmine.createSpy('did-release');
      colorMarkerElement.onDidRelease(eventSpy);
      spyOn(colorMarkerElement, 'release').andCallThrough();
      marker.destroy();
      expect(colorMarkerElement.release).toHaveBeenCalled();
      return expect(eventSpy).toHaveBeenCalled();
    });
    describe('clicking on the decoration', function() {
      beforeEach(function() {
        colorMarkerElement = new ColorMarkerElement;
        colorMarkerElement.setContainer({
          editor: editor,
          useNativeDecorations: function() {
            return false;
          },
          requestMarkerUpdate: function(arg) {
            var marker;
            marker = arg[0];
            return marker.render();
          }
        });
        colorMarkerElement.setModel(colorMarker);
        return click(colorMarkerElement);
      });
      return it('calls selectColorMarkerAndOpenPicker on the buffer', function() {
        return expect(colorMarker.colorBuffer.selectColorMarkerAndOpenPicker).toHaveBeenCalled();
      });
    });
    describe('when the render mode is set to background', function() {
      var regions;
      regions = [][0];
      beforeEach(function() {
        ColorMarkerElement.setMarkerType('background');
        colorMarkerElement = new ColorMarkerElement;
        colorMarkerElement.setContainer({
          editor: editor,
          useNativeDecorations: function() {
            return false;
          },
          requestMarkerUpdate: function(arg) {
            var marker;
            marker = arg[0];
            return marker.render();
          }
        });
        colorMarkerElement.setModel(colorMarker);
        return regions = colorMarkerElement.querySelectorAll('.region.background');
      });
      it('creates a region div for the color', function() {
        return expect(regions.length).toEqual(4);
      });
      it('fills the region with the covered text', function() {
        expect(regions[0].textContent).toEqual('#f00;');
        expect(regions[1].textContent).toEqual('  bar: foo;');
        expect(regions[2].textContent).toEqual('  foo: bar;');
        return expect(regions[3].textContent).toEqual('}');
      });
      it('sets the background of the region with the color css value', function() {
        var i, len, region, results;
        results = [];
        for (i = 0, len = regions.length; i < len; i++) {
          region = regions[i];
          results.push(expect(region.style.backgroundColor).toEqual('rgb(255, 0, 0)'));
        }
        return results;
      });
      describe('when the marker is modified', function() {
        beforeEach(function() {
          spyOn(colorMarkerElement.renderer, 'render').andCallThrough();
          editor.moveToTop();
          return editor.insertText('\n\n');
        });
        return it('renders again the marker content', function() {
          expect(colorMarkerElement.renderer.render).toHaveBeenCalled();
          return expect(colorMarkerElement.querySelectorAll('.region').length).toEqual(4);
        });
      });
      return describe('when released', function() {
        return it('removes all the previously rendered content', function() {
          colorMarkerElement.release();
          return expect(colorMarkerElement.children.length).toEqual(0);
        });
      });
    });
    describe('when the render mode is set to outline', function() {
      var regions;
      regions = [][0];
      beforeEach(function() {
        ColorMarkerElement.setMarkerType('outline');
        colorMarkerElement = new ColorMarkerElement;
        colorMarkerElement.setContainer({
          editor: editor,
          useNativeDecorations: function() {
            return false;
          },
          requestMarkerUpdate: function(arg) {
            var marker;
            marker = arg[0];
            return marker.render();
          }
        });
        colorMarkerElement.setModel(colorMarker);
        return regions = colorMarkerElement.querySelectorAll('.region.outline');
      });
      it('creates a region div for the color', function() {
        return expect(regions.length).toEqual(4);
      });
      it('fills the region with the covered text', function() {
        expect(regions[0].textContent).toEqual('');
        expect(regions[1].textContent).toEqual('');
        expect(regions[2].textContent).toEqual('');
        return expect(regions[3].textContent).toEqual('');
      });
      it('sets the drop shadow color of the region with the color css value', function() {
        var i, len, region, results;
        results = [];
        for (i = 0, len = regions.length; i < len; i++) {
          region = regions[i];
          results.push(expect(region.style.borderColor).toEqual('rgb(255, 0, 0)'));
        }
        return results;
      });
      describe('when the marker is modified', function() {
        beforeEach(function() {
          spyOn(colorMarkerElement.renderer, 'render').andCallThrough();
          editor.moveToTop();
          return editor.insertText('\n\n');
        });
        return it('renders again the marker content', function() {
          expect(colorMarkerElement.renderer.render).toHaveBeenCalled();
          return expect(colorMarkerElement.querySelectorAll('.region').length).toEqual(4);
        });
      });
      return describe('when released', function() {
        return it('removes all the previously rendered content', function() {
          colorMarkerElement.release();
          return expect(colorMarkerElement.children.length).toEqual(0);
        });
      });
    });
    describe('when the render mode is set to underline', function() {
      var regions;
      regions = [][0];
      beforeEach(function() {
        ColorMarkerElement.setMarkerType('underline');
        colorMarkerElement = new ColorMarkerElement;
        colorMarkerElement.setContainer({
          editor: editor,
          useNativeDecorations: function() {
            return false;
          },
          requestMarkerUpdate: function(arg) {
            var marker;
            marker = arg[0];
            return marker.render();
          }
        });
        colorMarkerElement.setModel(colorMarker);
        return regions = colorMarkerElement.querySelectorAll('.region.underline');
      });
      it('creates a region div for the color', function() {
        return expect(regions.length).toEqual(4);
      });
      it('fills the region with the covered text', function() {
        expect(regions[0].textContent).toEqual('');
        expect(regions[1].textContent).toEqual('');
        expect(regions[2].textContent).toEqual('');
        return expect(regions[3].textContent).toEqual('');
      });
      it('sets the background of the region with the color css value', function() {
        var i, len, region, results;
        results = [];
        for (i = 0, len = regions.length; i < len; i++) {
          region = regions[i];
          results.push(expect(region.style.backgroundColor).toEqual('rgb(255, 0, 0)'));
        }
        return results;
      });
      describe('when the marker is modified', function() {
        beforeEach(function() {
          spyOn(colorMarkerElement.renderer, 'render').andCallThrough();
          editor.moveToTop();
          return editor.insertText('\n\n');
        });
        return it('renders again the marker content', function() {
          expect(colorMarkerElement.renderer.render).toHaveBeenCalled();
          return expect(colorMarkerElement.querySelectorAll('.region').length).toEqual(4);
        });
      });
      return describe('when released', function() {
        return it('removes all the previously rendered content', function() {
          colorMarkerElement.release();
          return expect(colorMarkerElement.children.length).toEqual(0);
        });
      });
    });
    describe('when the render mode is set to dot', function() {
      var createMarker, markerElement, markers, markersElements, ref1, regions;
      ref1 = [], regions = ref1[0], markers = ref1[1], markersElements = ref1[2], markerElement = ref1[3];
      createMarker = function(range, color, text) {
        marker = editor.markBufferRange(range, {
          invalidate: 'touch'
        });
        color = new Color(color);
        text = text;
        return colorMarker = new ColorMarker({
          marker: marker,
          color: color,
          text: text,
          colorBuffer: {
            editor: editor,
            useNativeDecorations: function() {
              return false;
            },
            project: {
              colorPickerAPI: {
                open: jasmine.createSpy('color-picker.open')
              }
            },
            ignoredScopes: [],
            findValidColorMarkers: function() {
              return [];
            }
          }
        });
      };
      beforeEach(function() {
        var editorElement;
        editor = atom.workspace.buildTextEditor({});
        editor.setText("body {\n  background: red, green, blue;\n}");
        editorElement = atom.views.getView(editor);
        jasmineContent.appendChild(editorElement);
        markers = [createMarker([[1, 13], [1, 16]], '#ff0000', 'red'), createMarker([[1, 18], [1, 23]], '#00ff00', 'green'), createMarker([[1, 25], [1, 29]], '#0000ff', 'blue')];
        ColorMarkerElement.setMarkerType('dot');
        return markersElements = markers.map(function(colorMarker) {
          colorMarkerElement = new ColorMarkerElement;
          colorMarkerElement.setContainer({
            editor: editor,
            useNativeDecorations: function() {
              return false;
            },
            requestMarkerUpdate: function(arg) {
              var marker;
              marker = arg[0];
              return marker.render();
            }
          });
          colorMarkerElement.setModel(colorMarker);
          jasmineContent.appendChild(colorMarkerElement);
          return colorMarkerElement;
        });
      });
      return it('adds the dot class on the marker', function() {
        var i, len, markersElement, results;
        results = [];
        for (i = 0, len = markersElements.length; i < len; i++) {
          markersElement = markersElements[i];
          results.push(expect(markersElement.classList.contains('dot')).toBeTruthy());
        }
        return results;
      });
    });
    return describe('when the render mode is set to dot', function() {
      var createMarker, markers, markersElements, ref1, regions;
      ref1 = [], regions = ref1[0], markers = ref1[1], markersElements = ref1[2];
      createMarker = function(range, color, text) {
        marker = editor.markBufferRange(range, {
          invalidate: 'touch'
        });
        color = new Color(color);
        text = text;
        return colorMarker = new ColorMarker({
          marker: marker,
          color: color,
          text: text,
          colorBuffer: {
            editor: editor,
            useNativeDecorations: function() {
              return false;
            },
            project: {
              colorPickerAPI: {
                open: jasmine.createSpy('color-picker.open')
              }
            },
            ignoredScopes: [],
            findValidColorMarkers: function() {
              return [];
            }
          }
        });
      };
      beforeEach(function() {
        var editorElement;
        editor = atom.workspace.buildTextEditor({});
        editor.setText("body {\n  background: red, green, blue;\n}");
        editorElement = atom.views.getView(editor);
        jasmineContent.appendChild(editorElement);
        markers = [createMarker([[1, 13], [1, 16]], '#ff0000', 'red'), createMarker([[1, 18], [1, 23]], '#00ff00', 'green'), createMarker([[1, 25], [1, 29]], '#0000ff', 'blue')];
        ColorMarkerElement.setMarkerType('square-dot');
        return markersElements = markers.map(function(colorMarker) {
          colorMarkerElement = new ColorMarkerElement;
          colorMarkerElement.setContainer({
            editor: editor,
            useNativeDecorations: function() {
              return false;
            },
            requestMarkerUpdate: function(arg) {
              var marker;
              marker = arg[0];
              return marker.render();
            }
          });
          colorMarkerElement.setModel(colorMarker);
          jasmineContent.appendChild(colorMarkerElement);
          return colorMarkerElement;
        });
      });
      return it('adds the dot class on the marker', function() {
        var i, len, markersElement, results;
        results = [];
        for (i = 0, len = markersElements.length; i < len; i++) {
          markersElement = markersElements[i];
          expect(markersElement.classList.contains('dot')).toBeTruthy();
          results.push(expect(markersElement.classList.contains('square')).toBeTruthy());
        }
        return results;
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvZGRld2V5Ly5hdG9tL3BhY2thZ2VzL3BpZ21lbnRzL3NwZWMvY29sb3ItbWFya2VyLWVsZW1lbnQtc3BlYy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7RUFDUCxLQUFBLEdBQVEsT0FBQSxDQUFRLGNBQVI7O0VBQ1IsV0FBQSxHQUFjLE9BQUEsQ0FBUSxxQkFBUjs7RUFDZCxrQkFBQSxHQUFxQixPQUFBLENBQVEsNkJBQVI7O0VBQ3BCLFFBQVMsT0FBQSxDQUFRLGtCQUFSOztFQUVWLGNBQUEsR0FBaUIsSUFBSSxDQUFDLE9BQUwsQ0FBYSxTQUFiLEVBQXdCLElBQXhCLEVBQThCLFFBQTlCLEVBQXdDLGVBQXhDOztFQUNqQixVQUFBLEdBQWEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxjQUFaLENBQTJCLGNBQTNCOztFQUViLFFBQUEsQ0FBUyxvQkFBVCxFQUErQixTQUFBO0FBQzdCLFFBQUE7SUFBQSxNQUFvRSxFQUFwRSxFQUFDLGVBQUQsRUFBUyxlQUFULEVBQWlCLG9CQUFqQixFQUE4QiwyQkFBOUIsRUFBa0Q7SUFFbEQsVUFBQSxDQUFXLFNBQUE7QUFDVCxVQUFBO01BQUEsY0FBQSxHQUFpQixRQUFRLENBQUMsSUFBSSxDQUFDLGFBQWQsQ0FBNEIsa0JBQTVCO01BRWpCLFNBQUEsR0FBWSxRQUFRLENBQUMsYUFBVCxDQUF1QixPQUF2QjtNQUNaLFNBQVMsQ0FBQyxXQUFWLEdBQXdCLEVBQUEsR0FDcEI7TUFHSixjQUFjLENBQUMsV0FBZixDQUEyQixTQUEzQjtNQUVBLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLGVBQWYsQ0FBK0IsRUFBL0I7TUFDVCxNQUFNLENBQUMsT0FBUCxDQUFlLHFEQUFmO01BT0EsTUFBQSxHQUFTLE1BQU0sQ0FBQyxlQUFQLENBQXVCLENBQUMsQ0FBQyxDQUFELEVB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QixFQUF5QyxNQUF6QyxDQUhRO1FBTVYsa0JBQWtCLENBQUMsYUFBbkIsQ0FBaUMsWUFBakM7ZUFFQSxlQUFBLEdBQWtCLE9BQU8sQ0FBQyxHQUFSLENBQVksU0FBQyxXQUFEO1VBQzVCLGtCQUFBLEdBQXFCLElBQUk7VUFDekIsa0JBQWtCLENBQUMsWUFBbkIsQ0FDRTtZQUFBLE1BQUEsRUFBUSxNQUFSO1lBQ0Esb0JBQUEsRUFBc0IsU0FBQTtxQkFBRztZQUFILENBRHRCO1lBRUEsbUJBQUEsRUFBcUIsU0FBQyxHQUFEO0FBQWMsa0JBQUE7Y0FBWixTQUFEO3FCQUFhLE1BQU0sQ0FBQyxNQUFQLENBQUE7WUFBZCxDQUZyQjtXQURGO1VBS0Esa0JBQWtCLENBQUMsUUFBbkIsQ0FBNEIsV0FBNUI7VUFFQSxjQUFjLENBQUMsV0FBZixDQUEyQixrQkFBM0I7aUJBQ0E7UUFWNEIsQ0FBWjtNQW5CVCxDQUFYO2FBK0JBLEVBQUEsQ0FBRyxrQ0FBSCxFQUF1QyxTQUFBO0FBQ3JDLFlBQUE7QUFBQTthQUFBLGlEQUFBOztVQUNFLE1BQUEsQ0FBTyxjQUFjLENBQUMsU0FBUyxDQUFDLFFBQXpCLENBQWtDLEtBQWxDLENBQVAsQ0FBZ0QsQ0FBQyxVQUFqRCxDQUFBO3VCQUNBLE1BQUEsQ0FBTyxjQUFjLENBQUMsU0FBUyxDQUFDLFFBQXpCLENBQWtDLFFBQWxDLENBQVAsQ0FBbUQsQ0FBQyxVQUFwRCxDQUFBO0FBRkY7O01BRHFDLENBQXZDO0lBeEQ2QyxDQUEvQztFQTlTNkIsQ0FBL0I7QUFUQSIsInNvdXJjZXNDb250ZW50IjpbInBhdGggPSByZXF1aXJlICdwYXRoJ1xuQ29sb3IgPSByZXF1aXJlICcuLi9saWIvY29sb3InXG5Db2xvck1hcmtlciA9IHJlcXVpcmUgJy4uL2xpYi9jb2xvci1tYXJrZXInXG5Db2xvck1hcmtlckVsZW1lbnQgPSByZXF1aXJlICcuLi9saWIvY29sb3ItbWFya2VyLWVsZW1lbnQnXG57Y2xpY2t9ID0gcmVxdWlyZSAnLi9oZWxwZXJzL2V2ZW50cydcblxuc3R5bGVzaGVldFBhdGggPSBwYXRoLnJlc29sdmUgX19kaXJuYW1lLCAnLi4nLCAnc3R5bGVzJywgJ3BpZ21lbnRzLmxlc3MnXG5zdHlsZXNoZWV0ID0gYXRvbS50aGVtZXMubG9hZFN0eWxlc2hlZXQoc3R5bGVzaGVldFBhdGgpXG5cbmRlc2NyaWJlICdDb2xvck1hcmtlckVsZW1lbnQnLCAtPlxuICBbZWRpdG9yLCBtYXJrZXIsIGNvbG9yTWFya2VyLCBjb2xvck1hcmtlckVsZW1lbnQsIGphc21pbmVDb250ZW50XSA9IFtdXG5cbiAgYmVmb3JlRWFjaCAtPlxuICAgIGphc21pbmVDb250ZW50ID0gZG9jdW1lbnQuYm9keS5xdWVyeVNlbGVjdG9yKCcjamFzbWluZS1jb250ZW50JylcblxuICAgIHN0eWxlTm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJylcbiAgICBzdHlsZU5vZGUudGV4dENvbnRlbnQgPSBcIlwiXCJcbiAgICAgICN7c3R5bGVzaGVldH1cbiAgICBcIlwiXCJcblxuICAgIGphc21pbmVDb250ZW50LmFwcGVuZENoaWxkKHN0eWxlTm9kZSlcblxuICAgIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmJ1aWxkVGV4dEVkaXRvcih7fSlcbiAgICBlZGl0b3Iuc2V0VGV4dChcIlwiXCJcbiAgICBib2R5IHtcbiAgICAgIGNvbG9yOiAjZjAwO1xuICAgICAgYmFyOiBmb287XG4gICAgICBmb286IGJhcjtcbiAgICB9XG4gICAgXCJcIlwiKVxuICAgIG1hcmtlciA9IGVkaXRvci5tYXJrQnVmZmVyUmFuZ2UoW1sxLDldLFs0LDFdXSwge1xuICAgICAgaW52YWxpZGF0ZTogJ3RvdWNoJ1xuICAgIH0pXG4gICAgY29sb3IgPSBuZXcgQ29sb3IoJyNmZjAwMDAnKVxuICAgIHRleHQgPSAnI2YwMCdcblxuICAgIGNvbG9yTWFya2VyID0gbmV3IENvbG9yTWFya2VyKHtcbiAgICAgIG1hcmtlclxuICAgICAgY29sb3JcbiAgICAgIHRleHRcbiAgICAgIGNvbG9yQnVmZmVyOiB7XG4gICAgICAgIGVkaXRvclxuICAgICAgICB1c2VOYXRpdmVEZWNvcmF0aW9uczogLT4gZmFsc2VcbiAgICAgICAgc2VsZWN0Q29sb3JNYXJrZXJBbmRPcGVuUGlja2VyOiBqYXNtaW5lLmNyZWF0ZVNweSgnc2VsZWN0LWNvbG9yJylcbiAgICAgICAgaWdub3JlZFNjb3BlczogW11cbiAgICAgICAgZmluZFZhbGlkQ29sb3JNYXJrZXJzOiAtPiBbXVxuICAgICAgfVxuICAgIH0pXG5cbiAgaXQgJ3JlbGVhc2VzIGl0c2VsZiB3aGVuIHRoZSBtYXJrZXIgaXMgZGVzdHJveWVkJywgLT5cbiAgICBjb2xvck1hcmtlckVsZW1lbnQgPSBuZXcgQ29sb3JNYXJrZXJFbGVtZW50XG4gICAgY29sb3JNYXJrZXJFbGVtZW50LnNldENvbnRhaW5lclxuICAgICAgZWRpdG9yOiBlZGl0b3JcbiAgICAgIHVzZU5hdGl2ZURlY29yYXRpb25zOiAtPiBmYWxzZVxuICAgICAgcmVxdWVzdE1hcmtlclVwZGF0ZTogKFttYXJrZXJdKSAtPiBtYXJrZXIucmVuZGVyKClcblxuICAgIGNvbG9yTWFya2VyRWxlbWVudC5zZXRNb2RlbChjb2xvck1hcmtlcilcblxuICAgIGV2ZW50U3B5ID0gamFzbWluZS5jcmVhdGVTcHkoJ2RpZC1yZWxlYXNlJylcbiAgICBjb2xvck1hcmtlckVsZW1lbnQub25EaWRSZWxlYXNlKGV2ZW50U3B5KVxuICAgIHNweU9uKGNvbG9yTWFya2VyRWxlbWVudCwgJ3JlbGVhc2UnKS5hbmRDYWxsVGhyb3VnaCgpXG5cbiAgICBtYXJrZXIuZGVzdHJveSgpXG5cbiAgICBleHBlY3QoY29sb3JNYXJrZXJFbGVtZW50LnJlbGVhc2UpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgIGV4cGVjdChldmVudFNweSkudG9IYXZlQmVlbkNhbGxlZCgpXG5cbiAgZGVzY3JpYmUgJ2NsaWNraW5nIG9uIHRoZSBkZWNvcmF0aW9uJywgLT5cbiAgICBiZWZvcmVFYWNoIC0+XG4gICAgICBjb2xvck1hcmtlckVsZW1lbnQgPSBuZXcgQ29sb3JNYXJrZXJFbGVtZW50XG4gICAgICBjb2xvck1hcmtlckVsZW1lbnQuc2V0Q29udGFpbmVyXG4gICAgICAgIGVkaXRvcjogZWRpdG9yXG4gICAgICAgIHVzZU5hdGl2ZURlY29yYXRpb25zOiAtPiBmYWxzZVxuICAgICAgICByZXF1ZXN0TWFya2VyVXBkYXRlOiAoW21hcmtlcl0pIC0+IG1hcmtlci5yZW5kZXIoKVxuXG4gICAgICBjb2xvck1hcmtlckVsZW1lbnQuc2V0TW9kZWwoY29sb3JNYXJrZXIpXG5cbiAgICAgIGNsaWNrKGNvbG9yTWFya2VyRWxlbWVudClcblxuICAgIGl0ICdjYWxscyBzZWxlY3RDb2xvck1hcmtlckFuZE9wZW5QaWNrZXIgb24gdGhlIGJ1ZmZlcicsIC0+XG4gICAgICBleHBlY3QoY29sb3JNYXJrZXIuY29sb3JCdWZmZXIuc2VsZWN0Q29sb3JNYXJrZXJBbmRPcGVuUGlja2VyKS50b0hhdmVCZWVuQ2FsbGVkKClcblxuICAjIyAgICAjIyMjIyMjIyAgICAgIyMjICAgICAjIyMjIyMgICMjICAgICMjXG4gICMjICAgICMjICAgICAjIyAgICMjICMjICAgIyMgICAgIyMgIyMgICAjI1xuICAjIyAgICAjIyAgICAgIyMgICMjICAgIyMgICMjICAgICAgICMjICAjI1xuICAjIyAgICAjIyMjIyMjIyAgIyMgICAgICMjICMjICAgICAgICMjIyMjXG4gICMjICAgICMjICAgICAjIyAjIyMjIyMjIyMgIyMgICAgICAgIyMgICMjXG4gICMjICAgICMjICAgICAjIyAjIyAgICAgIyMgIyMgICAgIyMgIyMgICAjI1xuICAjIyAgICAjIyMjIyMjIyAgIyMgICAgICMjICAjIyMjIyMgICMjICAgICMjXG5cbiAgZGVzY3JpYmUgJ3doZW4gdGhlIHJlbmRlciBtb2RlIGlzIHNldCB0byBiYWNrZ3JvdW5kJywgLT5cbiAgICBbcmVnaW9uc10gPSBbXVxuICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgIENvbG9yTWFya2VyRWxlbWVudC5zZXRNYXJrZXJUeXBlKCdiYWNrZ3JvdW5kJylcblxuICAgICAgY29sb3JNYXJrZXJFbGVtZW50ID0gbmV3IENvbG9yTWFya2VyRWxlbWVudFxuICAgICAgY29sb3JNYXJrZXJFbGVtZW50LnNldENvbnRhaW5lclxuICAgICAgICBlZGl0b3I6IGVkaXRvclxuICAgICAgICB1c2VOYXRpdmVEZWNvcmF0aW9uczogLT4gZmFsc2VcbiAgICAgICAgcmVxdWVzdE1hcmtlclVwZGF0ZTogKFttYXJrZXJdKSAtPiBtYXJrZXIucmVuZGVyKClcblxuICAgICAgY29sb3JNYXJrZXJFbGVtZW50LnNldE1vZGVsKGNvbG9yTWFya2VyKVxuXG4gICAgICByZWdpb25zID0gY29sb3JNYXJrZXJFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5yZWdpb24uYmFja2dyb3VuZCcpXG5cbiAgICBpdCAnY3JlYXRlcyBhIHJlZ2lvbiBkaXYgZm9yIHRoZSBjb2xvcicsIC0+XG4gICAgICBleHBlY3QocmVnaW9ucy5sZW5ndGgpLnRvRXF1YWwoNClcblxuICAgIGl0ICdmaWxscyB0aGUgcmVnaW9uIHdpdGggdGhlIGNvdmVyZWQgdGV4dCcsIC0+XG4gICAgICBleHBlY3QocmVnaW9uc1swXS50ZXh0Q29udGVudCkudG9FcXVhbCgnI2YwMDsnKVxuICAgICAgZXhwZWN0KHJlZ2lvbnNbMV0udGV4dENvbnRlbnQpLnRvRXF1YWwoJyAgYmFyOiBmb287JylcbiAgICAgIGV4cGVjdChyZWdpb25zWzJdLnRleHRDb250ZW50KS50b0VxdWFsKCcgIGZvbzogYmFyOycpXG4gICAgICBleHBlY3QocmVnaW9uc1szXS50ZXh0Q29udGVudCkudG9FcXVhbCgnfScpXG5cbiAgICBpdCAnc2V0cyB0aGUgYmFja2dyb3VuZCBvZiB0aGUgcmVnaW9uIHdpdGggdGhlIGNvbG9yIGNzcyB2YWx1ZScsIC0+XG4gICAgICBmb3IgcmVnaW9uIGluIHJlZ2lvbnNcbiAgICAgICAgZXhwZWN0KHJlZ2lvbi5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IpLnRvRXF1YWwoJ3JnYigyNTUsIDAsIDApJylcblxuICAgIGRlc2NyaWJlICd3aGVuIHRoZSBtYXJrZXIgaXMgbW9kaWZpZWQnLCAtPlxuICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICBzcHlPbihjb2xvck1hcmtlckVsZW1lbnQucmVuZGVyZXIsICdyZW5kZXInKS5hbmRDYWxsVGhyb3VnaCgpXG4gICAgICAgIGVkaXRvci5tb3ZlVG9Ub3AoKVxuICAgICAgICBlZGl0b3IuaW5zZXJ0VGV4dCgnXFxuXFxuJylcblxuICAgICAgaXQgJ3JlbmRlcnMgYWdhaW4gdGhlIG1hcmtlciBjb250ZW50JywgLT5cbiAgICAgICAgZXhwZWN0KGNvbG9yTWFya2VyRWxlbWVudC5yZW5kZXJlci5yZW5kZXIpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgICBleHBlY3QoY29sb3JNYXJrZXJFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5yZWdpb24nKS5sZW5ndGgpLnRvRXF1YWwoNClcblxuICAgIGRlc2NyaWJlICd3aGVuIHJlbGVhc2VkJywgLT5cbiAgICAgIGl0ICdyZW1vdmVzIGFsbCB0aGUgcHJldmlvdXNseSByZW5kZXJlZCBjb250ZW50JywgLT5cbiAgICAgICAgY29sb3JNYXJrZXJFbGVtZW50LnJlbGVhc2UoKVxuICAgICAgICBleHBlY3QoY29sb3JNYXJrZXJFbGVtZW50LmNoaWxkcmVuLmxlbmd0aCkudG9FcXVhbCgwKVxuXG4gICMjICAgICAjIyMjIyMjICAjIyAgICAgIyMgIyMjIyMjIyMgIyMgICAgICAgIyMjIyAjIyAgICAjIyAjIyMjIyMjI1xuICAjIyAgICAjIyAgICAgIyMgIyMgICAgICMjICAgICMjICAgICMjICAgICAgICAjIyAgIyMjICAgIyMgIyNcbiAgIyMgICAgIyMgICAgICMjICMjICAgICAjIyAgICAjIyAgICAjIyAgICAgICAgIyMgICMjIyMgICMjICMjXG4gICMjICAgICMjICAgICAjIyAjIyAgICAgIyMgICAgIyMgICAgIyMgICAgICAgICMjICAjIyAjIyAjIyAjIyMjIyNcbiAgIyMgICAgIyMgICAgICMjICMjICAgICAjIyAgICAjIyAgICAjIyAgICAgICAgIyMgICMjICAjIyMjICMjXG4gICMjICAgICMjICAgICAjIyAjIyAgICAgIyMgICAgIyMgICAgIyMgICAgICAgICMjICAjIyAgICMjIyAjI1xuICAjIyAgICAgIyMjIyMjIyAgICMjIyMjIyMgICAgICMjICAgICMjIyMjIyMjICMjIyMgIyMgICAgIyMgIyMjIyMjIyNcblxuICBkZXNjcmliZSAnd2hlbiB0aGUgcmVuZGVyIG1vZGUgaXMgc2V0IHRvIG91dGxpbmUnLCAtPlxuICAgIFtyZWdpb25zXSA9IFtdXG4gICAgYmVmb3JlRWFjaCAtPlxuICAgICAgQ29sb3JNYXJrZXJFbGVtZW50LnNldE1hcmtlclR5cGUoJ291dGxpbmUnKVxuXG4gICAgICBjb2xvck1hcmtlckVsZW1lbnQgPSBuZXcgQ29sb3JNYXJrZXJFbGVtZW50XG4gICAgICBjb2xvck1hcmtlckVsZW1lbnQuc2V0Q29udGFpbmVyXG4gICAgICAgIGVkaXRvcjogZWRpdG9yXG4gICAgICAgIHVzZU5hdGl2ZURlY29yYXRpb25zOiAtPiBmYWxzZVxuICAgICAgICByZXF1ZXN0TWFya2VyVXBkYXRlOiAoW21hcmtlcl0pIC0+IG1hcmtlci5yZW5kZXIoKVxuXG4gICAgICBjb2xvck1hcmtlckVsZW1lbnQuc2V0TW9kZWwoY29sb3JNYXJrZXIpXG5cbiAgICAgIHJlZ2lvbnMgPSBjb2xvck1hcmtlckVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnJlZ2lvbi5vdXRsaW5lJylcblxuICAgIGl0ICdjcmVhdGVzIGEgcmVnaW9uIGRpdiBmb3IgdGhlIGNvbG9yJywgLT5cbiAgICAgIGV4cGVjdChyZWdpb25zLmxlbmd0aCkudG9FcXVhbCg0KVxuXG4gICAgaXQgJ2ZpbGxzIHRoZSByZWdpb24gd2l0aCB0aGUgY292ZXJlZCB0ZXh0JywgLT5cbiAgICAgIGV4cGVjdChyZWdpb25zWzBdLnRleHRDb250ZW50KS50b0VxdWFsKCcnKVxuICAgICAgZXhwZWN0KHJlZ2lvbnNbMV0udGV4dENvbnRlbnQpLnRvRXF1YWwoJycpXG4gICAgICBleHBlY3QocmVnaW9uc1syXS50ZXh0Q29udGVudCkudG9FcXVhbCgnJylcbiAgICAgIGV4cGVjdChyZWdpb25zWzNdLnRleHRDb250ZW50KS50b0VxdWFsKCcnKVxuXG4gICAgaXQgJ3NldHMgdGhlIGRyb3Agc2hhZG93IGNvbG9yIG9mIHRoZSByZWdpb24gd2l0aCB0aGUgY29sb3IgY3NzIHZhbHVlJywgLT5cbiAgICAgIGZvciByZWdpb24gaW4gcmVnaW9uc1xuICAgICAgICBleHBlY3QocmVnaW9uLnN0eWxlLmJvcmRlckNvbG9yKS50b0VxdWFsKCdyZ2IoMjU1LCAwLCAwKScpXG5cbiAgICBkZXNjcmliZSAnd2hlbiB0aGUgbWFya2VyIGlzIG1vZGlmaWVkJywgLT5cbiAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgc3B5T24oY29sb3JNYXJrZXJFbGVtZW50LnJlbmRlcmVyLCAncmVuZGVyJykuYW5kQ2FsbFRocm91Z2goKVxuICAgICAgICBlZGl0b3IubW92ZVRvVG9wKClcbiAgICAgICAgZWRpdG9yLmluc2VydFRleHQoJ1xcblxcbicpXG5cbiAgICAgIGl0ICdyZW5kZXJzIGFnYWluIHRoZSBtYXJrZXIgY29udGVudCcsIC0+XG4gICAgICAgIGV4cGVjdChjb2xvck1hcmtlckVsZW1lbnQucmVuZGVyZXIucmVuZGVyKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgICAgZXhwZWN0KGNvbG9yTWFya2VyRWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcucmVnaW9uJykubGVuZ3RoKS50b0VxdWFsKDQpXG5cbiAgICBkZXNjcmliZSAnd2hlbiByZWxlYXNlZCcsIC0+XG4gICAgICBpdCAncmVtb3ZlcyBhbGwgdGhlIHByZXZpb3VzbHkgcmVuZGVyZWQgY29udGVudCcsIC0+XG4gICAgICAgIGNvbG9yTWFya2VyRWxlbWVudC5yZWxlYXNlKClcbiAgICAgICAgZXhwZWN0KGNvbG9yTWFya2VyRWxlbWVudC5jaGlsZHJlbi5sZW5ndGgpLnRvRXF1YWwoMClcblxuICAjIyAgICAjIyAgICAgIyMgIyMgICAgIyMgIyMjIyMjIyMgICMjIyMjIyMjICMjIyMjIyMjXG4gICMjICAgICMjICAgICAjIyAjIyMgICAjIyAjIyAgICAgIyMgIyMgICAgICAgIyMgICAgICMjXG4gICMjICAgICMjICAgICAjIyAjIyMjICAjIyAjIyAgICAgIyMgIyMgICAgICAgIyMgICAgICMjXG4gICMjICAgICMjICAgICAjIyAjIyAjIyAjIyAjIyAgICAgIyMgIyMjIyMjICAgIyMjIyMjIyNcbiAgIyMgICAgIyMgICAgICMjICMjICAjIyMjICMjICAgICAjIyAjIyAgICAgICAjIyAgICMjXG4gICMjICAgICMjICAgICAjIyAjIyAgICMjIyAjIyAgICAgIyMgIyMgICAgICAgIyMgICAgIyNcbiAgIyMgICAgICMjIyMjIyMgICMjICAgICMjICMjIyMjIyMjICAjIyMjIyMjIyAjIyAgICAgIyNcblxuICBkZXNjcmliZSAnd2hlbiB0aGUgcmVuZGVyIG1vZGUgaXMgc2V0IHRvIHVuZGVybGluZScsIC0+XG4gICAgW3JlZ2lvbnNdID0gW11cbiAgICBiZWZvcmVFYWNoIC0+XG4gICAgICBDb2xvck1hcmtlckVsZW1lbnQuc2V0TWFya2VyVHlwZSgndW5kZXJsaW5lJylcblxuICAgICAgY29sb3JNYXJrZXJFbGVtZW50ID0gbmV3IENvbG9yTWFya2VyRWxlbWVudFxuICAgICAgY29sb3JNYXJrZXJFbGVtZW50LnNldENvbnRhaW5lclxuICAgICAgICBlZGl0b3I6IGVkaXRvclxuICAgICAgICB1c2VOYXRpdmVEZWNvcmF0aW9uczogLT4gZmFsc2VcbiAgICAgICAgcmVxdWVzdE1hcmtlclVwZGF0ZTogKFttYXJrZXJdKSAtPiBtYXJrZXIucmVuZGVyKClcblxuICAgICAgY29sb3JNYXJrZXJFbGVtZW50LnNldE1vZGVsKGNvbG9yTWFya2VyKVxuXG4gICAgICByZWdpb25zID0gY29sb3JNYXJrZXJFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5yZWdpb24udW5kZXJsaW5lJylcblxuICAgIGl0ICdjcmVhdGVzIGEgcmVnaW9uIGRpdiBmb3IgdGhlIGNvbG9yJywgLT5cbiAgICAgIGV4cGVjdChyZWdpb25zLmxlbmd0aCkudG9FcXVhbCg0KVxuXG4gICAgaXQgJ2ZpbGxzIHRoZSByZWdpb24gd2l0aCB0aGUgY292ZXJlZCB0ZXh0JywgLT5cbiAgICAgIGV4cGVjdChyZWdpb25zWzBdLnRleHRDb250ZW50KS50b0VxdWFsKCcnKVxuICAgICAgZXhwZWN0KHJlZ2lvbnNbMV0udGV4dENvbnRlbnQpLnRvRXF1YWwoJycpXG4gICAgICBleHBlY3QocmVnaW9uc1syXS50ZXh0Q29udGVudCkudG9FcXVhbCgnJylcbiAgICAgIGV4cGVjdChyZWdpb25zWzNdLnRleHRDb250ZW50KS50b0VxdWFsKCcnKVxuXG4gICAgaXQgJ3NldHMgdGhlIGJhY2tncm91bmQgb2YgdGhlIHJlZ2lvbiB3aXRoIHRoZSBjb2xvciBjc3MgdmFsdWUnLCAtPlxuICAgICAgZm9yIHJlZ2lvbiBpbiByZWdpb25zXG4gICAgICAgIGV4cGVjdChyZWdpb24uc3R5bGUuYmFja2dyb3VuZENvbG9yKS50b0VxdWFsKCdyZ2IoMjU1LCAwLCAwKScpXG5cbiAgICBkZXNjcmliZSAnd2hlbiB0aGUgbWFya2VyIGlzIG1vZGlmaWVkJywgLT5cbiAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgc3B5T24oY29sb3JNYXJrZXJFbGVtZW50LnJlbmRlcmVyLCAncmVuZGVyJykuYW5kQ2FsbFRocm91Z2goKVxuICAgICAgICBlZGl0b3IubW92ZVRvVG9wKClcbiAgICAgICAgZWRpdG9yLmluc2VydFRleHQoJ1xcblxcbicpXG5cbiAgICAgIGl0ICdyZW5kZXJzIGFnYWluIHRoZSBtYXJrZXIgY29udGVudCcsIC0+XG4gICAgICAgIGV4cGVjdChjb2xvck1hcmtlckVsZW1lbnQucmVuZGVyZXIucmVuZGVyKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgICAgZXhwZWN0KGNvbG9yTWFya2VyRWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcucmVnaW9uJykubGVuZ3RoKS50b0VxdWFsKDQpXG5cbiAgICBkZXNjcmliZSAnd2hlbiByZWxlYXNlZCcsIC0+XG4gICAgICBpdCAncmVtb3ZlcyBhbGwgdGhlIHByZXZpb3VzbHkgcmVuZGVyZWQgY29udGVudCcsIC0+XG4gICAgICAgIGNvbG9yTWFya2VyRWxlbWVudC5yZWxlYXNlKClcbiAgICAgICAgZXhwZWN0KGNvbG9yTWFya2VyRWxlbWVudC5jaGlsZHJlbi5sZW5ndGgpLnRvRXF1YWwoMClcblxuICAjIyAgICAjIyMjIyMjIyAgICMjIyMjIyMgICMjIyMjIyMjXG4gICMjICAgICMjICAgICAjIyAjIyAgICAgIyMgICAgIyNcbiAgIyMgICAgIyMgICAgICMjICMjICAgICAjIyAgICAjI1xuICAjIyAgICAjIyAgICAgIyMgIyMgICAgICMjICAgICMjXG4gICMjICAgICMjICAgICAjIyAjIyAgICAgIyMgICAgIyNcbiAgIyMgICAgIyMgICAgICMjICMjICAgICAjIyAgICAjI1xuICAjIyAgICAjIyMjIyMjIyAgICMjIyMjIyMgICAgICMjXG5cbiAgZGVzY3JpYmUgJ3doZW4gdGhlIHJlbmRlciBtb2RlIGlzIHNldCB0byBkb3QnLCAtPlxuICAgIFtyZWdpb25zLCBtYXJrZXJzLCBtYXJrZXJzRWxlbWVudHMsIG1hcmtlckVsZW1lbnRdID0gW11cblxuICAgIGNyZWF0ZU1hcmtlciA9IChyYW5nZSwgY29sb3IsIHRleHQpIC0+XG4gICAgICBtYXJrZXIgPSBlZGl0b3IubWFya0J1ZmZlclJhbmdlKHJhbmdlLCB7XG4gICAgICAgIGludmFsaWRhdGU6ICd0b3VjaCdcbiAgICAgIH0pXG4gICAgICBjb2xvciA9IG5ldyBDb2xvcihjb2xvcilcbiAgICAgIHRleHQgPSB0ZXh0XG5cbiAgICAgIGNvbG9yTWFya2VyID0gbmV3IENvbG9yTWFya2VyKHtcbiAgICAgICAgbWFya2VyXG4gICAgICAgIGNvbG9yXG4gICAgICAgIHRleHRcbiAgICAgICAgY29sb3JCdWZmZXI6IHtcbiAgICAgICAgICBlZGl0b3JcbiAgICAgICAgICB1c2VOYXRpdmVEZWNvcmF0aW9uczogLT4gZmFsc2VcbiAgICAgICAgICBwcm9qZWN0OlxuICAgICAgICAgICAgY29sb3JQaWNrZXJBUEk6XG4gICAgICAgICAgICAgIG9wZW46IGphc21pbmUuY3JlYXRlU3B5KCdjb2xvci1waWNrZXIub3BlbicpXG4gICAgICAgICAgaWdub3JlZFNjb3BlczogW11cbiAgICAgICAgICBmaW5kVmFsaWRDb2xvck1hcmtlcnM6IC0+IFtdXG4gICAgICAgIH1cbiAgICAgIH0pXG5cbiAgICBiZWZvcmVFYWNoIC0+XG4gICAgICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5idWlsZFRleHRFZGl0b3Ioe30pXG4gICAgICBlZGl0b3Iuc2V0VGV4dChcIlwiXCJcbiAgICAgIGJvZHkge1xuICAgICAgICBiYWNrZ3JvdW5kOiByZWQsIGdyZWVuLCBibHVlO1xuICAgICAgfVxuICAgICAgXCJcIlwiKVxuXG4gICAgICBlZGl0b3JFbGVtZW50ID0gYXRvbS52aWV3cy5nZXRWaWV3KGVkaXRvcilcbiAgICAgIGphc21pbmVDb250ZW50LmFwcGVuZENoaWxkKGVkaXRvckVsZW1lbnQpXG5cbiAgICAgIG1hcmtlcnMgPSBbXG4gICAgICAgIGNyZWF0ZU1hcmtlciBbWzEsMTNdLFsxLDE2XV0sICcjZmYwMDAwJywgJ3JlZCdcbiAgICAgICAgY3JlYXRlTWFya2VyIFtbMSwxOF0sWzEsMjNdXSwgJyMwMGZmMDAnLCAnZ3JlZW4nXG4gICAgICAgIGNyZWF0ZU1hcmtlciBbWzEsMjVdLFsxLDI5XV0sICcjMDAwMGZmJywgJ2JsdWUnXG4gICAgICBdXG5cbiAgICAgIENvbG9yTWFya2VyRWxlbWVudC5zZXRNYXJrZXJUeXBlKCdkb3QnKVxuXG4gICAgICBtYXJrZXJzRWxlbWVudHMgPSBtYXJrZXJzLm1hcCAoY29sb3JNYXJrZXIpIC0+XG4gICAgICAgIGNvbG9yTWFya2VyRWxlbWVudCA9IG5ldyBDb2xvck1hcmtlckVsZW1lbnRcbiAgICAgICAgY29sb3JNYXJrZXJFbGVtZW50LnNldENvbnRhaW5lclxuICAgICAgICAgIGVkaXRvcjogZWRpdG9yXG4gICAgICAgICAgdXNlTmF0aXZlRGVjb3JhdGlvbnM6IC0+IGZhbHNlXG4gICAgICAgICAgcmVxdWVzdE1hcmtlclVwZGF0ZTogKFttYXJrZXJdKSAtPiBtYXJrZXIucmVuZGVyKClcblxuICAgICAgICBjb2xvck1hcmtlckVsZW1lbnQuc2V0TW9kZWwoY29sb3JNYXJrZXIpXG5cbiAgICAgICAgamFzbWluZUNvbnRlbnQuYXBwZW5kQ2hpbGQoY29sb3JNYXJrZXJFbGVtZW50KVxuICAgICAgICBjb2xvck1hcmtlckVsZW1lbnRcblxuICAgIGl0ICdhZGRzIHRoZSBkb3QgY2xhc3Mgb24gdGhlIG1hcmtlcicsIC0+XG4gICAgICBmb3IgbWFya2Vyc0VsZW1lbnQgaW4gbWFya2Vyc0VsZW1lbnRzXG4gICAgICAgIGV4cGVjdChtYXJrZXJzRWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ2RvdCcpKS50b0JlVHJ1dGh5KClcblxuICAjIyAgICAgIyMjIyMjICAgIyMjIyMjIyAgIyMgICAgICMjICAgICMjIyAgICAjIyMjIyMjIyAgIyMjIyMjIyNcbiAgIyMgICAgIyMgICAgIyMgIyMgICAgICMjICMjICAgICAjIyAgICMjICMjICAgIyMgICAgICMjICMjXG4gICMjICAgICMjICAgICAgICMjICAgICAjIyAjIyAgICAgIyMgICMjICAgIyMgICMjICAgICAjIyAjI1xuICAjIyAgICAgIyMjIyMjICAjIyAgICAgIyMgIyMgICAgICMjICMjICAgICAjIyAjIyMjIyMjIyAgIyMjIyMjXG4gICMjICAgICAgICAgICMjICMjICAjIyAjIyAjIyAgICAgIyMgIyMjIyMjIyMjICMjICAgIyMgICAjI1xuICAjIyAgICAjIyAgICAjIyAjIyAgICAjIyAgIyMgICAgICMjICMjICAgICAjIyAjIyAgICAjIyAgIyNcbiAgIyMgICAgICMjIyMjIyAgICMjIyMjICMjICAjIyMjIyMjICAjIyAgICAgIyMgIyMgICAgICMjICMjIyMjIyMjXG5cbiAgZGVzY3JpYmUgJ3doZW4gdGhlIHJlbmRlciBtb2RlIGlzIHNldCB0byBkb3QnLCAtPlxuICAgIFtyZWdpb25zLCBtYXJrZXJzLCBtYXJrZXJzRWxlbWVudHNdID0gW11cblxuICAgIGNyZWF0ZU1hcmtlciA9IChyYW5nZSwgY29sb3IsIHRleHQpIC0+XG4gICAgICBtYXJrZXIgPSBlZGl0b3IubWFya0J1ZmZlclJhbmdlKHJhbmdlLCB7XG4gICAgICAgIGludmFsaWRhdGU6ICd0b3VjaCdcbiAgICAgIH0pXG4gICAgICBjb2xvciA9IG5ldyBDb2xvcihjb2xvcilcbiAgICAgIHRleHQgPSB0ZXh0XG5cbiAgICAgIGNvbG9yTWFya2VyID0gbmV3IENvbG9yTWFya2VyKHtcbiAgICAgICAgbWFya2VyXG4gICAgICAgIGNvbG9yXG4gICAgICAgIHRleHRcbiAgICAgICAgY29sb3JCdWZmZXI6IHtcbiAgICAgICAgICBlZGl0b3JcbiAgICAgICAgICB1c2VOYXRpdmVEZWNvcmF0aW9uczogLT4gZmFsc2VcbiAgICAgICAgICBwcm9qZWN0OlxuICAgICAgICAgICAgY29sb3JQaWNrZXJBUEk6XG4gICAgICAgICAgICAgIG9wZW46IGphc21pbmUuY3JlYXRlU3B5KCdjb2xvci1waWNrZXIub3BlbicpXG4gICAgICAgICAgaWdub3JlZFNjb3BlczogW11cbiAgICAgICAgICBmaW5kVmFsaWRDb2xvck1hcmtlcnM6IC0+IFtdXG4gICAgICAgIH1cbiAgICAgIH0pXG5cbiAgICBiZWZvcmVFYWNoIC0+XG4gICAgICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5idWlsZFRleHRFZGl0b3Ioe30pXG4gICAgICBlZGl0b3Iuc2V0VGV4dChcIlwiXCJcbiAgICAgIGJvZHkge1xuICAgICAgICBiYWNrZ3JvdW5kOiByZWQsIGdyZWVuLCBibHVlO1xuICAgICAgfVxuICAgICAgXCJcIlwiKVxuXG4gICAgICBlZGl0b3JFbGVtZW50ID0gYXRvbS52aWV3cy5nZXRWaWV3KGVkaXRvcilcbiAgICAgIGphc21pbmVDb250ZW50LmFwcGVuZENoaWxkKGVkaXRvckVsZW1lbnQpXG5cbiAgICAgIG1hcmtlcnMgPSBbXG4gICAgICAgIGNyZWF0ZU1hcmtlciBbWzEsMTNdLFsxLDE2XV0sICcjZmYwMDAwJywgJ3JlZCdcbiAgICAgICAgY3JlYXRlTWFya2VyIFtbMSwxOF0sWzEsMjNdXSwgJyMwMGZmMDAnLCAnZ3JlZW4nXG4gICAgICAgIGNyZWF0ZU1hcmtlciBbWzEsMjVdLFsxLDI5XV0sICcjMDAwMGZmJywgJ2JsdWUnXG4gICAgICBdXG5cbiAgICAgIENvbG9yTWFya2VyRWxlbWVudC5zZXRNYXJrZXJUeXBlKCdzcXVhcmUtZG90JylcblxuICAgICAgbWFya2Vyc0VsZW1lbnRzID0gbWFya2Vycy5tYXAgKGNvbG9yTWFya2VyKSAtPlxuICAgICAgICBjb2xvck1hcmtlckVsZW1lbnQgPSBuZXcgQ29sb3JNYXJrZXJFbGVtZW50XG4gICAgICAgIGNvbG9yTWFya2VyRWxlbWVudC5zZXRDb250YWluZXJcbiAgICAgICAgICBlZGl0b3I6IGVkaXRvclxuICAgICAgICAgIHVzZU5hdGl2ZURlY29yYXRpb25zOiAtPiBmYWxzZVxuICAgICAgICAgIHJlcXVlc3RNYXJrZXJVcGRhdGU6IChbbWFya2VyXSkgLT4gbWFya2VyLnJlbmRlcigpXG5cbiAgICAgICAgY29sb3JNYXJrZXJFbGVtZW50LnNldE1vZGVsKGNvbG9yTWFya2VyKVxuXG4gICAgICAgIGphc21pbmVDb250ZW50LmFwcGVuZENoaWxkKGNvbG9yTWFya2VyRWxlbWVudClcbiAgICAgICAgY29sb3JNYXJrZXJFbGVtZW50XG5cbiAgICBpdCAnYWRkcyB0aGUgZG90IGNsYXNzIG9uIHRoZSBtYXJrZXInLCAtPlxuICAgICAgZm9yIG1hcmtlcnNFbGVtZW50IGluIG1hcmtlcnNFbGVtZW50c1xuICAgICAgICBleHBlY3QobWFya2Vyc0VsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdkb3QnKSkudG9CZVRydXRoeSgpXG4gICAgICAgIGV4cGVjdChtYXJrZXJzRWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ3NxdWFyZScpKS50b0JlVHJ1dGh5KClcbiJdfQ==
