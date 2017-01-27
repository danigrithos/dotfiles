(function() {
  var SelectListView, VirtualenvListView,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  SelectListView = require('atom-space-pen-views').SelectListView;

  module.exports = VirtualenvListView = (function(superClass) {
    extend(VirtualenvListView, superClass);

    function VirtualenvListView() {
      return VirtualenvListView.__super__.constructor.apply(this, arguments);
    }

    VirtualenvListView.prototype.initialize = function(manager) {
      this.manager = manager;
      VirtualenvListView.__super__.initialize.apply(this, arguments);
      this.addClass('virtualenv-selector from-top overlay');
      this.list.addClass('mark-active');
      return this.setItems(this.manager.options);
    };

    VirtualenvListView.prototype.getFilterKey = function() {
      return 'name';
    };

    VirtualenvListView.prototype.viewForItem = function(env) {
      var element;
      element = document.createElement('li');
      if (env.name === this.manager.env) {
        element.classList.add('active');
      }
      element.textContent = env.name;
      return element;
    };

    VirtualenvListView.prototype.confirmed = function(env) {
      this.manager.change(env);
      this.panel.hide();
      return this.cancel();
    };

    VirtualenvListView.prototype.cancelled = function() {
      return this.panel.hide();
    };

    VirtualenvListView.prototype.attach = function() {
      this.storeFocusedElement();
      this.panel = atom.workspace.addModalPanel({
        item: this
      });
      return this.focusFilterEditor();
    };

    return VirtualenvListView;

  })(SelectListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvZGRld2V5Ly5hdG9tL3BhY2thZ2VzL2F0b20tcHl0aG9uLXZpcnR1YWxlbnYvbGliL3ZpcnR1YWxlbnYtbGlzdC12aWV3LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsa0NBQUE7SUFBQTs7O0VBQUMsaUJBQWtCLE9BQUEsQ0FBUSxzQkFBUjs7RUFFbkIsTUFBTSxDQUFDLE9BQVAsR0FDUTs7Ozs7OztpQ0FDSixVQUFBLEdBQVksU0FBQyxPQUFEO01BQUMsSUFBQyxDQUFBLFVBQUQ7TUFDWCxvREFBQSxTQUFBO01BRUEsSUFBQyxDQUFBLFFBQUQsQ0FBVSxzQ0FBVjtNQUNBLElBQUMsQ0FBQSxJQUFJLENBQUMsUUFBTixDQUFlLGFBQWY7YUFFQSxJQUFDLENBQUEsUUFBRCxDQUFVLElBQUMsQ0FBQSxPQUFPLENBQUMsT0FBbkI7SUFOVTs7aUNBUVosWUFBQSxHQUFjLFNBQUE7YUFDWjtJQURZOztpQ0FHZCxXQUFBLEdBQWEsU0FBQyxHQUFEO0FBQ1gsVUFBQTtNQUFBLE9BQUEsR0FBVSxRQUFRLENBQUMsYUFBVCxDQUF1QixJQUF2QjtNQUNWLElBQW1DLEdBQUcsQ0FBQyxJQUFKLEtBQVksSUFBQyxDQUFBLE9BQU8sQ0FBQyxHQUF4RDtRQUFBLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBbEIsQ0FBc0IsUUFBdEIsRUFBQTs7TUFDQSxPQUFPLENBQUMsV0FBUixHQUFzQixHQUFHLENBQUM7YUFDMUI7SUFKVzs7aUNBTWIsU0FBQSxHQUFXLFNBQUMsR0FBRDtNQUNULElBQUMsQ0FBQSxPQUFPLENBQUMsTUFBVCxDQUFnQixHQUFoQjtNQUNBLElBQUMsQ0FBQSxLQUFLLENBQUMsSUFBUCxDQUFBO2FBQ0EsSUFBQyxDQUFBLE1BQUQsQ0FBQTtJQUhTOztpQ0FLWCxTQUFBLEdBQVcsU0FBQTthQUNULElBQUMsQ0FBQSxLQUFLLENBQUMsSUFBUCxDQUFBO0lBRFM7O2lDQUdYLE1BQUEsR0FBUSxTQUFBO01BQ04sSUFBQyxDQUFBLG1CQUFELENBQUE7TUFDQSxJQUFDLENBQUEsS0FBRCxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBZixDQUE2QjtRQUFBLElBQUEsRUFBTSxJQUFOO09BQTdCO2FBQ1QsSUFBQyxDQUFBLGlCQUFELENBQUE7SUFITTs7OztLQTFCdUI7QUFIbkMiLCJzb3VyY2VzQ29udGVudCI6WyJ7U2VsZWN0TGlzdFZpZXd9ID0gcmVxdWlyZSAnYXRvbS1zcGFjZS1wZW4tdmlld3MnXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgY2xhc3MgVmlydHVhbGVudkxpc3RWaWV3IGV4dGVuZHMgU2VsZWN0TGlzdFZpZXdcbiAgICBpbml0aWFsaXplOiAoQG1hbmFnZXIpIC0+XG4gICAgICBzdXBlclxuXG4gICAgICBAYWRkQ2xhc3MoJ3ZpcnR1YWxlbnYtc2VsZWN0b3IgZnJvbS10b3Agb3ZlcmxheScpXG4gICAgICBAbGlzdC5hZGRDbGFzcygnbWFyay1hY3RpdmUnKVxuXG4gICAgICBAc2V0SXRlbXMoQG1hbmFnZXIub3B0aW9ucylcblxuICAgIGdldEZpbHRlcktleTogLT5cbiAgICAgICduYW1lJ1xuXG4gICAgdmlld0Zvckl0ZW06IChlbnYpIC0+XG4gICAgICBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKVxuICAgICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKSBpZiBlbnYubmFtZSBpcyBAbWFuYWdlci5lbnZcbiAgICAgIGVsZW1lbnQudGV4dENvbnRlbnQgPSBlbnYubmFtZVxuICAgICAgZWxlbWVudFxuXG4gICAgY29uZmlybWVkOiAoZW52KSAtPlxuICAgICAgQG1hbmFnZXIuY2hhbmdlKGVudilcbiAgICAgIEBwYW5lbC5oaWRlKClcbiAgICAgIEBjYW5jZWwoKVxuXG4gICAgY2FuY2VsbGVkOiAtPlxuICAgICAgQHBhbmVsLmhpZGUoKVxuXG4gICAgYXR0YWNoOiAtPlxuICAgICAgQHN0b3JlRm9jdXNlZEVsZW1lbnQoKVxuICAgICAgQHBhbmVsID0gYXRvbS53b3Jrc3BhY2UuYWRkTW9kYWxQYW5lbChpdGVtOiB0aGlzKVxuICAgICAgQGZvY3VzRmlsdGVyRWRpdG9yKClcbiJdfQ==
