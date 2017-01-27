(function() {
  var MakeDialog, VirtualenvListView, VirtualenvManger, VirtualenvView;

  VirtualenvView = require('./virtualenv-view');

  VirtualenvListView = require('./virtualenv-list-view');

  VirtualenvManger = require('./virtualenv-manager');

  MakeDialog = require('./virtualenv-dialog');

  module.exports = {
    manager: new VirtualenvManger(),
    configDefaults: {
      workonHome: 'autodetect'
    },
    activate: function(state) {
      var manager;
      if (process.platform === 'win32') {
        atom.notifications.addWarning('The **atom-python-virtual** plug-in does not work in Windows. It only works in UNIX systems');
        return;
      }
      manager = this.manager;
      atom.commands.add('atom-workspace', {
        'virtualenv:make': function() {
          return (new MakeDialog(manager)).attach();
        }
      });
      atom.commands.add('atom-workspace', {
        'virtualenv:select': function() {
          return manager.emit('selector:show');
        }
      });
      atom.commands.add('atom-workspace', {
        'virtualenv:deactivate': function() {
          return manager.deactivate();
        }
      });
      return this.manager.on('selector:show', (function(_this) {
        return function() {
          var view;
          console.log('selector was show');
          view = new VirtualenvListView(_this.manager);
          return view.attach();
        };
      })(this));
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvZGRld2V5Ly5hdG9tL3BhY2thZ2VzL2F0b20tcHl0aG9uLXZpcnR1YWxlbnYvbGliL2luaXQuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxjQUFBLEdBQWlCLE9BQUEsQ0FBUSxtQkFBUjs7RUFDakIsa0JBQUEsR0FBcUIsT0FBQSxDQUFRLHdCQUFSOztFQUNyQixnQkFBQSxHQUFtQixPQUFBLENBQVEsc0JBQVI7O0VBQ25CLFVBQUEsR0FBYSxPQUFBLENBQVEscUJBQVI7O0VBRWIsTUFBTSxDQUFDLE9BQVAsR0FDRTtJQUFBLE9BQUEsRUFBYSxJQUFBLGdCQUFBLENBQUEsQ0FBYjtJQUVBLGNBQUEsRUFDRTtNQUFBLFVBQUEsRUFBWSxZQUFaO0tBSEY7SUFLQSxRQUFBLEVBQVUsU0FBQyxLQUFEO0FBRVIsVUFBQTtNQUFBLElBQUcsT0FBTyxDQUFDLFFBQVIsS0FBb0IsT0FBdkI7UUFDRSxJQUFJLENBQUMsYUFBYSxDQUFDLFVBQW5CLENBQThCLDZGQUE5QjtBQUNBLGVBRkY7O01BSUEsT0FBQSxHQUFVLElBQUMsQ0FBQTtNQUNYLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBb0M7UUFBQSxpQkFBQSxFQUFtQixTQUFBO2lCQUNyRCxDQUFLLElBQUEsVUFBQSxDQUFXLE9BQVgsQ0FBTCxDQUF5QixDQUFDLE1BQTFCLENBQUE7UUFEcUQsQ0FBbkI7T0FBcEM7TUFHQSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQW9DO1FBQUEsbUJBQUEsRUFBcUIsU0FBQTtpQkFDdkQsT0FBTyxDQUFDLElBQVIsQ0FBYSxlQUFiO1FBRHVELENBQXJCO09BQXBDO01BR0EsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGdCQUFsQixFQUFvQztRQUFBLHVCQUFBLEVBQXlCLFNBQUE7aUJBQzNELE9BQU8sQ0FBQyxVQUFSLENBQUE7UUFEMkQsQ0FBekI7T0FBcEM7YUFHQSxJQUFDLENBQUEsT0FBTyxDQUFDLEVBQVQsQ0FBWSxlQUFaLEVBQTZCLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtBQUMzQixjQUFBO1VBQUEsT0FBTyxDQUFDLEdBQVIsQ0FBWSxtQkFBWjtVQUNBLElBQUEsR0FBVyxJQUFBLGtCQUFBLENBQW1CLEtBQUMsQ0FBQSxPQUFwQjtpQkFDWCxJQUFJLENBQUMsTUFBTCxDQUFBO1FBSDJCO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUE3QjtJQWhCUSxDQUxWOztBQU5GIiwic291cmNlc0NvbnRlbnQiOlsiVmlydHVhbGVudlZpZXcgPSByZXF1aXJlICcuL3ZpcnR1YWxlbnYtdmlldydcblZpcnR1YWxlbnZMaXN0VmlldyA9IHJlcXVpcmUgJy4vdmlydHVhbGVudi1saXN0LXZpZXcnXG5WaXJ0dWFsZW52TWFuZ2VyID0gcmVxdWlyZSAnLi92aXJ0dWFsZW52LW1hbmFnZXInXG5NYWtlRGlhbG9nID0gcmVxdWlyZSAnLi92aXJ0dWFsZW52LWRpYWxvZydcblxubW9kdWxlLmV4cG9ydHMgPVxuICBtYW5hZ2VyOiBuZXcgVmlydHVhbGVudk1hbmdlcigpXG5cbiAgY29uZmlnRGVmYXVsdHM6XG4gICAgd29ya29uSG9tZTogJ2F1dG9kZXRlY3QnXG5cbiAgYWN0aXZhdGU6IChzdGF0ZSkgLT5cblxuICAgIGlmIHByb2Nlc3MucGxhdGZvcm0gPT0gJ3dpbjMyJ1xuICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZFdhcm5pbmcoJ1RoZSAqKmF0b20tcHl0aG9uLXZpcnR1YWwqKiBwbHVnLWluIGRvZXMgbm90IHdvcmsgaW4gV2luZG93cy4gSXQgb25seSB3b3JrcyBpbiBVTklYIHN5c3RlbXMnKVxuICAgICAgcmV0dXJuXG4gICAgICBcbiAgICBtYW5hZ2VyID0gQG1hbmFnZXJcbiAgICBhdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS13b3Jrc3BhY2UnLCAndmlydHVhbGVudjptYWtlJzogLT5cbiAgICAgIChuZXcgTWFrZURpYWxvZyhtYW5hZ2VyKSkuYXR0YWNoKClcblxuICAgIGF0b20uY29tbWFuZHMuYWRkICdhdG9tLXdvcmtzcGFjZScsICd2aXJ0dWFsZW52OnNlbGVjdCc6IC0+XG4gICAgICBtYW5hZ2VyLmVtaXQoJ3NlbGVjdG9yOnNob3cnKVxuXG4gICAgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20td29ya3NwYWNlJywgJ3ZpcnR1YWxlbnY6ZGVhY3RpdmF0ZSc6IC0+XG4gICAgICBtYW5hZ2VyLmRlYWN0aXZhdGUoKVxuXG4gICAgQG1hbmFnZXIub24gJ3NlbGVjdG9yOnNob3cnLCA9PlxuICAgICAgY29uc29sZS5sb2cgJ3NlbGVjdG9yIHdhcyBzaG93J1xuICAgICAgdmlldyA9IG5ldyBWaXJ0dWFsZW52TGlzdFZpZXcoQG1hbmFnZXIpXG4gICAgICB2aWV3LmF0dGFjaCgpXG4iXX0=
