(function() {
  var CompositeDisposable, EventsDelegation, Palette, PaletteElement, SpacePenDSL, StickyTitle, THEME_VARIABLES, pigments, ref, ref1, registerOrUpdateElement,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  ref = require('atom-utils'), SpacePenDSL = ref.SpacePenDSL, EventsDelegation = ref.EventsDelegation, registerOrUpdateElement = ref.registerOrUpdateElement;

  ref1 = [], CompositeDisposable = ref1[0], THEME_VARIABLES = ref1[1], pigments = ref1[2], Palette = ref1[3], StickyTitle = ref1[4];

  PaletteElement = (function(superClass) {
    extend(PaletteElement, superClass);

    function PaletteElement() {
      return PaletteElement.__super__.constructor.apply(this, arguments);
    }

    SpacePenDSL.includeInto(PaletteElement);

    EventsDelegation.includeInto(PaletteElement);

    PaletteElement.content = function() {
      var group, merge, optAttrs, sort;
      sort = atom.config.get('pigments.sortPaletteColors');
      group = atom.config.get('pigments.groupPaletteColors');
      merge = atom.config.get('pigments.mergeColorDuplicates');
      optAttrs = function(bool, name, attrs) {
        if (bool) {
          attrs[name] = name;
        }
        return attrs;
      };
      return this.div({
        "class": 'pigments-palette-panel'
      }, (function(_this) {
        return function() {
          _this.div({
            "class": 'pigments-palette-controls settings-view pane-item'
          }, function() {
            return _this.div({
              "class": 'pigments-palette-controls-wrapper'
            }, function() {
              _this.span({
                "class": 'input-group-inline'
              }, function() {
                _this.label({
                  "for": 'sort-palette-colors'
                }, 'Sort Colors');
                return _this.select({
                  outlet: 'sort',
                  id: 'sort-palette-colors'
                }, function() {
                  _this.option(optAttrs(sort === 'none', 'selected', {
                    value: 'none'
                  }), 'None');
                  _this.option(optAttrs(sort === 'by name', 'selected', {
                    value: 'by name'
                  }), 'By Name');
                  return _this.option(optAttrs(sort === 'by file', 'selected', {
                    value: 'by color'
                  }), 'By Color');
                });
              });
              _this.span({
                "class": 'input-group-inline'
              }, function() {
                _this.label({
                  "for": 'sort-palette-colors'
                }, 'Group Colors');
                return _this.select({
                  outlet: 'group',
                  id: 'group-palette-colors'
                }, function() {
                  _this.option(optAttrs(group === 'none', 'selected', {
                    value: 'none'
                  }), 'None');
                  return _this.option(optAttrs(group === 'by file', 'selected', {
                    value: 'by file'
                  }), 'By File');
                });
              });
              return _this.span({
                "class": 'input-group-inline'
              }, function() {
                _this.input(optAttrs(merge, 'checked', {
                  type: 'checkbox',
                  id: 'merge-duplicates',
                  outlet: 'merge'
                }));
                return _this.label({
                  "for": 'merge-duplicates'
                }, 'Merge Duplicates');
              });
            });
          });
          return _this.div({
            "class": 'pigments-palette-list native-key-bindings',
            tabindex: -1
          }, function() {
            return _this.ol({
              outlet: 'list'
            });
          });
        };
      })(this));
    };

    PaletteElement.prototype.createdCallback = function() {
      var subscription;
      if (pigments == null) {
        pigments = require('./pigments');
      }
      this.project = pigments.getProject();
      if (this.project != null) {
        return this.init();
      } else {
        return subscription = atom.packages.onDidActivatePackage((function(_this) {
          return function(pkg) {
            if (pkg.name === 'pigments') {
              subscription.dispose();
              _this.project = pigments.getProject();
              return _this.init();
            }
          };
        })(this));
      }
    };

    PaletteElement.prototype.init = function() {
      if (this.project.isDestroyed()) {
        return;
      }
      if (CompositeDisposable == null) {
        CompositeDisposable = require('atom').CompositeDisposable;
      }
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(this.project.onDidUpdateVariables((function(_this) {
        return function() {
          if (_this.palette != null) {
            _this.palette.variables = _this.project.getColorVariables();
            if (_this.attached) {
              return _this.renderList();
            }
          }
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('pigments.sortPaletteColors', (function(_this) {
        return function(sortPaletteColors) {
          _this.sortPaletteColors = sortPaletteColors;
          if ((_this.palette != null) && _this.attached) {
            return _this.renderList();
          }
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('pigments.groupPaletteColors', (function(_this) {
        return function(groupPaletteColors) {
          _this.groupPaletteColors = groupPaletteColors;
          if ((_this.palette != null) && _this.attached) {
            return _this.renderList();
          }
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('pigments.mergeColorDuplicates', (function(_this) {
        return function(mergeColorDuplicates) {
          _this.mergeColorDuplicates = mergeColorDuplicates;
          if ((_this.palette != null) && _this.attached) {
            return _this.renderList();
          }
        };
      })(this)));
      this.subscriptions.add(this.subscribeTo(this.sort, {
        'change': function(e) {
          return atom.config.set('pigments.sortPaletteColors', e.target.value);
        }
      }));
      this.subscriptions.add(this.subscribeTo(this.group, {
        'change': function(e) {
          return atom.config.set('pigments.groupPaletteColors', e.target.value);
        }
      }));
      this.subscriptions.add(this.subscribeTo(this.merge, {
        'change': function(e) {
          return atom.config.set('pigments.mergeColorDuplicates', e.target.checked);
        }
      }));
      return this.subscriptions.add(this.subscribeTo(this.list, '[data-variable-id]', {
        'click': (function(_this) {
          return function(e) {
            var variable, variableId;
            variableId = Number(e.target.dataset.variableId);
            variable = _this.project.getVariableById(variableId);
            return _this.project.showVariableInFile(variable);
          };
        })(this)
      }));
    };

    PaletteElement.prototype.attachedCallback = function() {
      if (this.palette != null) {
        this.renderList();
      }
      return this.attached = true;
    };

    PaletteElement.prototype.detachedCallback = function() {
      this.subscriptions.dispose();
      return this.attached = false;
    };

    PaletteElement.prototype.getModel = function() {
      return this.palette;
    };

    PaletteElement.prototype.setModel = function(palette1) {
      this.palette = palette1;
      if (this.attached) {
        return this.renderList();
      }
    };

    PaletteElement.prototype.getColorsList = function(palette) {
      switch (this.sortPaletteColors) {
        case 'by color':
          return palette.sortedByColor();
        case 'by name':
          return palette.sortedByName();
        default:
          return palette.variables.slice();
      }
    };

    PaletteElement.prototype.renderList = function() {
      var file, li, ol, palette, palettes, ref2;
      if ((ref2 = this.stickyTitle) != null) {
        ref2.dispose();
      }
      this.list.innerHTML = '';
      if (this.groupPaletteColors === 'by file') {
        if (StickyTitle == null) {
          StickyTitle = require('./sticky-title');
        }
        palettes = this.getFilesPalettes();
        for (file in palettes) {
          palette = palettes[file];
          li = document.createElement('li');
          li.className = 'pigments-color-group';
          ol = document.createElement('ol');
          li.appendChild(this.getGroupHeader(atom.project.relativize(file)));
          li.appendChild(ol);
          this.buildList(ol, this.getColorsList(palette));
          this.list.appendChild(li);
        }
        return this.stickyTitle = new StickyTitle(this.list.querySelectorAll('.pigments-color-group-header-content'), this.querySelector('.pigments-palette-list'));
      } else {
        return this.buildList(this.list, this.getColorsList(this.palette));
      }
    };

    PaletteElement.prototype.getGroupHeader = function(label) {
      var content, header;
      if (THEME_VARIABLES == null) {
        THEME_VARIABLES = require('./uris').THEME_VARIABLES;
      }
      header = document.createElement('div');
      header.className = 'pigments-color-group-header';
      content = document.createElement('div');
      content.className = 'pigments-color-group-header-content';
      if (label === THEME_VARIABLES) {
        content.textContent = 'Atom Themes';
      } else {
        content.textContent = label;
      }
      header.appendChild(content);
      return header;
    };

    PaletteElement.prototype.getFilesPalettes = function() {
      var palettes;
      if (Palette == null) {
        Palette = require('./palette');
      }
      palettes = {};
      this.palette.eachColor((function(_this) {
        return function(variable) {
          var path;
          path = variable.path;
          if (palettes[path] == null) {
            palettes[path] = new Palette([]);
          }
          return palettes[path].variables.push(variable);
        };
      })(this));
      return palettes;
    };

    PaletteElement.prototype.buildList = function(container, paletteColors) {
      var color, html, i, id, isAlternate, j, len, len1, li, line, name, path, ref2, ref3, results1, variables;
      if (THEME_VARIABLES == null) {
        THEME_VARIABLES = require('./uris').THEME_VARIABLES;
      }
      paletteColors = this.checkForDuplicates(paletteColors);
      results1 = [];
      for (i = 0, len = paletteColors.length; i < len; i++) {
        variables = paletteColors[i];
        li = document.createElement('li');
        li.className = 'pigments-color-item';
        ref2 = variables[0], color = ref2.color, isAlternate = ref2.isAlternate;
        if (isAlternate) {
          continue;
        }
        if (color.toCSS == null) {
          continue;
        }
        html = "<div class=\"pigments-color\">\n  <span class=\"pigments-color-preview\"\n        style=\"background-color: " + (color.toCSS()) + "\">\n  </span>\n  <span class=\"pigments-color-properties\">\n    <span class=\"pigments-color-component\"><strong>R:</strong> " + (Math.round(color.red)) + "</span>\n    <span class=\"pigments-color-component\"><strong>G:</strong> " + (Math.round(color.green)) + "</span>\n    <span class=\"pigments-color-component\"><strong>B:</strong> " + (Math.round(color.blue)) + "</span>\n    <span class=\"pigments-color-component\"><strong>A:</strong> " + (Math.round(color.alpha * 1000) / 1000) + "</span>\n  </span>\n</div>\n<div class=\"pigments-color-details\">";
        for (j = 0, len1 = variables.length; j < len1; j++) {
          ref3 = variables[j], name = ref3.name, path = ref3.path, line = ref3.line, id = ref3.id;
          html += "<span class=\"pigments-color-occurence\">\n    <span class=\"name\">" + name + "</span>";
          if (path !== THEME_VARIABLES) {
            html += "<span data-variable-id=\"" + id + "\">\n  <span class=\"path\">" + (atom.project.relativize(path)) + "</span>\n  <span class=\"line\">at line " + (line + 1) + "</span>\n</span>";
          }
          html += '</span>';
        }
        html += '</div>';
        li.innerHTML = html;
        results1.push(container.appendChild(li));
      }
      return results1;
    };

    PaletteElement.prototype.checkForDuplicates = function(paletteColors) {
      var colors, findColor, i, key, len, map, results, v;
      results = [];
      if (this.mergeColorDuplicates) {
        map = new Map();
        colors = [];
        findColor = function(color) {
          var col, i, len;
          for (i = 0, len = colors.length; i < len; i++) {
            col = colors[i];
            if (typeof col.isEqual === "function" ? col.isEqual(color) : void 0) {
              return col;
            }
          }
        };
        for (i = 0, len = paletteColors.length; i < len; i++) {
          v = paletteColors[i];
          if (key = findColor(v.color)) {
            map.get(key).push(v);
          } else {
            map.set(v.color, [v]);
            colors.push(v.color);
          }
        }
        map.forEach(function(vars, color) {
          return results.push(vars);
        });
        return results;
      } else {
        return (function() {
          var j, len1, results1;
          results1 = [];
          for (j = 0, len1 = paletteColors.length; j < len1; j++) {
            v = paletteColors[j];
            results1.push([v]);
          }
          return results1;
        })();
      }
    };

    return PaletteElement;

  })(HTMLElement);

  module.exports = PaletteElement = registerOrUpdateElement('pigments-palette', PaletteElement.prototype);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvZGRld2V5Ly5hdG9tL3BhY2thZ2VzL3BpZ21lbnRzL2xpYi9wYWxldHRlLWVsZW1lbnQuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSx1SkFBQTtJQUFBOzs7RUFBQSxNQUEyRCxPQUFBLENBQVEsWUFBUixDQUEzRCxFQUFDLDZCQUFELEVBQWMsdUNBQWQsRUFBZ0M7O0VBRWhDLE9BQXlFLEVBQXpFLEVBQUMsNkJBQUQsRUFBc0IseUJBQXRCLEVBQXVDLGtCQUF2QyxFQUFpRCxpQkFBakQsRUFBMEQ7O0VBRXBEOzs7Ozs7O0lBQ0osV0FBVyxDQUFDLFdBQVosQ0FBd0IsY0FBeEI7O0lBQ0EsZ0JBQWdCLENBQUMsV0FBakIsQ0FBNkIsY0FBN0I7O0lBRUEsY0FBQyxDQUFBLE9BQUQsR0FBVSxTQUFBO0FBQ1IsVUFBQTtNQUFBLElBQUEsR0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsNEJBQWhCO01BQ1AsS0FBQSxHQUFRLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiw2QkFBaEI7TUFDUixLQUFBLEdBQVEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLCtCQUFoQjtNQUNSLFFBQUEsR0FBVyxTQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsS0FBYjtRQUNULElBQXNCLElBQXRCO1VBQUEsS0FBTSxDQUFBLElBQUEsQ0FBTixHQUFjLEtBQWQ7O2VBQ0E7TUFGUzthQUlYLElBQUMsQ0FBQSxHQUFELENBQUs7UUFBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLHdCQUFQO09BQUwsRUFBc0MsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO1VBQ3BDLEtBQUMsQ0FBQSxHQUFELENBQUs7WUFBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLG1EQUFQO1dBQUwsRUFBaUUsU0FBQTttQkFDL0QsS0FBQyxDQUFBLEdBQUQsQ0FBSztjQUFBLENBQUEsS0FBQSxD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U0wsIEV2ZW50c0RlbGVnYXRpb24sIHJlZ2lzdGVyT3JVcGRhdGVFbGVtZW50fSA9IHJlcXVpcmUgJ2F0b20tdXRpbHMnXG5cbltDb21wb3NpdGVEaXNwb3NhYmxlLCBUSEVNRV9WQVJJQUJMRVMsIHBpZ21lbnRzLCBQYWxldHRlLCBTdGlja3lUaXRsZV0gPSBbXVxuXG5jbGFzcyBQYWxldHRlRWxlbWVudCBleHRlbmRzIEhUTUxFbGVtZW50XG4gIFNwYWNlUGVuRFNMLmluY2x1ZGVJbnRvKHRoaXMpXG4gIEV2ZW50c0RlbGVnYXRpb24uaW5jbHVkZUludG8odGhpcylcblxuICBAY29udGVudDogLT5cbiAgICBzb3J0ID0gYXRvbS5jb25maWcuZ2V0KCdwaWdtZW50cy5zb3J0UGFsZXR0ZUNvbG9ycycpXG4gICAgZ3JvdXAgPSBhdG9tLmNvbmZpZy5nZXQoJ3BpZ21lbnRzLmdyb3VwUGFsZXR0ZUNvbG9ycycpXG4gICAgbWVyZ2UgPSBhdG9tLmNvbmZpZy5nZXQoJ3BpZ21lbnRzLm1lcmdlQ29sb3JEdXBsaWNhdGVzJylcbiAgICBvcHRBdHRycyA9IChib29sLCBuYW1lLCBhdHRycykgLT5cbiAgICAgIGF0dHJzW25hbWVdID0gbmFtZSBpZiBib29sXG4gICAgICBhdHRyc1xuXG4gICAgQGRpdiBjbGFzczogJ3BpZ21lbnRzLXBhbGV0dGUtcGFuZWwnLCA9PlxuICAgICAgQGRpdiBjbGFzczogJ3BpZ21lbnRzLXBhbGV0dGUtY29udHJvbHMgc2V0dGluZ3MtdmlldyBwYW5lLWl0ZW0nLCA9PlxuICAgICAgICBAZGl2IGNsYXNzOiAncGlnbWVudHMtcGFsZXR0ZS1jb250cm9scy13cmFwcGVyJywgPT5cbiAgICAgICAgICBAc3BhbiBjbGFzczogJ2lucHV0LWdyb3VwLWlubGluZScsID0+XG4gICAgICAgICAgICBAbGFiZWwgZm9yOiAnc29ydC1wYWxldHRlLWNvbG9ycycsICdTb3J0IENvbG9ycydcbiAgICAgICAgICAgIEBzZWxlY3Qgb3V0bGV0OiAnc29ydCcsIGlkOiAnc29ydC1wYWxldHRlLWNvbG9ycycsID0+XG4gICAgICAgICAgICAgIEBvcHRpb24gb3B0QXR0cnMoc29ydCBpcyAnbm9uZScsICdzZWxlY3RlZCcsIHZhbHVlOiAnbm9uZScpLCAnTm9uZSdcbiAgICAgICAgICAgICAgQG9wdGlvbiBvcHRBdHRycyhzb3J0IGlzICdieSBuYW1lJywgJ3NlbGVjdGVkJywgdmFsdWU6ICdieSBuYW1lJyksICdCeSBOYW1lJ1xuICAgICAgICAgICAgICBAb3B0aW9uIG9wdEF0dHJzKHNvcnQgaXMgJ2J5IGZpbGUnLCAnc2VsZWN0ZWQnLCB2YWx1ZTogJ2J5IGNvbG9yJyksICdCeSBDb2xvcidcblxuICAgICAgICAgIEBzcGFuIGNsYXNzOiAnaW5wdXQtZ3JvdXAtaW5saW5lJywgPT5cbiAgICAgICAgICAgIEBsYWJlbCBmb3I6ICdzb3J0LXBhbGV0dGUtY29sb3JzJywgJ0dyb3VwIENvbG9ycydcbiAgICAgICAgICAgIEBzZWxlY3Qgb3V0bGV0OiAnZ3JvdXAnLCBpZDogJ2dyb3VwLXBhbGV0dGUtY29sb3JzJywgPT5cbiAgICAgICAgICAgICAgQG9wdGlvbiBvcHRBdHRycyhncm91cCBpcyAnbm9uZScsICdzZWxlY3RlZCcsIHZhbHVlOiAnbm9uZScpLCAnTm9uZSdcbiAgICAgICAgICAgICAgQG9wdGlvbiBvcHRBdHRycyhncm91cCBpcyAnYnkgZmlsZScsICdzZWxlY3RlZCcsIHZhbHVlOiAnYnkgZmlsZScpLCAnQnkgRmlsZSdcblxuICAgICAgICAgIEBzcGFuIGNsYXNzOiAnaW5wdXQtZ3JvdXAtaW5saW5lJywgPT5cbiAgICAgICAgICAgIEBpbnB1dCBvcHRBdHRycyBtZXJnZSwgJ2NoZWNrZWQnLCB0eXBlOiAnY2hlY2tib3gnLCBpZDogJ21lcmdlLWR1cGxpY2F0ZXMnLCBvdXRsZXQ6ICdtZXJnZSdcbiAgICAgICAgICAgIEBsYWJlbCBmb3I6ICdtZXJnZS1kdXBsaWNhdGVzJywgJ01lcmdlIER1cGxpY2F0ZXMnXG5cbiAgICAgIEBkaXYgY2xhc3M6ICdwaWdtZW50cy1wYWxldHRlLWxpc3QgbmF0aXZlLWtleS1iaW5kaW5ncycsIHRhYmluZGV4OiAtMSwgPT5cbiAgICAgICAgQG9sIG91dGxldDogJ2xpc3QnXG5cbiAgY3JlYXRlZENhbGxiYWNrOiAtPlxuICAgIHBpZ21lbnRzID89IHJlcXVpcmUgJy4vcGlnbWVudHMnXG5cbiAgICBAcHJvamVjdCA9IHBpZ21lbnRzLmdldFByb2plY3QoKVxuXG4gICAgaWYgQHByb2plY3Q/XG4gICAgICBAaW5pdCgpXG4gICAgZWxzZVxuICAgICAgc3Vic2NyaXB0aW9uID0gYXRvbS5wYWNrYWdlcy5vbkRpZEFjdGl2YXRlUGFja2FnZSAocGtnKSA9PlxuICAgICAgICBpZiBwa2cubmFtZSBpcyAncGlnbWVudHMnXG4gICAgICAgICAgc3Vic2NyaXB0aW9uLmRpc3Bvc2UoKVxuICAgICAgICAgIEBwcm9qZWN0ID0gcGlnbWVudHMuZ2V0UHJvamVjdCgpXG4gICAgICAgICAgQGluaXQoKVxuXG4gIGluaXQ6IC0+XG4gICAgcmV0dXJuIGlmIEBwcm9qZWN0LmlzRGVzdHJveWVkKClcblxuICAgIENvbXBvc2l0ZURpc3Bvc2FibGUgPz0gcmVxdWlyZSgnYXRvbScpLkNvbXBvc2l0ZURpc3Bvc2FibGVcblxuICAgIEBzdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgQHByb2plY3Qub25EaWRVcGRhdGVWYXJpYWJsZXMgPT5cbiAgICAgIGlmIEBwYWxldHRlP1xuICAgICAgICBAcGFsZXR0ZS52YXJpYWJsZXMgPSBAcHJvamVjdC5nZXRDb2xvclZhcmlhYmxlcygpXG4gICAgICAgIEByZW5kZXJMaXN0KCkgaWYgQGF0dGFjaGVkXG5cblxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbmZpZy5vYnNlcnZlICdwaWdtZW50cy5zb3J0UGFsZXR0ZUNvbG9ycycsIChAc29ydFBhbGV0dGVDb2xvcnMpID0+XG4gICAgICBAcmVuZGVyTGlzdCgpIGlmIEBwYWxldHRlPyBhbmQgQGF0dGFjaGVkXG5cbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb25maWcub2JzZXJ2ZSAncGlnbWVudHMuZ3JvdXBQYWxldHRlQ29sb3JzJywgKEBncm91cFBhbGV0dGVDb2xvcnMpID0+XG4gICAgICBAcmVuZGVyTGlzdCgpIGlmIEBwYWxldHRlPyBhbmQgQGF0dGFjaGVkXG5cbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb25maWcub2JzZXJ2ZSAncGlnbWVudHMubWVyZ2VDb2xvckR1cGxpY2F0ZXMnLCAoQG1lcmdlQ29sb3JEdXBsaWNhdGVzKSA9PlxuICAgICAgQHJlbmRlckxpc3QoKSBpZiBAcGFsZXR0ZT8gYW5kIEBhdHRhY2hlZFxuXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIEBzdWJzY3JpYmVUbyBAc29ydCwgJ2NoYW5nZSc6IChlKSAtPlxuICAgICAgYXRvbS5jb25maWcuc2V0ICdwaWdtZW50cy5zb3J0UGFsZXR0ZUNvbG9ycycsIGUudGFyZ2V0LnZhbHVlXG5cbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgQHN1YnNjcmliZVRvIEBncm91cCwgJ2NoYW5nZSc6IChlKSAtPlxuICAgICAgYXRvbS5jb25maWcuc2V0ICdwaWdtZW50cy5ncm91cFBhbGV0dGVDb2xvcnMnLCBlLnRhcmdldC52YWx1ZVxuXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIEBzdWJzY3JpYmVUbyBAbWVyZ2UsICdjaGFuZ2UnOiAoZSkgLT5cbiAgICAgIGF0b20uY29uZmlnLnNldCAncGlnbWVudHMubWVyZ2VDb2xvckR1cGxpY2F0ZXMnLCBlLnRhcmdldC5jaGVja2VkXG5cbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgQHN1YnNjcmliZVRvIEBsaXN0LCAnW2RhdGEtdmFyaWFibGUtaWRdJywgJ2NsaWNrJzogKGUpID0+XG4gICAgICB2YXJpYWJsZUlkID0gTnVtYmVyKGUudGFyZ2V0LmRhdGFzZXQudmFyaWFibGVJZClcbiAgICAgIHZhcmlhYmxlID0gQHByb2plY3QuZ2V0VmFyaWFibGVCeUlkKHZhcmlhYmxlSWQpXG5cbiAgICAgIEBwcm9qZWN0LnNob3dWYXJpYWJsZUluRmlsZSh2YXJpYWJsZSlcblxuICBhdHRhY2hlZENhbGxiYWNrOiAtPlxuICAgIEByZW5kZXJMaXN0KCkgaWYgQHBhbGV0dGU/XG4gICAgQGF0dGFjaGVkID0gdHJ1ZVxuXG4gIGRldGFjaGVkQ2FsbGJhY2s6IC0+XG4gICAgQHN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gICAgQGF0dGFjaGVkID0gZmFsc2VcblxuICBnZXRNb2RlbDogLT4gQHBhbGV0dGVcblxuICBzZXRNb2RlbDogKEBwYWxldHRlKSAtPiBAcmVuZGVyTGlzdCgpIGlmIEBhdHRhY2hlZFxuXG4gIGdldENvbG9yc0xpc3Q6IChwYWxldHRlKSAtPlxuICAgIHN3aXRjaCBAc29ydFBhbGV0dGVDb2xvcnNcbiAgICAgIHdoZW4gJ2J5IGNvbG9yJyB0aGVuIHBhbGV0dGUuc29ydGVkQnlDb2xvcigpXG4gICAgICB3aGVuICdieSBuYW1lJyB0aGVuIHBhbGV0dGUuc29ydGVkQnlOYW1lKClcbiAgICAgIGVsc2UgcGFsZXR0ZS52YXJpYWJsZXMuc2xpY2UoKVxuXG4gIHJlbmRlckxpc3Q6IC0+XG4gICAgQHN0aWNreVRpdGxlPy5kaXNwb3NlKClcbiAgICBAbGlzdC5pbm5lckhUTUwgPSAnJ1xuXG4gICAgaWYgQGdyb3VwUGFsZXR0ZUNvbG9ycyBpcyAnYnkgZmlsZSdcbiAgICAgIFN0aWNreVRpdGxlID89IHJlcXVpcmUgJy4vc3RpY2t5LXRpdGxlJ1xuXG4gICAgICBwYWxldHRlcyA9IEBnZXRGaWxlc1BhbGV0dGVzKClcbiAgICAgIGZvciBmaWxlLCBwYWxldHRlIG9mIHBhbGV0dGVzXG4gICAgICAgIGxpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKVxuICAgICAgICBsaS5jbGFzc05hbWUgPSAncGlnbWVudHMtY29sb3ItZ3JvdXAnXG4gICAgICAgIG9sID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb2wnKVxuXG4gICAgICAgIGxpLmFwcGVuZENoaWxkIEBnZXRHcm91cEhlYWRlcihhdG9tLnByb2plY3QucmVsYXRpdml6ZShmaWxlKSlcbiAgICAgICAgbGkuYXBwZW5kQ2hpbGQgb2xcbiAgICAgICAgQGJ1aWxkTGlzdChvbCwgQGdldENvbG9yc0xpc3QocGFsZXR0ZSkpXG4gICAgICAgIEBsaXN0LmFwcGVuZENoaWxkKGxpKVxuXG4gICAgICBAc3RpY2t5VGl0bGUgPSBuZXcgU3RpY2t5VGl0bGUoXG4gICAgICAgIEBsaXN0LnF1ZXJ5U2VsZWN0b3JBbGwoJy5waWdtZW50cy1jb2xvci1ncm91cC1oZWFkZXItY29udGVudCcpLFxuICAgICAgICBAcXVlcnlTZWxlY3RvcignLnBpZ21lbnRzLXBhbGV0dGUtbGlzdCcpXG4gICAgICApXG4gICAgZWxzZVxuICAgICAgQGJ1aWxkTGlzdChAbGlzdCwgQGdldENvbG9yc0xpc3QoQHBhbGV0dGUpKVxuXG4gIGdldEdyb3VwSGVhZGVyOiAobGFiZWwpIC0+XG4gICAgVEhFTUVfVkFSSUFCTEVTID89IHJlcXVpcmUoJy4vdXJpcycpLlRIRU1FX1ZBUklBQkxFU1xuXG4gICAgaGVhZGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICBoZWFkZXIuY2xhc3NOYW1lID0gJ3BpZ21lbnRzLWNvbG9yLWdyb3VwLWhlYWRlcidcblxuICAgIGNvbnRlbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgIGNvbnRlbnQuY2xhc3NOYW1lID0gJ3BpZ21lbnRzLWNvbG9yLWdyb3VwLWhlYWRlci1jb250ZW50J1xuICAgIGlmIGxhYmVsIGlzIFRIRU1FX1ZBUklBQkxFU1xuICAgICAgY29udGVudC50ZXh0Q29udGVudCA9ICdBdG9tIFRoZW1lcydcbiAgICBlbHNlXG4gICAgICBjb250ZW50LnRleHRDb250ZW50ID0gbGFiZWxcblxuICAgIGhlYWRlci5hcHBlbmRDaGlsZChjb250ZW50KVxuICAgIGhlYWRlclxuXG4gIGdldEZpbGVzUGFsZXR0ZXM6IC0+XG4gICAgUGFsZXR0ZSA/PSByZXF1aXJlICcuL3BhbGV0dGUnXG5cbiAgICBwYWxldHRlcyA9IHt9XG5cbiAgICBAcGFsZXR0ZS5lYWNoQ29sb3IgKHZhcmlhYmxlKSA9PlxuICAgICAge3BhdGh9ID0gdmFyaWFibGVcblxuICAgICAgcGFsZXR0ZXNbcGF0aF0gPz0gbmV3IFBhbGV0dGUgW11cbiAgICAgIHBhbGV0dGVzW3BhdGhdLnZhcmlhYmxlcy5wdXNoKHZhcmlhYmxlKVxuXG4gICAgcGFsZXR0ZXNcblxuICBidWlsZExpc3Q6IChjb250YWluZXIsIHBhbGV0dGVDb2xvcnMpIC0+XG4gICAgVEhFTUVfVkFSSUFCTEVTID89IHJlcXVpcmUoJy4vdXJpcycpLlRIRU1FX1ZBUklBQkxFU1xuXG4gICAgcGFsZXR0ZUNvbG9ycyA9IEBjaGVja0ZvckR1cGxpY2F0ZXMocGFsZXR0ZUNvbG9ycylcbiAgICBmb3IgdmFyaWFibGVzIGluIHBhbGV0dGVDb2xvcnNcbiAgICAgIGxpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKVxuICAgICAgbGkuY2xhc3NOYW1lID0gJ3BpZ21lbnRzLWNvbG9yLWl0ZW0nXG4gICAgICB7Y29sb3IsIGlzQWx0ZXJuYXRlfSA9IHZhcmlhYmxlc1swXVxuXG4gICAgICBjb250aW51ZSBpZiBpc0FsdGVybmF0ZVxuICAgICAgY29udGludWUgdW5sZXNzIGNvbG9yLnRvQ1NTP1xuXG4gICAgICBodG1sID0gXCJcIlwiXG4gICAgICA8ZGl2IGNsYXNzPVwicGlnbWVudHMtY29sb3JcIj5cbiAgICAgICAgPHNwYW4gY2xhc3M9XCJwaWdtZW50cy1jb2xvci1wcmV2aWV3XCJcbiAgICAgICAgICAgICAgc3R5bGU9XCJiYWNrZ3JvdW5kLWNvbG9yOiAje2NvbG9yLnRvQ1NTKCl9XCI+XG4gICAgICAgIDwvc3Bhbj5cbiAgICAgICAgPHNwYW4gY2xhc3M9XCJwaWdtZW50cy1jb2xvci1wcm9wZXJ0aWVzXCI+XG4gICAgICAgICAgPHNwYW4gY2xhc3M9XCJwaWdtZW50cy1jb2xvci1jb21wb25lbnRcIj48c3Ryb25nPlI6PC9zdHJvbmc+ICN7TWF0aC5yb3VuZCBjb2xvci5yZWR9PC9zcGFuPlxuICAgICAgICAgIDxzcGFuIGNsYXNzPVwicGlnbWVudHMtY29sb3ItY29tcG9uZW50XCI+PHN0cm9uZz5HOjwvc3Ryb25nPiAje01hdGgucm91bmQgY29sb3IuZ3JlZW59PC9zcGFuPlxuICAgICAgICAgIDxzcGFuIGNsYXNzPVwicGlnbWVudHMtY29sb3ItY29tcG9uZW50XCI+PHN0cm9uZz5COjwvc3Ryb25nPiAje01hdGgucm91bmQgY29sb3IuYmx1ZX08L3NwYW4+XG4gICAgICAgICAgPHNwYW4gY2xhc3M9XCJwaWdtZW50cy1jb2xvci1jb21wb25lbnRcIj48c3Ryb25nPkE6PC9zdHJvbmc+ICN7TWF0aC5yb3VuZChjb2xvci5hbHBoYSAqIDEwMDApIC8gMTAwMH08L3NwYW4+XG4gICAgICAgIDwvc3Bhbj5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBjbGFzcz1cInBpZ21lbnRzLWNvbG9yLWRldGFpbHNcIj5cbiAgICAgIFwiXCJcIlxuXG4gICAgICBmb3Ige25hbWUsIHBhdGgsIGxpbmUsIGlkfSBpbiB2YXJpYWJsZXNcbiAgICAgICAgaHRtbCArPSBcIlwiXCJcbiAgICAgICAgPHNwYW4gY2xhc3M9XCJwaWdtZW50cy1jb2xvci1vY2N1cmVuY2VcIj5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwibmFtZVwiPiN7bmFtZX08L3NwYW4+XG4gICAgICAgIFwiXCJcIlxuXG4gICAgICAgIGlmIHBhdGggaXNudCBUSEVNRV9WQVJJQUJMRVNcbiAgICAgICAgICBodG1sICs9IFwiXCJcIlxuICAgICAgICAgIDxzcGFuIGRhdGEtdmFyaWFibGUtaWQ9XCIje2lkfVwiPlxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJwYXRoXCI+I3thdG9tLnByb2plY3QucmVsYXRpdml6ZShwYXRoKX08L3NwYW4+XG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cImxpbmVcIj5hdCBsaW5lICN7bGluZSArIDF9PC9zcGFuPlxuICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICBcIlwiXCJcblxuICAgICAgICBodG1sICs9ICc8L3NwYW4+J1xuXG4gICAgICBodG1sICs9ICc8L2Rpdj4nXG5cbiAgICAgIGxpLmlubmVySFRNTCA9IGh0bWxcblxuICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGxpKVxuXG4gIGNoZWNrRm9yRHVwbGljYXRlczogKHBhbGV0dGVDb2xvcnMpIC0+XG4gICAgcmVzdWx0cyA9IFtdXG4gICAgaWYgQG1lcmdlQ29sb3JEdXBsaWNhdGVzXG4gICAgICBtYXAgPSBuZXcgTWFwKClcblxuICAgICAgY29sb3JzID0gW11cblxuICAgICAgZmluZENvbG9yID0gKGNvbG9yKSAtPlxuICAgICAgICByZXR1cm4gY29sIGZvciBjb2wgaW4gY29sb3JzIHdoZW4gY29sLmlzRXF1YWw/KGNvbG9yKVxuXG4gICAgICBmb3IgdiBpbiBwYWxldHRlQ29sb3JzXG4gICAgICAgIGlmIGtleSA9IGZpbmRDb2xvcih2LmNvbG9yKVxuICAgICAgICAgIG1hcC5nZXQoa2V5KS5wdXNoKHYpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBtYXAuc2V0KHYuY29sb3IsIFt2XSlcbiAgICAgICAgICBjb2xvcnMucHVzaCh2LmNvbG9yKVxuXG4gICAgICBtYXAuZm9yRWFjaCAodmFycywgY29sb3IpIC0+IHJlc3VsdHMucHVzaCB2YXJzXG5cbiAgICAgIHJldHVybiByZXN1bHRzXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIChbdl0gZm9yIHYgaW4gcGFsZXR0ZUNvbG9ycylcblxuXG5tb2R1bGUuZXhwb3J0cyA9XG5QYWxldHRlRWxlbWVudCA9XG5yZWdpc3Rlck9yVXBkYXRlRWxlbWVudCAncGlnbWVudHMtcGFsZXR0ZScsIFBhbGV0dGVFbGVtZW50LnByb3RvdHlwZVxuIl19
