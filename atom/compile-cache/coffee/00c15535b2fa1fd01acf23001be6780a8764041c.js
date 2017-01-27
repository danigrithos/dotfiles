(function() {
  var ColorBuffer, ColorProject, SERIALIZE_MARKERS_VERSION, SERIALIZE_VERSION, TOTAL_COLORS_VARIABLES_IN_PROJECT, TOTAL_VARIABLES_IN_PROJECT, click, fs, jsonFixture, os, path, ref, temp;

  os = require('os');

  fs = require('fs-plus');

  path = require('path');

  temp = require('temp');

  ref = require('../lib/versions'), SERIALIZE_VERSION = ref.SERIALIZE_VERSION, SERIALIZE_MARKERS_VERSION = ref.SERIALIZE_MARKERS_VERSION;

  ColorProject = require('../lib/color-project');

  ColorBuffer = require('../lib/color-buffer');

  jsonFixture = require('./helpers/fixtures').jsonFixture(__dirname, 'fixtures');

  click = require('./helpers/events').click;

  TOTAL_VARIABLES_IN_PROJECT = 12;

  TOTAL_COLORS_VARIABLES_IN_PROJECT = 10;

  describe('ColorProject', function() {
    var eventSpy, paths, project, promise, ref1, rootPath;
    ref1 = [], project = ref1[0], promise = ref1[1], rootPath = ref1[2], paths = ref1[3], eventSpy = ref1[4];
    beforeEach(function() {
      var fixturesPath;
      atom.config.set('pigments.sourceNames', ['*.styl']);
      atom.config.set('pigments.ignoredNames', []);
      atom.config.set('pigments.filetypesForColorWords', ['*']);
      fixturesPath = atom.project.getPaths()[0];
      rootPath = fixturesPath + "/project";
      atom.project.setPaths([rootPath]);
      return project = new ColorProject({
        ignoredNames: ['vendor/*'],
        sourceNames: ['*.less'],
        ignoredScopes: ['\\.comment']
      });
    });
    afterEach(function() {
      return project.destroy();
    });
    describe('.deserialize', function() {
      return it('restores the project in its previous state', function() {
        var data, json;
        data = {
          root: rootPath,
          timestamp: new Date().toJSON(),
          version: SERIALIZE_VERSION,
          markersVersion: SERIALIZE_MARKERS_VERSION
        };
        json = jsonFixture('base-project.json', data);
        project = ColorProject.deserialize(json);
        expect(project).toBeDefined();
        expect(project.getPaths()).toEqual([rootPath + "/styles/buttons.styl", rootPath + "/styles/variables.styl"]);
        expect(project.getVariables().length).toEqual(TOTAL_VARIABLES_IN_PROJECT);
        return expect(project.getColorVariables().length).toEqual(TOTAL_COLORS_VARIABLES_IN_PROJECT);
      });
    });
    describe('::initialize', function() {
      beforeEach(function() {
        eventSpy = jasmine.createSpy('did-initialize');
        project.onDidInitialize(eventSpy);
        return waitsForPromise(function() {
          return project.initialize();
        });
      });
      it('loads the paths to scan in the project', function() {
        return expect(project.getPaths()).toEqual([rootPath + "/styles/buttons.styl", rootPath + "/styles/variables.styl"]);
      });
      it('scans the loaded paths to retrieve the variables', function() {
        expect(project.getVariables()).toBeDefined();
        return expect(project.getVariables().length).toEqual(TOTAL_VARIABLES_IN_PROJECT);
      });
      return it('dispatches a did-initialize event', function() {
        return expect(eventSpy).toHaveBeenCalled();
      });
    });
    describe('::findAllColors', function() {
      return it('returns all the colors in the legibles files of the project', function() {
        var search;
        search = project.findAllColors();
        return expect(search).toBeDefined();
      });
    });
    describe('when the variables have not been loaded yet', function() {
      describe('::serialize', function() {
        return it('returns an object without paths nor variables', function() {
          var date, expected;
          date = new Date;
          spyOn(project, 'getTimestamp').andCallFake(function() {
            return date;
          });
          expected = {
            deserializer: 'ColorProject',
            timestamp: date,
            version: SERIALIZE_VERSION,
            markersVersion: SERIALIZE_MARKERS_VERSION,
            globalSourceNames: ['*.styl'],
            globalIgnoredNames: [],
            ignoredNames: ['vendor/*'],
            sourceNames: ['*.less'],
            ignoredScopes: ['\\.comment'],
            buffers: {}
          };
          return expect(project.serialize()).toEqual(expected);
        });
      });
      describe('::getVariablesForPath', function() {
        return it('returns undefined', function() {
          return expect(project.getVariablesForPath(rootPath + "/styles/variables.styl")).toEqual([]);
        });
      });
      describe('::getVariableByName', function() {
        return it('returns undefined', function() {
          return expect(project.getVariableByName("foo")).toBeUndefined();
        });
      });
      describe('::getVariableById', function() {
        return it('returns undefined', function() {
          return expect(project.getVariableById(0)).toBeUndefined();
        });
      });
      describe('::getContext', function() {
        return it('returns an empty context', function() {
          expect(project.getContext()).toBeDefined();
          return expect(project.getContext().getVariablesCount()).toEqual(0);
        });
      });
      describe('::getPalette', function() {
        return it('returns an empty palette', function() {
          expect(project.getPalette()).toBeDefined();
          return expect(project.getPalette().getColorsCount()).toEqual(0);
        });
      });
      describe('::reloadVariablesForPath', function() {
        beforeEach(function() {
          spyOn(project, 'initialize').andCallThrough();
          return waitsForPromise(function() {
            return project.reloadVariablesForPath(rootPath + "/styles/variables.styl");
          });
        });
        return it('returns a promise hooked on the initialize promise', function() {
          return expect(project.initialize).toHaveBeenCalled();
        });
      });
      describe('::setIgnoredNames', function() {
        beforeEach(function() {
          project.setIgnoredNames([]);
          return waitsForPromise(function() {
            return project.initialize();
          });
        });
        return it('initializes the project with the new paths', function() {
          return expect(project.getVariables().length).toEqual(32);
        });
      });
      return describe('::setSourceNames', function() {
        beforeEach(function() {
          project.setSourceNames([]);
          return waitsForPromise(function() {
            return project.initialize();
          });
        });
        return it('initializes the project with the new paths', function() {
          return expect(project.getVariables().length).toEqual(12);
        });
      });
    });
    describe('when the project has no variables source files', function() {
      beforeEach(function() {
        var fixturesPath;
        atom.config.set('pigments.sourceNames', ['*.sass']);
        fixturesPath = atom.project.getPaths()[0];
        rootPath = fixturesPath + "-no-sources";
        atom.project.setPaths([rootPath]);
        project = new ColorProject({});
        return waitsForPromise(function() {
          return project.initialize();
        });
      });
      it('initializes the paths with an empty array', function() {
        return expect(project.getPaths()).toEqual([]);
      });
      return it('initializes the variables with an empty array', function() {
        return expect(project.getVariables()).toEqual([]);
      });
    });
    describe('when the project has custom source names defined', function() {
      beforeEach(function() {
        var fixturesPath;
        atom.config.set('pigments.sourceNames', ['*.sass']);
        fixturesPath = atom.project.getPaths()[0];
        project = new ColorProject({
          sourceNames: ['*.styl']
        });
        return waitsForPromise(function() {
          return project.initialize();
        });
      });
      it('initializes the paths with an empty array', function() {
        return expect(project.getPaths().length).toEqual(2);
      });
      return it('initializes the variables with an empty array', function() {
        expect(project.getVariables().length).toEqual(TOTAL_VARIABLES_IN_PROJECT);
        return expect(project.getColorVariables().length).toEqual(TOTAL_COLORS_VARIABLES_IN_PROJECT);
      });
    });
    describe('when the project has looping variable definition', function() {
      beforeEach(function() {
        var fixturesPath;
        atom.config.set('pigments.sourceNames', ['*.sass']);
        fixturesPath = atom.project.getPaths()[0];
        rootPath = fixturesPath + "-with-recursion";
        atom.project.setPaths([rootPath]);
        project = new ColorProject({});
        return waitsForPromise(function() {
          return project.initialize();
        });
      });
      return it('ignores the looping definition', function() {
        expect(project.getVariables().length).toEqual(5);
        return expect(project.getColorVariables().length).toEqual(5);
      });
    });
    describe('when the variables have been loaded', function() {
      beforeEach(function() {
        return waitsForPromise(function() {
          return project.initialize();
        });
      });
      describe('::serialize', function() {
        return it('returns an object with project properties', function() {
          var date;
          date = new Date;
          spyOn(project, 'getTimestamp').andCallFake(function() {
            return date;
          });
          return expect(project.serialize()).toEqual({
            deserializer: 'ColorProject',
            ignoredNames: ['vendor/*'],
            sourceNames: ['*.less'],
            ignoredScopes: ['\\.comment'],
            timestamp: date,
            version: SERIALIZE_VERSION,
            markersVersion: SERIALIZE_MARKERS_VERSION,
            paths: [rootPath + "/styles/buttons.styl", rootPath + "/styles/variables.styl"],
            globalSourceNames: ['*.styl'],
            globalIgnoredNames: [],
            buffers: {},
            variables: project.variables.serialize()
          });
        });
      });
      describe('::getVariablesForPath', function() {
        it('returns the variables defined in the file', function() {
          return expect(project.getVariablesForPath(rootPath + "/styles/variables.styl").length).toEqual(TOTAL_VARIABLES_IN_PROJECT);
        });
        return describe('for a file that was ignored in the scanning process', function() {
          return it('returns undefined', function() {
            return expect(project.getVariablesForPath(rootPath + "/vendor/css/variables.less")).toEqual([]);
          });
        });
      });
      describe('::deleteVariablesForPath', function() {
        return it('removes all the variables coming from the specified file', function() {
          project.deleteVariablesForPath(rootPath + "/styles/variables.styl");
          return expect(project.getVariablesForPath(rootPath + "/styles/variables.styl")).toEqual([]);
        });
      });
      describe('::getContext', function() {
        return it('returns a context with the project variables', function() {
          expect(project.getContext()).toBeDefined();
          return expect(project.getContext().getVariablesCount()).toEqual(TOTAL_VARIABLES_IN_PROJECT);
        });
      });
      describe('::getPalette', function() {
        return it('returns a palette with the colors from the project', function() {
          expect(project.getPalette()).toBeDefined();
          return expect(project.getPalette().getColorsCount()).toEqual(10);
        });
      });
      describe('::showVariableInFile', function() {
        return it('opens the file where is located the variable', function() {
          var spy;
          spy = jasmine.createSpy('did-add-text-editor');
          atom.workspace.onDidAddTextEditor(spy);
          project.showVariableInFile(project.getVariables()[0]);
          waitsFor(function() {
            return spy.callCount > 0;
          });
          return runs(function() {
            var editor;
            editor = atom.workspace.getActiveTextEditor();
            return expect(editor.getSelectedBufferRange()).toEqual([[1, 2], [1, 14]]);
          });
        });
      });
      describe('::reloadVariablesForPath', function() {
        return describe('for a file that is part of the loaded paths', function() {
          describe('where the reload finds new variables', function() {
            beforeEach(function() {
              project.deleteVariablesForPath(rootPath + "/styles/variables.styl");
              eventSpy = jasmine.createSpy('did-update-variables');
              project.onDidUpdateVariables(eventSpy);
              return waitsForPromise(function() {
                return project.reloadVariablesForPath(rootPath + "/styles/variables.styl");
              });
            });
            it('scans again the file to find variables', function() {
              return expect(project.getVariables().length).toEqual(TOTAL_VARIABLES_IN_PROJECT);
            });
            return it('dispatches a did-update-variables event', function() {
              return expect(eventSpy).toHaveBeenCalled();
            });
          });
          return describe('where the reload finds nothing new', function() {
            beforeEach(function() {
              eventSpy = jasmine.createSpy('did-update-variables');
              project.onDidUpdateVariables(eventSpy);
              return waitsForPromise(function() {
                return project.reloadVariablesForPath(rootPath + "/styles/variables.styl");
              });
            });
            it('leaves the file variables intact', function() {
              return expect(project.getVariables().length).toEqual(TOTAL_VARIABLES_IN_PROJECT);
            });
            return it('does not dispatch a did-update-variables event', function() {
              return expect(eventSpy).not.toHaveBeenCalled();
            });
          });
        });
      });
      describe('::reloadVariablesForPaths', function() {
        describe('for a file that is part of the loaded paths', function() {
          describe('where the reload finds new variables', function() {
            beforeEach(function() {
              project.deleteVariablesForPaths([rootPath + "/styles/variables.styl", rootPath + "/styles/buttons.styl"]);
              eventSpy = jasmine.createSpy('did-update-variables');
              project.onDidUpdateVariables(eventSpy);
              return waitsForPromise(function() {
                return project.reloadVariablesForPaths([rootPath + "/styles/variables.styl", rootPath + "/styles/buttons.styl"]);
              });
            });
            it('scans again the file to find variables', function() {
              return expect(project.getVariables().length).toEqual(TOTAL_VARIABLES_IN_PROJECT);
            });
            return it('dispatches a did-update-variables event', function() {
              return expect(eventSpy).toHaveBeenCalled();
            });
          });
          return describe('where the reload finds nothing new', function() {
            beforeEach(function() {
              eventSpy = jasmine.createSpy('did-update-variables');
              project.onDidUpdateVariables(eventSpy);
              return waitsForPromise(function() {
                return project.reloadVariablesForPaths([rootPath + "/styles/variables.styl", rootPath + "/styles/buttons.styl"]);
              });
            });
            it('leaves the file variables intact', function() {
              return expect(project.getVariables().length).toEqual(TOTAL_VARIABLES_IN_PROJECT);
            });
            return it('does not dispatch a did-update-variables event', function() {
              return expect(eventSpy).not.toHaveBeenCalled();
            });
          });
        });
        return describe('for a file that is not part of the loaded paths', function() {
          beforeEach(function() {
            spyOn(project, 'loadVariablesForPath').andCallThrough();
            return waitsForPromise(function() {
              return project.reloadVariablesForPath(rootPath + "/vendor/css/variables.less");
            });
          });
          return it('does nothing', function() {
            return expect(project.loadVariablesForPath).not.toHaveBeenCalled();
          });
        });
      });
      describe('when a buffer with variables is open', function() {
        var colorBuffer, editor, ref2;
        ref2 = [], editor = ref2[0], colorBuffer = ref2[1];
        beforeEach(function() {
          eventSpy = jasmine.createSpy('did-update-variables');
          project.onDidUpdateVariables(eventSpy);
          waitsForPromise(function() {
            return atom.workspace.open('styles/variables.styl').then(function(o) {
              return editor = o;
            });
          });
          runs(function() {
            colorBuffer = project.colorBufferForEditor(editor);
            return spyOn(colorBuffer, 'scanBufferForVariables').andCallThrough();
          });
          waitsForPromise(function() {
            return project.initialize();
          });
          return waitsForPromise(function() {
            return colorBuffer.variablesAvailable();
          });
        });
        it('updates the project variable with the buffer ranges', function() {
          var i, len, ref3, results, variable;
          ref3 = project.getVariables();
          results = [];
          for (i = 0, len = ref3.length; i < len; i++) {
            variable = ref3[i];
            results.push(expect(variable.bufferRange).toBeDefined());
          }
          return results;
        });
        describe('when a color is modified that does not affect other variables ranges', function() {
          var variablesTextRanges;
          variablesTextRanges = [][0];
          beforeEach(function() {
            variablesTextRanges = {};
            project.getVariablesForPath(editor.getPath()).forEach(function(variable) {
              return variablesTextRanges[variable.name] = variable.range;
            });
            editor.setSelectedBufferRange([[1, 7], [1, 14]]);
            editor.insertText('#336');
            editor.getBuffer().emitter.emit('did-stop-changing');
            return waitsFor(function() {
              return eventSpy.callCount > 0;
            });
          });
          it('reloads the variables with the buffer instead of the file', function() {
            expect(colorBuffer.scanBufferForVariables).toHaveBeenCalled();
            return expect(project.getVariables().length).toEqual(TOTAL_VARIABLES_IN_PROJECT);
          });
          it('uses the buffer ranges to detect which variables were really changed', function() {
            expect(eventSpy.argsForCall[0][0].destroyed).toBeUndefined();
            expect(eventSpy.argsForCall[0][0].created).toBeUndefined();
            return expect(eventSpy.argsForCall[0][0].updated.length).toEqual(1);
          });
          it('updates the text range of the other variables', function() {
            return project.getVariablesForPath(rootPath + "/styles/variables.styl").forEach(function(variable) {
              if (variable.name !== 'colors.red') {
                expect(variable.range[0]).toEqual(variablesTextRanges[variable.name][0] - 3);
                return expect(variable.range[1]).toEqual(variablesTextRanges[variable.name][1] - 3);
              }
            });
          });
          return it('dispatches a did-update-variables event', function() {
            return expect(eventSpy).toHaveBeenCalled();
          });
        });
        describe('when a text is inserted that affects other variables ranges', function() {
          var ref3, variablesBufferRanges, variablesTextRanges;
          ref3 = [], variablesTextRanges = ref3[0], variablesBufferRanges = ref3[1];
          beforeEach(function() {
            runs(function() {
              variablesTextRanges = {};
              variablesBufferRanges = {};
              project.getVariablesForPath(editor.getPath()).forEach(function(variable) {
                variablesTextRanges[variable.name] = variable.range;
                return variablesBufferRanges[variable.name] = variable.bufferRange;
              });
              spyOn(project.variables, 'addMany').andCallThrough();
              editor.setSelectedBufferRange([[0, 0], [0, 0]]);
              editor.insertText('\n\n');
              return editor.getBuffer().emitter.emit('did-stop-changing');
            });
            return waitsFor(function() {
              return project.variables.addMany.callCount > 0;
            });
          });
          it('does not trigger a change event', function() {
            return expect(eventSpy.callCount).toEqual(0);
          });
          return it('updates the range of the updated variables', function() {
            return project.getVariablesForPath(rootPath + "/styles/variables.styl").forEach(function(variable) {
              if (variable.name !== 'colors.red') {
                expect(variable.range[0]).toEqual(variablesTextRanges[variable.name][0] + 2);
                expect(variable.range[1]).toEqual(variablesTextRanges[variable.name][1] + 2);
                return expect(variable.bufferRange.isEqual(variablesBufferRanges[variable.name])).toBeFalsy();
              }
            });
          });
        });
        describe('when a color is removed', function() {
          var variablesTextRanges;
          variablesTextRanges = [][0];
          beforeEach(function() {
            runs(function() {
              variablesTextRanges = {};
              project.getVariablesForPath(editor.getPath()).forEach(function(variable) {
                return variablesTextRanges[variable.name] = variable.range;
              });
              editor.setSelectedBufferRange([[1, 0], [2, 0]]);
              editor.insertText('');
              return editor.getBuffer().emitter.emit('did-stop-changing');
            });
            return waitsFor(function() {
              return eventSpy.callCount > 0;
            });
          });
          it('reloads the variables with the buffer instead of the file', function() {
            expect(colorBuffer.scanBufferForVariables).toHaveBeenCalled();
            return expect(project.getVariables().length).toEqual(TOTAL_VARIABLES_IN_PROJECT - 1);
          });
          it('uses the buffer ranges to detect which variables were really changed', function() {
            expect(eventSpy.argsForCall[0][0].destroyed.length).toEqual(1);
            expect(eventSpy.argsForCall[0][0].created).toBeUndefined();
            return expect(eventSpy.argsForCall[0][0].updated).toBeUndefined();
          });
          it('can no longer be found in the project variables', function() {
            expect(project.getVariables().some(function(v) {
              return v.name === 'colors.red';
            })).toBeFalsy();
            return expect(project.getColorVariables().some(function(v) {
              return v.name === 'colors.red';
            })).toBeFalsy();
          });
          return it('dispatches a did-update-variables event', function() {
            return expect(eventSpy).toHaveBeenCalled();
          });
        });
        return describe('when all the colors are removed', function() {
          var variablesTextRanges;
          variablesTextRanges = [][0];
          beforeEach(function() {
            runs(function() {
              variablesTextRanges = {};
              project.getVariablesForPath(editor.getPath()).forEach(function(variable) {
                return variablesTextRanges[variable.name] = variable.range;
              });
              editor.setSelectedBufferRange([[0, 0], [2e308, 2e308]]);
              editor.insertText('');
              return editor.getBuffer().emitter.emit('did-stop-changing');
            });
            return waitsFor(function() {
              return eventSpy.callCount > 0;
            });
          });
          it('removes every variable from the file', function() {
            expect(colorBuffer.scanBufferForVariables).toHaveBeenCalled();
            expect(project.getVariables().length).toEqual(0);
            expect(eventSpy.argsForCall[0][0].destroyed.length).toEqual(TOTAL_VARIABLES_IN_PROJECT);
            expect(eventSpy.argsForCall[0][0].created).toBeUndefined();
            return expect(eventSpy.argsForCall[0][0].updated).toBeUndefined();
          });
          it('can no longer be found in the project variables', function() {
            expect(project.getVariables().some(function(v) {
              return v.name === 'colors.red';
            })).toBeFalsy();
            return expect(project.getColorVariables().some(function(v) {
              return v.name === 'colors.red';
            })).toBeFalsy();
          });
          return it('dispatches a did-update-variables event', function() {
            return expect(eventSpy).toHaveBeenCalled();
          });
        });
      });
      describe('::setIgnoredNames', function() {
        describe('with an empty array', function() {
          beforeEach(function() {
            var spy;
            expect(project.getVariables().length).toEqual(12);
            spy = jasmine.createSpy('did-update-variables');
            project.onDidUpdateVariables(spy);
            project.setIgnoredNames([]);
            return waitsFor(function() {
              return spy.callCount > 0;
            });
          });
          return it('reloads the variables from the new paths', function() {
            return expect(project.getVariables().length).toEqual(32);
          });
        });
        return describe('with a more restrictive array', function() {
          beforeEach(function() {
            var spy;
            expect(project.getVariables().length).toEqual(12);
            spy = jasmine.createSpy('did-update-variables');
            project.onDidUpdateVariables(spy);
            return waitsForPromise(function() {
              return project.setIgnoredNames(['vendor/*', '**/*.styl']);
            });
          });
          return it('clears all the paths as there is no legible paths', function() {
            return expect(project.getPaths().length).toEqual(0);
          });
        });
      });
      describe('when the project has multiple root directory', function() {
        beforeEach(function() {
          var fixturesPath;
          atom.config.set('pigments.sourceNames', ['**/*.sass', '**/*.styl']);
          fixturesPath = atom.project.getPaths()[0];
          atom.project.setPaths(["" + fixturesPath, fixturesPath + "-with-recursion"]);
          project = new ColorProject({});
          return waitsForPromise(function() {
            return project.initialize();
          });
        });
        return it('finds the variables from the two directories', function() {
          return expect(project.getVariables().length).toEqual(17);
        });
      });
      describe('when the project has VCS ignored files', function() {
        var projectPath;
        projectPath = [][0];
        beforeEach(function() {
          var dotGit, dotGitFixture, fixture;
          atom.config.set('pigments.sourceNames', ['*.sass']);
          fixture = path.join(__dirname, 'fixtures', 'project-with-gitignore');
          projectPath = temp.mkdirSync('pigments-project');
          dotGitFixture = path.join(fixture, 'git.git');
          dotGit = path.join(projectPath, '.git');
          fs.copySync(dotGitFixture, dotGit);
          fs.writeFileSync(path.join(projectPath, '.gitignore'), fs.readFileSync(path.join(fixture, 'git.gitignore')));
          fs.writeFileSync(path.join(projectPath, 'base.sass'), fs.readFileSync(path.join(fixture, 'base.sass')));
          fs.writeFileSync(path.join(projectPath, 'ignored.sass'), fs.readFileSync(path.join(fixture, 'ignored.sass')));
          fs.mkdirSync(path.join(projectPath, 'bower_components'));
          fs.writeFileSync(path.join(projectPath, 'bower_components', 'some-ignored-file.sass'), fs.readFileSync(path.join(fixture, 'bower_components', 'some-ignored-file.sass')));
          return atom.project.setPaths([projectPath]);
        });
        describe('when the ignoreVcsIgnoredPaths setting is enabled', function() {
          beforeEach(function() {
            atom.config.set('pigments.ignoreVcsIgnoredPaths', true);
            project = new ColorProject({});
            return waitsForPromise(function() {
              return project.initialize();
            });
          });
          it('finds the variables from the three files', function() {
            expect(project.getVariables().length).toEqual(3);
            return expect(project.getPaths().length).toEqual(1);
          });
          return describe('and then disabled', function() {
            beforeEach(function() {
              var spy;
              spy = jasmine.createSpy('did-update-variables');
              project.onDidUpdateVariables(spy);
              atom.config.set('pigments.ignoreVcsIgnoredPaths', false);
              return waitsFor(function() {
                return spy.callCount > 0;
              });
            });
            it('reloads the paths', function() {
              return expect(project.getPaths().length).toEqual(3);
            });
            return it('reloads the variables', function() {
              return expect(project.getVariables().length).toEqual(10);
            });
          });
        });
        return describe('when the ignoreVcsIgnoredPaths setting is disabled', function() {
          beforeEach(function() {
            atom.config.set('pigments.ignoreVcsIgnoredPaths', false);
            project = new ColorProject({});
            return waitsForPromise(function() {
              return project.initialize();
            });
          });
          it('finds the variables from the three files', function() {
            expect(project.getVariables().length).toEqual(10);
            return expect(project.getPaths().length).toEqual(3);
          });
          return describe('and then enabled', function() {
            beforeEach(function() {
              var spy;
              spy = jasmine.createSpy('did-update-variables');
              project.onDidUpdateVariables(spy);
              atom.config.set('pigments.ignoreVcsIgnoredPaths', true);
              return waitsFor(function() {
                return spy.callCount > 0;
              });
            });
            it('reloads the paths', function() {
              return expect(project.getPaths().length).toEqual(1);
            });
            return it('reloads the variables', function() {
              return expect(project.getVariables().length).toEqual(3);
            });
          });
        });
      });
      describe('when the sourceNames setting is changed', function() {
        var updateSpy;
        updateSpy = [][0];
        beforeEach(function() {
          var originalPaths;
          originalPaths = project.getPaths();
          atom.config.set('pigments.sourceNames', []);
          return waitsFor(function() {
            return project.getPaths().join(',') !== originalPaths.join(',');
          });
        });
        it('updates the variables using the new pattern', function() {
          return expect(project.getVariables().length).toEqual(0);
        });
        return describe('so that new paths are found', function() {
          beforeEach(function() {
            var originalPaths;
            updateSpy = jasmine.createSpy('did-update-variables');
            originalPaths = project.getPaths();
            project.onDidUpdateVariables(updateSpy);
            atom.config.set('pigments.sourceNames', ['**/*.styl']);
            waitsFor(function() {
              return project.getPaths().join(',') !== originalPaths.join(',');
            });
            return waitsFor(function() {
              return updateSpy.callCount > 0;
            });
          });
          return it('loads the variables from these new paths', function() {
            return expect(project.getVariables().length).toEqual(TOTAL_VARIABLES_IN_PROJECT);
          });
        });
      });
      describe('when the ignoredNames setting is changed', function() {
        var updateSpy;
        updateSpy = [][0];
        beforeEach(function() {
          var originalPaths;
          originalPaths = project.getPaths();
          atom.config.set('pigments.ignoredNames', ['**/*.styl']);
          return waitsFor(function() {
            return project.getPaths().join(',') !== originalPaths.join(',');
          });
        });
        it('updates the found using the new pattern', function() {
          return expect(project.getVariables().length).toEqual(0);
        });
        return describe('so that new paths are found', function() {
          beforeEach(function() {
            var originalPaths;
            updateSpy = jasmine.createSpy('did-update-variables');
            originalPaths = project.getPaths();
            project.onDidUpdateVariables(updateSpy);
            atom.config.set('pigments.ignoredNames', []);
            waitsFor(function() {
              return project.getPaths().join(',') !== originalPaths.join(',');
            });
            return waitsFor(function() {
              return updateSpy.callCount > 0;
            });
          });
          return it('loads the variables from these new paths', function() {
            return expect(project.getVariables().length).toEqual(TOTAL_VARIABLES_IN_PROJECT);
          });
        });
      });
      describe('when the extendedSearchNames setting is changed', function() {
        var updateSpy;
        updateSpy = [][0];
        beforeEach(function() {
          return project.setSearchNames(['*.foo']);
        });
        it('updates the search names', function() {
          return expect(project.getSearchNames().length).toEqual(3);
        });
        return it('serializes the setting', function() {
          return expect(project.serialize().searchNames).toEqual(['*.foo']);
        });
      });
      describe('when the ignore global config settings are enabled', function() {
        describe('for the sourceNames field', function() {
          beforeEach(function() {
            project.sourceNames = ['*.foo'];
            return waitsForPromise(function() {
              return project.setIgnoreGlobalSourceNames(true);
            });
          });
          it('ignores the content of the global config', function() {
            return expect(project.getSourceNames()).toEqual(['.pigments', '*.foo']);
          });
          return it('serializes the project setting', function() {
            return expect(project.serialize().ignoreGlobalSourceNames).toBeTruthy();
          });
        });
        describe('for the ignoredNames field', function() {
          beforeEach(function() {
            atom.config.set('pigments.ignoredNames', ['*.foo']);
            project.ignoredNames = ['*.bar'];
            return project.setIgnoreGlobalIgnoredNames(true);
          });
          it('ignores the content of the global config', function() {
            return expect(project.getIgnoredNames()).toEqual(['*.bar']);
          });
          return it('serializes the project setting', function() {
            return expect(project.serialize().ignoreGlobalIgnoredNames).toBeTruthy();
          });
        });
        describe('for the ignoredScopes field', function() {
          beforeEach(function() {
            atom.config.set('pigments.ignoredScopes', ['\\.comment']);
            project.ignoredScopes = ['\\.source'];
            return project.setIgnoreGlobalIgnoredScopes(true);
          });
          it('ignores the content of the global config', function() {
            return expect(project.getIgnoredScopes()).toEqual(['\\.source']);
          });
          return it('serializes the project setting', function() {
            return expect(project.serialize().ignoreGlobalIgnoredScopes).toBeTruthy();
          });
        });
        return describe('for the searchNames field', function() {
          beforeEach(function() {
            atom.config.set('pigments.extendedSearchNames', ['*.css']);
            project.searchNames = ['*.foo'];
            return project.setIgnoreGlobalSearchNames(true);
          });
          it('ignores the content of the global config', function() {
            return expect(project.getSearchNames()).toEqual(['*.less', '*.foo']);
          });
          return it('serializes the project setting', function() {
            return expect(project.serialize().ignoreGlobalSearchNames).toBeTruthy();
          });
        });
      });
      describe('::loadThemesVariables', function() {
        beforeEach(function() {
          atom.packages.activatePackage('atom-light-ui');
          atom.packages.activatePackage('atom-light-syntax');
          atom.config.set('core.themes', ['atom-light-ui', 'atom-light-syntax']);
          waitsForPromise(function() {
            return atom.themes.activateThemes();
          });
          return waitsForPromise(function() {
            return atom.packages.activatePackage('pigments');
          });
        });
        afterEach(function() {
          atom.themes.deactivateThemes();
          return atom.themes.unwatchUserStylesheet();
        });
        return it('returns an array of 62 variables', function() {
          var themeVariables;
          themeVariables = project.loadThemesVariables();
          return expect(themeVariables.length).toEqual(62);
        });
      });
      return describe('when the includeThemes setting is enabled', function() {
        var ref2, spy;
        ref2 = [], paths = ref2[0], spy = ref2[1];
        beforeEach(function() {
          paths = project.getPaths();
          expect(project.getColorVariables().length).toEqual(10);
          atom.packages.activatePackage('atom-light-ui');
          atom.packages.activatePackage('atom-light-syntax');
          atom.packages.activatePackage('atom-dark-ui');
          atom.packages.activatePackage('atom-dark-syntax');
          atom.config.set('core.themes', ['atom-light-ui', 'atom-light-syntax']);
          waitsForPromise(function() {
            return atom.themes.activateThemes();
          });
          waitsForPromise(function() {
            return atom.packages.activatePackage('pigments');
          });
          waitsForPromise(function() {
            return project.initialize();
          });
          return runs(function() {
            spy = jasmine.createSpy('did-change-active-themes');
            atom.themes.onDidChangeActiveThemes(spy);
            return project.setIncludeThemes(true);
          });
        });
        afterEach(function() {
          atom.themes.deactivateThemes();
          return atom.themes.unwatchUserStylesheet();
        });
        it('includes the variables set for ui and syntax themes in the palette', function() {
          return expect(project.getColorVariables().length).toEqual(72);
        });
        it('still includes the paths from the project', function() {
          var i, len, p, results;
          results = [];
          for (i = 0, len = paths.length; i < len; i++) {
            p = paths[i];
            results.push(expect(project.getPaths().indexOf(p)).not.toEqual(-1));
          }
          return results;
        });
        it('serializes the setting with the project', function() {
          var serialized;
          serialized = project.serialize();
          return expect(serialized.includeThemes).toEqual(true);
        });
        describe('and then disabled', function() {
          beforeEach(function() {
            return project.setIncludeThemes(false);
          });
          it('removes all the paths to the themes stylesheets', function() {
            return expect(project.getColorVariables().length).toEqual(10);
          });
          return describe('when the core.themes setting is modified', function() {
            beforeEach(function() {
              spyOn(project, 'loadThemesVariables').andCallThrough();
              atom.config.set('core.themes', ['atom-dark-ui', 'atom-dark-syntax']);
              return waitsFor(function() {
                return spy.callCount > 0;
              });
            });
            return it('does not trigger a paths update', function() {
              return expect(project.loadThemesVariables).not.toHaveBeenCalled();
            });
          });
        });
        return describe('when the core.themes setting is modified', function() {
          beforeEach(function() {
            spyOn(project, 'loadThemesVariables').andCallThrough();
            atom.config.set('core.themes', ['atom-dark-ui', 'atom-dark-syntax']);
            return waitsFor(function() {
              return spy.callCount > 0;
            });
          });
          return it('triggers a paths update', function() {
            return expect(project.loadThemesVariables).toHaveBeenCalled();
          });
        });
      });
    });
    return describe('when restored', function() {
      var createProject;
      createProject = function(params) {
        var stateFixture;
        if (params == null) {
          params = {};
        }
        stateFixture = params.stateFixture;
        delete params.stateFixture;
        if (params.root == null) {
          params.root = rootPath;
        }
        if (params.timestamp == null) {
          params.timestamp = new Date().toJSON();
        }
        if (params.variableMarkers == null) {
          params.variableMarkers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        }
        if (params.colorMarkers == null) {
          params.colorMarkers = [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];
        }
        if (params.version == null) {
          params.version = SERIALIZE_VERSION;
        }
        if (params.markersVersion == null) {
          params.markersVersion = SERIALIZE_MARKERS_VERSION;
        }
        return ColorProject.deserialize(jsonFixture(stateFixture, params));
      };
      describe('with a timestamp more recent than the files last modification date', function() {
        beforeEach(function() {
          project = createProject({
            stateFixture: "empty-project.json"
          });
          return waitsForPromise(function() {
            return project.initialize();
          });
        });
        return it('does not rescans the files', function() {
          return expect(project.getVariables().length).toEqual(1);
        });
      });
      describe('with a version different that the current one', function() {
        beforeEach(function() {
          project = createProject({
            stateFixture: "empty-project.json",
            version: "0.0.0"
          });
          return waitsForPromise(function() {
            return project.initialize();
          });
        });
        return it('drops the whole serialized state and rescans all the project', function() {
          return expect(project.getVariables().length).toEqual(12);
        });
      });
      describe('with a serialized path that no longer exist', function() {
        beforeEach(function() {
          project = createProject({
            stateFixture: "rename-file-project.json"
          });
          return waitsForPromise(function() {
            return project.initialize();
          });
        });
        it('drops drops the non-existing and reload the paths', function() {
          return expect(project.getPaths()).toEqual([rootPath + "/styles/buttons.styl", rootPath + "/styles/variables.styl"]);
        });
        it('drops the variables from the removed paths', function() {
          return expect(project.getVariablesForPath(rootPath + "/styles/foo.styl").length).toEqual(0);
        });
        return it('loads the variables from the new file', function() {
          return expect(project.getVariablesForPath(rootPath + "/styles/variables.styl").length).toEqual(12);
        });
      });
      describe('with a sourceNames setting value different than when serialized', function() {
        beforeEach(function() {
          atom.config.set('pigments.sourceNames', []);
          project = createProject({
            stateFixture: "empty-project.json"
          });
          return waitsForPromise(function() {
            return project.initialize();
          });
        });
        return it('drops the whole serialized state and rescans all the project', function() {
          return expect(project.getVariables().length).toEqual(0);
        });
      });
      describe('with a markers version different that the current one', function() {
        beforeEach(function() {
          project = createProject({
            stateFixture: "empty-project.json",
            markersVersion: "0.0.0"
          });
          return waitsForPromise(function() {
            return project.initialize();
          });
        });
        it('keeps the project related data', function() {
          expect(project.ignoredNames).toEqual(['vendor/*']);
          return expect(project.getPaths()).toEqual([rootPath + "/styles/buttons.styl", rootPath + "/styles/variables.styl"]);
        });
        return it('drops the variables and buffers data', function() {
          return expect(project.getVariables().length).toEqual(TOTAL_VARIABLES_IN_PROJECT);
        });
      });
      describe('with a timestamp older than the files last modification date', function() {
        beforeEach(function() {
          project = createProject({
            timestamp: new Date(0).toJSON(),
            stateFixture: "empty-project.json"
          });
          return waitsForPromise(function() {
            return project.initialize();
          });
        });
        return it('scans again all the files that have a more recent modification date', function() {
          return expect(project.getVariables().length).toEqual(TOTAL_VARIABLES_IN_PROJECT);
        });
      });
      describe('with some files not saved in the project state', function() {
        beforeEach(function() {
          project = createProject({
            stateFixture: "partial-project.json"
          });
          return waitsForPromise(function() {
            return project.initialize();
          });
        });
        return it('detects the new files and scans them', function() {
          return expect(project.getVariables().length).toEqual(12);
        });
      });
      describe('with an open editor and the corresponding buffer state', function() {
        var colorBuffer, editor, ref2;
        ref2 = [], editor = ref2[0], colorBuffer = ref2[1];
        beforeEach(function() {
          waitsForPromise(function() {
            return atom.workspace.open('variables.styl').then(function(o) {
              return editor = o;
            });
          });
          runs(function() {
            project = createProject({
              stateFixture: "open-buffer-project.json",
              id: editor.id
            });
            return spyOn(ColorBuffer.prototype, 'variablesAvailable').andCallThrough();
          });
          return runs(function() {
            return colorBuffer = project.colorBuffersByEditorId[editor.id];
          });
        });
        it('restores the color buffer in its previous state', function() {
          expect(colorBuffer).toBeDefined();
          return expect(colorBuffer.getColorMarkers().length).toEqual(TOTAL_COLORS_VARIABLES_IN_PROJECT);
        });
        return it('does not wait for the project variables', function() {
          return expect(colorBuffer.variablesAvailable).not.toHaveBeenCalled();
        });
      });
      return describe('with an open editor, the corresponding buffer state and a old timestamp', function() {
        var colorBuffer, editor, ref2;
        ref2 = [], editor = ref2[0], colorBuffer = ref2[1];
        beforeEach(function() {
          waitsForPromise(function() {
            return atom.workspace.open('variables.styl').then(function(o) {
              return editor = o;
            });
          });
          runs(function() {
            spyOn(ColorBuffer.prototype, 'updateVariableRanges').andCallThrough();
            return project = createProject({
              timestamp: new Date(0).toJSON(),
              stateFixture: "open-buffer-project.json",
              id: editor.id
            });
          });
          runs(function() {
            return colorBuffer = project.colorBuffersByEditorId[editor.id];
          });
          return waitsFor(function() {
            return colorBuffer.updateVariableRanges.callCount > 0;
          });
        });
        return it('invalidates the color buffer markers as soon as the dirty paths have been determined', function() {
          return expect(colorBuffer.updateVariableRanges).toHaveBeenCalled();
        });
      });
    });
  });

  describe('ColorProject', function() {
    var project, ref1, rootPath;
    ref1 = [], project = ref1[0], rootPath = ref1[1];
    return describe('when the project has a pigments defaults file', function() {
      beforeEach(function() {
        var fixturesPath;
        atom.config.set('pigments.sourceNames', ['*.sass']);
        fixturesPath = atom.project.getPaths()[0];
        rootPath = fixturesPath + "/project-with-defaults";
        atom.project.setPaths([rootPath]);
        project = new ColorProject({});
        return waitsForPromise(function() {
          return project.initialize();
        });
      });
      return it('loads the defaults file content', function() {
        return expect(project.getColorVariables().length).toEqual(12);
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvZGRld2V5Ly5hdG9tL3BhY2thZ2VzL3BpZ21lbnRzL3NwZWMvY29sb3ItcHJvamVjdC1zcGVjLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSOztFQUNMLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUjs7RUFDTCxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBQ1AsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUVQLE1BQWlELE9BQUEsQ0FBUSxpQkFBUixDQUFqRCxFQUFDLHlDQUFELEVBQW9COztFQUNwQixZQUFBLEdBQWUsT0FBQSxDQUFRLHNCQUFSOztFQUNmLFdBQUEsR0FBYyxPQUFBLENBQVEscUJBQVI7O0VBQ2QsV0FBQSxHQUFjLE9BQUEsQ0FBUSxvQkFBUixDQUE2QixDQUFDLFdBQTlCLENBQTBDLFNBQTFDLEVBQXFELFVBQXJEOztFQUNiLFFBQVMsT0FBQSxDQUFRLGtCQUFSOztFQUVWLDBCQUFBLEdBQTZCOztFQUM3QixpQ0FBQSxHQUFvQzs7RUFFcEMsUUFBQSxDQUFTLGNBQVQsRUFBeUIsU0FBQTtBQUN2QixRQUFBO0lBQUEsT0FBZ0QsRUFBaEQsRUFBQyxpQkFBRCxFQUFVLGlCQUFWLEVBQW1CLGtCQUFuQixFQUE2QixlQUE3QixFQUFvQztJQUVwQyxVQUFBLENBQVcsU0FBQTtBQUNULFVBQUE7TUFBQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isc0JBQWhCLEVBQXdDLENBQ3RDLFFBRHNDLENBQXhDO01BR0EsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHVCQUFoQixFQUF5QyxFQUF6QztNQUNBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixpQ0FBaEIsRUFBbUQsQ0FBQyxHQUFELENBQW5EO01BRUMsZUFBZ0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxR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Q0FBd0MsQ0FBQyxnQkFBekMsQ0FBQTtRQUR5RixDQUEzRjtNQWpCa0YsQ0FBcEY7SUFoSXdCLENBQTFCO0VBL3pCdUIsQ0FBekI7O0VBMjlCQSxRQUFBLENBQVMsY0FBVCxFQUF5QixTQUFBO0FBQ3ZCLFFBQUE7SUFBQSxPQUFzQixFQUF0QixFQUFDLGlCQUFELEVBQVU7V0FDVixRQUFBLENBQVMsK0NBQVQsRUFBMEQsU0FBQTtNQUN4RCxVQUFBLENBQVcsU0FBQTtBQUNULFlBQUE7UUFBQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isc0JBQWhCLEVBQXdDLENBQUMsUUFBRCxDQUF4QztRQUVDLGVBQWdCLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBYixDQUFBO1FBQ2pCLFFBQUEsR0FBYyxZQUFELEdBQWM7UUFDM0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFiLENBQXNCLENBQUMsUUFBRCxDQUF0QjtRQUVBLE9BQUEsR0FBYyxJQUFBLFlBQUEsQ0FBYSxFQUFiO2VBRWQsZUFBQSxDQUFnQixTQUFBO2lCQUFHLE9BQU8sQ0FBQyxVQUFSLENBQUE7UUFBSCxDQUFoQjtNQVRTLENBQVg7YUFXQSxFQUFBLENBQUcsaUNBQUgsRUFBc0MsU0FBQTtlQUNwQyxNQUFBLENBQU8sT0FBTyxDQUFDLGlCQUFSLENBQUEsQ0FBMkIsQ0FBQyxNQUFuQyxDQUEwQyxDQUFDLE9BQTNDLENBQW1ELEVBQW5EO01BRG9DLENBQXRDO0lBWndELENBQTFEO0VBRnVCLENBQXpCO0FBeitCQSIsInNvdXJjZXNDb250ZW50IjpbIm9zID0gcmVxdWlyZSAnb3MnXG5mcyA9IHJlcXVpcmUgJ2ZzLXBsdXMnXG5wYXRoID0gcmVxdWlyZSAncGF0aCdcbnRlbXAgPSByZXF1aXJlICd0ZW1wJ1xuXG57U0VSSUFMSVpFX1ZFUlNJT04sIFNFUklBTElaRV9NQVJLRVJTX1ZFUlNJT059ID0gcmVxdWlyZSAnLi4vbGliL3ZlcnNpb25zJ1xuQ29sb3JQcm9qZWN0ID0gcmVxdWlyZSAnLi4vbGliL2NvbG9yLXByb2plY3QnXG5Db2xvckJ1ZmZlciA9IHJlcXVpcmUgJy4uL2xpYi9jb2xvci1idWZmZXInXG5qc29uRml4dHVyZSA9IHJlcXVpcmUoJy4vaGVscGVycy9maXh0dXJlcycpLmpzb25GaXh0dXJlKF9fZGlybmFtZSwgJ2ZpeHR1cmVzJylcbntjbGlja30gPSByZXF1aXJlICcuL2hlbHBlcnMvZXZlbnRzJ1xuXG5UT1RBTF9WQVJJQUJMRVNfSU5fUFJPSkVDVCA9IDEyXG5UT1RBTF9DT0xPUlNfVkFSSUFCTEVTX0lOX1BST0pFQ1QgPSAxMFxuXG5kZXNjcmliZSAnQ29sb3JQcm9qZWN0JywgLT5cbiAgW3Byb2plY3QsIHByb21pc2UsIHJvb3RQYXRoLCBwYXRocywgZXZlbnRTcHldID0gW11cblxuICBiZWZvcmVFYWNoIC0+XG4gICAgYXRvbS5jb25maWcuc2V0ICdwaWdtZW50cy5zb3VyY2VOYW1lcycsIFtcbiAgICAgICcqLnN0eWwnXG4gICAgXVxuICAgIGF0b20uY29uZmlnLnNldCAncGlnbWVudHMuaWdub3JlZE5hbWVzJywgW11cbiAgICBhdG9tLmNvbmZpZy5zZXQgJ3BpZ21lbnRzLmZpbGV0eXBlc0ZvckNvbG9yV29yZHMnLCBbJyonXVxuXG4gICAgW2ZpeHR1cmVzUGF0aF0gPSBhdG9tLnByb2plY3QuZ2V0UGF0aHMoKVxuICAgIHJvb3RQYXRoID0gXCIje2ZpeHR1cmVzUGF0aH0vcHJvamVjdFwiXG4gICAgYXRvbS5wcm9qZWN0LnNldFBhdGhzKFtyb290UGF0aF0pXG5cbiAgICBwcm9qZWN0ID0gbmV3IENvbG9yUHJvamVjdCh7XG4gICAgICBpZ25vcmVkTmFtZXM6IFsndmVuZG9yLyonXVxuICAgICAgc291cmNlTmFtZXM6IFsnKi5sZXNzJ11cbiAgICAgIGlnbm9yZWRTY29wZXM6IFsnXFxcXC5jb21tZW50J11cbiAgICB9KVxuXG4gIGFmdGVyRWFjaCAtPlxuICAgIHByb2plY3QuZGVzdHJveSgpXG5cbiAgZGVzY3JpYmUgJy5kZXNlcmlhbGl6ZScsIC0+XG4gICAgaXQgJ3Jlc3RvcmVzIHRoZSBwcm9qZWN0IGluIGl0cyBwcmV2aW91cyBzdGF0ZScsIC0+XG4gICAgICBkYXRhID1cbiAgICAgICAgcm9vdDogcm9vdFBhdGhcbiAgICAgICAgdGltZXN0YW1wOiBuZXcgRGF0ZSgpLnRvSlNPTigpXG4gICAgICAgIHZlcnNpb246IFNFUklBTElaRV9WRVJTSU9OXG4gICAgICAgIG1hcmtlcnNWZXJzaW9uOiBTRVJJQUxJWkVfTUFSS0VSU19WRVJTSU9OXG5cbiAgICAgIGpzb24gPSBqc29uRml4dHVyZSAnYmFzZS1wcm9qZWN0Lmpzb24nLCBkYXRhXG4gICAgICBwcm9qZWN0ID0gQ29sb3JQcm9qZWN0LmRlc2VyaWFsaXplKGpzb24pXG5cbiAgICAgIGV4cGVjdChwcm9qZWN0KS50b0JlRGVmaW5lZCgpXG4gICAgICBleHBlY3QocHJvamVjdC5nZXRQYXRocygpKS50b0VxdWFsKFtcbiAgICAgICAgXCIje3Jvb3RQYXRofS9zdHlsZXMvYnV0dG9ucy5zdHlsXCJcbiAgICAgICAgXCIje3Jvb3RQYXRofS9zdHlsZXMvdmFyaWFibGVzLnN0eWxcIlxuICAgICAgXSlcbiAgICAgIGV4cGVjdChwcm9qZWN0LmdldFZhcmlhYmxlcygpLmxlbmd0aCkudG9FcXVhbChUT1RBTF9WQVJJQUJMRVNfSU5fUFJPSkVDVClcbiAgICAgIGV4cGVjdChwcm9qZWN0LmdldENvbG9yVmFyaWFibGVzKCkubGVuZ3RoKS50b0VxdWFsKFRPVEFMX0NPTE9SU19WQVJJQUJMRVNfSU5fUFJPSkVDVClcblxuICBkZXNjcmliZSAnOjppbml0aWFsaXplJywgLT5cbiAgICBiZWZvcmVFYWNoIC0+XG4gICAgICBldmVudFNweSA9IGphc21pbmUuY3JlYXRlU3B5KCdkaWQtaW5pdGlhbGl6ZScpXG4gICAgICBwcm9qZWN0Lm9uRGlkSW5pdGlhbGl6ZShldmVudFNweSlcbiAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPiBwcm9qZWN0LmluaXRpYWxpemUoKVxuXG4gICAgaXQgJ2xvYWRzIHRoZSBwYXRocyB0byBzY2FuIGluIHRoZSBwcm9qZWN0JywgLT5cbiAgICAgIGV4cGVjdChwcm9qZWN0LmdldFBhdGhzKCkpLnRvRXF1YWwoW1xuICAgICAgICBcIiN7cm9vdFBhdGh9L3N0eWxlcy9idXR0b25zLnN0eWxcIlxuICAgICAgICBcIiN7cm9vdFBhdGh9L3N0eWxlcy92YXJpYWJsZXMuc3R5bFwiXG4gICAgICBdKVxuXG4gICAgaXQgJ3NjYW5zIHRoZSBsb2FkZWQgcGF0aHMgdG8gcmV0cmlldmUgdGhlIHZhcmlhYmxlcycsIC0+XG4gICAgICBleHBlY3QocHJvamVjdC5nZXRWYXJpYWJsZXMoKSkudG9CZURlZmluZWQoKVxuICAgICAgZXhwZWN0KHByb2plY3QuZ2V0VmFyaWFibGVzKCkubGVuZ3RoKS50b0VxdWFsKFRPVEFMX1ZBUklBQkxFU19JTl9QUk9KRUNUKVxuXG4gICAgaXQgJ2Rpc3BhdGNoZXMgYSBkaWQtaW5pdGlhbGl6ZSBldmVudCcsIC0+XG4gICAgICBleHBlY3QoZXZlbnRTcHkpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuXG4gIGRlc2NyaWJlICc6OmZpbmRBbGxDb2xvcnMnLCAtPlxuICAgIGl0ICdyZXR1cm5zIGFsbCB0aGUgY29sb3JzIGluIHRoZSBsZWdpYmxlcyBmaWxlcyBvZiB0aGUgcHJvamVjdCcsIC0+XG4gICAgICBzZWFyY2ggPSBwcm9qZWN0LmZpbmRBbGxDb2xvcnMoKVxuICAgICAgZXhwZWN0KHNlYXJjaCkudG9CZURlZmluZWQoKVxuXG4gICMjICAgICMjICAgICAjIyAgICAjIyMgICAgIyMjIyMjIyMgICAjIyMjIyMgICAgICMjICAgICMjICAjIyMjIyMjICAjIyMjIyMjI1xuICAjIyAgICAjIyAgICAgIyMgICAjIyAjIyAgICMjICAgICAjIyAjIyAgICAjIyAgICAjIyMgICAjIyAjIyAgICAgIyMgICAgIyNcbiAgIyMgICAgIyMgICAgICMjICAjIyAgICMjICAjIyAgICAgIyMgIyMgICAgICAgICAgIyMjIyAgIyMgIyMgICAgICMjICAgICMjXG4gICMjICAgICMjICAgICAjIyAjIyAgICAgIyMgIyMjIyMjIyMgICAjIyMjIyMgICAgICMjICMjICMjICMjICAgICAjIyAgICAjI1xuICAjIyAgICAgIyMgICAjIyAgIyMjIyMjIyMjICMjICAgIyMgICAgICAgICAjIyAgICAjIyAgIyMjIyAjIyAgICAgIyMgICAgIyNcbiAgIyMgICAgICAjIyAjIyAgICMjICAgICAjIyAjIyAgICAjIyAgIyMgICAgIyMgICAgIyMgICAjIyMgIyMgICAgICMjICAgICMjXG4gICMjICAgICAgICMjIyAgICAjIyAgICAgIyMgIyMgICAgICMjICAjIyMjIyMgICAgICMjICAgICMjICAjIyMjIyMjICAgICAjI1xuICAjI1xuICAjIyAgICAjIyAgICAgICAgIyMjIyMjIyAgICAgIyMjICAgICMjIyMjIyMjICAjIyMjIyMjIyAjIyMjIyMjI1xuICAjIyAgICAjIyAgICAgICAjIyAgICAgIyMgICAjIyAjIyAgICMjICAgICAjIyAjIyAgICAgICAjIyAgICAgIyNcbiAgIyMgICAgIyMgICAgICAgIyMgICAgICMjICAjIyAgICMjICAjIyAgICAgIyMgIyMgICAgICAgIyMgICAgICMjXG4gICMjICAgICMjICAgICAgICMjICAgICAjIyAjIyAgICAgIyMgIyMgICAgICMjICMjIyMjIyAgICMjICAgICAjI1xuICAjIyAgICAjIyAgICAgICAjIyAgICAgIyMgIyMjIyMjIyMjICMjICAgICAjIyAjIyAgICAgICAjIyAgICAgIyNcbiAgIyMgICAgIyMgICAgICAgIyMgICAgICMjICMjICAgICAjIyAjIyAgICAgIyMgIyMgICAgICAgIyMgICAgICMjXG4gICMjICAgICMjIyMjIyMjICAjIyMjIyMjICAjIyAgICAgIyMgIyMjIyMjIyMgICMjIyMjIyMjICMjIyMjIyMjXG5cbiAgZGVzY3JpYmUgJ3doZW4gdGhlIHZhcmlhYmxlcyBoYXZlIG5vdCBiZWVuIGxvYWRlZCB5ZXQnLCAtPlxuICAgIGRlc2NyaWJlICc6OnNlcmlhbGl6ZScsIC0+XG4gICAgICBpdCAncmV0dXJucyBhbiBvYmplY3Qgd2l0aG91dCBwYXRocyBub3IgdmFyaWFibGVzJywgLT5cbiAgICAgICAgZGF0ZSA9IG5ldyBEYXRlXG4gICAgICAgIHNweU9uKHByb2plY3QsICdnZXRUaW1lc3RhbXAnKS5hbmRDYWxsRmFrZSAtPiBkYXRlXG4gICAgICAgIGV4cGVjdGVkID0ge1xuICAgICAgICAgIGRlc2VyaWFsaXplcjogJ0NvbG9yUHJvamVjdCdcbiAgICAgICAgICB0aW1lc3RhbXA6IGRhdGVcbiAgICAgICAgICB2ZXJzaW9uOiBTRVJJQUxJWkVfVkVSU0lPTlxuICAgICAgICAgIG1hcmtlcnNWZXJzaW9uOiBTRVJJQUxJWkVfTUFSS0VSU19WRVJTSU9OXG4gICAgICAgICAgZ2xvYmFsU291cmNlTmFtZXM6IFsnKi5zdHlsJ11cbiAgICAgICAgICBnbG9iYWxJZ25vcmVkTmFtZXM6IFtdXG4gICAgICAgICAgaWdub3JlZE5hbWVzOiBbJ3ZlbmRvci8qJ11cbiAgICAgICAgICBzb3VyY2VOYW1lczogWycqLmxlc3MnXVxuICAgICAgICAgIGlnbm9yZWRTY29wZXM6IFsnXFxcXC5jb21tZW50J11cbiAgICAgICAgICBidWZmZXJzOiB7fVxuICAgICAgICB9XG4gICAgICAgIGV4cGVjdChwcm9qZWN0LnNlcmlhbGl6ZSgpKS50b0VxdWFsKGV4cGVjdGVkKVxuXG4gICAgZGVzY3JpYmUgJzo6Z2V0VmFyaWFibGVzRm9yUGF0aCcsIC0+XG4gICAgICBpdCAncmV0dXJucyB1bmRlZmluZWQnLCAtPlxuICAgICAgICBleHBlY3QocHJvamVjdC5nZXRWYXJpYWJsZXNGb3JQYXRoKFwiI3tyb290UGF0aH0vc3R5bGVzL3ZhcmlhYmxlcy5zdHlsXCIpKS50b0VxdWFsKFtdKVxuXG4gICAgZGVzY3JpYmUgJzo6Z2V0VmFyaWFibGVCeU5hbWUnLCAtPlxuICAgICAgaXQgJ3JldHVybnMgdW5kZWZpbmVkJywgLT5cbiAgICAgICAgZXhwZWN0KHByb2plY3QuZ2V0VmFyaWFibGVCeU5hbWUoXCJmb29cIikpLnRvQmVVbmRlZmluZWQoKVxuXG4gICAgZGVzY3JpYmUgJzo6Z2V0VmFyaWFibGVCeUlkJywgLT5cbiAgICAgIGl0ICdyZXR1cm5zIHVuZGVmaW5lZCcsIC0+XG4gICAgICAgIGV4cGVjdChwcm9qZWN0LmdldFZhcmlhYmxlQnlJZCgwKSkudG9CZVVuZGVmaW5lZCgpXG5cbiAgICBkZXNjcmliZSAnOjpnZXRDb250ZXh0JywgLT5cbiAgICAgIGl0ICdyZXR1cm5zIGFuIGVtcHR5IGNvbnRleHQnLCAtPlxuICAgICAgICBleHBlY3QocHJvamVjdC5nZXRDb250ZXh0KCkpLnRvQmVEZWZpbmVkKClcbiAgICAgICAgZXhwZWN0KHByb2plY3QuZ2V0Q29udGV4dCgpLmdldFZhcmlhYmxlc0NvdW50KCkpLnRvRXF1YWwoMClcblxuICAgIGRlc2NyaWJlICc6OmdldFBhbGV0dGUnLCAtPlxuICAgICAgaXQgJ3JldHVybnMgYW4gZW1wdHkgcGFsZXR0ZScsIC0+XG4gICAgICAgIGV4cGVjdChwcm9qZWN0LmdldFBhbGV0dGUoKSkudG9CZURlZmluZWQoKVxuICAgICAgICBleHBlY3QocHJvamVjdC5nZXRQYWxldHRlKCkuZ2V0Q29sb3JzQ291bnQoKSkudG9FcXVhbCgwKVxuXG4gICAgZGVzY3JpYmUgJzo6cmVsb2FkVmFyaWFibGVzRm9yUGF0aCcsIC0+XG4gICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgIHNweU9uKHByb2plY3QsICdpbml0aWFsaXplJykuYW5kQ2FsbFRocm91Z2goKVxuXG4gICAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgICAgIHByb2plY3QucmVsb2FkVmFyaWFibGVzRm9yUGF0aChcIiN7cm9vdFBhdGh9L3N0eWxlcy92YXJpYWJsZXMuc3R5bFwiKVxuXG4gICAgICBpdCAncmV0dXJucyBhIHByb21pc2UgaG9va2VkIG9uIHRoZSBpbml0aWFsaXplIHByb21pc2UnLCAtPlxuICAgICAgICBleHBlY3QocHJvamVjdC5pbml0aWFsaXplKS50b0hhdmVCZWVuQ2FsbGVkKClcblxuICAgIGRlc2NyaWJlICc6OnNldElnbm9yZWROYW1lcycsIC0+XG4gICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgIHByb2plY3Quc2V0SWdub3JlZE5hbWVzKFtdKVxuXG4gICAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPiBwcm9qZWN0LmluaXRpYWxpemUoKVxuXG4gICAgICBpdCAnaW5pdGlhbGl6ZXMgdGhlIHByb2plY3Qgd2l0aCB0aGUgbmV3IHBhdGhzJywgLT5cbiAgICAgICAgZXhwZWN0KHByb2plY3QuZ2V0VmFyaWFibGVzKCkubGVuZ3RoKS50b0VxdWFsKDMyKVxuXG4gICAgZGVzY3JpYmUgJzo6c2V0U291cmNlTmFtZXMnLCAtPlxuICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICBwcm9qZWN0LnNldFNvdXJjZU5hbWVzKFtdKVxuXG4gICAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPiBwcm9qZWN0LmluaXRpYWxpemUoKVxuXG4gICAgICBpdCAnaW5pdGlhbGl6ZXMgdGhlIHByb2plY3Qgd2l0aCB0aGUgbmV3IHBhdGhzJywgLT5cbiAgICAgICAgZXhwZWN0KHByb2plY3QuZ2V0VmFyaWFibGVzKCkubGVuZ3RoKS50b0VxdWFsKDEyKVxuXG4gICMjICAgICMjICAgICAjIyAgICAjIyMgICAgIyMjIyMjIyMgICAjIyMjIyNcbiAgIyMgICAgIyMgICAgICMjICAgIyMgIyMgICAjIyAgICAgIyMgIyMgICAgIyNcbiAgIyMgICAgIyMgICAgICMjICAjIyAgICMjICAjIyAgICAgIyMgIyNcbiAgIyMgICAgIyMgICAgICMjICMjICAgICAjIyAjIyMjIyMjIyAgICMjIyMjI1xuICAjIyAgICAgIyMgICAjIyAgIyMjIyMjIyMjICMjICAgIyMgICAgICAgICAjI1xuICAjIyAgICAgICMjICMjICAgIyMgICAgICMjICMjICAgICMjICAjIyAgICAjI1xuICAjIyAgICAgICAjIyMgICAgIyMgICAgICMjICMjICAgICAjIyAgIyMjIyMjXG4gICMjXG4gICMjICAgICMjICAgICAgICAjIyMjIyMjICAgICAjIyMgICAgIyMjIyMjIyMgICMjIyMjIyMjICMjIyMjIyMjXG4gICMjICAgICMjICAgICAgICMjICAgICAjIyAgICMjICMjICAgIyMgICAgICMjICMjICAgICAgICMjICAgICAjI1xuICAjIyAgICAjIyAgICAgICAjIyAgICAgIyMgICMjICAgIyMgICMjICAgICAjIyAjIyAgICAgICAjIyAgICAgIyNcbiAgIyMgICAgIyMgICAgICAgIyMgICAgICMjICMjICAgICAjIyAjIyAgICAgIyMgIyMjIyMjICAgIyMgICAgICMjXG4gICMjICAgICMjICAgICAgICMjICAgICAjIyAjIyMjIyMjIyMgIyMgICAgICMjICMjICAgICAgICMjICAgICAjI1xuICAjIyAgICAjIyAgICAgICAjIyAgICAgIyMgIyMgICAgICMjICMjICAgICAjIyAjIyAgICAgICAjIyAgICAgIyNcbiAgIyMgICAgIyMjIyMjIyMgICMjIyMjIyMgICMjICAgICAjIyAjIyMjIyMjIyAgIyMjIyMjIyMgIyMjIyMjIyNcblxuICBkZXNjcmliZSAnd2hlbiB0aGUgcHJvamVjdCBoYXMgbm8gdmFyaWFibGVzIHNvdXJjZSBmaWxlcycsIC0+XG4gICAgYmVmb3JlRWFjaCAtPlxuICAgICAgYXRvbS5jb25maWcuc2V0ICdwaWdtZW50cy5zb3VyY2VOYW1lcycsIFsnKi5zYXNzJ11cblxuICAgICAgW2ZpeHR1cmVzUGF0aF0gPSBhdG9tLnByb2plY3QuZ2V0UGF0aHMoKVxuICAgICAgcm9vdFBhdGggPSBcIiN7Zml4dHVyZXNQYXRofS1uby1zb3VyY2VzXCJcbiAgICAgIGF0b20ucHJvamVjdC5zZXRQYXRocyhbcm9vdFBhdGhdKVxuXG4gICAgICBwcm9qZWN0ID0gbmV3IENvbG9yUHJvamVjdCh7fSlcblxuICAgICAgd2FpdHNGb3JQcm9taXNlIC0+IHByb2plY3QuaW5pdGlhbGl6ZSgpXG5cbiAgICBpdCAnaW5pdGlhbGl6ZXMgdGhlIHBhdGhzIHdpdGggYW4gZW1wdHkgYXJyYXknLCAtPlxuICAgICAgZXhwZWN0KHByb2plY3QuZ2V0UGF0aHMoKSkudG9FcXVhbChbXSlcblxuICAgIGl0ICdpbml0aWFsaXplcyB0aGUgdmFyaWFibGVzIHdpdGggYW4gZW1wdHkgYXJyYXknLCAtPlxuICAgICAgZXhwZWN0KHByb2plY3QuZ2V0VmFyaWFibGVzKCkpLnRvRXF1YWwoW10pXG5cbiAgZGVzY3JpYmUgJ3doZW4gdGhlIHByb2plY3QgaGFzIGN1c3RvbSBzb3VyY2UgbmFtZXMgZGVmaW5lZCcsIC0+XG4gICAgYmVmb3JlRWFjaCAtPlxuICAgICAgYXRvbS5jb25maWcuc2V0ICdwaWdtZW50cy5zb3VyY2VOYW1lcycsIFsnKi5zYXNzJ11cblxuICAgICAgW2ZpeHR1cmVzUGF0aF0gPSBhdG9tLnByb2plY3QuZ2V0UGF0aHMoKVxuXG4gICAgICBwcm9qZWN0ID0gbmV3IENvbG9yUHJvamVjdCh7c291cmNlTmFtZXM6IFsnKi5zdHlsJ119KVxuXG4gICAgICB3YWl0c0ZvclByb21pc2UgLT4gcHJvamVjdC5pbml0aWFsaXplKClcblxuICAgIGl0ICdpbml0aWFsaXplcyB0aGUgcGF0aHMgd2l0aCBhbiBlbXB0eSBhcnJheScsIC0+XG4gICAgICBleHBlY3QocHJvamVjdC5nZXRQYXRocygpLmxlbmd0aCkudG9FcXVhbCgyKVxuXG4gICAgaXQgJ2luaXRpYWxpemVzIHRoZSB2YXJpYWJsZXMgd2l0aCBhbiBlbXB0eSBhcnJheScsIC0+XG4gICAgICBleHBlY3QocHJvamVjdC5nZXRWYXJpYWJsZXMoKS5sZW5ndGgpLnRvRXF1YWwoVE9UQUxfVkFSSUFCTEVTX0lOX1BST0pFQ1QpXG4gICAgICBleHBlY3QocHJvamVjdC5nZXRDb2xvclZhcmlhYmxlcygpLmxlbmd0aCkudG9FcXVhbChUT1RBTF9DT0xPUlNfVkFSSUFCTEVTX0lOX1BST0pFQ1QpXG5cbiAgZGVzY3JpYmUgJ3doZW4gdGhlIHByb2plY3QgaGFzIGxvb3BpbmcgdmFyaWFibGUgZGVmaW5pdGlvbicsIC0+XG4gICAgYmVmb3JlRWFjaCAtPlxuICAgICAgYXRvbS5jb25maWcuc2V0ICdwaWdtZW50cy5zb3VyY2VOYW1lcycsIFsnKi5zYXNzJ11cblxuICAgICAgW2ZpeHR1cmVzUGF0aF0gPSBhdG9tLnByb2plY3QuZ2V0UGF0aHMoKVxuICAgICAgcm9vdFBhdGggPSBcIiN7Zml4dHVyZXNQYXRofS13aXRoLXJlY3Vyc2lvblwiXG4gICAgICBhdG9tLnByb2plY3Quc2V0UGF0aHMoW3Jvb3RQYXRoXSlcblxuICAgICAgcHJvamVjdCA9IG5ldyBDb2xvclByb2plY3Qoe30pXG5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPiBwcm9qZWN0LmluaXRpYWxpemUoKVxuXG4gICAgaXQgJ2lnbm9yZXMgdGhlIGxvb3BpbmcgZGVmaW5pdGlvbicsIC0+XG4gICAgICBleHBlY3QocHJvamVjdC5nZXRWYXJpYWJsZXMoKS5sZW5ndGgpLnRvRXF1YWwoNSlcbiAgICAgIGV4cGVjdChwcm9qZWN0LmdldENvbG9yVmFyaWFibGVzKCkubGVuZ3RoKS50b0VxdWFsKDUpXG5cbiAgZGVzY3JpYmUgJ3doZW4gdGhlIHZhcmlhYmxlcyBoYXZlIGJlZW4gbG9hZGVkJywgLT5cbiAgICBiZWZvcmVFYWNoIC0+XG4gICAgICB3YWl0c0ZvclByb21pc2UgLT4gcHJvamVjdC5pbml0aWFsaXplKClcblxuICAgIGRlc2NyaWJlICc6OnNlcmlhbGl6ZScsIC0+XG4gICAgICBpdCAncmV0dXJucyBhbiBvYmplY3Qgd2l0aCBwcm9qZWN0IHByb3BlcnRpZXMnLCAtPlxuICAgICAgICBkYXRlID0gbmV3IERhdGVcbiAgICAgICAgc3B5T24ocHJvamVjdCwgJ2dldFRpbWVzdGFtcCcpLmFuZENhbGxGYWtlIC0+IGRhdGVcbiAgICAgICAgZXhwZWN0KHByb2plY3Quc2VyaWFsaXplKCkpLnRvRXF1YWwoe1xuICAgICAgICAgIGRlc2VyaWFsaXplcjogJ0NvbG9yUHJvamVjdCdcbiAgICAgICAgICBpZ25vcmVkTmFtZXM6IFsndmVuZG9yLyonXVxuICAgICAgICAgIHNvdXJjZU5hbWVzOiBbJyoubGVzcyddXG4gICAgICAgICAgaWdub3JlZFNjb3BlczogWydcXFxcLmNvbW1lbnQnXVxuICAgICAgICAgIHRpbWVzdGFtcDogZGF0ZVxuICAgICAgICAgIHZlcnNpb246IFNFUklBTElaRV9WRVJTSU9OXG4gICAgICAgICAgbWFya2Vyc1ZlcnNpb246IFNFUklBTElaRV9NQVJLRVJTX1ZFUlNJT05cbiAgICAgICAgICBwYXRoczogW1xuICAgICAgICAgICAgXCIje3Jvb3RQYXRofS9zdHlsZXMvYnV0dG9ucy5zdHlsXCJcbiAgICAgICAgICAgIFwiI3tyb290UGF0aH0vc3R5bGVzL3ZhcmlhYmxlcy5zdHlsXCJcbiAgICAgICAgICBdXG4gICAgICAgICAgZ2xvYmFsU291cmNlTmFtZXM6IFsnKi5zdHlsJ11cbiAgICAgICAgICBnbG9iYWxJZ25vcmVkTmFtZXM6IFtdXG4gICAgICAgICAgYnVmZmVyczoge31cbiAgICAgICAgICB2YXJpYWJsZXM6IHByb2plY3QudmFyaWFibGVzLnNlcmlhbGl6ZSgpXG4gICAgICAgIH0pXG5cbiAgICBkZXNjcmliZSAnOjpnZXRWYXJpYWJsZXNGb3JQYXRoJywgLT5cbiAgICAgIGl0ICdyZXR1cm5zIHRoZSB2YXJpYWJsZXMgZGVmaW5lZCBpbiB0aGUgZmlsZScsIC0+XG4gICAgICAgIGV4cGVjdChwcm9qZWN0LmdldFZhcmlhYmxlc0ZvclBhdGgoXCIje3Jvb3RQYXRofS9zdHlsZXMvdmFyaWFibGVzLnN0eWxcIikubGVuZ3RoKS50b0VxdWFsKFRPVEFMX1ZBUklBQkxFU19JTl9QUk9KRUNUKVxuXG4gICAgICBkZXNjcmliZSAnZm9yIGEgZmlsZSB0aGF0IHdhcyBpZ25vcmVkIGluIHRoZSBzY2FubmluZyBwcm9jZXNzJywgLT5cbiAgICAgICAgaXQgJ3JldHVybnMgdW5kZWZpbmVkJywgLT5cbiAgICAgICAgICBleHBlY3QocHJvamVjdC5nZXRWYXJpYWJsZXNGb3JQYXRoKFwiI3tyb290UGF0aH0vdmVuZG9yL2Nzcy92YXJpYWJsZXMubGVzc1wiKSkudG9FcXVhbChbXSlcblxuICAgIGRlc2NyaWJlICc6OmRlbGV0ZVZhcmlhYmxlc0ZvclBhdGgnLCAtPlxuICAgICAgaXQgJ3JlbW92ZXMgYWxsIHRoZSB2YXJpYWJsZXMgY29taW5nIGZyb20gdGhlIHNwZWNpZmllZCBmaWxlJywgLT5cbiAgICAgICAgcHJvamVjdC5kZWxldGVWYXJpYWJsZXNGb3JQYXRoKFwiI3tyb290UGF0aH0vc3R5bGVzL3ZhcmlhYmxlcy5zdHlsXCIpXG5cbiAgICAgICAgZXhwZWN0KHByb2plY3QuZ2V0VmFyaWFibGVzRm9yUGF0aChcIiN7cm9vdFBhdGh9L3N0eWxlcy92YXJpYWJsZXMuc3R5bFwiKSkudG9FcXVhbChbXSlcblxuICAgIGRlc2NyaWJlICc6OmdldENvbnRleHQnLCAtPlxuICAgICAgaXQgJ3JldHVybnMgYSBjb250ZXh0IHdpdGggdGhlIHByb2plY3QgdmFyaWFibGVzJywgLT5cbiAgICAgICAgZXhwZWN0KHByb2plY3QuZ2V0Q29udGV4dCgpKS50b0JlRGVmaW5lZCgpXG4gICAgICAgIGV4cGVjdChwcm9qZWN0LmdldENvbnRleHQoKS5nZXRWYXJpYWJsZXNDb3VudCgpKS50b0VxdWFsKFRPVEFMX1ZBUklBQkxFU19JTl9QUk9KRUNUKVxuXG4gICAgZGVzY3JpYmUgJzo6Z2V0UGFsZXR0ZScsIC0+XG4gICAgICBpdCAncmV0dXJucyBhIHBhbGV0dGUgd2l0aCB0aGUgY29sb3JzIGZyb20gdGhlIHByb2plY3QnLCAtPlxuICAgICAgICBleHBlY3QocHJvamVjdC5nZXRQYWxldHRlKCkpLnRvQmVEZWZpbmVkKClcbiAgICAgICAgZXhwZWN0KHByb2plY3QuZ2V0UGFsZXR0ZSgpLmdldENvbG9yc0NvdW50KCkpLnRvRXF1YWwoMTApXG5cbiAgICBkZXNjcmliZSAnOjpzaG93VmFyaWFibGVJbkZpbGUnLCAtPlxuICAgICAgaXQgJ29wZW5zIHRoZSBmaWxlIHdoZXJlIGlzIGxvY2F0ZWQgdGhlIHZhcmlhYmxlJywgLT5cbiAgICAgICAgc3B5ID0gamFzbWluZS5jcmVhdGVTcHkoJ2RpZC1hZGQtdGV4dC1lZGl0b3InKVxuICAgICAgICBhdG9tLndvcmtzcGFjZS5vbkRpZEFkZFRleHRFZGl0b3Ioc3B5KVxuXG4gICAgICAgIHByb2plY3Quc2hvd1ZhcmlhYmxlSW5GaWxlKHByb2plY3QuZ2V0VmFyaWFibGVzKClbMF0pXG5cbiAgICAgICAgd2FpdHNGb3IgLT4gc3B5LmNhbGxDb3VudCA+IDBcblxuICAgICAgICBydW5zIC0+XG4gICAgICAgICAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG5cbiAgICAgICAgICBleHBlY3QoZWRpdG9yLmdldFNlbGVjdGVkQnVmZmVyUmFuZ2UoKSkudG9FcXVhbChbWzEsMl0sWzEsMTRdXSlcblxuICAgIGRlc2NyaWJlICc6OnJlbG9hZFZhcmlhYmxlc0ZvclBhdGgnLCAtPlxuICAgICAgZGVzY3JpYmUgJ2ZvciBhIGZpbGUgdGhhdCBpcyBwYXJ0IG9mIHRoZSBsb2FkZWQgcGF0aHMnLCAtPlxuICAgICAgICBkZXNjcmliZSAnd2hlcmUgdGhlIHJlbG9hZCBmaW5kcyBuZXcgdmFyaWFibGVzJywgLT5cbiAgICAgICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgICAgICBwcm9qZWN0LmRlbGV0ZVZhcmlhYmxlc0ZvclBhdGgoXCIje3Jvb3RQYXRofS9zdHlsZXMvdmFyaWFibGVzLnN0eWxcIilcblxuICAgICAgICAgICAgZXZlbnRTcHkgPSBqYXNtaW5lLmNyZWF0ZVNweSgnZGlkLXVwZGF0ZS12YXJpYWJsZXMnKVxuICAgICAgICAgICAgcHJvamVjdC5vbkRpZFVwZGF0ZVZhcmlhYmxlcyhldmVudFNweSlcbiAgICAgICAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPiBwcm9qZWN0LnJlbG9hZFZhcmlhYmxlc0ZvclBhdGgoXCIje3Jvb3RQYXRofS9zdHlsZXMvdmFyaWFibGVzLnN0eWxcIilcblxuICAgICAgICAgIGl0ICdzY2FucyBhZ2FpbiB0aGUgZmlsZSB0byBmaW5kIHZhcmlhYmxlcycsIC0+XG4gICAgICAgICAgICBleHBlY3QocHJvamVjdC5nZXRWYXJpYWJsZXMoKS5sZW5ndGgpLnRvRXF1YWwoVE9UQUxfVkFSSUFCTEVTX0lOX1BST0pFQ1QpXG5cbiAgICAgICAgICBpdCAnZGlzcGF0Y2hlcyBhIGRpZC11cGRhdGUtdmFyaWFibGVzIGV2ZW50JywgLT5cbiAgICAgICAgICAgIGV4cGVjdChldmVudFNweSkudG9IYXZlQmVlbkNhbGxlZCgpXG5cbiAgICAgICAgZGVzY3JpYmUgJ3doZXJlIHRoZSByZWxvYWQgZmluZHMgbm90aGluZyBuZXcnLCAtPlxuICAgICAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgICAgIGV2ZW50U3B5ID0gamFzbWluZS5jcmVhdGVTcHkoJ2RpZC11cGRhdGUtdmFyaWFibGVzJylcbiAgICAgICAgICAgIHByb2plY3Qub25EaWRVcGRhdGVWYXJpYWJsZXMoZXZlbnRTcHkpXG4gICAgICAgICAgICB3YWl0c0ZvclByb21pc2UgLT4gcHJvamVjdC5yZWxvYWRWYXJpYWJsZXNGb3JQYXRoKFwiI3tyb290UGF0aH0vc3R5bGVzL3ZhcmlhYmxlcy5zdHlsXCIpXG5cbiAgICAgICAgICBpdCAnbGVhdmVzIHRoZSBmaWxlIHZhcmlhYmxlcyBpbnRhY3QnLCAtPlxuICAgICAgICAgICAgZXhwZWN0KHByb2plY3QuZ2V0VmFyaWFibGVzKCkubGVuZ3RoKS50b0VxdWFsKFRPVEFMX1ZBUklBQkxFU19JTl9QUk9KRUNUKVxuXG4gICAgICAgICAgaXQgJ2RvZXMgbm90IGRpc3BhdGNoIGEgZGlkLXVwZGF0ZS12YXJpYWJsZXMgZXZlbnQnLCAtPlxuICAgICAgICAgICAgZXhwZWN0KGV2ZW50U3B5KS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG5cbiAgICBkZXNjcmliZSAnOjpyZWxvYWRWYXJpYWJsZXNGb3JQYXRocycsIC0+XG4gICAgICBkZXNjcmliZSAnZm9yIGEgZmlsZSB0aGF0IGlzIHBhcnQgb2YgdGhlIGxvYWRlZCBwYXRocycsIC0+XG4gICAgICAgIGRlc2NyaWJlICd3aGVyZSB0aGUgcmVsb2FkIGZpbmRzIG5ldyB2YXJpYWJsZXMnLCAtPlxuICAgICAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgICAgIHByb2plY3QuZGVsZXRlVmFyaWFibGVzRm9yUGF0aHMoW1xuICAgICAgICAgICAgICBcIiN7cm9vdFBhdGh9L3N0eWxlcy92YXJpYWJsZXMuc3R5bFwiLCBcIiN7cm9vdFBhdGh9L3N0eWxlcy9idXR0b25zLnN0eWxcIlxuICAgICAgICAgICAgXSlcbiAgICAgICAgICAgIGV2ZW50U3B5ID0gamFzbWluZS5jcmVhdGVTcHkoJ2RpZC11cGRhdGUtdmFyaWFibGVzJylcbiAgICAgICAgICAgIHByb2plY3Qub25EaWRVcGRhdGVWYXJpYWJsZXMoZXZlbnRTcHkpXG4gICAgICAgICAgICB3YWl0c0ZvclByb21pc2UgLT4gcHJvamVjdC5yZWxvYWRWYXJpYWJsZXNGb3JQYXRocyhbXG4gICAgICAgICAgICAgIFwiI3tyb290UGF0aH0vc3R5bGVzL3ZhcmlhYmxlcy5zdHlsXCJcbiAgICAgICAgICAgICAgXCIje3Jvb3RQYXRofS9zdHlsZXMvYnV0dG9ucy5zdHlsXCJcbiAgICAgICAgICAgIF0pXG5cbiAgICAgICAgICBpdCAnc2NhbnMgYWdhaW4gdGhlIGZpbGUgdG8gZmluZCB2YXJpYWJsZXMnLCAtPlxuICAgICAgICAgICAgZXhwZWN0KHByb2plY3QuZ2V0VmFyaWFibGVzKCkubGVuZ3RoKS50b0VxdWFsKFRPVEFMX1ZBUklBQkxFU19JTl9QUk9KRUNUKVxuXG4gICAgICAgICAgaXQgJ2Rpc3BhdGNoZXMgYSBkaWQtdXBkYXRlLXZhcmlhYmxlcyBldmVudCcsIC0+XG4gICAgICAgICAgICBleHBlY3QoZXZlbnRTcHkpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuXG4gICAgICAgIGRlc2NyaWJlICd3aGVyZSB0aGUgcmVsb2FkIGZpbmRzIG5vdGhpbmcgbmV3JywgLT5cbiAgICAgICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgICAgICBldmVudFNweSA9IGphc21pbmUuY3JlYXRlU3B5KCdkaWQtdXBkYXRlLXZhcmlhYmxlcycpXG4gICAgICAgICAgICBwcm9qZWN0Lm9uRGlkVXBkYXRlVmFyaWFibGVzKGV2ZW50U3B5KVxuICAgICAgICAgICAgd2FpdHNGb3JQcm9taXNlIC0+IHByb2plY3QucmVsb2FkVmFyaWFibGVzRm9yUGF0aHMoW1xuICAgICAgICAgICAgICBcIiN7cm9vdFBhdGh9L3N0eWxlcy92YXJpYWJsZXMuc3R5bFwiXG4gICAgICAgICAgICAgIFwiI3tyb290UGF0aH0vc3R5bGVzL2J1dHRvbnMuc3R5bFwiXG4gICAgICAgICAgICBdKVxuXG4gICAgICAgICAgaXQgJ2xlYXZlcyB0aGUgZmlsZSB2YXJpYWJsZXMgaW50YWN0JywgLT5cbiAgICAgICAgICAgIGV4cGVjdChwcm9qZWN0LmdldFZhcmlhYmxlcygpLmxlbmd0aCkudG9FcXVhbChUT1RBTF9WQVJJQUJMRVNfSU5fUFJPSkVDVClcblxuICAgICAgICAgIGl0ICdkb2VzIG5vdCBkaXNwYXRjaCBhIGRpZC11cGRhdGUtdmFyaWFibGVzIGV2ZW50JywgLT5cbiAgICAgICAgICAgIGV4cGVjdChldmVudFNweSkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuXG4gICAgICBkZXNjcmliZSAnZm9yIGEgZmlsZSB0aGF0IGlzIG5vdCBwYXJ0IG9mIHRoZSBsb2FkZWQgcGF0aHMnLCAtPlxuICAgICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgICAgc3B5T24ocHJvamVjdCwgJ2xvYWRWYXJpYWJsZXNGb3JQYXRoJykuYW5kQ2FsbFRocm91Z2goKVxuXG4gICAgICAgICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICAgICAgICBwcm9qZWN0LnJlbG9hZFZhcmlhYmxlc0ZvclBhdGgoXCIje3Jvb3RQYXRofS92ZW5kb3IvY3NzL3ZhcmlhYmxlcy5sZXNzXCIpXG5cbiAgICAgICAgaXQgJ2RvZXMgbm90aGluZycsIC0+XG4gICAgICAgICAgZXhwZWN0KHByb2plY3QubG9hZFZhcmlhYmxlc0ZvclBhdGgpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcblxuICAgIGRlc2NyaWJlICd3aGVuIGEgYnVmZmVyIHdpdGggdmFyaWFibGVzIGlzIG9wZW4nLCAtPlxuICAgICAgW2VkaXRvciwgY29sb3JCdWZmZXJdID0gW11cbiAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgZXZlbnRTcHkgPSBqYXNtaW5lLmNyZWF0ZVNweSgnZGlkLXVwZGF0ZS12YXJpYWJsZXMnKVxuICAgICAgICBwcm9qZWN0Lm9uRGlkVXBkYXRlVmFyaWFibGVzKGV2ZW50U3B5KVxuXG4gICAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4oJ3N0eWxlcy92YXJpYWJsZXMuc3R5bCcpLnRoZW4gKG8pIC0+IGVkaXRvciA9IG9cblxuICAgICAgICBydW5zIC0+XG4gICAgICAgICAgY29sb3JCdWZmZXIgPSBwcm9qZWN0LmNvbG9yQnVmZmVyRm9yRWRpdG9yKGVkaXRvcilcbiAgICAgICAgICBzcHlPbihjb2xvckJ1ZmZlciwgJ3NjYW5CdWZmZXJGb3JWYXJpYWJsZXMnKS5hbmRDYWxsVGhyb3VnaCgpXG5cbiAgICAgICAgd2FpdHNGb3JQcm9taXNlIC0+IHByb2plY3QuaW5pdGlhbGl6ZSgpXG4gICAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPiBjb2xvckJ1ZmZlci52YXJpYWJsZXNBdmFpbGFibGUoKVxuXG4gICAgICBpdCAndXBkYXRlcyB0aGUgcHJvamVjdCB2YXJpYWJsZSB3aXRoIHRoZSBidWZmZXIgcmFuZ2VzJywgLT5cbiAgICAgICAgZm9yIHZhcmlhYmxlIGluIHByb2plY3QuZ2V0VmFyaWFibGVzKClcbiAgICAgICAgICBleHBlY3QodmFyaWFibGUuYnVmZmVyUmFuZ2UpLnRvQmVEZWZpbmVkKClcblxuICAgICAgZGVzY3JpYmUgJ3doZW4gYSBjb2xvciBpcyBtb2RpZmllZCB0aGF0IGRvZXMgbm90IGFmZmVjdCBvdGhlciB2YXJpYWJsZXMgcmFuZ2VzJywgLT5cbiAgICAgICAgW3ZhcmlhYmxlc1RleHRSYW5nZXNdID0gW11cbiAgICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICAgIHZhcmlhYmxlc1RleHRSYW5nZXMgPSB7fVxuICAgICAgICAgIHByb2plY3QuZ2V0VmFyaWFibGVzRm9yUGF0aChlZGl0b3IuZ2V0UGF0aCgpKS5mb3JFYWNoICh2YXJpYWJsZSkgLT5cbiAgICAgICAgICAgIHZhcmlhYmxlc1RleHRSYW5nZXNbdmFyaWFibGUubmFtZV0gPSB2YXJpYWJsZS5yYW5nZVxuXG4gICAgICAgICAgZWRpdG9yLnNldFNlbGVjdGVkQnVmZmVyUmFuZ2UoW1sxLDddLFsxLDE0XV0pXG4gICAgICAgICAgZWRpdG9yLmluc2VydFRleHQoJyMzMzYnKVxuICAgICAgICAgIGVkaXRvci5nZXRCdWZmZXIoKS5lbWl0dGVyLmVtaXQoJ2RpZC1zdG9wLWNoYW5naW5nJylcblxuICAgICAgICAgIHdhaXRzRm9yIC0+IGV2ZW50U3B5LmNhbGxDb3VudCA+IDBcblxuICAgICAgICBpdCAncmVsb2FkcyB0aGUgdmFyaWFibGVzIHdpdGggdGhlIGJ1ZmZlciBpbnN0ZWFkIG9mIHRoZSBmaWxlJywgLT5cbiAgICAgICAgICBleHBlY3QoY29sb3JCdWZmZXIuc2NhbkJ1ZmZlckZvclZhcmlhYmxlcykudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICAgICAgZXhwZWN0KHByb2plY3QuZ2V0VmFyaWFibGVzKCkubGVuZ3RoKS50b0VxdWFsKFRPVEFMX1ZBUklBQkxFU19JTl9QUk9KRUNUKVxuXG4gICAgICAgIGl0ICd1c2VzIHRoZSBidWZmZXIgcmFuZ2VzIHRvIGRldGVjdCB3aGljaCB2YXJpYWJsZXMgd2VyZSByZWFsbHkgY2hhbmdlZCcsIC0+XG4gICAgICAgICAgZXhwZWN0KGV2ZW50U3B5LmFyZ3NGb3JDYWxsWzBdWzBdLmRlc3Ryb3llZCkudG9CZVVuZGVmaW5lZCgpXG4gICAgICAgICAgZXhwZWN0KGV2ZW50U3B5LmFyZ3NGb3JDYWxsWzBdWzBdLmNyZWF0ZWQpLnRvQmVVbmRlZmluZWQoKVxuICAgICAgICAgIGV4cGVjdChldmVudFNweS5hcmdzRm9yQ2FsbFswXVswXS51cGRhdGVkLmxlbmd0aCkudG9FcXVhbCgxKVxuXG4gICAgICAgIGl0ICd1cGRhdGVzIHRoZSB0ZXh0IHJhbmdlIG9mIHRoZSBvdGhlciB2YXJpYWJsZXMnLCAtPlxuICAgICAgICAgIHByb2plY3QuZ2V0VmFyaWFibGVzRm9yUGF0aChcIiN7cm9vdFBhdGh9L3N0eWxlcy92YXJpYWJsZXMuc3R5bFwiKS5mb3JFYWNoICh2YXJpYWJsZSkgLT5cbiAgICAgICAgICAgIGlmIHZhcmlhYmxlLm5hbWUgaXNudCAnY29sb3JzLnJlZCdcbiAgICAgICAgICAgICAgZXhwZWN0KHZhcmlhYmxlLnJhbmdlWzBdKS50b0VxdWFsKHZhcmlhYmxlc1RleHRSYW5nZXNbdmFyaWFibGUubmFtZV1bMF0gLSAzKVxuICAgICAgICAgICAgICBleHBlY3QodmFyaWFibGUucmFuZ2VbMV0pLnRvRXF1YWwodmFyaWFibGVzVGV4dFJhbmdlc1t2YXJpYWJsZS5uYW1lXVsxXSAtIDMpXG5cbiAgICAgICAgaXQgJ2Rpc3BhdGNoZXMgYSBkaWQtdXBkYXRlLXZhcmlhYmxlcyBldmVudCcsIC0+XG4gICAgICAgICAgZXhwZWN0KGV2ZW50U3B5KS50b0hhdmVCZWVuQ2FsbGVkKClcblxuICAgICAgZGVzY3JpYmUgJ3doZW4gYSB0ZXh0IGlzIGluc2VydGVkIHRoYXQgYWZmZWN0cyBvdGhlciB2YXJpYWJsZXMgcmFuZ2VzJywgLT5cbiAgICAgICAgW3ZhcmlhYmxlc1RleHRSYW5nZXMsIHZhcmlhYmxlc0J1ZmZlclJhbmdlc10gPSBbXVxuICAgICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgICAgcnVucyAtPlxuICAgICAgICAgICAgdmFyaWFibGVzVGV4dFJhbmdlcyA9IHt9XG4gICAgICAgICAgICB2YXJpYWJsZXNCdWZmZXJSYW5nZXMgPSB7fVxuICAgICAgICAgICAgcHJvamVjdC5nZXRWYXJpYWJsZXNGb3JQYXRoKGVkaXRvci5nZXRQYXRoKCkpLmZvckVhY2ggKHZhcmlhYmxlKSAtPlxuICAgICAgICAgICAgICB2YXJpYWJsZXNUZXh0UmFuZ2VzW3ZhcmlhYmxlLm5hbWVdID0gdmFyaWFibGUucmFuZ2VcbiAgICAgICAgICAgICAgdmFyaWFibGVzQnVmZmVyUmFuZ2VzW3ZhcmlhYmxlLm5hbWVdID0gdmFyaWFibGUuYnVmZmVyUmFuZ2VcblxuICAgICAgICAgICAgc3B5T24ocHJvamVjdC52YXJpYWJsZXMsICdhZGRNYW55JykuYW5kQ2FsbFRocm91Z2goKVxuXG4gICAgICAgICAgICBlZGl0b3Iuc2V0U2VsZWN0ZWRCdWZmZXJSYW5nZShbWzAsMF0sWzAsMF1dKVxuICAgICAgICAgICAgZWRpdG9yLmluc2VydFRleHQoJ1xcblxcbicpXG4gICAgICAgICAgICBlZGl0b3IuZ2V0QnVmZmVyKCkuZW1pdHRlci5lbWl0KCdkaWQtc3RvcC1jaGFuZ2luZycpXG5cbiAgICAgICAgICB3YWl0c0ZvciAtPiBwcm9qZWN0LnZhcmlhYmxlcy5hZGRNYW55LmNhbGxDb3VudCA+IDBcblxuICAgICAgICBpdCAnZG9lcyBub3QgdHJpZ2dlciBhIGNoYW5nZSBldmVudCcsIC0+XG4gICAgICAgICAgZXhwZWN0KGV2ZW50U3B5LmNhbGxDb3VudCkudG9FcXVhbCgwKVxuXG4gICAgICAgIGl0ICd1cGRhdGVzIHRoZSByYW5nZSBvZiB0aGUgdXBkYXRlZCB2YXJpYWJsZXMnLCAtPlxuICAgICAgICAgIHByb2plY3QuZ2V0VmFyaWFibGVzRm9yUGF0aChcIiN7cm9vdFBhdGh9L3N0eWxlcy92YXJpYWJsZXMuc3R5bFwiKS5mb3JFYWNoICh2YXJpYWJsZSkgLT5cbiAgICAgICAgICAgIGlmIHZhcmlhYmxlLm5hbWUgaXNudCAnY29sb3JzLnJlZCdcbiAgICAgICAgICAgICAgZXhwZWN0KHZhcmlhYmxlLnJhbmdlWzBdKS50b0VxdWFsKHZhcmlhYmxlc1RleHRSYW5nZXNbdmFyaWFibGUubmFtZV1bMF0gKyAyKVxuICAgICAgICAgICAgICBleHBlY3QodmFyaWFibGUucmFuZ2VbMV0pLnRvRXF1YWwodmFyaWFibGVzVGV4dFJhbmdlc1t2YXJpYWJsZS5uYW1lXVsxXSArIDIpXG4gICAgICAgICAgICAgIGV4cGVjdCh2YXJpYWJsZS5idWZmZXJSYW5nZS5pc0VxdWFsKHZhcmlhYmxlc0J1ZmZlclJhbmdlc1t2YXJpYWJsZS5uYW1lXSkpLnRvQmVGYWxzeSgpXG5cbiAgICAgIGRlc2NyaWJlICd3aGVuIGEgY29sb3IgaXMgcmVtb3ZlZCcsIC0+XG4gICAgICAgIFt2YXJpYWJsZXNUZXh0UmFuZ2VzXSA9IFtdXG4gICAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgICBydW5zIC0+XG4gICAgICAgICAgICB2YXJpYWJsZXNUZXh0UmFuZ2VzID0ge31cbiAgICAgICAgICAgIHByb2plY3QuZ2V0VmFyaWFibGVzRm9yUGF0aChlZGl0b3IuZ2V0UGF0aCgpKS5mb3JFYWNoICh2YXJpYWJsZSkgLT5cbiAgICAgICAgICAgICAgdmFyaWFibGVzVGV4dFJhbmdlc1t2YXJpYWJsZS5uYW1lXSA9IHZhcmlhYmxlLnJhbmdlXG5cbiAgICAgICAgICAgIGVkaXRvci5zZXRTZWxlY3RlZEJ1ZmZlclJhbmdlKFtbMSwwXSxbMiwwXV0pXG4gICAgICAgICAgICBlZGl0b3IuaW5zZXJ0VGV4dCgnJylcbiAgICAgICAgICAgIGVkaXRvci5nZXRCdWZmZXIoKS5lbWl0dGVyLmVtaXQoJ2RpZC1zdG9wLWNoYW5naW5nJylcblxuICAgICAgICAgIHdhaXRzRm9yIC0+IGV2ZW50U3B5LmNhbGxDb3VudCA+IDBcblxuICAgICAgICBpdCAncmVsb2FkcyB0aGUgdmFyaWFibGVzIHdpdGggdGhlIGJ1ZmZlciBpbnN0ZWFkIG9mIHRoZSBmaWxlJywgLT5cbiAgICAgICAgICBleHBlY3QoY29sb3JCdWZmZXIuc2NhbkJ1ZmZlckZvclZhcmlhYmxlcykudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICAgICAgZXhwZWN0KHByb2plY3QuZ2V0VmFyaWFibGVzKCkubGVuZ3RoKS50b0VxdWFsKFRPVEFMX1ZBUklBQkxFU19JTl9QUk9KRUNUIC0gMSlcblxuICAgICAgICBpdCAndXNlcyB0aGUgYnVmZmVyIHJhbmdlcyB0byBkZXRlY3Qgd2hpY2ggdmFyaWFibGVzIHdlcmUgcmVhbGx5IGNoYW5nZWQnLCAtPlxuICAgICAgICAgIGV4cGVjdChldmVudFNweS5hcmdzRm9yQ2FsbFswXVswXS5kZXN0cm95ZWQubGVuZ3RoKS50b0VxdWFsKDEpXG4gICAgICAgICAgZXhwZWN0KGV2ZW50U3B5LmFyZ3NGb3JDYWxsWzBdWzBdLmNyZWF0ZWQpLnRvQmVVbmRlZmluZWQoKVxuICAgICAgICAgIGV4cGVjdChldmVudFNweS5hcmdzRm9yQ2FsbFswXVswXS51cGRhdGVkKS50b0JlVW5kZWZpbmVkKClcblxuICAgICAgICBpdCAnY2FuIG5vIGxvbmdlciBiZSBmb3VuZCBpbiB0aGUgcHJvamVjdCB2YXJpYWJsZXMnLCAtPlxuICAgICAgICAgIGV4cGVjdChwcm9qZWN0LmdldFZhcmlhYmxlcygpLnNvbWUgKHYpIC0+IHYubmFtZSBpcyAnY29sb3JzLnJlZCcpLnRvQmVGYWxzeSgpXG4gICAgICAgICAgZXhwZWN0KHByb2plY3QuZ2V0Q29sb3JWYXJpYWJsZXMoKS5zb21lICh2KSAtPiB2Lm5hbWUgaXMgJ2NvbG9ycy5yZWQnKS50b0JlRmFsc3koKVxuXG4gICAgICAgIGl0ICdkaXNwYXRjaGVzIGEgZGlkLXVwZGF0ZS12YXJpYWJsZXMgZXZlbnQnLCAtPlxuICAgICAgICAgIGV4cGVjdChldmVudFNweSkudG9IYXZlQmVlbkNhbGxlZCgpXG5cbiAgICAgIGRlc2NyaWJlICd3aGVuIGFsbCB0aGUgY29sb3JzIGFyZSByZW1vdmVkJywgLT5cbiAgICAgICAgW3ZhcmlhYmxlc1RleHRSYW5nZXNdID0gW11cbiAgICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICAgIHJ1bnMgLT5cbiAgICAgICAgICAgIHZhcmlhYmxlc1RleHRSYW5nZXMgPSB7fVxuICAgICAgICAgICAgcHJvamVjdC5nZXRWYXJpYWJsZXNGb3JQYXRoKGVkaXRvci5nZXRQYXRoKCkpLmZvckVhY2ggKHZhcmlhYmxlKSAtPlxuICAgICAgICAgICAgICB2YXJpYWJsZXNUZXh0UmFuZ2VzW3ZhcmlhYmxlLm5hbWVdID0gdmFyaWFibGUucmFuZ2VcblxuICAgICAgICAgICAgZWRpdG9yLnNldFNlbGVjdGVkQnVmZmVyUmFuZ2UoW1swLDBdLFtJbmZpbml0eSxJbmZpbml0eV1dKVxuICAgICAgICAgICAgZWRpdG9yLmluc2VydFRleHQoJycpXG4gICAgICAgICAgICBlZGl0b3IuZ2V0QnVmZmVyKCkuZW1pdHRlci5lbWl0KCdkaWQtc3RvcC1jaGFuZ2luZycpXG5cbiAgICAgICAgICB3YWl0c0ZvciAtPiBldmVudFNweS5jYWxsQ291bnQgPiAwXG5cbiAgICAgICAgaXQgJ3JlbW92ZXMgZXZlcnkgdmFyaWFibGUgZnJvbSB0aGUgZmlsZScsIC0+XG4gICAgICAgICAgZXhwZWN0KGNvbG9yQnVmZmVyLnNjYW5CdWZmZXJGb3JWYXJpYWJsZXMpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgICAgIGV4cGVjdChwcm9qZWN0LmdldFZhcmlhYmxlcygpLmxlbmd0aCkudG9FcXVhbCgwKVxuXG4gICAgICAgICAgZXhwZWN0KGV2ZW50U3B5LmFyZ3NGb3JDYWxsWzBdWzBdLmRlc3Ryb3llZC5sZW5ndGgpLnRvRXF1YWwoVE9UQUxfVkFSSUFCTEVTX0lOX1BST0pFQ1QpXG4gICAgICAgICAgZXhwZWN0KGV2ZW50U3B5LmFyZ3NGb3JDYWxsWzBdWzBdLmNyZWF0ZWQpLnRvQmVVbmRlZmluZWQoKVxuICAgICAgICAgIGV4cGVjdChldmVudFNweS5hcmdzRm9yQ2FsbFswXVswXS51cGRhdGVkKS50b0JlVW5kZWZpbmVkKClcblxuICAgICAgICBpdCAnY2FuIG5vIGxvbmdlciBiZSBmb3VuZCBpbiB0aGUgcHJvamVjdCB2YXJpYWJsZXMnLCAtPlxuICAgICAgICAgIGV4cGVjdChwcm9qZWN0LmdldFZhcmlhYmxlcygpLnNvbWUgKHYpIC0+IHYubmFtZSBpcyAnY29sb3JzLnJlZCcpLnRvQmVGYWxzeSgpXG4gICAgICAgICAgZXhwZWN0KHByb2plY3QuZ2V0Q29sb3JWYXJpYWJsZXMoKS5zb21lICh2KSAtPiB2Lm5hbWUgaXMgJ2NvbG9ycy5yZWQnKS50b0JlRmFsc3koKVxuXG4gICAgICAgIGl0ICdkaXNwYXRjaGVzIGEgZGlkLXVwZGF0ZS12YXJpYWJsZXMgZXZlbnQnLCAtPlxuICAgICAgICAgIGV4cGVjdChldmVudFNweSkudG9IYXZlQmVlbkNhbGxlZCgpXG5cbiAgICBkZXNjcmliZSAnOjpzZXRJZ25vcmVkTmFtZXMnLCAtPlxuICAgICAgZGVzY3JpYmUgJ3dpdGggYW4gZW1wdHkgYXJyYXknLCAtPlxuICAgICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgICAgZXhwZWN0KHByb2plY3QuZ2V0VmFyaWFibGVzKCkubGVuZ3RoKS50b0VxdWFsKDEyKVxuXG4gICAgICAgICAgc3B5ID0gamFzbWluZS5jcmVhdGVTcHkgJ2RpZC11cGRhdGUtdmFyaWFibGVzJ1xuICAgICAgICAgIHByb2plY3Qub25EaWRVcGRhdGVWYXJpYWJsZXMoc3B5KVxuICAgICAgICAgIHByb2plY3Quc2V0SWdub3JlZE5hbWVzKFtdKVxuXG4gICAgICAgICAgd2FpdHNGb3IgLT4gc3B5LmNhbGxDb3VudCA+IDBcblxuICAgICAgICBpdCAncmVsb2FkcyB0aGUgdmFyaWFibGVzIGZyb20gdGhlIG5ldyBwYXRocycsIC0+XG4gICAgICAgICAgZXhwZWN0KHByb2plY3QuZ2V0VmFyaWFibGVzKCkubGVuZ3RoKS50b0VxdWFsKDMyKVxuXG4gICAgICBkZXNjcmliZSAnd2l0aCBhIG1vcmUgcmVzdHJpY3RpdmUgYXJyYXknLCAtPlxuICAgICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgICAgZXhwZWN0KHByb2plY3QuZ2V0VmFyaWFibGVzKCkubGVuZ3RoKS50b0VxdWFsKDEyKVxuXG4gICAgICAgICAgc3B5ID0gamFzbWluZS5jcmVhdGVTcHkgJ2RpZC11cGRhdGUtdmFyaWFibGVzJ1xuICAgICAgICAgIHByb2plY3Qub25EaWRVcGRhdGVWYXJpYWJsZXMoc3B5KVxuICAgICAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPiBwcm9qZWN0LnNldElnbm9yZWROYW1lcyhbJ3ZlbmRvci8qJywgJyoqLyouc3R5bCddKVxuXG4gICAgICAgIGl0ICdjbGVhcnMgYWxsIHRoZSBwYXRocyBhcyB0aGVyZSBpcyBubyBsZWdpYmxlIHBhdGhzJywgLT5cbiAgICAgICAgICBleHBlY3QocHJvamVjdC5nZXRQYXRocygpLmxlbmd0aCkudG9FcXVhbCgwKVxuXG4gICAgZGVzY3JpYmUgJ3doZW4gdGhlIHByb2plY3QgaGFzIG11bHRpcGxlIHJvb3QgZGlyZWN0b3J5JywgLT5cbiAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgYXRvbS5jb25maWcuc2V0ICdwaWdtZW50cy5zb3VyY2VOYW1lcycsIFsnKiovKi5zYXNzJywgJyoqLyouc3R5bCddXG5cbiAgICAgICAgW2ZpeHR1cmVzUGF0aF0gPSBhdG9tLnByb2plY3QuZ2V0UGF0aHMoKVxuICAgICAgICBhdG9tLnByb2plY3Quc2V0UGF0aHMoW1xuICAgICAgICAgIFwiI3tmaXh0dXJlc1BhdGh9XCJcbiAgICAgICAgICBcIiN7Zml4dHVyZXNQYXRofS13aXRoLXJlY3Vyc2lvblwiXG4gICAgICAgIF0pXG5cbiAgICAgICAgcHJvamVjdCA9IG5ldyBDb2xvclByb2plY3Qoe30pXG5cbiAgICAgICAgd2FpdHNGb3JQcm9taXNlIC0+IHByb2plY3QuaW5pdGlhbGl6ZSgpXG5cbiAgICAgIGl0ICdmaW5kcyB0aGUgdmFyaWFibGVzIGZyb20gdGhlIHR3byBkaXJlY3RvcmllcycsIC0+XG4gICAgICAgIGV4cGVjdChwcm9qZWN0LmdldFZhcmlhYmxlcygpLmxlbmd0aCkudG9FcXVhbCgxNylcblxuICAgIGRlc2NyaWJlICd3aGVuIHRoZSBwcm9qZWN0IGhhcyBWQ1MgaWdub3JlZCBmaWxlcycsIC0+XG4gICAgICBbcHJvamVjdFBhdGhdID0gW11cbiAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgYXRvbS5jb25maWcuc2V0ICdwaWdtZW50cy5zb3VyY2VOYW1lcycsIFsnKi5zYXNzJ11cblxuICAgICAgICBmaXh0dXJlID0gcGF0aC5qb2luKF9fZGlybmFtZSwgJ2ZpeHR1cmVzJywgJ3Byb2plY3Qtd2l0aC1naXRpZ25vcmUnKVxuXG4gICAgICAgIHByb2plY3RQYXRoID0gdGVtcC5ta2RpclN5bmMoJ3BpZ21lbnRzLXByb2plY3QnKVxuICAgICAgICBkb3RHaXRGaXh0dXJlID0gcGF0aC5qb2luKGZpeHR1cmUsICdnaXQuZ2l0JylcbiAgICAgICAgZG90R2l0ID0gcGF0aC5qb2luKHByb2plY3RQYXRoLCAnLmdpdCcpXG4gICAgICAgIGZzLmNvcHlTeW5jKGRvdEdpdEZpeHR1cmUsIGRvdEdpdClcbiAgICAgICAgZnMud3JpdGVGaWxlU3luYyhwYXRoLmpvaW4ocHJvamVjdFBhdGgsICcuZ2l0aWdub3JlJyksIGZzLnJlYWRGaWxlU3luYyhwYXRoLmpvaW4oZml4dHVyZSwgJ2dpdC5naXRpZ25vcmUnKSkpXG4gICAgICAgIGZzLndyaXRlRmlsZVN5bmMocGF0aC5qb2luKHByb2plY3RQYXRoLCAnYmFzZS5zYXNzJyksIGZzLnJlYWRGaWxlU3luYyhwYXRoLmpvaW4oZml4dHVyZSwgJ2Jhc2Uuc2FzcycpKSlcbiAgICAgICAgZnMud3JpdGVGaWxlU3luYyhwYXRoLmpvaW4ocHJvamVjdFBhdGgsICdpZ25vcmVkLnNhc3MnKSwgZnMucmVhZEZpbGVTeW5jKHBhdGguam9pbihmaXh0dXJlLCAnaWdub3JlZC5zYXNzJykpKVxuICAgICAgICBmcy5ta2RpclN5bmMocGF0aC5qb2luKHByb2plY3RQYXRoLCAnYm93ZXJfY29tcG9uZW50cycpKVxuICAgICAgICBmcy53cml0ZUZpbGVTeW5jKHBhdGguam9pbihwcm9qZWN0UGF0aCwgJ2Jvd2VyX2NvbXBvbmVudHMnLCAnc29tZS1pZ25vcmVkLWZpbGUuc2FzcycpLCBmcy5yZWFkRmlsZVN5bmMocGF0aC5qb2luKGZpeHR1cmUsICdib3dlcl9jb21wb25lbnRzJywgJ3NvbWUtaWdub3JlZC1maWxlLnNhc3MnKSkpXG5cbiAgICAgICAgIyBGSVhNRSByZXBvLmdldFdvcmtpbmdEaXJlY3RvcnkgcmV0dXJucyB0aGUgcHJvamVjdCBwYXRoIHByZWZpeGVkIHdpdGhcbiAgICAgICAgIyAvcHJpdmF0ZVxuICAgICAgICBhdG9tLnByb2plY3Quc2V0UGF0aHMoW3Byb2plY3RQYXRoXSlcblxuICAgICAgZGVzY3JpYmUgJ3doZW4gdGhlIGlnbm9yZVZjc0lnbm9yZWRQYXRocyBzZXR0aW5nIGlzIGVuYWJsZWQnLCAtPlxuICAgICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgICAgYXRvbS5jb25maWcuc2V0ICdwaWdtZW50cy5pZ25vcmVWY3NJZ25vcmVkUGF0aHMnLCB0cnVlXG4gICAgICAgICAgcHJvamVjdCA9IG5ldyBDb2xvclByb2plY3Qoe30pXG5cbiAgICAgICAgICB3YWl0c0ZvclByb21pc2UgLT4gcHJvamVjdC5pbml0aWFsaXplKClcblxuICAgICAgICBpdCAnZmluZHMgdGhlIHZhcmlhYmxlcyBmcm9tIHRoZSB0aHJlZSBmaWxlcycsIC0+XG4gICAgICAgICAgZXhwZWN0KHByb2plY3QuZ2V0VmFyaWFibGVzKCkubGVuZ3RoKS50b0VxdWFsKDMpXG4gICAgICAgICAgZXhwZWN0KHByb2plY3QuZ2V0UGF0aHMoKS5sZW5ndGgpLnRvRXF1YWwoMSlcblxuICAgICAgICBkZXNjcmliZSAnYW5kIHRoZW4gZGlzYWJsZWQnLCAtPlxuICAgICAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgICAgIHNweSA9IGphc21pbmUuY3JlYXRlU3B5KCdkaWQtdXBkYXRlLXZhcmlhYmxlcycpXG4gICAgICAgICAgICBwcm9qZWN0Lm9uRGlkVXBkYXRlVmFyaWFibGVzKHNweSlcbiAgICAgICAgICAgIGF0b20uY29uZmlnLnNldCAncGlnbWVudHMuaWdub3JlVmNzSWdub3JlZFBhdGhzJywgZmFsc2VcblxuICAgICAgICAgICAgd2FpdHNGb3IgLT4gc3B5LmNhbGxDb3VudCA+IDBcblxuICAgICAgICAgIGl0ICdyZWxvYWRzIHRoZSBwYXRocycsIC0+XG4gICAgICAgICAgICBleHBlY3QocHJvamVjdC5nZXRQYXRocygpLmxlbmd0aCkudG9FcXVhbCgzKVxuXG4gICAgICAgICAgaXQgJ3JlbG9hZHMgdGhlIHZhcmlhYmxlcycsIC0+XG4gICAgICAgICAgICBleHBlY3QocHJvamVjdC5nZXRWYXJpYWJsZXMoKS5sZW5ndGgpLnRvRXF1YWwoMTApXG5cbiAgICAgIGRlc2NyaWJlICd3aGVuIHRoZSBpZ25vcmVWY3NJZ25vcmVkUGF0aHMgc2V0dGluZyBpcyBkaXNhYmxlZCcsIC0+XG4gICAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgICBhdG9tLmNvbmZpZy5zZXQgJ3BpZ21lbnRzLmlnbm9yZVZjc0lnbm9yZWRQYXRocycsIGZhbHNlXG4gICAgICAgICAgcHJvamVjdCA9IG5ldyBDb2xvclByb2plY3Qoe30pXG5cbiAgICAgICAgICB3YWl0c0ZvclByb21pc2UgLT4gcHJvamVjdC5pbml0aWFsaXplKClcblxuICAgICAgICBpdCAnZmluZHMgdGhlIHZhcmlhYmxlcyBmcm9tIHRoZSB0aHJlZSBmaWxlcycsIC0+XG4gICAgICAgICAgZXhwZWN0KHByb2plY3QuZ2V0VmFyaWFibGVzKCkubGVuZ3RoKS50b0VxdWFsKDEwKVxuICAgICAgICAgIGV4cGVjdChwcm9qZWN0LmdldFBhdGhzKCkubGVuZ3RoKS50b0VxdWFsKDMpXG5cbiAgICAgICAgZGVzY3JpYmUgJ2FuZCB0aGVuIGVuYWJsZWQnLCAtPlxuICAgICAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgICAgIHNweSA9IGphc21pbmUuY3JlYXRlU3B5KCdkaWQtdXBkYXRlLXZhcmlhYmxlcycpXG4gICAgICAgICAgICBwcm9qZWN0Lm9uRGlkVXBkYXRlVmFyaWFibGVzKHNweSlcbiAgICAgICAgICAgIGF0b20uY29uZmlnLnNldCAncGlnbWVudHMuaWdub3JlVmNzSWdub3JlZFBhdGhzJywgdHJ1ZVxuXG4gICAgICAgICAgICB3YWl0c0ZvciAtPiBzcHkuY2FsbENvdW50ID4gMFxuXG4gICAgICAgICAgaXQgJ3JlbG9hZHMgdGhlIHBhdGhzJywgLT5cbiAgICAgICAgICAgIGV4cGVjdChwcm9qZWN0LmdldFBhdGhzKCkubGVuZ3RoKS50b0VxdWFsKDEpXG5cbiAgICAgICAgICBpdCAncmVsb2FkcyB0aGUgdmFyaWFibGVzJywgLT5cbiAgICAgICAgICAgIGV4cGVjdChwcm9qZWN0LmdldFZhcmlhYmxlcygpLmxlbmd0aCkudG9FcXVhbCgzKVxuXG4gICAgIyMgICAgICMjIyMjIyAgIyMjIyMjIyMgIyMjIyMjIyMgIyMjIyMjIyMgIyMjIyAjIyAgICAjIyAgIyMjIyMjICAgICMjIyMjI1xuICAgICMjICAgICMjICAgICMjICMjICAgICAgICAgICMjICAgICAgICMjICAgICAjIyAgIyMjICAgIyMgIyMgICAgIyMgICMjICAgICMjXG4gICAgIyMgICAgIyMgICAgICAgIyMgICAgICAgICAgIyMgICAgICAgIyMgICAgICMjICAjIyMjICAjIyAjIyAgICAgICAgIyNcbiAgICAjIyAgICAgIyMjIyMjICAjIyMjIyMgICAgICAjIyAgICAgICAjIyAgICAgIyMgICMjICMjICMjICMjICAgIyMjIyAgIyMjIyMjXG4gICAgIyMgICAgICAgICAgIyMgIyMgICAgICAgICAgIyMgICAgICAgIyMgICAgICMjICAjIyAgIyMjIyAjIyAgICAjIyAgICAgICAgIyNcbiAgICAjIyAgICAjIyAgICAjIyAjIyAgICAgICAgICAjIyAgICAgICAjIyAgICAgIyMgICMjICAgIyMjICMjICAgICMjICAjIyAgICAjI1xuICAgICMjICAgICAjIyMjIyMgICMjIyMjIyMjICAgICMjICAgICAgICMjICAgICMjIyMgIyMgICAgIyMgICMjIyMjIyAgICAjIyMjIyNcblxuICAgIGRlc2NyaWJlICd3aGVuIHRoZSBzb3VyY2VOYW1lcyBzZXR0aW5nIGlzIGNoYW5nZWQnLCAtPlxuICAgICAgW3VwZGF0ZVNweV0gPSBbXVxuXG4gICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgIG9yaWdpbmFsUGF0aHMgPSBwcm9qZWN0LmdldFBhdGhzKClcbiAgICAgICAgYXRvbS5jb25maWcuc2V0ICdwaWdtZW50cy5zb3VyY2VOYW1lcycsIFtdXG5cbiAgICAgICAgd2FpdHNGb3IgLT4gcHJvamVjdC5nZXRQYXRocygpLmpvaW4oJywnKSBpc250IG9yaWdpbmFsUGF0aHMuam9pbignLCcpXG5cbiAgICAgIGl0ICd1cGRhdGVzIHRoZSB2YXJpYWJsZXMgdXNpbmcgdGhlIG5ldyBwYXR0ZXJuJywgLT5cbiAgICAgICAgZXhwZWN0KHByb2plY3QuZ2V0VmFyaWFibGVzKCkubGVuZ3RoKS50b0VxdWFsKDApXG5cbiAgICAgIGRlc2NyaWJlICdzbyB0aGF0IG5ldyBwYXRocyBhcmUgZm91bmQnLCAtPlxuICAgICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgICAgdXBkYXRlU3B5ID0gamFzbWluZS5jcmVhdGVTcHkoJ2RpZC11cGRhdGUtdmFyaWFibGVzJylcblxuICAgICAgICAgIG9yaWdpbmFsUGF0aHMgPSBwcm9qZWN0LmdldFBhdGhzKClcbiAgICAgICAgICBwcm9qZWN0Lm9uRGlkVXBkYXRlVmFyaWFibGVzKHVwZGF0ZVNweSlcblxuICAgICAgICAgIGF0b20uY29uZmlnLnNldCAncGlnbWVudHMuc291cmNlTmFtZXMnLCBbJyoqLyouc3R5bCddXG5cbiAgICAgICAgICB3YWl0c0ZvciAtPiBwcm9qZWN0LmdldFBhdGhzKCkuam9pbignLCcpIGlzbnQgb3JpZ2luYWxQYXRocy5qb2luKCcsJylcbiAgICAgICAgICB3YWl0c0ZvciAtPiB1cGRhdGVTcHkuY2FsbENvdW50ID4gMFxuXG4gICAgICAgIGl0ICdsb2FkcyB0aGUgdmFyaWFibGVzIGZyb20gdGhlc2UgbmV3IHBhdGhzJywgLT5cbiAgICAgICAgICBleHBlY3QocHJvamVjdC5nZXRWYXJpYWJsZXMoKS5sZW5ndGgpLnRvRXF1YWwoVE9UQUxfVkFSSUFCTEVTX0lOX1BST0pFQ1QpXG5cbiAgICBkZXNjcmliZSAnd2hlbiB0aGUgaWdub3JlZE5hbWVzIHNldHRpbmcgaXMgY2hhbmdlZCcsIC0+XG4gICAgICBbdXBkYXRlU3B5XSA9IFtdXG5cbiAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgb3JpZ2luYWxQYXRocyA9IHByb2plY3QuZ2V0UGF0aHMoKVxuICAgICAgICBhdG9tLmNvbmZpZy5zZXQgJ3BpZ21lbnRzLmlnbm9yZWROYW1lcycsIFsnKiovKi5zdHlsJ11cblxuICAgICAgICB3YWl0c0ZvciAtPiBwcm9qZWN0LmdldFBhdGhzKCkuam9pbignLCcpIGlzbnQgb3JpZ2luYWxQYXRocy5qb2luKCcsJylcblxuICAgICAgaXQgJ3VwZGF0ZXMgdGhlIGZvdW5kIHVzaW5nIHRoZSBuZXcgcGF0dGVybicsIC0+XG4gICAgICAgIGV4cGVjdChwcm9qZWN0LmdldFZhcmlhYmxlcygpLmxlbmd0aCkudG9FcXVhbCgwKVxuXG4gICAgICBkZXNjcmliZSAnc28gdGhhdCBuZXcgcGF0aHMgYXJlIGZvdW5kJywgLT5cbiAgICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICAgIHVwZGF0ZVNweSA9IGphc21pbmUuY3JlYXRlU3B5KCdkaWQtdXBkYXRlLXZhcmlhYmxlcycpXG5cbiAgICAgICAgICBvcmlnaW5hbFBhdGhzID0gcHJvamVjdC5nZXRQYXRocygpXG4gICAgICAgICAgcHJvamVjdC5vbkRpZFVwZGF0ZVZhcmlhYmxlcyh1cGRhdGVTcHkpXG5cbiAgICAgICAgICBhdG9tLmNvbmZpZy5zZXQgJ3BpZ21lbnRzLmlnbm9yZWROYW1lcycsIFtdXG5cbiAgICAgICAgICB3YWl0c0ZvciAtPiBwcm9qZWN0LmdldFBhdGhzKCkuam9pbignLCcpIGlzbnQgb3JpZ2luYWxQYXRocy5qb2luKCcsJylcbiAgICAgICAgICB3YWl0c0ZvciAtPiB1cGRhdGVTcHkuY2FsbENvdW50ID4gMFxuXG4gICAgICAgIGl0ICdsb2FkcyB0aGUgdmFyaWFibGVzIGZyb20gdGhlc2UgbmV3IHBhdGhzJywgLT5cbiAgICAgICAgICBleHBlY3QocHJvamVjdC5nZXRWYXJpYWJsZXMoKS5sZW5ndGgpLnRvRXF1YWwoVE9UQUxfVkFSSUFCTEVTX0lOX1BST0pFQ1QpXG5cbiAgICBkZXNjcmliZSAnd2hlbiB0aGUgZXh0ZW5kZWRTZWFyY2hOYW1lcyBzZXR0aW5nIGlzIGNoYW5nZWQnLCAtPlxuICAgICAgW3VwZGF0ZVNweV0gPSBbXVxuXG4gICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgIHByb2plY3Quc2V0U2VhcmNoTmFtZXMoWycqLmZvbyddKVxuXG4gICAgICBpdCAndXBkYXRlcyB0aGUgc2VhcmNoIG5hbWVzJywgLT5cbiAgICAgICAgZXhwZWN0KHByb2plY3QuZ2V0U2VhcmNoTmFtZXMoKS5sZW5ndGgpLnRvRXF1YWwoMylcblxuICAgICAgaXQgJ3NlcmlhbGl6ZXMgdGhlIHNldHRpbmcnLCAtPlxuICAgICAgICBleHBlY3QocHJvamVjdC5zZXJpYWxpemUoKS5zZWFyY2hOYW1lcykudG9FcXVhbChbJyouZm9vJ10pXG5cbiAgICBkZXNjcmliZSAnd2hlbiB0aGUgaWdub3JlIGdsb2JhbCBjb25maWcgc2V0dGluZ3MgYXJlIGVuYWJsZWQnLCAtPlxuICAgICAgZGVzY3JpYmUgJ2ZvciB0aGUgc291cmNlTmFtZXMgZmllbGQnLCAtPlxuICAgICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgICAgcHJvamVjdC5zb3VyY2VOYW1lcyA9IFsnKi5mb28nXVxuICAgICAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPiBwcm9qZWN0LnNldElnbm9yZUdsb2JhbFNvdXJjZU5hbWVzKHRydWUpXG5cbiAgICAgICAgaXQgJ2lnbm9yZXMgdGhlIGNvbnRlbnQgb2YgdGhlIGdsb2JhbCBjb25maWcnLCAtPlxuICAgICAgICAgIGV4cGVjdChwcm9qZWN0LmdldFNvdXJjZU5hbWVzKCkpLnRvRXF1YWwoWycucGlnbWVudHMnLCcqLmZvbyddKVxuXG4gICAgICAgIGl0ICdzZXJpYWxpemVzIHRoZSBwcm9qZWN0IHNldHRpbmcnLCAtPlxuICAgICAgICAgIGV4cGVjdChwcm9qZWN0LnNlcmlhbGl6ZSgpLmlnbm9yZUdsb2JhbFNvdXJjZU5hbWVzKS50b0JlVHJ1dGh5KClcblxuICAgICAgZGVzY3JpYmUgJ2ZvciB0aGUgaWdub3JlZE5hbWVzIGZpZWxkJywgLT5cbiAgICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICAgIGF0b20uY29uZmlnLnNldCAncGlnbWVudHMuaWdub3JlZE5hbWVzJywgWycqLmZvbyddXG4gICAgICAgICAgcHJvamVjdC5pZ25vcmVkTmFtZXMgPSBbJyouYmFyJ11cblxuICAgICAgICAgIHByb2plY3Quc2V0SWdub3JlR2xvYmFsSWdub3JlZE5hbWVzKHRydWUpXG5cbiAgICAgICAgaXQgJ2lnbm9yZXMgdGhlIGNvbnRlbnQgb2YgdGhlIGdsb2JhbCBjb25maWcnLCAtPlxuICAgICAgICAgIGV4cGVjdChwcm9qZWN0LmdldElnbm9yZWROYW1lcygpKS50b0VxdWFsKFsnKi5iYXInXSlcblxuICAgICAgICBpdCAnc2VyaWFsaXplcyB0aGUgcHJvamVjdCBzZXR0aW5nJywgLT5cbiAgICAgICAgICBleHBlY3QocHJvamVjdC5zZXJpYWxpemUoKS5pZ25vcmVHbG9iYWxJZ25vcmVkTmFtZXMpLnRvQmVUcnV0aHkoKVxuXG4gICAgICBkZXNjcmliZSAnZm9yIHRoZSBpZ25vcmVkU2NvcGVzIGZpZWxkJywgLT5cbiAgICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICAgIGF0b20uY29uZmlnLnNldCAncGlnbWVudHMuaWdub3JlZFNjb3BlcycsIFsnXFxcXC5jb21tZW50J11cbiAgICAgICAgICBwcm9qZWN0Lmlnbm9yZWRTY29wZXMgPSBbJ1xcXFwuc291cmNlJ11cblxuICAgICAgICAgIHByb2plY3Quc2V0SWdub3JlR2xvYmFsSWdub3JlZFNjb3Blcyh0cnVlKVxuXG4gICAgICAgIGl0ICdpZ25vcmVzIHRoZSBjb250ZW50IG9mIHRoZSBnbG9iYWwgY29uZmlnJywgLT5cbiAgICAgICAgICBleHBlY3QocHJvamVjdC5nZXRJZ25vcmVkU2NvcGVzKCkpLnRvRXF1YWwoWydcXFxcLnNvdXJjZSddKVxuXG4gICAgICAgIGl0ICdzZXJpYWxpemVzIHRoZSBwcm9qZWN0IHNldHRpbmcnLCAtPlxuICAgICAgICAgIGV4cGVjdChwcm9qZWN0LnNlcmlhbGl6ZSgpLmlnbm9yZUdsb2JhbElnbm9yZWRTY29wZXMpLnRvQmVUcnV0aHkoKVxuXG4gICAgICBkZXNjcmliZSAnZm9yIHRoZSBzZWFyY2hOYW1lcyBmaWVsZCcsIC0+XG4gICAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgICBhdG9tLmNvbmZpZy5zZXQgJ3BpZ21lbnRzLmV4dGVuZGVkU2VhcmNoTmFtZXMnLCBbJyouY3NzJ11cbiAgICAgICAgICBwcm9qZWN0LnNlYXJjaE5hbWVzID0gWycqLmZvbyddXG5cbiAgICAgICAgICBwcm9qZWN0LnNldElnbm9yZUdsb2JhbFNlYXJjaE5hbWVzKHRydWUpXG5cbiAgICAgICAgaXQgJ2lnbm9yZXMgdGhlIGNvbnRlbnQgb2YgdGhlIGdsb2JhbCBjb25maWcnLCAtPlxuICAgICAgICAgIGV4cGVjdChwcm9qZWN0LmdldFNlYXJjaE5hbWVzKCkpLnRvRXF1YWwoWycqLmxlc3MnLCcqLmZvbyddKVxuXG4gICAgICAgIGl0ICdzZXJpYWxpemVzIHRoZSBwcm9qZWN0IHNldHRpbmcnLCAtPlxuICAgICAgICAgIGV4cGVjdChwcm9qZWN0LnNlcmlhbGl6ZSgpLmlnbm9yZUdsb2JhbFNlYXJjaE5hbWVzKS50b0JlVHJ1dGh5KClcblxuXG4gICAgZGVzY3JpYmUgJzo6bG9hZFRoZW1lc1ZhcmlhYmxlcycsIC0+XG4gICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgIGF0b20ucGFja2FnZXMuYWN0aXZhdGVQYWNrYWdlKCdhdG9tLWxpZ2h0LXVpJylcbiAgICAgICAgYXRvbS5wYWNrYWdlcy5hY3RpdmF0ZVBhY2thZ2UoJ2F0b20tbGlnaHQtc3ludGF4JylcblxuICAgICAgICBhdG9tLmNvbmZpZy5zZXQoJ2NvcmUudGhlbWVzJywgWydhdG9tLWxpZ2h0LXVpJywgJ2F0b20tbGlnaHQtc3ludGF4J10pXG5cbiAgICAgICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICAgICAgYXRvbS50aGVtZXMuYWN0aXZhdGVUaGVtZXMoKVxuXG4gICAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgICAgIGF0b20ucGFja2FnZXMuYWN0aXZhdGVQYWNrYWdlKCdwaWdtZW50cycpXG5cbiAgICAgIGFmdGVyRWFjaCAtPlxuICAgICAgICBhdG9tLnRoZW1lcy5kZWFjdGl2YXRlVGhlbWVzKClcbiAgICAgICAgYXRvbS50aGVtZXMudW53YXRjaFVzZXJTdHlsZXNoZWV0KClcblxuICAgICAgaXQgJ3JldHVybnMgYW4gYXJyYXkgb2YgNjIgdmFyaWFibGVzJywgLT5cbiAgICAgICAgdGhlbWVWYXJpYWJsZXMgPSBwcm9qZWN0LmxvYWRUaGVtZXNWYXJpYWJsZXMoKVxuICAgICAgICBleHBlY3QodGhlbWVWYXJpYWJsZXMubGVuZ3RoKS50b0VxdWFsKDYyKVxuXG4gICAgZGVzY3JpYmUgJ3doZW4gdGhlIGluY2x1ZGVUaGVtZXMgc2V0dGluZyBpcyBlbmFibGVkJywgLT5cbiAgICAgIFtwYXRocywgc3B5XSA9IFtdXG4gICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgIHBhdGhzID0gcHJvamVjdC5nZXRQYXRocygpXG4gICAgICAgIGV4cGVjdChwcm9qZWN0LmdldENvbG9yVmFyaWFibGVzKCkubGVuZ3RoKS50b0VxdWFsKDEwKVxuXG4gICAgICAgIGF0b20ucGFja2FnZXMuYWN0aXZhdGVQYWNrYWdlKCdhdG9tLWxpZ2h0LXVpJylcbiAgICAgICAgYXRvbS5wYWNrYWdlcy5hY3RpdmF0ZVBhY2thZ2UoJ2F0b20tbGlnaHQtc3ludGF4JylcbiAgICAgICAgYXRvbS5wYWNrYWdlcy5hY3RpdmF0ZVBhY2thZ2UoJ2F0b20tZGFyay11aScpXG4gICAgICAgIGF0b20ucGFja2FnZXMuYWN0aXZhdGVQYWNrYWdlKCdhdG9tLWRhcmstc3ludGF4JylcblxuICAgICAgICBhdG9tLmNvbmZpZy5zZXQoJ2NvcmUudGhlbWVzJywgWydhdG9tLWxpZ2h0LXVpJywgJ2F0b20tbGlnaHQtc3ludGF4J10pXG5cbiAgICAgICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICAgICAgYXRvbS50aGVtZXMuYWN0aXZhdGVUaGVtZXMoKVxuXG4gICAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgICAgIGF0b20ucGFja2FnZXMuYWN0aXZhdGVQYWNrYWdlKCdwaWdtZW50cycpXG5cbiAgICAgICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICAgICAgcHJvamVjdC5pbml0aWFsaXplKClcblxuICAgICAgICBydW5zIC0+XG4gICAgICAgICAgc3B5ID0gamFzbWluZS5jcmVhdGVTcHkoJ2RpZC1jaGFuZ2UtYWN0aXZlLXRoZW1lcycpXG4gICAgICAgICAgYXRvbS50aGVtZXMub25EaWRDaGFuZ2VBY3RpdmVUaGVtZXMoc3B5KVxuICAgICAgICAgIHByb2plY3Quc2V0SW5jbHVkZVRoZW1lcyh0cnVlKVxuXG4gICAgICBhZnRlckVhY2ggLT5cbiAgICAgICAgYXRvbS50aGVtZXMuZGVhY3RpdmF0ZVRoZW1lcygpXG4gICAgICAgIGF0b20udGhlbWVzLnVud2F0Y2hVc2VyU3R5bGVzaGVldCgpXG5cbiAgICAgIGl0ICdpbmNsdWRlcyB0aGUgdmFyaWFibGVzIHNldCBmb3IgdWkgYW5kIHN5bnRheCB0aGVtZXMgaW4gdGhlIHBhbGV0dGUnLCAtPlxuICAgICAgICBleHBlY3QocHJvamVjdC5nZXRDb2xvclZhcmlhYmxlcygpLmxlbmd0aCkudG9FcXVhbCg3MilcblxuICAgICAgaXQgJ3N0aWxsIGluY2x1ZGVzIHRoZSBwYXRocyBmcm9tIHRoZSBwcm9qZWN0JywgLT5cbiAgICAgICAgZm9yIHAgaW4gcGF0aHNcbiAgICAgICAgICBleHBlY3QocHJvamVjdC5nZXRQYXRocygpLmluZGV4T2YgcCkubm90LnRvRXF1YWwoLTEpXG5cbiAgICAgIGl0ICdzZXJpYWxpemVzIHRoZSBzZXR0aW5nIHdpdGggdGhlIHByb2plY3QnLCAtPlxuICAgICAgICBzZXJpYWxpemVkID0gcHJvamVjdC5zZXJpYWxpemUoKVxuXG4gICAgICAgIGV4cGVjdChzZXJpYWxpemVkLmluY2x1ZGVUaGVtZXMpLnRvRXF1YWwodHJ1ZSlcblxuICAgICAgZGVzY3JpYmUgJ2FuZCB0aGVuIGRpc2FibGVkJywgLT5cbiAgICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICAgIHByb2plY3Quc2V0SW5jbHVkZVRoZW1lcyhmYWxzZSlcblxuICAgICAgICBpdCAncmVtb3ZlcyBhbGwgdGhlIHBhdGhzIHRvIHRoZSB0aGVtZXMgc3R5bGVzaGVldHMnLCAtPlxuICAgICAgICAgIGV4cGVjdChwcm9qZWN0LmdldENvbG9yVmFyaWFibGVzKCkubGVuZ3RoKS50b0VxdWFsKDEwKVxuXG4gICAgICAgIGRlc2NyaWJlICd3aGVuIHRoZSBjb3JlLnRoZW1lcyBzZXR0aW5nIGlzIG1vZGlmaWVkJywgLT5cbiAgICAgICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgICAgICBzcHlPbihwcm9qZWN0LCAnbG9hZFRoZW1lc1ZhcmlhYmxlcycpLmFuZENhbGxUaHJvdWdoKClcbiAgICAgICAgICAgIGF0b20uY29uZmlnLnNldCgnY29yZS50aGVtZXMnLCBbJ2F0b20tZGFyay11aScsICdhdG9tLWRhcmstc3ludGF4J10pXG5cbiAgICAgICAgICAgIHdhaXRzRm9yIC0+IHNweS5jYWxsQ291bnQgPiAwXG5cbiAgICAgICAgICBpdCAnZG9lcyBub3QgdHJpZ2dlciBhIHBhdGhzIHVwZGF0ZScsIC0+XG4gICAgICAgICAgICBleHBlY3QocHJvamVjdC5sb2FkVGhlbWVzVmFyaWFibGVzKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG5cbiAgICAgIGRlc2NyaWJlICd3aGVuIHRoZSBjb3JlLnRoZW1lcyBzZXR0aW5nIGlzIG1vZGlmaWVkJywgLT5cbiAgICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICAgIHNweU9uKHByb2plY3QsICdsb2FkVGhlbWVzVmFyaWFibGVzJykuYW5kQ2FsbFRocm91Z2goKVxuICAgICAgICAgIGF0b20uY29uZmlnLnNldCgnY29yZS50aGVtZXMnLCBbJ2F0b20tZGFyay11aScsICdhdG9tLWRhcmstc3ludGF4J10pXG5cbiAgICAgICAgICB3YWl0c0ZvciAtPiBzcHkuY2FsbENvdW50ID4gMFxuXG4gICAgICAgIGl0ICd0cmlnZ2VycyBhIHBhdGhzIHVwZGF0ZScsIC0+XG4gICAgICAgICAgZXhwZWN0KHByb2plY3QubG9hZFRoZW1lc1ZhcmlhYmxlcykudG9IYXZlQmVlbkNhbGxlZCgpXG5cbiAgIyMgICAgIyMjIyMjIyMgICMjIyMjIyMjICAjIyMjIyMgICMjIyMjIyMjICAjIyMjIyMjICAjIyMjIyMjIyAgIyMjIyMjIyNcbiAgIyMgICAgIyMgICAgICMjICMjICAgICAgICMjICAgICMjICAgICMjICAgICMjICAgICAjIyAjIyAgICAgIyMgIyNcbiAgIyMgICAgIyMgICAgICMjICMjICAgICAgICMjICAgICAgICAgICMjICAgICMjICAgICAjIyAjIyAgICAgIyMgIyNcbiAgIyMgICAgIyMjIyMjIyMgICMjIyMjIyAgICAjIyMjIyMgICAgICMjICAgICMjICAgICAjIyAjIyMjIyMjIyAgIyMjIyMjXG4gICMjICAgICMjICAgIyMgICAjIyAgICAgICAgICAgICAjIyAgICAjIyAgICAjIyAgICAgIyMgIyMgICAjIyAgICMjXG4gICMjICAgICMjICAgICMjICAjIyAgICAgICAjIyAgICAjIyAgICAjIyAgICAjIyAgICAgIyMgIyMgICAgIyMgICMjXG4gICMjICAgICMjICAgICAjIyAjIyMjIyMjIyAgIyMjIyMjICAgICAjIyAgICAgIyMjIyMjIyAgIyMgICAgICMjICMjIyMjIyMjXG5cbiAgZGVzY3JpYmUgJ3doZW4gcmVzdG9yZWQnLCAtPlxuICAgIGNyZWF0ZVByb2plY3QgPSAocGFyYW1zPXt9KSAtPlxuICAgICAge3N0YXRlRml4dHVyZX0gPSBwYXJhbXNcbiAgICAgIGRlbGV0ZSBwYXJhbXMuc3RhdGVGaXh0dXJlXG5cbiAgICAgIHBhcmFtcy5yb290ID89IHJvb3RQYXRoXG4gICAgICBwYXJhbXMudGltZXN0YW1wID89ICBuZXcgRGF0ZSgpLnRvSlNPTigpXG4gICAgICBwYXJhbXMudmFyaWFibGVNYXJrZXJzID89IFsxLi4xMl1cbiAgICAgIHBhcmFtcy5jb2xvck1hcmtlcnMgPz0gWzEzLi4yNF1cbiAgICAgIHBhcmFtcy52ZXJzaW9uID89IFNFUklBTElaRV9WRVJTSU9OXG4gICAgICBwYXJhbXMubWFya2Vyc1ZlcnNpb24gPz0gU0VSSUFMSVpFX01BUktFUlNfVkVSU0lPTlxuXG4gICAgICBDb2xvclByb2plY3QuZGVzZXJpYWxpemUoanNvbkZpeHR1cmUoc3RhdGVGaXh0dXJlLCBwYXJhbXMpKVxuXG4gICAgZGVzY3JpYmUgJ3dpdGggYSB0aW1lc3RhbXAgbW9yZSByZWNlbnQgdGhhbiB0aGUgZmlsZXMgbGFzdCBtb2RpZmljYXRpb24gZGF0ZScsIC0+XG4gICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgIHByb2plY3QgPSBjcmVhdGVQcm9qZWN0XG4gICAgICAgICAgc3RhdGVGaXh0dXJlOiBcImVtcHR5LXByb2plY3QuanNvblwiXG5cbiAgICAgICAgd2FpdHNGb3JQcm9taXNlIC0+IHByb2plY3QuaW5pdGlhbGl6ZSgpXG5cbiAgICAgIGl0ICdkb2VzIG5vdCByZXNjYW5zIHRoZSBmaWxlcycsIC0+XG4gICAgICAgIGV4cGVjdChwcm9qZWN0LmdldFZhcmlhYmxlcygpLmxlbmd0aCkudG9FcXVhbCgxKVxuXG4gICAgZGVzY3JpYmUgJ3dpdGggYSB2ZXJzaW9uIGRpZmZlcmVudCB0aGF0IHRoZSBjdXJyZW50IG9uZScsIC0+XG4gICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgIHByb2plY3QgPSBjcmVhdGVQcm9qZWN0XG4gICAgICAgICAgc3RhdGVGaXh0dXJlOiBcImVtcHR5LXByb2plY3QuanNvblwiXG4gICAgICAgICAgdmVyc2lvbjogXCIwLjAuMFwiXG5cbiAgICAgICAgd2FpdHNGb3JQcm9taXNlIC0+IHByb2plY3QuaW5pdGlhbGl6ZSgpXG5cbiAgICAgIGl0ICdkcm9wcyB0aGUgd2hvbGUgc2VyaWFsaXplZCBzdGF0ZSBhbmQgcmVzY2FucyBhbGwgdGhlIHByb2plY3QnLCAtPlxuICAgICAgICBleHBlY3QocHJvamVjdC5nZXRWYXJpYWJsZXMoKS5sZW5ndGgpLnRvRXF1YWwoMTIpXG5cbiAgICBkZXNjcmliZSAnd2l0aCBhIHNlcmlhbGl6ZWQgcGF0aCB0aGF0IG5vIGxvbmdlciBleGlzdCcsIC0+XG4gICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgIHByb2plY3QgPSBjcmVhdGVQcm9qZWN0XG4gICAgICAgICAgc3RhdGVGaXh0dXJlOiBcInJlbmFtZS1maWxlLXByb2plY3QuanNvblwiXG5cbiAgICAgICAgd2FpdHNGb3JQcm9taXNlIC0+IHByb2plY3QuaW5pdGlhbGl6ZSgpXG5cbiAgICAgIGl0ICdkcm9wcyBkcm9wcyB0aGUgbm9uLWV4aXN0aW5nIGFuZCByZWxvYWQgdGhlIHBhdGhzJywgLT5cbiAgICAgICAgZXhwZWN0KHByb2plY3QuZ2V0UGF0aHMoKSkudG9FcXVhbChbXG4gICAgICAgICAgXCIje3Jvb3RQYXRofS9zdHlsZXMvYnV0dG9ucy5zdHlsXCJcbiAgICAgICAgICBcIiN7cm9vdFBhdGh9L3N0eWxlcy92YXJpYWJsZXMuc3R5bFwiXG4gICAgICAgIF0pXG5cbiAgICAgIGl0ICdkcm9wcyB0aGUgdmFyaWFibGVzIGZyb20gdGhlIHJlbW92ZWQgcGF0aHMnLCAtPlxuICAgICAgICBleHBlY3QocHJvamVjdC5nZXRWYXJpYWJsZXNGb3JQYXRoKFwiI3tyb290UGF0aH0vc3R5bGVzL2Zvby5zdHlsXCIpLmxlbmd0aCkudG9FcXVhbCgwKVxuXG4gICAgICBpdCAnbG9hZHMgdGhlIHZhcmlhYmxlcyBmcm9tIHRoZSBuZXcgZmlsZScsIC0+XG4gICAgICAgIGV4cGVjdChwcm9qZWN0LmdldFZhcmlhYmxlc0ZvclBhdGgoXCIje3Jvb3RQYXRofS9zdHlsZXMvdmFyaWFibGVzLnN0eWxcIikubGVuZ3RoKS50b0VxdWFsKDEyKVxuXG5cbiAgICBkZXNjcmliZSAnd2l0aCBhIHNvdXJjZU5hbWVzIHNldHRpbmcgdmFsdWUgZGlmZmVyZW50IHRoYW4gd2hlbiBzZXJpYWxpemVkJywgLT5cbiAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgYXRvbS5jb25maWcuc2V0KCdwaWdtZW50cy5zb3VyY2VOYW1lcycsIFtdKVxuXG4gICAgICAgIHByb2plY3QgPSBjcmVhdGVQcm9qZWN0XG4gICAgICAgICAgc3RhdGVGaXh0dXJlOiBcImVtcHR5LXByb2plY3QuanNvblwiXG5cbiAgICAgICAgd2FpdHNGb3JQcm9taXNlIC0+IHByb2plY3QuaW5pdGlhbGl6ZSgpXG5cbiAgICAgIGl0ICdkcm9wcyB0aGUgd2hvbGUgc2VyaWFsaXplZCBzdGF0ZSBhbmQgcmVzY2FucyBhbGwgdGhlIHByb2plY3QnLCAtPlxuICAgICAgICBleHBlY3QocHJvamVjdC5nZXRWYXJpYWJsZXMoKS5sZW5ndGgpLnRvRXF1YWwoMClcblxuICAgIGRlc2NyaWJlICd3aXRoIGEgbWFya2VycyB2ZXJzaW9uIGRpZmZlcmVudCB0aGF0IHRoZSBjdXJyZW50IG9uZScsIC0+XG4gICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgIHByb2plY3QgPSBjcmVhdGVQcm9qZWN0XG4gICAgICAgICAgc3RhdGVGaXh0dXJlOiBcImVtcHR5LXByb2plY3QuanNvblwiXG4gICAgICAgICAgbWFya2Vyc1ZlcnNpb246IFwiMC4wLjBcIlxuXG4gICAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPiBwcm9qZWN0LmluaXRpYWxpemUoKVxuXG4gICAgICBpdCAna2VlcHMgdGhlIHByb2plY3QgcmVsYXRlZCBkYXRhJywgLT5cbiAgICAgICAgZXhwZWN0KHByb2plY3QuaWdub3JlZE5hbWVzKS50b0VxdWFsKFsndmVuZG9yLyonXSlcbiAgICAgICAgZXhwZWN0KHByb2plY3QuZ2V0UGF0aHMoKSkudG9FcXVhbChbXG4gICAgICAgICAgXCIje3Jvb3RQYXRofS9zdHlsZXMvYnV0dG9ucy5zdHlsXCIsXG4gICAgICAgICAgXCIje3Jvb3RQYXRofS9zdHlsZXMvdmFyaWFibGVzLnN0eWxcIlxuICAgICAgICBdKVxuXG4gICAgICBpdCAnZHJvcHMgdGhlIHZhcmlhYmxlcyBhbmQgYnVmZmVycyBkYXRhJywgLT5cbiAgICAgICAgZXhwZWN0KHByb2plY3QuZ2V0VmFyaWFibGVzKCkubGVuZ3RoKS50b0VxdWFsKFRPVEFMX1ZBUklBQkxFU19JTl9QUk9KRUNUKVxuXG4gICAgZGVzY3JpYmUgJ3dpdGggYSB0aW1lc3RhbXAgb2xkZXIgdGhhbiB0aGUgZmlsZXMgbGFzdCBtb2RpZmljYXRpb24gZGF0ZScsIC0+XG4gICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgIHByb2plY3QgPSBjcmVhdGVQcm9qZWN0XG4gICAgICAgICAgdGltZXN0YW1wOiBuZXcgRGF0ZSgwKS50b0pTT04oKVxuICAgICAgICAgIHN0YXRlRml4dHVyZTogXCJlbXB0eS1wcm9qZWN0Lmpzb25cIlxuXG4gICAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPiBwcm9qZWN0LmluaXRpYWxpemUoKVxuXG4gICAgICBpdCAnc2NhbnMgYWdhaW4gYWxsIHRoZSBmaWxlcyB0aGF0IGhhdmUgYSBtb3JlIHJlY2VudCBtb2RpZmljYXRpb24gZGF0ZScsIC0+XG4gICAgICAgIGV4cGVjdChwcm9qZWN0LmdldFZhcmlhYmxlcygpLmxlbmd0aCkudG9FcXVhbChUT1RBTF9WQVJJQUJMRVNfSU5fUFJPSkVDVClcblxuICAgIGRlc2NyaWJlICd3aXRoIHNvbWUgZmlsZXMgbm90IHNhdmVkIGluIHRoZSBwcm9qZWN0IHN0YXRlJywgLT5cbiAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgcHJvamVjdCA9IGNyZWF0ZVByb2plY3RcbiAgICAgICAgICBzdGF0ZUZpeHR1cmU6IFwicGFydGlhbC1wcm9qZWN0Lmpzb25cIlxuXG4gICAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPiBwcm9qZWN0LmluaXRpYWxpemUoKVxuXG4gICAgICBpdCAnZGV0ZWN0cyB0aGUgbmV3IGZpbGVzIGFuZCBzY2FucyB0aGVtJywgLT5cbiAgICAgICAgZXhwZWN0KHByb2plY3QuZ2V0VmFyaWFibGVzKCkubGVuZ3RoKS50b0VxdWFsKDEyKVxuXG4gICAgZGVzY3JpYmUgJ3dpdGggYW4gb3BlbiBlZGl0b3IgYW5kIHRoZSBjb3JyZXNwb25kaW5nIGJ1ZmZlciBzdGF0ZScsIC0+XG4gICAgICBbZWRpdG9yLCBjb2xvckJ1ZmZlcl0gPSBbXVxuICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgICAgICBhdG9tLndvcmtzcGFjZS5vcGVuKCd2YXJpYWJsZXMuc3R5bCcpLnRoZW4gKG8pIC0+IGVkaXRvciA9IG9cblxuICAgICAgICBydW5zIC0+XG4gICAgICAgICAgcHJvamVjdCA9IGNyZWF0ZVByb2plY3RcbiAgICAgICAgICAgIHN0YXRlRml4dHVyZTogXCJvcGVuLWJ1ZmZlci1wcm9qZWN0Lmpzb25cIlxuICAgICAgICAgICAgaWQ6IGVkaXRvci5pZFxuXG4gICAgICAgICAgc3B5T24oQ29sb3JCdWZmZXIucHJvdG90eXBlLCAndmFyaWFibGVzQXZhaWxhYmxlJykuYW5kQ2FsbFRocm91Z2goKVxuXG4gICAgICAgIHJ1bnMgLT4gY29sb3JCdWZmZXIgPSBwcm9qZWN0LmNvbG9yQnVmZmVyc0J5RWRpdG9ySWRbZWRpdG9yLmlkXVxuXG4gICAgICBpdCAncmVzdG9yZXMgdGhlIGNvbG9yIGJ1ZmZlciBpbiBpdHMgcHJldmlvdXMgc3RhdGUnLCAtPlxuICAgICAgICBleHBlY3QoY29sb3JCdWZmZXIpLnRvQmVEZWZpbmVkKClcbiAgICAgICAgZXhwZWN0KGNvbG9yQnVmZmVyLmdldENvbG9yTWFya2VycygpLmxlbmd0aCkudG9FcXVhbChUT1RBTF9DT0xPUlNfVkFSSUFCTEVTX0lOX1BST0pFQ1QpXG5cbiAgICAgIGl0ICdkb2VzIG5vdCB3YWl0IGZvciB0aGUgcHJvamVjdCB2YXJpYWJsZXMnLCAtPlxuICAgICAgICBleHBlY3QoY29sb3JCdWZmZXIudmFyaWFibGVzQXZhaWxhYmxlKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG5cbiAgICBkZXNjcmliZSAnd2l0aCBhbiBvcGVuIGVkaXRvciwgdGhlIGNvcnJlc3BvbmRpbmcgYnVmZmVyIHN0YXRlIGFuZCBhIG9sZCB0aW1lc3RhbXAnLCAtPlxuICAgICAgW2VkaXRvciwgY29sb3JCdWZmZXJdID0gW11cbiAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICAgICAgYXRvbS53b3Jrc3BhY2Uub3BlbigndmFyaWFibGVzLnN0eWwnKS50aGVuIChvKSAtPiBlZGl0b3IgPSBvXG5cbiAgICAgICAgcnVucyAtPlxuICAgICAgICAgIHNweU9uKENvbG9yQnVmZmVyLnByb3RvdHlwZSwgJ3VwZGF0ZVZhcmlhYmxlUmFuZ2VzJykuYW5kQ2FsbFRocm91Z2goKVxuICAgICAgICAgIHByb2plY3QgPSBjcmVhdGVQcm9qZWN0XG4gICAgICAgICAgICB0aW1lc3RhbXA6IG5ldyBEYXRlKDApLnRvSlNPTigpXG4gICAgICAgICAgICBzdGF0ZUZpeHR1cmU6IFwib3Blbi1idWZmZXItcHJvamVjdC5qc29uXCJcbiAgICAgICAgICAgIGlkOiBlZGl0b3IuaWRcblxuICAgICAgICBydW5zIC0+IGNvbG9yQnVmZmVyID0gcHJvamVjdC5jb2xvckJ1ZmZlcnNCeUVkaXRvcklkW2VkaXRvci5pZF1cblxuICAgICAgICB3YWl0c0ZvciAtPiBjb2xvckJ1ZmZlci51cGRhdGVWYXJpYWJsZVJhbmdlcy5jYWxsQ291bnQgPiAwXG5cbiAgICAgIGl0ICdpbnZhbGlkYXRlcyB0aGUgY29sb3IgYnVmZmVyIG1hcmtlcnMgYXMgc29vbiBhcyB0aGUgZGlydHkgcGF0aHMgaGF2ZSBiZWVuIGRldGVybWluZWQnLCAtPlxuICAgICAgICBleHBlY3QoY29sb3JCdWZmZXIudXBkYXRlVmFyaWFibGVSYW5nZXMpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuXG4jIyAgICAjIyMjIyMjIyAgIyMjIyMjIyMgIyMjIyMjIyMgICAgIyMjICAgICMjICAgICAjIyAjIyAgICAgICAjIyMjIyMjI1xuIyMgICAgIyMgICAgICMjICMjICAgICAgICMjICAgICAgICAgIyMgIyMgICAjIyAgICAgIyMgIyMgICAgICAgICAgIyNcbiMjICAgICMjICAgICAjIyAjIyAgICAgICAjIyAgICAgICAgIyMgICAjIyAgIyMgICAgICMjICMjICAgICAgICAgICMjXG4jIyAgICAjIyAgICAgIyMgIyMjIyMjICAgIyMjIyMjICAgIyMgICAgICMjICMjICAgICAjIyAjIyAgICAgICAgICAjI1xuIyMgICAgIyMgICAgICMjICMjICAgICAgICMjICAgICAgICMjIyMjIyMjIyAjIyAgICAgIyMgIyMgICAgICAgICAgIyNcbiMjICAgICMjICAgICAjIyAjIyAgICAgICAjIyAgICAgICAjIyAgICAgIyMgIyMgICAgICMjICMjICAgICAgICAgICMjXG4jIyAgICAjIyMjIyMjIyAgIyMjIyMjIyMgIyMgICAgICAgIyMgICAgICMjICAjIyMjIyMjICAjIyMjIyMjIyAgICAjI1xuXG5kZXNjcmliZSAnQ29sb3JQcm9qZWN0JywgLT5cbiAgW3Byb2plY3QsIHJvb3RQYXRoXSA9IFtdXG4gIGRlc2NyaWJlICd3aGVuIHRoZSBwcm9qZWN0IGhhcyBhIHBpZ21lbnRzIGRlZmF1bHRzIGZpbGUnLCAtPlxuICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgIGF0b20uY29uZmlnLnNldCAncGlnbWVudHMuc291cmNlTmFtZXMnLCBbJyouc2FzcyddXG5cbiAgICAgIFtmaXh0dXJlc1BhdGhdID0gYXRvbS5wcm9qZWN0LmdldFBhdGhzKClcbiAgICAgIHJvb3RQYXRoID0gXCIje2ZpeHR1cmVzUGF0aH0vcHJvamVjdC13aXRoLWRlZmF1bHRzXCJcbiAgICAgIGF0b20ucHJvamVjdC5zZXRQYXRocyhbcm9vdFBhdGhdKVxuXG4gICAgICBwcm9qZWN0ID0gbmV3IENvbG9yUHJvamVjdCh7fSlcblxuICAgICAgd2FpdHNGb3JQcm9taXNlIC0+IHByb2plY3QuaW5pdGlhbGl6ZSgpXG5cbiAgICBpdCAnbG9hZHMgdGhlIGRlZmF1bHRzIGZpbGUgY29udGVudCcsIC0+XG4gICAgICBleHBlY3QocHJvamVjdC5nZXRDb2xvclZhcmlhYmxlcygpLmxlbmd0aCkudG9FcXVhbCgxMilcbiJdfQ==
