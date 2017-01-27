(function() {
  var RestClientPersist, fs,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  fs = require('fs');

  module.exports = RestClientPersist = (function() {
    RestClientPersist.prototype.REQUEST_FILE_LIMIT = 100;

    RestClientPersist.prototype.requests = [];

    RestClientPersist.prototype.requestFileLimit = RestClientPersist.REQUEST_FILE_LIMIT;

    function RestClientPersist(path) {
      this.save = bind(this.save, this);
      this.path = path;
      this.initPath();
    }

    RestClientPersist.prototype.load = function(callback) {
      return fs.readFile(this.path, callback);
    };

    RestClientPersist.prototype.save = function(request) {
      this.requests.unshift(request);
      this.requests = this.requests.slice(0, this.REQUESTS_LIMIT);
      return this.saveFile();
    };

    RestClientPersist.prototype.initPath = function() {
      var stat, statErr;
      try {
        stat = fs.lstatSync(this.path);
        if (!stat.isFile()) {
          return this.saveFile();
        }
      } catch (error) {
        statErr = error;
        return this.saveFile();
      }
    };

    RestClientPersist.prototype.saveFile = function() {
      var requestsToBeSaved;
      requestsToBeSaved = this.get(this.requestFileLimit);
      return fs.writeFileSync("" + this.path, JSON.stringify(requestsToBeSaved));
    };

    RestClientPersist.prototype.update = function(requests) {
      return this.requests = requests;
    };

    RestClientPersist.prototype.get = function(limit) {
      if (limit == null) {
        limit = false;
      }
      if (limit) {
        return this.requests.slice(0, limit);
      }
      return this.requests;
    };

    RestClientPersist.prototype.remove = function(removed_request) {
      var i, index, len, ref, request, results;
      ref = this.requests;
      results = [];
      for (index = i = 0, len = ref.length; i < len; index = ++i) {
        request = ref[index];
        if (this.requestEquals(removed_request, request)) {
          this.requests.splice(index, 1);
          this.saveFile();
          break;
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    RestClientPersist.prototype.requestEquals = function(request1, request2) {
      return request1.url === request2.url && request1.method === request2.method;
    };

    RestClientPersist.prototype.getRequestFileLimit = function() {
      return this.requestFileLimit;
    };

    RestClientPersist.prototype.setRequestFileLimit = function(limit) {
      return this.requestFileLimit = limit;
    };

    RestClientPersist.prototype.clear = function() {
      this.requests = [];
      return this.saveFile();
    };

    return RestClientPersist;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvZGRld2V5Ly5hdG9tL3BhY2thZ2VzL3Jlc3QtY2xpZW50L2xpYi9yZXN0LWNsaWVudC1wZXJzaXN0LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEscUJBQUE7SUFBQTs7RUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVI7O0VBRUwsTUFBTSxDQUFDLE9BQVAsR0FDTTtnQ0FDSixrQkFBQSxHQUFvQjs7Z0NBQ3BCLFFBQUEsR0FBVTs7Z0NBQ1YsZ0JBQUEsR0FBa0IsaUJBQUMsQ0FBQTs7SUFFTiwyQkFBQyxJQUFEOztNQUNYLElBQUMsQ0FBQSxJQUFELEdBQVE7TUFDUixJQUFDLENBQUEsUUFBRCxDQUFBO0lBRlc7O2dDQUliLElBQUEsR0FBTSxTQUFDLFFBQUQ7YUFDSixFQUFFLENBQUMsUUFBSCxDQUFZLElBQUMsQ0FBQSxJQUFiLEVBQW1CLFFBQW5CO0lBREk7O2dDQUdOLElBQUEsR0FBTSxTQUFDLE9BQUQ7TUFDSixJQUFDLENBQUEsUUFBUSxDQUFDLE9BQVYsQ0FBa0IsT0FBbEI7TUFDQSxJQUFDLENBQUEsUUFBRCxHQUFZLElBQUMsQ0FBQSxRQUFRLENBQUMsS0FBVixDQUFnQixDQUFoQixFQUFtQixJQUFDLENBQUEsY0FBcEI7YUFDWixJQUFDLENBQUEsUUFBRCxDQUFBO0lBSEk7O2dDQUtOLFFBQUEsR0FBVSxTQUFBO0FBQ1IsVUFBQTtBQUFBO1FBQ0UsSUFBQSxHQUFPLEVBQUUsQ0FBQyxTQUFILENBQWEsSUFBQyxDQUFBLElBQWQ7UUFDUCxJQUFHLENBQUMsSUFBSSxDQUFDLE1BQUwsQ0FBQSxDQUFKO2lCQUNFLElBQUMsQ0FBQSxRQUFELENBQUEsRUFERjtTQUZGO09BQUEsYUFBQTtRQUlNO2VBQ0YsSUFBQyxDQUFBLFFBQUQsQ0FBQSxFQUxKOztJQURROztnQ0FRVixRQUFBLEdBQVUsU0FBQTtBQUNSLFVBQUE7TUFBQSxpQkFBQSxHQUFvQixJQUFDLENBQUEsR0FBRCxDQUFLLElBQUMsQ0FBQSxnQkFBTjthQUNwQixFQUFFLENBQUMsYUFBSCxDQUNFLEVBQUEsR0FBRyxJQUFDLENBQUEsSUFETixFQUVFLElBQUksQ0FBQyxTQUFMLENBQWUsaUJBQWYsQ0FGRjtJQUZROztnQ0FNVixNQUFBLEdBQVEsU0FBQyxRQUFEO2FBQ04sSUFBQyxDQUFBLFFBQUQsR0FBWTtJQUROOztnQ0FHUixHQUFBLEdBQUssU0FBQyxLQUFEOztRQUFDLFFBQVE7O01BQ1osSUFBRyxLQUFIO0FBQ0UsZUFBTyxJQUFDLENBQUEsUUFBUSxDQUFDLEtBQVYsQ0FBZ0IsQ0FBaEIsRUFBbUIsS0FBbkIsRUFEVDs7YUFHQSxJQUFDLENBQUE7SUFKRTs7Z0NBTUwsTUFBQSxHQUFRLFNBQUMsZUFBRDtBQUNOLFVBQUE7QUFBQTtBQUFBO1dBQUEscURBQUE7O1FBQ0UsSUFBRyxJQUFDLENBQUEsYUFBRCxDQUFlLGVBQWYsRUFBZ0MsT0FBaEMsQ0FBSDtVQUNFLElBQUMsQ0FBQSxRQUFRLENBQUMsTUFBVixDQUFpQixLQUFqQixFQUF3QixDQUF4QjtVQUNBLElBQUMsQ0FBQSxRQUFELENBQUE7QUFDQSxnQkFIRjtTQUFBLE1BQUE7K0JBQUE7O0FBREY7O0lBRE07O2dDQU9SLGFBQUEsR0FBZSxTQUFDLFFBQUQsRUFBVyxRQUFYO0FBQ1gsYUFBUSxRQUFRLENBQUMsR0FBVCxLQUFnQixRQUFRLENBQUMsR0FBekIsSUFDQSxRQUFRLENBQUMsTUFBVCxLQUFtQixRQUFRLENBQUM7SUFGekI7O2dDQUlmLG1CQUFBLEdBQXFCLFNBQUE7QUFDbkIsYUFBTyxJQUFDLENBQUE7SUFEVzs7Z0NBR3JCLG1CQUFBLEdBQXFCLFNBQUMsS0FBRDthQUNuQixJQUFDLENBQUEsZ0JBQUQsR0FBb0I7SUFERDs7Z0NBR3JCLEtBQUEsR0FBTyxTQUFBO01BQ0wsSUFBQyxDQUFBLFFBQUQsR0FBWTthQUNaLElBQUMsQ0FBQSxRQUFELENBQUE7SUFGSzs7Ozs7QUE1RFQiLCJzb3VyY2VzQ29udGVudCI6WyJmcyA9IHJlcXVpcmUgJ2ZzJ1xuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBSZXN0Q2xpZW50UGVyc2lzdFxuICBSRVFVRVNUX0ZJTEVfTElNSVQ6IDEwMFxuICByZXF1ZXN0czogW11cbiAgcmVxdWVzdEZpbGVMaW1pdDogQFJFUVVFU1RfRklMRV9MSU1JVFxuXG4gIGNvbnN0cnVjdG9yOiAocGF0aCkgLT5cbiAgICBAcGF0aCA9IHBhdGhcbiAgICBAaW5pdFBhdGgoKVxuXG4gIGxvYWQ6IChjYWxsYmFjaykgLT5cbiAgICBmcy5yZWFkRmlsZShAcGF0aCwgY2FsbGJhY2spXG5cbiAgc2F2ZTogKHJlcXVlc3QpID0+XG4gICAgQHJlcXVlc3RzLnVuc2hpZnQocmVxdWVzdClcbiAgICBAcmVxdWVzdHMgPSBAcmVxdWVzdHMuc2xpY2UoMCwgQFJFUVVFU1RTX0xJTUlUKVxuICAgIEBzYXZlRmlsZSgpXG5cbiAgaW5pdFBhdGg6IC0+XG4gICAgdHJ5XG4gICAgICBzdGF0ID0gZnMubHN0YXRTeW5jKEBwYXRoKVxuICAgICAgaWYgIXN0YXQuaXNGaWxlKClcbiAgICAgICAgQHNhdmVGaWxlKClcbiAgICBjYXRjaCBzdGF0RXJyXG4gICAgICAgIEBzYXZlRmlsZSgpXG5cbiAgc2F2ZUZpbGU6IC0+XG4gICAgcmVxdWVzdHNUb0JlU2F2ZWQgPSBAZ2V0KEByZXF1ZXN0RmlsZUxpbWl0KVxuICAgIGZzLndyaXRlRmlsZVN5bmMoXG4gICAgICBcIiN7QHBhdGh9XCIsXG4gICAgICBKU09OLnN0cmluZ2lmeShyZXF1ZXN0c1RvQmVTYXZlZCkpXG5cbiAgdXBkYXRlOiAocmVxdWVzdHMpIC0+XG4gICAgQHJlcXVlc3RzID0gcmVxdWVzdHNcblxuICBnZXQ6IChsaW1pdCA9IGZhbHNlKSAtPlxuICAgIGlmIGxpbWl0XG4gICAgICByZXR1cm4gQHJlcXVlc3RzLnNsaWNlKDAsIGxpbWl0KVxuXG4gICAgQHJlcXVlc3RzXG5cbiAgcmVtb3ZlOiAocmVtb3ZlZF9yZXF1ZXN0KSAtPlxuICAgIGZvciByZXF1ZXN0LCBpbmRleCBpbiBAcmVxdWVzdHNcbiAgICAgIGlmIEByZXF1ZXN0RXF1YWxzKHJlbW92ZWRfcmVxdWVzdCwgcmVxdWVzdClcbiAgICAgICAgQHJlcXVlc3RzLnNwbGljZShpbmRleCwgMSlcbiAgICAgICAgQHNhdmVGaWxlKClcbiAgICAgICAgYnJlYWtcblxuICByZXF1ZXN0RXF1YWxzOiAocmVxdWVzdDEsIHJlcXVlc3QyKSAtPlxuICAgICAgcmV0dXJuIChyZXF1ZXN0MS51cmwgPT0gcmVxdWVzdDIudXJsIGFuZFxuICAgICAgICAgICAgICByZXF1ZXN0MS5tZXRob2QgPT0gcmVxdWVzdDIubWV0aG9kKVxuICBcbiAgZ2V0UmVxdWVzdEZpbGVMaW1pdDogKCkgLT5cbiAgICByZXR1cm4gQHJlcXVlc3RGaWxlTGltaXRcblxuICBzZXRSZXF1ZXN0RmlsZUxpbWl0OiAobGltaXQpIC0+XG4gICAgQHJlcXVlc3RGaWxlTGltaXQgPSBsaW1pdFxuXG4gIGNsZWFyOiAtPlxuICAgIEByZXF1ZXN0cyA9IFtdXG4gICAgQHNhdmVGaWxlKClcbiJdfQ==
