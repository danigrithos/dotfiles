(function() {
  var $, MakeDialog, TextEditorView, View, exec, path, ref,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  ref = require('atom-space-pen-views'), $ = ref.$, TextEditorView = ref.TextEditorView, View = ref.View;

  path = require('path');

  exec = (require('child_process')).exec;

  module.exports = MakeDialog = (function(superClass) {
    extend(MakeDialog, superClass);

    function MakeDialog() {
      return MakeDialog.__super__.constructor.apply(this, arguments);
    }

    MakeDialog.content = function() {
      return this.div({
        "class": 'tree-view-dialog overlay from-top'
      }, (function(_this) {
        return function() {
          _this.label('Virtualenv name', {
            outlet: 'promptText'
          });
          _this.subview('miniEditor', new TextEditorView({
            mini: true
          }));
          return _this.div({
            "class": 'error-message',
            outlet: 'errorMessage'
          });
        };
      })(this));
    };

    MakeDialog.prototype.initialize = function(manager) {
      var panel;
      console.log(manager);
      this.panel = atom.workspace.addModalPanel({
        item: this
      });
      panel = this.panel;
      panel.hide();
      atom.commands.add('atom-workspace', {
        'core:confirm': function() {
          path = panel.item.miniEditor.getText();
          manager.make(path);
          return panel.hide();
        }
      });
      return atom.commands.add('atom-workspace', {
        'core:cancel': function() {
          return panel.hide();
        }
      });
    };

    MakeDialog.prototype.attach = function() {
      return this.panel.show();
    };

    MakeDialog.prototype.showError = function(message) {
      if (message == null) {
        message = '';
      }
      this.errorMessage.text(message);
      if (message) {
        return this.flashError();
      }
    };

    return MakeDialog;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvZGRld2V5Ly5hdG9tL3BhY2thZ2VzL2F0b20tcHl0aG9uLXZpcnR1YWxlbnYvbGliL3ZpcnR1YWxlbnYtZGlhbG9nLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsb0RBQUE7SUFBQTs7O0VBQUEsTUFBNEIsT0FBQSxDQUFRLHNCQUFSLENBQTVCLEVBQUMsU0FBRCxFQUFJLG1DQUFKLEVBQW9COztFQUNwQixJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBQ1AsSUFBQSxHQUFPLENBQUMsT0FBQSxDQUFRLGVBQVIsQ0FBRCxDQUF5QixDQUFDOztFQUVqQyxNQUFNLENBQUMsT0FBUCxHQUNNOzs7Ozs7O0lBQ0osVUFBQyxDQUFBLE9BQUQsR0FBVSxTQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztRQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sbUNBQVA7T0FBTCxFQUFpRCxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7VUFDL0MsS0FBQyxDQUFBLEtBQUQsQ0FBTyxpQkFBUCxFQUEwQjtZQUFBLE1BQUEsRUFBUSxZQUFSO1dBQTFCO1VBQ0EsS0FBQyxDQUFBLE9BQUQsQ0FBUyxZQUFULEVBQTJCLElBQUEsY0FBQSxDQUFlO1lBQUEsSUFBQSxFQUFNLElBQU47V0FBZixDQUEzQjtpQkFDQSxLQUFDLENBQUEsR0FBRCxDQUFLO1lBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyxlQUFQO1lBQXdCLE1BQUEsRUFBUSxjQUFoQztXQUFMO1FBSCtDO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFqRDtJQURROzt5QkFNVixVQUFBLEdBQVksU0FBQyxPQUFEO0FBQ1YsVUFBQTtNQUFBLE9BQU8sQ0FBQyxHQUFSLENBQVksT0FBWjtNQUVBLElBQUMsQ0FBQSxLQUFELEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFmLENBQTZCO1FBQUEsSUFBQSxFQUFNLElBQU47T0FBN0I7TUFFVCxLQUFBLEdBQVEsSUFBQyxDQUFBO01BQ1QsS0FBSyxDQUFDLElBQU4sQ0FBQTtNQUVBLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBb0M7UUFBQSxjQUFBLEVBQWdCLFNBQUE7VUFDbEQsSUFBQSxHQUFPLEtBQUssQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQXRCLENBQUE7VUFDUCxPQUFPLENBQUMsSUFBUixDQUFhLElBQWI7aUJBQ0EsS0FBSyxDQUFDLElBQU4sQ0FBQTtRQUhrRCxDQUFoQjtPQUFwQzthQUtBLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBb0M7UUFBQSxhQUFBLEVBQWUsU0FBQTtpQkFDakQsS0FBSyxDQUFDLElBQU4sQ0FBQTtRQURpRCxDQUFmO09BQXBDO0lBYlU7O3lCQWdCWixNQUFBLEdBQVEsU0FBQTthQUNOLElBQUMsQ0FBQSxLQUFLLENBQUMsSUFBUCxDQUFBO0lBRE07O3lCQUdSLFNBQUEsR0FBVyxTQUFDLE9BQUQ7O1FBQUMsVUFBUTs7TUFDbEIsSUFBQyxDQUFBLFlBQVksQ0FBQyxJQUFkLENBQW1CLE9BQW5CO01BQ0EsSUFBaUIsT0FBakI7ZUFBQSxJQUFDLENBQUEsVUFBRCxDQUFBLEVBQUE7O0lBRlM7Ozs7S0ExQlk7QUFMekIiLCJzb3VyY2VzQ29udGVudCI6WyJ7JCwgVGV4dEVkaXRvclZpZXcsIFZpZXd9ID0gcmVxdWlyZSAnYXRvbS1zcGFjZS1wZW4tdmlld3MnXG5wYXRoID0gcmVxdWlyZSAncGF0aCdcbmV4ZWMgPSAocmVxdWlyZSAnY2hpbGRfcHJvY2VzcycpLmV4ZWNcblxubW9kdWxlLmV4cG9ydHMgPVxuY2xhc3MgTWFrZURpYWxvZyBleHRlbmRzIFZpZXdcbiAgQGNvbnRlbnQ6IC0+XG4gICAgQGRpdiBjbGFzczogJ3RyZWUtdmlldy1kaWFsb2cgb3ZlcmxheSBmcm9tLXRvcCcsID0+XG4gICAgICBAbGFiZWwgJ1ZpcnR1YWxlbnYgbmFtZScsIG91dGxldDogJ3Byb21wdFRleHQnXG4gICAgICBAc3VidmlldyAnbWluaUVkaXRvcicsIG5ldyBUZXh0RWRpdG9yVmlldyhtaW5pOiB0cnVlKVxuICAgICAgQGRpdiBjbGFzczogJ2Vycm9yLW1lc3NhZ2UnLCBvdXRsZXQ6ICdlcnJvck1lc3NhZ2UnXG5cbiAgaW5pdGlhbGl6ZTogKG1hbmFnZXIpIC0+XG4gICAgY29uc29sZS5sb2cobWFuYWdlcilcblxuICAgIEBwYW5lbCA9IGF0b20ud29ya3NwYWNlLmFkZE1vZGFsUGFuZWwoaXRlbTogdGhpcylcblxuICAgIHBhbmVsID0gQHBhbmVsXG4gICAgcGFuZWwuaGlkZSgpXG5cbiAgICBhdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS13b3Jrc3BhY2UnLCAnY29yZTpjb25maXJtJzogLT5cbiAgICAgIHBhdGggPSBwYW5lbC5pdGVtLm1pbmlFZGl0b3IuZ2V0VGV4dCgpXG4gICAgICBtYW5hZ2VyLm1ha2UocGF0aClcbiAgICAgIHBhbmVsLmhpZGUoKVxuXG4gICAgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20td29ya3NwYWNlJywgJ2NvcmU6Y2FuY2VsJzogLT5cbiAgICAgIHBhbmVsLmhpZGUoKVxuXG4gIGF0dGFjaDogLT5cbiAgICBAcGFuZWwuc2hvdygpXG5cbiAgc2hvd0Vycm9yOiAobWVzc2FnZT0nJykgLT5cbiAgICBAZXJyb3JNZXNzYWdlLnRleHQobWVzc2FnZSlcbiAgICBAZmxhc2hFcnJvcigpIGlmIG1lc3NhZ2VcbiJdfQ==
