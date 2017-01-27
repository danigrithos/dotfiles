(function() {
  var RestClientHttp, request;

  request = require('request');

  module.exports = RestClientHttp = (function() {
    function RestClientHttp() {}

    RestClientHttp.METHODS = ['get', 'post', 'put', 'patch', 'delete', 'head', 'options'];

    RestClientHttp.encodePayload = function(payload) {
      return encodeURIComponent(payload);
    };

    RestClientHttp.decodePayload = function(payload) {
      return decodeURIComponent(payload);
    };

    RestClientHttp.send = function(request_options, callback) {
      return request(request_options, callback);
    };

    return RestClientHttp;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvZGRld2V5Ly5hdG9tL3BhY2thZ2VzL3Jlc3QtY2xpZW50L2xpYi9yZXN0LWNsaWVudC1odHRwLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsT0FBQSxHQUFVLE9BQUEsQ0FBUSxTQUFSOztFQUVWLE1BQU0sQ0FBQyxPQUFQLEdBQ007OztJQUNKLGNBQUMsQ0FBQSxPQUFELEdBQVUsQ0FDUixLQURRLEVBRVIsTUFGUSxFQUdSLEtBSFEsRUFJUixPQUpRLEVBS1IsUUFMUSxFQU1SLE1BTlEsRUFPUixTQVBROztJQVVWLGNBQUMsQ0FBQSxhQUFELEdBQWdCLFNBQUMsT0FBRDthQUNkLGtCQUFBLENBQW1CLE9BQW5CO0lBRGM7O0lBR2hCLGNBQUMsQ0FBQSxhQUFELEdBQWdCLFNBQUMsT0FBRDthQUNkLGtCQUFBLENBQW1CLE9BQW5CO0lBRGM7O0lBR2hCLGNBQUMsQ0FBQSxJQUFELEdBQU8sU0FBQyxlQUFELEVBQWtCLFFBQWxCO2FBQ0wsT0FBQSxDQUFRLGVBQVIsRUFBeUIsUUFBekI7SUFESzs7Ozs7QUFwQlQiLCJzb3VyY2VzQ29udGVudCI6WyJyZXF1ZXN0ID0gcmVxdWlyZSAncmVxdWVzdCdcblxubW9kdWxlLmV4cG9ydHMgPVxuY2xhc3MgUmVzdENsaWVudEh0dHBcbiAgQE1FVEhPRFM6IFtcbiAgICAnZ2V0JyxcbiAgICAncG9zdCcsXG4gICAgJ3B1dCcsXG4gICAgJ3BhdGNoJyxcbiAgICAnZGVsZXRlJyxcbiAgICAnaGVhZCcsXG4gICAgJ29wdGlvbnMnXG4gIF1cblxuICBAZW5jb2RlUGF5bG9hZDogKHBheWxvYWQpIC0+XG4gICAgZW5jb2RlVVJJQ29tcG9uZW50KHBheWxvYWQpXG5cbiAgQGRlY29kZVBheWxvYWQ6IChwYXlsb2FkKSAtPlxuICAgIGRlY29kZVVSSUNvbXBvbmVudChwYXlsb2FkKVxuXG4gIEBzZW5kOiAocmVxdWVzdF9vcHRpb25zLCBjYWxsYmFjaykgLT5cbiAgICByZXF1ZXN0KHJlcXVlc3Rfb3B0aW9ucywgY2FsbGJhY2spXG4iXX0=
