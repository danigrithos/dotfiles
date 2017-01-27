(function() {
  var RestClientView;

  RestClientView = require('../lib/rest-client-view');

  describe("RestClientView test", function() {
    var restClient;
    restClient = [][0];
    beforeEach(function() {
      return restClient = new RestClientView();
    });
    describe("View", function() {
      return it("the view is loaded", function() {
        return expect(restClient.find('.rest-client-send')).toExist();
      });
    });
    return describe("constructFileName", function() {
      return it("contains the url, the method and an extension inferred from the response content-type", function() {
        restClient.setLastRequest({
          url: "http://example.com",
          method: "GET"
        });
        restClient.setLastResponse({
          headers: {
            "content-type": "application/json"
          }
        });
        return expect(restClient.constructFileName()).toEqual("GET http://example.com.json");
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvZGRld2V5Ly5hdG9tL3BhY2thZ2VzL3Jlc3QtY2xpZW50L3NwZWMvcmVzdC1jbGllbnQtdmlldy1zcGVjLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsY0FBQSxHQUFpQixPQUFBLENBQVEseUJBQVI7O0VBRWpCLFFBQUEsQ0FBUyxxQkFBVCxFQUFnQyxTQUFBO0FBQzlCLFFBQUE7SUFBQyxhQUFjO0lBRWYsVUFBQSxDQUFXLFNBQUE7YUFDVCxVQUFBLEdBQWlCLElBQUEsY0FBQSxDQUFBO0lBRFIsQ0FBWDtJQUdBLFFBQUEsQ0FBUyxNQUFULEVBQWlCLFNBQUE7YUFDZixFQUFBLENBQUcsb0JBQUgsRUFBeUIsU0FBQTtlQUN2QixNQUFBLENBQU8sVUFBVSxDQUFDLElBQVgsQ0FBZ0IsbUJBQWhCLENBQVAsQ0FBNEMsQ0FBQyxPQUE3QyxDQUFBO01BRHVCLENBQXpCO0lBRGUsQ0FBakI7V0FJQSxRQUFBLENBQVMsbUJBQVQsRUFBOEIsU0FBQTthQUM1QixFQUFBLENBQUcsdUZBQUgsRUFBNEYsU0FBQTtRQUMxRixVQUFVLENBQUMsY0FBWCxDQUEwQjtVQUFFLEdBQUEsRUFBSyxvQkFBUDtVQUE2QixNQUFBLEVBQVEsS0FBckM7U0FBMUI7UUFDQSxVQUFVLENBQUMsZUFBWCxDQUEyQjtVQUFFLE9BQUEsRUFBUztZQUFFLGNBQUEsRUFBZ0Isa0JBQWxCO1dBQVg7U0FBM0I7ZUFDQSxNQUFBLENBQU8sVUFBVSxDQUFDLGlCQUFYLENBQUEsQ0FBUCxDQUFzQyxDQUFDLE9BQXZDLENBQStDLDZCQUEvQztNQUgwRixDQUE1RjtJQUQ0QixDQUE5QjtFQVY4QixDQUFoQztBQUZBIiwic291cmNlc0NvbnRlbnQiOlsiUmVzdENsaWVudFZpZXcgPSByZXF1aXJlICcuLi9saWIvcmVzdC1jbGllbnQtdmlldydcblxuZGVzY3JpYmUgXCJSZXN0Q2xpZW50VmlldyB0ZXN0XCIsIC0+XG4gIFtyZXN0Q2xpZW50XSA9IFtdXG5cbiAgYmVmb3JlRWFjaCAtPlxuICAgIHJlc3RDbGllbnQgPSBuZXcgUmVzdENsaWVudFZpZXcoKVxuXG4gIGRlc2NyaWJlIFwiVmlld1wiLCAtPlxuICAgIGl0IFwidGhlIHZpZXcgaXMgbG9hZGVkXCIsIC0+XG4gICAgICBleHBlY3QocmVzdENsaWVudC5maW5kKCcucmVzdC1jbGllbnQtc2VuZCcpKS50b0V4aXN0KClcblxuICBkZXNjcmliZSBcImNvbnN0cnVjdEZpbGVOYW1lXCIsIC0+XG4gICAgaXQgXCJjb250YWlucyB0aGUgdXJsLCB0aGUgbWV0aG9kIGFuZCBhbiBleHRlbnNpb24gaW5mZXJyZWQgZnJvbSB0aGUgcmVzcG9uc2UgY29udGVudC10eXBlXCIsIC0+XG4gICAgICByZXN0Q2xpZW50LnNldExhc3RSZXF1ZXN0IHsgdXJsOiBcImh0dHA6Ly9leGFtcGxlLmNvbVwiLCBtZXRob2Q6IFwiR0VUXCIgfVxuICAgICAgcmVzdENsaWVudC5zZXRMYXN0UmVzcG9uc2UgeyBoZWFkZXJzOiB7IFwiY29udGVudC10eXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiIH0gfVxuICAgICAgZXhwZWN0KHJlc3RDbGllbnQuY29uc3RydWN0RmlsZU5hbWUoKSkudG9FcXVhbCBcIkdFVCBodHRwOi8vZXhhbXBsZS5jb20uanNvblwiXG4iXX0=
