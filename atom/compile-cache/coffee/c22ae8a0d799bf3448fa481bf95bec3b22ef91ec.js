(function() {
  var View, VirtualenvView,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  View = require('atom-space-pen-views').View;

  module.exports = VirtualenvView = (function(superClass) {
    extend(VirtualenvView, superClass);

    function VirtualenvView() {
      this.update = bind(this.update, this);
      return VirtualenvView.__super__.constructor.apply(this, arguments);
    }

    VirtualenvView.content = function() {
      return this.a({
        href: '#',
        "class": 'inline-block virtualenv'
      });
    };

    VirtualenvView.prototype.initialize = function(statusBar, manager) {
      this.statusBar = statusBar;
      this.manager = manager;
      this.subscribe(this.statusBar, 'active-buffer-changed', this.update);
      this.subscribe(atom.workspace.eachEditor((function(_this) {
        return function(editor) {
          return _this.subscribe(editor, 'grammar-changed', function() {
            if (editor === atom.workspace.getActiveEditor()) {
              return _this.update();
            }
          });
        };
      })(this)));
      this.subscribe(this, 'click', (function(_this) {
        return function() {
          _this.manager.emit('selector:show');
          return false;
        };
      })(this));
      return this.manager.on('virtualenv:changed', this.update);
    };

    VirtualenvView.prototype.afterAttach = function() {
      return this.update();
    };

    VirtualenvView.prototype.update = function() {
      var grammar, ref;
      grammar = (ref = atom.workspace.getActiveEditor()) != null ? typeof ref.getGrammar === "function" ? ref.getGrammar() : void 0 : void 0;
      if ((grammar != null) && grammar.name === 'Python') {
        return this.text(this.manager.env).show();
      } else {
        return this.hide();
      }
    };

    VirtualenvView.prototype.serialize = function() {};

    VirtualenvView.prototype.destroy = function() {
      return this.detach();
    };

    return VirtualenvView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvZGRld2V5Ly5hdG9tL3BhY2thZ2VzL2F0b20tcHl0aG9uLXZpcnR1YWxlbnYvbGliL3ZpcnR1YWxlbnYtdmlldy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLG9CQUFBO0lBQUE7Ozs7RUFBQyxPQUFRLE9BQUEsQ0FBUSxzQkFBUjs7RUFFVCxNQUFNLENBQUMsT0FBUCxHQUNNOzs7Ozs7OztJQUVKLGNBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQTthQUNSLElBQUMsQ0FBQSxDQUFELENBQUc7UUFBQSxJQUFBLEVBQU0sR0FBTjtRQUFXLENBQUEsS0FBQSxDQUFBLEVBQU8seUJBQWxCO09BQUg7SUFEUTs7NkJBR1YsVUFBQSxHQUFZLFNBQUMsU0FBRCxFQUFhLE9BQWI7TUFBQyxJQUFDLENBQUEsWUFBRDtNQUFZLElBQUMsQ0FBQSxVQUFEO01BQ3ZCLElBQUMsQ0FBQSxTQUFELENBQVcsSUFBQyxDQUFBLFNBQVosRUFBdUIsdUJBQXZCLEVBQWdELElBQUMsQ0FBQSxNQUFqRDtNQUVBLElBQUMsQ0FBQSxTQUFELENBQVcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFmLENBQTBCLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxNQUFEO2lCQUNuQyxLQUFDLENBQUEsU0FBRCxDQUFXLE1BQVgsRUFBbUIsaUJBQW5CLEVBQXNDLFNBQUE7WUFDcEMsSUFBYSxNQUFBLEtBQVUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxlQUFmLENBQUEsQ0FBdkI7cUJBQUEsS0FBQyxDQUFBLE1BQUQsQ0FBQSxFQUFBOztVQURvQyxDQUF0QztRQURtQztNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBMUIsQ0FBWDtNQUlBLElBQUMsQ0FBQSxTQUFELENBQVcsSUFBWCxFQUFpQixPQUFqQixFQUEwQixDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7VUFDeEIsS0FBQyxDQUFBLE9BQU8sQ0FBQyxJQUFULENBQWMsZUFBZDtpQkFDQTtRQUZ3QjtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBMUI7YUFJQSxJQUFDLENBQUEsT0FBTyxDQUFDLEVBQVQsQ0FBWSxvQkFBWixFQUFrQyxJQUFDLENBQUEsTUFBbkM7SUFYVTs7NkJBYVosV0FBQSxHQUFhLFNBQUE7YUFDWCxJQUFDLENBQUEsTUFBRCxDQUFBO0lBRFc7OzZCQUdiLE1BQUEsR0FBUSxTQUFBO0FBQ04sVUFBQTtNQUFBLE9BQUEsZ0dBQTBDLENBQUU7TUFFNUMsSUFBRyxpQkFBQSxJQUFhLE9BQU8sQ0FBQyxJQUFSLEtBQWdCLFFBQWhDO2VBQ0UsSUFBQyxDQUFBLElBQUQsQ0FBTSxJQUFDLENBQUEsT0FBTyxDQUFDLEdBQWYsQ0FBbUIsQ0FBQyxJQUFwQixDQUFBLEVBREY7T0FBQSxNQUFBO2VBR0UsSUFBQyxDQUFBLElBQUQsQ0FBQSxFQUhGOztJQUhNOzs2QkFTUixTQUFBLEdBQVcsU0FBQSxHQUFBOzs2QkFHWCxPQUFBLEdBQVMsU0FBQTthQUNQLElBQUMsQ0FBQSxNQUFELENBQUE7SUFETzs7OztLQWpDa0I7QUFIN0IiLCJzb3VyY2VzQ29udGVudCI6WyJ7Vmlld30gPSByZXF1aXJlICdhdG9tLXNwYWNlLXBlbi12aWV3cydcblxubW9kdWxlLmV4cG9ydHMgPVxuY2xhc3MgVmlydHVhbGVudlZpZXcgZXh0ZW5kcyBWaWV3XG5cbiAgQGNvbnRlbnQ6IC0+XG4gICAgQGEgaHJlZjogJyMnLCBjbGFzczogJ2lubGluZS1ibG9jayB2aXJ0dWFsZW52J1xuXG4gIGluaXRpYWxpemU6IChAc3RhdHVzQmFyLCBAbWFuYWdlcikgLT5cbiAgICBAc3Vic2NyaWJlIEBzdGF0dXNCYXIsICdhY3RpdmUtYnVmZmVyLWNoYW5nZWQnLCBAdXBkYXRlXG5cbiAgICBAc3Vic2NyaWJlIGF0b20ud29ya3NwYWNlLmVhY2hFZGl0b3IgKGVkaXRvcikgPT5cbiAgICAgIEBzdWJzY3JpYmUgZWRpdG9yLCAnZ3JhbW1hci1jaGFuZ2VkJywgPT5cbiAgICAgICAgQHVwZGF0ZSgpIGlmIGVkaXRvciBpcyBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVFZGl0b3IoKVxuXG4gICAgQHN1YnNjcmliZSB0aGlzLCAnY2xpY2snLCA9PlxuICAgICAgQG1hbmFnZXIuZW1pdCgnc2VsZWN0b3I6c2hvdycpXG4gICAgICBmYWxzZVxuXG4gICAgQG1hbmFnZXIub24gJ3ZpcnR1YWxlbnY6Y2hhbmdlZCcsIEB1cGRhdGVcblxuICBhZnRlckF0dGFjaDogLT5cbiAgICBAdXBkYXRlKClcblxuICB1cGRhdGU6ID0+XG4gICAgZ3JhbW1hciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZUVkaXRvcigpPy5nZXRHcmFtbWFyPygpXG5cbiAgICBpZiBncmFtbWFyPyBhbmQgZ3JhbW1hci5uYW1lID09ICdQeXRob24nXG4gICAgICBAdGV4dChAbWFuYWdlci5lbnYpLnNob3coKVxuICAgIGVsc2VcbiAgICAgIEBoaWRlKClcblxuICAjIFJldHVybnMgYW4gb2JqZWN0IHRoYXQgY2FuIGJlIHJldHJpZXZlZCB3aGVuIHBhY2thZ2UgaXMgYWN0aXZhdGVkXG4gIHNlcmlhbGl6ZTogLT5cblxuICAjIFRlYXIgZG93biBhbnkgc3RhdGUgYW5kIGRldGFjaFxuICBkZXN0cm95OiAtPlxuICAgIEBkZXRhY2goKVxuIl19
