(function() {
  describe('validate', function() {
    var getLinter, validate;
    validate = require('../lib/validate');
    getLinter = require('./common').getLinter;
    describe('::linter', function() {
      it('throws error if grammarScopes is not an array', function() {
        return expect(function() {
          var linter;
          linter = getLinter();
          linter.grammarScopes = false;
          return validate.linter(linter);
        }).toThrow('grammarScopes is not an Array. Got: false');
      });
      it('throws if lint is missing', function() {
        return expect(function() {
          var linter;
          linter = getLinter();
          delete linter.lint;
          return validate.linter(linter);
        }).toThrow();
      });
      it('throws if lint is not a function', function() {
        return expect(function() {
          var linter;
          linter = getLinter();
          linter.lint = 'woah';
          return validate.linter(linter);
        }).toThrow();
      });
      it('works well with name attribute', function() {
        var linter;
        expect(function() {
          var linter;
          linter = getLinter();
          linter.name = 1;
          return validate.linter(linter);
        }).toThrow('Linter.name must be a string');
        linter = getLinter();
        linter.name = null;
        return validate.linter(linter);
      });
      it('works well with scope attribute', function() {
        var linter;
        expect(function() {
          var linter;
          linter = getLinter();
          linter.scope = null;
          return validate.linter(linter);
        }).toThrow('Linter.scope must be either `file` or `project`');
        expect(function() {
          var linter;
          linter = getLinter();
          linter.scope = 'a';
          return validate.linter(linter);
        }).toThrow('Linter.scope must be either `file` or `project`');
        linter = getLinter();
        linter.scope = 'Project';
        return validate.linter(linter);
      });
      return it('works overall', function() {
        validate.linter(getLinter());
        return expect(true).toBe(true);
      });
    });
    return describe('::messages', function() {
      it('throws if messages is not an array', function() {
        expect(function() {
          return validate.messages();
        }).toThrow('Expected messages to be array, provided: undefined');
        return expect(function() {
          return validate.messages(true);
        }).toThrow('Expected messages to be array, provided: boolean');
      });
      it('throws if type field is not present', function() {
        return expect(function() {
          return validate.messages([{}], {
            name: ''
          });
        }).toThrow();
      });
      it('throws if type field is invalid', function() {
        return expect(function() {
          return validate.messages([
            {
              type: 1
            }
          ], {
            name: ''
          });
        }).toThrow();
      });
      it("throws if there's no html/text field on message", function() {
        return expect(function() {
          return validate.messages([
            {
              type: 'Error'
            }
          ], {
            name: ''
          });
        }).toThrow();
      });
      it('throws if html/text is invalid', function() {
        expect(function() {
          return validate.messages([
            {
              type: 'Error',
              html: 1
            }
          ], {
            name: ''
          });
        }).toThrow();
        expect(function() {
          return validate.messages([
            {
              type: 'Error',
              text: 1
            }
          ], {
            name: ''
          });
        }).toThrow();
        expect(function() {
          return validate.messages([
            {
              type: 'Error',
              html: false
            }
          ], {
            name: ''
          });
        }).toThrow();
        expect(function() {
          return validate.messages([
            {
              type: 'Error',
              text: false
            }
          ], {
            name: ''
          });
        }).toThrow();
        expect(function() {
          return validate.messages([
            {
              type: 'Error',
              html: []
            }
          ], {
            name: ''
          });
        }).toThrow();
        return expect(function() {
          return validate.messages([
            {
              type: 'Error',
              text: []
            }
          ], {
            name: ''
          });
        }).toThrow();
      });
      it('throws if trace is invalid', function() {
        expect(function() {
          return validate.messages([
            {
              type: 'Error',
              html: 'a',
              trace: 1
            }
          ], {
            name: ''
          });
        }).toThrow();
        return validate.messages([
          {
            type: 'Error',
            html: 'a',
            trace: false
          }
        ], {
          name: ''
        });
      });
      it('throws if class is invalid', function() {
        expect(function() {
          return validate.messages([
            {
              type: 'Error',
              text: 'Well',
              "class": 1
            }
          ], {
            name: ''
          });
        }).toThrow();
        expect(function() {
          return validate.messages([
            {
              type: 'Error',
              text: 'Well',
              "class": []
            }
          ], {
            name: ''
          });
        }).toThrow();
        return validate.messages([
          {
            type: 'Error',
            text: 'Well',
            "class": 'error'
          }
        ], {
          name: ''
        });
      });
      it('throws if filePath is invalid', function() {
        expect(function() {
          return validate.messages([
            {
              type: 'Error',
              text: 'Well',
              "class": 'error',
              filePath: 1
            }
          ], {
            name: ''
          });
        }).toThrow();
        return validate.messages([
          {
            type: 'Error',
            text: 'Well',
            "class": 'error',
            filePath: '/'
          }
        ], {
          name: ''
        });
      });
      return it('throws if both text and html are provided', function() {
        expect(function() {
          return validate.messages([
            {
              type: 'Error',
              text: 'Well',
              html: 'a',
              "class": 'error',
              filePath: '/'
            }
          ], {
            name: ''
          });
        }).toThrow();
        validate.messages([
          {
            type: 'Error',
            text: 'Well',
            "class": 'error',
            filePath: '/'
          }
        ], {
          name: ''
        });
        validate.messages([
          {
            type: 'Error',
            html: 'Well',
            "class": 'error',
            filePath: '/'
          }
        ], {
          name: ''
        });
        return validate.messages([
          {
            type: 'Error',
            html: document.createElement('div'),
            "class": 'error',
            filePath: '/'
          }
        ], {
          name: ''
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvZGRld2V5Ly5hdG9tL3BhY2thZ2VzL2xpbnRlci9zcGVjL3ZhbGlkYXRlLXNwZWMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQUEsUUFBQSxDQUFTLFVBQVQsRUFBcUIsU0FBQTtBQUNuQixRQUFBO0lBQUEsUUFBQSxHQUFXLE9BQUEsQ0FBUSxpQkFBUjtJQUNWLFlBQWEsT0FBQSxDQUFRLFVBQVI7SUFDZCxRQUFBLENBQVMsVUFBVCxFQUFxQixTQUFBO01BQ25CLEVBQUEsQ0FBRywrQ0FBSCxFQUFvRCxTQUFBO2VBQ2xELE1BQUEsQ0FBTyxTQUFBO0FBQ0wsY0FBQTtVQUFBLE1BQUEsR0FBUyxTQUFBLENBQUE7VUFDVCxNQUFNLENBQUMsYUFBUCxHQUF1QjtpQkFDdkIsUUFBUSxDQUFDLE1BQVQsQ0FBZ0IsTUFBaEI7UUFISyxDQUFQLENBSUEsQ0FBQyxPQUpELENBSVMsMkNBSlQ7TUFEa0QsQ0FBcEQ7TUFNQSxFQUFBLENBQUcsMkJBQUgsRUFBZ0MsU0FBQTtlQUM5QixNQUFBLENBQU8sU0FBQTtBQUNMLGNBQUE7VUFBQSxNQUFBLEdBQVMsU0FBQSxDQUFBO1VBQ1QsT0FBTyxNQUFNLENBQUM7aUJBQ2QsUUFBUSxDQUFDLE1BQVQsQ0FBZ0IsTUFBaEI7UUFISyxDQUFQLENBSUEsQ0FBQyxPQUpELENBQUE7TUFEOEIsQ0FBaEM7TUFNQSxFQUFBLENBQUcsa0NBQUgsRUFBdUMsU0FBQTtlQUNyQyxNQUFBLENBQU8sU0FBQTtBQUNMLGNBQUE7VUFBQSxNQUFBLEdBQVMsU0FBQSxDQUFBO1VBQ1QsTUFBTSxDQUFDLElBQVAsR0FBYztpQkFDZCxRQUFRLENBQUMsTUFBVCxDQUFnQixNQUFoQjtRQUhLLENBQVAsQ0FJQSxDQUFDLE9BSkQsQ0FBQTtNQURxQyxDQUF2QztNQU1BLEVBQUEsQ0FBRyxnQ0FBSCxFQUFxQyxTQUFBO0FBQ25DLFlBQUE7UUFBQSxNQUFBLENBQU8sU0FB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QUNBLFFBQVEsQ0FBQyxRQUFULENBQWtCO1VBQUM7WUFBQyxJQUFBLEVBQU0sT0FBUDtZQUFnQixJQUFBLEVBQU0sTUFBdEI7WUFBOEIsQ0FBQSxLQUFBLENBQUEsRUFBTyxPQUFyQztZQUE4QyxRQUFBLEVBQVUsR0FBeEQ7V0FBRDtTQUFsQixFQUFrRjtVQUFDLElBQUEsRUFBTSxFQUFQO1NBQWxGO2VBQ0EsUUFBUSxDQUFDLFFBQVQsQ0FBa0I7VUFBQztZQUFDLElBQUEsRUFBTSxPQUFQO1lBQWdCLElBQUEsRUFBTSxRQUFRLENBQUMsYUFBVCxDQUF1QixLQUF2QixDQUF0QjtZQUFxRCxDQUFBLEtBQUEsQ0FBQSxFQUFPLE9BQTVEO1lBQXFFLFFBQUEsRUFBVSxHQUEvRTtXQUFEO1NBQWxCLEVBQXlHO1VBQUMsSUFBQSxFQUFNLEVBQVA7U0FBekc7TUFOOEMsQ0FBaEQ7SUF6RHFCLENBQXZCO0VBakRtQixDQUFyQjtBQUFBIiwic291cmNlc0NvbnRlbnQiOlsiZGVzY3JpYmUgJ3ZhbGlkYXRlJywgLT5cbiAgdmFsaWRhdGUgPSByZXF1aXJlKCcuLi9saWIvdmFsaWRhdGUnKVxuICB7Z2V0TGludGVyfSA9IHJlcXVpcmUoJy4vY29tbW9uJylcbiAgZGVzY3JpYmUgJzo6bGludGVyJywgLT5cbiAgICBpdCAndGhyb3dzIGVycm9yIGlmIGdyYW1tYXJTY29wZXMgaXMgbm90IGFuIGFycmF5JywgLT5cbiAgICAgIGV4cGVjdCAtPlxuICAgICAgICBsaW50ZXIgPSBnZXRMaW50ZXIoKVxuICAgICAgICBsaW50ZXIuZ3JhbW1hclNjb3BlcyA9IGZhbHNlXG4gICAgICAgIHZhbGlkYXRlLmxpbnRlcihsaW50ZXIpXG4gICAgICAudG9UaHJvdygnZ3JhbW1hclNjb3BlcyBpcyBub3QgYW4gQXJyYXkuIEdvdDogZmFsc2UnKVxuICAgIGl0ICd0aHJvd3MgaWYgbGludCBpcyBtaXNzaW5nJywgLT5cbiAgICAgIGV4cGVjdCAtPlxuICAgICAgICBsaW50ZXIgPSBnZXRMaW50ZXIoKVxuICAgICAgICBkZWxldGUgbGludGVyLmxpbnRcbiAgICAgICAgdmFsaWRhdGUubGludGVyKGxpbnRlcilcbiAgICAgIC50b1Rocm93KClcbiAgICBpdCAndGhyb3dzIGlmIGxpbnQgaXMgbm90IGEgZnVuY3Rpb24nLCAtPlxuICAgICAgZXhwZWN0IC0+XG4gICAgICAgIGxpbnRlciA9IGdldExpbnRlcigpXG4gICAgICAgIGxpbnRlci5saW50ID0gJ3dvYWgnXG4gICAgICAgIHZhbGlkYXRlLmxpbnRlcihsaW50ZXIpXG4gICAgICAudG9UaHJvdygpXG4gICAgaXQgJ3dvcmtzIHdlbGwgd2l0aCBuYW1lIGF0dHJpYnV0ZScsIC0+XG4gICAgICBleHBlY3QgLT5cbiAgICAgICAgbGludGVyID0gZ2V0TGludGVyKClcbiAgICAgICAgbGludGVyLm5hbWUgPSAxXG4gICAgICAgIHZhbGlkYXRlLmxpbnRlcihsaW50ZXIpXG4gICAgICAudG9UaHJvdygnTGludGVyLm5hbWUgbXVzdCBiZSBhIHN0cmluZycpXG4gICAgICBsaW50ZXIgPSBnZXRMaW50ZXIoKVxuICAgICAgbGludGVyLm5hbWUgPSBudWxsXG4gICAgICB2YWxpZGF0ZS5saW50ZXIobGludGVyKVxuICAgIGl0ICd3b3JrcyB3ZWxsIHdpdGggc2NvcGUgYXR0cmlidXRlJywgLT5cbiAgICAgIGV4cGVjdCAtPlxuICAgICAgICBsaW50ZXIgPSBnZXRMaW50ZXIoKVxuICAgICAgICBsaW50ZXIuc2NvcGUgPSBudWxsXG4gICAgICAgIHZhbGlkYXRlLmxpbnRlcihsaW50ZXIpXG4gICAgICAudG9UaHJvdygnTGludGVyLnNjb3BlIG11c3QgYmUgZWl0aGVyIGBmaWxlYCBvciBgcHJvamVjdGAnKVxuICAgICAgZXhwZWN0IC0+XG4gICAgICAgIGxpbnRlciA9IGdldExpbnRlcigpXG4gICAgICAgIGxpbnRlci5zY29wZSA9ICdhJ1xuICAgICAgICB2YWxpZGF0ZS5saW50ZXIobGludGVyKVxuICAgICAgLnRvVGhyb3coJ0xpbnRlci5zY29wZSBtdXN0IGJlIGVpdGhlciBgZmlsZWAgb3IgYHByb2plY3RgJylcbiAgICAgIGxpbnRlciA9IGdldExpbnRlcigpXG4gICAgICBsaW50ZXIuc2NvcGUgPSAnUHJvamVjdCdcbiAgICAgIHZhbGlkYXRlLmxpbnRlcihsaW50ZXIpXG4gICAgaXQgJ3dvcmtzIG92ZXJhbGwnLCAtPlxuICAgICAgdmFsaWRhdGUubGludGVyKGdldExpbnRlcigpKVxuICAgICAgZXhwZWN0KHRydWUpLnRvQmUodHJ1ZSlcblxuICBkZXNjcmliZSAnOjptZXNzYWdlcycsIC0+XG4gICAgaXQgJ3Rocm93cyBpZiBtZXNzYWdlcyBpcyBub3QgYW4gYXJyYXknLCAtPlxuICAgICAgZXhwZWN0IC0+XG4gICAgICAgIHZhbGlkYXRlLm1lc3NhZ2VzKClcbiAgICAgIC50b1Rocm93KCdFeHBlY3RlZCBtZXNzYWdlcyB0byBiZSBhcnJheSwgcHJvdmlkZWQ6IHVuZGVmaW5lZCcpXG4gICAgICBleHBlY3QgLT5cbiAgICAgICAgdmFsaWRhdGUubWVzc2FnZXModHJ1ZSlcbiAgICAgIC50b1Rocm93KCdFeHBlY3RlZCBtZXNzYWdlcyB0byBiZSBhcnJheSwgcHJvdmlkZWQ6IGJvb2xlYW4nKVxuICAgIGl0ICd0aHJvd3MgaWYgdHlwZSBmaWVsZCBpcyBub3QgcHJlc2VudCcsIC0+XG4gICAgICBleHBlY3QgLT5cbiAgICAgICAgdmFsaWRhdGUubWVzc2FnZXMoW3t9XSwge25hbWU6ICcnfSlcbiAgICAgIC50b1Rocm93KClcbiAgICBpdCAndGhyb3dzIGlmIHR5cGUgZmllbGQgaXMgaW52YWxpZCcsIC0+XG4gICAgICBleHBlY3QgLT5cbiAgICAgICAgdmFsaWRhdGUubWVzc2FnZXMoW3t0eXBlOiAxfV0sIHtuYW1lOiAnJ30pXG4gICAgICAudG9UaHJvdygpXG4gICAgaXQgXCJ0aHJvd3MgaWYgdGhlcmUncyBubyBodG1sL3RleHQgZmllbGQgb24gbWVzc2FnZVwiLCAtPlxuICAgICAgZXhwZWN0IC0+XG4gICAgICAgIHZhbGlkYXRlLm1lc3NhZ2VzKFt7dHlwZTogJ0Vycm9yJ31dLCB7bmFtZTogJyd9KVxuICAgICAgLnRvVGhyb3coKVxuICAgIGl0ICd0aHJvd3MgaWYgaHRtbC90ZXh0IGlzIGludmFsaWQnLCAtPlxuICAgICAgZXhwZWN0IC0+XG4gICAgICAgIHZhbGlkYXRlLm1lc3NhZ2VzKFt7dHlwZTogJ0Vycm9yJywgaHRtbDogMX1dLCB7bmFtZTogJyd9KVxuICAgICAgLnRvVGhyb3coKVxuICAgICAgZXhwZWN0IC0+XG4gICAgICAgIHZhbGlkYXRlLm1lc3NhZ2VzKFt7dHlwZTogJ0Vycm9yJywgdGV4dDogMX1dLCB7bmFtZTogJyd9KVxuICAgICAgLnRvVGhyb3coKVxuICAgICAgZXhwZWN0IC0+XG4gICAgICAgIHZhbGlkYXRlLm1lc3NhZ2VzKFt7dHlwZTogJ0Vycm9yJywgaHRtbDogZmFsc2V9XSwge25hbWU6ICcnfSlcbiAgICAgIC50b1Rocm93KClcbiAgICAgIGV4cGVjdCAtPlxuICAgICAgICB2YWxpZGF0ZS5tZXNzYWdlcyhbe3R5cGU6ICdFcnJvcicsIHRleHQ6IGZhbHNlfV0sIHtuYW1lOiAnJ30pXG4gICAgICAudG9UaHJvdygpXG4gICAgICBleHBlY3QgLT5cbiAgICAgICAgdmFsaWRhdGUubWVzc2FnZXMoW3t0eXBlOiAnRXJyb3InLCBodG1sOiBbXX1dLCB7bmFtZTogJyd9KVxuICAgICAgLnRvVGhyb3coKVxuICAgICAgZXhwZWN0IC0+XG4gICAgICAgIHZhbGlkYXRlLm1lc3NhZ2VzKFt7dHlwZTogJ0Vycm9yJywgdGV4dDogW119XSwge25hbWU6ICcnfSlcbiAgICAgIC50b1Rocm93KClcbiAgICBpdCAndGhyb3dzIGlmIHRyYWNlIGlzIGludmFsaWQnLCAtPlxuICAgICAgZXhwZWN0IC0+XG4gICAgICAgIHZhbGlkYXRlLm1lc3NhZ2VzKFt7dHlwZTogJ0Vycm9yJywgaHRtbDogJ2EnLCB0cmFjZTogMX1dLCB7bmFtZTogJyd9KVxuICAgICAgLnRvVGhyb3coKVxuICAgICAgdmFsaWRhdGUubWVzc2FnZXMoW3t0eXBlOiAnRXJyb3InLCBodG1sOiAnYScsIHRyYWNlOiBmYWxzZX1dLCB7bmFtZTogJyd9KVxuICAgIGl0ICd0aHJvd3MgaWYgY2xhc3MgaXMgaW52YWxpZCcsIC0+XG4gICAgICBleHBlY3QgLT5cbiAgICAgICAgdmFsaWRhdGUubWVzc2FnZXMoW3t0eXBlOiAnRXJyb3InLCB0ZXh0OiAnV2VsbCcsIGNsYXNzOiAxfV0sIHtuYW1lOiAnJ30pXG4gICAgICAudG9UaHJvdygpXG4gICAgICBleHBlY3QgLT5cbiAgICAgICAgdmFsaWRhdGUubWVzc2FnZXMoW3t0eXBlOiAnRXJyb3InLCB0ZXh0OiAnV2VsbCcsIGNsYXNzOiBbXX1dLCB7bmFtZTogJyd9KVxuICAgICAgLnRvVGhyb3coKVxuICAgICAgdmFsaWRhdGUubWVzc2FnZXMoW3t0eXBlOiAnRXJyb3InLCB0ZXh0OiAnV2VsbCcsIGNsYXNzOiAnZXJyb3InfV0sIHtuYW1lOiAnJ30pXG4gICAgaXQgJ3Rocm93cyBpZiBmaWxlUGF0aCBpcyBpbnZhbGlkJywgLT5cbiAgICAgIGV4cGVjdCAtPlxuICAgICAgICB2YWxpZGF0ZS5tZXNzYWdlcyhbe3R5cGU6ICdFcnJvcicsIHRleHQ6ICdXZWxsJywgY2xhc3M6ICdlcnJvcicsIGZpbGVQYXRoOiAxfV0sIHtuYW1lOiAnJ30pXG4gICAgICAudG9UaHJvdygpXG4gICAgICB2YWxpZGF0ZS5tZXNzYWdlcyhbe3R5cGU6ICdFcnJvcicsIHRleHQ6ICdXZWxsJywgY2xhc3M6ICdlcnJvcicsIGZpbGVQYXRoOiAnLyd9XSwge25hbWU6ICcnfSlcbiAgICBpdCAndGhyb3dzIGlmIGJvdGggdGV4dCBhbmQgaHRtbCBhcmUgcHJvdmlkZWQnLCAtPlxuICAgICAgZXhwZWN0IC0+XG4gICAgICAgIHZhbGlkYXRlLm1lc3NhZ2VzKFt7dHlwZTogJ0Vycm9yJywgdGV4dDogJ1dlbGwnLCBodG1sOiAnYScsIGNsYXNzOiAnZXJyb3InLCBmaWxlUGF0aDogJy8nfV0sIHtuYW1lOiAnJ30pXG4gICAgICAudG9UaHJvdygpXG4gICAgICB2YWxpZGF0ZS5tZXNzYWdlcyhbe3R5cGU6ICdFcnJvcicsIHRleHQ6ICdXZWxsJywgY2xhc3M6ICdlcnJvcicsIGZpbGVQYXRoOiAnLyd9XSwge25hbWU6ICcnfSlcbiAgICAgIHZhbGlkYXRlLm1lc3NhZ2VzKFt7dHlwZTogJ0Vycm9yJywgaHRtbDogJ1dlbGwnLCBjbGFzczogJ2Vycm9yJywgZmlsZVBhdGg6ICcvJ31dLCB7bmFtZTogJyd9KVxuICAgICAgdmFsaWRhdGUubWVzc2FnZXMoW3t0eXBlOiAnRXJyb3InLCBodG1sOiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSwgY2xhc3M6ICdlcnJvcicsIGZpbGVQYXRoOiAnLyd9XSwge25hbWU6ICcnfSlcbiJdfQ==
