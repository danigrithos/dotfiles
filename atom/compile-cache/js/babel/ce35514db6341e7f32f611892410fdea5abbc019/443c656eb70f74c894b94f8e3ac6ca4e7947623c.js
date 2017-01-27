Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

/** @babel */
/** @jsx etch.dom */

var _atom = require('atom');

var _etch = require('etch');

var _etch2 = _interopRequireDefault(_etch);

var _changeCase = require('change-case');

var _changeCase2 = _interopRequireDefault(_changeCase);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _viewUri = require('./view-uri');

var _Manager = require('../Manager');

var _Manager2 = _interopRequireDefault(_Manager);

var _modelsProject = require('../models/Project');

var _modelsProject2 = _interopRequireDefault(_modelsProject);

var disposables = new _atom.CompositeDisposable();

_etch2['default'].setScheduler(atom.views);

var EditView = (function () {
  function EditView(props, children) {
    var _this = this;

    _classCallCheck(this, EditView);

    this.props = props;
    this.children = children;
    _etch2['default'].initialize(this);

    this.storeFocusedElement();

    this.setFocus();

    this.element.addEventListener('click', function (event) {
      if (event.target === _this.refs.save) {
        _this.saveProject();
      }
    });

    disposables.add(atom.commands.add(this.element, {
      'core:save': function coreSave() {
        return _this.saveProject();
      },
      'core:confirm': function coreConfirm() {
        return _this.saveProject();
      }
    }));

    disposables.add(atom.commands.add('atom-workspace', {
      'core:cancel': function coreCancel() {
        return _this.close();
      }
    }));
  }

  _createClass(EditView, [{
    key: 'getFocusElement',
    value: function getFocusElement() {
      return this.refs.title;
    }
  }, {
    key: 'setFocus',
    value: function setFocus() {
      var focusElement = this.getFocusElement();

      if (focusElement) {
        setTimeout(function () {
          focusElement.focus();
        }, 0);
      }
    }
  }, {
    key: 'storeFocusedElement',
    value: function storeFocusedElement() {
      this.previouslyFocusedElement = document.activeElement;
    }
  }, {
    key: 'restoreFocus',
    value: function restoreFocus() {
      if (this.previouslyFocusedElement) {
        this.previouslyFocusedElement.focus();
      }
    }
  }, {
    key: 'close',
    value: function close() {
      this.destroy();
    }
  }, {
    key: 'destroy',
    value: _asyncToGenerator(function* () {
      var pane = atom.workspace.paneForURI(_viewUri.EDIT_URI);
      if (pane) {
        var item = pane.itemForURI(_viewUri.EDIT_URI);
        pane.destroyItem(item);
      }

      disposables.dispose();
      yield _etch2['default'].destroy(this);
    })
  }, {
    key: 'saveProject',
    value: function saveProject() {
      var projectProps = {
        title: this.refs.title.value,
        paths: atom.project.getPaths(),
        group: this.refs.group.value,
        icon: this.refs.icon.value,
        devMode: this.refs.devMode.checked
      };
      var message = projectProps.title + ' has been saved.';

      if (this.props.project) {
        // Paths should already be up-to-date, so use
        // the current paths as to not break possible relative paths.
        projectProps.paths = this.props.project.getProps().paths;
      }

      _Manager2['default'].saveProject(projectProps);

      if (this.props.project) {
        message = this.props.project.title + ' has been updated.';
      }
      atom.notifications.addSuccess(message);

      this.close();
    }
  }, {
    key: 'update',
    value: function update(props, children) {
      this.props = props;
      this.children = children;
    }
  }, {
    key: 'getTitle',
    value: function getTitle() {
      if (this.props.project) {
        return 'Edit ' + this.props.project.title;
      }

      return 'Save Project';
    }
  }, {
    key: 'getIconName',
    value: function getIconName() {
      // eslint-disable-line class-methods-use-this
      return 'gear';
    }
  }, {
    key: 'getURI',
    value: function getURI() {
      // eslint-disable-line class-methods-use-this
      return _viewUri.EDIT_URI;
    }
  }, {
    key: 'render',
    value: function render() {
      var defaultProps = _modelsProject2['default'].defaultProps;
      var rootPath = atom.project.getPaths()[0];
      var props = defaultProps;

      if (atom.config.get('project-manager.prettifyTitle')) {
        props.title = _changeCase2['default'].titleCase(_path2['default'].basename(rootPath));
      }

      if (this.props.project && this.props.project.source === 'file') {
        var projectProps = this.props.project.getProps();
        props = Object.assign({}, props, projectProps);
      }

      var wrapperStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      };

      var style = {
        width: '500px'
      };

      return _etch2['default'].dom(
        'div',
        { style: wrapperStyle, className: 'project-manager-edit padded native-key-bindings' },
        _etch2['default'].dom(
          'div',
          { style: style },
          _etch2['default'].dom(
            'h1',
            { className: 'block section-heading' },
            this.getTitle()
          ),
          _etch2['default'].dom(
            'div',
            { className: 'block' },
            _etch2['default'].dom(
              'label',
              { className: 'input-label' },
              'Title'
            ),
            _etch2['default'].dom('input', { ref: 'title', type: 'text', className: 'input-text', value: props.title, tabIndex: '0' })
          ),
          _etch2['default'].dom(
            'div',
            { className: 'block' },
            _etch2['default'].dom(
              'label',
              { className: 'input-label' },
              'Group'
            ),
            _etch2['default'].dom('input', { ref: 'group', type: 'text', className: 'input-text', value: props.group, tabIndex: '1' })
          ),
          _etch2['default'].dom(
            'div',
            { className: 'block' },
            _etch2['default'].dom(
              'label',
              { className: 'input-label' },
              'Icon'
            ),
            _etch2['default'].dom('input', { ref: 'icon', type: 'text', className: 'input-text', value: props.icon, tabIndex: '2' })
          ),
          _etch2['default'].dom(
            'div',
            { className: 'block' },
            _etch2['default'].dom(
              'label',
              { className: 'input-label', 'for': 'devMode' },
              'Development mode'
            ),
            _etch2['default'].dom('input', {
              ref: 'devMode',
              id: 'devMode',
              name: 'devMode',
              type: 'checkbox',
              className: 'input-toggle',
              checked: props.devMode,
              tabIndex: '3'
            })
          ),
          _etch2['default'].dom(
            'div',
            { className: 'block', style: { textAlign: 'right' } },
            _etch2['default'].dom(
              'button',
              { ref: 'save', className: 'btn btn-primary', tabIndex: '4' },
              'Save'
            )
          )
        )
      );
    }
  }]);

  return EditView;
})();

exports['default'] = EditView;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2RkZXdleS8uYXRvbS9wYWNrYWdlcy9wcm9qZWN0LW1hbmFnZXIvbGliL3ZpZXdzL0VkaXRWaWV3LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztvQkFHb0MsTUFBTTs7b0JBQ3pCLE1BQU07Ozs7MEJBQ0EsYUFBYTs7OztvQkFDbkIsTUFBTTs7Ozt1QkFDRSxZQUFZOzt1QkFDakIsWUFBWTs7Ozs2QkFDWixtQkFBbUI7Ozs7QUFFdkMsSUFBTSxXQUFXLEdBQUcsK0JBQXlCLENBQUM7O0FBRTlDLGtCQUFLLFlBQVksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7O0lBRVQsUUFBUTtBQUNoQixXQURRLFFBQVEsQ0FDZixLQUFLLEVBQUUsUUFBUSxFQUFFOzs7MEJBRFYsUUFBUTs7QUFFekIsUUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7QUFDbkIsUUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7QUFDekIsc0JBQUssVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDOztBQUV0QixRQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQzs7QUFFM0IsUUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDOztBQUVoQixRQUFJLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxVQUFDLEtBQUssRUFBSztBQUNoRCxVQUFJLEtBQUssQ0FBQyxNQUFNLEtBQUssTUFBSyxJQUFJLENBQUMsSUFBSSxFQUFFO0FBQ25DLGNBQUssV0FBVyxFQUFFLENBQUM7T0FDcEI7S0FDRixDQUFDLENBQUM7O0FBRUgsZUFBVyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFO0FBQzlDLGlCQUFXLEVBQUU7ZUFBTSxNQUFLLFdBQVcsRUFBRTtPQUFBO0FBQ3JDLG9CQUFjLEVBQUU7ZUFBTSxNQUFLLFdBQVcsRUFBRTtPQUFBO0tBQ3pDLENBQUMsQ0FBQyxDQUFD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QUUsT0FBTyxFQUFFLEFBQUM7WUFDbkQ7O2dCQUFRLEdBQUcsRUFBQyxNQUFNLEVBQUMsU0FBUyxFQUFDLGlCQUFpQixFQUFDLFFBQVEsRUFBQyxHQUFHOzthQUFjO1dBQ3JFO1NBQ0Y7T0FDRixDQUNOO0tBQ0g7OztTQS9La0IsUUFBUTs7O3FCQUFSLFFBQVEiLCJmaWxlIjoiL2hvbWUvZGRld2V5Ly5hdG9tL3BhY2thZ2VzL3Byb2plY3QtbWFuYWdlci9saWIvdmlld3MvRWRpdFZpZXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiogQGJhYmVsICovXG4vKiogQGpzeCBldGNoLmRvbSAqL1xuXG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlIH0gZnJvbSAnYXRvbSc7XG5pbXBvcnQgZXRjaCBmcm9tICdldGNoJztcbmltcG9ydCBjaGFuZ2VDYXNlIGZyb20gJ2NoYW5nZS1jYXNlJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgRURJVF9VUkkgfSBmcm9tICcuL3ZpZXctdXJpJztcbmltcG9ydCBtYW5hZ2VyIGZyb20gJy4uL01hbmFnZXInO1xuaW1wb3J0IFByb2plY3QgZnJvbSAnLi4vbW9kZWxzL1Byb2plY3QnO1xuXG5jb25zdCBkaXNwb3NhYmxlcyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCk7XG5cbmV0Y2guc2V0U2NoZWR1bGVyKGF0b20udmlld3MpO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFZGl0VmlldyB7XG4gIGNvbnN0cnVjdG9yKHByb3BzLCBjaGlsZHJlbikge1xuICAgIHRoaXMucHJvcHMgPSBwcm9wcztcbiAgICB0aGlzLmNoaWxkcmVuID0gY2hpbGRyZW47XG4gICAgZXRjaC5pbml0aWFsaXplKHRoaXMpO1xuXG4gICAgdGhpcy5zdG9yZUZvY3VzZWRFbGVtZW50KCk7XG5cbiAgICB0aGlzLnNldEZvY3VzKCk7XG5cbiAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZlbnQpID0+IHtcbiAgICAgIGlmIChldmVudC50YXJnZXQgPT09IHRoaXMucmVmcy5zYXZlKSB7XG4gICAgICAgIHRoaXMuc2F2ZVByb2plY3QoKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGRpc3Bvc2FibGVzLmFkZChhdG9tLmNvbW1hbmRzLmFkZCh0aGlzLmVsZW1lbnQsIHtcbiAgICAgICdjb3JlOnNhdmUnOiAoKSA9PiB0aGlzLnNhdmVQcm9qZWN0KCksXG4gICAgICAnY29yZTpjb25maXJtJzogKCkgPT4gdGhpcy5zYXZlUHJvamVjdCgpLFxuICAgIH0pKTtcblxuICAgIGRpc3Bvc2FibGVzLmFkZChhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS13b3Jrc3BhY2UnLCB7XG4gICAgICAnY29yZTpjYW5jZWwnOiAoKSA9PiB0aGlzLmNsb3NlKCksXG4gICAgfSkpO1xuICB9XG5cbiAgZ2V0Rm9jdXNFbGVtZW50KCkge1xuICAgIHJldHVybiB0aGlzLnJlZnMudGl0bGU7XG4gIH1cblxuICBzZXRGb2N1cygpIHtcbiAgICBjb25zdCBmb2N1c0VsZW1lbnQgPSB0aGlzLmdldEZvY3VzRWxlbWVudCgpO1xuXG4gICAgaWYgKGZvY3VzRWxlbWVudCkge1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIGZvY3VzRWxlbWVudC5mb2N1cygpO1xuICAgICAgfSwgMCk7XG4gICAgfVxuICB9XG5cbiAgc3RvcmVGb2N1c2VkRWxlbWVudCgpIHtcbiAgICB0aGlzLnByZXZpb3VzbHlGb2N1c2VkRWxlbWVudCA9IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQ7XG4gIH1cblxuICByZXN0b3JlRm9jdXMoKSB7XG4gICAgaWYgKHRoaXMucHJldmlvdXNseUZvY3VzZWRFbGVtZW50KSB7XG4gICAgICB0aGlzLnByZXZpb3VzbHlGb2N1c2VkRWxlbWVudC5mb2N1cygpO1xuICAgIH1cbiAgfVxuXG4gIGNsb3NlKCkge1xuICAgIHRoaXMuZGVzdHJveSgpO1xuICB9XG5cbiAgYXN5bmMgZGVzdHJveSgpIHtcbiAgICBjb25zdCBwYW5lID0gYXRvbS53b3Jrc3BhY2UucGFuZUZvclVSSShFRElUX1VSSSk7XG4gICAgaWYgKHBhbmUpIHtcbiAgICAgIGNvbnN0IGl0ZW0gPSBwYW5lLml0ZW1Gb3JVUkkoRURJVF9VUkkpO1xuICAgICAgcGFuZS5kZXN0cm95SXRlbShpdGVtKTtcbiAgICB9XG5cbiAgICBkaXNwb3NhYmxlcy5kaXNwb3NlKCk7XG4gICAgYXdhaXQgZXRjaC5kZXN0cm95KHRoaXMpO1xuICB9XG5cbiAgc2F2ZVByb2plY3QoKSB7XG4gICAgY29uc3QgcHJvamVjdFByb3BzID0ge1xuICAgICAgdGl0bGU6IHRoaXMucmVmcy50aXRsZS52YWx1ZSxcbiAgICAgIHBhdGhzOiBhdG9tLnByb2plY3QuZ2V0UGF0aHMoKSxcbiAgICAgIGdyb3VwOiB0aGlzLnJlZnMuZ3JvdXAudmFsdWUsXG4gICAgICBpY29uOiB0aGlzLnJlZnMuaWNvbi52YWx1ZSxcbiAgICAgIGRldk1vZGU6IHRoaXMucmVmcy5kZXZNb2RlLmNoZWNrZWQsXG4gICAgfTtcbiAgICBsZXQgbWVzc2FnZSA9IGAke3Byb2plY3RQcm9wcy50aXRsZX0gaGFzIGJlZW4gc2F2ZWQuYDtcblxuICAgIGlmICh0aGlzLnByb3BzLnByb2plY3QpIHtcbiAgICAgIC8vIFBhdGhzIHNob3VsZCBhbHJlYWR5IGJlIHVwLXRvLWRhdGUsIHNvIHVzZVxuICAgICAgLy8gdGhlIGN1cnJlbnQgcGF0aHMgYXMgdG8gbm90IGJyZWFrIHBvc3NpYmxlIHJlbGF0aXZlIHBhdGhzLlxuICAgICAgcHJvamVjdFByb3BzLnBhdGhzID0gdGhpcy5wcm9wcy5wcm9qZWN0LmdldFByb3BzKCkucGF0aHM7XG4gICAgfVxuXG4gICAgbWFuYWdlci5zYXZlUHJvamVjdChwcm9qZWN0UHJvcHMpO1xuXG4gICAgaWYgKHRoaXMucHJvcHMucHJvamVjdCkge1xuICAgICAgbWVzc2FnZSA9IGAke3RoaXMucHJvcHMucHJvamVjdC50aXRsZX0gaGFzIGJlZW4gdXBkYXRlZC5gO1xuICAgIH1cbiAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkU3VjY2VzcyhtZXNzYWdlKTtcblxuICAgIHRoaXMuY2xvc2UoKTtcbiAgfVxuXG4gIHVwZGF0ZShwcm9wcywgY2hpbGRyZW4pIHtcbiAgICB0aGlzLnByb3BzID0gcHJvcHM7XG4gICAgdGhpcy5jaGlsZHJlbiA9IGNoaWxkcmVuO1xuICB9XG5cbiAgZ2V0VGl0bGUoKSB7XG4gICAgaWYgKHRoaXMucHJvcHMucHJvamVjdCkge1xuICAgICAgcmV0dXJuIGBFZGl0ICR7dGhpcy5wcm9wcy5wcm9qZWN0LnRpdGxlfWA7XG4gICAgfVxuXG4gICAgcmV0dXJuICdTYXZlIFByb2plY3QnO1xuICB9XG5cbiAgZ2V0SWNvbk5hbWUoKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgY2xhc3MtbWV0aG9kcy11c2UtdGhpc1xuICAgIHJldHVybiAnZ2Vhcic7XG4gIH1cblxuICBnZXRVUkkoKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgY2xhc3MtbWV0aG9kcy11c2UtdGhpc1xuICAgIHJldHVybiBFRElUX1VSSTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCBkZWZhdWx0UHJvcHMgPSBQcm9qZWN0LmRlZmF1bHRQcm9wcztcbiAgICBjb25zdCByb290UGF0aCA9IGF0b20ucHJvamVjdC5nZXRQYXRocygpWzBdO1xuICAgIGxldCBwcm9wcyA9IGRlZmF1bHRQcm9wcztcblxuICAgIGlmIChhdG9tLmNvbmZpZy5nZXQoJ3Byb2plY3QtbWFuYWdlci5wcmV0dGlmeVRpdGxlJykpIHtcbiAgICAgIHByb3BzLnRpdGxlID0gY2hhbmdlQ2FzZS50aXRsZUNhc2UocGF0aC5iYXNlbmFtZShyb290UGF0aCkpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnByb3BzLnByb2plY3QgJiYgdGhpcy5wcm9wcy5wcm9qZWN0LnNvdXJjZSA9PT0gJ2ZpbGUnKSB7XG4gICAgICBjb25zdCBwcm9qZWN0UHJvcHMgPSB0aGlzLnByb3BzLnByb2plY3QuZ2V0UHJvcHMoKTtcbiAgICAgIHByb3BzID0gT2JqZWN0LmFzc2lnbih7fSwgcHJvcHMsIHByb2plY3RQcm9wcyk7XG4gICAgfVxuXG4gICAgY29uc3Qgd3JhcHBlclN0eWxlID0ge1xuICAgICAgZGlzcGxheTogJ2ZsZXgnLFxuICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAgICBqdXN0aWZ5Q29udGVudDogJ2NlbnRlcicsXG4gICAgfTtcblxuICAgIGNvbnN0IHN0eWxlID0ge1xuICAgICAgd2lkdGg6ICc1MDBweCcsXG4gICAgfTtcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IHN0eWxlPXt3cmFwcGVyU3R5bGV9IGNsYXNzTmFtZT1cInByb2plY3QtbWFuYWdlci1lZGl0IHBhZGRlZCBuYXRpdmUta2V5LWJpbmRpbmdzXCI+XG4gICAgICAgIDxkaXYgc3R5bGU9e3N0eWxlfT5cbiAgICAgICAgICA8aDEgY2xhc3NOYW1lPVwiYmxvY2sgc2VjdGlvbi1oZWFkaW5nXCI+e3RoaXMuZ2V0VGl0bGUoKX08L2gxPlxuXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJibG9ja1wiPlxuICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cImlucHV0LWxhYmVsXCI+VGl0bGU8L2xhYmVsPlxuICAgICAgICAgICAgPGlucHV0IHJlZj1cInRpdGxlXCIgdHlwZT1cInRleHRcIiBjbGFzc05hbWU9XCJpbnB1dC10ZXh0XCIgdmFsdWU9e3Byb3BzLnRpdGxlfSB0YWJJbmRleD1cIjBcIiAvPlxuICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJibG9ja1wiPlxuICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cImlucHV0LWxhYmVsXCI+R3JvdXA8L2xhYmVsPlxuICAgICAgICAgICAgPGlucHV0IHJlZj1cImdyb3VwXCIgdHlwZT1cInRleHRcIiBjbGFzc05hbWU9XCJpbnB1dC10ZXh0XCIgdmFsdWU9e3Byb3BzLmdyb3VwfSB0YWJJbmRleD1cIjFcIiAvPlxuICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJibG9ja1wiPlxuICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cImlucHV0LWxhYmVsXCI+SWNvbjwvbGFiZWw+XG4gICAgICAgICAgICA8aW5wdXQgcmVmPVwiaWNvblwiIHR5cGU9XCJ0ZXh0XCIgY2xhc3NOYW1lPVwiaW5wdXQtdGV4dFwiIHZhbHVlPXtwcm9wcy5pY29ufSB0YWJJbmRleD1cIjJcIiAvPlxuICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJibG9ja1wiPlxuICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cImlucHV0LWxhYmVsXCIgZm9yPVwiZGV2TW9kZVwiPkRldmVsb3BtZW50IG1vZGU8L2xhYmVsPlxuICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICByZWY9XCJkZXZNb2RlXCJcbiAgICAgICAgICAgICAgICBpZD1cImRldk1vZGVcIlxuICAgICAgICAgICAgICAgIG5hbWU9XCJkZXZNb2RlXCJcbiAgICAgICAgICAgICAgICB0eXBlPVwiY2hlY2tib3hcIlxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImlucHV0LXRvZ2dsZVwiXG4gICAgICAgICAgICAgICAgY2hlY2tlZD17cHJvcHMuZGV2TW9kZX1cbiAgICAgICAgICAgICAgICB0YWJJbmRleD1cIjNcIlxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJibG9ja1wiIHN0eWxlPXt7IHRleHRBbGlnbjogJ3JpZ2h0JyB9fT5cbiAgICAgICAgICAgIDxidXR0b24gcmVmPVwic2F2ZVwiIGNsYXNzTmFtZT1cImJ0biBidG4tcHJpbWFyeVwiIHRhYkluZGV4PVwiNFwiPlNhdmU8L2J1dHRvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG4iXX0=