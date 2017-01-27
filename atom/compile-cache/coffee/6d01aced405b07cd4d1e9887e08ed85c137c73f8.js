(function() {
  var $, DEFAULT_NORESPONSE, DEFAULT_REQUESTS_LIMIT, ENTER_KEY, Emitter, PACKAGE_PATH, PAYLOAD_JSON_ERROR_MESSAGE, RECENT_REQUESTS_ERROR_MESSAGE, RECENT_REQUESTS_FILE_LIMIT, RestClientEditor, RestClientEvent, RestClientHttp, RestClientPersist, RestClientResponse, RestClientView, SAVED_REQUESTS_ERROR_MESSAGE, ScrollView, current_method, mime, nameOf, querystring, recent_requests, ref, response, rest_form, saved_requests,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  ref = require('atom-space-pen-views'), $ = ref.$, ScrollView = ref.ScrollView;

  Emitter = require('atom').Emitter;

  querystring = require('querystring');

  mime = require('mime-types');

  RestClientResponse = require('./rest-client-response');

  RestClientEditor = require('./rest-client-editor');

  RestClientHttp = require('./rest-client-http');

  RestClientEvent = require('./rest-client-event');

  RestClientPersist = require('./rest-client-persist');

  PACKAGE_PATH = atom.packages.resolvePackagePath('rest-client');

  ENTER_KEY = 13;

  DEFAULT_NORESPONSE = 'NO RESPONSE';

  DEFAULT_REQUESTS_LIMIT = 10;

  RECENT_REQUESTS_FILE_LIMIT = 5;

  current_method = 'GET';

  PAYLOAD_JSON_ERROR_MESSAGE = 'The json payload is not valid';

  RECENT_REQUESTS_ERROR_MESSAGE = 'Recent requests couldn\'t be loaded';

  SAVED_REQUESTS_ERROR_MESSAGE = 'Saved requests couldn\'t be loaded';

  response = '';

  rest_form = {
    url: '.rest-client-url',
    method: '.rest-client-method',
    method_other_field: '.rest-client-method-other-field',
    headers: '.rest-client-headers',
    payload: '.rest-client-payload',
    encode_payload: '.rest-client-encodepayload',
    decode_payload: '.rest-client-decodepayload',
    clear_btn: '.rest-client-clear',
    send_btn: '.rest-client-send',
    save_btn: '.rest-client-save',
    result: '.rest-client-result',
    result_headers: '.rest-client-result-headers',
    result_link: '.rest-client-result-link',
    result_headers_link: '.rest-client-result-headers-link',
    status: '.rest-client-status',
    strict_ssl: '.rest-client-strict-ssl',
    proxy_server: '.rest-client-proxy-server',
    open_in_editor: '.rest-client-open-in-editor',
    loading: '.rest-client-loading-icon',
    request_link: '.rest-client-request-link',
    request_link_remove: '.rest-client-request-link-remove'
  };

  recent_requests = {
    block: '#rest-client-recent',
    button: '#rest-client-recent-toggle',
    list: '#rest-client-recent-requests'
  };

  saved_requests = {
    block: '#rest-client-saved',
    button: '#rest-client-saved-toggle',
    list: '#rest-client-saved-requests'
  };

  nameOf = function(selector) {
    return selector.slice(1);
  };

  module.exports = RestClientView = (function(superClass) {
    extend(RestClientView, superClass);

    function RestClientView() {
      this.setLastResponse = bind(this.setLastResponse, this);
      this.setLastRequest = bind(this.setLastRequest, this);
      this.addRecentRequestItem = bind(this.addRecentRequestItem, this);
      this.addRequestItem = bind(this.addRequestItem, this);
      this.loadSavedRequestsInView = bind(this.loadSavedRequestsInView, this);
      this.loadRecentRequestsInView = bind(this.loadRecentRequestsInView, this);
      this.loadRequest = bind(this.loadRequest, this);
      this.showErrorResponse = bind(this.showErrorResponse, this);
      this.showSuccessfulResponse = bind(this.showSuccessfulResponse, this);
      this.onResponse = bind(this.onResponse, this);
      this.removeSavedRequest = bind(this.removeSavedRequest, this);
      return RestClientView.__super__.constructor.apply(this, arguments);
    }

    RestClientView.content = function() {
      return this.div({
        "class": 'rest-client native-key-bindings padded pane-item',
        tabindex: -1
      }, (function(_this) {
        return function() {
          _this.div({
            "class": 'rest-client-url-container'
          }, function() {
            _this.div({
              "class": 'block rest-client-action-btns'
            }, function() {
              return _this.div({
                "class": 'block'
              }, function() {
                return _this.div({
                  "class": 'btn-group btn-group-lg'
                }, function() {
                  _this.button({
                    "class": "btn btn-lg " + (nameOf(rest_form.save_btn))
                  }, 'Save');
                  _this.button({
                    "class": "btn btn-lg " + (nameOf(rest_form.clear_btn))
                  }, 'Clear');
                  return _this.button({
                    "class": "btn btn-lg " + (nameOf(rest_form.send_btn))
                  }, 'Send');
                });
              });
            });
            _this.input({
              type: 'text',
              "class": "field " + (nameOf(rest_form.url)),
              autofocus: 'true'
            });
            _this.div({
              "class": 'btn-group btn-group-sm'
            }, function() {
              var i, len, method, ref1, results;
              ref1 = RestClientHttp.METHODS;
              results = [];
              for (i = 0, len = ref1.length; i < len; i++) {
                method = ref1[i];
                if (method === 'get') {
                  results.push(_this.button({
                    "class": "btn selected " + (nameOf(rest_form.method)) + "-" + method
                  }, method.toUpperCase()));
                } else {
                  results.push(_this.button({
                    "class": "btn " + (nameOf(rest_form.method)) + "-" + method
                  }, method.toUpperCase()));
                }
              }
              return results;
            });
            _this.div({
              id: "" + (nameOf(recent_requests.block))
            }, function() {
              _this.button({
                id: "" + (nameOf(recent_requests.button)),
                "class": "btn"
              }, 'Recent requests');
              return _this.ul({
                id: "" + (nameOf(recent_requests.list)),
                style: 'display: none;'
              });
            });
            _this.div({
              id: "" + (nameOf(saved_requests.block))
            }, function() {
              _this.button({
                id: "" + (nameOf(saved_requests.button)),
                "class": "btn"
              }, 'Saved requests');
              return _this.ul({
                id: "" + (nameOf(saved_requests.list)),
                style: 'display: none;'
              });
            });
            _this.div({
              "class": 'rest-client-headers-container'
            }, function() {
              _this.div({
                "class": 'rest-client-header rest-client-headers-header'
              }, function() {
                return _this.h5({
                  "class": 'header-expanded'
                }, 'Headers');
              });
              return _this.div({
                "class": 'rest-client-headers-body'
              }, function() {
                _this.div({
                  "class": 'btn-group btn-group-lg'
                }, function() {
                  return _this.button({
                    "class": 'btn selected'
                  }, 'Raw');
                });
                _this.textarea({
                  "class": "field " + (nameOf(rest_form.headers)),
                  rows: 7
                });
                _this.strong('Strict SSL');
                _this.input({
                  type: 'checkbox',
                  "class": "field " + (nameOf(rest_form.strict_ssl)),
                  checked: true
                });
                _this.strong(null, "Proxy server");
                return _this.input({
                  type: 'text',
                  "class": "field " + (nameOf(rest_form.proxy_server))
                });
              });
            });
            return _this.div({
              "class": 'rest-client-payload-container'
            }, function() {
              _this.div({
                "class": 'rest-client-header rest-client-payload-header'
              }, function() {
                return _this.h5({
                  "class": 'header-expanded'
                }, 'Payload');
              });
              return _this.div({
                "class": 'rest-client-payload-body'
              }, function() {
                _this.div({
                  "class": "text-info lnk float-right " + (nameOf(rest_form.decode_payload))
                }, 'Decode payload ');
                _this.div({
                  "class": "buffer float-right"
                }, '|');
                _this.div({
                  "class": "text-info lnk float-right " + (nameOf(rest_form.encode_payload))
                }, 'Encode payload');
                _this.div({
                  "class": 'btn-group btn-group-lg'
                }, function() {
                  return _this.button({
                    "class": 'btn selected'
                  }, 'Raw');
                });
                return _this.textarea({
                  "class": "field " + (nameOf(rest_form.payload)),
                  rows: 7
                });
              });
            });
          });
          return _this.div({
            "class": 'rest-client-result-container padded'
          }, function() {
            _this.a({
              "class": "" + (nameOf(rest_form.result_link))
            }, 'Result');
            _this.span(' | ');
            _this.a({
              "class": "" + (nameOf(rest_form.result_headers_link))
            }, 'Headers');
            _this.span(' | ');
            _this.span({
              "class": "" + (nameOf(rest_form.status))
            });
            _this.span({
              "class": "text-info lnk " + (nameOf(rest_form.open_in_editor))
            }, 'Open in separate editor');
            _this.span({
              "class": (nameOf(rest_form.loading)) + " loading loading-spinner-small inline-block",
              style: 'display: none;'
            });
            _this.pre({
              "class": "" + (nameOf(rest_form.result_headers))
            }, "");
            return _this.pre({
              "class": "" + (nameOf(rest_form.result))
            }, "" + RestClientResponse.DEFAULT_RESPONSE);
          });
        };
      })(this));
    };

    RestClientView.prototype.initialize = function() {
      this.COLLECTIONS_PATH = PACKAGE_PATH + "/collections.json";
      this.RECENT_REQUESTS_PATH = PACKAGE_PATH + "/recent.json";
      this.lastRequest = null;
      this.lastResponse = null;
      this.recentRequests = new RestClientPersist(this.RECENT_REQUESTS_PATH);
      this.recentRequests.setRequestFileLimit(RECENT_REQUESTS_FILE_LIMIT);
      this.savedRequests = new RestClientPersist(this.COLLECTIONS_PATH);
      this.emitter = new Emitter;
      this.subscribeToEvents();
      this.recentRequests.load(this.loadRecentRequestsInView);
      return this.savedRequests.load(this.loadSavedRequestsInView);
    };

    RestClientView.prototype.subscribeToEvents = function() {
      var i, len, method, ref1;
      this.emitter.on(RestClientEvent.NEW_REQUEST, this.recentRequests.save);
      this.emitter.on(RestClientEvent.NEW_REQUEST, this.addRecentRequestItem);
      this.emitter.on(RestClientEvent.NEW_REQUEST, this.showLoading);
      this.emitter.on(RestClientEvent.NEW_REQUEST, this.setLastRequest);
      this.emitter.on(RestClientEvent.REQUEST_FINISHED, this.hideLoading);
      ref1 = RestClientHttp.METHODS;
      for (i = 0, len = ref1.length; i < len; i++) {
        method = ref1[i];
        this.on('click', rest_form.method + "-" + method, function() {
          var $this;
          $this = $(this);
          $this.siblings().removeClass('selected');
          $this.addClass('selected');
          return current_method = $this.html();
        });
      }
      this.on('click', rest_form.clear_btn, (function(_this) {
        return function() {
          return _this.clearForm();
        };
      })(this));
      this.on('click', rest_form.send_btn, (function(_this) {
        return function() {
          return _this.sendRequest();
        };
      })(this));
      this.on('click', rest_form.save_btn, (function(_this) {
        return function() {
          return _this.saveRequest();
        };
      })(this));
      this.on('click', rest_form.encode_payload, (function(_this) {
        return function() {
          return _this.encodePayload();
        };
      })(this));
      this.on('click', rest_form.decode_payload, (function(_this) {
        return function() {
          return _this.decodePayload();
        };
      })(this));
      this.on('click', rest_form.open_in_editor, (function(_this) {
        return function() {
          return _this.openInEditor();
        };
      })(this));
      this.on('keypress', rest_form.url, (function(_this) {
        return function() {
          if (event.keyCode === ENTER_KEY) {
            _this.sendRequest();
          }
        };
      })(this));
      this.on('click', recent_requests.button, (function(_this) {
        return function() {
          return _this.toggleRequests(recent_requests);
        };
      })(this));
      this.on('click', saved_requests.button, (function(_this) {
        return function() {
          return _this.toggleRequests(saved_requests);
        };
      })(this));
      this.on('click', rest_form.result_link, (function(_this) {
        return function() {
          return _this.toggleResult(rest_form.result);
        };
      })(this));
      this.on('click', rest_form.result_headers_link, (function(_this) {
        return function() {
          return _this.toggleResult(rest_form.result_headers);
        };
      })(this));
      $('body').on('click', rest_form.request_link, this.loadRequest);
      $('body').on('click', rest_form.request_link_remove, this.removeSavedRequest);
      this.on('click', '.rest-client-headers-header', (function(_this) {
        return function() {
          return _this.toggleBody('.rest-client-headers-header > h5', '.rest-client-headers-body');
        };
      })(this));
      return this.on('click', '.rest-client-payload-header', (function(_this) {
        return function() {
          return _this.toggleBody('.rest-client-payload-header > h5', '.rest-client-payload-body');
        };
      })(this));
    };

    RestClientView.prototype.toggleBody = function(header, body) {
      var c, i, len, ref1;
      ref1 = ['header-expanded', 'header-collapsed'];
      for (i = 0, len = ref1.length; i < len; i++) {
        c = ref1[i];
        $(header).toggleClass(c);
      }
      return $(body).slideToggle('fast');
    };

    RestClientView.prototype.openInEditor = function() {
      var editor, textResult;
      textResult = $(rest_form.result).text();
      editor = new RestClientEditor(textResult, this.constructFileName());
      return editor.open();
    };

    RestClientView.prototype.constructFileName = function() {
      var extension;
      extension = mime.extension(this.lastResponse.headers['content-type']);
      return this.lastRequest.method + " " + this.lastRequest.url + (extension ? '.' + extension : void 0);
    };

    RestClientView.prototype.encodePayload = function() {
      return $(rest_form.payload).val(RestClientHttp.encodePayload($(rest_form.payload).val()));
    };

    RestClientView.prototype.decodePayload = function() {
      return $(rest_form.payload).val(RestClientHttp.decodePayload($(rest_form.payload).val()));
    };

    RestClientView.prototype.clearForm = function() {
      this.hideLoading();
      this.setDefaultValues();
      return $(rest_form.result).show();
    };

    RestClientView.prototype.setDefaultValues = function() {
      $(rest_form.url).val('');
      $(rest_form.headers).val('');
      $(rest_form.payload).val('');
      $(rest_form.status).val('');
      return $(rest_form.result).text(RestClientResponse.DEFAULT_RESPONSE);
    };

    RestClientView.prototype.getHeaders = function() {
      var current_header, custom_header, custom_headers, headers, i, len;
      headers = {};
      custom_headers = $(rest_form.headers).val().split('\n');
      for (i = 0, len = custom_headers.length; i < len; i++) {
        custom_header = custom_headers[i];
        current_header = custom_header.trim().split(':');
        if (current_header.length > 1) {
          headers[current_header[0]] = current_header[1].trim();
        }
      }
      return headers;
    };

    RestClientView.prototype.sendRequest = function() {
      var error, request_options;
      request_options = {};
      try {
        request_options = this.getRequestOptions();
      } catch (error1) {
        error = error1;
        atom.notifications.addError(PAYLOAD_JSON_ERROR_MESSAGE);
        return;
      }
      if (request_options.url) {
        this.emitter.emit(RestClientEvent.NEW_REQUEST, request_options);
        return RestClientHttp.send(request_options, this.onResponse);
      }
    };

    RestClientView.prototype.saveRequest = function() {
      if (this.lastRequest != null) {
        this.savedRequests.save(this.lastRequest);
        return this.addRequestItem(saved_requests.list, this.lastRequest);
      }
    };

    RestClientView.prototype.removeSavedRequest = function(e) {
      var $target, request;
      $target = $(e.currentTarget);
      request = $target.siblings(rest_form.request_link).data('request');
      this.savedRequests.remove(request);
      return $target.parent().remove();
    };

    RestClientView.prototype.getRequestOptions = function() {
      var options;
      return options = {
        url: $(rest_form.url).val(),
        headers: this.getHeaders(),
        method: current_method,
        strictSSL: $(rest_form.strict_ssl).is(':checked'),
        proxy: $(rest_form.proxy_server).val(),
        body: this.getRequestBody()
      };
    };

    RestClientView.prototype.onResponse = function(error, response, body) {
      var headers, result, statusMessage;
      this.setLastResponse(response);
      if (!error) {
        statusMessage = response.statusCode + " " + response.statusMessage;
        switch (response.statusCode) {
          case 200:
          case 201:
          case 204:
            this.showSuccessfulResponse(statusMessage);
            break;
          default:
            this.showErrorResponse(statusMessage);
        }
        headers = this.getHeadersAsString(response.headers);
        response = new RestClientResponse(body).getFormatted();
        result = response;
      } else {
        this.showErrorResponse(DEFAULT_NORESPONSE);
        result = error;
      }
      $(rest_form.result).text(result);
      $(rest_form.result_headers).text(headers).hide();
      return this.emitter.emit(RestClientEvent.REQUEST_FINISHED, response);
    };

    RestClientView.prototype.getRequestBody = function() {
      var body, content_type, payload;
      payload = $(rest_form.payload).val();
      body = "";
      content_type = this.getContentType();
      if (payload) {
        switch (content_type) {
          case "application/json":
            body = JSON.stringify(JSON.parse(payload));
            break;
          default:
            body = payload;
        }
      }
      return body;
    };

    RestClientView.prototype.getContentType = function() {
      var headers;
      headers = this.getHeaders();
      return headers['Content-Type'] || headers['content-type'];
    };

    RestClientView.prototype.showSuccessfulResponse = function(text) {
      return $(rest_form.status).removeClass('text-error').addClass('text-success').text(text);
    };

    RestClientView.prototype.showErrorResponse = function(text) {
      return $(rest_form.status).removeClass('text-success').addClass('text-error').text(text);
    };

    RestClientView.prototype.loadRequest = function(e) {
      var request;
      request = $(e.currentTarget).data('request');
      return this.fillInRequest(request);
    };

    RestClientView.prototype.loadRecentRequestsInView = function(err, requests) {
      if (err) {
        atom.notifications.addError(RECENT_REQUESTS_ERROR_MESSAGE);
        return;
      }
      this.recentRequests.update(JSON.parse(requests));
      return this.addRequestsInView(recent_requests.list, this.recentRequests.get());
    };

    RestClientView.prototype.loadSavedRequestsInView = function(err, requests) {
      if (err) {
        atom.notifications.addError(SAVED_REQUESTS_ERROR_MESSAGE);
        return;
      }
      this.savedRequests.update(JSON.parse(requests));
      return this.addRequestsInView(saved_requests.list, this.savedRequests.get());
    };

    RestClientView.prototype.toggleRequests = function(target) {
      $(target.list).toggle();
      return $(target.button).toggleClass('selected');
    };

    RestClientView.prototype.toggleResult = function(target) {
      var $target;
      $target = $(target);
      $target.siblings('pre').hide();
      return $target.show();
    };

    RestClientView.prototype.addRequestsInView = function(target, requests) {
      var i, len, request, results;
      if (requests == null) {
        return;
      }
      results = [];
      for (i = 0, len = requests.length; i < len; i++) {
        request = requests[i];
        results.push(this.addRequestItem(target, request));
      }
      return results;
    };

    RestClientView.prototype.addRequestItem = function(target, data) {
      var $li;
      $li = $('<li>');
      $li.append($('<a>').text([data.method, data.url].join(' - ')).attr('href', '#request').addClass(rest_form.request_link.split('.')[1]).attr('data-request', JSON.stringify(data)));
      if (target === saved_requests.list) {
        $li.append($('<a>').html($('<span>').addClass('icon icon-x')).attr('href', '#remove').addClass(rest_form.request_link_remove.split('.')[1]));
      }
      $(target).prepend($li);
      return $(target).children().slice(DEFAULT_REQUESTS_LIMIT).detach();
    };

    RestClientView.prototype.fillInRequest = function(request) {
      $(rest_form.url).val(request.url);
      this.setMethodAsSelected(request.method);
      $(rest_form.payload).val(request.body);
      return $(rest_form.headers).val(this.getHeadersAsString(request.headers));
    };

    RestClientView.prototype.addRecentRequestItem = function(data) {
      return this.addRequestItem(recent_requests.list, data);
    };

    RestClientView.prototype.setLastRequest = function(request) {
      return this.lastRequest = request;
    };

    RestClientView.prototype.setLastResponse = function(response) {
      return this.lastResponse = response;
    };

    RestClientView.prototype.getHeadersAsString = function(headers) {
      var header, output, value;
      output = '';
      for (header in headers) {
        value = headers[header];
        output = output.concat(header + ': ' + value + '\n');
      }
      return output;
    };

    RestClientView.prototype.setMethodAsSelected = function(method) {
      var $method;
      $method = $(rest_form.method + '-' + method.toLowerCase());
      return $method.click();
    };

    RestClientView.prototype.serialize = function() {
      return {
        deserializer: this.constructor.name,
        uri: this.getUri()
      };
    };

    RestClientView.prototype.getUri = function() {
      return this.uri;
    };

    RestClientView.prototype.getTitle = function() {
      return "REST Client";
    };

    RestClientView.prototype.getModel = function() {};

    RestClientView.prototype.showLoading = function() {
      $(rest_form.result).hide();
      return $(rest_form.loading).show();
    };

    RestClientView.prototype.hideLoading = function() {
      $(rest_form.loading).fadeOut();
      return $(rest_form.result).show();
    };

    return RestClientView;

  })(ScrollView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvZGRld2V5Ly5hdG9tL3BhY2thZ2VzL3Jlc3QtY2xpZW50L2xpYi9yZXN0LWNsaWVudC12aWV3LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsZ2FBQUE7SUFBQTs7OztFQUFBLE1BQWtCLE9BQUEsQ0FBUSxzQkFBUixDQUFsQixFQUFDLFNBQUQsRUFBSTs7RUFDSCxVQUFXLE9BQUEsQ0FBUSxNQUFSOztFQUNaLFdBQUEsR0FBYyxPQUFBLENBQVEsYUFBUjs7RUFDZCxJQUFBLEdBQU8sT0FBQSxDQUFRLFlBQVI7O0VBRVAsa0JBQUEsR0FBcUIsT0FBQSxDQUFRLHdCQUFSOztFQUNyQixnQkFBQSxHQUFtQixPQUFBLENBQVEsc0JBQVI7O0VBQ25CLGNBQUEsR0FBaUIsT0FBQSxDQUFRLG9CQUFSOztFQUNqQixlQUFBLEdBQWtCLE9BQUEsQ0FBUSxxQkFBUjs7RUFDbEIsaUJBQUEsR0FBb0IsT0FBQSxDQUFRLHVCQUFSOztFQUVwQixZQUFBLEdBQWUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxrQkFBZCxDQUFpQyxhQUFqQzs7RUFDZixTQUFBLEdBQVk7O0VBQ1osa0JBQUEsR0FBcUI7O0VBQ3JCLHNCQUFBLEdBQXlCOztFQUN6QiwwQkFBQSxHQUE2Qjs7RUFDN0IsY0FBQSxHQUFpQjs7RUFHakIsMEJBQUEsR0FBNkI7O0VBQzdCLDZCQUFBLEdBQWdDOztFQUNoQyw0QkFBQSxHQUErQjs7RUFFL0IsUUFBQSxHQUFXOztFQUVYLFNBQUEsR0FDRTtJQUFBLEdBQUEsRUFBSyxrQkFBTDtJQUNBLE1BQUEsRUFBUSxxQkFEUjtJQUVBLGtCQUFBLEVBQW9CLGlDQUZwQjtJQUdBLE9BQUEsRUFBUyxzQkFIVDtJQUlBLE9BQUEsRUFBUyxzQkFKVDtJQUtBLGNBQUEsRUFBZ0IsNEJBTGhCO0lBTUEsY0FBQSxFQUFnQiw0QkFOaEI7SUFPQSxTQUFBLEVBQVcsb0JBUFg7SUFRQSxRQUFB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QW1CLEdBQW5CLEdBQXlCLE1BQU0sQ0FBQyxXQUFQLENBQUEsQ0FBM0I7YUFDVixPQUFPLENBQUMsS0FBUixDQUFBO0lBRm1COzs2QkFLckIsU0FBQSxHQUFXLFNBQUE7YUFDVDtRQUFBLFlBQUEsRUFBYyxJQUFDLENBQUEsV0FBVyxDQUFDLElBQTNCO1FBQ0EsR0FBQSxFQUFLLElBQUMsQ0FBQSxNQUFELENBQUEsQ0FETDs7SUFEUzs7NkJBSVgsTUFBQSxHQUFRLFNBQUE7YUFBRyxJQUFDLENBQUE7SUFBSjs7NkJBRVIsUUFBQSxHQUFVLFNBQUE7YUFBRztJQUFIOzs2QkFFVixRQUFBLEdBQVUsU0FBQSxHQUFBOzs2QkFHVixXQUFBLEdBQWEsU0FBQTtNQUNYLENBQUEsQ0FBRSxTQUFTLENBQUMsTUFBWixDQUFtQixDQUFDLElBQXBCLENBQUE7YUFDQSxDQUFBLENBQUUsU0FBUyxDQUFDLE9BQVosQ0FBb0IsQ0FBQyxJQUFyQixDQUFBO0lBRlc7OzZCQUliLFdBQUEsR0FBYSxTQUFBO01BQ1gsQ0FBQSxDQUFFLFNBQVMsQ0FBQyxPQUFaLENBQW9CLENBQUMsT0FBckIsQ0FBQTthQUNBLENBQUEsQ0FBRSxTQUFTLENBQUMsTUFBWixDQUFtQixDQUFDLElBQXBCLENBQUE7SUFGVzs7OztLQTlXYztBQTdEN0IiLCJzb3VyY2VzQ29udGVudCI6WyJ7JCwgU2Nyb2xsVmlld30gPSByZXF1aXJlICdhdG9tLXNwYWNlLXBlbi12aWV3cydcbntFbWl0dGVyfSA9IHJlcXVpcmUgJ2F0b20nXG5xdWVyeXN0cmluZyA9IHJlcXVpcmUgJ3F1ZXJ5c3RyaW5nJ1xubWltZSA9IHJlcXVpcmUgJ21pbWUtdHlwZXMnXG5cblJlc3RDbGllbnRSZXNwb25zZSA9IHJlcXVpcmUgJy4vcmVzdC1jbGllbnQtcmVzcG9uc2UnXG5SZXN0Q2xpZW50RWRpdG9yID0gcmVxdWlyZSAnLi9yZXN0LWNsaWVudC1lZGl0b3InXG5SZXN0Q2xpZW50SHR0cCA9IHJlcXVpcmUgJy4vcmVzdC1jbGllbnQtaHR0cCdcblJlc3RDbGllbnRFdmVudCA9IHJlcXVpcmUgJy4vcmVzdC1jbGllbnQtZXZlbnQnXG5SZXN0Q2xpZW50UGVyc2lzdCA9IHJlcXVpcmUgJy4vcmVzdC1jbGllbnQtcGVyc2lzdCdcblxuUEFDS0FHRV9QQVRIID0gYXRvbS5wYWNrYWdlcy5yZXNvbHZlUGFja2FnZVBhdGgoJ3Jlc3QtY2xpZW50JylcbkVOVEVSX0tFWSA9IDEzXG5ERUZBVUxUX05PUkVTUE9OU0UgPSAnTk8gUkVTUE9OU0UnXG5ERUZBVUxUX1JFUVVFU1RTX0xJTUlUID0gMTBcblJFQ0VOVF9SRVFVRVNUU19GSUxFX0xJTUlUID0gNVxuY3VycmVudF9tZXRob2QgPSAnR0VUJ1xuXG4jIEVycm9yIG1lc3NhZ2VzXG5QQVlMT0FEX0pTT05fRVJST1JfTUVTU0FHRSA9ICdUaGUganNvbiBwYXlsb2FkIGlzIG5vdCB2YWxpZCdcblJFQ0VOVF9SRVFVRVNUU19FUlJPUl9NRVNTQUdFID0gJ1JlY2VudCByZXF1ZXN0cyBjb3VsZG5cXCd0IGJlIGxvYWRlZCdcblNBVkVEX1JFUVVFU1RTX0VSUk9SX01FU1NBR0UgPSAnU2F2ZWQgcmVxdWVzdHMgY291bGRuXFwndCBiZSBsb2FkZWQnXG5cbnJlc3BvbnNlID0gJycgIyBnbG9iYWwgb2JqZWN0IGZvciB0aGUgcmVzcG9uc2UuXG5cbnJlc3RfZm9ybSA9XG4gIHVybDogJy5yZXN0LWNsaWVudC11cmwnLFxuICBtZXRob2Q6ICcucmVzdC1jbGllbnQtbWV0aG9kJyxcbiAgbWV0aG9kX290aGVyX2ZpZWxkOiAnLnJlc3QtY2xpZW50LW1ldGhvZC1vdGhlci1maWVsZCcsXG4gIGhlYWRlcnM6ICcucmVzdC1jbGllbnQtaGVhZGVycycsXG4gIHBheWxvYWQ6ICcucmVzdC1jbGllbnQtcGF5bG9hZCcsXG4gIGVuY29kZV9wYXlsb2FkOiAnLnJlc3QtY2xpZW50LWVuY29kZXBheWxvYWQnLFxuICBkZWNvZGVfcGF5bG9hZDogJy5yZXN0LWNsaWVudC1kZWNvZGVwYXlsb2FkJyxcbiAgY2xlYXJfYnRuOiAnLnJlc3QtY2xpZW50LWNsZWFyJyxcbiAgc2VuZF9idG46ICcucmVzdC1jbGllbnQtc2VuZCcsXG4gIHNhdmVfYnRuOiAnLnJlc3QtY2xpZW50LXNhdmUnLFxuICByZXN1bHQ6ICcucmVzdC1jbGllbnQtcmVzdWx0JyxcbiAgcmVzdWx0X2hlYWRlcnM6ICcucmVzdC1jbGllbnQtcmVzdWx0LWhlYWRlcnMnLFxuICByZXN1bHRfbGluazogJy5yZXN0LWNsaWVudC1yZXN1bHQtbGluaycsXG4gIHJlc3VsdF9oZWFkZXJzX2xpbms6ICcucmVzdC1jbGllbnQtcmVzdWx0LWhlYWRlcnMtbGluaycsXG4gIHN0YXR1czogJy5yZXN0LWNsaWVudC1zdGF0dXMnLFxuICBzdHJpY3Rfc3NsOiAnLnJlc3QtY2xpZW50LXN0cmljdC1zc2wnLFxuICBwcm94eV9zZXJ2ZXI6ICcucmVzdC1jbGllbnQtcHJveHktc2VydmVyJyxcbiAgb3Blbl9pbl9lZGl0b3I6ICcucmVzdC1jbGllbnQtb3Blbi1pbi1lZGl0b3InXG4gIGxvYWRpbmc6ICcucmVzdC1jbGllbnQtbG9hZGluZy1pY29uJ1xuICByZXF1ZXN0X2xpbms6ICcucmVzdC1jbGllbnQtcmVxdWVzdC1saW5rJ1xuICByZXF1ZXN0X2xpbmtfcmVtb3ZlOiAnLnJlc3QtY2xpZW50LXJlcXVlc3QtbGluay1yZW1vdmUnXG5cbnJlY2VudF9yZXF1ZXN0cyA9XG4gIGJsb2NrOiAnI3Jlc3QtY2xpZW50LXJlY2VudCdcbiAgYnV0dG9uOiAnI3Jlc3QtY2xpZW50LXJlY2VudC10b2dnbGUnXG4gIGxpc3Q6ICcjcmVzdC1jbGllbnQtcmVjZW50LXJlcXVlc3RzJ1xuXG5zYXZlZF9yZXF1ZXN0cyA9XG4gIGJsb2NrOiAnI3Jlc3QtY2xpZW50LXNhdmVkJ1xuICBidXR0b246ICcjcmVzdC1jbGllbnQtc2F2ZWQtdG9nZ2xlJ1xuICBsaXN0OiAnI3Jlc3QtY2xpZW50LXNhdmVkLXJlcXVlc3RzJ1xuXG5uYW1lT2YgPSAoc2VsZWN0b3IpIC0+IHNlbGVjdG9yLnNsaWNlKDEpXG5cbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIFJlc3RDbGllbnRWaWV3IGV4dGVuZHMgU2Nyb2xsVmlld1xuICBAY29udGVudDogLT5cbiAgICBAZGl2IGNsYXNzOiAncmVzdC1jbGllbnQgbmF0aXZlLWtleS1iaW5kaW5ncyBwYWRkZWQgcGFuZS1pdGVtJywgdGFiaW5kZXg6IC0xLCA9PlxuICAgICAgQGRpdiBjbGFzczogJ3Jlc3QtY2xpZW50LXVybC1jb250YWluZXInLCA9PlxuICAgICAgICAjIENsZWFyIC8gU2VuZFxuICAgICAgICBAZGl2IGNsYXNzOiAnYmxvY2sgcmVzdC1jbGllbnQtYWN0aW9uLWJ0bnMnLCA9PlxuICAgICAgICAgIEBkaXYgY2xhc3M6ICdibG9jaycsID0+XG4gICAgICAgICAgICBAZGl2IGNsYXNzOiAnYnRuLWdyb3VwIGJ0bi1ncm91cC1sZycsID0+XG4gICAgICAgICAgICAgIEBidXR0b24gY2xhc3M6IFwiYnRuIGJ0bi1sZyAje25hbWVPZiByZXN0X2Zvcm0uc2F2ZV9idG59XCIsICdTYXZlJ1xuICAgICAgICAgICAgICBAYnV0dG9uIGNsYXNzOiBcImJ0biBidG4tbGcgI3tuYW1lT2YgcmVzdF9mb3JtLmNsZWFyX2J0bn1cIiwgJ0NsZWFyJ1xuICAgICAgICAgICAgICBAYnV0dG9uIGNsYXNzOiBcImJ0biBidG4tbGcgI3tuYW1lT2YgcmVzdF9mb3JtLnNlbmRfYnRufVwiLCAnU2VuZCdcblxuICAgICAgICBAaW5wdXQgdHlwZTogJ3RleHQnLCBjbGFzczogXCJmaWVsZCAje25hbWVPZiByZXN0X2Zvcm0udXJsfVwiLCBhdXRvZm9jdXM6ICd0cnVlJ1xuXG4gICAgICAgICMgbWV0aG9kc1xuICAgICAgICBAZGl2IGNsYXNzOiAnYnRuLWdyb3VwIGJ0bi1ncm91cC1zbScsID0+XG4gICAgICAgICAgZm9yIG1ldGhvZCBpbiBSZXN0Q2xpZW50SHR0cC5NRVRIT0RTXG4gICAgICAgICAgICBpZiBtZXRob2QgaXMgJ2dldCdcbiAgICAgICAgICAgICAgQGJ1dHRvbiBjbGFzczogXCJidG4gc2VsZWN0ZWQgI3tuYW1lT2YgcmVzdF9mb3JtLm1ldGhvZH0tI3ttZXRob2R9XCIsIG1ldGhvZC50b1VwcGVyQ2FzZSgpXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgIEBidXR0b24gY2xhc3M6IFwiYnRuICN7bmFtZU9mIHJlc3RfZm9ybS5tZXRob2R9LSN7bWV0aG9kfVwiLCBtZXRob2QudG9VcHBlckNhc2UoKVxuXG4gICAgICAgICMgUmVjZW50IHJlcXVlc3RzXG4gICAgICAgIEBkaXYgaWQ6IFwiI3tuYW1lT2YgcmVjZW50X3JlcXVlc3RzLmJsb2NrfVwiLCA9PlxuICAgICAgICAgIEBidXR0b24gaWQ6IFwiI3tuYW1lT2YgcmVjZW50X3JlcXVlc3RzLmJ1dHRvbn1cIiwgY2xhc3M6IFwiYnRuXCIsICdSZWNlbnQgcmVxdWVzdHMnXG4gICAgICAgICAgQHVsIGlkOiBcIiN7bmFtZU9mIHJlY2VudF9yZXF1ZXN0cy5saXN0fVwiLCBzdHlsZTogJ2Rpc3BsYXk6IG5vbmU7J1xuXG4gICAgICAgICMgU2F2ZWQgcmVxdWVzdHNcbiAgICAgICAgQGRpdiBpZDogXCIje25hbWVPZiBzYXZlZF9yZXF1ZXN0cy5ibG9ja31cIiwgPT5cbiAgICAgICAgICBAYnV0dG9uIGlkOiBcIiN7bmFtZU9mIHNhdmVkX3JlcXVlc3RzLmJ1dHRvbn1cIiwgY2xhc3M6IFwiYnRuXCIsICdTYXZlZCByZXF1ZXN0cydcbiAgICAgICAgICBAdWwgaWQ6IFwiI3tuYW1lT2Ygc2F2ZWRfcmVxdWVzdHMubGlzdH1cIiwgc3R5bGU6ICdkaXNwbGF5OiBub25lOydcblxuICAgICAgICAjIEhlYWRlcnNcbiAgICAgICAgQGRpdiBjbGFzczogJ3Jlc3QtY2xpZW50LWhlYWRlcnMtY29udGFpbmVyJywgPT5cbiAgICAgICAgICBAZGl2IGNsYXNzOiAncmVzdC1jbGllbnQtaGVhZGVyIHJlc3QtY2xpZW50LWhlYWRlcnMtaGVhZGVyJywgPT5cbiAgICAgICAgICAgIEBoNSBjbGFzczogJ2hlYWRlci1leHBhbmRlZCcsICdIZWFkZXJzJ1xuXG4gICAgICAgICAgQGRpdiBjbGFzczogJ3Jlc3QtY2xpZW50LWhlYWRlcnMtYm9keScsID0+XG4gICAgICAgICAgICBAZGl2IGNsYXNzOiAnYnRuLWdyb3VwIGJ0bi1ncm91cC1sZycsID0+XG4gICAgICAgICAgICAgIEBidXR0b24gY2xhc3M6ICdidG4gc2VsZWN0ZWQnLCAnUmF3J1xuXG4gICAgICAgICAgICBAdGV4dGFyZWEgY2xhc3M6IFwiZmllbGQgI3tuYW1lT2YgcmVzdF9mb3JtLmhlYWRlcnN9XCIsIHJvd3M6IDdcbiAgICAgICAgICAgIEBzdHJvbmcgJ1N0cmljdCBTU0wnXG4gICAgICAgICAgICBAaW5wdXQgdHlwZTogJ2NoZWNrYm94JywgY2xhc3M6IFwiZmllbGQgI3tuYW1lT2YgcmVzdF9mb3JtLnN0cmljdF9zc2x9XCIsIGNoZWNrZWQ6IHRydWVcblxuICAgICAgICAgICAgQHN0cm9uZyBudWxsLCBcIlByb3h5IHNlcnZlclwiXG4gICAgICAgICAgICBAaW5wdXQgdHlwZTogJ3RleHQnLCBjbGFzczogXCJmaWVsZCAje25hbWVPZiByZXN0X2Zvcm0ucHJveHlfc2VydmVyfVwiXG5cbiAgICAgICAgIyBQYXlsb2FkXG4gICAgICAgIEBkaXYgY2xhc3M6ICdyZXN0LWNsaWVudC1wYXlsb2FkLWNvbnRhaW5lcicsID0+XG4gICAgICAgICAgQGRpdiBjbGFzczogJ3Jlc3QtY2xpZW50LWhlYWRlciByZXN0LWNsaWVudC1wYXlsb2FkLWhlYWRlcicsID0+XG4gICAgICAgICAgICBAaDUgY2xhc3M6ICdoZWFkZXItZXhwYW5kZWQnLCAnUGF5bG9hZCdcblxuICAgICAgICAgIEBkaXYgY2xhc3M6ICdyZXN0LWNsaWVudC1wYXlsb2FkLWJvZHknLCA9PlxuICAgICAgICAgICAgQGRpdiBjbGFzczogXCJ0ZXh0LWluZm8gbG5rIGZsb2F0LXJpZ2h0ICN7bmFtZU9mIHJlc3RfZm9ybS5kZWNvZGVfcGF5bG9hZH1cIiwgJ0RlY29kZSBwYXlsb2FkICdcbiAgICAgICAgICAgIEBkaXYgY2xhc3M6IFwiYnVmZmVyIGZsb2F0LXJpZ2h0XCIsICd8J1xuICAgICAgICAgICAgQGRpdiBjbGFzczogXCJ0ZXh0LWluZm8gbG5rIGZsb2F0LXJpZ2h0ICN7bmFtZU9mIHJlc3RfZm9ybS5lbmNvZGVfcGF5bG9hZH1cIiwgJ0VuY29kZSBwYXlsb2FkJ1xuICAgICAgICAgICAgQGRpdiBjbGFzczogJ2J0bi1ncm91cCBidG4tZ3JvdXAtbGcnLCA9PlxuICAgICAgICAgICAgICBAYnV0dG9uIGNsYXNzOiAnYnRuIHNlbGVjdGVkJywgJ1JhdydcblxuICAgICAgICAgICAgQHRleHRhcmVhIGNsYXNzOiBcImZpZWxkICN7bmFtZU9mIHJlc3RfZm9ybS5wYXlsb2FkfVwiLCByb3dzOiA3XG5cbiAgICAgICMgUmVzdWx0XG4gICAgICBAZGl2IGNsYXNzOiAncmVzdC1jbGllbnQtcmVzdWx0LWNvbnRhaW5lciBwYWRkZWQnLCA9PlxuICAgICAgICBAYSBjbGFzczogXCIje25hbWVPZiByZXN0X2Zvcm0ucmVzdWx0X2xpbmt9XCIsICdSZXN1bHQnXG4gICAgICAgIEBzcGFuICcgfCAnXG4gICAgICAgIEBhIGNsYXNzOiBcIiN7bmFtZU9mIHJlc3RfZm9ybS5yZXN1bHRfaGVhZGVyc19saW5rfVwiLCAnSGVhZGVycydcbiAgICAgICAgQHNwYW4gJyB8ICdcbiAgICAgICAgQHNwYW4gY2xhc3M6IFwiI3tuYW1lT2YgcmVzdF9mb3JtLnN0YXR1c31cIlxuICAgICAgICBAc3BhbiBjbGFzczogXCJ0ZXh0LWluZm8gbG5rICN7bmFtZU9mIHJlc3RfZm9ybS5vcGVuX2luX2VkaXRvcn1cIiwgJ09wZW4gaW4gc2VwYXJhdGUgZWRpdG9yJ1xuXG4gICAgICAgIEBzcGFuIGNsYXNzOiBcIiN7bmFtZU9mIHJlc3RfZm9ybS5sb2FkaW5nfSBsb2FkaW5nIGxvYWRpbmctc3Bpbm5lci1zbWFsbCBpbmxpbmUtYmxvY2tcIiwgc3R5bGU6ICdkaXNwbGF5OiBub25lOydcbiAgICAgICAgQHByZSBjbGFzczogXCIje25hbWVPZiByZXN0X2Zvcm0ucmVzdWx0X2hlYWRlcnN9XCIsIFwiXCJcbiAgICAgICAgQHByZSBjbGFzczogXCIje25hbWVPZiByZXN0X2Zvcm0ucmVzdWx0fVwiLCBcIiN7UmVzdENsaWVudFJlc3BvbnNlLkRFRkFVTFRfUkVTUE9OU0V9XCJcblxuICBpbml0aWFsaXplOiAtPlxuICAgIEBDT0xMRUNUSU9OU19QQVRIID0gXCIje1BBQ0tBR0VfUEFUSH0vY29sbGVjdGlvbnMuanNvblwiXG4gICAgQFJFQ0VOVF9SRVFVRVNUU19QQVRIID0gXCIje1BBQ0tBR0VfUEFUSH0vcmVjZW50Lmpzb25cIlxuXG4gICAgQGxhc3RSZXF1ZXN0ID0gbnVsbFxuICAgIEBsYXN0UmVzcG9uc2UgPSBudWxsXG5cbiAgICBAcmVjZW50UmVxdWVzdHMgPSBuZXcgUmVzdENsaWVudFBlcnNpc3QoQFJFQ0VOVF9SRVFVRVNUU19QQVRIKVxuICAgIEByZWNlbnRSZXF1ZXN0cy5zZXRSZXF1ZXN0RmlsZUxpbWl0KFJFQ0VOVF9SRVFVRVNUU19GSUxFX0xJTUlUKVxuICAgIEBzYXZlZFJlcXVlc3RzID0gbmV3IFJlc3RDbGllbnRQZXJzaXN0KEBDT0xMRUNUSU9OU19QQVRIKVxuXG4gICAgQGVtaXR0ZXIgPSBuZXcgRW1pdHRlclxuICAgIEBzdWJzY3JpYmVUb0V2ZW50cygpXG5cbiAgICBAcmVjZW50UmVxdWVzdHMubG9hZChAbG9hZFJlY2VudFJlcXVlc3RzSW5WaWV3KVxuICAgIEBzYXZlZFJlcXVlc3RzLmxvYWQoQGxvYWRTYXZlZFJlcXVlc3RzSW5WaWV3KVxuXG4gIHN1YnNjcmliZVRvRXZlbnRzOiAtPlxuICAgIEBlbWl0dGVyLm9uIFJlc3RDbGllbnRFdmVudC5ORVdfUkVRVUVTVCwgQHJlY2VudFJlcXVlc3RzLnNhdmVcbiAgICBAZW1pdHRlci5vbiBSZXN0Q2xpZW50RXZlbnQuTkVXX1JFUVVFU1QsIEBhZGRSZWNlbnRSZXF1ZXN0SXRlbVxuICAgIEBlbWl0dGVyLm9uIFJlc3RDbGllbnRFdmVudC5ORVdfUkVRVUVTVCwgQHNob3dMb2FkaW5nXG4gICAgQGVtaXR0ZXIub24gUmVzdENsaWVudEV2ZW50Lk5FV19SRVFVRVNULCBAc2V0TGFzdFJlcXVlc3RcbiAgICBAZW1pdHRlci5vbiBSZXN0Q2xpZW50RXZlbnQuUkVRVUVTVF9GSU5JU0hFRCwgQGhpZGVMb2FkaW5nXG5cbiAgICBmb3IgbWV0aG9kIGluIFJlc3RDbGllbnRIdHRwLk1FVEhPRFNcbiAgICAgIEBvbiAnY2xpY2snLCBcIiN7cmVzdF9mb3JtLm1ldGhvZH0tI3ttZXRob2R9XCIsIC0+XG4gICAgICAgICR0aGlzID0gJCh0aGlzKVxuICAgICAgICAkdGhpcy5zaWJsaW5ncygpLnJlbW92ZUNsYXNzKCdzZWxlY3RlZCcpXG4gICAgICAgICR0aGlzLmFkZENsYXNzKCdzZWxlY3RlZCcpXG4gICAgICAgIGN1cnJlbnRfbWV0aG9kID0gJHRoaXMuaHRtbCgpXG5cbiAgICBAb24gJ2NsaWNrJywgcmVzdF9mb3JtLmNsZWFyX2J0biwgPT4gQGNsZWFyRm9ybSgpXG4gICAgQG9uICdjbGljaycsIHJlc3RfZm9ybS5zZW5kX2J0biwgID0+IEBzZW5kUmVxdWVzdCgpXG4gICAgQG9uICdjbGljaycsIHJlc3RfZm9ybS5zYXZlX2J0biwgID0+IEBzYXZlUmVxdWVzdCgpXG5cbiAgICBAb24gJ2NsaWNrJywgcmVzdF9mb3JtLmVuY29kZV9wYXlsb2FkLCA9PiBAZW5jb2RlUGF5bG9hZCgpXG4gICAgQG9uICdjbGljaycsIHJlc3RfZm9ybS5kZWNvZGVfcGF5bG9hZCwgPT4gQGRlY29kZVBheWxvYWQoKVxuXG4gICAgQG9uICdjbGljaycsIHJlc3RfZm9ybS5vcGVuX2luX2VkaXRvciwgPT4gQG9wZW5JbkVkaXRvcigpXG5cbiAgICBAb24gJ2tleXByZXNzJywgcmVzdF9mb3JtLnVybCwgKChfdGhpcykgLT5cbiAgICAgIC0+XG4gICAgICAgIF90aGlzLnNlbmRSZXF1ZXN0KCkgaWYgZXZlbnQua2V5Q29kZSBpcyBFTlRFUl9LRVlcbiAgICAgICAgcmV0dXJuXG4gICAgKSh0aGlzKVxuXG4gICAgQG9uICdjbGljaycsIHJlY2VudF9yZXF1ZXN0cy5idXR0b24sID0+IEB0b2dnbGVSZXF1ZXN0cyhyZWNlbnRfcmVxdWVzdHMpXG4gICAgQG9uICdjbGljaycsIHNhdmVkX3JlcXVlc3RzLmJ1dHRvbiwgPT4gQHRvZ2dsZVJlcXVlc3RzKHNhdmVkX3JlcXVlc3RzKVxuXG4gICAgQG9uICdjbGljaycsIHJlc3RfZm9ybS5yZXN1bHRfbGluaywgPT4gQHRvZ2dsZVJlc3VsdChyZXN0X2Zvcm0ucmVzdWx0KVxuICAgIEBvbiAnY2xpY2snLCByZXN0X2Zvcm0ucmVzdWx0X2hlYWRlcnNfbGluaywgPT4gQHRvZ2dsZVJlc3VsdChyZXN0X2Zvcm0ucmVzdWx0X2hlYWRlcnMpXG5cbiAgICAkKCdib2R5Jykub24gJ2NsaWNrJywgcmVzdF9mb3JtLnJlcXVlc3RfbGluaywgQGxvYWRSZXF1ZXN0XG4gICAgJCgnYm9keScpLm9uICdjbGljaycsIHJlc3RfZm9ybS5yZXF1ZXN0X2xpbmtfcmVtb3ZlLCBAcmVtb3ZlU2F2ZWRSZXF1ZXN0XG5cbiAgICBAb24gJ2NsaWNrJywgJy5yZXN0LWNsaWVudC1oZWFkZXJzLWhlYWRlcicsID0+IEB0b2dnbGVCb2R5KCcucmVzdC1jbGllbnQtaGVhZGVycy1oZWFkZXIgPiBoNScsICcucmVzdC1jbGllbnQtaGVhZGVycy1ib2R5JylcbiAgICBAb24gJ2NsaWNrJywgJy5yZXN0LWNsaWVudC1wYXlsb2FkLWhlYWRlcicsID0+IEB0b2dnbGVCb2R5KCcucmVzdC1jbGllbnQtcGF5bG9hZC1oZWFkZXIgPiBoNScsICcucmVzdC1jbGllbnQtcGF5bG9hZC1ib2R5JylcblxuICB0b2dnbGVCb2R5OiAoaGVhZGVyLCBib2R5KSAtPlxuICAgICQoaGVhZGVyKS50b2dnbGVDbGFzcyhjKSBmb3IgYyBpbiBbJ2hlYWRlci1leHBhbmRlZCcsICdoZWFkZXItY29sbGFwc2VkJ11cbiAgICAkKGJvZHkpLnNsaWRlVG9nZ2xlKCdmYXN0JylcblxuICBvcGVuSW5FZGl0b3I6IC0+XG4gICAgdGV4dFJlc3VsdCA9ICQocmVzdF9mb3JtLnJlc3VsdCkudGV4dCgpXG4gICAgZWRpdG9yID0gbmV3IFJlc3RDbGllbnRFZGl0b3IodGV4dFJlc3VsdCwgQGNvbnN0cnVjdEZpbGVOYW1lKCkpXG4gICAgZWRpdG9yLm9wZW4oKVxuXG4gIGNvbnN0cnVjdEZpbGVOYW1lOiAtPlxuICAgIGV4dGVuc2lvbiA9IG1pbWUuZXh0ZW5zaW9uKEBsYXN0UmVzcG9uc2UuaGVhZGVyc1snY29udGVudC10eXBlJ10pXG4gICAgXCIje0BsYXN0UmVxdWVzdC5tZXRob2R9ICN7QGxhc3RSZXF1ZXN0LnVybH0jeycuJyArIGV4dGVuc2lvbiBpZiBleHRlbnNpb259XCJcblxuICBlbmNvZGVQYXlsb2FkOiAtPlxuICAgICQocmVzdF9mb3JtLnBheWxvYWQpLnZhbChcbiAgICAgIFJlc3RDbGllbnRIdHRwLmVuY29kZVBheWxvYWQoJChyZXN0X2Zvcm0ucGF5bG9hZCkudmFsKCkpXG4gICAgKVxuXG4gIGRlY29kZVBheWxvYWQ6IC0+XG4gICAgJChyZXN0X2Zvcm0ucGF5bG9hZCkudmFsKFxuICAgICAgUmVzdENsaWVudEh0dHAuZGVjb2RlUGF5bG9hZCgkKHJlc3RfZm9ybS5wYXlsb2FkKS52YWwoKSlcbiAgICApXG5cbiAgY2xlYXJGb3JtOiAtPlxuICAgIEBoaWRlTG9hZGluZygpXG4gICAgQHNldERlZmF1bHRWYWx1ZXMoKVxuICAgICQocmVzdF9mb3JtLnJlc3VsdCkuc2hvdygpXG5cbiAgc2V0RGVmYXVsdFZhbHVlczogLT5cbiAgICAkKHJlc3RfZm9ybS51cmwpLnZhbCgnJylcbiAgICAkKHJlc3RfZm9ybS5oZWFkZXJzKS52YWwoJycpXG4gICAgJChyZXN0X2Zvcm0ucGF5bG9hZCkudmFsKCcnKVxuICAgICQocmVzdF9mb3JtLnN0YXR1cykudmFsKCcnKVxuICAgICQocmVzdF9mb3JtLnJlc3VsdCkudGV4dChSZXN0Q2xpZW50UmVzcG9uc2UuREVGQVVMVF9SRVNQT05TRSlcblxuICBnZXRIZWFkZXJzOiAtPlxuICAgIGhlYWRlcnMgPSB7fVxuICAgIGN1c3RvbV9oZWFkZXJzID0gJChyZXN0X2Zvcm0uaGVhZGVycykudmFsKCkuc3BsaXQoJ1xcbicpXG5cbiAgICBmb3IgY3VzdG9tX2hlYWRlciBpbiBjdXN0b21faGVhZGVyc1xuICAgICAgY3VycmVudF9oZWFkZXIgPSBjdXN0b21faGVhZGVyLnRyaW0oKS5zcGxpdCgnOicpXG4gICAgICBpZiBjdXJyZW50X2hlYWRlci5sZW5ndGggPiAxXG4gICAgICAgIGhlYWRlcnNbY3VycmVudF9oZWFkZXJbMF1dID0gY3VycmVudF9oZWFkZXJbMV0udHJpbSgpXG5cbiAgICBoZWFkZXJzXG5cbiAgc2VuZFJlcXVlc3Q6IC0+XG4gICAgcmVxdWVzdF9vcHRpb25zID0ge31cblxuICAgIHRyeVxuICAgICAgcmVxdWVzdF9vcHRpb25zID0gQGdldFJlcXVlc3RPcHRpb25zKClcbiAgICBjYXRjaCBlcnJvclxuICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yIFBBWUxPQURfSlNPTl9FUlJPUl9NRVNTQUdFXG4gICAgICByZXR1cm5cblxuICAgIGlmIHJlcXVlc3Rfb3B0aW9ucy51cmxcbiAgICAgIEBlbWl0dGVyLmVtaXQgUmVzdENsaWVudEV2ZW50Lk5FV19SRVFVRVNULCByZXF1ZXN0X29wdGlvbnNcbiAgICAgIFJlc3RDbGllbnRIdHRwLnNlbmQocmVxdWVzdF9vcHRpb25zLCBAb25SZXNwb25zZSlcblxuICBzYXZlUmVxdWVzdDogLT5cbiAgICBpZiBAbGFzdFJlcXVlc3Q/XG4gICAgICBAc2F2ZWRSZXF1ZXN0cy5zYXZlKEBsYXN0UmVxdWVzdClcbiAgICAgIEBhZGRSZXF1ZXN0SXRlbShzYXZlZF9yZXF1ZXN0cy5saXN0LCBAbGFzdFJlcXVlc3QpXG5cbiAgcmVtb3ZlU2F2ZWRSZXF1ZXN0OiAoZSkgPT5cbiAgICAkdGFyZ2V0ID0gJChlLmN1cnJlbnRUYXJnZXQpXG4gICAgcmVxdWVzdCA9ICR0YXJnZXRcbiAgICAgICAgLnNpYmxpbmdzKHJlc3RfZm9ybS5yZXF1ZXN0X2xpbmspXG4gICAgICAgIC5kYXRhKCdyZXF1ZXN0JylcbiAgICBAc2F2ZWRSZXF1ZXN0cy5yZW1vdmUocmVxdWVzdClcbiAgICAkdGFyZ2V0LnBhcmVudCgpLnJlbW92ZSgpXG5cbiAgZ2V0UmVxdWVzdE9wdGlvbnM6IC0+XG4gICAgb3B0aW9ucyA9XG4gICAgICB1cmw6ICQocmVzdF9mb3JtLnVybCkudmFsKClcbiAgICAgIGhlYWRlcnM6IEBnZXRIZWFkZXJzKClcbiAgICAgIG1ldGhvZDogY3VycmVudF9tZXRob2QsXG4gICAgICBzdHJpY3RTU0w6ICQocmVzdF9mb3JtLnN0cmljdF9zc2wpLmlzKCc6Y2hlY2tlZCcpLFxuICAgICAgcHJveHk6ICQocmVzdF9mb3JtLnByb3h5X3NlcnZlcikudmFsKCksXG4gICAgICBib2R5OiBAZ2V0UmVxdWVzdEJvZHkoKVxuXG4gIG9uUmVzcG9uc2U6IChlcnJvciwgcmVzcG9uc2UsIGJvZHkpID0+XG4gICAgQHNldExhc3RSZXNwb25zZShyZXNwb25zZSlcbiAgICBpZiAhZXJyb3JcbiAgICAgIHN0YXR1c01lc3NhZ2UgPSByZXNwb25zZS5zdGF0dXNDb2RlICsgXCIgXCIgKyByZXNwb25zZS5zdGF0dXNNZXNzYWdlXG5cbiAgICAgIHN3aXRjaCByZXNwb25zZS5zdGF0dXNDb2RlXG4gICAgICAgIHdoZW4gMjAwLCAyMDEsIDIwNFxuICAgICAgICAgIEBzaG93U3VjY2Vzc2Z1bFJlc3BvbnNlKHN0YXR1c01lc3NhZ2UpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBAc2hvd0Vycm9yUmVzcG9uc2Uoc3RhdHVzTWVzc2FnZSlcblxuICAgICAgaGVhZGVycyA9IEBnZXRIZWFkZXJzQXNTdHJpbmcgcmVzcG9uc2UuaGVhZGVyc1xuICAgICAgcmVzcG9uc2UgPSBuZXcgUmVzdENsaWVudFJlc3BvbnNlKGJvZHkpLmdldEZvcm1hdHRlZCgpXG4gICAgICByZXN1bHQgPSByZXNwb25zZVxuICAgIGVsc2VcbiAgICAgIEBzaG93RXJyb3JSZXNwb25zZShERUZBVUxUX05PUkVTUE9OU0UpXG4gICAgICByZXN1bHQgPSBlcnJvclxuXG4gICAgJChyZXN0X2Zvcm0ucmVzdWx0KS50ZXh0KHJlc3VsdClcbiAgICAkKHJlc3RfZm9ybS5yZXN1bHRfaGVhZGVycykudGV4dChoZWFkZXJzKS5oaWRlKClcbiAgICBAZW1pdHRlci5lbWl0IFJlc3RDbGllbnRFdmVudC5SRVFVRVNUX0ZJTklTSEVELCByZXNwb25zZVxuXG4gIGdldFJlcXVlc3RCb2R5OiAtPlxuICAgIHBheWxvYWQgPSAkKHJlc3RfZm9ybS5wYXlsb2FkKS52YWwoKVxuICAgIGJvZHkgPSBcIlwiXG4gICAgY29udGVudF90eXBlID0gQGdldENvbnRlbnRUeXBlKClcblxuICAgIGlmIHBheWxvYWRcbiAgICAgIHN3aXRjaCBjb250ZW50X3R5cGVcbiAgICAgICAgd2hlbiBcImFwcGxpY2F0aW9uL2pzb25cIlxuICAgICAgICAgIGJvZHkgPSBKU09OLnN0cmluZ2lmeShKU09OLnBhcnNlKHBheWxvYWQpKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgYm9keSA9IHBheWxvYWRcblxuICAgIGJvZHlcblxuICBnZXRDb250ZW50VHlwZTogLT5cbiAgICBoZWFkZXJzID0gQGdldEhlYWRlcnMoKVxuICAgIGhlYWRlcnNbJ0NvbnRlbnQtVHlwZSddIHx8IGhlYWRlcnNbJ2NvbnRlbnQtdHlwZSddXG5cbiAgc2hvd1N1Y2Nlc3NmdWxSZXNwb25zZTogKHRleHQpID0+XG4gICAgJChyZXN0X2Zvcm0uc3RhdHVzKVxuICAgICAgLnJlbW92ZUNsYXNzKCd0ZXh0LWVycm9yJylcbiAgICAgIC5hZGRDbGFzcygndGV4dC1zdWNjZXNzJylcbiAgICAgIC50ZXh0KHRleHQpXG5cbiAgc2hvd0Vycm9yUmVzcG9uc2U6ICh0ZXh0KSA9PlxuICAgICQocmVzdF9mb3JtLnN0YXR1cylcbiAgICAgIC5yZW1vdmVDbGFzcygndGV4dC1zdWNjZXNzJylcbiAgICAgIC5hZGRDbGFzcygndGV4dC1lcnJvcicpXG4gICAgICAudGV4dCh0ZXh0KVxuXG4gIGxvYWRSZXF1ZXN0OiAoZSkgPT5cbiAgICByZXF1ZXN0ID0gJChlLmN1cnJlbnRUYXJnZXQpLmRhdGEoJ3JlcXVlc3QnKVxuICAgIEBmaWxsSW5SZXF1ZXN0KHJlcXVlc3QpXG5cbiAgbG9hZFJlY2VudFJlcXVlc3RzSW5WaWV3OiAoZXJyLCByZXF1ZXN0cykgPT5cbiAgICBpZiBlcnJcbiAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvciBSRUNFTlRfUkVRVUVTVFNfRVJST1JfTUVTU0FHRVxuICAgICAgcmV0dXJuXG5cbiAgICBAcmVjZW50UmVxdWVzdHMudXBkYXRlKEpTT04ucGFyc2UocmVxdWVzdHMpKVxuICAgIEBhZGRSZXF1ZXN0c0luVmlldyhyZWNlbnRfcmVxdWVzdHMubGlzdCwgQHJlY2VudFJlcXVlc3RzLmdldCgpKVxuXG4gIGxvYWRTYXZlZFJlcXVlc3RzSW5WaWV3OiAoZXJyLCByZXF1ZXN0cykgPT5cbiAgICBpZiBlcnJcbiAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvciBTQVZFRF9SRVFVRVNUU19FUlJPUl9NRVNTQUdFXG4gICAgICByZXR1cm5cblxuICAgIEBzYXZlZFJlcXVlc3RzLnVwZGF0ZShKU09OLnBhcnNlKHJlcXVlc3RzKSlcbiAgICBAYWRkUmVxdWVzdHNJblZpZXcoc2F2ZWRfcmVxdWVzdHMubGlzdCwgQHNhdmVkUmVxdWVzdHMuZ2V0KCkpXG5cbiAgdG9nZ2xlUmVxdWVzdHM6ICh0YXJnZXQpIC0+XG4gICAgJCh0YXJnZXQubGlzdCkudG9nZ2xlKClcbiAgICAkKHRhcmdldC5idXR0b24pLnRvZ2dsZUNsYXNzKCdzZWxlY3RlZCcpXG5cbiAgdG9nZ2xlUmVzdWx0OiAodGFyZ2V0KSAtPlxuICAgICR0YXJnZXQgPSAkKHRhcmdldClcbiAgICAkdGFyZ2V0LnNpYmxpbmdzKCdwcmUnKS5oaWRlKClcbiAgICAkdGFyZ2V0LnNob3coKVxuXG4gIGFkZFJlcXVlc3RzSW5WaWV3OiAodGFyZ2V0LCByZXF1ZXN0cykgLT5cbiAgICBpZiBub3QgcmVxdWVzdHM/XG4gICAgICByZXR1cm5cblxuICAgIGZvciByZXF1ZXN0IGluIHJlcXVlc3RzXG4gICAgICBAYWRkUmVxdWVzdEl0ZW0odGFyZ2V0LCByZXF1ZXN0KVxuXG4gIGFkZFJlcXVlc3RJdGVtOiAodGFyZ2V0LCBkYXRhKSA9PlxuICAgICRsaSA9ICQoJzxsaT4nKVxuICAgICRsaS5hcHBlbmQoXG4gICAgICAkKCc8YT4nKS50ZXh0KFtkYXRhLm1ldGhvZCwgZGF0YS51cmxdLmpvaW4oJyAtICcpKVxuICAgICAgICAuYXR0cignaHJlZicsICcjcmVxdWVzdCcpXG4gICAgICAgIC5hZGRDbGFzcyhyZXN0X2Zvcm0ucmVxdWVzdF9saW5rLnNwbGl0KCcuJylbMV0pXG4gICAgICAgIC5hdHRyKCdkYXRhLXJlcXVlc3QnLCBKU09OLnN0cmluZ2lmeShkYXRhKSlcbiAgICApXG5cbiAgICBpZiB0YXJnZXQgPT0gc2F2ZWRfcmVxdWVzdHMubGlzdFxuICAgICAgJGxpLmFwcGVuZChcbiAgICAgICAgJCgnPGE+JykuaHRtbCgkKCc8c3Bhbj4nKS5hZGRDbGFzcygnaWNvbiBpY29uLXgnKSlcbiAgICAgICAgICAuYXR0cignaHJlZicsICcjcmVtb3ZlJylcbiAgICAgICAgICAuYWRkQ2xhc3MocmVzdF9mb3JtLnJlcXVlc3RfbGlua19yZW1vdmUuc3BsaXQoJy4nKVsxXSlcbiAgICAgIClcblxuICAgICQodGFyZ2V0KS5wcmVwZW5kKCRsaSlcbiAgICAkKHRhcmdldCkuY2hpbGRyZW4oKVxuICAgICAgLnNsaWNlKERFRkFVTFRfUkVRVUVTVFNfTElNSVQpXG4gICAgICAuZGV0YWNoKClcblxuICBmaWxsSW5SZXF1ZXN0OiAocmVxdWVzdCkgLT5cbiAgICAkKHJlc3RfZm9ybS51cmwpLnZhbChyZXF1ZXN0LnVybClcbiAgICBAc2V0TWV0aG9kQXNTZWxlY3RlZChyZXF1ZXN0Lm1ldGhvZClcbiAgICAkKHJlc3RfZm9ybS5wYXlsb2FkKS52YWwocmVxdWVzdC5ib2R5KVxuICAgICQocmVzdF9mb3JtLmhlYWRlcnMpLnZhbChAZ2V0SGVhZGVyc0FzU3RyaW5nKHJlcXVlc3QuaGVhZGVycykpXG5cbiAgYWRkUmVjZW50UmVxdWVzdEl0ZW06IChkYXRhKSA9PlxuICAgIEBhZGRSZXF1ZXN0SXRlbShyZWNlbnRfcmVxdWVzdHMubGlzdCwgZGF0YSlcblxuICBzZXRMYXN0UmVxdWVzdDogKHJlcXVlc3QpID0+XG4gICAgQGxhc3RSZXF1ZXN0ID0gcmVxdWVzdFxuXG4gIHNldExhc3RSZXNwb25zZTogKHJlc3BvbnNlKSA9PlxuICAgIEBsYXN0UmVzcG9uc2UgPSByZXNwb25zZVxuXG4gIGdldEhlYWRlcnNBc1N0cmluZzogKGhlYWRlcnMpICAtPlxuICAgIG91dHB1dCA9ICcnXG5cbiAgICBmb3IgaGVhZGVyLCB2YWx1ZSBvZiBoZWFkZXJzXG4gICAgICBvdXRwdXQgPSBvdXRwdXQuY29uY2F0KGhlYWRlciArICc6ICcgKyB2YWx1ZSArICdcXG4nKVxuXG4gICAgcmV0dXJuIG91dHB1dFxuXG4gIHNldE1ldGhvZEFzU2VsZWN0ZWQ6IChtZXRob2QpIC0+XG4gICAgJG1ldGhvZCA9ICQocmVzdF9mb3JtLm1ldGhvZCArICctJyArIG1ldGhvZC50b0xvd2VyQ2FzZSgpKVxuICAgICRtZXRob2QuY2xpY2soKVxuXG4gICMgUmV0dXJucyBhbiBvYmplY3QgdGhhdCBjYW4gYmUgcmV0cmlldmVkIHdoZW4gcGFja2FnZSBpcyBhY3RpdmF0ZWRcbiAgc2VyaWFsaXplOiAtPlxuICAgIGRlc2VyaWFsaXplcjogQGNvbnN0cnVjdG9yLm5hbWVcbiAgICB1cmk6IEBnZXRVcmkoKVxuXG4gIGdldFVyaTogLT4gQHVyaVxuXG4gIGdldFRpdGxlOiAtPiBcIlJFU1QgQ2xpZW50XCJcblxuICBnZXRNb2RlbDogLT5cblxuICAjIGxvYWRpbmcgYmFyXG4gIHNob3dMb2FkaW5nOiAtPlxuICAgICQocmVzdF9mb3JtLnJlc3VsdCkuaGlkZSgpXG4gICAgJChyZXN0X2Zvcm0ubG9hZGluZykuc2hvdygpXG5cbiAgaGlkZUxvYWRpbmc6IC0+XG4gICAgJChyZXN0X2Zvcm0ubG9hZGluZykuZmFkZU91dCgpXG4gICAgJChyZXN0X2Zvcm0ucmVzdWx0KS5zaG93KClcbiJdfQ==
