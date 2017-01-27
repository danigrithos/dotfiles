(function() {
  var ExpressionsRegistry;

  ExpressionsRegistry = require('../lib/expressions-registry');

  describe('ExpressionsRegistry', function() {
    var Dummy, ref, registry;
    ref = [], registry = ref[0], Dummy = ref[1];
    beforeEach(function() {
      Dummy = (function() {
        function Dummy(arg) {
          this.name = arg.name, this.regexpString = arg.regexpString, this.priority = arg.priority, this.scopes = arg.scopes, this.handle = arg.handle;
        }

        return Dummy;

      })();
      return registry = new ExpressionsRegistry(Dummy);
    });
    describe('::createExpression', function() {
      return describe('called with enough data', function() {
        return it('creates a new expression of this registry expressions type', function() {
          var expression;
          expression = registry.createExpression('dummy', 'foo');
          expect(expression.constructor).toBe(Dummy);
          return expect(registry.getExpressions()).toEqual([expression]);
        });
      });
    });
    describe('::addExpression', function() {
      return it('adds a previously created expression in the registry', function() {
        var expression;
        expression = new Dummy({
          name: 'bar'
        });
        registry.addExpression(expression);
        expect(registry.getExpression('bar')).toBe(expression);
        return expect(registry.getExpressions()).toEqual([expression]);
      });
    });
    describe('::getExpressions', function() {
      return it('returns the expression based on their priority', function() {
        var expression1, expression2, expression3;
        expression1 = registry.createExpression('dummy1', '', 2);
        expression2 = registry.createExpression('dummy2', '', 0);
        expression3 = registry.createExpression('dummy3', '', 1);
        return expect(registry.getExpressions()).toEqual([expression1, expression3, expression2]);
      });
    });
    describe('::removeExpression', function() {
      return it('removes an expression with its name', function() {
        registry.createExpression('dummy', 'foo');
        registry.removeExpression('dummy');
        return expect(registry.getExpressions()).toEqual([]);
      });
    });
    describe('::serialize', function() {
      return it('serializes the registry with the function content', function() {
        var serialized;
        registry.createExpression('dummy', 'foo');
        registry.createExpression('dummy2', 'bar', function(a, b, c) {
          return a + b - c;
        });
        serialized = registry.serialize();
        expect(serialized.regexpString).toEqual('(foo)|(bar)');
        expect(serialized.expressions.dummy).toEqual({
          name: 'dummy',
          regexpString: 'foo',
          handle: void 0,
          priority: 0,
          scopes: ['*']
        });
        return expect(serialized.expressions.dummy2).toEqual({
          name: 'dummy2',
          regexpString: 'bar',
          handle: registry.getExpression('dummy2').handle.toString(),
          priority: 0,
          scopes: ['*']
        });
      });
    });
    return describe('.deserialize', function() {
      return it('deserializes the provided expressions using the specified model', function() {
        var deserialized, serialized;
        serialized = {
          regexpString: 'foo|bar',
          expressions: {
            dummy: {
              name: 'dummy',
              regexpString: 'foo',
              handle: 'function (a,b,c) { return a + b - c; }',
              priority: 0,
              scopes: ['*']
            }
          }
        };
        deserialized = ExpressionsRegistry.deserialize(serialized, Dummy);
        expect(deserialized.getRegExp()).toEqual('foo|bar');
        expect(deserialized.getExpression('dummy').name).toEqual('dummy');
        expect(deserialized.getExpression('dummy').regexpString).toEqual('foo');
        return expect(deserialized.getExpression('dummy').handle(1, 2, 3)).toEqual(0);
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvZGRld2V5Ly5hdG9tL3BhY2thZ2VzL3BpZ21lbnRzL3NwZWMvZXhwcmVzc2lvbnMtcmVnaXN0cnktc3BlYy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLG1CQUFBLEdBQXNCLE9BQUEsQ0FBUSw2QkFBUjs7RUFFdEIsUUFBQSxDQUFTLHFCQUFULEVBQWdDLFNBQUE7QUFDOUIsUUFBQTtJQUFBLE1BQW9CLEVBQXBCLEVBQUMsaUJBQUQsRUFBVztJQUVYLFVBQUEsQ0FBVyxTQUFBO01BQ0g7UUFDUyxlQUFDLEdBQUQ7VUFBRSxJQUFDLENBQUEsV0FBQSxNQUFNLElBQUMsQ0FBQSxtQkFBQSxjQUFjLElBQUMsQ0FBQSxlQUFBLFVBQVUsSUFBQyxDQUFBLGFBQUEsUUFBUSxJQUFDLENBQUEsYUFBQTtRQUE3Qzs7Ozs7YUFFZixRQUFBLEdBQWUsSUFBQSxtQkFBQSxDQUFvQixLQUFwQjtJQUpOLENBQVg7SUFNQSxRQUFBLENBQVMsb0JBQVQsRUFBK0IsU0FBQTthQUM3QixRQUFBLENBQVMseUJBQVQsRUFBb0MsU0FBQTtlQUNsQyxFQUFBLENBQUcsNERBQUgsRUFBaUUsU0FBQTtBQUMvRCxjQUFBO1VBQUEsVUFBQSxHQUFhLFFBQVEsQ0FBQyxnQkFBVCxDQUEwQixPQUExQixFQUFtQyxLQUFuQztVQUViLE1BQUEsQ0FBTyxVQUFVLENBQUMsV0FBbEIsQ0FBOEIsQ0FBQyxJQUEvQixDQUFvQyxLQUFwQztpQkFDQSxNQUFBLENBQU8sUUFBUSxDQUFDLGNBQVQsQ0FBQSxDQUFQLENBQWlDLENBQUMsT0FBbEMsQ0FBMEMsQ0FBQyxVQUFELENBQTFDO1FBSitELENBQWpFO01BRGtDLENBQXBDO0lBRDZCLENBQS9CO0lBUUEsUUFBQSxDQUFTLGlCQUFULEVBQTRCLFNBQUE7YUFDMUIsRUFBQSxDQUFHLHNEQUFILEVBQTJELFNBQUE7QUFDekQsWUFBQTtRQUFBLFVB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QSxFQUFjLFNBQWQ7VUFDQSxXQUFBLEVBQ0U7WUFBQSxLQUFBLEVBQ0U7Y0FBQSxJQUFBLEVBQU0sT0FBTjtjQUNBLFlBQUEsRUFBYyxLQURkO2NBRUEsTUFBQSxFQUFRLHdDQUZSO2NBR0EsUUFBQSxFQUFVLENBSFY7Y0FJQSxNQUFBLEVBQVEsQ0FBQyxHQUFELENBSlI7YUFERjtXQUZGOztRQVNGLFlBQUEsR0FBZSxtQkFBbUIsQ0FBQyxXQUFwQixDQUFnQyxVQUFoQyxFQUE0QyxLQUE1QztRQUVmLE1BQUEsQ0FBTyxZQUFZLENBQUMsU0FBYixDQUFBLENBQVAsQ0FBZ0MsQ0FBQyxPQUFqQyxDQUF5QyxTQUF6QztRQUNBLE1BQUEsQ0FBTyxZQUFZLENBQUMsYUFBYixDQUEyQixPQUEzQixDQUFtQyxDQUFDLElBQTNDLENBQWdELENBQUMsT0FBakQsQ0FBeUQsT0FBekQ7UUFDQSxNQUFBLENBQU8sWUFBWSxDQUFDLGFBQWIsQ0FBMkIsT0FBM0IsQ0FBbUMsQ0FBQyxZQUEzQyxDQUF3RCxDQUFDLE9BQXpELENBQWlFLEtBQWpFO2VBQ0EsTUFBQSxDQUFPLFlBQVksQ0FBQyxhQUFiLENBQTJCLE9BQTNCLENBQW1DLENBQUMsTUFBcEMsQ0FBMkMsQ0FBM0MsRUFBNkMsQ0FBN0MsRUFBK0MsQ0FBL0MsQ0FBUCxDQUF5RCxDQUFDLE9BQTFELENBQWtFLENBQWxFO01BaEJvRSxDQUF0RTtJQUR1QixDQUF6QjtFQXRFOEIsQ0FBaEM7QUFGQSIsInNvdXJjZXNDb250ZW50IjpbIkV4cHJlc3Npb25zUmVnaXN0cnkgPSByZXF1aXJlICcuLi9saWIvZXhwcmVzc2lvbnMtcmVnaXN0cnknXG5cbmRlc2NyaWJlICdFeHByZXNzaW9uc1JlZ2lzdHJ5JywgLT5cbiAgW3JlZ2lzdHJ5LCBEdW1teV0gPSBbXVxuXG4gIGJlZm9yZUVhY2ggLT5cbiAgICBjbGFzcyBEdW1teVxuICAgICAgY29uc3RydWN0b3I6ICh7QG5hbWUsIEByZWdleHBTdHJpbmcsIEBwcmlvcml0eSwgQHNjb3BlcywgQGhhbmRsZX0pIC0+XG5cbiAgICByZWdpc3RyeSA9IG5ldyBFeHByZXNzaW9uc1JlZ2lzdHJ5KER1bW15KVxuXG4gIGRlc2NyaWJlICc6OmNyZWF0ZUV4cHJlc3Npb24nLCAtPlxuICAgIGRlc2NyaWJlICdjYWxsZWQgd2l0aCBlbm91Z2ggZGF0YScsIC0+XG4gICAgICBpdCAnY3JlYXRlcyBhIG5ldyBleHByZXNzaW9uIG9mIHRoaXMgcmVnaXN0cnkgZXhwcmVzc2lvbnMgdHlwZScsIC0+XG4gICAgICAgIGV4cHJlc3Npb24gPSByZWdpc3RyeS5jcmVhdGVFeHByZXNzaW9uICdkdW1teScsICdmb28nXG5cbiAgICAgICAgZXhwZWN0KGV4cHJlc3Npb24uY29uc3RydWN0b3IpLnRvQmUoRHVtbXkpXG4gICAgICAgIGV4cGVjdChyZWdpc3RyeS5nZXRFeHByZXNzaW9ucygpKS50b0VxdWFsKFtleHByZXNzaW9uXSlcblxuICBkZXNjcmliZSAnOjphZGRFeHByZXNzaW9uJywgLT5cbiAgICBpdCAnYWRkcyBhIHByZXZpb3VzbHkgY3JlYXRlZCBleHByZXNzaW9uIGluIHRoZSByZWdpc3RyeScsIC0+XG4gICAgICBleHByZXNzaW9uID0gbmV3IER1bW15KG5hbWU6ICdiYXInKVxuXG4gICAgICByZWdpc3RyeS5hZGRFeHByZXNzaW9uKGV4cHJlc3Npb24pXG5cbiAgICAgIGV4cGVjdChyZWdpc3RyeS5nZXRFeHByZXNzaW9uKCdiYXInKSkudG9CZShleHByZXNzaW9uKVxuICAgICAgZXhwZWN0KHJlZ2lzdHJ5LmdldEV4cHJlc3Npb25zKCkpLnRvRXF1YWwoW2V4cHJlc3Npb25dKVxuXG4gIGRlc2NyaWJlICc6OmdldEV4cHJlc3Npb25zJywgLT5cbiAgICBpdCAncmV0dXJucyB0aGUgZXhwcmVzc2lvbiBiYXNlZCBvbiB0aGVpciBwcmlvcml0eScsIC0+XG4gICAgICBleHByZXNzaW9uMSA9IHJlZ2lzdHJ5LmNyZWF0ZUV4cHJlc3Npb24gJ2R1bW15MScsICcnLCAyXG4gICAgICBleHByZXNzaW9uMiA9IHJlZ2lzdHJ5LmNyZWF0ZUV4cHJlc3Npb24gJ2R1bW15MicsICcnLCAwXG4gICAgICBleHByZXNzaW9uMyA9IHJlZ2lzdHJ5LmNyZWF0ZUV4cHJlc3Npb24gJ2R1bW15MycsICcnLCAxXG5cbiAgICAgIGV4cGVjdChyZWdpc3RyeS5nZXRFeHByZXNzaW9ucygpKS50b0VxdWFsKFtcbiAgICAgICAgZXhwcmVzc2lvbjFcbiAgICAgICAgZXhwcmVzc2lvbjNcbiAgICAgICAgZXhwcmVzc2lvbjJcbiAgICAgIF0pXG5cbiAgZGVzY3JpYmUgJzo6cmVtb3ZlRXhwcmVzc2lvbicsIC0+XG4gICAgaXQgJ3JlbW92ZXMgYW4gZXhwcmVzc2lvbiB3aXRoIGl0cyBuYW1lJywgLT5cbiAgICAgIHJlZ2lzdHJ5LmNyZWF0ZUV4cHJlc3Npb24gJ2R1bW15JywgJ2ZvbydcblxuICAgICAgcmVnaXN0cnkucmVtb3ZlRXhwcmVzc2lvbignZHVtbXknKVxuXG4gICAgICBleHBlY3QocmVnaXN0cnkuZ2V0RXhwcmVzc2lvbnMoKSkudG9FcXVhbChbXSlcblxuICBkZXNjcmliZSAnOjpzZXJpYWxpemUnLCAtPlxuICAgIGl0ICdzZXJpYWxpemVzIHRoZSByZWdpc3RyeSB3aXRoIHRoZSBmdW5jdGlvbiBjb250ZW50JywgLT5cbiAgICAgIHJlZ2lzdHJ5LmNyZWF0ZUV4cHJlc3Npb24gJ2R1bW15JywgJ2ZvbydcbiAgICAgIHJlZ2lzdHJ5LmNyZWF0ZUV4cHJlc3Npb24gJ2R1bW15MicsICdiYXInLCAoYSxiLGMpIC0+IGEgKyBiIC0gY1xuXG4gICAgICBzZXJpYWxpemVkID0gcmVnaXN0cnkuc2VyaWFsaXplKClcblxuICAgICAgZXhwZWN0KHNlcmlhbGl6ZWQucmVnZXhwU3RyaW5nKS50b0VxdWFsKCcoZm9vKXwoYmFyKScpXG4gICAgICBleHBlY3Qoc2VyaWFsaXplZC5leHByZXNzaW9ucy5kdW1teSkudG9FcXVhbCh7XG4gICAgICAgIG5hbWU6ICdkdW1teSdcbiAgICAgICAgcmVnZXhwU3RyaW5nOiAnZm9vJ1xuICAgICAgICBoYW5kbGU6IHVuZGVmaW5lZFxuICAgICAgICBwcmlvcml0eTogMFxuICAgICAgICBzY29wZXM6IFsnKiddXG4gICAgICB9KVxuXG4gICAgICBleHBlY3Qoc2VyaWFsaXplZC5leHByZXNzaW9ucy5kdW1teTIpLnRvRXF1YWwoe1xuICAgICAgICBuYW1lOiAnZHVtbXkyJ1xuICAgICAgICByZWdleHBTdHJpbmc6ICdiYXInXG4gICAgICAgIGhhbmRsZTogcmVnaXN0cnkuZ2V0RXhwcmVzc2lvbignZHVtbXkyJykuaGFuZGxlLnRvU3RyaW5nKClcbiAgICAgICAgcHJpb3JpdHk6IDBcbiAgICAgICAgc2NvcGVzOiBbJyonXVxuICAgICAgfSlcblxuICBkZXNjcmliZSAnLmRlc2VyaWFsaXplJywgLT5cbiAgICBpdCAnZGVzZXJpYWxpemVzIHRoZSBwcm92aWRlZCBleHByZXNzaW9ucyB1c2luZyB0aGUgc3BlY2lmaWVkIG1vZGVsJywgLT5cbiAgICAgIHNlcmlhbGl6ZWQgPVxuICAgICAgICByZWdleHBTdHJpbmc6ICdmb298YmFyJ1xuICAgICAgICBleHByZXNzaW9uczpcbiAgICAgICAgICBkdW1teTpcbiAgICAgICAgICAgIG5hbWU6ICdkdW1teSdcbiAgICAgICAgICAgIHJlZ2V4cFN0cmluZzogJ2ZvbydcbiAgICAgICAgICAgIGhhbmRsZTogJ2Z1bmN0aW9uIChhLGIsYykgeyByZXR1cm4gYSArIGIgLSBjOyB9J1xuICAgICAgICAgICAgcHJpb3JpdHk6IDBcbiAgICAgICAgICAgIHNjb3BlczogWycqJ11cblxuICAgICAgZGVzZXJpYWxpemVkID0gRXhwcmVzc2lvbnNSZWdpc3RyeS5kZXNlcmlhbGl6ZShzZXJpYWxpemVkLCBEdW1teSlcblxuICAgICAgZXhwZWN0KGRlc2VyaWFsaXplZC5nZXRSZWdFeHAoKSkudG9FcXVhbCgnZm9vfGJhcicpXG4gICAgICBleHBlY3QoZGVzZXJpYWxpemVkLmdldEV4cHJlc3Npb24oJ2R1bW15JykubmFtZSkudG9FcXVhbCgnZHVtbXknKVxuICAgICAgZXhwZWN0KGRlc2VyaWFsaXplZC5nZXRFeHByZXNzaW9uKCdkdW1teScpLnJlZ2V4cFN0cmluZykudG9FcXVhbCgnZm9vJylcbiAgICAgIGV4cGVjdChkZXNlcmlhbGl6ZWQuZ2V0RXhwcmVzc2lvbignZHVtbXknKS5oYW5kbGUoMSwyLDMpKS50b0VxdWFsKDApXG4iXX0=
