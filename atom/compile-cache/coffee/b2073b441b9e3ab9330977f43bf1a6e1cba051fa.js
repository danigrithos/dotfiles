(function() {
  var EventEmitter, VirtualenvManager, compare, exec, fs, path,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  EventEmitter = (require('events')).EventEmitter;

  exec = (require('child_process')).exec;

  fs = require('fs');

  path = require('path');

  compare = function(a, b) {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  };

  module.exports = VirtualenvManager = (function(superClass) {
    extend(VirtualenvManager, superClass);

    function VirtualenvManager() {
      var confHome, wrapper;
      this.path = process.env.VIRTUAL_ENV;
      confHome = atom.config.get("virtualenv.workonHome");
      if (confHome !== "autodetect" && fs.existsSync(confHome)) {
        this.home = confHome;
        this.setup();
      } else if (process.env.WORKON_HOME) {
        this.home = process.env.WORKON_HOME;
        this.setup();
      } else {
        wrapper = path.join(process.env.HOME, '.virtualenvs');
        fs.exists(wrapper, (function(_this) {
          return function(exists) {
            _this.home = exists ? wrapper : process.env.PWD;
            return _this.setup();
          };
        })(this));
      }
    }

    VirtualenvManager.prototype.setup = function() {
      var error;
      this.wrapper = Boolean(process.env.WORKON_HOME);
      if (this.path != null) {
        this.env = this.path.replace(this.home + '/', '');
      } else {
        this.env = '<None>';
      }
      try {
        fs.watch(this.home, (function(_this) {
          return function(event, filename) {
            if (event !== "change") {
              return setTimeout(function() {
                return _this.get_options();
              }, 2000);
            }
          };
        })(this));
      } catch (error1) {
        error = error1;
        console.info("Failed to setup file system watch, home = {" + this.home + "}");
        console.error(error);
      }
      return this.get_options();
    };

    VirtualenvManager.prototype.change = function(env) {
      var newPath;
      if (this.path != null) {
        newPath = this.path.replace(this.env, env.name);
        process.env.PATH = process.env.PATH.replace(this.path, newPath);
        this.path = newPath;
      } else {
        this.path = this.home + '/' + env.name;
        process.env.PATH = this.path + '/bin:' + process.env.PATH;
      }
      this.env = env.name;
      return this.emit('virtualenv:changed');
    };

    VirtualenvManager.prototype.deactivate = function() {
      process.env.PATH = process.env.PATH.replace(this.path + '/bin:', '');
      console.log(process.env.PATH);
      this.path = null;
      this.env = '<None>';
      return this.emit('virtualenv:changed');
    };

    VirtualenvManager.prototype.get_options = function() {
      var cmd;
      cmd = 'find . -maxdepth 3 -name activate';
      this.options = [];
      return exec(cmd, {
        'cwd': this.home
      }, (function(_this) {
        return function(error, stdout, stderr) {
          var i, len, opt, ref;
          ref = (function() {
            var j, len, ref, results;
            ref = stdout.split('\n');
            results = [];
            for (j = 0, len = ref.length; j < len; j++) {
              path = ref[j];
              results.push(path.trim().split('/')[1]);
            }
            return results;
          })();
          for (i = 0, len = ref.length; i < len; i++) {
            opt = ref[i];
            if (opt) {
              _this.options.push({
                'name': opt
              });
            }
          }
          _this.options.sort(compare);
          if (_this.wrapper || _this.options.length > 1) {
            _this.emit('options', _this.options);
          }
          if (_this.options.length === 1 && !_this.wrapper) {
            return _this.change(_this.options[0]);
          }
        };
      })(this));
    };

    VirtualenvManager.prototype.ignore = function(path) {
      var cmd;
      if (this.wrapper) {
        return;
      }
      cmd = "echo " + path + " >> .gitignore";
      return exec(cmd, {
        'cwd': this.home
      }, function(error, stdout, stderr) {
        if (error != null) {
          return console.warn("Error adding " + path + " to ignore list");
        }
      });
    };

    VirtualenvManager.prototype.make = function(path) {
      var cmd;
      cmd = 'virtualenv ' + path;
      return exec(cmd, {
        'cwd': this.home
      }, (function(_this) {
        return function(error, stdout, stderr) {
          var option;
          if (error != null) {
            console.log('error applying virtual env');
            return _this.emit('error', error, stderr);
          } else {
            console.log('success!');
            option = {
              name: path
            };
            _this.options.push(option);
            _this.options.sort(compare);
            _this.emit('options', _this.options);
            _this.change(option);
            return _this.ignore(path);
          }
        };
      })(this));
    };

    return VirtualenvManager;

  })(EventEmitter);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvZGRld2V5Ly5hdG9tL3BhY2thZ2VzL2F0b20tcHl0aG9uLXZpcnR1YWxlbnYvbGliL3ZpcnR1YWxlbnYtbWFuYWdlci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLHdEQUFBO0lBQUE7OztFQUFBLFlBQUEsR0FBZSxDQUFDLE9BQUEsQ0FBUSxRQUFSLENBQUQsQ0FBa0IsQ0FBQzs7RUFDbEMsSUFBQSxHQUFPLENBQUMsT0FBQSxDQUFRLGVBQVIsQ0FBRCxDQUF5QixDQUFDOztFQUNqQyxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVI7O0VBQ0wsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUVQLE9BQUEsR0FBVSxTQUFDLENBQUQsRUFBRyxDQUFIO0lBQ1IsSUFBRyxDQUFDLENBQUMsSUFBRixHQUFTLENBQUMsQ0FBQyxJQUFkO0FBQ0UsYUFBTyxDQUFDLEVBRFY7O0lBRUEsSUFBRyxDQUFDLENBQUMsSUFBRixHQUFTLENBQUMsQ0FBQyxJQUFkO0FBQ0UsYUFBTyxFQURUOztBQUVBLFdBQU87RUFMQzs7RUFPVixNQUFNLENBQUMsT0FBUCxHQUNROzs7SUFFUywyQkFBQTtBQUNYLFVBQUE7TUFBQSxJQUFDLENBQUEsSUFBRCxHQUFRLE9BQU8sQ0FBQyxHQUFHLENBQUM7TUFDcEIsUUFBQSxHQUFXLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix1QkFBaEI7TUFDWCxJQUFHLFFBQUEsS0FBWSxZQUFaLElBQTZCLEVBQUUsQ0FBQyxVQUFILENBQWMsUUFBZCxDQUFoQztRQUNFLElBQUMsQ0FBQSxJQUFELEdBQVE7UUFDUixJQUFDLENBQUEsS0FBRCxDQUFBLEVBRkY7T0FBQSxNQUdLLElBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFmO1FBQ0gsSUFBQyxDQUFBLElBQUQsR0FBUSxPQUFPLENBQUMsR0FBRyxDQUFDO1FBQ3BCLElBQUMsQ0FBQSxLQUFE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LFNBQUMsSUFBRDtBQUNKLFVBQUE7TUFBQSxHQUFBLEdBQU0sYUFBQSxHQUFnQjthQUN0QixJQUFBLENBQUssR0FBTCxFQUFVO1FBQUMsS0FBQSxFQUFRLElBQUMsQ0FBQSxJQUFWO09BQVYsRUFBMkIsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLEtBQUQsRUFBUSxNQUFSLEVBQWdCLE1BQWhCO0FBQ3pCLGNBQUE7VUFBQSxJQUFHLGFBQUg7WUFDRSxPQUFPLENBQUMsR0FBUixDQUFZLDRCQUFaO21CQUNBLEtBQUMsQ0FBQSxJQUFELENBQU0sT0FBTixFQUFlLEtBQWYsRUFBc0IsTUFBdEIsRUFGRjtXQUFBLE1BQUE7WUFJRSxPQUFPLENBQUMsR0FBUixDQUFZLFVBQVo7WUFDQSxNQUFBLEdBQVM7Y0FBQyxJQUFBLEVBQU0sSUFBUDs7WUFDVCxLQUFDLENBQUEsT0FBTyxDQUFDLElBQVQsQ0FBYyxNQUFkO1lBQ0EsS0FBQyxDQUFBLE9BQU8sQ0FBQyxJQUFULENBQWMsT0FBZDtZQUNBLEtBQUMsQ0FBQSxJQUFELENBQU0sU0FBTixFQUFpQixLQUFDLENBQUEsT0FBbEI7WUFDQSxLQUFDLENBQUEsTUFBRCxDQUFRLE1BQVI7bUJBQ0EsS0FBQyxDQUFBLE1BQUQsQ0FBUSxJQUFSLEVBVkY7O1FBRHlCO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUEzQjtJQUZJOzs7O0tBaEZ3QjtBQWJsQyIsInNvdXJjZXNDb250ZW50IjpbIkV2ZW50RW1pdHRlciA9IChyZXF1aXJlICdldmVudHMnKS5FdmVudEVtaXR0ZXJcbmV4ZWMgPSAocmVxdWlyZSAnY2hpbGRfcHJvY2VzcycpLmV4ZWNcbmZzID0gcmVxdWlyZSAnZnMnXG5wYXRoID0gcmVxdWlyZSAncGF0aCdcblxuY29tcGFyZSA9IChhLGIpIC0+XG4gIGlmIGEubmFtZSA8IGIubmFtZVxuICAgIHJldHVybiAtMVxuICBpZiBhLm5hbWUgPiBiLm5hbWVcbiAgICByZXR1cm4gMVxuICByZXR1cm4gMFxuXG5tb2R1bGUuZXhwb3J0cyA9XG4gIGNsYXNzIFZpcnR1YWxlbnZNYW5hZ2VyIGV4dGVuZHMgRXZlbnRFbWl0dGVyXG5cbiAgICBjb25zdHJ1Y3RvcjogKCkgLT5cbiAgICAgIEBwYXRoID0gcHJvY2Vzcy5lbnYuVklSVFVBTF9FTlZcbiAgICAgIGNvbmZIb21lID0gYXRvbS5jb25maWcuZ2V0IFwidmlydHVhbGVudi53b3Jrb25Ib21lXCJcbiAgICAgIGlmIGNvbmZIb21lICE9IFwiYXV0b2RldGVjdFwiIGFuZCBmcy5leGlzdHNTeW5jKGNvbmZIb21lKVxuICAgICAgICBAaG9tZSA9IGNvbmZIb21lXG4gICAgICAgIEBzZXR1cCgpXG4gICAgICBlbHNlIGlmIHByb2Nlc3MuZW52LldPUktPTl9IT01FXG4gICAgICAgIEBob21lID0gcHJvY2Vzcy5lbnYuV09SS09OX0hPTUVcbiAgICAgICAgQHNldHVwKClcbiAgICAgIGVsc2VcbiAgICAgICAgd3JhcHBlciA9IHBhdGguam9pbihwcm9jZXNzLmVudi5IT01FLCAnLnZpcnR1YWxlbnZzJylcbiAgICAgICAgZnMuZXhpc3RzIHdyYXBwZXIsIChleGlzdHMpID0+XG4gICAgICAgICAgQGhvbWUgPSBpZiBleGlzdHMgdGhlbiB3cmFwcGVyIGVsc2UgcHJvY2Vzcy5lbnYuUFdEXG4gICAgICAgICAgQHNldHVwKClcblxuICAgIHNldHVwOiAoKSAtPlxuICAgICAgQHdyYXBwZXIgPSBCb29sZWFuKHByb2Nlc3MuZW52LldPUktPTl9IT01FKVxuXG4gICAgICBpZiBAcGF0aD9cbiAgICAgICAgQGVudiA9IEBwYXRoLnJlcGxhY2UoQGhvbWUgKyAnLycsICcnKVxuICAgICAgZWxzZVxuICAgICAgICBAZW52ID0gJzxOb25lPidcblxuICAgICAgdHJ5XG4gICAgICAgIGZzLndhdGNoIEBob21lLCAoZXZlbnQsIGZpbGVuYW1lKSA9PlxuICAgICAgICAgIGlmIGV2ZW50ICE9IFwiY2hhbmdlXCJcbiAgICAgICAgICAgIHNldFRpbWVvdXQgPT5cbiAgICAgICAgICAgICAgQGdldF9vcHRpb25zKClcbiAgICAgICAgICAgICwgMjAwMFxuICAgICAgY2F0Y2ggZXJyb3JcbiAgICAgICAgY29uc29sZS5pbmZvKFwiRmFpbGVkIHRvIHNldHVwIGZpbGUgc3lzdGVtIHdhdGNoLCBob21lID0geyN7QGhvbWV9fVwiKVxuICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKVxuXG4gICAgICBAZ2V0X29wdGlvbnMoKVxuXG4gICAgY2hhbmdlOiAoZW52KSAtPlxuICAgICAgaWYgQHBhdGg/XG4gICAgICAgIG5ld1BhdGggPSBAcGF0aC5yZXBsYWNlKEBlbnYsIGVudi5uYW1lKVxuICAgICAgICBwcm9jZXNzLmVudi5QQVRIID0gcHJvY2Vzcy5lbnYuUEFUSC5yZXBsYWNlKEBwYXRoLCBuZXdQYXRoKVxuICAgICAgICBAcGF0aCA9IG5ld1BhdGhcbiAgICAgIGVsc2VcbiAgICAgICAgQHBhdGggPSBAaG9tZSArICcvJyArIGVudi5uYW1lXG4gICAgICAgIHByb2Nlc3MuZW52LlBBVEggPSBAcGF0aCArICcvYmluOicgKyBwcm9jZXNzLmVudi5QQVRIXG5cbiAgICAgIEBlbnYgPSBlbnYubmFtZVxuXG4gICAgICBAZW1pdCgndmlydHVhbGVudjpjaGFuZ2VkJylcblxuICAgIGRlYWN0aXZhdGU6ICgpIC0+XG4gICAgICBwcm9jZXNzLmVudi5QQVRIID0gcHJvY2Vzcy5lbnYuUEFUSC5yZXBsYWNlKEBwYXRoICsgJy9iaW46JywgJycpXG5cbiAgICAgIGNvbnNvbGUubG9nIHByb2Nlc3MuZW52LlBBVEhcblxuICAgICAgQHBhdGggPSBudWxsXG4gICAgICBAZW52ID0gJzxOb25lPidcbiAgICAgIEBlbWl0KCd2aXJ0dWFsZW52OmNoYW5nZWQnKVxuXG4gICAgZ2V0X29wdGlvbnM6ICgpIC0+XG4gICAgICBjbWQgPSAnZmluZCAuIC1tYXhkZXB0aCAzIC1uYW1lIGFjdGl2YXRlJ1xuICAgICAgQG9wdGlvbnMgPSBbXVxuICAgICAgZXhlYyBjbWQsIHsnY3dkJyA6IEBob21lfSwgKGVycm9yLCBzdGRvdXQsIHN0ZGVycikgPT5cbiAgICAgICAgZm9yIG9wdCBpbiAocGF0aC50cmltKCkuc3BsaXQoJy8nKVsxXSBmb3IgcGF0aCBpbiBzdGRvdXQuc3BsaXQoJ1xcbicpKVxuICAgICAgICAgIGlmIG9wdFxuICAgICAgICAgICAgQG9wdGlvbnMucHVzaCh7J25hbWUnOiBvcHR9KVxuICAgICAgICBAb3B0aW9ucy5zb3J0KGNvbXBhcmUpXG4gICAgICAgIGlmIEB3cmFwcGVyIG9yIEBvcHRpb25zLmxlbmd0aCA+IDFcbiAgICAgICAgICBAZW1pdCgnb3B0aW9ucycsIEBvcHRpb25zKVxuICAgICAgICBpZiBAb3B0aW9ucy5sZW5ndGggPT0gMSBhbmQgbm90IEB3cmFwcGVyXG4gICAgICAgICAgQGNoYW5nZShAb3B0aW9uc1swXSlcblxuICAgIGlnbm9yZTogKHBhdGgpIC0+XG4gICAgICBpZiBAd3JhcHBlclxuICAgICAgICByZXR1cm5cbiAgICAgIGNtZCA9IFwiZWNobyAje3BhdGh9ID4+IC5naXRpZ25vcmVcIlxuICAgICAgZXhlYyBjbWQsIHsnY3dkJyA6IEBob21lfSwgKGVycm9yLCBzdGRvdXQsIHN0ZGVycikgLT5cbiAgICAgICAgaWYgZXJyb3I/XG4gICAgICAgICAgY29uc29sZS53YXJuKFwiRXJyb3IgYWRkaW5nICN7cGF0aH0gdG8gaWdub3JlIGxpc3RcIilcblxuICAgIG1ha2U6IChwYXRoKSAtPlxuICAgICAgY21kID0gJ3ZpcnR1YWxlbnYgJyArIHBhdGhcbiAgICAgIGV4ZWMgY21kLCB7J2N3ZCcgOiBAaG9tZX0sIChlcnJvciwgc3Rkb3V0LCBzdGRlcnIpID0+XG4gICAgICAgIGlmIGVycm9yP1xuICAgICAgICAgIGNvbnNvbGUubG9nICdlcnJvciBhcHBseWluZyB2aXJ0dWFsIGVudidcbiAgICAgICAgICBAZW1pdCgnZXJyb3InLCBlcnJvciwgc3RkZXJyKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgY29uc29sZS5sb2cgJ3N1Y2Nlc3MhJ1xuICAgICAgICAgIG9wdGlvbiA9IHtuYW1lOiBwYXRofVxuICAgICAgICAgIEBvcHRpb25zLnB1c2gob3B0aW9uKVxuICAgICAgICAgIEBvcHRpb25zLnNvcnQoY29tcGFyZSlcbiAgICAgICAgICBAZW1pdCgnb3B0aW9ucycsIEBvcHRpb25zKVxuICAgICAgICAgIEBjaGFuZ2Uob3B0aW9uKVxuICAgICAgICAgIEBpZ25vcmUocGF0aClcbiJdfQ==
