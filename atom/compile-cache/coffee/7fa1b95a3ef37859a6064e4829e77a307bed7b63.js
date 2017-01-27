(function() {
  var RestClientResponse, TAB_JSON_SPACES;

  TAB_JSON_SPACES = 4;

  module.exports = RestClientResponse = (function() {
    RestClientResponse.DEFAULT_RESPONSE = 'No data yet...';

    function RestClientResponse(body) {
      this.body = body;
    }

    RestClientResponse.prototype.isJson = function() {
      var error;
      try {
        JSON.parse(this.body);
        return true;
      } catch (error1) {
        error = error1;
        return false;
      }
    };

    RestClientResponse.prototype.getFormatted = function() {
      if (this.isJson(this.body)) {
        return JSON.stringify(JSON.parse(this.body), void 0, TAB_JSON_SPACES);
      } else {
        return this.body;
      }
    };

    return RestClientResponse;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvZGRld2V5Ly5hdG9tL3BhY2thZ2VzL3Jlc3QtY2xpZW50L2xpYi9yZXN0LWNsaWVudC1yZXNwb25zZS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLGVBQUEsR0FBa0I7O0VBRWxCLE1BQU0sQ0FBQyxPQUFQLEdBQ007SUFDSixrQkFBQyxDQUFBLGdCQUFELEdBQW9COztJQUVQLDRCQUFDLElBQUQ7TUFDWCxJQUFDLENBQUEsSUFBRCxHQUFRO0lBREc7O2lDQUdiLE1BQUEsR0FBUSxTQUFBO0FBQ04sVUFBQTtBQUFBO1FBQ0UsSUFBSSxDQUFDLEtBQUwsQ0FBVyxJQUFDLENBQUEsSUFBWjtlQUNBLEtBRkY7T0FBQSxjQUFBO1FBR007ZUFDSixNQUpGOztJQURNOztpQ0FPUixZQUFBLEdBQWMsU0FBQTtNQUNaLElBQUcsSUFBQyxDQUFBLE1BQUQsQ0FBUSxJQUFDLENBQUEsSUFBVCxDQUFIO2VBQ0UsSUFBSSxDQUFDLFNBQUwsQ0FBZSxJQUFJLENBQUMsS0FBTCxDQUFXLElBQUMsQ0FBQSxJQUFaLENBQWYsRUFBa0MsTUFBbEMsRUFBNkMsZUFBN0MsRUFERjtPQUFBLE1BQUE7ZUFHRSxJQUFDLENBQUEsS0FISDs7SUFEWTs7Ozs7QUFoQmhCIiwic291cmNlc0NvbnRlbnQiOlsiVEFCX0pTT05fU1BBQ0VTID0gNFxuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBSZXN0Q2xpZW50UmVzcG9uc2VcbiAgQERFRkFVTFRfUkVTUE9OU0UgPSAnTm8gZGF0YSB5ZXQuLi4nXG5cbiAgY29uc3RydWN0b3I6IChib2R5KSAtPlxuICAgIEBib2R5ID0gYm9keVxuXG4gIGlzSnNvbjogLT5cbiAgICB0cnlcbiAgICAgIEpTT04ucGFyc2UoQGJvZHkpXG4gICAgICB0cnVlXG4gICAgY2F0Y2ggZXJyb3JcbiAgICAgIGZhbHNlXG5cbiAgZ2V0Rm9ybWF0dGVkOiAtPlxuICAgIGlmIEBpc0pzb24oQGJvZHkpXG4gICAgICBKU09OLnN0cmluZ2lmeShKU09OLnBhcnNlKEBib2R5KSwgdW5kZWZpbmVkLCBUQUJfSlNPTl9TUEFDRVMpXG4gICAgZWxzZVxuICAgICAgQGJvZHlcbiJdfQ==
