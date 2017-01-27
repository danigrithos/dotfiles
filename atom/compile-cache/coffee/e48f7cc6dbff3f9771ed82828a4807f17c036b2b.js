(function() {
  var RestClientView, createRestClientView, deserializer, restClientUri;

  RestClientView = null;

  restClientUri = 'atom://rest-client';

  createRestClientView = function(state) {
    if (RestClientView == null) {
      RestClientView = require('./rest-client-view');
    }
    return new RestClientView(state);
  };

  deserializer = {
    name: 'RestClientView',
    deserialize: function(state) {
      return createRestClientView(state);
    }
  };

  atom.deserializers.add(deserializer);

  module.exports = {
    config: {
      request_collections_path: {
        title: 'Request Collections path',
        description: 'Path for the file storing request collections',
        type: 'string',
        "default": (atom.packages.resolvePackagePath('rest-client')) + "/collections.json"
      },
      recent_requests_path: {
        title: 'Recent requests path',
        description: 'Path for the file storing recent requests',
        type: 'string',
        "default": (atom.packages.resolvePackagePath('rest-client')) + "/recent.json"
      },
      recent_requests_limit: {
        title: 'Recent Requests limit',
        description: 'number of recent requests to save',
        type: 'integer',
        "default": 5
      },
      split: {
        title: 'Split setting',
        description: 'Open in "left" or "right" pane',
        type: 'string',
        "default": 'left'
      },
      tab_key_behavior: {
        title: 'Tab Key Behavior',
        type: 'object',
        properties: {
          insert_tab: {
            title: 'Insert Tab',
            description: 'Pressing the tab key will insert a tab character.',
            type: 'boolean',
            "default": true,
            order: 1
          },
          soft_tabs: {
            title: 'Soft Tabs',
            description: 'Use spaces to represent tabs.',
            type: 'boolean',
            "default": true,
            order: 2
          },
          soft_tab_length: {
            title: 'Soft Tab Length',
            description: 'The number of spaces used to represent a tab.',
            type: 'integer',
            minimum: 1,
            "default": 2,
            order: 3
          }
        }
      }
    },
    activate: function() {
      atom.workspace.addOpener(function(filePath) {
        if (filePath === restClientUri) {
          return createRestClientView({
            uri: restClientUri
          });
        }
      });
      atom.commands.add('atom-workspace', 'rest-client:show', function() {
        return atom.workspace.open(restClientUri, {
          split: atom.config.get('rest-client.split'),
          searchAllPanes: true
        });
      });
      atom.commands.add('.rest-client-headers, .rest-client-payload', {
        'rest-client.insertTab': (function(_this) {
          return function() {
            return _this.insertTab();
          };
        })(this)
      });
      return atom.config.observe('rest-client.tab_key_behavior.insert_tab', function(value) {
        var command;
        command = value ? 'rest-client.insertTab' : 'unset!';
        return atom.keymaps.add('REST Client', {
          '.rest-client-headers, .rest-client-payload': {
            'tab': command
          }
        });
      });
    },
    insertTab: function() {
      var end, endText, soft_tab_length, soft_tabs, start, tab, text;
      soft_tabs = atom.config.get('rest-client.tab_key_behavior.soft_tabs');
      soft_tab_length = atom.config.get('rest-client.tab_key_behavior.soft_tab_length');
      tab = soft_tabs ? ' '.repeat(soft_tab_length) : '\t';
      text = event.target.value;
      start = event.target.selectionStart;
      end = event.target.selectionEnd;
      endText = start === end ? text.slice(start) : text.slice(end, text.length);
      event.target.value = text.slice(0, start) + tab + endText;
      return event.target.selectionStart = event.target.selectionEnd = start + tab.length;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvZGRld2V5Ly5hdG9tL3BhY2thZ2VzL3Jlc3QtY2xpZW50L2xpYi9yZXN0LWNsaWVudC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLGNBQUEsR0FBaUI7O0VBQ2pCLGFBQUEsR0FBZ0I7O0VBRWhCLG9CQUFBLEdBQXVCLFNBQUMsS0FBRDs7TUFDckIsaUJBQWtCLE9BQUEsQ0FBUSxvQkFBUjs7V0FDZCxJQUFBLGNBQUEsQ0FBZSxLQUFmO0VBRmlCOztFQUl2QixZQUFBLEdBQ0U7SUFBQSxJQUFBLEVBQU0sZ0JBQU47SUFDQSxXQUFBLEVBQWEsU0FBQyxLQUFEO2FBQVcsb0JBQUEsQ0FBcUIsS0FBckI7SUFBWCxDQURiOzs7RUFFRixJQUFJLENBQUMsYUFBYSxDQUFDLEdBQW5CLENBQXVCLFlBQXZCOztFQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7SUFBQSxNQUFBLEVBQ0U7TUFBQSx3QkFBQSxFQUNFO1FBQUEsS0FBQSxFQUFPLDBCQUFQO1FBQ0EsV0FBQSxFQUFhLCtDQURiO1FBRUEsSUFBQSxFQUFNLFFBRk47UUFHQSxDQUFBLE9BQUEsQ0FBQSxFQUFXLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxrQkFBZCxDQUFpQyxhQUFqQyxDQUFELENBQUEsR0FBaUQsbUJBSDVEO09BREY7TUFLQSxvQkFBQSxFQUNFO1FBQUEsS0FBQSxFQUFPLHNCQUFQO1FBQ0EsV0FBQSxFQUFhLDJDQURiO1FBRUEsSUFBQSxFQUFNLFFBRk47UUFHQSxDQUFBLE9BQUEsQ0FBQSxFQUFXLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxrQkFBZCxDQUFpQyxhQUFqQyxDQUFELENBQUEsR0FBaUQsY0FINUQ7T0FORjtNQVVBLHFCQUFBLEVBQ0U7UUFBQSxLQUFBLEVBQU8sdUJBQVA7UUFDQSxXQUFBLEVBQWEsbUNBRGI7UUFFQSxJQUFBLEVBQU0sU0FGTjtRQUdBLENBQUEsT0FB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LEdBQVgsRUFBZ0IsSUFBSSxDQUFDLE1BQXJCO01BRXRELEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBYixHQUFxQixJQUFJLENBQUMsS0FBTCxDQUFXLENBQVgsRUFBYyxLQUFkLENBQUEsR0FBdUIsR0FBdkIsR0FBNkI7YUFDbEQsS0FBSyxDQUFDLE1BQU0sQ0FBQyxjQUFiLEdBQThCLEtBQUssQ0FBQyxNQUFNLENBQUMsWUFBYixHQUE0QixLQUFBLEdBQVEsR0FBRyxDQUFDO0lBVjdELENBNURYOztBQWJGIiwic291cmNlc0NvbnRlbnQiOlsiUmVzdENsaWVudFZpZXcgPSBudWxsXG5yZXN0Q2xpZW50VXJpID0gJ2F0b206Ly9yZXN0LWNsaWVudCdcblxuY3JlYXRlUmVzdENsaWVudFZpZXcgPSAoc3RhdGUpIC0+XG4gIFJlc3RDbGllbnRWaWV3ID89IHJlcXVpcmUgJy4vcmVzdC1jbGllbnQtdmlldydcbiAgbmV3IFJlc3RDbGllbnRWaWV3KHN0YXRlKVxuXG5kZXNlcmlhbGl6ZXIgPVxuICBuYW1lOiAnUmVzdENsaWVudFZpZXcnXG4gIGRlc2VyaWFsaXplOiAoc3RhdGUpIC0+IGNyZWF0ZVJlc3RDbGllbnRWaWV3KHN0YXRlKVxuYXRvbS5kZXNlcmlhbGl6ZXJzLmFkZChkZXNlcmlhbGl6ZXIpXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgY29uZmlnOlxuICAgIHJlcXVlc3RfY29sbGVjdGlvbnNfcGF0aDpcbiAgICAgIHRpdGxlOiAnUmVxdWVzdCBDb2xsZWN0aW9ucyBwYXRoJ1xuICAgICAgZGVzY3JpcHRpb246ICdQYXRoIGZvciB0aGUgZmlsZSBzdG9yaW5nIHJlcXVlc3QgY29sbGVjdGlvbnMnXG4gICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgZGVmYXVsdDogXCIje2F0b20ucGFja2FnZXMucmVzb2x2ZVBhY2thZ2VQYXRoKCdyZXN0LWNsaWVudCcpfS9jb2xsZWN0aW9ucy5qc29uXCJcbiAgICByZWNlbnRfcmVxdWVzdHNfcGF0aDpcbiAgICAgIHRpdGxlOiAnUmVjZW50IHJlcXVlc3RzIHBhdGgnXG4gICAgICBkZXNjcmlwdGlvbjogJ1BhdGggZm9yIHRoZSBmaWxlIHN0b3JpbmcgcmVjZW50IHJlcXVlc3RzJ1xuICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIGRlZmF1bHQ6IFwiI3thdG9tLnBhY2thZ2VzLnJlc29sdmVQYWNrYWdlUGF0aCgncmVzdC1jbGllbnQnKX0vcmVjZW50Lmpzb25cIlxuICAgIHJlY2VudF9yZXF1ZXN0c19saW1pdDpcbiAgICAgIHRpdGxlOiAnUmVjZW50IFJlcXVlc3RzIGxpbWl0J1xuICAgICAgZGVzY3JpcHRpb246ICdudW1iZXIgb2YgcmVjZW50IHJlcXVlc3RzIHRvIHNhdmUnXG4gICAgICB0eXBlOiAnaW50ZWdlcidcbiAgICAgIGRlZmF1bHQ6IDVcbiAgICBzcGxpdDpcbiAgICAgIHRpdGxlOiAnU3BsaXQgc2V0dGluZydcbiAgICAgIGRlc2NyaXB0aW9uOiAnT3BlbiBpbiBcImxlZnRcIiBvciBcInJpZ2h0XCIgcGFuZSdcbiAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICBkZWZhdWx0OiAnbGVmdCdcbiAgICB0YWJfa2V5X2JlaGF2aW9yOlxuICAgICAgdGl0bGU6ICdUYWIgS2V5IEJlaGF2aW9yJ1xuICAgICAgdHlwZTogJ29iamVjdCdcbiAgICAgIHByb3BlcnRpZXM6XG4gICAgICAgIGluc2VydF90YWI6XG4gICAgICAgICAgdGl0bGU6ICdJbnNlcnQgVGFiJ1xuICAgICAgICAgIGRlc2NyaXB0aW9uOiAnUHJlc3NpbmcgdGhlIHRhYiBrZXkgd2lsbCBpbnNlcnQgYSB0YWIgY2hhcmFjdGVyLidcbiAgICAgICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgICAgICBkZWZhdWx0OiB0cnVlXG4gICAgICAgICAgb3JkZXI6IDFcbiAgICAgICAgc29mdF90YWJzOlxuICAgICAgICAgIHRpdGxlOiAnU29mdCBUYWJzJ1xuICAgICAgICAgIGRlc2NyaXB0aW9uOiAnVXNlIHNwYWNlcyB0byByZXByZXNlbnQgdGFicy4nXG4gICAgICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICAgICAgZGVmYXVsdDogdHJ1ZVxuICAgICAgICAgIG9yZGVyOiAyXG4gICAgICAgIHNvZnRfdGFiX2xlbmd0aDpcbiAgICAgICAgICB0aXRsZTogJ1NvZnQgVGFiIExlbmd0aCdcbiAgICAgICAgICBkZXNjcmlwdGlvbjogJ1RoZSBudW1iZXIgb2Ygc3BhY2VzIHVzZWQgdG8gcmVwcmVzZW50IGEgdGFiLidcbiAgICAgICAgICB0eXBlOiAnaW50ZWdlcidcbiAgICAgICAgICBtaW5pbXVtOiAxXG4gICAgICAgICAgZGVmYXVsdDogMlxuICAgICAgICAgIG9yZGVyOiAzXG5cblxuICBhY3RpdmF0ZTogLT5cbiAgICAjIFRPRE8gQ29uZmlnIG5vdCBhY2Nlc3NpYmxlIGluIHZpZXcgZHVlIHRvIGFkZE9wZW5lclxuICAgIGF0b20ud29ya3NwYWNlLmFkZE9wZW5lciAoZmlsZVBhdGgpIC0+XG4gICAgICBjcmVhdGVSZXN0Q2xpZW50Vmlldyh1cmk6IHJlc3RDbGllbnRVcmkpIGlmIGZpbGVQYXRoIGlzIHJlc3RDbGllbnRVcmlcblxuICAgIGF0b20uY29tbWFuZHMuYWRkICdhdG9tLXdvcmtzcGFjZScsICdyZXN0LWNsaWVudDpzaG93JywgLT5cbiAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4ocmVzdENsaWVudFVyaSwgc3BsaXQ6IGF0b20uY29uZmlnLmdldCgncmVzdC1jbGllbnQuc3BsaXQnKSwgc2VhcmNoQWxsUGFuZXM6IHRydWUpXG5cbiAgICBhdG9tLmNvbW1hbmRzLmFkZCAnLnJlc3QtY2xpZW50LWhlYWRlcnMsIC5yZXN0LWNsaWVudC1wYXlsb2FkJywgJ3Jlc3QtY2xpZW50Lmluc2VydFRhYic6ID0+IEBpbnNlcnRUYWIoKVxuXG4gICAgYXRvbS5jb25maWcub2JzZXJ2ZSAncmVzdC1jbGllbnQudGFiX2tleV9iZWhhdmlvci5pbnNlcnRfdGFiJywgKHZhbHVlKSAtPlxuICAgICAgY29tbWFuZCA9IGlmIHZhbHVlIHRoZW4gJ3Jlc3QtY2xpZW50Lmluc2VydFRhYicgZWxzZSAndW5zZXQhJ1xuICAgICAgYXRvbS5rZXltYXBzLmFkZCAnUkVTVCBDbGllbnQnLCAnLnJlc3QtY2xpZW50LWhlYWRlcnMsIC5yZXN0LWNsaWVudC1wYXlsb2FkJzogJ3RhYic6IGNvbW1hbmRcblxuICBpbnNlcnRUYWI6IC0+XG4gICAgc29mdF90YWJzID0gYXRvbS5jb25maWcuZ2V0KCdyZXN0LWNsaWVudC50YWJfa2V5X2JlaGF2aW9yLnNvZnRfdGFicycpXG4gICAgc29mdF90YWJfbGVuZ3RoID0gYXRvbS5jb25maWcuZ2V0KCdyZXN0LWNsaWVudC50YWJfa2V5X2JlaGF2aW9yLnNvZnRfdGFiX2xlbmd0aCcpXG4gICAgdGFiID0gaWYgc29mdF90YWJzIHRoZW4gJyAnLnJlcGVhdChzb2Z0X3RhYl9sZW5ndGgpIGVsc2UgJ1xcdCdcbiAgICB0ZXh0ID0gZXZlbnQudGFyZ2V0LnZhbHVlXG4gICAgc3RhcnQgPSBldmVudC50YXJnZXQuc2VsZWN0aW9uU3RhcnRcbiAgICBlbmQgPSBldmVudC50YXJnZXQuc2VsZWN0aW9uRW5kXG4gICAgZW5kVGV4dCA9IGlmIHN0YXJ0IGlzIGVuZCB0aGVuIHRleHQuc2xpY2Uoc3RhcnQpIGVsc2UgdGV4dC5zbGljZShlbmQsIHRleHQubGVuZ3RoKVxuXG4gICAgZXZlbnQudGFyZ2V0LnZhbHVlID0gdGV4dC5zbGljZSgwLCBzdGFydCkgKyB0YWIgKyBlbmRUZXh0XG4gICAgZXZlbnQudGFyZ2V0LnNlbGVjdGlvblN0YXJ0ID0gZXZlbnQudGFyZ2V0LnNlbGVjdGlvbkVuZCA9IHN0YXJ0ICsgdGFiLmxlbmd0aFxuIl19
