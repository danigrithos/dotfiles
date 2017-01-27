(function() {
  var RestClientEditor, RestClientResponse, fs,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  fs = require('fs');

  RestClientResponse = require('./rest-client-response');

  module.exports = RestClientEditor = (function() {
    RestClientEditor.prototype.TMP_DIR_ERROR_MESSAGE = 'Cannot save to tmp directory..';

    function RestClientEditor(text, file_name) {
      this.processOpen = bind(this.processOpen, this);
      this.text = text;
      this.file_name = this.processFilename(file_name);
      this.path = "/tmp/" + this.file_name;
    }

    RestClientEditor.prototype.open = function() {
      var openned;
      openned = false;
      if ([RestClientResponse.DEFAULT_RESULT, ""].indexOf(this.text) === -1) {
        fs.writeFile(this.path, this.text, this.processOpen);
        openned = true;
      }
      return openned;
    };

    RestClientEditor.prototype.processOpen = function(err) {
      if (err) {
        return this.showErrorOnOpen(err);
      } else {
        return this.openOnWorkspace(this.path);
      }
    };

    RestClientEditor.prototype.processFilename = function(file_name) {
      return file_name.replace(/https?:\/\//, '').replace(/\//g, '');
    };

    RestClientEditor.prototype.showErrorOnOpen = function(err) {
      return atom.confirm({
        message: this.TMP_DIR_ERROR_MESSAGE,
        detailedMessage: JSON.stringify(err)
      });
    };

    RestClientEditor.prototype.openOnWorkspace = function(path) {
      return atom.workspace.open(path);
    };

    return RestClientEditor;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvZGRld2V5Ly5hdG9tL3BhY2thZ2VzL3Jlc3QtY2xpZW50L2xpYi9yZXN0LWNsaWVudC1lZGl0b3IuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSx3Q0FBQTtJQUFBOztFQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUjs7RUFFTCxrQkFBQSxHQUFxQixPQUFBLENBQVEsd0JBQVI7O0VBRXJCLE1BQU0sQ0FBQyxPQUFQLEdBQ007K0JBQ0oscUJBQUEsR0FBdUI7O0lBRVYsMEJBQUMsSUFBRCxFQUFPLFNBQVA7O01BQ1gsSUFBQyxDQUFBLElBQUQsR0FBUTtNQUNSLElBQUMsQ0FBQSxTQUFELEdBQWEsSUFBQyxDQUFBLGVBQUQsQ0FBaUIsU0FBakI7TUFDYixJQUFDLENBQUEsSUFBRCxHQUFRLE9BQUEsR0FBUSxJQUFDLENBQUE7SUFITjs7K0JBS2IsSUFBQSxHQUFNLFNBQUE7QUFDSixVQUFBO01BQUEsT0FBQSxHQUFVO01BRVYsSUFBRyxDQUFDLGtCQUFrQixDQUFDLGNBQXBCLEVBQW9DLEVBQXBDLENBQXVDLENBQUMsT0FBeEMsQ0FBZ0QsSUFBQyxDQUFBLElBQWpELENBQUEsS0FBMEQsQ0FBQyxDQUE5RDtRQUVFLEVBQUUsQ0FBQyxTQUFILENBQWEsSUFBQyxDQUFBLElBQWQsRUFBb0IsSUFBQyxDQUFBLElBQXJCLEVBQTJCLElBQUMsQ0FBQSxXQUE1QjtRQUNBLE9BQUEsR0FBVSxLQUhaOzthQUtBO0lBUkk7OytCQVVOLFdBQUEsR0FBYSxTQUFDLEdBQUQ7TUFDWCxJQUFHLEdBQUg7ZUFDRSxJQUFDLENBQUEsZUFBRCxDQUFpQixHQUFqQixFQURGO09BQUEsTUFBQTtlQUdFLElBQUMsQ0FBQSxlQUFELENBQWlCLElBQUMsQ0FBQSxJQUFsQixFQUhGOztJQURXOzsrQkFNYixlQUFBLEdBQWlCLFNBQUMsU0FBRDthQUNmLFNBQVMsQ0FBQyxPQUFWLENBQWtCLGFBQWxCLEVBQWlDLEVBQWpDLENBQW9DLENBQUMsT0FBckMsQ0FBNkMsS0FBN0MsRUFBb0QsRUFBcEQ7SUFEZTs7K0JBR2pCLGVBQUEsR0FBaUIsU0FBQyxHQUFEO2FBQ2YsSUFBSSxDQUFDLE9BQUwsQ0FDRTtRQUFBLE9BQUEsRUFBUyxJQUFDLENBQUEscUJBQVY7UUFDQSxlQUFBLEVBQWlCLElBQUksQ0FBQyxTQUFMLENBQWUsR0FBZixDQURqQjtPQURGO0lBRGU7OytCQU1qQixlQUFBLEdBQWlCLFNBQUMsSUFBRDthQUNmLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixJQUFwQjtJQURlOzs7OztBQXRDbkIiLCJzb3VyY2VzQ29udGVudCI6WyJmcyA9IHJlcXVpcmUgJ2ZzJ1xuXG5SZXN0Q2xpZW50UmVzcG9uc2UgPSByZXF1aXJlICcuL3Jlc3QtY2xpZW50LXJlc3BvbnNlJ1xuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBSZXN0Q2xpZW50RWRpdG9yXG4gIFRNUF9ESVJfRVJST1JfTUVTU0FHRTogJ0Nhbm5vdCBzYXZlIHRvIHRtcCBkaXJlY3RvcnkuLidcblxuICBjb25zdHJ1Y3RvcjogKHRleHQsIGZpbGVfbmFtZSkgLT5cbiAgICBAdGV4dCA9IHRleHRcbiAgICBAZmlsZV9uYW1lID0gQHByb2Nlc3NGaWxlbmFtZShmaWxlX25hbWUpXG4gICAgQHBhdGggPSBcIi90bXAvI3tAZmlsZV9uYW1lfVwiXG5cbiAgb3BlbjogLT5cbiAgICBvcGVubmVkID0gZmFsc2VcblxuICAgIGlmIFtSZXN0Q2xpZW50UmVzcG9uc2UuREVGQVVMVF9SRVNVTFQsIFwiXCJdLmluZGV4T2YoQHRleHQpID09IC0xXG4gICAgICAjIGlkZWFsbHksIGkgd2FudCB0byBvcGVuIGl0IHdpdGhvdXQgc2F2aW5nIGEgZmlsZSwgYnV0IGkgZG9uJ3QgdGhpbmsgdGhhdCdsbCB3b3JrIGR1ZSB0byBhdG9tIGxpbWl0YXRpb25zXG4gICAgICBmcy53cml0ZUZpbGUoQHBhdGgsIEB0ZXh0LCBAcHJvY2Vzc09wZW4pXG4gICAgICBvcGVubmVkID0gdHJ1ZVxuXG4gICAgb3Blbm5lZFxuXG4gIHByb2Nlc3NPcGVuOiAoZXJyKSA9PlxuICAgIGlmIGVyclxuICAgICAgQHNob3dFcnJvck9uT3BlbihlcnIpXG4gICAgZWxzZVxuICAgICAgQG9wZW5PbldvcmtzcGFjZShAcGF0aClcblxuICBwcm9jZXNzRmlsZW5hbWU6IChmaWxlX25hbWUpIC0+XG4gICAgZmlsZV9uYW1lLnJlcGxhY2UoL2h0dHBzPzpcXC9cXC8vLCAnJykucmVwbGFjZSgvXFwvL2csICcnKVxuXG4gIHNob3dFcnJvck9uT3BlbjogKGVycikgLT5cbiAgICBhdG9tLmNvbmZpcm0oXG4gICAgICBtZXNzYWdlOiBAVE1QX0RJUl9FUlJPUl9NRVNTQUdFLFxuICAgICAgZGV0YWlsZWRNZXNzYWdlOiBKU09OLnN0cmluZ2lmeShlcnIpXG4gICAgKVxuXG4gIG9wZW5PbldvcmtzcGFjZTogKHBhdGgpIC0+XG4gICAgYXRvbS53b3Jrc3BhY2Uub3BlbihwYXRoKVxuIl19
