(function() {
  var EditorLinter, LinterRegistry, Validators;

  LinterRegistry = require('../lib/linter-registry');

  EditorLinter = require('../lib/editor-linter');

  Validators = require('../lib/validate');

  module.exports = {
    wait: function(timeout) {
      return new Promise(function(resolve) {
        return setTimeout(resolve, timeout);
      });
    },
    getLinter: function() {
      return {
        grammarScopes: ['*'],
        lintOnFly: false,
        scope: 'project',
        lint: function() {}
      };
    },
    getMessage: function(type, filePath, range) {
      var message;
      message = {
        type: type,
        text: 'Some Message',
        filePath: filePath,
        range: range
      };
      Validators.messages([message], {
        name: 'Some Linter'
      });
      return message;
    },
    getLinterRegistry: function() {
      var editorLinter, linter, linterRegistry;
      linterRegistry = new LinterRegistry;
      editorLinter = new EditorLinter(atom.workspace.getActiveTextEditor());
      linter = {
        grammarScopes: ['*'],
        lintOnFly: false,
        scope: 'project',
        lint: function() {
          return [
            {
              type: 'Error',
              text: 'Something'
            }
          ];
        }
      };
      linterRegistry.addLinter(linter);
      return {
        linterRegistry: linterRegistry,
        editorLinter: editorLinter,
        linter: linter
      };
    },
    trigger: function(el, name) {
      var event;
      event = document.createEvent('HTMLEvents');
      event.initEvent(name, true, false);
      return el.dispatchEvent(event);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvZGRld2V5Ly5hdG9tL3BhY2thZ2VzL2xpbnRlci9zcGVjL2NvbW1vbi5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLGNBQUEsR0FBaUIsT0FBQSxDQUFRLHdCQUFSOztFQUNqQixZQUFBLEdBQWUsT0FBQSxDQUFRLHNCQUFSOztFQUNmLFVBQUEsR0FBYSxPQUFBLENBQVEsaUJBQVI7O0VBRWIsTUFBTSxDQUFDLE9BQVAsR0FDRTtJQUFBLElBQUEsRUFBTSxTQUFDLE9BQUQ7QUFDSixhQUFXLElBQUEsT0FBQSxDQUFRLFNBQUMsT0FBRDtlQUNqQixVQUFBLENBQVcsT0FBWCxFQUFvQixPQUFwQjtNQURpQixDQUFSO0lBRFAsQ0FBTjtJQUdBLFNBQUEsRUFBVyxTQUFBO0FBQ1QsYUFBTztRQUFDLGFBQUEsRUFBZSxDQUFDLEdBQUQsQ0FBaEI7UUFBdUIsU0FBQSxFQUFXLEtBQWxDO1FBQXlDLEtBQUEsRUFBTyxTQUFoRDtRQUEyRCxJQUFBLEVBQU0sU0FBQSxHQUFBLENBQWpFOztJQURFLENBSFg7SUFLQSxVQUFBLEVBQVksU0FBQyxJQUFELEVBQU8sUUFBUCxFQUFpQixLQUFqQjtBQUNWLFVBQUE7TUFBQSxPQUFBLEdBQVU7UUFBQyxNQUFBLElBQUQ7UUFBTyxJQUFBLEVBQU0sY0FBYjtRQUE2QixVQUFBLFFBQTdCO1FBQXVDLE9BQUEsS0FBdkM7O01BQ1YsVUFBVSxDQUFDLFFBQVgsQ0FBb0IsQ0FBQyxPQUFELENBQXBCLEVBQStCO1FBQUMsSUFBQSxFQUFNLGFBQVA7T0FBL0I7QUFDQSxhQUFPO0lBSEcsQ0FMWjtJQVNBLGlCQUFBLEVBQW1CLFNBQUE7QUFDakIsVUFBQTtNQUFBLGNBQUEsR0FBaUIsSUFBSTtNQUNyQixZQUFBLEdBQW1CLElBQUEsWUFBQSxDQUFhLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQUFiO01BQ25CLE1BQUEsR0FBUztRQUNQLGFBQUEsRUFBZSxDQUFDLEdBQUQsQ0FEUjtRQUVQLFNBQUEsRUFBVyxLQUZKO1FBR1AsS0FBQSxFQUFPLFNBSEE7UUFJUCxJQUFBLEVBQU0sU0FBQTtBQUFHLGlCQUFPO1lBQUM7Y0FBQyxJQUFBLEVBQU0sT0FBUDtjQUFnQixJQUFBLEVBQU0sV0FBdEI7YUFBRDs7UUFBVixDQUpDOztNQU1ULGNBQWMsQ0FBQyxTQUFmLENBQXlCLE1BQXpCO0FBQ0EsYUFBTztRQUFDLGdCQUFBLGNBQUQ7UUFBaUIsY0FBQSxZQUFqQjtRQUErQixRQUFBLE1BQS9COztJQVZVLENBVG5CO0lBb0JBLE9BQUEsRUFBUyxTQUFDLEVBQUQsRUFBSyxJQUFMO0FBQ1AsVUFBQTtNQUFBLEtBQUEsR0FBUSxRQUFRLENBQUMsV0FBVCxDQUFxQixZQUFyQjtNQUNSLEtBQUssQ0FBQyxTQUFOLENBQWdCLElBQWhCLEVBQXNCLElBQXRCLEVBQTRCLEtBQTVCO2FBQ0EsRUFBRSxDQUFDLGFBQUgsQ0FBaUIsS0FBakI7SUFITyxDQXBCVDs7QUFMRiIsInNvdXJjZXNDb250ZW50IjpbIkxpbnRlclJlZ2lzdHJ5ID0gcmVxdWlyZSgnLi4vbGliL2xpbnRlci1yZWdpc3RyeScpXG5FZGl0b3JMaW50ZXIgPSByZXF1aXJlKCcuLi9saWIvZWRpdG9yLWxpbnRlcicpXG5WYWxpZGF0b3JzID0gcmVxdWlyZSgnLi4vbGliL3ZhbGlkYXRlJylcblxubW9kdWxlLmV4cG9ydHMgPVxuICB3YWl0OiAodGltZW91dCkgLT5cbiAgICByZXR1cm4gbmV3IFByb21pc2UgKHJlc29sdmUpIC0+XG4gICAgICBzZXRUaW1lb3V0KHJlc29sdmUsIHRpbWVvdXQpXG4gIGdldExpbnRlcjogLT5cbiAgICByZXR1cm4ge2dyYW1tYXJTY29wZXM6IFsnKiddLCBsaW50T25GbHk6IGZhbHNlLCBzY29wZTogJ3Byb2plY3QnLCBsaW50OiAtPiB9XG4gIGdldE1lc3NhZ2U6ICh0eXBlLCBmaWxlUGF0aCwgcmFuZ2UpIC0+XG4gICAgbWVzc2FnZSA9IHt0eXBlLCB0ZXh0OiAnU29tZSBNZXNzYWdlJywgZmlsZVBhdGgsIHJhbmdlfVxuICAgIFZhbGlkYXRvcnMubWVzc2FnZXMoW21lc3NhZ2VdLCB7bmFtZTogJ1NvbWUgTGludGVyJ30pXG4gICAgcmV0dXJuIG1lc3NhZ2VcbiAgZ2V0TGludGVyUmVnaXN0cnk6IC0+XG4gICAgbGludGVyUmVnaXN0cnkgPSBuZXcgTGludGVyUmVnaXN0cnlcbiAgICBlZGl0b3JMaW50ZXIgPSBuZXcgRWRpdG9yTGludGVyKGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKSlcbiAgICBsaW50ZXIgPSB7XG4gICAgICBncmFtbWFyU2NvcGVzOiBbJyonXVxuICAgICAgbGludE9uRmx5OiBmYWxzZVxuICAgICAgc2NvcGU6ICdwcm9qZWN0J1xuICAgICAgbGludDogLT4gcmV0dXJuIFt7dHlwZTogJ0Vycm9yJywgdGV4dDogJ1NvbWV0aGluZyd9XVxuICAgIH1cbiAgICBsaW50ZXJSZWdpc3RyeS5hZGRMaW50ZXIobGludGVyKVxuICAgIHJldHVybiB7bGludGVyUmVnaXN0cnksIGVkaXRvckxpbnRlciwgbGludGVyfVxuICB0cmlnZ2VyOiAoZWwsIG5hbWUpIC0+XG4gICAgZXZlbnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnSFRNTEV2ZW50cycpXG4gICAgZXZlbnQuaW5pdEV2ZW50KG5hbWUsIHRydWUsIGZhbHNlKVxuICAgIGVsLmRpc3BhdGNoRXZlbnQoZXZlbnQpXG4iXX0=
