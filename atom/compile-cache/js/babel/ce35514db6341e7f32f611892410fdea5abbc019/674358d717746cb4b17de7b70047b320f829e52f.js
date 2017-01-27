Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* eslint "class-methods-use-this": ["error", {"exceptMethods": ["viewForItem"]}] */

var _atomSpacePenViews = require('atom-space-pen-views');

var _mobx = require('mobx');

var _underscorePlus = require('underscore-plus');

var _Manager = require('../Manager');

var _Manager2 = _interopRequireDefault(_Manager);

'use babel';
var ProjectsListView = (function (_SelectListView) {
  _inherits(ProjectsListView, _SelectListView);

  function ProjectsListView() {
    var _this = this;

    _classCallCheck(this, ProjectsListView);

    _get(Object.getPrototypeOf(ProjectsListView.prototype), 'constructor', this).call(this);

    (0, _mobx.autorun)('Loading projects for list view', function () {
      if (_this.panel && _this.panel.isVisible()) {
        _this.show(_Manager2['default'].projects);
      }
    });
  }

  _createClass(ProjectsListView, [{
    key: 'initialize',
    value: function initialize() {
      var _this2 = this;

      _get(Object.getPrototypeOf(ProjectsListView.prototype), 'initialize', this).call(this);
      this.addClass('project-manager');

      var infoText = 'shift+enter will open project in the current window';
      if (ProjectsListView.reversedConfirm) {
        infoText = 'shift+enter will open project in a new window';
      }
      var infoElement = document.createElement('div');
      infoElement.className = 'text-smaller';
      infoElement.innerHTML = infoText;
      this.error.after(infoElement);

      atom.commands.add(this.element, {
        'project-manager:alt-confirm': function projectManagerAltConfirm(event) {
          _this2.altConfirmed();
          event.stopPropagation();
        }
      });
    }
  }, {
    key: 'getFilterKey',
    value: function getFilterKey() {
      var input = this.filterEditorView.getText();
      var inputArr = input.split(':');
      var isFilterKey = ProjectsListView.possibleFilterKeys.includes(inputArr[0]);
      var filter = ProjectsListView.defaultFilterKey;

      if (inputArr.length > 1 && isFilterKey) {
        filter = inputArr[0];
      }

      return filter;
    }
  }, {
    key: 'getFilterQuery',
    value: function getFilterQuery() {
      var input = this.filterEditorView.getText();
      var inputArr = input.split(':');
      var filter = input;

      if (inputArr.length > 1) {
        filter = inputArr[1];
      }

      return filter;
    }
  }, {
    key: 'getEmptyMessage',
    value: function getEmptyMessage(itemCount, filteredItemCount) {
      if (itemCount === 0) {
        return 'No projects saved yet';
      }
      return _get(Object.getPrototypeOf(ProjectsListView.prototype), 'getEmptyMessage', this).call(this, itemCount, filteredItemCount);
    }
  }, {
    key: 'toggle',
    value: function toggle() {
      if (this.panel && this.panel.isVisible()) {
        this.cancel();
      } else {
        this.show(_Manager2['default'].projects);
      }
    }
  }, {
    key: 'show',
    value: function show(projects) {
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({ item: this });
      }

      this.storeFocusedElement();

      var sortedProjects = ProjectsListView.sortItems(projects);

      this.setItems(sortedProjects);
      this.focusFilterEditor();
    }
  }, {
    key: 'confirmed',
    value: function confirmed(project) {
      if (project) {
        _Manager.Manager.open(project, ProjectsListView.reversedConfirm);
        this.hide();
      }
    }
  }, {
    key: 'altConfirmed',
    value: function altConfirmed() {
      var project = this.getSelectedItem();
      if (project) {
        _Manager.Manager.open(project, !ProjectsListView.reversedConfirm);
        this.hide();
      }
    }
  }, {
    key: 'hide',
    value: function hide() {
      if (this.panel) {
        this.panel.hide();
      }
    }
  }, {
    key: 'cancel',
    value: function cancel() {
      _get(Object.getPrototypeOf(ProjectsListView.prototype), 'cancel', this).call(this);
    }
  }, {
    key: 'cancelled',
    value: function cancelled() {
      this.hide();
    }
  }, {
    key: 'viewForItem',
    value: function viewForItem(project) {
      var _project$props = project.props;
      var title = _project$props.title;
      var group = _project$props.group;
      var icon = _project$props.icon;
      var devMode = _project$props.devMode;
      var paths = _project$props.paths;

      var showPath = ProjectsListView.showPath;
      var projectMissing = !project.stats;

      return (0, _atomSpacePenViews.$$)(function itemView() {
        var _this3 = this;

        this.li({ 'class': 'two-lines' }, { 'data-path-missing': projectMissing }, function () {
          _this3.div({ 'class': 'primary-line' }, function () {
            if (devMode) {
              _this3.span({ 'class': 'project-manager-devmode' });
            }

            _this3.div({ 'class': 'icon ' + icon }, function () {
              _this3.span(title);
              if (group) {
                _this3.span({ 'class': 'project-manager-list-group' }, group);
              }
            });
          });
          _this3.div({ 'class': 'secondary-line' }, function () {
            if (projectMissing) {
              _this3.div({ 'class': 'icon icon-alert' }, 'Path is not available');
            } else if (showPath) {
              (0, _underscorePlus.each)(paths, function (path) {
                _this3.div({ 'class': 'no-icon' }, path);
              }, _this3);
            }
          });
        });
      });
    }
  }], [{
    key: 'sortItems',
    value: function sortItems(items) {
      var key = ProjectsListView.sortBy;
      var sorted = items;

      if (key === 'default') {
        return items;
      } else if (key === 'last modified') {
        sorted = items.sort(function (a, b) {
          var aModified = a.lastModified.getTime();
          var bModified = b.lastModified.getTime();

          return aModified > bModified ? -1 : 1;
        });
      } else {
        sorted = items.sort(function (a, b) {
          var aValue = (a[key] || '￿').toUpperCase();
          var bValue = (b[key] || '￿').toUpperCase();

          return aValue > bValue ? 1 : -1;
        });
      }

      return sorted;
    }
  }, {
    key: 'possibleFilterKeys',
    get: function get() {
      return ['title', 'group', 'template'];
    }
  }, {
    key: 'defaultFilterKey',
    get: function get() {
      return 'title';
    }
  }, {
    key: 'sortBy',
    get: function get() {
      return atom.config.get('project-manager.sortBy');
    }
  }, {
    key: 'showPath',
    get: function get() {
      return atom.config.get('project-manager.showPath');
    }
  }, {
    key: 'reversedConfirm',
    get: function get() {
      return atom.config.get('project-manager.alwaysOpenInSameWindow');
    }
  }]);

  return ProjectsListView;
})(_atomSpacePenViews.SelectListView);

exports['default'] = ProjectsListView;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2RkZXdleS8uYXRvbS9wYWNrYWdlcy9wcm9qZWN0LW1hbmFnZXIvbGliL3ZpZXdzL3Byb2plY3RzLWxpc3Qtdmlldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O2lDQUltQyxzQkFBc0I7O29CQUNqQyxNQUFNOzs4QkFDVCxpQkFBaUI7O3VCQUNMLFlBQVk7Ozs7QUFQN0MsV0FBVyxDQUFDO0lBU1MsZ0JBQWdCO1lBQWhCLGdCQUFnQjs7QUFDeEIsV0FEUSxnQkFBZ0IsR0FDckI7OzswQkFESyxnQkFBZ0I7O0FBRWpDLCtCQUZpQixnQkFBZ0IsNkNBRXpCOztBQUVSLHVCQUFRLGdDQUFnQyxFQUFFLFlBQU07QUFDOUMsVUFBSSxNQUFLLEtBQUssSUFBSSxNQUFLLEtBQUssQ0FBQyxTQUFTLEVBQUUsRUFBRTtBQUN4QyxjQUFLLElBQUksQ0FBQyxxQkFBUSxRQUFRLENBQUMsQ0FBQztPQUM3QjtLQUNGLENBQUMsQ0FBQztHQUNKOztlQVRrQixnQkFBZ0I7O1dBVXpCLHNCQUFHOzs7QUFDWCxpQ0FYaUIsZ0JBQWdCLDRDQVdkO0FBQ25CLFVBQUksQ0FBQyxRQUFRLENBQUMsaUJBQWlCLENBQUMsQ0FBQzs7QUFFakMsVUFBSSxRQUFRLEdBQUcscURBQXFELENBQUM7QUFDckUsVUFBSSxnQkFBZ0IsQ0FBQyxlQUFlLEVBQUU7QUFDcEMsZ0JBQVEsR0FBRywrQ0FBK0MsQ0FBQztPQUM1RDtBQUNELFVBQU0sV0FBVyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDbEQsaUJBQVcsQ0FBQyxTQUFTLEdBQUcsY0FBYyxDQUFDO0FBQ3ZDLGlCQUFXLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQztBQUNqQyxVQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQzs7QUFFOUIsVUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRTtBQUM5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LENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxHQUFRLENBQUEsQ0FBRSxXQUFXLEVBQUUsQ0FBQzs7QUFFbEQsaUJBQU8sTUFBTSxHQUFHLE1BQU0sR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7U0FDakMsQ0FBQyxDQUFDO09BQ0o7O0FBRUQsYUFBTyxNQUFNLENBQUM7S0FDZjs7O1NBOUo0QixlQUFHO0FBQzlCLGFBQU8sQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0tBQ3ZDOzs7U0FFMEIsZUFBRztBQUM1QixhQUFPLE9BQU8sQ0FBQztLQUNoQjs7O1NBRWdCLGVBQUc7QUFDbEIsYUFBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO0tBQ2xEOzs7U0FFa0IsZUFBRztBQUNwQixhQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLDBCQUEwQixDQUFDLENBQUM7S0FDcEQ7OztTQUV5QixlQUFHO0FBQzNCLGFBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsd0NBQXdDLENBQUMsQ0FBQztLQUNsRTs7O1NBakRrQixnQkFBZ0I7OztxQkFBaEIsZ0JBQWdCIiwiZmlsZSI6Ii9ob21lL2RkZXdleS8uYXRvbS9wYWNrYWdlcy9wcm9qZWN0LW1hbmFnZXIvbGliL3ZpZXdzL3Byb2plY3RzLWxpc3Qtdmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG4vKiBlc2xpbnQgXCJjbGFzcy1tZXRob2RzLXVzZS10aGlzXCI6IFtcImVycm9yXCIsIHtcImV4Y2VwdE1ldGhvZHNcIjogW1widmlld0Zvckl0ZW1cIl19XSAqL1xuXG5pbXBvcnQgeyBTZWxlY3RMaXN0VmlldywgJCQgfSBmcm9tICdhdG9tLXNwYWNlLXBlbi12aWV3cyc7XG5pbXBvcnQgeyBhdXRvcnVuIH0gZnJvbSAnbW9ieCc7XG5pbXBvcnQgeyBlYWNoIH0gZnJvbSAndW5kZXJzY29yZS1wbHVzJztcbmltcG9ydCBtYW5hZ2VyLCB7IE1hbmFnZXIgfSBmcm9tICcuLi9NYW5hZ2VyJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUHJvamVjdHNMaXN0VmlldyBleHRlbmRzIFNlbGVjdExpc3RWaWV3IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIGF1dG9ydW4oJ0xvYWRpbmcgcHJvamVjdHMgZm9yIGxpc3QgdmlldycsICgpID0+IHtcbiAgICAgIGlmICh0aGlzLnBhbmVsICYmIHRoaXMucGFuZWwuaXNWaXNpYmxlKCkpIHtcbiAgICAgICAgdGhpcy5zaG93KG1hbmFnZXIucHJvamVjdHMpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIGluaXRpYWxpemUoKSB7XG4gICAgc3VwZXIuaW5pdGlhbGl6ZSgpO1xuICAgIHRoaXMuYWRkQ2xhc3MoJ3Byb2plY3QtbWFuYWdlcicpO1xuXG4gICAgbGV0IGluZm9UZXh0ID0gJ3NoaWZ0K2VudGVyIHdpbGwgb3BlbiBwcm9qZWN0IGluIHRoZSBjdXJyZW50IHdpbmRvdyc7XG4gICAgaWYgKFByb2plY3RzTGlzdFZpZXcucmV2ZXJzZWRDb25maXJtKSB7XG4gICAgICBpbmZvVGV4dCA9ICdzaGlmdCtlbnRlciB3aWxsIG9wZW4gcHJvamVjdCBpbiBhIG5ldyB3aW5kb3cnO1xuICAgIH1cbiAgICBjb25zdCBpbmZvRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGluZm9FbGVtZW50LmNsYXNzTmFtZSA9ICd0ZXh0LXNtYWxsZXInO1xuICAgIGluZm9FbGVtZW50LmlubmVySFRNTCA9IGluZm9UZXh0O1xuICAgIHRoaXMuZXJyb3IuYWZ0ZXIoaW5mb0VsZW1lbnQpO1xuXG4gICAgYXRvbS5jb21tYW5kcy5hZGQodGhpcy5lbGVtZW50LCB7XG4gICAgICAncHJvamVjdC1tYW5hZ2VyOmFsdC1jb25maXJtJzogKGV2ZW50KSA9PiB7XG4gICAgICAgIHRoaXMuYWx0Q29uZmlybWVkKCk7XG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgfSxcbiAgICB9KTtcbiAgfVxuXG4gIHN0YXRpYyBnZXQgcG9zc2libGVGaWx0ZXJLZXlzKCkge1xuICAgIHJldHVybiBbJ3RpdGxlJywgJ2dyb3VwJywgJ3RlbXBsYXRlJ107XG4gIH1cblxuICBzdGF0aWMgZ2V0IGRlZmF1bHRGaWx0ZXJLZXkoKSB7XG4gICAgcmV0dXJuICd0aXRsZSc7XG4gIH1cblxuICBzdGF0aWMgZ2V0IHNvcnRCeSgpIHtcbiAgICByZXR1cm4gYXRvbS5jb25maWcuZ2V0KCdwcm9qZWN0LW1hbmFnZXIuc29ydEJ5Jyk7XG4gIH1cblxuICBzdGF0aWMgZ2V0IHNob3dQYXRoKCkge1xuICAgIHJldHVybiBhdG9tLmNvbmZpZy5nZXQoJ3Byb2plY3QtbWFuYWdlci5zaG93UGF0aCcpO1xuICB9XG5cbiAgc3RhdGljIGdldCByZXZlcnNlZENvbmZpcm0oKSB7XG4gICAgcmV0dXJuIGF0b20uY29uZmlnLmdldCgncHJvamVjdC1tYW5hZ2VyLmFsd2F5c09wZW5JblNhbWVXaW5kb3cnKTtcbiAgfVxuXG4gIGdldEZpbHRlcktleSgpIHtcbiAgICBjb25zdCBpbnB1dCA9IHRoaXMuZmlsdGVyRWRpdG9yVmlldy5nZXRUZXh0KCk7XG4gICAgY29uc3QgaW5wdXRBcnIgPSBpbnB1dC5zcGxpdCgnOicpO1xuICAgIGNvbnN0IGlzRmlsdGVyS2V5ID0gUHJvamVjdHNMaXN0Vmlldy5wb3NzaWJsZUZpbHRlcktleXMuaW5jbHVkZXMoaW5wdXRBcnJbMF0pO1xuICAgIGxldCBmaWx0ZXIgPSBQcm9qZWN0c0xpc3RWaWV3LmRlZmF1bHRGaWx0ZXJLZXk7XG5cbiAgICBpZiAoaW5wdXRBcnIubGVuZ3RoID4gMSAmJiBpc0ZpbHRlcktleSkge1xuICAgICAgZmlsdGVyID0gaW5wdXRBcnJbMF07XG4gICAgfVxuXG4gICAgcmV0dXJuIGZpbHRlcjtcbiAgfVxuXG4gIGdldEZpbHRlclF1ZXJ5KCkge1xuICAgIGNvbnN0IGlucHV0ID0gdGhpcy5maWx0ZXJFZGl0b3JWaWV3LmdldFRleHQoKTtcbiAgICBjb25zdCBpbnB1dEFyciA9IGlucHV0LnNwbGl0KCc6Jyk7XG4gICAgbGV0IGZpbHRlciA9IGlucHV0O1xuXG4gICAgaWYgKGlucHV0QXJyLmxlbmd0aCA+IDEpIHtcbiAgICAgIGZpbHRlciA9IGlucHV0QXJyWzFdO1xuICAgIH1cblxuICAgIHJldHVybiBmaWx0ZXI7XG4gIH1cblxuICBnZXRFbXB0eU1lc3NhZ2UoaXRlbUNvdW50LCBmaWx0ZXJlZEl0ZW1Db3VudCkge1xuICAgIGlmIChpdGVtQ291bnQgPT09IDApIHtcbiAgICAgIHJldHVybiAnTm8gcHJvamVjdHMgc2F2ZWQgeWV0JztcbiAgICB9XG4gICAgcmV0dXJuIHN1cGVyLmdldEVtcHR5TWVzc2FnZShpdGVtQ291bnQsIGZpbHRlcmVkSXRlbUNvdW50KTtcbiAgfVxuXG4gIHRvZ2dsZSgpIHtcbiAgICBpZiAodGhpcy5wYW5lbCAmJiB0aGlzLnBhbmVsLmlzVmlzaWJsZSgpKSB7XG4gICAgICB0aGlzLmNhbmNlbCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNob3cobWFuYWdlci5wcm9qZWN0cyk7XG4gICAgfVxuICB9XG5cbiAgc2hvdyhwcm9qZWN0cykge1xuICAgIGlmICh0aGlzLnBhbmVsID09IG51bGwpIHtcbiAgICAgIHRoaXMucGFuZWwgPSBhdG9tLndvcmtzcGFjZS5hZGRNb2RhbFBhbmVsKHsgaXRlbTogdGhpcyB9KTtcbiAgICB9XG5cbiAgICB0aGlzLnN0b3JlRm9jdXNlZEVsZW1lbnQoKTtcblxuICAgIGNvbnN0IHNvcnRlZFByb2plY3RzID0gUHJvamVjdHNMaXN0Vmlldy5zb3J0SXRlbXMocHJvamVjdHMpO1xuXG4gICAgdGhpcy5zZXRJdGVtcyhzb3J0ZWRQcm9qZWN0cyk7XG4gICAgdGhpcy5mb2N1c0ZpbHRlckVkaXRvcigpO1xuICB9XG5cbiAgY29uZmlybWVkKHByb2plY3QpIHtcbiAgICBpZiAocHJvamVjdCkge1xuICAgICAgTWFuYWdlci5vcGVuKHByb2plY3QsIFByb2plY3RzTGlzdFZpZXcucmV2ZXJzZWRDb25maXJtKTtcbiAgICAgIHRoaXMuaGlkZSgpO1xuICAgIH1cbiAgfVxuXG4gIGFsdENvbmZpcm1lZCgpIHtcbiAgICBjb25zdCBwcm9qZWN0ID0gdGhpcy5nZXRTZWxlY3RlZEl0ZW0oKTtcbiAgICBpZiAocHJvamVjdCkge1xuICAgICAgTWFuYWdlci5vcGVuKHByb2plY3QsICFQcm9qZWN0c0xpc3RWaWV3LnJldmVyc2VkQ29uZmlybSk7XG4gICAgICB0aGlzLmhpZGUoKTtcbiAgICB9XG4gIH1cblxuICBoaWRlKCkge1xuICAgIGlmICh0aGlzLnBhbmVsKSB7XG4gICAgICB0aGlzLnBhbmVsLmhpZGUoKTtcbiAgICB9XG4gIH1cblxuICBjYW5jZWwoKSB7XG4gICAgc3VwZXIuY2FuY2VsKCk7XG4gIH1cblxuICBjYW5jZWxsZWQoKSB7XG4gICAgdGhpcy5oaWRlKCk7XG4gIH1cblxuICB2aWV3Rm9ySXRlbShwcm9qZWN0KSB7XG4gICAgY29uc3QgeyB0aXRsZSwgZ3JvdXAsIGljb24sIGRldk1vZGUsIHBhdGhzIH0gPSBwcm9qZWN0LnByb3BzO1xuICAgIGNvbnN0IHNob3dQYXRoID0gUHJvamVjdHNMaXN0Vmlldy5zaG93UGF0aDtcbiAgICBjb25zdCBwcm9qZWN0TWlzc2luZyA9ICFwcm9qZWN0LnN0YXRzO1xuXG4gICAgcmV0dXJuICQkKGZ1bmN0aW9uIGl0ZW1WaWV3KCkge1xuICAgICAgdGhpcy5saSh7IGNsYXNzOiAndHdvLWxpbmVzJyB9LFxuICAgICAgeyAnZGF0YS1wYXRoLW1pc3NpbmcnOiBwcm9qZWN0TWlzc2luZyB9LCAoKSA9PiB7XG4gICAgICAgIHRoaXMuZGl2KHsgY2xhc3M6ICdwcmltYXJ5LWxpbmUnIH0sICgpID0+IHtcbiAgICAgICAgICBpZiAoZGV2TW9kZSkge1xuICAgICAgICAgICAgdGhpcy5zcGFuKHsgY2xhc3M6ICdwcm9qZWN0LW1hbmFnZXItZGV2bW9kZScgfSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGhpcy5kaXYoeyBjbGFzczogYGljb24gJHtpY29ufWAgfSwgKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5zcGFuKHRpdGxlKTtcbiAgICAgICAgICAgIGlmIChncm91cCkge1xuICAgICAgICAgICAgICB0aGlzLnNwYW4oeyBjbGFzczogJ3Byb2plY3QtbWFuYWdlci1saXN0LWdyb3VwJyB9LCBncm91cCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmRpdih7IGNsYXNzOiAnc2Vjb25kYXJ5LWxpbmUnIH0sICgpID0+IHtcbiAgICAgICAgICBpZiAocHJvamVjdE1pc3NpbmcpIHtcbiAgICAgICAgICAgIHRoaXMuZGl2KHsgY2xhc3M6ICdpY29uIGljb24tYWxlcnQnIH0sICdQYXRoIGlzIG5vdCBhdmFpbGFibGUnKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHNob3dQYXRoKSB7XG4gICAgICAgICAgICBlYWNoKHBhdGhzLCAocGF0aCkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLmRpdih7IGNsYXNzOiAnbm8taWNvbicgfSwgcGF0aCk7XG4gICAgICAgICAgICB9LCB0aGlzKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBzdGF0aWMgc29ydEl0ZW1zKGl0ZW1zKSB7XG4gICAgY29uc3Qga2V5ID0gUHJvamVjdHNMaXN0Vmlldy5zb3J0Qnk7XG4gICAgbGV0IHNvcnRlZCA9IGl0ZW1zO1xuXG4gICAgaWYgKGtleSA9PT0gJ2RlZmF1bHQnKSB7XG4gICAgICByZXR1cm4gaXRlbXM7XG4gICAgfSBlbHNlIGlmIChrZXkgPT09ICdsYXN0IG1vZGlmaWVkJykge1xuICAgICAgc29ydGVkID0gaXRlbXMuc29ydCgoYSwgYikgPT4ge1xuICAgICAgICBjb25zdCBhTW9kaWZpZWQgPSBhLmxhc3RNb2RpZmllZC5nZXRUaW1lKCk7XG4gICAgICAgIGNvbnN0IGJNb2RpZmllZCA9IGIubGFzdE1vZGlmaWVkLmdldFRpbWUoKTtcblxuICAgICAgICByZXR1cm4gYU1vZGlmaWVkID4gYk1vZGlmaWVkID8gLTEgOiAxO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNvcnRlZCA9IGl0ZW1zLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgICAgY29uc3QgYVZhbHVlID0gKGFba2V5XSB8fCAnXFx1ZmZmZicpLnRvVXBwZXJDYXNlKCk7XG4gICAgICAgIGNvbnN0IGJWYWx1ZSA9IChiW2tleV0gfHwgJ1xcdWZmZmYnKS50b1VwcGVyQ2FzZSgpO1xuXG4gICAgICAgIHJldHVybiBhVmFsdWUgPiBiVmFsdWUgPyAxIDogLTE7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gc29ydGVkO1xuICB9XG59XG4iXX0=