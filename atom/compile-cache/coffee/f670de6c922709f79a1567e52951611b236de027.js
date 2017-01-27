(function() {
  var Pigments, deserializers, registry;

  registry = require('../../lib/color-expressions');

  Pigments = require('../../lib/pigments');

  deserializers = {
    Palette: 'deserializePalette',
    ColorSearch: 'deserializeColorSearch',
    ColorProject: 'deserializeColorProject',
    ColorProjectElement: 'deserializeColorProjectElement',
    VariablesCollection: 'deserializeVariablesCollection'
  };

  beforeEach(function() {
    var k, v;
    atom.config.set('pigments.markerType', 'background');
    atom.views.addViewProvider(Pigments.pigmentsViewProvider);
    for (k in deserializers) {
      v = deserializers[k];
      atom.deserializers.add({
        name: k,
        deserialize: Pigments[v]
      });
    }
    return registry.removeExpression('pigments:variables');
  });

  afterEach(function() {
    return registry.removeExpression('pigments:variables');
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvZGRld2V5Ly5hdG9tL3BhY2thZ2VzL3BpZ21lbnRzL3NwZWMvaGVscGVycy9zcGVjLWhlbHBlci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLFFBQUEsR0FBVyxPQUFBLENBQVEsNkJBQVI7O0VBQ1gsUUFBQSxHQUFXLE9BQUEsQ0FBUSxvQkFBUjs7RUFFWCxhQUFBLEdBQ0U7SUFBQSxPQUFBLEVBQVMsb0JBQVQ7SUFDQSxXQUFBLEVBQWEsd0JBRGI7SUFFQSxZQUFBLEVBQWMseUJBRmQ7SUFHQSxtQkFBQSxFQUFxQixnQ0FIckI7SUFJQSxtQkFBQSxFQUFxQixnQ0FKckI7OztFQU1GLFVBQUEsQ0FBVyxTQUFBO0FBQ1QsUUFBQTtJQUFBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixxQkFBaEIsRUFBdUMsWUFBdkM7SUFDQSxJQUFJLENBQUMsS0FBSyxDQUFDLGVBQVgsQ0FBMkIsUUFBUSxDQUFDLG9CQUFwQztBQUVBLFNBQUEsa0JBQUE7O01BQ0UsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFuQixDQUF1QjtRQUFBLElBQUEsRUFBTSxDQUFOO1FBQVMsV0FBQSxFQUFhLFFBQVMsQ0FBQSxDQUFBLENBQS9CO09BQXZCO0FBREY7V0FHQSxRQUFRLENBQUMsZ0JBQVQsQ0FBMEIsb0JBQTFCO0VBUFMsQ0FBWDs7RUFTQSxTQUFBLENBQVUsU0FBQTtXQUNSLFFBQVEsQ0FBQyxnQkFBVCxDQUEwQixvQkFBMUI7RUFEUSxDQUFWO0FBbkJBIiwic291cmNlc0NvbnRlbnQiOlsicmVnaXN0cnkgPSByZXF1aXJlICcuLi8uLi9saWIvY29sb3ItZXhwcmVzc2lvbnMnXG5QaWdtZW50cyA9IHJlcXVpcmUgJy4uLy4uL2xpYi9waWdtZW50cydcblxuZGVzZXJpYWxpemVycyA9XG4gIFBhbGV0dGU6ICdkZXNlcmlhbGl6ZVBhbGV0dGUnXG4gIENvbG9yU2VhcmNoOiAnZGVzZXJpYWxpemVDb2xvclNlYXJjaCdcbiAgQ29sb3JQcm9qZWN0OiAnZGVzZXJpYWxpemVDb2xvclByb2plY3QnXG4gIENvbG9yUHJvamVjdEVsZW1lbnQ6ICdkZXNlcmlhbGl6ZUNvbG9yUHJvamVjdEVsZW1lbnQnXG4gIFZhcmlhYmxlc0NvbGxlY3Rpb246ICdkZXNlcmlhbGl6ZVZhcmlhYmxlc0NvbGxlY3Rpb24nXG5cbmJlZm9yZUVhY2ggLT5cbiAgYXRvbS5jb25maWcuc2V0KCdwaWdtZW50cy5tYXJrZXJUeXBlJywgJ2JhY2tncm91bmQnKVxuICBhdG9tLnZpZXdzLmFkZFZpZXdQcm92aWRlcihQaWdtZW50cy5waWdtZW50c1ZpZXdQcm92aWRlcilcblxuICBmb3Igayx2IG9mIGRlc2VyaWFsaXplcnNcbiAgICBhdG9tLmRlc2VyaWFsaXplcnMuYWRkIG5hbWU6IGssIGRlc2VyaWFsaXplOiBQaWdtZW50c1t2XVxuXG4gIHJlZ2lzdHJ5LnJlbW92ZUV4cHJlc3Npb24oJ3BpZ21lbnRzOnZhcmlhYmxlcycpXG5cbmFmdGVyRWFjaCAtPlxuICByZWdpc3RyeS5yZW1vdmVFeHByZXNzaW9uKCdwaWdtZW50czp2YXJpYWJsZXMnKVxuIl19
