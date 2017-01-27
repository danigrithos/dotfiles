(function() {
  var RestClientResponse;

  RestClientResponse = require('../lib/rest-client-response');

  describe("RestClientResponse", function() {
    return describe("Json", function() {
      it("body is not json", function() {
        var body, response;
        body = "<html></html>";
        response = new RestClientResponse(body);
        return expect(response.isJson()).toBe(false);
      });
      it("body is json", function() {
        var body, response;
        body = '{"hello": "world"}';
        response = new RestClientResponse(body);
        return expect(response.isJson()).toBe(true);
      });
      it("process result is not json", function() {
        var body, response;
        body = "<html></html>";
        response = new RestClientResponse(body);
        return expect(response.getFormatted()).toEqual('<html></html>');
      });
      return it("process result is json", function() {
        var body, response;
        body = '{"hello": "world"}';
        response = new RestClientResponse(body);
        return expect(response.getFormatted()).toEqual('{\n    "hello": "world"\n}');
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvZGRld2V5Ly5hdG9tL3BhY2thZ2VzL3Jlc3QtY2xpZW50L3NwZWMvcmVzdC1jbGllbnQtcmVzcG9uc2Utc3BlYy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLGtCQUFBLEdBQXFCLE9BQUEsQ0FBUSw2QkFBUjs7RUFFckIsUUFBQSxDQUFTLG9CQUFULEVBQStCLFNBQUE7V0FFN0IsUUFBQSxDQUFTLE1BQVQsRUFBaUIsU0FBQTtNQUNmLEVBQUEsQ0FBRyxrQkFBSCxFQUF1QixTQUFBO0FBQ3JCLFlBQUE7UUFBQSxJQUFBLEdBQU87UUFDUCxRQUFBLEdBQWUsSUFBQSxrQkFBQSxDQUFtQixJQUFuQjtlQUNmLE1BQUEsQ0FBTyxRQUFRLENBQUMsTUFBVCxDQUFBLENBQVAsQ0FBeUIsQ0FBQyxJQUExQixDQUErQixLQUEvQjtNQUhxQixDQUF2QjtNQUtBLEVBQUEsQ0FBRyxjQUFILEVBQW1CLFNBQUE7QUFDakIsWUFBQTtRQUFBLElBQUEsR0FBTztRQUNQLFFBQUEsR0FBZSxJQUFBLGtCQUFBLENBQW1CLElBQW5CO2VBQ2YsTUFBQSxDQUFPLFFBQVEsQ0FBQyxNQUFULENBQUEsQ0FBUCxDQUF5QixDQUFDLElBQTFCLENBQStCLElBQS9CO01BSGlCLENBQW5CO01BS0EsRUFBQSxDQUFHLDRCQUFILEVBQWlDLFNBQUE7QUFDL0IsWUFBQTtRQUFBLElBQUEsR0FBTztRQUNQLFFBQUEsR0FBZSxJQUFBLGtCQUFBLENBQW1CLElBQW5CO2VBQ2YsTUFBQSxDQUFPLFFBQVEsQ0FBQyxZQUFULENBQUEsQ0FBUCxDQUErQixDQUFDLE9BQWhDLENBQXdDLGVBQXhDO01BSCtCLENBQWpDO2FBS0EsRUFBQSxDQUFHLHdCQUFILEVBQTZCLFNBQUE7QUFDM0IsWUFBQTtRQUFBLElBQUEsR0FBTztRQUNQLFFBQUEsR0FBZSxJQUFBLGtCQUFBLENBQW1CLElBQW5CO2VBQ2YsTUFBQSxDQUFPLFFBQVEsQ0FBQyxZQUFULENBQUEsQ0FBUCxDQUErQixDQUFDLE9BQWhDLENBQXdDLDRCQUF4QztNQUgyQixDQUE3QjtJQWhCZSxDQUFqQjtFQUY2QixDQUEvQjtBQUZBIiwic291cmNlc0NvbnRlbnQiOlsiUmVzdENsaWVudFJlc3BvbnNlID0gcmVxdWlyZSAnLi4vbGliL3Jlc3QtY2xpZW50LXJlc3BvbnNlJ1xuXG5kZXNjcmliZSBcIlJlc3RDbGllbnRSZXNwb25zZVwiLCAtPlxuXG4gIGRlc2NyaWJlIFwiSnNvblwiLCAtPlxuICAgIGl0IFwiYm9keSBpcyBub3QganNvblwiLCAtPlxuICAgICAgYm9keSA9IFwiPGh0bWw+PC9odG1sPlwiXG4gICAgICByZXNwb25zZSA9IG5ldyBSZXN0Q2xpZW50UmVzcG9uc2UoYm9keSlcbiAgICAgIGV4cGVjdChyZXNwb25zZS5pc0pzb24oKSkudG9CZShmYWxzZSlcblxuICAgIGl0IFwiYm9keSBpcyBqc29uXCIsIC0+XG4gICAgICBib2R5ID0gJ3tcImhlbGxvXCI6IFwid29ybGRcIn0nXG4gICAgICByZXNwb25zZSA9IG5ldyBSZXN0Q2xpZW50UmVzcG9uc2UoYm9keSlcbiAgICAgIGV4cGVjdChyZXNwb25zZS5pc0pzb24oKSkudG9CZSh0cnVlKVxuXG4gICAgaXQgXCJwcm9jZXNzIHJlc3VsdCBpcyBub3QganNvblwiLCAtPlxuICAgICAgYm9keSA9IFwiPGh0bWw+PC9odG1sPlwiXG4gICAgICByZXNwb25zZSA9IG5ldyBSZXN0Q2xpZW50UmVzcG9uc2UoYm9keSlcbiAgICAgIGV4cGVjdChyZXNwb25zZS5nZXRGb3JtYXR0ZWQoKSkudG9FcXVhbCgnPGh0bWw+PC9odG1sPicpXG5cbiAgICBpdCBcInByb2Nlc3MgcmVzdWx0IGlzIGpzb25cIiwgLT5cbiAgICAgIGJvZHkgPSAne1wiaGVsbG9cIjogXCJ3b3JsZFwifSdcbiAgICAgIHJlc3BvbnNlID0gbmV3IFJlc3RDbGllbnRSZXNwb25zZShib2R5KVxuICAgICAgZXhwZWN0KHJlc3BvbnNlLmdldEZvcm1hdHRlZCgpKS50b0VxdWFsKCd7XFxuICAgIFwiaGVsbG9cIjogXCJ3b3JsZFwiXFxufScpXG4iXX0=
