(function() {
  var ColorBufferElement, ColorMarkerElement, mousedown, path, sleep;

  path = require('path');

  require('./helpers/spec-helper');

  mousedown = require('./helpers/events').mousedown;

  ColorBufferElement = require('../lib/color-buffer-element');

  ColorMarkerElement = require('../lib/color-marker-element');

  sleep = function(duration) {
    var t;
    t = new Date();
    return waitsFor(function() {
      return new Date() - t > duration;
    });
  };

  describe('ColorBufferElement', function() {
    var colorBuffer, colorBufferElement, editBuffer, editor, editorElement, isVisible, jasmineContent, jsonFixture, pigments, project, ref;
    ref = [], editor = ref[0], editorElement = ref[1], colorBuffer = ref[2], pigments = ref[3], project = ref[4], colorBufferElement = ref[5], jasmineContent = ref[6];
    isVisible = function(node) {
      return !node.classList.contains('hidden');
    };
    editBuffer = function(text, options) {
      var range;
      if (options == null) {
        options = {};
      }
      if (options.start != null) {
        if (options.end != null) {
          range = [options.start, options.end];
        } else {
          range = [options.start, options.start];
        }
        editor.setSelectedBufferRange(range);
      }
      editor.insertText(text);
      if (!options.noEvent) {
        return advanceClock(500);
      }
    };
    jsonFixture = function(fixture, data) {
      var json, jsonPath;
      jsonPath = path.resolve(__dirname, 'fixtures', fixture);
      json = fs.readFileSync(jsonPath).toString();
      json = json.replace(/#\{(\w+)\}/g, function(m, w) {
        return data[w];
      });
      return JSON.parse(json);
    };
    beforeEach(function() {
      var workspaceElement;
      workspaceElement = atom.views.getView(atom.workspace);
      jasmineContent = document.body.querySelector('#jasmine-content');
      jasmineContent.appendChild(workspaceElement);
      atom.config.set('editor.softWrap', true);
      atom.config.set('editor.softWrapAtPreferredLineLength', true);
      atom.config.set('editor.preferredLineLength', 40);
      atom.config.set('pigments.delayBeforeScan', 0);
      atom.config.set('pigments.sourceNames', ['*.styl', '*.less']);
      waitsForPromise(function() {
        return atom.workspace.open('four-variables.styl').then(function(o) {
          editor = o;
          return editorElement = atom.views.getView(editor);
        });
      });
      return waitsForPromise(function() {
        return atom.packages.activatePackage('pigments').then(function(pkg) {
          pigments = pkg.mainModule;
          return project = pigments.getProject();
        });
      });
    });
    afterEach(function() {
      return colorBuffer != null ? colorBuffer.destroy() : void 0;
    });
    return describe('when an editor is opened', function() {
      beforeEach(function() {
        colorBuffer = project.colorBufferForEditor(editor);
        colorBufferElement = atom.views.getView(colorBuffer);
        return colorBufferElement.attach();
      });
      it('is associated to the ColorBuffer model', function() {
        expect(colorBufferElement).toBeDefined();
        return expect(colorBufferElement.getModel()).toBe(colorBuffer);
      });
      it('attaches itself in the target text editor element', function() {
        expect(colorBufferElement.parentNode).toExist();
        return expect(editorElement.querySelector('.lines pigments-markers')).toExist();
      });
      describe('when the color buffer is initialized', function() {
        beforeEach(function() {
          return waitsForPromise(function() {
            return colorBuffer.initialize();
          });
        });
        it('creates markers views for every visible buffer marker', function() {
          var i, len, marker, markersElements, results;
          markersElements = colorBufferElement.querySelectorAll('pigments-color-marker');
          expect(markersElements.length).toEqual(3);
          results = [];
          for (i = 0, len = markersElements.length; i < len; i++) {
            marker = markersElements[i];
            results.push(expect(marker.getModel()).toBeDefined());
          }
          return results;
        });
        describe('when the project variables are initialized', function() {
          return it('creates markers for the new valid colors', function() {
            waitsForPromise(function() {
              return colorBuffer.variablesAvailable();
            });
            return runs(function() {
              return expect(colorBufferElement.querySelectorAll('pigments-color-marker').length).toEqual(4);
            });
          });
        });
        describe('when a selection intersects a marker range', function() {
          beforeEach(function() {
            return spyOn(colorBufferElement, 'updateSelections').andCallThrough();
          });
          describe('after the markers views was created', function() {
            beforeEach(function() {
              waitsForPromise(function() {
                return colorBuffer.variablesAvailable();
              });
              runs(function() {
                return editor.setSelectedBufferRange([[2, 12], [2, 14]]);
              });
              return waitsFor(function() {
                return colorBufferElement.updateSelections.callCount > 0;
              });
            });
            return it('hides the intersected marker', function() {
              var markers;
              markers = colorBufferElement.querySelectorAll('pigments-color-marker');
              expect(isVisible(markers[0])).toBeTruthy();
              expect(isVisible(markers[1])).toBeTruthy();
              expect(isVisible(markers[2])).toBeTruthy();
              return expect(isVisible(markers[3])).toBeFalsy();
            });
          });
          return describe('before all the markers views was created', function() {
            beforeEach(function() {
              runs(function() {
                return editor.setSelectedBufferRange([[0, 0], [2, 14]]);
              });
              return waitsFor(function() {
                return colorBufferElement.updateSelections.callCount > 0;
              });
            });
            it('hides the existing markers', function() {
              var markers;
              markers = colorBufferElement.querySelectorAll('pigments-color-marker');
              expect(isVisible(markers[0])).toBeFalsy();
              expect(isVisible(markers[1])).toBeTruthy();
              return expect(isVisible(markers[2])).toBeTruthy();
            });
            return describe('and the markers are updated', function() {
              beforeEach(function() {
                waitsForPromise('colors available', function() {
                  return colorBuffer.variablesAvailable();
                });
                return waitsFor('last marker visible', function() {
                  var markers;
                  markers = colorBufferElement.querySelectorAll('pigments-color-marker');
                  return isVisible(markers[3]);
                });
              });
              return it('hides the created markers', function() {
                var markers;
                markers = colorBufferElement.querySelectorAll('pigments-color-marker');
                expect(isVisible(markers[0])).toBeFalsy();
                expect(isVisible(markers[1])).toBeTruthy();
                expect(isVisible(markers[2])).toBeTruthy();
                return expect(isVisible(markers[3])).toBeTruthy();
              });
            });
          });
        });
        describe('when a line is edited and gets wrapped', function() {
          var marker;
          marker = null;
          beforeEach(function() {
            waitsForPromise(function() {
              return colorBuffer.variablesAvailable();
            });
            runs(function() {
              marker = colorBufferElement.usedMarkers[colorBufferElement.usedMarkers.length - 1];
              spyOn(marker, 'render').andCallThrough();
              return editBuffer(new Array(20).join("foo "), {
                start: [1, 0],
                end: [1, 0]
              });
            });
            return waitsFor(function() {
              return marker.render.callCount > 0;
            });
          });
          return it('updates the markers whose screen range have changed', function() {
            return expect(marker.render).toHaveBeenCalled();
          });
        });
        describe('when some markers are destroyed', function() {
          var spy;
          spy = [][0];
          beforeEach(function() {
            var el, i, len, ref1;
            ref1 = colorBufferElement.usedMarkers;
            for (i = 0, len = ref1.length; i < len; i++) {
              el = ref1[i];
              spyOn(el, 'release').andCallThrough();
            }
            spy = jasmine.createSpy('did-update');
            colorBufferElement.onDidUpdate(spy);
            editBuffer('', {
              start: [4, 0],
              end: [8, 0]
            });
            return waitsFor(function() {
              return spy.callCount > 0;
            });
          });
          it('releases the unused markers', function() {
            var i, len, marker, ref1, results;
            expect(colorBufferElement.querySelectorAll('pigments-color-marker').length).toEqual(3);
            expect(colorBufferElement.usedMarkers.length).toEqual(2);
            expect(colorBufferElement.unusedMarkers.length).toEqual(1);
            ref1 = colorBufferElement.unusedMarkers;
            results = [];
            for (i = 0, len = ref1.length; i < len; i++) {
              marker = ref1[i];
              results.push(expect(marker.release).toHaveBeenCalled());
            }
            return results;
          });
          return describe('and then a new marker is created', function() {
            beforeEach(function() {
              editor.moveToBottom();
              editBuffer('\nfoo = #123456\n');
              return waitsFor(function() {
                return colorBufferElement.unusedMarkers.length === 0;
              });
            });
            return it('reuses the previously released marker element', function() {
              expect(colorBufferElement.querySelectorAll('pigments-color-marker').length).toEqual(3);
              expect(colorBufferElement.usedMarkers.length).toEqual(3);
              return expect(colorBufferElement.unusedMarkers.length).toEqual(0);
            });
          });
        });
        describe('when the current pane is splitted to the right', function() {
          beforeEach(function() {
            var version;
            version = parseFloat(atom.getVersion().split('.').slice(1, 2).join('.'));
            if (version > 5) {
              atom.commands.dispatch(editorElement, 'pane:split-right-and-copy-active-item');
            } else {
              atom.commands.dispatch(editorElement, 'pane:split-right');
            }
            waitsFor('text editor', function() {
              return editor = atom.workspace.getTextEditors()[1];
            });
            waitsFor('color buffer element', function() {
              return colorBufferElement = atom.views.getView(project.colorBufferForEditor(editor));
            });
            return waitsFor('color buffer element markers', function() {
              return colorBufferElement.querySelectorAll('pigments-color-marker').length;
            });
          });
          return it('should keep all the buffer elements attached', function() {
            var editors;
            editors = atom.workspace.getTextEditors();
            return editors.forEach(function(editor) {
              editorElement = atom.views.getView(editor);
              colorBufferElement = editorElement.querySelector('pigments-markers');
              expect(colorBufferElement).toExist();
              expect(colorBufferElement.querySelectorAll('pigments-color-marker').length).toEqual(3);
              return expect(colorBufferElement.querySelectorAll('pigments-color-marker:empty').length).toEqual(0);
            });
          });
        });
        return describe('when the marker type is set to gutter', function() {
          var gutter;
          gutter = [][0];
          beforeEach(function() {
            waitsForPromise(function() {
              return colorBuffer.initialize();
            });
            return runs(function() {
              atom.config.set('pigments.markerType', 'gutter');
              return gutter = editorElement.querySelector('[gutter-name="pigments-gutter"]');
            });
          });
          it('removes the markers', function() {
            return expect(colorBufferElement.querySelectorAll('pigments-color-marker').length).toEqual(0);
          });
          it('adds a custom gutter to the text editor', function() {
            return expect(gutter).toExist();
          });
          it('sets the size of the gutter based on the number of markers in the same row', function() {
            return expect(gutter.style.minWidth).toEqual('14px');
          });
          it('adds a gutter decoration for each color marker', function() {
            var decorations;
            decorations = editor.getDecorations().filter(function(d) {
              return d.properties.type === 'gutter';
            });
            return expect(decorations.length).toEqual(3);
          });
          describe('when the variables become available', function() {
            beforeEach(function() {
              return waitsForPromise(function() {
                return colorBuffer.variablesAvailable();
              });
            });
            it('creates decorations for the new valid colors', function() {
              var decorations;
              decorations = editor.getDecorations().filter(function(d) {
                return d.properties.type === 'gutter';
              });
              return expect(decorations.length).toEqual(4);
            });
            return describe('when many markers are added on the same line', function() {
              beforeEach(function() {
                var updateSpy;
                updateSpy = jasmine.createSpy('did-update');
                colorBufferElement.onDidUpdate(updateSpy);
                editor.moveToBottom();
                editBuffer('\nlist = #123456, #987654, #abcdef\n');
                return waitsFor(function() {
                  return updateSpy.callCount > 0;
                });
              });
              it('adds the new decorations to the gutter', function() {
                var decorations;
                decorations = editor.getDecorations().filter(function(d) {
                  return d.properties.type === 'gutter';
                });
                return expect(decorations.length).toEqual(7);
              });
              it('sets the size of the gutter based on the number of markers in the same row', function() {
                return expect(gutter.style.minWidth).toEqual('42px');
              });
              return describe('clicking on a gutter decoration', function() {
                beforeEach(function() {
                  var decoration;
                  project.colorPickerAPI = {
                    open: jasmine.createSpy('color-picker.open')
                  };
                  decoration = editorElement.querySelector('.pigments-gutter-marker span');
                  return mousedown(decoration);
                });
                it('selects the text in the editor', function() {
                  return expect(editor.getSelectedScreenRange()).toEqual([[0, 13], [0, 17]]);
                });
                return it('opens the color picker', function() {
                  return expect(project.colorPickerAPI.open).toHaveBeenCalled();
                });
              });
            });
          });
          describe('when the marker is changed again', function() {
            beforeEach(function() {
              return atom.config.set('pigments.markerType', 'background');
            });
            it('removes the gutter', function() {
              return expect(editorElement.querySelector('[gutter-name="pigments-gutter"]')).not.toExist();
            });
            return it('recreates the markers', function() {
              return expect(colorBufferElement.querySelectorAll('pigments-color-marker').length).toEqual(3);
            });
          });
          return describe('when a new buffer is opened', function() {
            beforeEach(function() {
              waitsForPromise(function() {
                return atom.workspace.open('project/styles/variables.styl').then(function(e) {
                  editor = e;
                  editorElement = atom.views.getView(editor);
                  colorBuffer = project.colorBufferForEditor(editor);
                  return colorBufferElement = atom.views.getView(colorBuffer);
                });
              });
              waitsForPromise(function() {
                return colorBuffer.initialize();
              });
              waitsForPromise(function() {
                return colorBuffer.variablesAvailable();
              });
              return runs(function() {
                return gutter = editorElement.querySelector('[gutter-name="pigments-gutter"]');
              });
            });
            return it('creates the decorations in the new buffer gutter', function() {
              var decorations;
              decorations = editor.getDecorations().filter(function(d) {
                return d.properties.type === 'gutter';
              });
              return expect(decorations.length).toEqual(10);
            });
          });
        });
      });
      describe('when the editor is moved to another pane', function() {
        var newPane, pane, ref1;
        ref1 = [], pane = ref1[0], newPane = ref1[1];
        beforeEach(function() {
          pane = atom.workspace.getActivePane();
          newPane = pane.splitDown({
            copyActiveItem: false
          });
          colorBuffer = project.colorBufferForEditor(editor);
          colorBufferElement = atom.views.getView(colorBuffer);
          expect(atom.workspace.getPanes().length).toEqual(2);
          pane.moveItemToPane(editor, newPane, 0);
          return waitsFor(function() {
            return colorBufferElement.querySelectorAll('pigments-color-marker:not(:empty)').length;
          });
        });
        return it('moves the editor with the buffer to the new pane', function() {
          expect(colorBufferElement.querySelectorAll('pigments-color-marker').length).toEqual(3);
          return expect(colorBufferElement.querySelectorAll('pigments-color-marker:empty').length).toEqual(0);
        });
      });
      describe('when pigments.supportedFiletypes settings is defined', function() {
        var loadBuffer;
        loadBuffer = function(filePath) {
          waitsForPromise(function() {
            return atom.workspace.open(filePath).then(function(o) {
              editor = o;
              editorElement = atom.views.getView(editor);
              colorBuffer = project.colorBufferForEditor(editor);
              colorBufferElement = atom.views.getView(colorBuffer);
              return colorBufferElement.attach();
            });
          });
          waitsForPromise(function() {
            return colorBuffer.initialize();
          });
          return waitsForPromise(function() {
            return colorBuffer.variablesAvailable();
          });
        };
        beforeEach(function() {
          waitsForPromise(function() {
            return atom.packages.activatePackage('language-coffee-script');
          });
          return waitsForPromise(function() {
            return atom.packages.activatePackage('language-less');
          });
        });
        describe('with the default wildcard', function() {
          beforeEach(function() {
            return atom.config.set('pigments.supportedFiletypes', ['*']);
          });
          return it('supports every filetype', function() {
            loadBuffer('scope-filter.coffee');
            runs(function() {
              return expect(colorBufferElement.querySelectorAll('pigments-color-marker:not(:empty)').length).toEqual(2);
            });
            loadBuffer('project/vendor/css/variables.less');
            return runs(function() {
              return expect(colorBufferElement.querySelectorAll('pigments-color-marker:not(:empty)').length).toEqual(20);
            });
          });
        });
        describe('with a filetype', function() {
          beforeEach(function() {
            return atom.config.set('pigments.supportedFiletypes', ['coffee']);
          });
          return it('supports the specified file type', function() {
            loadBuffer('scope-filter.coffee');
            runs(function() {
              return expect(colorBufferElement.querySelectorAll('pigments-color-marker:not(:empty)').length).toEqual(2);
            });
            loadBuffer('project/vendor/css/variables.less');
            return runs(function() {
              return expect(colorBufferElement.querySelectorAll('pigments-color-marker:not(:empty)').length).toEqual(0);
            });
          });
        });
        return describe('with many filetypes', function() {
          beforeEach(function() {
            atom.config.set('pigments.supportedFiletypes', ['coffee']);
            return project.setSupportedFiletypes(['less']);
          });
          it('supports the specified file types', function() {
            loadBuffer('scope-filter.coffee');
            runs(function() {
              return expect(colorBufferElement.querySelectorAll('pigments-color-marker:not(:empty)').length).toEqual(2);
            });
            loadBuffer('project/vendor/css/variables.less');
            runs(function() {
              return expect(colorBufferElement.querySelectorAll('pigments-color-marker:not(:empty)').length).toEqual(20);
            });
            loadBuffer('four-variables.styl');
            return runs(function() {
              return expect(colorBufferElement.querySelectorAll('pigments-color-marker:not(:empty)').length).toEqual(0);
            });
          });
          return describe('with global file types ignored', function() {
            beforeEach(function() {
              atom.config.set('pigments.supportedFiletypes', ['coffee']);
              project.setIgnoreGlobalSupportedFiletypes(true);
              return project.setSupportedFiletypes(['less']);
            });
            return it('supports the specified file types', function() {
              loadBuffer('scope-filter.coffee');
              runs(function() {
                return expect(colorBufferElement.querySelectorAll('pigments-color-marker:not(:empty)').length).toEqual(0);
              });
              loadBuffer('project/vendor/css/variables.less');
              runs(function() {
                return expect(colorBufferElement.querySelectorAll('pigments-color-marker:not(:empty)').length).toEqual(20);
              });
              loadBuffer('four-variables.styl');
              return runs(function() {
                return expect(colorBufferElement.querySelectorAll('pigments-color-marker:not(:empty)').length).toEqual(0);
              });
            });
          });
        });
      });
      describe('when pigments.ignoredScopes settings is defined', function() {
        beforeEach(function() {
          waitsForPromise(function() {
            return atom.packages.activatePackage('language-coffee-script');
          });
          waitsForPromise(function() {
            return atom.workspace.open('scope-filter.coffee').then(function(o) {
              editor = o;
              editorElement = atom.views.getView(editor);
              colorBuffer = project.colorBufferForEditor(editor);
              colorBufferElement = atom.views.getView(colorBuffer);
              return colorBufferElement.attach();
            });
          });
          return waitsForPromise(function() {
            return colorBuffer.initialize();
          });
        });
        describe('with one filter', function() {
          beforeEach(function() {
            return atom.config.set('pigments.ignoredScopes', ['\\.comment']);
          });
          return it('ignores the colors that matches the defined scopes', function() {
            return expect(colorBufferElement.querySelectorAll('pigments-color-marker:not(:empty)').length).toEqual(1);
          });
        });
        describe('with two filters', function() {
          beforeEach(function() {
            return atom.config.set('pigments.ignoredScopes', ['\\.string', '\\.comment']);
          });
          return it('ignores the colors that matches the defined scopes', function() {
            return expect(colorBufferElement.querySelectorAll('pigments-color-marker:not(:empty)').length).toEqual(0);
          });
        });
        describe('with an invalid filter', function() {
          beforeEach(function() {
            return atom.config.set('pigments.ignoredScopes', ['\\']);
          });
          return it('ignores the filter', function() {
            return expect(colorBufferElement.querySelectorAll('pigments-color-marker:not(:empty)').length).toEqual(2);
          });
        });
        return describe('when the project ignoredScopes is defined', function() {
          beforeEach(function() {
            atom.config.set('pigments.ignoredScopes', ['\\.string']);
            return project.setIgnoredScopes(['\\.comment']);
          });
          return it('ignores the colors that matches the defined scopes', function() {
            return expect(colorBufferElement.querySelectorAll('pigments-color-marker:not(:empty)').length).toEqual(0);
          });
        });
      });
      return describe('when a text editor settings is modified', function() {
        var originalMarkers;
        originalMarkers = [][0];
        beforeEach(function() {
          waitsForPromise(function() {
            return colorBuffer.variablesAvailable();
          });
          return runs(function() {
            originalMarkers = colorBufferElement.querySelectorAll('pigments-color-marker:not(:empty)');
            spyOn(colorBufferElement, 'updateMarkers').andCallThrough();
            return spyOn(ColorMarkerElement.prototype, 'render').andCallThrough();
          });
        });
        describe('editor.fontSize', function() {
          beforeEach(function() {
            return atom.config.set('editor.fontSize', 20);
          });
          return it('forces an update and a re-render of existing markers', function() {
            var i, len, marker, results;
            expect(colorBufferElement.updateMarkers).toHaveBeenCalled();
            results = [];
            for (i = 0, len = originalMarkers.length; i < len; i++) {
              marker = originalMarkers[i];
              results.push(expect(marker.render).toHaveBeenCalled());
            }
            return results;
          });
        });
        return describe('editor.lineHeight', function() {
          beforeEach(function() {
            return atom.config.set('editor.lineHeight', 20);
          });
          return it('forces an update and a re-render of existing markers', function() {
            var i, len, marker, results;
            expect(colorBufferElement.updateMarkers).toHaveBeenCalled();
            results = [];
            for (i = 0, len = originalMarkers.length; i < len; i++) {
              marker = originalMarkers[i];
              results.push(expect(marker.render).toHaveBeenCalled());
            }
            return results;
          });
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvZGRld2V5Ly5hdG9tL3BhY2thZ2VzL3BpZ21lbnRzL3NwZWMvY29sb3ItYnVmZmVyLWVsZW1lbnQtc3BlYy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7RUFDUCxPQUFBLENBQVEsdUJBQVI7O0VBQ0MsWUFBYSxPQUFBLENBQVEsa0JBQVI7O0VBRWQsa0JBQUEsR0FBcUIsT0FBQSxDQUFRLDZCQUFSOztFQUNyQixrQkFBQSxHQUFxQixPQUFBLENBQVEsNkJBQVI7O0VBRXJCLEtBQUEsR0FBUSxTQUFDLFFBQUQ7QUFDTixRQUFBO0lBQUEsQ0FBQSxHQUFRLElBQUEsSUFBQSxDQUFBO1dBQ1IsUUFBQSxDQUFTLFNBQUE7YUFBTyxJQUFBLElBQUEsQ0FBQSxDQUFKLEdBQWEsQ0FBYixHQUFpQjtJQUFwQixDQUFUO0VBRk07O0VBSVIsUUFBQSxDQUFTLG9CQUFULEVBQStCLFNBQUE7QUFDN0IsUUFBQTtJQUFBLE1BQThGLEVBQTlGLEVBQUMsZUFBRCxFQUFTLHNCQUFULEVBQXdCLG9CQUF4QixFQUFxQyxpQkFBckMsRUFBK0MsZ0JBQS9DLEVBQXdELDJCQUF4RCxFQUE0RTtJQUU1RSxTQUFBLEdBQVksU0FBQyxJQUFEO2FBQVUsQ0FBSSxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQWYsQ0FBd0IsUUFBeEI7SUFBZDtJQUVaLFVBQUEsR0FBYSxTQUFDLElBQUQsRUFBTyxPQUFQO0FBQ1gsVUFBQTs7UUFEa0IsVUFBUTs7TUFDMUIsSUFBRyxxQkFBSDtRQUNFLElBQUcsbUJBQUg7VUFDRSxLQUFBLEdBQVEsQ0FBQyxPQUFPLENBQUMsS0FBVCxFQUFnQixPQUFPLENBQUMsR0FBeEIsRUFEVjtTQUFBLE1BQUE7VUFHRSxLQUFBLEdBQVEsQ0FBQyxPQUFPLENBQUMsS0FBVCxFQUFnQixPQUFPLENBQUMsS0FBeEIsRUFIVjs7UUFLQSxNQUFNLENBQUMsc0JBQVAsQ0FBOEIsS0FBOUIsRUFORjs7TUFRQSxNQUFNLENBQUMsVUFBUCxDQUFrQixJQUFsQjtNQUNBLElBQUEsQ0FBeUIsT0FBTyxDQUFDLE9BQWpDO2VBQUEsWUFBQSxDQUFhLEdBQWIsRUFBQTs7SUFWVztJQVliLFdBQUEsR0FBYyxTQUFDLE9BQUQsRUFBVSxJQUFWO0FBQ1osVUFBQTtNQUFBLFFBQUEsR0FBVyxJQUFJLENBQUMsT0FBTCxDQUFhLFNBQWIsRUFBd0IsVUFBeEIsRUFBb0MsT0FBcEM7TUFDWCxJQUFBLEdBQU8sRUFBRSxDQUFDLFlBQUgsQ0FBZ0IsUUFBaEIsQ0FBeUIsQ0FBQyxRQUExQixDQUFBO01BQ1AsSUFBQSxHQUFPLElBQUksQ0FBQyxPQUFMLENBQWEsYUFBYixFQUE0QixTQUFDLENBQUQsRUFBRyxDQUFIO2VBQVMsSUFBSyxDQUFBLENBQUE7TUFBZCxDQUE1QjthQUVQLElBQUksQ0FBQyxLQUFMLENBQVcsSUFBWDtJQUxZO0lBT2QsVUFBQSxDQUFXLFNBQUE7QUFDVCxVQUFBO01BQUEsZ0JBQUEsR0FBbUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLElBQUksQ0FBQyxTQUF4QjtNQUNuQixjQUFBLEdBQWlCLFFBQVEsQ0FBQyxJQUFJLENBQUMsYUFBZCxDQUE0QixrQkFBNUI7TUFFakIsY0FBYyxDQUFDLFdBQWYsQ0FBMkIsZ0JBQTNCO01BRUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLGlCQUFoQixFQUFtQyxJQUFuQztNQUNBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixzQ0FBaEIsRUFBd0QsSUFBeEQ7TUFDQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsNEJBQWhCLEVBQThDLEVBQTlDO01BRUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDBCQUFoQixFQUE0QyxDQUE1QztNQUNBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixzQkFBaEIsRUFBd0MsQ0FDdEMsUUFEc0MsRUFFdEMsUUFGc0MsQ0FBeEM7TUFLQSxlQUFBLENBQWdCLFNBQUE7ZUFDZCxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IscUJBQXBCLENBQTBDLENBQUMsSUFBM0MsQ0FBZ0QsU0FBQyxDQUFEO1VBQzlDLE1BQUEsR0FBUztpQkFDVCxhQUFBLEdBQWdCLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBWCxDQUFtQixNQUFuQjtRQUY4QixDQUFoRDtNQURjLENBQWhCO2FBS0EsZUFBQSxDQUFnQixTQUFBO2VBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFkLENBQThCLFVBQTlCLENBQXlDLENBQUMsSUFBMUMsQ0FBK0MsU0FBQyxHQUFEO1VBQ2hFLFFBQUEsR0FBVyxHQUFHLENBQUM7aUJBQ2YsT0FBQSxHQUFVLFFBQVEsQ0FBQyxVQUFULENBQUE7UUFGc0QsQ0FBL0M7TUFBSCxDQUFoQjtJQXJCUyxDQUFYO0lBeUJBLFNBQUEsQ0FBVSxTQUFBO21DQUNSLFdBQVcsQ0FBRSxPQUFiLENBQUE7SUFEUSxDQUFWO1dBR0EsUUFBQSxDQUFTLDBCQUFULEVBQXFDLFNBQUE7TUFDbkMsVUFBQSxDQUFXLFNBQUE7UUFDVCxXQUFBLEdBQWMsT0FBTyxDQUFDLG9CQUFSLENBQTZCLE1BQTdCO1FBQ2Qsa0JBQUEsR0FBcUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLFdBQW5CO2VBQ3JCLGtCQUFrQixDQUFDLE1BQW5CLENBQUE7TUFIUyxDQUFYO01BS0EsRUFBQSxDQUFHLHdDQUFILEVBQTZDLFNBQUE7UUFDM0MsTUFBQSxDQUFPLGtCQUFQLENBQTBCLENBQUMsV0FBM0IsQ0FBQTtlQUNBLE1BQUEsQ0FBTyxrQkFBa0IsQ0FBQyxRQUFuQixDQUFBLENBQVAsQ0FBcUMsQ0FBQyxJQUF0QyxDQUEyQyxXQUEzQztNQUYyQyxDQUE3QztNQUlBLEVBQUEsQ0FBRyxtREFBSCxFQUF3RCxTQUFBO1FBQ3RELE1BQUEsQ0FBTyxrQkFBa0IsQ0FBQyxVQUExQixDQUFxQyxDQUFDLE9BQXRDLENBQUE7ZUFDQSxNQUFBLENBQU8sYUFBYSxDQUFDLGFBQWQsQ0FBNEIseUJBQTVCLENBQVAsQ0FBOEQsQ0FBQyxPQUEvRCxDQUFBO01BRnNELENBQXhEO01BSUEsUUFBQSxDQUFTLHNDQUFULEVBQWlELFNBQUE7UUFDL0MsVUFBQSxDQUFXLFNBQUE7aUJBQ1QsZUFBQSxDQUFnQixTQUFBO21CQUFHLFdBQVcsQ0FBQyxVQUFaLENBQUE7VUFBSCxDQUFoQjtRQURTLENBQVg7UUFHQSxFQUFBLENBQUcsdURBQUgsRUFBNEQsU0FBQTtBQUMxRCxjQUFBO1VBQUEsZUFBQSxHQUFrQixrQkFBa0IsQ0FBQyxnQkFBbkIsQ0FBb0MsdUJBQXBDO1VBRWxCLE1BQUEsQ0FBTyxlQUFlLENBQUMsTUFBdkIsQ0FBOEIsQ0FBQyxPQUEvQixDQUF1QyxDQUF2QztBQUVBO2VBQUEsaURBQUE7O3lCQUNFLE1BQUEsQ0FBTyxNQUFNLENBQUMsUUFBUCxDQUFBLENBQVAsQ0FBeUIsQ0FBQyxXQUExQixDQUFBO0FBREY7O1FBTDBELENBQTVEO1FBUUEsUUFBQSxDQUFTLDRDQUFULEVBQXVELFNBQUE7aUJBQ3JELEVBQUEsQ0FBRywwQ0FBSCxFQUErQyxTQUFBO1lBQzdDLGVBQUEsQ0FBZ0IsU0FBQTtxQkFBRyxXQUFXLENBQUMsa0JBQVosQ0FBQTtZQUFILENBQWhCO21CQUNBLElBQUEsQ0FBSyxTQUFBO3FCQUNILE1BQUEsQ0FBTyxrQkFBa0IsQ0FBQyxnQkFBbkIsQ0FBb0MsdUJBQXBDLENBQTRELENBQUMsTUFBcEUsQ0FBMkUsQ0FBQyxPQUE1RSxDQUFvRixDQUFwRjtZQURHLENBQUw7VUFGNkMsQ0FBL0M7UUFEcUQsQ0FBdkQ7UUFNQSxRQUFBLENBQVMsNENBQVQsRUFBdUQsU0FBQTtVQUNyRCxVQUFBLENBQVcsU0FBQTttQkFDVCxLQUFBLENBQU0sa0JBQU4sRUFBMEIsa0JBQTFCLENBQTZDLENBQUMsY0FBOUMsQ0FBQTtVQURTLENBQVg7VUFHQSxRQUFBLENBQVMscUNBQVQsRUFBZ0QsU0FBQTtZQUM5QyxVQUFBLENBQVcsU0FBQTtjQUNULGVBQUEsQ0FBZ0IsU0FBQTt1QkFBRyxXQUFXLENBQUMsa0JBQVosQ0FBQTtjQUFILENBQWhCO2NBQ0EsSUFBQSxDQUFLLFNBQUE7dUJBQUcsTUFBTSxDQUFDLHNCQUFQLENBQThCLENBQUMsQ0FBQyxDQUFELEVBQUcsRUFBSCxDQUFELEVBQVEsQ0FBQyxDQUFELEVBQUksRUFBSixDQUFSLENBQTlCO2NBQUgsQ0FBTDtxQkFDQSxRQUFBLENBQVMsU0FBQTt1QkFBRyxrQkFBa0IsQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFwQyxHQUFnRDtjQUFuRCxDQUFUO1lBSFMsQ0FBWDttQkFLQSxFQUFBLENBQUcsOEJBQUgsRUFBbUMsU0FBQTtBQUNqQyxrQkFBQTtjQUFBLE9BQUEsR0FBVSxrQkFBa0IsQ0FBQyxnQkFBbkIsQ0FBb0MsdUJBQXBDO2NBRVYsTUFBQSxDQUFPLFNBQUEsQ0FBVSxPQUFRLENBQUEsQ0FBQSxDQUFsQixDQUFQLENBQTZCLENBQUMsVUFBOUIsQ0FBQTtjQUNBLE1BQUEsQ0FBTyxTQUFBLENBQVUsT0FBUSxDQUFBLENBQUEsQ0FBbEIsQ0FBUCxDQUE2QixDQUFDLFVBQTlCLENBQUE7Y0FDQSxNQUFBLENBQU8sU0FBQSxDQUFVLE9BQVEsQ0FBQSxDQUFBLENBQWxCLENBQVAsQ0FBNkIsQ0FBQyxVQUE5QixDQUFBO3FCQUNBLE1BQUEsQ0FBTyxTQUFBLENBQVUsT0FBUSxDQUFBLENBQUEsQ0FBbEIsQ0FBUCxDQUE2QixDQUFDLFNBQTlCLENBQUE7WUFOaUMsQ0FBbkM7VUFOOEMsQ0FBaEQ7aUJBY0EsUUFBQSxDQUFTLDBDQUFULEVBQXFELFNBQUE7WUFDbkQsVUFBQSxDQUFXLFNBQUE7Y0FDVCxJQUFBLENBQUssU0FBQTt1QkFBRyxNQUFNLENBQUMsc0JBQVAsQ0FBOEIsQ0FBQyxDQUFDLENBQUQsRUFBRyxDQUFILENBQUQsRUFBTyxDQUFDLENBQUQsRUFBSSxFQUFKLENBQVAsQ0FBOUI7Y0FBSCxDQUFMO3FCQUNBLFFBQUEsQ0FBUyxTQUFBO3VCQUFHLGtCQUFrQixDQUFDLGdCQUFnQixDQUFDLFNBQXBDLEdBQWdEO2NBQW5ELENBQVQ7WUFGUyxDQUFYO1lBSUEsRUFBQSxDQUFHLDRCQUFILEVBQWlDLFNBQUE7QUFDL0Isa0JBQUE7Y0FBQSxPQUFBLEdBQVUsa0JBQWtCLENBQUMsZ0JBQW5CLENBQW9DLHVCQUFwQztjQUVWLE1BQUEsQ0FBTyxTQUFBLENBQVUsT0FBUSxDQUFBLENBQUEsQ0FBbEIsQ0FBUCxDQUE2QixDQUFDLFNBQTlCLENBQUE7Y0FDQSxNQUFBLENBQU8sU0FBQSxDQUFVLE9BQVEsQ0FBQSxDQUFBLENBQWxCLENBQVAsQ0FBNkIsQ0FBQyxVQUE5QixDQUFBO3FCQUNBLE1BQUEsQ0FBTyxTQUFBLENBQVUsT0FBUSxDQUFBLENBQUEsQ0FBbEIsQ0FBUCxDQUE2QixDQUFDLFVBQTlCLENBQUE7WUFMK0IsQ0FBakM7bUJBT0EsUUFBQSxDQUFTLDZCQUFULEVBQXdDLFNBQUE7Y0FDdEMsVUFBQSxDQUFXLFNBQUE7Z0JBQ1QsZUFBQSxDQUFnQixrQkFBaEIsRUFBb0MsU0FBQTt5QkFDbEMsV0FBVyxDQUFDLGtCQUFaLENBQUE7Z0JBRGtDLENBQXBDO3VCQUVBLFFBQUEsQ0FBUyxxQkFBVCxFQUFnQyxTQUFBO0FBQzlCLHNCQUFBO2tCQUFBLE9BQUEsR0FBVSxrQkFBa0IsQ0FBQyxnQkFBbkIsQ0FBb0MsdUJBQXBDO3lCQUNWLFNBQUEsQ0FBVSxPQUFRLENBQUEsQ0FBQSxDQUFsQjtnQkFGOEIsQ0FBaEM7Y0FIUyxDQUFYO3FCQU9BLEVBQUEsQ0FBRywyQkFBSCxFQUFnQyxTQUFBO0FBQzlCLG9CQUFBO2dCQUFBLE9BQUEsR0FBVSxrQkFBa0IsQ0FBQyxnQkFBbkIsQ0FBb0MsdUJBQXBDO2dCQUNWLE1BQUEsQ0FBTyxTQUFBLENBQVUsT0FBUSxDQUFBLENBQUEsQ0FBbEIsQ0FBUCxDQUE2QixDQUFDLFNBQTlCLENBQUE7Z0JBQ0EsTUFBQSxDQUFPLFNBQUEsQ0FBVSxPQUFRLENBQUEsQ0FBQSxDQUFsQixDQUFQLENBQTZCLENBQUMsVUFBOUIsQ0FBQTtnQkFDQSxNQUFBLENBQU8sU0FBQSxDQUFVLE9BQVEsQ0FBQSxDQUFBLENBQWxCLENBQVAsQ0FBNkIsQ0FBQyxVQUE5QixDQUFBO3VCQUNBLE1BQUEsQ0FBTyxTQUFBLENBQVUsT0FBUSxDQUFBLENBQUEsQ0FBbEIsQ0FBUCxDQUE2QixDQUFDLFVBQTlCLENBQUE7Y0FMOEIsQ0FBaEM7WUFSc0MsQ0FBeEM7VUFabUQsQ0FBckQ7UUFsQnFELENBQXZEO1FBNkNBLFFBQUEsQ0FBUyx3Q0FBVCxFQUFtRCxTQUFBO0FBQ2pELGNBQUE7VUFBQSxNQUFBLEdBQVM7VUFDVCxVQUFBLENBQVcsU0FBQTtZQUNULGVBQUEsQ0FBZ0IsU0FBQTtxQkFBRyxXQUFXLENBQUMsa0JBQVosQ0FBQTtZQUFILENBQWhCO1lBRUEsSUFBQSxDQUFLLFNBQUE7Y0FDSCxNQUFBLEdBQVMsa0JBQWtCLENBQUMsV0FBWSxDQUFBLGtCQUFrQixDQUFDLFdBQVcsQ0FBQyxNQUEvQixHQUFzQyxDQUF0QztjQUN4QyxLQUFBLENBQU0sTUFBTixFQUFjLFFBQWQsQ0FBdUIsQ0FBQyxjQUF4QixDQUFBO3FCQUVBLFVBQUEsQ0FBZSxJQUFBLEtBQUEsQ0FBTSxFQUFOLENBQVMsQ0FBQyxJQUFWLENBQWUsTUFBZixDQUFmLEVBQXVDO2dCQUFBLEtBQUEsRUFBTyxDQUFDLENBQUQsRUFBRyxDQUFILENBQVA7Z0JBQWMsR0FBQSxFQUFLLENBQUMsQ0FBRCxFQUFHLENBQUgsQ0FBbkI7ZUFBdkM7WUFKRyxDQUFMO21CQU1BLFFBQUEsQ0FBUyxTQUFBO3FCQUNQLE1BQU0sQ0FBQyxNQUFNLENBQUMsU0FBZCxHQUEwQjtZQURuQixDQUFUO1VBVFMsQ0FBWDtpQkFZQSxFQUFBLENBQUcscURBQUgsRUFBMEQsU0FBQTttQkFDeEQsTUFBQSxDQUFPLE1BQU0sQ0FBQyxNQUFkLENBQXFCLENBQUMsZ0JBQXRCLENBQUE7VUFEd0QsQ0FBMUQ7UUFkaUQsQ0FBbkQ7UUFpQkEsUUFBQSxDQUFTLGlDQUFULEVBQTRDLFNBQUE7QUFDMUMsY0FBQTtVQUFDLE1BQU87VUFDUixVQUFBLENBQVcsU0FBQTtBQUNULGdCQUFBO0FBQUE7QUFBQSxpQkFBQSxzQ0FBQTs7Y0FDRSxLQUFBLENBQU0sRUFBTixFQUFVLFNBQVYsQ0FBb0IsQ0FBQyxjQUFyQixDQUFBO0FBREY7WUFHQSxHQUFBLEdBQU0sT0FBTyxDQUFDLFNBQVIsQ0FBa0IsWUFBbEI7WUFDTixrQkFBa0IsQ0FBQyxXQUFuQixDQUErQixHQUEvQjtZQUNBLFVBQUEsQ0FBVyxFQUFYLEVBQWU7Y0FBQSxLQUFBLEVBQU8sQ0FBQyxDQUFELEVBQUcsQ0FBSCxDQUFQO2NBQWMsR0FBQSxFQUFLLENBQUMsQ0FBRCxFQUFHLENBQUgsQ0FBbkI7YUFBZjttQkFDQSxRQUFBLENBQVMsU0FBQTtxQkFBRyxHQUFHLENBQUMsU0FBSixHQUFnQjtZQUFuQixDQUFUO1VBUFMsQ0FBWDtVQVNBLEVBQUEsQ0FBRyw2QkFBSCxFQUFrQyxTQUFBO0FBQ2hDLGdCQUFBO1lBQUEsTUFBQSxDQUFPLGtCQUFrQixDQUFDLGdCQUFuQixDQUFvQyx1QkFBcEMsQ0FBNEQsQ0FBQyxNQUFwRSxDQUEyRSxDQUFDLE9BQTVFLENBQW9GLENBQXBGO1lBQ0EsTUFBQSxDQUFPLGtCQUFrQixDQUFDLFdBQVcsQ0FBQyxNQUF0QyxDQUE2QyxDQUFDLE9BQTlDLENBQXNELENBQXREO1lBQ0EsTUFBQSxDQUFPLGtCQUFrQixDQUFDLGFBQWEsQ0FBQyxNQUF4QyxDQUErQyxDQUFDLE9BQWhELENBQXdELENBQXhEO0FBRUE7QUFBQTtpQkFBQSxzQ0FBQTs7MkJBQ0UsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFkLENBQXNCLENBQUMsZ0JBQXZCLENBQUE7QUFERjs7VUFMZ0MsQ0FBbEM7aUJBUUEsUUFBQSxDQUFTLGtDQUFULEVBQTZDLFNBQUE7WUFDM0MsVUFBQSxDQUFXLFNBQUE7Y0FDVCxNQUFNLENBQUMsWUFBUCxDQUFBO2NBQ0EsVUFBQSxDQUFXLG1CQUFYO3FCQUNBLFFBQUEsQ0FBUyxTQUFBO3VCQUFHLGtCQUFrQixDQUFDLGFBQWEsQ0FBQyxNQUFqQyxLQUEyQztjQUE5QyxDQUFUO1lBSFMsQ0FBWDttQkFLQSxFQUFBLENBQUcsK0NBQUgsRUFBb0QsU0FBQTtjQUNsRCxNQUFBLENBQU8sa0JBQWtCLENBQUMsZ0JBQW5CLENBQW9DLHVCQUFwQyxDQUE0RCxDQUFDLE1BQXBFLENBQTJFLENBQUMsT0FBNUUsQ0FBb0YsQ0FBcEY7Y0FDQSxNQUFBLENBQU8sa0JBQWtCLENBQUMsV0FBVyxDQUFDLE1BQXRDLENBQTZDLENBQUMsT0FBOUMsQ0FBc0QsQ0FBdEQ7cUJBQ0EsTUFBQSxDQUFPLGtCQUFrQixDQUFDLGFBQWEsQ0FBQyxNQUF4QyxDQUErQyxDQUFDLE9BQWhELENBQXdELENBQXhEO1lBSGtELENBQXBEO1VBTjJDLENBQTdDO1FBbkIwQyxDQUE1QztRQThCQSxRQUFBLENBQVMsZ0RBQVQsRUFBMkQsU0FBQTtVQUN6RCxVQUFBLENBQVcsU0FBQTtBQUNULGdCQUFBO1lBQUEsT0FBQSxHQUFVLFVBQUEsQ0FBVyxJQUFJLENBQUMsVUFBTCxDQUFBLENBQWlCLENBQUMsS0FBbEIsQ0FBd0IsR0FBeEIsQ0FBNEIsQ0FBQyxLQUE3QixDQUFtQyxDQUFuQyxFQUFxQyxDQUFyQyxDQUF1QyxDQUFDLElBQXhDLENBQTZDLEdBQTdDLENBQVg7WUFDVixJQUFHLE9BQUEsR0FBVSxDQUFiO2NBQ0UsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFkLENBQXVCLGFBQXZCLEVBQXNDLHVDQUF0QyxFQURGO2FBQUEsTUFBQTtjQUdFLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBZCxDQUF1QixhQUF2QixFQUFzQyxrQkFBdEMsRUFIRjs7WUFLQSxRQUFBLENBQVMsYUFBVCxFQUF3QixTQUFBO3FCQUN0QixNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxjQUFmLENBQUEsQ0FBZ0MsQ0FBQSxDQUFBO1lBRG5CLENBQXhCO1lBR0EsUUFBQSxDQUFTLHNCQUFULEVBQWlDLFNBQUE7cUJBQy9CLGtCQUFBLEdBQXFCLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBWCxDQUFtQixPQUFPLENBQUMsb0JBQVIsQ0FBNkIsTUFBN0IsQ0FBbkI7WUFEVSxDQUFqQzttQkFFQSxRQUFBLENBQVMsOEJBQVQsRUFBeUMsU0FBQTtxQkFDdkMsa0JBQWtCLENBQUMsZ0JBQW5CLENBQW9DLHVCQUFwQyxDQUE0RCxDQUFDO1lBRHRCLENBQXpDO1VBWlMsQ0FBWDtpQkFlQSxFQUFBLENBQUcsOENBQUgsRUFBbUQsU0FBQTtBQUNqRCxnQkFBQTtZQUFBLE9BQUEsR0FBVSxJQUFJLENBQUMsU0FBUyxDQUFDLGNBQWYsQ0FBQTttQkFFVixPQUFPLENBQUMsT0FBUixDQUFnQixTQUFDLE1BQUQ7Y0FDZCxhQUFBLEdBQWdCLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBWCxDQUFtQixNQUFuQjtjQUNoQixrQkFBQSxHQUFxQixhQUFhLENBQUMsYUFBZCxDQUE0QixrQkFBNUI7Y0FDckIsTUFBQSxDQUFPLGtCQUFQLENBQTBCLENBQUMsT0FBM0IsQ0FBQTtjQUVBLE1BQUEsQ0FBTyxrQkFBa0IsQ0FBQyxnQkFBbkIsQ0FBb0MsdUJBQXBDLENBQTRELENBQUMsTUFBcEUsQ0FBMkUsQ0FBQyxPQUE1RSxDQUFvRixDQUFwRjtxQkFDQSxNQUFBLENBQU8sa0JBQWtCLENBQUMsZ0JBQW5CLENBQW9DLDZCQUFwQyxDQUFrRSxDQUFDLE1BQTFFLENBQWlGLENBQUMsT0FBbEYsQ0FBMEYsQ0FBMUY7WUFOYyxDQUFoQjtVQUhpRCxDQUFuRDtRQWhCeUQsQ0FBM0Q7ZUEyQkEsUUFBQSxDQUFTLHVDQUFULEVBQWtELFNBQUE7QUFDaEQsY0FBQTtVQUFDLFNBQVU7VUFFWCxVQUFBLENBQVcsU0FBQTtZQUNULGVBQUEsQ0FBZ0IsU0FBQTtxQkFBRyxXQUFXLENBQUMsVUFBWixDQUFBO1lBQUgsQ0FBaEI7bUJBQ0EsSUFBQSxDQUFLLFNBQUE7Y0FDSCxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IscUJBQWhCLEVBQXVDLFFBQXZDO3FCQUNBLE1BQUEsR0FBUyxhQUFhLENBQUMsYUFBZCxDQUE0QixpQ0FBNUI7WUFGTixDQUFMO1VBRlMsQ0FBWDtVQU1BLEVBQUEsQ0FBRyxxQkFBSCxFQUEwQixTQUFBO21CQUN4QixNQUFBLENBQU8sa0JBQWtCLENBQUMsZ0JBQW5CLENBQW9DLHVCQUFwQyxDQUE0RCxDQUFDLE1BQXBFLENBQTJFLENBQUMsT0FBNUUsQ0FBb0YsQ0FBcEY7VUFEd0IsQ0FBMUI7VUFHQSxFQUFBLENBQUcseUNBQUgsRUFBOEMsU0FBQTttQkFDNUMsTUFBQSxDQUFPLE1BQVAsQ0FBYyxDQUFDLE9BQWYsQ0FBQTtVQUQ0QyxDQUE5QztVQUdBLEVBQUEsQ0FBRyw0RUFBSCxFQUFpRixTQUFBO21CQUMvRSxNQUFBLENBQU8sTUFBTSxDQUFDLEtBQUssQ0FBQyxRQUFwQixDQUE2QixDQUFDLE9BQTlCLENBQXNDLE1BQXRDO1VBRCtFLENBQWpGO1VBR0EsRUFBQSxDQUFHLGdEQUFILEVBQXFELFNBQUE7QUFDbkQsZ0JBQUE7WUFBQSxXQUFBLEdBQWMsTUFBTSxDQUFDLGNBQVAsQ0FBQSxDQUF1QixDQUFDLE1BQXhCLENBQStCLFNBQUMsQ0FBRDtxQkFDM0MsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxJQUFiLEtBQXFCO1lBRHNCLENBQS9CO21CQUVkLE1BQUEsQ0FBTyxXQUFXLENBQUMsTUFBbkIsQ0FBMEIsQ0FBQyxPQUEzQixDQUFtQyxDQUFuQztVQUhtRCxDQUFyRDtVQUtBLFFBQUEsQ0FBUyxxQ0FBVCxFQUFnRCxTQUFBO1lBQzlDLFVBQUEsQ0FBVyxTQUFBO3FCQUNULGVBQUEsQ0FBZ0IsU0FBQTt1QkFBRyxXQUFXLENBQUMsa0JBQVosQ0FBQTtjQUFILENBQWhCO1lBRFMsQ0FBWDtZQUdBLEVBQUEsQ0FBRyw4Q0FBSCxFQUFtRCxTQUFBO0FBQ2pELGtCQUFBO2NBQUEsV0FBQSxHQUFjLE1BQU0sQ0FBQyxjQUFQLENBQUEsQ0FBdUIsQ0FBQyxNQUF4QixDQUErQixTQUFDLENBQUQ7dUJBQzNDLENBQUMsQ0FBQyxVQUFVLENBQUMsSUFBYixLQUFxQjtjQURzQixDQUEvQjtxQkFFZCxNQUFBLENBQU8sV0FBVyxDQUFDLE1BQW5CLENBQTBCLENBQUMsT0FBM0IsQ0FBbUMsQ0FBbkM7WUFIaUQsQ0FBbkQ7bUJBS0EsUUFBQSxDQUFTLDhDQUFULEVBQXlELFNBQUE7Y0FDdkQsVUFBQSxDQUFXLFNBQUE7QUFDVCxvQkFBQTtnQkFBQSxTQUFBLEdBQVksT0FBTyxDQUFDLFNBQVIsQ0FBa0IsWUFBbEI7Z0JBQ1osa0JBQWtCLENBQUMsV0FBbkIsQ0FBK0IsU0FBL0I7Z0JBRUEsTUFBTSxDQUFDLFlBQVAsQ0FBQTtnQkFDQSxVQUFBLENBQVcsc0NBQVg7dUJBQ0EsUUFBQSxDQUFTLFNBQUE7eUJBQUcsU0FBUyxDQUFDLFNBQVYsR0FBc0I7Z0JBQXpCLENBQVQ7Y0FOUyxDQUFYO2NBUUEsRUFBQSxDQUFHLHdDQUFILEVBQTZDLFNBQUE7QUFDM0Msb0JBQUE7Z0JBQUEsV0FBQSxHQUFjLE1BQU0sQ0FBQyxjQUFQLENBQUEsQ0FBdUIsQ0FBQyxNQUF4QixDQUErQixTQUFDLENBQUQ7eUJBQzNDLENBQUMsQ0FBQyxVQUFVLENBQUMsSUFBYixLQUFxQjtnQkFEc0IsQ0FBL0I7dUJBR2QsTUFBQSxDQUFPLFdBQVcsQ0FBQyxNQUFuQixDQUEwQixDQUFDLE9BQTNCLENBQW1DLENBQW5DO2NBSjJDLENBQTdDO2NBTUEsRUFBQSxDQUFHLDRFQUFILEVBQWlGLFNBQUE7dUJBQy9FLE1BQUEsQ0FBTyxNQUFNLENBQUMsS0FBSyxDQUFDLFFBQXBCLENBQTZCLENBQUMsT0FBOUIsQ0FBc0MsTUFBdEM7Y0FEK0UsQ0FBakY7cUJBR0EsUUFBQSxDQUFTLGlDQUFULEVBQTRDLFNBQUE7Z0JBQzFDLFVBQUEsQ0FBVyxTQUFBO0FBQ1Qsc0JBQUE7a0JBQUEsT0FBTyxDQUFDLGNBQVIsR0FDRTtvQkFBQSxJQUFBLEVBQU0sT0FBTyxDQUFDLFNBQVIsQ0FBa0IsbUJBQWxCLENBQU47O2tCQUVGLFVBQUEsR0FBYSxhQUFhLENBQUMsYUFBZCxDQUE0Qiw4QkFBNUI7eUJBQ2IsU0FBQSxDQUFVLFVBQVY7Z0JBTFMsQ0FBWDtnQkFPQSxFQUFBLENBQUcsZ0NBQUgsRUFBcUMsU0FBQTt5QkFDbkMsTUFBQSxDQUFPLE1BQU0sQ0FBQyxzQkFBUCxDQUFBLENBQVAsQ0FBdUMsQ0FBQyxPQUF4QyxDQUFnRCxDQUFDLENBQUMsQ0FBRCxFQUFHLEVBQUgsQ0FBRCxFQUFRLENBQUMsQ0FBRCxFQUFHLEVBQUgsQ0FBUixDQUFoRDtnQkFEbUMsQ0FBckM7dUJBR0EsRUFBQSxDQUFHLHdCQUFILEVBQTZCLFNBQUE7eUJBQzNCLE1BQUEsQ0FBTyxPQUFPLENBQUMsY0FBYyxDQUFDLElBQTlCLENBQW1DLENBQUMsZ0JBQXBDLENBQUE7Z0JBRDJCLENBQTdCO2NBWDBDLENBQTVDO1lBbEJ1RCxDQUF6RDtVQVQ4QyxDQUFoRDtVQXlDQSxRQUFBLENBQVMsa0NBQVQsRUFBNkMsU0FBQTtZQUMzQyxVQUFBLENBQVcsU0FBQTtxQkFDVCxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IscUJBQWhCLEVBQXVDLFlBQXZDO1lBRFMsQ0FBWDtZQUdBLEVBQUEsQ0FBRyxvQkFBSCxFQUF5QixTQUFBO3FCQUN2QixNQUFBLENBQU8sYUFBYSxDQUFDLGFBQWQsQ0FBNEIsaUNBQTVCLENBQVAsQ0FBc0UsQ0FBQyxHQUFHLENBQUMsT0FBM0UsQ0FBQTtZQUR1QixDQUF6QjttQkFHQSxFQUFBLENBQUcsdUJBQUgsRUFBNEIsU0FBQTtxQkFDMUIsTUFBQSxDQUFPLGtCQUFrQixDQUFDLGdCQUFuQixDQUFvQyx1QkFBcEMsQ0FBNEQsQ0FBQyxNQUFwRSxDQUEyRSxDQUFDLE9BQTVFLENBQW9GLENBQXBGO1lBRDBCLENBQTVCO1VBUDJDLENBQTdDO2lCQVVBLFFBQUEsQ0FBUyw2QkFBVCxFQUF3QyxTQUFBO1lBQ3RDLFVBQUEsQ0FBVyxTQUFBO2NBQ1QsZUFBQSxDQUFnQixTQUFBO3VCQUNkLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQiwrQkFBcEIsQ0FBb0QsQ0FBQyxJQUFyRCxDQUEwRCxTQUFDLENBQUQ7a0JBQ3hELE1BQUEsR0FBUztrQkFDVCxhQUFBLEdBQWdCLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBWCxDQUFtQixNQUFuQjtrQkFDaEIsV0FBQSxHQUFjLE9BQU8sQ0FBQyxvQkFBUixDQUE2QixNQUE3Qjt5QkFDZCxrQkFBQSxHQUFxQixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIsV0FBbkI7Z0JBSm1DLENBQTFEO2NBRGMsQ0FBaEI7Y0FPQSxlQUFBLENBQWdCLFNBQUE7dUJBQUcsV0FBVyxDQUFDLFVBQVosQ0FBQTtjQUFILENBQWhCO2NBQ0EsZUFBQSxDQUFnQixTQUFBO3VCQUFHLFdBQVcsQ0FBQyxrQkFBWixDQUFBO2NBQUgsQ0FBaEI7cUJBRUEsSUFBQSxDQUFLLFNBQUE7dUJBQ0gsTUFBQSxHQUFTLGFBQWEsQ0FBQyxhQUFkLENBQTRCLGlDQUE1QjtjQUROLENBQUw7WUFYUyxDQUFYO21CQWNBLEVBQUEsQ0FBRyxrREFBSCxFQUF1RCxTQUFBO0FBQ3JELGtCQUFBO2NBQUEsV0FBQSxHQUFjLE1BQU0sQ0FBQyxjQUFQLENBQUEsQ0FBdUIsQ0FBQyxNQUF4QixDQUErQixTQUFDLENBQUQ7dUJBQzNDLENBQUMsQ0FBQyxVQUFVLENBQUMsSUFBYixLQUFxQjtjQURzQixDQUEvQjtxQkFHZCxNQUFBLENBQU8sV0FBVyxDQUFDLE1BQW5CLENBQTBCLENBQUMsT0FBM0IsQ0FBbUMsRUFBbkM7WUFKcUQsQ0FBdkQ7VUFmc0MsQ0FBeEM7UUExRWdELENBQWxEO01BekkrQyxDQUFqRDtNQXdPQSxRQUFBLENBQVMsMENBQVQsRUFBcUQsU0FBQTtBQUNuRCxZQUFBO1FBQUEsT0FBa0IsRUFBbEIsRUFBQyxjQUFELEVBQU87UUFDUCxVQUFBLENBQVcsU0FBQTtVQUNULElBQUEsR0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWYsQ0FBQTtVQUNQLE9BQUEsR0FBVSxJQUFJLENBQUMsU0FBTCxDQUFlO1lBQUEsY0FBQSxFQUFnQixLQUFoQjtXQUFmO1VBQ1YsV0FBQSxHQUFjLE9BQU8sQ0FBQyxvQkFBUixDQUE2QixNQUE3QjtVQUNkLGtCQUFBLEdBQXFCLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBWCxDQUFtQixXQUFuQjtVQUVyQixNQUFBLENBQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFmLENBQUEsQ0FBeUIsQ0FBQyxNQUFqQyxDQUF3QyxDQUFDLE9BQXpDLENBQWlELENBQWpEO1VBRUEsSUFBSSxDQUFDLGNBQUwsQ0FBb0IsTUFBcEIsRUFBNEIsT0FBNUIsRUFBcUMsQ0FBckM7aUJBRUEsUUFBQSxDQUFTLFNBQUE7bUJBQ1Asa0JBQWtCLENBQUMsZ0JBQW5CLENBQW9DLG1DQUFwQyxDQUF3RSxDQUFDO1VBRGxFLENBQVQ7UUFWUyxDQUFYO2VBYUEsRUFBQSxDQUFHLGtEQUFILEVBQXVELFNBQUE7VUFDckQsTUFBQSxDQUFPLGtCQUFrQixDQUFDLGdCQUFuQixDQUFvQyx1QkFBcEMsQ0FBNEQsQ0FBQyxNQUFwRSxDQUEyRSxDQUFDLE9BQTVFLENBQW9GLENBQXBGO2lCQUNBLE1BQUEsQ0FBTyxrQkFBa0IsQ0FBQyxnQkFBbkIsQ0FBb0MsNkJBQXBDLENBQWtFLENBQUMsTUFBMUUsQ0FBaUYsQ0FBQyxPQUFsRixDQUEwRixDQUExRjtRQUZxRCxDQUF2RDtNQWZtRCxDQUFyRDtNQW1CQSxRQUFBLENBQVMsc0RBQVQsRUFBaUUsU0FBQTtBQUMvRCxZQUFBO1FBQUEsVUFBQSxHQUFhLFNBQUMsUUFBRDtVQUNYLGVBQUEsQ0FBZ0IsU0FBQTttQkFDZCxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsUUFBcEIsQ0FBNkIsQ0FBQyxJQUE5QixDQUFtQyxTQUFDLENBQUQ7Y0FDakMsTUFBQSxHQUFTO2NBQ1QsYUFBQSxHQUFnQixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIsTUFBbkI7Y0FDaEIsV0FBQSxHQUFjLE9BQU8sQ0FBQyxvQkFBUixDQUE2QixNQUE3QjtjQUNkLGtCQUFBLEdBQXFCLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBWCxDQUFtQixXQUFuQjtxQkFDckIsa0JBQWtCLENBQUMsTUFBbkIsQ0FBQTtZQUxpQyxDQUFuQztVQURjLENBQWhCO1VBUUEsZUFBQSxDQUFnQixTQUFBO21CQUFHLFdBQVcsQ0FBQyxVQUFaLENBQUE7VUFBSCxDQUFoQjtpQkFDQSxlQUFBLENBQWdCLFNBQUE7bUJBQUcsV0FBVyxDQUFDLGtCQUFaLENBQUE7VUFBSCxDQUFoQjtRQVZXO1FBWWIsVUFBQSxDQUFXLFNBQUE7VUFDVCxlQUFBLENBQWdCLFNBQUE7bUJBQ2QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFkLENBQThCLHdCQUE5QjtVQURjLENBQWhCO2lCQUVBLGVBQUEsQ0FBZ0IsU0FBQTttQkFDZCxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWQsQ0FBOEIsZUFBOUI7VUFEYyxDQUFoQjtRQUhTLENBQVg7UUFNQSxRQUFBLENBQVMsMkJBQVQsRUFBc0MsU0FBQTtVQUNwQyxVQUFBLENBQVcsU0FBQTttQkFDVCxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsNkJBQWhCLEVBQStDLENBQUMsR0FBRCxDQUEvQztVQURTLENBQVg7aUJBR0EsRUFBQSxDQUFHLHlCQUFILEVBQThCLFNBQUE7WUFDNUIsVUFBQSxDQUFXLHFCQUFYO1lBQ0EsSUFBQSxDQUFLLFNBQUE7cUJBQ0gsTUFBQSxDQUFPLGtCQUFrQixDQUFDLGdCQUFuQixDQUFvQyxtQ0FBcEMsQ0FBd0UsQ0FBQyxNQUFoRixDQUF1RixDQUFDLE9BQXhGLENBQWdHLENBQWhHO1lBREcsQ0FBTDtZQUdBLFVBQUEsQ0FBVyxtQ0FBWDttQkFDQSxJQUFBLENBQUssU0FBQTtxQkFDSCxNQUFBLENBQU8sa0JBQWtCLENBQUMsZ0JBQW5CLENBQW9DLG1DQUFwQyxDQUF3RSxDQUFDLE1BQWhGLENBQXVGLENBQUMsT0FBeEYsQ0FBZ0csRUFBaEc7WUFERyxDQUFMO1VBTjRCLENBQTlCO1FBSm9DLENBQXRDO1FBYUEsUUFBQSxDQUFTLGlCQUFULEVBQTRCLFNBQUE7VUFDMUIsVUFBQSxDQUFXLFNBQUE7bUJBQ1QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDZCQUFoQixFQUErQyxDQUFDLFFBQUQsQ0FBL0M7VUFEUyxDQUFYO2lCQUdBLEVBQUEsQ0FBRyxrQ0FBSCxFQUF1QyxTQUFBO1lBQ3JDLFVBQUEsQ0FBVyxxQkFBWDtZQUNBLElBQUEsQ0FBSyxTQUFBO3FCQUNILE1BQUEsQ0FBTyxrQkFBa0IsQ0FBQyxnQkFBbkIsQ0FBb0MsbUNBQXBDLENBQXdFLENBQUMsTUFBaEYsQ0FBdUYsQ0FBQyxPQUF4RixDQUFnRyxDQUFoRztZQURHLENBQUw7WUFHQSxVQUFBLENBQVcsbUNBQVg7bUJBQ0EsSUFBQSxDQUFLLFNBQUE7cUJBQ0gsTUFBQSxDQUFPLGtCQUFrQixDQUFDLGdCQUFuQixDQUFvQyxtQ0FBcEMsQ0FBd0UsQ0FBQyxNQUFoRixDQUF1RixDQUFDLE9BQXhGLENBQWdHLENBQWhHO1lBREcsQ0FBTDtVQU5xQyxDQUF2QztRQUowQixDQUE1QjtlQWFBLFFBQUEsQ0FBUyxxQkFBVCxFQUFnQyxTQUFBO1VBQzlCLFVBQUEsQ0FBVyxTQUFBO1lBQ1QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDZCQUFoQixFQUErQyxDQUFDLFFBQUQsQ0FBL0M7bUJBQ0EsT0FBTyxDQUFDLHFCQUFSLENBQThCLENBQUMsTUFBRCxDQUE5QjtVQUZTLENBQVg7VUFJQSxFQUFBLENBQUcsbUNBQUgsRUFBd0MsU0FBQTtZQUN0QyxVQUFBLENBQVcscUJBQVg7WUFDQSxJQUFBLENBQUssU0FBQTtxQkFDSCxNQUFBLENBQU8sa0JBQWtCLENBQUMsZ0JBQW5CLENBQW9DLG1DQUFwQyxDQUF3RSxDQUFDLE1BQWhGLENBQXVGLENBQUMsT0FBeEYsQ0FBZ0csQ0FBaEc7WUFERyxDQUFMO1lBR0EsVUFBQSxDQUFXLG1DQUFYO1lBQ0EsSUFBQSxDQUFLLFNBQUE7cUJBQ0gsTUFBQSxDQUFPLGtCQUFrQixDQUFDLGdCQUFuQixDQUFvQyxtQ0FBcEMsQ0FBd0UsQ0FBQyxNQUFoRixDQUF1RixDQUFDLE9BQXhGLENBQWdHLEVBQWhHO1lBREcsQ0FBTDtZQUdBLFVBQUEsQ0FBVyxxQkFBWDttQkFDQSxJQUFBLENBQUssU0FBQTtxQkFDSCxNQUFBLENBQU8sa0JBQWtCLENBQUMsZ0JBQW5CLENBQW9DLG1DQUFwQyxDQUF3RSxDQUFDLE1BQWhGLENBQXVGLENBQUMsT0FBeEYsQ0FBZ0csQ0FBaEc7WUFERyxDQUFMO1VBVnNDLENBQXhDO2lCQWFBLFFBQUEsQ0FBUyxnQ0FBVCxFQUEyQyxTQUFBO1lBQ3pDLFVBQUEsQ0FBVyxTQUFBO2NBQ1QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDZCQUFoQixFQUErQyxDQUFDLFFBQUQsQ0FBL0M7Y0FDQSxPQUFPLENBQUMsaUNBQVIsQ0FBMEMsSUFBMUM7cUJBQ0EsT0FBTyxDQUFDLHFCQUFSLENBQThCLENBQUMsTUFBRCxDQUE5QjtZQUhTLENBQVg7bUJBS0EsRUFBQSxDQUFHLG1DQUFILEVBQXdDLFNBQUE7Y0FDdEMsVUFBQSxDQUFXLHFCQUFYO2NBQ0EsSUFBQSxDQUFLLFNBQUE7dUJBQ0gsTUFBQSxDQUFPLGtCQUFrQixDQUFDLGdCQUFuQixDQUFvQyxtQ0FBcEMsQ0FBd0UsQ0FBQyxNQUFoRixDQUF1RixDQUFDLE9BQXhGLENBQWdHLENBQWhHO2NBREcsQ0FBTDtjQUdBLFVBQUEsQ0FBVyxtQ0FBWDtjQUNBLElBQUEsQ0FBSyxTQUFBO3VCQUNILE1BQUEsQ0FBTyxrQkFBa0IsQ0FBQyxnQkFBbkIsQ0FBb0MsbUNBQXBDLENBQXdFLENBQUMsTUFBaEYsQ0FBdUYsQ0FBQyxPQUF4RixDQUFnRyxFQUFoRztjQURHLENBQUw7Y0FHQSxVQUFBLENBQVcscUJBQVg7cUJBQ0EsSUFBQSxDQUFLLFNBQUE7dUJBQ0gsTUFBQSxDQUFPLGtCQUFrQixDQUFDLGdCQUFuQixDQUFvQyxtQ0FBcEMsQ0FBd0UsQ0FBQyxNQUFoRixDQUF1RixDQUFDLE9BQXhGLENBQWdHLENBQWhHO2NBREcsQ0FBTDtZQVZzQyxDQUF4QztVQU55QyxDQUEzQztRQWxCOEIsQ0FBaEM7TUE3QytELENBQWpFO01Ba0ZBLFFBQUEsQ0FBUyxpREFBVCxFQUE0RCxTQUFBO1FBQzFELFVBQUEsQ0FBVyxTQUFBO1VBQ1QsZUFBQSxDQUFnQixTQUFBO21CQUNkLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZCxDQUE4Qix3QkFBOUI7VUFEYyxDQUFoQjtVQUdBLGVBQUEsQ0FBZ0IsU0FBQTttQkFDZCxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IscUJBQXBCLENBQTBDLENBQUMsSUFBM0MsQ0FBZ0QsU0FBQyxDQUFEO2NBQzlDLE1BQUEsR0FBUztjQUNULGFBQUEsR0FBZ0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLE1BQW5CO2NBQ2hCLFdBQUEsR0FBYyxPQUFPLENBQUMsb0JBQVIsQ0FBNkIsTUFBN0I7Y0FDZCxrQkFBQSxHQUFxQixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIsV0FBbkI7cUJBQ3JCLGtCQUFrQixDQUFDLE1BQW5CLENBQUE7WUFMOEMsQ0FBaEQ7VUFEYyxDQUFoQjtpQkFRQSxlQUFBLENBQWdCLFNBQUE7bUJBQUcsV0FBVyxDQUFDLFVBQVosQ0FBQTtVQUFILENBQWhCO1FBWlMsQ0FBWDtRQWNBLFFBQUEsQ0FBUyxpQkFBVCxFQUE0QixTQUFBO1VBQzFCLFVBQUEsQ0FBVyxTQUFBO21CQUNULElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix3QkFBaEIsRUFBMEMsQ0FBQyxZQUFELENBQTFDO1VBRFMsQ0FBWDtpQkFHQSxFQUFBLENBQUcsb0RBQUgsRUFBeUQsU0FBQTttQkFDdkQsTUFBQSxDQUFPLGtCQUFrQixDQUFDLGdCQUFuQixDQUFvQyxtQ0FBcEMsQ0FBd0UsQ0FBQyxNQUFoRixDQUF1RixDQUFDLE9BQXhGLENBQWdHLENBQWhHO1VBRHVELENBQXpEO1FBSjBCLENBQTVCO1FBT0EsUUFBQSxDQUFTLGtCQUFULEVBQTZCLFNBQUE7VUFDM0IsVUFBQSxDQUFXLFNBQUE7bUJBQ1QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHdCQUFoQixFQUEwQyxDQUFDLFdBQUQsRUFBYyxZQUFkLENBQTFDO1VBRFMsQ0FBWDtpQkFHQSxFQUFBLENBQUcsb0RBQUgsRUFBeUQsU0FBQTttQkFDdkQsTUFBQSxDQUFPLGtCQUFrQixDQUFDLGdCQUFuQixDQUFvQyxtQ0FBcEMsQ0FBd0UsQ0FBQyxNQUFoRixDQUF1RixDQUFDLE9BQXhGLENBQWdHLENBQWhHO1VBRHVELENBQXpEO1FBSjJCLENBQTdCO1FBT0EsUUFBQSxDQUFTLHdCQUFULEVBQW1DLFNBQUE7VUFDakMsVUFBQSxDQUFXLFNBQUE7bUJBQ1QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHdCQUFoQixFQUEwQyxDQUFDLElBQUQsQ0FBMUM7VUFEUyxDQUFYO2lCQUdBLEVBQUEsQ0FBRyxvQkFBSCxFQUF5QixTQUFBO21CQUN2QixNQUFBLENBQU8sa0JBQWtCLENBQUMsZ0JBQW5CLENBQW9DLG1DQUFwQyxDQUF3RSxDQUFDLE1BQWhGLENBQXVGLENBQUMsT0FBeEYsQ0FBZ0csQ0FBaEc7VUFEdUIsQ0FBekI7UUFKaUMsQ0FBbkM7ZUFPQSxRQUFBLENBQVMsMkNBQVQsRUFBc0QsU0FBQTtVQUNwRCxVQUFBLENBQVcsU0FBQTtZQUNULElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix3QkFBaEIsRUFBMEMsQ0FBQyxXQUFELENBQTFDO21CQUNBLE9BQU8sQ0FBQyxnQkFBUixDQUF5QixDQUFDLFlBQUQsQ0FBekI7VUFGUyxDQUFYO2lCQUlBLEVBQUEsQ0FBRyxvREFBSCxFQUF5RCxTQUFBO21CQUN2RCxNQUFBLENBQU8sa0JBQWtCLENBQUMsZ0JBQW5CLENBQW9DLG1DQUFwQyxDQUF3RSxDQUFDLE1BQWhGLENBQXVGLENBQUMsT0FBeEYsQ0FBZ0csQ0FBaEc7VUFEdUQsQ0FBekQ7UUFMb0QsQ0FBdEQ7TUFwQzBELENBQTVEO2FBNENBLFFBQUEsQ0FBUyx5Q0FBVCxFQUFvRCxTQUFBO0FBQ2xELFlBQUE7UUFBQyxrQkFBbUI7UUFDcEIsVUFBQSxDQUFXLFNBQUE7VUFDVCxlQUFBLENBQWdCLFNBQUE7bUJBQUcsV0FBVyxDQUFDLGtCQUFaLENBQUE7VUFBSCxDQUFoQjtpQkFFQSxJQUFBLENBQUssU0FBQTtZQUNILGVBQUEsR0FBa0Isa0JBQWtCLENBQUMsZ0JBQW5CLENBQW9DLG1DQUFwQztZQUNsQixLQUFBLENBQU0sa0JBQU4sRUFBMEIsZUFBMUIsQ0FBMEMsQ0FBQyxjQUEzQyxDQUFBO21CQUNBLEtBQUEsQ0FBTSxrQkFBa0IsQ0FBQSxTQUF4QixFQUE0QixRQUE1QixDQUFxQyxDQUFDLGNBQXRDLENBQUE7VUFIRyxDQUFMO1FBSFMsQ0FBWDtRQVFBLFFBQUEsQ0FBUyxpQkFBVCxFQUE0QixTQUFBO1VBQzFCLFVBQUEsQ0FBVyxTQUFBO21CQUNULElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixpQkFBaEIsRUFBbUMsRUFBbkM7VUFEUyxDQUFYO2lCQUdBLEVBQUEsQ0FBRyxzREFBSCxFQUEyRCxTQUFBO0FBQ3pELGdCQUFBO1lBQUEsTUFBQSxDQUFPLGtCQUFrQixDQUFDLGFBQTFCLENBQXdDLENBQUMsZ0JBQXpDLENBQUE7QUFDQTtpQkFBQSxpREFBQTs7MkJBQ0UsTUFBQSxDQUFPLE1BQU0sQ0FBQyxNQUFkLENBQXFCLENBQUMsZ0JBQXRCLENBQUE7QUFERjs7VUFGeUQsQ0FBM0Q7UUFKMEIsQ0FBNUI7ZUFTQSxRQUFBLENBQVMsbUJBQVQsRUFBOEIsU0FBQTtVQUM1QixVQUFBLENBQVcsU0FBQTttQkFDVCxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsbUJBQWhCLEVBQXFDLEVBQXJDO1VBRFMsQ0FBWDtpQkFHQSxFQUFBLENBQUcsc0RBQUgsRUFBMkQsU0FBQTtBQUN6RCxnQkFBQTtZQUFBLE1BQUEsQ0FBTyxrQkFBa0IsQ0FBQyxhQUExQixDQUF3QyxDQUFDLGdCQUF6QyxDQUFBO0FBQ0E7aUJBQUEsaURBQUE7OzJCQUNFLE1BQUEsQ0FBTyxNQUFNLENBQUMsTUFBZCxDQUFxQixDQUFDLGdCQUF0QixDQUFBO0FBREY7O1VBRnlELENBQTNEO1FBSjRCLENBQTlCO01BbkJrRCxDQUFwRDtJQXZZbUMsQ0FBckM7RUFwRDZCLENBQS9CO0FBWEEiLCJzb3VyY2VzQ29udGVudCI6WyJwYXRoID0gcmVxdWlyZSAncGF0aCdcbnJlcXVpcmUgJy4vaGVscGVycy9zcGVjLWhlbHBlcidcbnttb3VzZWRvd259ID0gcmVxdWlyZSAnLi9oZWxwZXJzL2V2ZW50cydcblxuQ29sb3JCdWZmZXJFbGVtZW50ID0gcmVxdWlyZSAnLi4vbGliL2NvbG9yLWJ1ZmZlci1lbGVtZW50J1xuQ29sb3JNYXJrZXJFbGVtZW50ID0gcmVxdWlyZSAnLi4vbGliL2NvbG9yLW1hcmtlci1lbGVtZW50J1xuXG5zbGVlcCA9IChkdXJhdGlvbikgLT5cbiAgdCA9IG5ldyBEYXRlKClcbiAgd2FpdHNGb3IgLT4gbmV3IERhdGUoKSAtIHQgPiBkdXJhdGlvblxuXG5kZXNjcmliZSAnQ29sb3JCdWZmZXJFbGVtZW50JywgLT5cbiAgW2VkaXRvciwgZWRpdG9yRWxlbWVudCwgY29sb3JCdWZmZXIsIHBpZ21lbnRzLCBwcm9qZWN0LCBjb2xvckJ1ZmZlckVsZW1lbnQsIGphc21pbmVDb250ZW50XSA9IFtdXG5cbiAgaXNWaXNpYmxlID0gKG5vZGUpIC0+IG5vdCBub2RlLmNsYXNzTGlzdC5jb250YWlucygnaGlkZGVuJylcblxuICBlZGl0QnVmZmVyID0gKHRleHQsIG9wdGlvbnM9e30pIC0+XG4gICAgaWYgb3B0aW9ucy5zdGFydD9cbiAgICAgIGlmIG9wdGlvbnMuZW5kP1xuICAgICAgICByYW5nZSA9IFtvcHRpb25zLnN0YXJ0LCBvcHRpb25zLmVuZF1cbiAgICAgIGVsc2VcbiAgICAgICAgcmFuZ2UgPSBbb3B0aW9ucy5zdGFydCwgb3B0aW9ucy5zdGFydF1cblxuICAgICAgZWRpdG9yLnNldFNlbGVjdGVkQnVmZmVyUmFuZ2UocmFuZ2UpXG5cbiAgICBlZGl0b3IuaW5zZXJ0VGV4dCh0ZXh0KVxuICAgIGFkdmFuY2VDbG9jayg1MDApIHVubGVzcyBvcHRpb25zLm5vRXZlbnRcblxuICBqc29uRml4dHVyZSA9IChmaXh0dXJlLCBkYXRhKSAtPlxuICAgIGpzb25QYXRoID0gcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ2ZpeHR1cmVzJywgZml4dHVyZSlcbiAgICBqc29uID0gZnMucmVhZEZpbGVTeW5jKGpzb25QYXRoKS50b1N0cmluZygpXG4gICAganNvbiA9IGpzb24ucmVwbGFjZSAvI1xceyhcXHcrKVxcfS9nLCAobSx3KSAtPiBkYXRhW3ddXG5cbiAgICBKU09OLnBhcnNlKGpzb24pXG5cbiAgYmVmb3JlRWFjaCAtPlxuICAgIHdvcmtzcGFjZUVsZW1lbnQgPSBhdG9tLnZpZXdzLmdldFZpZXcoYXRvbS53b3Jrc3BhY2UpXG4gICAgamFzbWluZUNvbnRlbnQgPSBkb2N1bWVudC5ib2R5LnF1ZXJ5U2VsZWN0b3IoJyNqYXNtaW5lLWNvbnRlbnQnKVxuXG4gICAgamFzbWluZUNvbnRlbnQuYXBwZW5kQ2hpbGQod29ya3NwYWNlRWxlbWVudClcblxuICAgIGF0b20uY29uZmlnLnNldCAnZWRpdG9yLnNvZnRXcmFwJywgdHJ1ZVxuICAgIGF0b20uY29uZmlnLnNldCAnZWRpdG9yLnNvZnRXcmFwQXRQcmVmZXJyZWRMaW5lTGVuZ3RoJywgdHJ1ZVxuICAgIGF0b20uY29uZmlnLnNldCAnZWRpdG9yLnByZWZlcnJlZExpbmVMZW5ndGgnLCA0MFxuXG4gICAgYXRvbS5jb25maWcuc2V0ICdwaWdtZW50cy5kZWxheUJlZm9yZVNjYW4nLCAwXG4gICAgYXRvbS5jb25maWcuc2V0ICdwaWdtZW50cy5zb3VyY2VOYW1lcycsIFtcbiAgICAgICcqLnN0eWwnXG4gICAgICAnKi5sZXNzJ1xuICAgIF1cblxuICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgYXRvbS53b3Jrc3BhY2Uub3BlbignZm91ci12YXJpYWJsZXMuc3R5bCcpLnRoZW4gKG8pIC0+XG4gICAgICAgIGVkaXRvciA9IG9cbiAgICAgICAgZWRpdG9yRWxlbWVudCA9IGF0b20udmlld3MuZ2V0VmlldyhlZGl0b3IpXG5cbiAgICB3YWl0c0ZvclByb21pc2UgLT4gYXRvbS5wYWNrYWdlcy5hY3RpdmF0ZVBhY2thZ2UoJ3BpZ21lbnRzJykudGhlbiAocGtnKSAtPlxuICAgICAgcGlnbWVudHMgPSBwa2cubWFpbk1vZHVsZVxuICAgICAgcHJvamVjdCA9IHBpZ21lbnRzLmdldFByb2plY3QoKVxuXG4gIGFmdGVyRWFjaCAtPlxuICAgIGNvbG9yQnVmZmVyPy5kZXN0cm95KClcblxuICBkZXNjcmliZSAnd2hlbiBhbiBlZGl0b3IgaXMgb3BlbmVkJywgLT5cbiAgICBiZWZvcmVFYWNoIC0+XG4gICAgICBjb2xvckJ1ZmZlciA9IHByb2plY3QuY29sb3JCdWZmZXJGb3JFZGl0b3IoZWRpdG9yKVxuICAgICAgY29sb3JCdWZmZXJFbGVtZW50ID0gYXRvbS52aWV3cy5nZXRWaWV3KGNvbG9yQnVmZmVyKVxuICAgICAgY29sb3JCdWZmZXJFbGVtZW50LmF0dGFjaCgpXG5cbiAgICBpdCAnaXMgYXNzb2NpYXRlZCB0byB0aGUgQ29sb3JCdWZmZXIgbW9kZWwnLCAtPlxuICAgICAgZXhwZWN0KGNvbG9yQnVmZmVyRWxlbWVudCkudG9CZURlZmluZWQoKVxuICAgICAgZXhwZWN0KGNvbG9yQnVmZmVyRWxlbWVudC5nZXRNb2RlbCgpKS50b0JlKGNvbG9yQnVmZmVyKVxuXG4gICAgaXQgJ2F0dGFjaGVzIGl0c2VsZiBpbiB0aGUgdGFyZ2V0IHRleHQgZWRpdG9yIGVsZW1lbnQnLCAtPlxuICAgICAgZXhwZWN0KGNvbG9yQnVmZmVyRWxlbWVudC5wYXJlbnROb2RlKS50b0V4aXN0KClcbiAgICAgIGV4cGVjdChlZGl0b3JFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5saW5lcyBwaWdtZW50cy1tYXJrZXJzJykpLnRvRXhpc3QoKVxuXG4gICAgZGVzY3JpYmUgJ3doZW4gdGhlIGNvbG9yIGJ1ZmZlciBpcyBpbml0aWFsaXplZCcsIC0+XG4gICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPiBjb2xvckJ1ZmZlci5pbml0aWFsaXplKClcblxuICAgICAgaXQgJ2NyZWF0ZXMgbWFya2VycyB2aWV3cyBmb3IgZXZlcnkgdmlzaWJsZSBidWZmZXIgbWFya2VyJywgLT5cbiAgICAgICAgbWFya2Vyc0VsZW1lbnRzID0gY29sb3JCdWZmZXJFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ3BpZ21lbnRzLWNvbG9yLW1hcmtlcicpXG5cbiAgICAgICAgZXhwZWN0KG1hcmtlcnNFbGVtZW50cy5sZW5ndGgpLnRvRXF1YWwoMylcblxuICAgICAgICBmb3IgbWFya2VyIGluIG1hcmtlcnNFbGVtZW50c1xuICAgICAgICAgIGV4cGVjdChtYXJrZXIuZ2V0TW9kZWwoKSkudG9CZURlZmluZWQoKVxuXG4gICAgICBkZXNjcmliZSAnd2hlbiB0aGUgcHJvamVjdCB2YXJpYWJsZXMgYXJlIGluaXRpYWxpemVkJywgLT5cbiAgICAgICAgaXQgJ2NyZWF0ZXMgbWFya2VycyBmb3IgdGhlIG5ldyB2YWxpZCBjb2xvcnMnLCAtPlxuICAgICAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPiBjb2xvckJ1ZmZlci52YXJpYWJsZXNBdmFpbGFibGUoKVxuICAgICAgICAgIHJ1bnMgLT5cbiAgICAgICAgICAgIGV4cGVjdChjb2xvckJ1ZmZlckVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgncGlnbWVudHMtY29sb3ItbWFya2VyJykubGVuZ3RoKS50b0VxdWFsKDQpXG5cbiAgICAgIGRlc2NyaWJlICd3aGVuIGEgc2VsZWN0aW9uIGludGVyc2VjdHMgYSBtYXJrZXIgcmFuZ2UnLCAtPlxuICAgICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgICAgc3B5T24oY29sb3JCdWZmZXJFbGVtZW50LCAndXBkYXRlU2VsZWN0aW9ucycpLmFuZENhbGxUaHJvdWdoKClcblxuICAgICAgICBkZXNjcmliZSAnYWZ0ZXIgdGhlIG1hcmtlcnMgdmlld3Mgd2FzIGNyZWF0ZWQnLCAtPlxuICAgICAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPiBjb2xvckJ1ZmZlci52YXJpYWJsZXNBdmFpbGFibGUoKVxuICAgICAgICAgICAgcnVucyAtPiBlZGl0b3Iuc2V0U2VsZWN0ZWRCdWZmZXJSYW5nZSBbWzIsMTJdLFsyLCAxNF1dXG4gICAgICAgICAgICB3YWl0c0ZvciAtPiBjb2xvckJ1ZmZlckVsZW1lbnQudXBkYXRlU2VsZWN0aW9ucy5jYWxsQ291bnQgPiAwXG5cbiAgICAgICAgICBpdCAnaGlkZXMgdGhlIGludGVyc2VjdGVkIG1hcmtlcicsIC0+XG4gICAgICAgICAgICBtYXJrZXJzID0gY29sb3JCdWZmZXJFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ3BpZ21lbnRzLWNvbG9yLW1hcmtlcicpXG5cbiAgICAgICAgICAgIGV4cGVjdChpc1Zpc2libGUobWFya2Vyc1swXSkpLnRvQmVUcnV0aHkoKVxuICAgICAgICAgICAgZXhwZWN0KGlzVmlzaWJsZShtYXJrZXJzWzFdKSkudG9CZVRydXRoeSgpXG4gICAgICAgICAgICBleHBlY3QoaXNWaXNpYmxlKG1hcmtlcnNbMl0pKS50b0JlVHJ1dGh5KClcbiAgICAgICAgICAgIGV4cGVjdChpc1Zpc2libGUobWFya2Vyc1szXSkpLnRvQmVGYWxzeSgpXG5cbiAgICAgICAgZGVzY3JpYmUgJ2JlZm9yZSBhbGwgdGhlIG1hcmtlcnMgdmlld3Mgd2FzIGNyZWF0ZWQnLCAtPlxuICAgICAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgICAgIHJ1bnMgLT4gZWRpdG9yLnNldFNlbGVjdGVkQnVmZmVyUmFuZ2UgW1swLDBdLFsyLCAxNF1dXG4gICAgICAgICAgICB3YWl0c0ZvciAtPiBjb2xvckJ1ZmZlckVsZW1lbnQudXBkYXRlU2VsZWN0aW9ucy5jYWxsQ291bnQgPiAwXG5cbiAgICAgICAgICBpdCAnaGlkZXMgdGhlIGV4aXN0aW5nIG1hcmtlcnMnLCAtPlxuICAgICAgICAgICAgbWFya2VycyA9IGNvbG9yQnVmZmVyRWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCdwaWdtZW50cy1jb2xvci1tYXJrZXInKVxuXG4gICAgICAgICAgICBleHBlY3QoaXNWaXNpYmxlKG1hcmtlcnNbMF0pKS50b0JlRmFsc3koKVxuICAgICAgICAgICAgZXhwZWN0KGlzVmlzaWJsZShtYXJrZXJzWzFdKSkudG9CZVRydXRoeSgpXG4gICAgICAgICAgICBleHBlY3QoaXNWaXNpYmxlKG1hcmtlcnNbMl0pKS50b0JlVHJ1dGh5KClcblxuICAgICAgICAgIGRlc2NyaWJlICdhbmQgdGhlIG1hcmtlcnMgYXJlIHVwZGF0ZWQnLCAtPlxuICAgICAgICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICAgICAgICB3YWl0c0ZvclByb21pc2UgJ2NvbG9ycyBhdmFpbGFibGUnLCAtPlxuICAgICAgICAgICAgICAgIGNvbG9yQnVmZmVyLnZhcmlhYmxlc0F2YWlsYWJsZSgpXG4gICAgICAgICAgICAgIHdhaXRzRm9yICdsYXN0IG1hcmtlciB2aXNpYmxlJywgLT5cbiAgICAgICAgICAgICAgICBtYXJrZXJzID0gY29sb3JCdWZmZXJFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ3BpZ21lbnRzLWNvbG9yLW1hcmtlcicpXG4gICAgICAgICAgICAgICAgaXNWaXNpYmxlKG1hcmtlcnNbM10pXG5cbiAgICAgICAgICAgIGl0ICdoaWRlcyB0aGUgY3JlYXRlZCBtYXJrZXJzJywgLT5cbiAgICAgICAgICAgICAgbWFya2VycyA9IGNvbG9yQnVmZmVyRWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCdwaWdtZW50cy1jb2xvci1tYXJrZXInKVxuICAgICAgICAgICAgICBleHBlY3QoaXNWaXNpYmxlKG1hcmtlcnNbMF0pKS50b0JlRmFsc3koKVxuICAgICAgICAgICAgICBleHBlY3QoaXNWaXNpYmxlKG1hcmtlcnNbMV0pKS50b0JlVHJ1dGh5KClcbiAgICAgICAgICAgICAgZXhwZWN0KGlzVmlzaWJsZShtYXJrZXJzWzJdKSkudG9CZVRydXRoeSgpXG4gICAgICAgICAgICAgIGV4cGVjdChpc1Zpc2libGUobWFya2Vyc1szXSkpLnRvQmVUcnV0aHkoKVxuXG4gICAgICBkZXNjcmliZSAnd2hlbiBhIGxpbmUgaXMgZWRpdGVkIGFuZCBnZXRzIHdyYXBwZWQnLCAtPlxuICAgICAgICBtYXJrZXIgPSBudWxsXG4gICAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgICB3YWl0c0ZvclByb21pc2UgLT4gY29sb3JCdWZmZXIudmFyaWFibGVzQXZhaWxhYmxlKClcblxuICAgICAgICAgIHJ1bnMgLT5cbiAgICAgICAgICAgIG1hcmtlciA9IGNvbG9yQnVmZmVyRWxlbWVudC51c2VkTWFya2Vyc1tjb2xvckJ1ZmZlckVsZW1lbnQudXNlZE1hcmtlcnMubGVuZ3RoLTFdXG4gICAgICAgICAgICBzcHlPbihtYXJrZXIsICdyZW5kZXInKS5hbmRDYWxsVGhyb3VnaCgpXG5cbiAgICAgICAgICAgIGVkaXRCdWZmZXIgbmV3IEFycmF5KDIwKS5qb2luKFwiZm9vIFwiKSwgc3RhcnQ6IFsxLDBdLCBlbmQ6IFsxLDBdXG5cbiAgICAgICAgICB3YWl0c0ZvciAtPlxuICAgICAgICAgICAgbWFya2VyLnJlbmRlci5jYWxsQ291bnQgPiAwXG5cbiAgICAgICAgaXQgJ3VwZGF0ZXMgdGhlIG1hcmtlcnMgd2hvc2Ugc2NyZWVuIHJhbmdlIGhhdmUgY2hhbmdlZCcsIC0+XG4gICAgICAgICAgZXhwZWN0KG1hcmtlci5yZW5kZXIpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuXG4gICAgICBkZXNjcmliZSAnd2hlbiBzb21lIG1hcmtlcnMgYXJlIGRlc3Ryb3llZCcsIC0+XG4gICAgICAgIFtzcHldID0gW11cbiAgICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICAgIGZvciBlbCBpbiBjb2xvckJ1ZmZlckVsZW1lbnQudXNlZE1hcmtlcnNcbiAgICAgICAgICAgIHNweU9uKGVsLCAncmVsZWFzZScpLmFuZENhbGxUaHJvdWdoKClcblxuICAgICAgICAgIHNweSA9IGphc21pbmUuY3JlYXRlU3B5KCdkaWQtdXBkYXRlJylcbiAgICAgICAgICBjb2xvckJ1ZmZlckVsZW1lbnQub25EaWRVcGRhdGUoc3B5KVxuICAgICAgICAgIGVkaXRCdWZmZXIgJycsIHN0YXJ0OiBbNCwwXSwgZW5kOiBbOCwwXVxuICAgICAgICAgIHdhaXRzRm9yIC0+IHNweS5jYWxsQ291bnQgPiAwXG5cbiAgICAgICAgaXQgJ3JlbGVhc2VzIHRoZSB1bnVzZWQgbWFya2VycycsIC0+XG4gICAgICAgICAgZXhwZWN0KGNvbG9yQnVmZmVyRWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCdwaWdtZW50cy1jb2xvci1tYXJrZXInKS5sZW5ndGgpLnRvRXF1YWwoMylcbiAgICAgICAgICBleHBlY3QoY29sb3JCdWZmZXJFbGVtZW50LnVzZWRNYXJrZXJzLmxlbmd0aCkudG9FcXVhbCgyKVxuICAgICAgICAgIGV4cGVjdChjb2xvckJ1ZmZlckVsZW1lbnQudW51c2VkTWFya2Vycy5sZW5ndGgpLnRvRXF1YWwoMSlcblxuICAgICAgICAgIGZvciBtYXJrZXIgaW4gY29sb3JCdWZmZXJFbGVtZW50LnVudXNlZE1hcmtlcnNcbiAgICAgICAgICAgIGV4cGVjdChtYXJrZXIucmVsZWFzZSkudG9IYXZlQmVlbkNhbGxlZCgpXG5cbiAgICAgICAgZGVzY3JpYmUgJ2FuZCB0aGVuIGEgbmV3IG1hcmtlciBpcyBjcmVhdGVkJywgLT5cbiAgICAgICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgICAgICBlZGl0b3IubW92ZVRvQm90dG9tKClcbiAgICAgICAgICAgIGVkaXRCdWZmZXIgJ1xcbmZvbyA9ICMxMjM0NTZcXG4nXG4gICAgICAgICAgICB3YWl0c0ZvciAtPiBjb2xvckJ1ZmZlckVsZW1lbnQudW51c2VkTWFya2Vycy5sZW5ndGggaXMgMFxuXG4gICAgICAgICAgaXQgJ3JldXNlcyB0aGUgcHJldmlvdXNseSByZWxlYXNlZCBtYXJrZXIgZWxlbWVudCcsIC0+XG4gICAgICAgICAgICBleHBlY3QoY29sb3JCdWZmZXJFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ3BpZ21lbnRzLWNvbG9yLW1hcmtlcicpLmxlbmd0aCkudG9FcXVhbCgzKVxuICAgICAgICAgICAgZXhwZWN0KGNvbG9yQnVmZmVyRWxlbWVudC51c2VkTWFya2Vycy5sZW5ndGgpLnRvRXF1YWwoMylcbiAgICAgICAgICAgIGV4cGVjdChjb2xvckJ1ZmZlckVsZW1lbnQudW51c2VkTWFya2Vycy5sZW5ndGgpLnRvRXF1YWwoMClcblxuICAgICAgZGVzY3JpYmUgJ3doZW4gdGhlIGN1cnJlbnQgcGFuZSBpcyBzcGxpdHRlZCB0byB0aGUgcmlnaHQnLCAtPlxuICAgICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgICAgdmVyc2lvbiA9IHBhcnNlRmxvYXQoYXRvbS5nZXRWZXJzaW9uKCkuc3BsaXQoJy4nKS5zbGljZSgxLDIpLmpvaW4oJy4nKSlcbiAgICAgICAgICBpZiB2ZXJzaW9uID4gNVxuICAgICAgICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaChlZGl0b3JFbGVtZW50LCAncGFuZTpzcGxpdC1yaWdodC1hbmQtY29weS1hY3RpdmUtaXRlbScpXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaChlZGl0b3JFbGVtZW50LCAncGFuZTpzcGxpdC1yaWdodCcpXG5cbiAgICAgICAgICB3YWl0c0ZvciAndGV4dCBlZGl0b3InLCAtPlxuICAgICAgICAgICAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0VGV4dEVkaXRvcnMoKVsxXVxuXG4gICAgICAgICAgd2FpdHNGb3IgJ2NvbG9yIGJ1ZmZlciBlbGVtZW50JywgLT5cbiAgICAgICAgICAgIGNvbG9yQnVmZmVyRWxlbWVudCA9IGF0b20udmlld3MuZ2V0Vmlldyhwcm9qZWN0LmNvbG9yQnVmZmVyRm9yRWRpdG9yKGVkaXRvcikpXG4gICAgICAgICAgd2FpdHNGb3IgJ2NvbG9yIGJ1ZmZlciBlbGVtZW50IG1hcmtlcnMnLCAtPlxuICAgICAgICAgICAgY29sb3JCdWZmZXJFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ3BpZ21lbnRzLWNvbG9yLW1hcmtlcicpLmxlbmd0aFxuXG4gICAgICAgIGl0ICdzaG91bGQga2VlcCBhbGwgdGhlIGJ1ZmZlciBlbGVtZW50cyBhdHRhY2hlZCcsIC0+XG4gICAgICAgICAgZWRpdG9ycyA9IGF0b20ud29ya3NwYWNlLmdldFRleHRFZGl0b3JzKClcblxuICAgICAgICAgIGVkaXRvcnMuZm9yRWFjaCAoZWRpdG9yKSAtPlxuICAgICAgICAgICAgZWRpdG9yRWxlbWVudCA9IGF0b20udmlld3MuZ2V0VmlldyhlZGl0b3IpXG4gICAgICAgICAgICBjb2xvckJ1ZmZlckVsZW1lbnQgPSBlZGl0b3JFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ3BpZ21lbnRzLW1hcmtlcnMnKVxuICAgICAgICAgICAgZXhwZWN0KGNvbG9yQnVmZmVyRWxlbWVudCkudG9FeGlzdCgpXG5cbiAgICAgICAgICAgIGV4cGVjdChjb2xvckJ1ZmZlckVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgncGlnbWVudHMtY29sb3ItbWFya2VyJykubGVuZ3RoKS50b0VxdWFsKDMpXG4gICAgICAgICAgICBleHBlY3QoY29sb3JCdWZmZXJFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ3BpZ21lbnRzLWNvbG9yLW1hcmtlcjplbXB0eScpLmxlbmd0aCkudG9FcXVhbCgwKVxuXG4gICAgICBkZXNjcmliZSAnd2hlbiB0aGUgbWFya2VyIHR5cGUgaXMgc2V0IHRvIGd1dHRlcicsIC0+XG4gICAgICAgIFtndXR0ZXJdID0gW11cblxuICAgICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgICAgd2FpdHNGb3JQcm9taXNlIC0+IGNvbG9yQnVmZmVyLmluaXRpYWxpemUoKVxuICAgICAgICAgIHJ1bnMgLT5cbiAgICAgICAgICAgIGF0b20uY29uZmlnLnNldCAncGlnbWVudHMubWFya2VyVHlwZScsICdndXR0ZXInXG4gICAgICAgICAgICBndXR0ZXIgPSBlZGl0b3JFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tndXR0ZXItbmFtZT1cInBpZ21lbnRzLWd1dHRlclwiXScpXG5cbiAgICAgICAgaXQgJ3JlbW92ZXMgdGhlIG1hcmtlcnMnLCAtPlxuICAgICAgICAgIGV4cGVjdChjb2xvckJ1ZmZlckVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgncGlnbWVudHMtY29sb3ItbWFya2VyJykubGVuZ3RoKS50b0VxdWFsKDApXG5cbiAgICAgICAgaXQgJ2FkZHMgYSBjdXN0b20gZ3V0dGVyIHRvIHRoZSB0ZXh0IGVkaXRvcicsIC0+XG4gICAgICAgICAgZXhwZWN0KGd1dHRlcikudG9FeGlzdCgpXG5cbiAgICAgICAgaXQgJ3NldHMgdGhlIHNpemUgb2YgdGhlIGd1dHRlciBiYXNlZCBvbiB0aGUgbnVtYmVyIG9mIG1hcmtlcnMgaW4gdGhlIHNhbWUgcm93JywgLT5cbiAgICAgICAgICBleHBlY3QoZ3V0dGVyLnN0eWxlLm1pbldpZHRoKS50b0VxdWFsKCcxNHB4JylcblxuICAgICAgICBpdCAnYWRkcyBhIGd1dHRlciBkZWNvcmF0aW9uIGZvciBlYWNoIGNvbG9yIG1hcmtlcicsIC0+XG4gICAgICAgICAgZGVjb3JhdGlvbnMgPSBlZGl0b3IuZ2V0RGVjb3JhdGlvbnMoKS5maWx0ZXIgKGQpIC0+XG4gICAgICAgICAgICBkLnByb3BlcnRpZXMudHlwZSBpcyAnZ3V0dGVyJ1xuICAgICAgICAgIGV4cGVjdChkZWNvcmF0aW9ucy5sZW5ndGgpLnRvRXF1YWwoMylcblxuICAgICAgICBkZXNjcmliZSAnd2hlbiB0aGUgdmFyaWFibGVzIGJlY29tZSBhdmFpbGFibGUnLCAtPlxuICAgICAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPiBjb2xvckJ1ZmZlci52YXJpYWJsZXNBdmFpbGFibGUoKVxuXG4gICAgICAgICAgaXQgJ2NyZWF0ZXMgZGVjb3JhdGlvbnMgZm9yIHRoZSBuZXcgdmFsaWQgY29sb3JzJywgLT5cbiAgICAgICAgICAgIGRlY29yYXRpb25zID0gZWRpdG9yLmdldERlY29yYXRpb25zKCkuZmlsdGVyIChkKSAtPlxuICAgICAgICAgICAgICBkLnByb3BlcnRpZXMudHlwZSBpcyAnZ3V0dGVyJ1xuICAgICAgICAgICAgZXhwZWN0KGRlY29yYXRpb25zLmxlbmd0aCkudG9FcXVhbCg0KVxuXG4gICAgICAgICAgZGVzY3JpYmUgJ3doZW4gbWFueSBtYXJrZXJzIGFyZSBhZGRlZCBvbiB0aGUgc2FtZSBsaW5lJywgLT5cbiAgICAgICAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgICAgICAgdXBkYXRlU3B5ID0gamFzbWluZS5jcmVhdGVTcHkoJ2RpZC11cGRhdGUnKVxuICAgICAgICAgICAgICBjb2xvckJ1ZmZlckVsZW1lbnQub25EaWRVcGRhdGUodXBkYXRlU3B5KVxuXG4gICAgICAgICAgICAgIGVkaXRvci5tb3ZlVG9Cb3R0b20oKVxuICAgICAgICAgICAgICBlZGl0QnVmZmVyICdcXG5saXN0ID0gIzEyMzQ1NiwgIzk4NzY1NCwgI2FiY2RlZlxcbidcbiAgICAgICAgICAgICAgd2FpdHNGb3IgLT4gdXBkYXRlU3B5LmNhbGxDb3VudCA+IDBcblxuICAgICAgICAgICAgaXQgJ2FkZHMgdGhlIG5ldyBkZWNvcmF0aW9ucyB0byB0aGUgZ3V0dGVyJywgLT5cbiAgICAgICAgICAgICAgZGVjb3JhdGlvbnMgPSBlZGl0b3IuZ2V0RGVjb3JhdGlvbnMoKS5maWx0ZXIgKGQpIC0+XG4gICAgICAgICAgICAgICAgZC5wcm9wZXJ0aWVzLnR5cGUgaXMgJ2d1dHRlcidcblxuICAgICAgICAgICAgICBleHBlY3QoZGVjb3JhdGlvbnMubGVuZ3RoKS50b0VxdWFsKDcpXG5cbiAgICAgICAgICAgIGl0ICdzZXRzIHRoZSBzaXplIG9mIHRoZSBndXR0ZXIgYmFzZWQgb24gdGhlIG51bWJlciBvZiBtYXJrZXJzIGluIHRoZSBzYW1lIHJvdycsIC0+XG4gICAgICAgICAgICAgIGV4cGVjdChndXR0ZXIuc3R5bGUubWluV2lkdGgpLnRvRXF1YWwoJzQycHgnKVxuXG4gICAgICAgICAgICBkZXNjcmliZSAnY2xpY2tpbmcgb24gYSBndXR0ZXIgZGVjb3JhdGlvbicsIC0+XG4gICAgICAgICAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgICAgICAgICBwcm9qZWN0LmNvbG9yUGlja2VyQVBJID1cbiAgICAgICAgICAgICAgICAgIG9wZW46IGphc21pbmUuY3JlYXRlU3B5KCdjb2xvci1waWNrZXIub3BlbicpXG5cbiAgICAgICAgICAgICAgICBkZWNvcmF0aW9uID0gZWRpdG9yRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcucGlnbWVudHMtZ3V0dGVyLW1hcmtlciBzcGFuJylcbiAgICAgICAgICAgICAgICBtb3VzZWRvd24oZGVjb3JhdGlvbilcblxuICAgICAgICAgICAgICBpdCAnc2VsZWN0cyB0aGUgdGV4dCBpbiB0aGUgZWRpdG9yJywgLT5cbiAgICAgICAgICAgICAgICBleHBlY3QoZWRpdG9yLmdldFNlbGVjdGVkU2NyZWVuUmFuZ2UoKSkudG9FcXVhbChbWzAsMTNdLFswLDE3XV0pXG5cbiAgICAgICAgICAgICAgaXQgJ29wZW5zIHRoZSBjb2xvciBwaWNrZXInLCAtPlxuICAgICAgICAgICAgICAgIGV4cGVjdChwcm9qZWN0LmNvbG9yUGlja2VyQVBJLm9wZW4pLnRvSGF2ZUJlZW5DYWxsZWQoKVxuXG4gICAgICAgIGRlc2NyaWJlICd3aGVuIHRoZSBtYXJrZXIgaXMgY2hhbmdlZCBhZ2FpbicsIC0+XG4gICAgICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICAgICAgYXRvbS5jb25maWcuc2V0ICdwaWdtZW50cy5tYXJrZXJUeXBlJywgJ2JhY2tncm91bmQnXG5cbiAgICAgICAgICBpdCAncmVtb3ZlcyB0aGUgZ3V0dGVyJywgLT5cbiAgICAgICAgICAgIGV4cGVjdChlZGl0b3JFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tndXR0ZXItbmFtZT1cInBpZ21lbnRzLWd1dHRlclwiXScpKS5ub3QudG9FeGlzdCgpXG5cbiAgICAgICAgICBpdCAncmVjcmVhdGVzIHRoZSBtYXJrZXJzJywgLT5cbiAgICAgICAgICAgIGV4cGVjdChjb2xvckJ1ZmZlckVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgncGlnbWVudHMtY29sb3ItbWFya2VyJykubGVuZ3RoKS50b0VxdWFsKDMpXG5cbiAgICAgICAgZGVzY3JpYmUgJ3doZW4gYSBuZXcgYnVmZmVyIGlzIG9wZW5lZCcsIC0+XG4gICAgICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICAgICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICAgICAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4oJ3Byb2plY3Qvc3R5bGVzL3ZhcmlhYmxlcy5zdHlsJykudGhlbiAoZSkgLT5cbiAgICAgICAgICAgICAgICBlZGl0b3IgPSBlXG4gICAgICAgICAgICAgICAgZWRpdG9yRWxlbWVudCA9IGF0b20udmlld3MuZ2V0VmlldyhlZGl0b3IpXG4gICAgICAgICAgICAgICAgY29sb3JCdWZmZXIgPSBwcm9qZWN0LmNvbG9yQnVmZmVyRm9yRWRpdG9yKGVkaXRvcilcbiAgICAgICAgICAgICAgICBjb2xvckJ1ZmZlckVsZW1lbnQgPSBhdG9tLnZpZXdzLmdldFZpZXcoY29sb3JCdWZmZXIpXG5cbiAgICAgICAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPiBjb2xvckJ1ZmZlci5pbml0aWFsaXplKClcbiAgICAgICAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPiBjb2xvckJ1ZmZlci52YXJpYWJsZXNBdmFpbGFibGUoKVxuXG4gICAgICAgICAgICBydW5zIC0+XG4gICAgICAgICAgICAgIGd1dHRlciA9IGVkaXRvckVsZW1lbnQucXVlcnlTZWxlY3RvcignW2d1dHRlci1uYW1lPVwicGlnbWVudHMtZ3V0dGVyXCJdJylcblxuICAgICAgICAgIGl0ICdjcmVhdGVzIHRoZSBkZWNvcmF0aW9ucyBpbiB0aGUgbmV3IGJ1ZmZlciBndXR0ZXInLCAtPlxuICAgICAgICAgICAgZGVjb3JhdGlvbnMgPSBlZGl0b3IuZ2V0RGVjb3JhdGlvbnMoKS5maWx0ZXIgKGQpIC0+XG4gICAgICAgICAgICAgIGQucHJvcGVydGllcy50eXBlIGlzICdndXR0ZXInXG5cbiAgICAgICAgICAgIGV4cGVjdChkZWNvcmF0aW9ucy5sZW5ndGgpLnRvRXF1YWwoMTApXG5cbiAgICBkZXNjcmliZSAnd2hlbiB0aGUgZWRpdG9yIGlzIG1vdmVkIHRvIGFub3RoZXIgcGFuZScsIC0+XG4gICAgICBbcGFuZSwgbmV3UGFuZV0gPSBbXVxuICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICBwYW5lID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZSgpXG4gICAgICAgIG5ld1BhbmUgPSBwYW5lLnNwbGl0RG93bihjb3B5QWN0aXZlSXRlbTogZmFsc2UpXG4gICAgICAgIGNvbG9yQnVmZmVyID0gcHJvamVjdC5jb2xvckJ1ZmZlckZvckVkaXRvcihlZGl0b3IpXG4gICAgICAgIGNvbG9yQnVmZmVyRWxlbWVudCA9IGF0b20udmlld3MuZ2V0Vmlldyhjb2xvckJ1ZmZlcilcblxuICAgICAgICBleHBlY3QoYXRvbS53b3Jrc3BhY2UuZ2V0UGFuZXMoKS5sZW5ndGgpLnRvRXF1YWwoMilcblxuICAgICAgICBwYW5lLm1vdmVJdGVtVG9QYW5lKGVkaXRvciwgbmV3UGFuZSwgMClcblxuICAgICAgICB3YWl0c0ZvciAtPlxuICAgICAgICAgIGNvbG9yQnVmZmVyRWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCdwaWdtZW50cy1jb2xvci1tYXJrZXI6bm90KDplbXB0eSknKS5sZW5ndGhcblxuICAgICAgaXQgJ21vdmVzIHRoZSBlZGl0b3Igd2l0aCB0aGUgYnVmZmVyIHRvIHRoZSBuZXcgcGFuZScsIC0+XG4gICAgICAgIGV4cGVjdChjb2xvckJ1ZmZlckVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgncGlnbWVudHMtY29sb3ItbWFya2VyJykubGVuZ3RoKS50b0VxdWFsKDMpXG4gICAgICAgIGV4cGVjdChjb2xvckJ1ZmZlckVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgncGlnbWVudHMtY29sb3ItbWFya2VyOmVtcHR5JykubGVuZ3RoKS50b0VxdWFsKDApXG5cbiAgICBkZXNjcmliZSAnd2hlbiBwaWdtZW50cy5zdXBwb3J0ZWRGaWxldHlwZXMgc2V0dGluZ3MgaXMgZGVmaW5lZCcsIC0+XG4gICAgICBsb2FkQnVmZmVyID0gKGZpbGVQYXRoKSAtPlxuICAgICAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgICAgICBhdG9tLndvcmtzcGFjZS5vcGVuKGZpbGVQYXRoKS50aGVuIChvKSAtPlxuICAgICAgICAgICAgZWRpdG9yID0gb1xuICAgICAgICAgICAgZWRpdG9yRWxlbWVudCA9IGF0b20udmlld3MuZ2V0VmlldyhlZGl0b3IpXG4gICAgICAgICAgICBjb2xvckJ1ZmZlciA9IHByb2plY3QuY29sb3JCdWZmZXJGb3JFZGl0b3IoZWRpdG9yKVxuICAgICAgICAgICAgY29sb3JCdWZmZXJFbGVtZW50ID0gYXRvbS52aWV3cy5nZXRWaWV3KGNvbG9yQnVmZmVyKVxuICAgICAgICAgICAgY29sb3JCdWZmZXJFbGVtZW50LmF0dGFjaCgpXG5cbiAgICAgICAgd2FpdHNGb3JQcm9taXNlIC0+IGNvbG9yQnVmZmVyLmluaXRpYWxpemUoKVxuICAgICAgICB3YWl0c0ZvclByb21pc2UgLT4gY29sb3JCdWZmZXIudmFyaWFibGVzQXZhaWxhYmxlKClcblxuICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgICAgICBhdG9tLnBhY2thZ2VzLmFjdGl2YXRlUGFja2FnZSgnbGFuZ3VhZ2UtY29mZmVlLXNjcmlwdCcpXG4gICAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgICAgIGF0b20ucGFja2FnZXMuYWN0aXZhdGVQYWNrYWdlKCdsYW5ndWFnZS1sZXNzJylcblxuICAgICAgZGVzY3JpYmUgJ3dpdGggdGhlIGRlZmF1bHQgd2lsZGNhcmQnLCAtPlxuICAgICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgICAgYXRvbS5jb25maWcuc2V0ICdwaWdtZW50cy5zdXBwb3J0ZWRGaWxldHlwZXMnLCBbJyonXVxuXG4gICAgICAgIGl0ICdzdXBwb3J0cyBldmVyeSBmaWxldHlwZScsIC0+XG4gICAgICAgICAgbG9hZEJ1ZmZlcignc2NvcGUtZmlsdGVyLmNvZmZlZScpXG4gICAgICAgICAgcnVucyAtPlxuICAgICAgICAgICAgZXhwZWN0KGNvbG9yQnVmZmVyRWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCdwaWdtZW50cy1jb2xvci1tYXJrZXI6bm90KDplbXB0eSknKS5sZW5ndGgpLnRvRXF1YWwoMilcblxuICAgICAgICAgIGxvYWRCdWZmZXIoJ3Byb2plY3QvdmVuZG9yL2Nzcy92YXJpYWJsZXMubGVzcycpXG4gICAgICAgICAgcnVucyAtPlxuICAgICAgICAgICAgZXhwZWN0KGNvbG9yQnVmZmVyRWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCdwaWdtZW50cy1jb2xvci1tYXJrZXI6bm90KDplbXB0eSknKS5sZW5ndGgpLnRvRXF1YWwoMjApXG5cbiAgICAgIGRlc2NyaWJlICd3aXRoIGEgZmlsZXR5cGUnLCAtPlxuICAgICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgICAgYXRvbS5jb25maWcuc2V0ICdwaWdtZW50cy5zdXBwb3J0ZWRGaWxldHlwZXMnLCBbJ2NvZmZlZSddXG5cbiAgICAgICAgaXQgJ3N1cHBvcnRzIHRoZSBzcGVjaWZpZWQgZmlsZSB0eXBlJywgLT5cbiAgICAgICAgICBsb2FkQnVmZmVyKCdzY29wZS1maWx0ZXIuY29mZmVlJylcbiAgICAgICAgICBydW5zIC0+XG4gICAgICAgICAgICBleHBlY3QoY29sb3JCdWZmZXJFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ3BpZ21lbnRzLWNvbG9yLW1hcmtlcjpub3QoOmVtcHR5KScpLmxlbmd0aCkudG9FcXVhbCgyKVxuXG4gICAgICAgICAgbG9hZEJ1ZmZlcigncHJvamVjdC92ZW5kb3IvY3NzL3ZhcmlhYmxlcy5sZXNzJylcbiAgICAgICAgICBydW5zIC0+XG4gICAgICAgICAgICBleHBlY3QoY29sb3JCdWZmZXJFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ3BpZ21lbnRzLWNvbG9yLW1hcmtlcjpub3QoOmVtcHR5KScpLmxlbmd0aCkudG9FcXVhbCgwKVxuXG4gICAgICBkZXNjcmliZSAnd2l0aCBtYW55IGZpbGV0eXBlcycsIC0+XG4gICAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgICBhdG9tLmNvbmZpZy5zZXQgJ3BpZ21lbnRzLnN1cHBvcnRlZEZpbGV0eXBlcycsIFsnY29mZmVlJ11cbiAgICAgICAgICBwcm9qZWN0LnNldFN1cHBvcnRlZEZpbGV0eXBlcyhbJ2xlc3MnXSlcblxuICAgICAgICBpdCAnc3VwcG9ydHMgdGhlIHNwZWNpZmllZCBmaWxlIHR5cGVzJywgLT5cbiAgICAgICAgICBsb2FkQnVmZmVyKCdzY29wZS1maWx0ZXIuY29mZmVlJylcbiAgICAgICAgICBydW5zIC0+XG4gICAgICAgICAgICBleHBlY3QoY29sb3JCdWZmZXJFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ3BpZ21lbnRzLWNvbG9yLW1hcmtlcjpub3QoOmVtcHR5KScpLmxlbmd0aCkudG9FcXVhbCgyKVxuXG4gICAgICAgICAgbG9hZEJ1ZmZlcigncHJvamVjdC92ZW5kb3IvY3NzL3ZhcmlhYmxlcy5sZXNzJylcbiAgICAgICAgICBydW5zIC0+XG4gICAgICAgICAgICBleHBlY3QoY29sb3JCdWZmZXJFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ3BpZ21lbnRzLWNvbG9yLW1hcmtlcjpub3QoOmVtcHR5KScpLmxlbmd0aCkudG9FcXVhbCgyMClcblxuICAgICAgICAgIGxvYWRCdWZmZXIoJ2ZvdXItdmFyaWFibGVzLnN0eWwnKVxuICAgICAgICAgIHJ1bnMgLT5cbiAgICAgICAgICAgIGV4cGVjdChjb2xvckJ1ZmZlckVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgncGlnbWVudHMtY29sb3ItbWFya2VyOm5vdCg6ZW1wdHkpJykubGVuZ3RoKS50b0VxdWFsKDApXG5cbiAgICAgICAgZGVzY3JpYmUgJ3dpdGggZ2xvYmFsIGZpbGUgdHlwZXMgaWdub3JlZCcsIC0+XG4gICAgICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICAgICAgYXRvbS5jb25maWcuc2V0ICdwaWdtZW50cy5zdXBwb3J0ZWRGaWxldHlwZXMnLCBbJ2NvZmZlZSddXG4gICAgICAgICAgICBwcm9qZWN0LnNldElnbm9yZUdsb2JhbFN1cHBvcnRlZEZpbGV0eXBlcyh0cnVlKVxuICAgICAgICAgICAgcHJvamVjdC5zZXRTdXBwb3J0ZWRGaWxldHlwZXMoWydsZXNzJ10pXG5cbiAgICAgICAgICBpdCAnc3VwcG9ydHMgdGhlIHNwZWNpZmllZCBmaWxlIHR5cGVzJywgLT5cbiAgICAgICAgICAgIGxvYWRCdWZmZXIoJ3Njb3BlLWZpbHRlci5jb2ZmZWUnKVxuICAgICAgICAgICAgcnVucyAtPlxuICAgICAgICAgICAgICBleHBlY3QoY29sb3JCdWZmZXJFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ3BpZ21lbnRzLWNvbG9yLW1hcmtlcjpub3QoOmVtcHR5KScpLmxlbmd0aCkudG9FcXVhbCgwKVxuXG4gICAgICAgICAgICBsb2FkQnVmZmVyKCdwcm9qZWN0L3ZlbmRvci9jc3MvdmFyaWFibGVzLmxlc3MnKVxuICAgICAgICAgICAgcnVucyAtPlxuICAgICAgICAgICAgICBleHBlY3QoY29sb3JCdWZmZXJFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ3BpZ21lbnRzLWNvbG9yLW1hcmtlcjpub3QoOmVtcHR5KScpLmxlbmd0aCkudG9FcXVhbCgyMClcblxuICAgICAgICAgICAgbG9hZEJ1ZmZlcignZm91ci12YXJpYWJsZXMuc3R5bCcpXG4gICAgICAgICAgICBydW5zIC0+XG4gICAgICAgICAgICAgIGV4cGVjdChjb2xvckJ1ZmZlckVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgncGlnbWVudHMtY29sb3ItbWFya2VyOm5vdCg6ZW1wdHkpJykubGVuZ3RoKS50b0VxdWFsKDApXG5cbiAgICBkZXNjcmliZSAnd2hlbiBwaWdtZW50cy5pZ25vcmVkU2NvcGVzIHNldHRpbmdzIGlzIGRlZmluZWQnLCAtPlxuICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgICAgICBhdG9tLnBhY2thZ2VzLmFjdGl2YXRlUGFja2FnZSgnbGFuZ3VhZ2UtY29mZmVlLXNjcmlwdCcpXG5cbiAgICAgICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICAgICAgYXRvbS53b3Jrc3BhY2Uub3Blbignc2NvcGUtZmlsdGVyLmNvZmZlZScpLnRoZW4gKG8pIC0+XG4gICAgICAgICAgICBlZGl0b3IgPSBvXG4gICAgICAgICAgICBlZGl0b3JFbGVtZW50ID0gYXRvbS52aWV3cy5nZXRWaWV3KGVkaXRvcilcbiAgICAgICAgICAgIGNvbG9yQnVmZmVyID0gcHJvamVjdC5jb2xvckJ1ZmZlckZvckVkaXRvcihlZGl0b3IpXG4gICAgICAgICAgICBjb2xvckJ1ZmZlckVsZW1lbnQgPSBhdG9tLnZpZXdzLmdldFZpZXcoY29sb3JCdWZmZXIpXG4gICAgICAgICAgICBjb2xvckJ1ZmZlckVsZW1lbnQuYXR0YWNoKClcblxuICAgICAgICB3YWl0c0ZvclByb21pc2UgLT4gY29sb3JCdWZmZXIuaW5pdGlhbGl6ZSgpXG5cbiAgICAgIGRlc2NyaWJlICd3aXRoIG9uZSBmaWx0ZXInLCAtPlxuICAgICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgICAgYXRvbS5jb25maWcuc2V0KCdwaWdtZW50cy5pZ25vcmVkU2NvcGVzJywgWydcXFxcLmNvbW1lbnQnXSlcblxuICAgICAgICBpdCAnaWdub3JlcyB0aGUgY29sb3JzIHRoYXQgbWF0Y2hlcyB0aGUgZGVmaW5lZCBzY29wZXMnLCAtPlxuICAgICAgICAgIGV4cGVjdChjb2xvckJ1ZmZlckVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgncGlnbWVudHMtY29sb3ItbWFya2VyOm5vdCg6ZW1wdHkpJykubGVuZ3RoKS50b0VxdWFsKDEpXG5cbiAgICAgIGRlc2NyaWJlICd3aXRoIHR3byBmaWx0ZXJzJywgLT5cbiAgICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICAgIGF0b20uY29uZmlnLnNldCgncGlnbWVudHMuaWdub3JlZFNjb3BlcycsIFsnXFxcXC5zdHJpbmcnLCAnXFxcXC5jb21tZW50J10pXG5cbiAgICAgICAgaXQgJ2lnbm9yZXMgdGhlIGNvbG9ycyB0aGF0IG1hdGNoZXMgdGhlIGRlZmluZWQgc2NvcGVzJywgLT5cbiAgICAgICAgICBleHBlY3QoY29sb3JCdWZmZXJFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ3BpZ21lbnRzLWNvbG9yLW1hcmtlcjpub3QoOmVtcHR5KScpLmxlbmd0aCkudG9FcXVhbCgwKVxuXG4gICAgICBkZXNjcmliZSAnd2l0aCBhbiBpbnZhbGlkIGZpbHRlcicsIC0+XG4gICAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgICBhdG9tLmNvbmZpZy5zZXQoJ3BpZ21lbnRzLmlnbm9yZWRTY29wZXMnLCBbJ1xcXFwnXSlcblxuICAgICAgICBpdCAnaWdub3JlcyB0aGUgZmlsdGVyJywgLT5cbiAgICAgICAgICBleHBlY3QoY29sb3JCdWZmZXJFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ3BpZ21lbnRzLWNvbG9yLW1hcmtlcjpub3QoOmVtcHR5KScpLmxlbmd0aCkudG9FcXVhbCgyKVxuXG4gICAgICBkZXNjcmliZSAnd2hlbiB0aGUgcHJvamVjdCBpZ25vcmVkU2NvcGVzIGlzIGRlZmluZWQnLCAtPlxuICAgICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgICAgYXRvbS5jb25maWcuc2V0KCdwaWdtZW50cy5pZ25vcmVkU2NvcGVzJywgWydcXFxcLnN0cmluZyddKVxuICAgICAgICAgIHByb2plY3Quc2V0SWdub3JlZFNjb3BlcyhbJ1xcXFwuY29tbWVudCddKVxuXG4gICAgICAgIGl0ICdpZ25vcmVzIHRoZSBjb2xvcnMgdGhhdCBtYXRjaGVzIHRoZSBkZWZpbmVkIHNjb3BlcycsIC0+XG4gICAgICAgICAgZXhwZWN0KGNvbG9yQnVmZmVyRWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCdwaWdtZW50cy1jb2xvci1tYXJrZXI6bm90KDplbXB0eSknKS5sZW5ndGgpLnRvRXF1YWwoMClcblxuICAgIGRlc2NyaWJlICd3aGVuIGEgdGV4dCBlZGl0b3Igc2V0dGluZ3MgaXMgbW9kaWZpZWQnLCAtPlxuICAgICAgW29yaWdpbmFsTWFya2Vyc10gPSBbXVxuICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICB3YWl0c0ZvclByb21pc2UgLT4gY29sb3JCdWZmZXIudmFyaWFibGVzQXZhaWxhYmxlKClcblxuICAgICAgICBydW5zIC0+XG4gICAgICAgICAgb3JpZ2luYWxNYXJrZXJzID0gY29sb3JCdWZmZXJFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ3BpZ21lbnRzLWNvbG9yLW1hcmtlcjpub3QoOmVtcHR5KScpXG4gICAgICAgICAgc3B5T24oY29sb3JCdWZmZXJFbGVtZW50LCAndXBkYXRlTWFya2VycycpLmFuZENhbGxUaHJvdWdoKClcbiAgICAgICAgICBzcHlPbihDb2xvck1hcmtlckVsZW1lbnQ6OiwgJ3JlbmRlcicpLmFuZENhbGxUaHJvdWdoKClcblxuICAgICAgZGVzY3JpYmUgJ2VkaXRvci5mb250U2l6ZScsIC0+XG4gICAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgICBhdG9tLmNvbmZpZy5zZXQoJ2VkaXRvci5mb250U2l6ZScsIDIwKVxuXG4gICAgICAgIGl0ICdmb3JjZXMgYW4gdXBkYXRlIGFuZCBhIHJlLXJlbmRlciBvZiBleGlzdGluZyBtYXJrZXJzJywgLT5cbiAgICAgICAgICBleHBlY3QoY29sb3JCdWZmZXJFbGVtZW50LnVwZGF0ZU1hcmtlcnMpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgICAgIGZvciBtYXJrZXIgaW4gb3JpZ2luYWxNYXJrZXJzXG4gICAgICAgICAgICBleHBlY3QobWFya2VyLnJlbmRlcikudG9IYXZlQmVlbkNhbGxlZCgpXG5cbiAgICAgIGRlc2NyaWJlICdlZGl0b3IubGluZUhlaWdodCcsIC0+XG4gICAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgICBhdG9tLmNvbmZpZy5zZXQoJ2VkaXRvci5saW5lSGVpZ2h0JywgMjApXG5cbiAgICAgICAgaXQgJ2ZvcmNlcyBhbiB1cGRhdGUgYW5kIGEgcmUtcmVuZGVyIG9mIGV4aXN0aW5nIG1hcmtlcnMnLCAtPlxuICAgICAgICAgIGV4cGVjdChjb2xvckJ1ZmZlckVsZW1lbnQudXBkYXRlTWFya2VycykudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICAgICAgZm9yIG1hcmtlciBpbiBvcmlnaW5hbE1hcmtlcnNcbiAgICAgICAgICAgIGV4cGVjdChtYXJrZXIucmVuZGVyKS50b0hhdmVCZWVuQ2FsbGVkKClcbiJdfQ==
