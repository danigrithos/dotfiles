(function() {
  var ColorContext, ColorExpression, ColorParser, registry;

  require('./helpers/matchers');

  ColorParser = require('../lib/color-parser');

  ColorContext = require('../lib/color-context');

  ColorExpression = require('../lib/color-expression');

  registry = require('../lib/color-expressions');

  describe('ColorParser', function() {
    var asColor, getParser, itParses, parser;
    parser = [][0];
    beforeEach(function() {
      var svgColorExpression;
      svgColorExpression = registry.getExpression('pigments:named_colors');
      return svgColorExpression.scopes = ['*'];
    });
    asColor = function(value) {
      return "color:" + value;
    };
    getParser = function(context) {
      context = new ColorContext(context != null ? context : {
        registry: registry
      });
      return context.parser;
    };
    itParses = function(expression) {
      return {
        description: '',
        asColor: function(r, g, b, a) {
          var context;
          if (a == null) {
            a = 1;
          }
          context = this.context;
          return describe(this.description, function() {
            beforeEach(function() {
              return parser = getParser(context);
            });
            return it("parses '" + expression + "' as a color", function() {
              var ref;
              return expect(parser.parse(expression, (ref = this.scope) != null ? ref : 'less')).toBeColor(r, g, b, a);
            });
          });
        },
        asUndefined: function() {
          var context;
          context = this.context;
          return describe(this.description, function() {
            beforeEach(function() {
              return parser = getParser(context);
            });
            return it("does not parse '" + expression + "' and return undefined", function() {
              var ref;
              return expect(parser.parse(expression, (ref = this.scope) != null ? ref : 'less')).toBeUndefined();
            });
          });
        },
        asInvalid: function() {
          var context;
          context = this.context;
          return describe(this.description, function() {
            beforeEach(function() {
              return parser = getParser(context);
            });
            return it("parses '" + expression + "' as an invalid color", function() {
              var ref;
              return expect(parser.parse(expression, (ref = this.scope) != null ? ref : 'less')).not.toBeValid();
            });
          });
        },
        withContext: function(variables) {
          var colorVars, name, path, value, vars;
          vars = [];
          colorVars = [];
          path = "/path/to/file.styl";
          for (name in variables) {
            value = variables[name];
            if (value.indexOf('color:') !== -1) {
              value = value.replace('color:', '');
              vars.push({
                name: name,
                value: value,
                path: path
              });
              colorVars.push({
                name: name,
                value: value,
                path: path
              });
            } else {
              vars.push({
                name: name,
                value: value,
                path: path
              });
            }
          }
          this.context = {
            variables: vars,
            colorVariables: colorVars,
            registry: registry
          };
          this.description = "with variables context " + (jasmine.pp(variables)) + " ";
          return this;
        }
      };
    };
    itParses('@list-item-height').withContext({
      '@text-height': '@scale-b-xxl * 1rem',
      '@component-line-height': '@text-height',
      '@list-item-height': '@component-line-height'
    }).asUndefined();
    itParses('$text-color !default').withContext({
      '$text-color': asColor('cyan')
    }).asColor(0, 255, 255);
    itParses('c').withContext({
      'c': 'c'
    }).asUndefined();
    itParses('c').withContext({
      'c': 'd',
      'd': 'e',
      'e': 'c'
    }).asUndefined();
    itParses('#ff7f00').asColor(255, 127, 0);
    itParses('#f70').asColor(255, 119, 0);
    itParses('#ff7f00cc').asColor(255, 127, 0, 0.8);
    itParses('#f70c').asColor(255, 119, 0, 0.8);
    itParses('0xff7f00').asColor(255, 127, 0);
    itParses('0x00ff7f00').asColor(255, 127, 0, 0);
    describe('in context other than css and pre-processors', function() {
      beforeEach(function() {
        return this.scope = 'xaml';
      });
      return itParses('#ccff7f00').asColor(255, 127, 0, 0.8);
    });
    itParses('rgb(255,127,0)').asColor(255, 127, 0);
    itParses('rgb(255,127,0)').asColor(255, 127, 0);
    itParses('RGB(255,127,0)').asColor(255, 127, 0);
    itParses('RgB(255,127,0)').asColor(255, 127, 0);
    itParses('rGb(255,127,0)').asColor(255, 127, 0);
    itParses('rgb($r,$g,$b)').asInvalid();
    itParses('rgb($r,0,0)').asInvalid();
    itParses('rgb(0,$g,0)').asInvalid();
    itParses('rgb(0,0,$b)').asInvalid();
    itParses('rgb($r,$g,$b)').withContext({
      '$r': '255',
      '$g': '127',
      '$b': '0'
    }).asColor(255, 127, 0);
    itParses('rgba(255,127,0,0.5)').asColor(255, 127, 0, 0.5);
    itParses('rgba(255,127,0,.5)').asColor(255, 127, 0, 0.5);
    itParses('RGBA(255,127,0,.5)').asColor(255, 127, 0, 0.5);
    itParses('rGbA(255,127,0,.5)').asColor(255, 127, 0, 0.5);
    itParses('rgba(255,127,0,)').asUndefined();
    itParses('rgba($r,$g,$b,$a)').asInvalid();
    itParses('rgba($r,0,0,0)').asInvalid();
    itParses('rgba(0,$g,0,0)').asInvalid();
    itParses('rgba(0,0,$b,0)').asInvalid();
    itParses('rgba(0,0,0,$a)').asInvalid();
    itParses('rgba($r,$g,$b,$a)').withContext({
      '$r': '255',
      '$g': '127',
      '$b': '0',
      '$a': '0.5'
    }).asColor(255, 127, 0, 0.5);
    itParses('rgba(green, 0.5)').asColor(0, 128, 0, 0.5);
    itParses('rgba($c,$a,)').asUndefined();
    itParses('rgba($c,$a)').asInvalid();
    itParses('rgba($c,1)').asInvalid();
    itParses('rgba($c, $r)').withContext({
      '$c': asColor('hsv($h, $s, $v)'),
      '$r': '1'
    }).asInvalid();
    itParses('rgba($c,$a)').withContext({
      '$c': asColor('green'),
      '$a': '0.5'
    }).asColor(0, 128, 0, 0.5);
    describe('css', function() {
      beforeEach(function() {
        return this.scope = 'css';
      });
      itParses('hsl(200,50%,50%)').asColor(64, 149, 191);
      itParses('hsl(200,50,50)').asColor(64, 149, 191);
      itParses('HSL(200,50,50)').asColor(64, 149, 191);
      itParses('hSl(200,50,50)').asColor(64, 149, 191);
      itParses('hsl(200.5,50.5,50.5)').asColor(65, 150, 193);
      itParses('hsl($h,$s,$l,)').asUndefined();
      itParses('hsl($h,$s,$l)').asInvalid();
      itParses('hsl($h,0%,0%)').asInvalid();
      itParses('hsl(0,$s,0%)').asInvalid();
      itParses('hsl(0,0%,$l)').asInvalid();
      return itParses('hsl($h,$s,$l)').withContext({
        '$h': '200',
        '$s': '50%',
        '$l': '50%'
      }).asColor(64, 149, 191);
    });
    describe('less', function() {
      beforeEach(function() {
        return this.scope = 'less';
      });
      itParses('hsl(285, 0.7, 0.7)').asColor('#cd7de8');
      return itParses('hsl(200,50%,50%)').asColor(64, 149, 191);
    });
    itParses('hsla(200,50%,50%,0.5)').asColor(64, 149, 191, 0.5);
    itParses('hsla(200,50%,50%,.5)').asColor(64, 149, 191, 0.5);
    itParses('hsla(200,50,50,.5)').asColor(64, 149, 191, 0.5);
    itParses('HSLA(200,50,50,.5)').asColor(64, 149, 191, 0.5);
    itParses('HsLa(200,50,50,.5)').asColor(64, 149, 191, 0.5);
    itParses('hsla(200.5,50.5,50.5,.5)').asColor(65, 150, 193, 0.5);
    itParses('hsla(200,50%,50%,)').asUndefined();
    itParses('hsla($h,$s,$l,$a)').asInvalid();
    itParses('hsla($h,0%,0%,0)').asInvalid();
    itParses('hsla(0,$s,0%,0)').asInvalid();
    itParses('hsla(0,0%,$l,0)').asInvalid();
    itParses('hsla(0,0%,0%,$a)').asInvalid();
    itParses('hsla($h,$s,$l,$a)').withContext({
      '$h': '200',
      '$s': '50%',
      '$l': '50%',
      '$a': '0.5'
    }).asColor(64, 149, 191, 0.5);
    itParses('hsv(200,50%,50%)').asColor(64, 106, 128);
    itParses('HSV(200,50%,50%)').asColor(64, 106, 128);
    itParses('hSv(200,50%,50%)').asColor(64, 106, 128);
    itParses('hsb(200,50%,50%)').asColor(64, 106, 128);
    itParses('hsb(200,50,50)').asColor(64, 106, 128);
    itParses('hsb(200.5,50.5,50.5)').asColor(64, 107, 129);
    itParses('hsv($h,$s,$v,)').asUndefined();
    itParses('hsv($h,$s,$v)').asInvalid();
    itParses('hsv($h,0%,0%)').asInvalid();
    itParses('hsv(0,$s,0%)').asInvalid();
    itParses('hsv(0,0%,$v)').asInvalid();
    itParses('hsv($h,$s,$v)').withContext({
      '$h': '200',
      '$s': '50%',
      '$v': '50%'
    }).asColor(64, 106, 128);
    itParses('hsva(200,50%,50%,0.5)').asColor(64, 106, 128, 0.5);
    itParses('hsva(200,50,50,0.5)').asColor(64, 106, 128, 0.5);
    itParses('HSVA(200,50,50,0.5)').asColor(64, 106, 128, 0.5);
    itParses('hsba(200,50%,50%,0.5)').asColor(64, 106, 128, 0.5);
    itParses('HsBa(200,50%,50%,0.5)').asColor(64, 106, 128, 0.5);
    itParses('hsva(200,50%,50%,.5)').asColor(64, 106, 128, 0.5);
    itParses('hsva(200.5,50.5,50.5,.5)').asColor(64, 107, 129, 0.5);
    itParses('hsva(200,50%,50%,)').asUndefined();
    itParses('hsva($h,$s,$v,$a)').asInvalid();
    itParses('hsva($h,0%,0%,0)').asInvalid();
    itParses('hsva(0,$s,0%,0)').asInvalid();
    itParses('hsva(0,0%,$v,0)').asInvalid();
    itParses('hsva($h,$s,$v,$a)').withContext({
      '$h': '200',
      '$s': '50%',
      '$v': '50%',
      '$a': '0.5'
    }).asColor(64, 106, 128, 0.5);
    itParses('hcg(200,50%,50%)').asColor(64, 149, 191);
    itParses('HCG(200,50%,50%)').asColor(64, 149, 191);
    itParses('hcg(200,50,50)').asColor(64, 149, 191);
    itParses('hcg(200.5,50.5,50.5)').asColor(64, 150, 193);
    itParses('hcg($h,$c,$g,)').asUndefined();
    itParses('hcg($h,$c,$g)').asInvalid();
    itParses('hcg($h,0%,0%)').asInvalid();
    itParses('hcg(0,$c,0%)').asInvalid();
    itParses('hcg(0,0%,$g)').asInvalid();
    itParses('hcg($h,$c,$g)').withContext({
      '$h': '200',
      '$c': '50%',
      '$g': '50%'
    }).asColor(64, 149, 191);
    itParses('hcga(200,50%,50%,0.5)').asColor(64, 149, 191, 0.5);
    itParses('hcga(200,50,50,0.5)').asColor(64, 149, 191, 0.5);
    itParses('HCGA(200,50,50,0.5)').asColor(64, 149, 191, 0.5);
    itParses('hcga(200,50%,50%,.5)').asColor(64, 149, 191, 0.5);
    itParses('hcga(200.5,50.5,50.5,.5)').asColor(64, 150, 193, 0.5);
    itParses('hcga(200,50%,50%,)').asUndefined();
    itParses('hcga($h,$c,$g,$a)').asInvalid();
    itParses('hcga($h,0%,0%,0)').asInvalid();
    itParses('hcga(0,$c,0%,0)').asInvalid();
    itParses('hcga(0,0%,$g,0)').asInvalid();
    itParses('hcga($h,$c,$g,$a)').withContext({
      '$h': '200',
      '$c': '50%',
      '$g': '50%',
      '$a': '0.5'
    }).asColor(64, 149, 191, 0.5);
    itParses('hwb(210,40%,40%)').asColor(102, 128, 153);
    itParses('hwb(210,40,40)').asColor(102, 128, 153);
    itParses('HWB(210,40,40)').asColor(102, 128, 153);
    itParses('hWb(210,40,40)').asColor(102, 128, 153);
    itParses('hwb(210,40%,40%, 0.5)').asColor(102, 128, 153, 0.5);
    itParses('hwb(210.5,40.5,40.5)').asColor(103, 128, 152);
    itParses('hwb(210.5,40.5%,40.5%, 0.5)').asColor(103, 128, 152, 0.5);
    itParses('hwb($h,$w,$b,)').asUndefined();
    itParses('hwb($h,$w,$b)').asInvalid();
    itParses('hwb($h,0%,0%)').asInvalid();
    itParses('hwb(0,$w,0%)').asInvalid();
    itParses('hwb(0,0%,$b)').asInvalid();
    itParses('hwb($h,0%,0%,0)').asInvalid();
    itParses('hwb(0,$w,0%,0)').asInvalid();
    itParses('hwb(0,0%,$b,0)').asInvalid();
    itParses('hwb(0,0%,0%,$a)').asInvalid();
    itParses('hwb($h,$w,$b)').withContext({
      '$h': '210',
      '$w': '40%',
      '$b': '40%'
    }).asColor(102, 128, 153);
    itParses('hwb($h,$w,$b,$a)').withContext({
      '$h': '210',
      '$w': '40%',
      '$b': '40%',
      '$a': '0.5'
    }).asColor(102, 128, 153, 0.5);
    itParses('cmyk(0,0.5,1,0)').asColor('#ff7f00');
    itParses('CMYK(0,0.5,1,0)').asColor('#ff7f00');
    itParses('cMyK(0,0.5,1,0)').asColor('#ff7f00');
    itParses('cmyk(c,m,y,k)').withContext({
      'c': '0',
      'm': '0.5',
      'y': '1',
      'k': '0'
    }).asColor('#ff7f00');
    itParses('cmyk(c,m,y,k)').asInvalid();
    itParses('gray(100%)').asColor(255, 255, 255);
    itParses('gray(100)').asColor(255, 255, 255);
    itParses('GRAY(100)').asColor(255, 255, 255);
    itParses('gRaY(100)').asColor(255, 255, 255);
    itParses('gray(100%, 0.5)').asColor(255, 255, 255, 0.5);
    itParses('gray($c, $a,)').asUndefined();
    itParses('gray($c, $a)').asInvalid();
    itParses('gray(0%, $a)').asInvalid();
    itParses('gray($c, 0)').asInvalid();
    itParses('gray($c, $a)').withContext({
      '$c': '100%',
      '$a': '0.5'
    }).asColor(255, 255, 255, 0.5);
    itParses('yellowgreen').asColor('#9acd32');
    itParses('YELLOWGREEN').asColor('#9acd32');
    itParses('yellowGreen').asColor('#9acd32');
    itParses('YellowGreen').asColor('#9acd32');
    itParses('yellow_green').asColor('#9acd32');
    itParses('YELLOW_GREEN').asColor('#9acd32');
    itParses('>YELLOW_GREEN').asColor('#9acd32');
    itParses('darken(cyan, 20%)').asColor(0, 153, 153);
    itParses('darken(cyan, 20)').asColor(0, 153, 153);
    itParses('darken(#fff, 100%)').asColor(0, 0, 0);
    itParses('darken(cyan, $r)').asInvalid();
    itParses('darken($c, $r)').withContext({
      '$c': asColor('hsv($h, $s, $v)'),
      '$r': '1'
    }).asInvalid();
    itParses('darken($c, $r)').withContext({
      '$c': asColor('cyan'),
      '$r': '20%'
    }).asColor(0, 153, 153);
    itParses('darken($a, $r)').withContext({
      '$a': asColor('rgba($c, 1)'),
      '$c': asColor('cyan'),
      '$r': '20%'
    }).asColor(0, 153, 153);
    itParses('lighten(cyan, 20%)').asColor(102, 255, 255);
    itParses('lighten(cyan, 20)').asColor(102, 255, 255);
    itParses('lighten(#000, 100%)').asColor(255, 255, 255);
    itParses('lighten(cyan, $r)').asInvalid();
    itParses('lighten($c, $r)').withContext({
      '$c': asColor('hsv($h, $s, $v)'),
      '$r': '1'
    }).asInvalid();
    itParses('lighten($c, $r)').withContext({
      '$c': asColor('cyan'),
      '$r': '20%'
    }).asColor(102, 255, 255);
    itParses('lighten($a, $r)').withContext({
      '$a': asColor('rgba($c, 1)'),
      '$c': asColor('cyan'),
      '$r': '20%'
    }).asColor(102, 255, 255);
    itParses('transparentize(cyan, 50%)').asColor(0, 255, 255, 0.5);
    itParses('transparentize(cyan, 50)').asColor(0, 255, 255, 0.5);
    itParses('transparentize(cyan, 0.5)').asColor(0, 255, 255, 0.5);
    itParses('transparentize(cyan, .5)').asColor(0, 255, 255, 0.5);
    itParses('fadeout(cyan, 0.5)').asColor(0, 255, 255, 0.5);
    itParses('fade-out(cyan, 0.5)').asColor(0, 255, 255, 0.5);
    itParses('fade_out(cyan, 0.5)').asColor(0, 255, 255, 0.5);
    itParses('fadeout(cyan, .5)').asColor(0, 255, 255, 0.5);
    itParses('fadeout(cyan, @r)').asInvalid();
    itParses('fadeout($c, $r)').withContext({
      '$c': asColor('hsv($h, $s, $v)'),
      '$r': '1'
    }).asInvalid();
    itParses('fadeout(@c, @r)').withContext({
      '@c': asColor('cyan'),
      '@r': '0.5'
    }).asColor(0, 255, 255, 0.5);
    itParses('fadeout(@a, @r)').withContext({
      '@a': asColor('rgba(@c, 1)'),
      '@c': asColor('cyan'),
      '@r': '0.5'
    }).asColor(0, 255, 255, 0.5);
    itParses('opacify(0x7800FFFF, 50%)').asColor(0, 255, 255, 1);
    itParses('opacify(0x7800FFFF, 50)').asColor(0, 255, 255, 1);
    itParses('opacify(0x7800FFFF, 0.5)').asColor(0, 255, 255, 1);
    itParses('opacify(0x7800FFFF, .5)').asColor(0, 255, 255, 1);
    itParses('fadein(0x7800FFFF, 0.5)').asColor(0, 255, 255, 1);
    itParses('fade-in(0x7800FFFF, 0.5)').asColor(0, 255, 255, 1);
    itParses('fade_in(0x7800FFFF, 0.5)').asColor(0, 255, 255, 1);
    itParses('fadein(0x7800FFFF, .5)').asColor(0, 255, 255, 1);
    itParses('fadein(0x7800FFFF, @r)').asInvalid();
    itParses('fadein($c, $r)').withContext({
      '$c': asColor('hsv($h, $s, $v)'),
      '$r': '1'
    }).asInvalid();
    itParses('fadein(@c, @r)').withContext({
      '@c': asColor('0x7800FFFF'),
      '@r': '0.5'
    }).asColor(0, 255, 255, 1);
    itParses('fadein(@a, @r)').withContext({
      '@a': asColor('rgba(@c, 1)'),
      '@c': asColor('0x7800FFFF'),
      '@r': '0.5'
    }).asColor(0, 255, 255, 1);
    itParses('saturate(#855, 20%)').asColor(158, 63, 63);
    itParses('saturate(#855, 20)').asColor(158, 63, 63);
    itParses('saturate(#855, 0.2)').asColor(158, 63, 63);
    itParses('saturate(#855, @r)').asInvalid();
    itParses('saturate($c, $r)').withContext({
      '$c': asColor('hsv($h, $s, $v)'),
      '$r': '1'
    }).asInvalid();
    itParses('saturate(@c, @r)').withContext({
      '@c': asColor('#855'),
      '@r': '0.2'
    }).asColor(158, 63, 63);
    itParses('saturate(@a, @r)').withContext({
      '@a': asColor('rgba(@c, 1)'),
      '@c': asColor('#855'),
      '@r': '0.2'
    }).asColor(158, 63, 63);
    itParses('desaturate(#9e3f3f, 20%)').asColor(136, 85, 85);
    itParses('desaturate(#9e3f3f, 20)').asColor(136, 85, 85);
    itParses('desaturate(#9e3f3f, 0.2)').asColor(136, 85, 85);
    itParses('desaturate(#9e3f3f, .2)').asColor(136, 85, 85);
    itParses('desaturate(#9e3f3f, @r)').asInvalid();
    itParses('desaturate($c, $r)').withContext({
      '$c': asColor('hsv($h, $s, $v)'),
      '$r': '1'
    }).asInvalid();
    itParses('desaturate(@c, @r)').withContext({
      '@c': asColor('#9e3f3f'),
      '@r': '0.2'
    }).asColor(136, 85, 85);
    itParses('desaturate(@a, @r)').withContext({
      '@a': asColor('rgba(@c, 1)'),
      '@c': asColor('#9e3f3f'),
      '@r': '0.2'
    }).asColor(136, 85, 85);
    itParses('grayscale(#9e3f3f)').asColor(111, 111, 111);
    itParses('greyscale(#9e3f3f)').asColor(111, 111, 111);
    itParses('grayscale(@c)').asInvalid();
    itParses('grayscale($c)').withContext({
      '$c': asColor('hsv($h, $s, $v)')
    }).asInvalid();
    itParses('grayscale(@c)').withContext({
      '@c': asColor('#9e3f3f')
    }).asColor(111, 111, 111);
    itParses('grayscale(@a)').withContext({
      '@a': asColor('rgba(@c, 1)'),
      '@c': asColor('#9e3f3f')
    }).asColor(111, 111, 111);
    itParses('invert(#9e3f3f)').asColor(97, 192, 192);
    itParses('invert(@c)').asInvalid();
    itParses('invert($c)').withContext({
      '$c': asColor('hsv($h, $s, $v)')
    }).asInvalid();
    itParses('invert(@c)').withContext({
      '@c': asColor('#9e3f3f')
    }).asColor(97, 192, 192);
    itParses('invert(@a)').withContext({
      '@a': asColor('rgba(@c, 1)'),
      '@c': asColor('#9e3f3f')
    }).asColor(97, 192, 192);
    itParses('adjust-hue(#811, 45deg)').asColor(136, 106, 17);
    itParses('adjust-hue(#811, -45deg)').asColor(136, 17, 106);
    itParses('adjust-hue(#811, 45%)').asColor(136, 106, 17);
    itParses('adjust-hue(#811, -45%)').asColor(136, 17, 106);
    itParses('adjust-hue(#811, 45)').asColor(136, 106, 17);
    itParses('adjust-hue(#811, -45)').asColor(136, 17, 106);
    itParses('adjust-hue($c, $r)').asInvalid();
    itParses('adjust-hue($c, $r)').withContext({
      '$c': asColor('hsv($h, $s, $v)'),
      '$r': '1'
    }).asInvalid();
    itParses('adjust-hue($c, $r)').withContext({
      '$c': asColor('#811'),
      '$r': '-45deg'
    }).asColor(136, 17, 106);
    itParses('adjust-hue($a, $r)').withContext({
      '$a': asColor('rgba($c, 0.5)'),
      '$c': asColor('#811'),
      '$r': '-45deg'
    }).asColor(136, 17, 106, 0.5);
    itParses('mix(rgb(255,0,0), blue)').asColor(127, 0, 127);
    itParses('mix(red, rgb(0,0,255), 25%)').asColor(63, 0, 191);
    itParses('mix(#ff0000, 0x0000ff)').asColor('#7f007f');
    itParses('mix(#ff0000, 0x0000ff, 25%)').asColor('#3f00bf');
    itParses('mix(red, rgb(0,0,255), 25)').asColor(63, 0, 191);
    itParses('mix($a, $b, $r)').asInvalid();
    itParses('mix($a, $b, $r)').withContext({
      '$a': asColor('hsv($h, $s, $v)'),
      '$b': asColor('blue'),
      '$r': '25%'
    }).asInvalid();
    itParses('mix($a, $b, $r)').withContext({
      '$a': asColor('blue'),
      '$b': asColor('hsv($h, $s, $v)'),
      '$r': '25%'
    }).asInvalid();
    itParses('mix($a, $b, $r)').withContext({
      '$a': asColor('red'),
      '$b': asColor('blue'),
      '$r': '25%'
    }).asColor(63, 0, 191);
    itParses('mix($c, $d, $r)').withContext({
      '$a': asColor('red'),
      '$b': asColor('blue'),
      '$c': asColor('rgba($a, 1)'),
      '$d': asColor('rgba($b, 1)'),
      '$r': '25%'
    }).asColor(63, 0, 191);
    describe('stylus and less', function() {
      beforeEach(function() {
        return this.scope = 'styl';
      });
      itParses('tint(#fd0cc7,66%)').asColor(254, 172, 235);
      itParses('tint(#fd0cc7,66)').asColor(254, 172, 235);
      itParses('tint($c,$r)').asInvalid();
      itParses('tint($c, $r)').withContext({
        '$c': asColor('hsv($h, $s, $v)'),
        '$r': '1'
      }).asInvalid();
      itParses('tint($c,$r)').withContext({
        '$c': asColor('#fd0cc7'),
        '$r': '66%'
      }).asColor(254, 172, 235);
      itParses('tint($c,$r)').withContext({
        '$a': asColor('#fd0cc7'),
        '$c': asColor('rgba($a, 0.9)'),
        '$r': '66%'
      }).asColor(254, 172, 235, 0.966);
      itParses('shade(#fd0cc7,66%)').asColor(86, 4, 67);
      itParses('shade(#fd0cc7,66)').asColor(86, 4, 67);
      itParses('shade($c,$r)').asInvalid();
      itParses('shade($c, $r)').withContext({
        '$c': asColor('hsv($h, $s, $v)'),
        '$r': '1'
      }).asInvalid();
      itParses('shade($c,$r)').withContext({
        '$c': asColor('#fd0cc7'),
        '$r': '66%'
      }).asColor(86, 4, 67);
      return itParses('shade($c,$r)').withContext({
        '$a': asColor('#fd0cc7'),
        '$c': asColor('rgba($a, 0.9)'),
        '$r': '66%'
      }).asColor(86, 4, 67, 0.966);
    });
    describe('scss and sass', function() {
      describe('with compass implementation', function() {
        beforeEach(function() {
          return this.scope = 'sass:compass';
        });
        itParses('tint(#BADA55, 42%)').asColor('#e2efb7');
        itParses('tint(#BADA55, 42)').asColor('#e2efb7');
        itParses('tint($c,$r)').asInvalid();
        itParses('tint($c, $r)').withContext({
          '$c': asColor('hsv($h, $s, $v)'),
          '$r': '1'
        }).asInvalid();
        itParses('tint($c,$r)').withContext({
          '$c': asColor('#BADA55'),
          '$r': '42%'
        }).asColor('#e2efb7');
        itParses('tint($c,$r)').withContext({
          '$a': asColor('#BADA55'),
          '$c': asColor('rgba($a, 0.9)'),
          '$r': '42%'
        }).asColor(226, 239, 183, 0.942);
        itParses('shade(#663399, 42%)').asColor('#2a1540');
        itParses('shade(#663399, 42)').asColor('#2a1540');
        itParses('shade($c,$r)').asInvalid();
        itParses('shade($c, $r)').withContext({
          '$c': asColor('hsv($h, $s, $v)'),
          '$r': '1'
        }).asInvalid();
        itParses('shade($c,$r)').withContext({
          '$c': asColor('#663399'),
          '$r': '42%'
        }).asColor('#2a1540');
        return itParses('shade($c,$r)').withContext({
          '$a': asColor('#663399'),
          '$c': asColor('rgba($a, 0.9)'),
          '$r': '42%'
        }).asColor(0x2a, 0x15, 0x40, 0.942);
      });
      return describe('with bourbon implementation', function() {
        beforeEach(function() {
          return this.scope = 'sass:bourbon';
        });
        itParses('tint(#BADA55, 42%)').asColor(214, 233, 156);
        itParses('tint(#BADA55, 42)').asColor(214, 233, 156);
        itParses('tint($c,$r)').asInvalid();
        itParses('tint($c, $r)').withContext({
          '$c': asColor('hsv($h, $s, $v)'),
          '$r': '1'
        }).asInvalid();
        itParses('tint($c,$r)').withContext({
          '$c': asColor('#BADA55'),
          '$r': '42%'
        }).asColor(214, 233, 156);
        itParses('tint($c,$r)').withContext({
          '$a': asColor('#BADA55'),
          '$c': asColor('rgba($a, 0.9)'),
          '$r': '42%'
        }).asColor(214, 233, 156, 0.942);
        itParses('shade(#663399, 42%)').asColor(59, 29, 88);
        itParses('shade(#663399, 42)').asColor(59, 29, 88);
        itParses('shade($c,$r)').asInvalid();
        itParses('shade($c, $r)').withContext({
          '$c': asColor('hsv($h, $s, $v)'),
          '$r': '1'
        }).asInvalid();
        itParses('shade($c,$r)').withContext({
          '$c': asColor('#663399'),
          '$r': '42%'
        }).asColor(59, 29, 88);
        return itParses('shade($c,$r)').withContext({
          '$a': asColor('#663399'),
          '$c': asColor('rgba($a, 0.9)'),
          '$r': '42%'
        }).asColor(59, 29, 88, 0.942);
      });
    });
    itParses('adjust-color(#102030, $red: -5, $blue: 5)', 11, 32, 53);
    itParses('adjust-color(hsl(25, 100%, 80%), $lightness: -30%, $alpha: -0.4)', 255, 106, 0, 0.6);
    itParses('adjust-color($c, $red: $a, $blue: $b)').asInvalid();
    itParses('adjust-color($d, $red: $a, $blue: $b)').withContext({
      '$a': '-5',
      '$b': '5',
      '$d': asColor('rgba($c, 1)')
    }).asInvalid();
    itParses('adjust-color($c, $red: $a, $blue: $b)').withContext({
      '$a': '-5',
      '$b': '5',
      '$c': asColor('#102030')
    }).asColor(11, 32, 53);
    itParses('adjust-color($d, $red: $a, $blue: $b)').withContext({
      '$a': '-5',
      '$b': '5',
      '$c': asColor('#102030'),
      '$d': asColor('rgba($c, 1)')
    }).asColor(11, 32, 53);
    itParses('scale-color(rgb(200, 150, 170), $green: -40%, $blue: 70%)').asColor(200, 90, 230);
    itParses('change-color(rgb(200, 150, 170), $green: 40, $blue: 70)').asColor(200, 40, 70);
    itParses('scale-color($c, $green: $a, $blue: $b)').asInvalid();
    itParses('scale-color($d, $green: $a, $blue: $b)').withContext({
      '$a': '-40%',
      '$b': '70%',
      '$d': asColor('rgba($c, 1)')
    }).asInvalid();
    itParses('scale-color($c, $green: $a, $blue: $b)').withContext({
      '$a': '-40%',
      '$b': '70%',
      '$c': asColor('rgb(200, 150, 170)')
    }).asColor(200, 90, 230);
    itParses('scale-color($d, $green: $a, $blue: $b)').withContext({
      '$a': '-40%',
      '$b': '70%',
      '$c': asColor('rgb(200, 150, 170)'),
      '$d': asColor('rgba($c, 1)')
    }).asColor(200, 90, 230);
    itParses('spin(#F00, 120)').asColor(0, 255, 0);
    itParses('spin(#F00, 120)').asColor(0, 255, 0);
    itParses('spin(#F00, 120deg)').asColor(0, 255, 0);
    itParses('spin(#F00, -120)').asColor(0, 0, 255);
    itParses('spin(#F00, -120deg)').asColor(0, 0, 255);
    itParses('spin(@c, @a)').withContext({
      '@c': asColor('#F00'),
      '@a': '120'
    }).asColor(0, 255, 0);
    itParses('spin(@c, @a)').withContext({
      '@a': '120'
    }).asInvalid();
    itParses('spin(@c, @a)').withContext({
      '@a': '120'
    }).asInvalid();
    itParses('spin(@c, @a,)').asUndefined();
    itParses('fade(#F00, 0.5)').asColor(255, 0, 0, 0.5);
    itParses('fade(#F00, 50%)').asColor(255, 0, 0, 0.5);
    itParses('fade(#F00, 50)').asColor(255, 0, 0, 0.5);
    itParses('fade(@c, @a)').withContext({
      '@c': asColor('#F00'),
      '@a': '0.5'
    }).asColor(255, 0, 0, 0.5);
    itParses('fade(@c, @a)').withContext({
      '@a': '0.5'
    }).asInvalid();
    itParses('fade(@c, @a)').withContext({
      '@a': '0.5'
    }).asInvalid();
    itParses('fade(@c, @a,)').asUndefined();
    itParses('contrast(#bbbbbb)').asColor(0, 0, 0);
    itParses('contrast(#333333)').asColor(255, 255, 255);
    itParses('contrast(#bbbbbb, rgb(20,20,20))').asColor(20, 20, 20);
    itParses('contrast(#333333, rgb(20,20,20), rgb(140,140,140))').asColor(140, 140, 140);
    itParses('contrast(#666666, rgb(20,20,20), rgb(140,140,140), 13%)').asColor(140, 140, 140);
    itParses('contrast(@base)').withContext({
      '@base': asColor('#bbbbbb')
    }).asColor(0, 0, 0);
    itParses('contrast(@base)').withContext({
      '@base': asColor('#333333')
    }).asColor(255, 255, 255);
    itParses('contrast(@base, @dark)').withContext({
      '@base': asColor('#bbbbbb'),
      '@dark': asColor('rgb(20,20,20)')
    }).asColor(20, 20, 20);
    itParses('contrast(@base, @dark, @light)').withContext({
      '@base': asColor('#333333'),
      '@dark': asColor('rgb(20,20,20)'),
      '@light': asColor('rgb(140,140,140)')
    }).asColor(140, 140, 140);
    itParses('contrast(@base, @dark, @light, @threshold)').withContext({
      '@base': asColor('#666666'),
      '@dark': asColor('rgb(20,20,20)'),
      '@light': asColor('rgb(140,140,140)'),
      '@threshold': '13%'
    }).asColor(140, 140, 140);
    itParses('contrast(@base)').asInvalid();
    itParses('contrast(@base)').asInvalid();
    itParses('contrast(@base, @dark)').asInvalid();
    itParses('contrast(@base, @dark, @light)').asInvalid();
    itParses('contrast(@base, @dark, @light, @threshold)').asInvalid();
    itParses('multiply(#ff6600, 0x666666)').asColor('#662900');
    itParses('multiply(@base, @modifier)').withContext({
      '@base': asColor('#ff6600'),
      '@modifier': asColor('#666666')
    }).asColor('#662900');
    itParses('multiply(@base, @modifier)').asInvalid();
    itParses('screen(#ff6600, 0x666666)').asColor('#ffa366');
    itParses('screen(@base, @modifier)').withContext({
      '@base': asColor('#ff6600'),
      '@modifier': asColor('#666666')
    }).asColor('#ffa366');
    itParses('screen(@base, @modifier)').asInvalid();
    itParses('overlay(#ff6600, 0x666666)').asColor('#ff5200');
    itParses('overlay(@base, @modifier)').withContext({
      '@base': asColor('#ff6600'),
      '@modifier': asColor('#666666')
    }).asColor('#ff5200');
    itParses('overlay(@base, @modifier)').asInvalid();
    itParses('softlight(#ff6600, 0x666666)').asColor('#ff5a00');
    itParses('softlight(@base, @modifier)').withContext({
      '@base': asColor('#ff6600'),
      '@modifier': asColor('#666666')
    }).asColor('#ff5a00');
    itParses('softlight(@base, @modifier)').asInvalid();
    itParses('hardlight(#ff6600, 0x666666)').asColor('#cc5200');
    itParses('hardlight(@base, @modifier)').withContext({
      '@base': asColor('#ff6600'),
      '@modifier': asColor('#666666')
    }).asColor('#cc5200');
    itParses('hardlight(@base, @modifier)').asInvalid();
    itParses('difference(#ff6600, 0x666666)').asColor('#990066');
    itParses('difference(#ff6600,)()').asInvalid();
    itParses('difference(@base, @modifier)').withContext({
      '@base': asColor('#ff6600'),
      '@modifier': asColor('#666666')
    }).asColor('#990066');
    itParses('difference(@base, @modifier)').asInvalid();
    itParses('exclusion(#ff6600, 0x666666)').asColor('#997a66');
    itParses('exclusion(@base, @modifier)').withContext({
      '@base': asColor('#ff6600'),
      '@modifier': asColor('#666666')
    }).asColor('#997a66');
    itParses('exclusion(@base, @modifier)').asInvalid();
    itParses('average(#ff6600, 0x666666)').asColor('#b36633');
    itParses('average(@base, @modifier)').withContext({
      '@base': asColor('#ff6600'),
      '@modifier': asColor('#666666')
    }).asColor('#b36633');
    itParses('average(@base, @modifier)').asInvalid();
    itParses('average(@gradient-b, @gradient-mean)').withContext({
      '@gradient-a': asColor('#00d38b'),
      '@gradient-b': asColor('#009285'),
      '@gradient-mean': asColor('average(@gradient-a, @gradient-b)')
    }).asColor('#00a287');
    itParses('negation(#ff6600, 0x666666)').asColor('#99cc66');
    itParses('negation(@base, @modifier)').withContext({
      '@base': asColor('#ff6600'),
      '@modifier': asColor('#666666')
    }).asColor('#99cc66');
    itParses('negation(@base, @modifier)').asInvalid();
    itParses('blend(rgba(#FFDE00,.42), 0x19C261)').asColor('#7ace38');
    itParses('blend(@top, @bottom)').withContext({
      '@top': asColor('rgba(#FFDE00,.42)'),
      '@bottom': asColor('0x19C261')
    }).asColor('#7ace38');
    itParses('blend(@top, @bottom)').asInvalid();
    itParses('complement(red)').asColor('#00ffff');
    itParses('complement(@base)').withContext({
      '@base': asColor('red')
    }).asColor('#00ffff');
    itParses('complement(@base)').asInvalid();
    itParses('transparentify(#808080)').asColor(0, 0, 0, 0.5);
    itParses('transparentify(#414141, black)').asColor(255, 255, 255, 0.25);
    itParses('transparentify(#91974C, 0xF34949, 0.5)').asColor(47, 229, 79, 0.5);
    itParses('transparentify(a)').withContext({
      'a': asColor('#808080')
    }).asColor(0, 0, 0, 0.5);
    itParses('transparentify(a, b, 0.5)').withContext({
      'a': asColor('#91974C'),
      'b': asColor('#F34949')
    }).asColor(47, 229, 79, 0.5);
    itParses('transparentify(a)').asInvalid();
    itParses('red(#000, 255)').asColor(255, 0, 0);
    itParses('red(a, b)').withContext({
      'a': asColor('#000'),
      'b': '255'
    }).asColor(255, 0, 0);
    itParses('red(a, b)').asInvalid();
    itParses('green(#000, 255)').asColor(0, 255, 0);
    itParses('green(a, b)').withContext({
      'a': asColor('#000'),
      'b': '255'
    }).asColor(0, 255, 0);
    itParses('green(a, b)').asInvalid();
    itParses('blue(#000, 255)').asColor(0, 0, 255);
    itParses('blue(a, b)').withContext({
      'a': asColor('#000'),
      'b': '255'
    }).asColor(0, 0, 255);
    itParses('blue(a, b)').asInvalid();
    itParses('alpha(#000, 0.5)').asColor(0, 0, 0, 0.5);
    itParses('alpha(a, b)').withContext({
      'a': asColor('#000'),
      'b': '0.5'
    }).asColor(0, 0, 0, 0.5);
    itParses('alpha(a, b)').asInvalid();
    itParses('hue(#00c, 90deg)').asColor(0x66, 0xCC, 0);
    itParses('hue(a, b)').withContext({
      'a': asColor('#00c'),
      'b': '90deg'
    }).asColor(0x66, 0xCC, 0);
    itParses('hue(a, b)').asInvalid();
    itParses('saturation(#00c, 50%)').asColor(0x33, 0x33, 0x99);
    itParses('saturation(a, b)').withContext({
      'a': asColor('#00c'),
      'b': '50%'
    }).asColor(0x33, 0x33, 0x99);
    itParses('saturation(a, b)').asInvalid();
    itParses('lightness(#00c, 80%)').asColor(0x99, 0x99, 0xff);
    itParses('lightness(a, b)').withContext({
      'a': asColor('#00c'),
      'b': '80%'
    }).asColor(0x99, 0x99, 0xff);
    itParses('lightness(a, b)').asInvalid();
    describe('CSS color function', function() {
      beforeEach(function() {
        return this.scope = 'css';
      });
      itParses('color(#fd0cc7 tint(66%))').asColor(254, 172, 236);
      itParses('COLOR(#fd0cc7 tint(66%))').asColor(254, 172, 236);
      itParses('cOlOr(#fd0cc7 tint(66%))').asColor(254, 172, 236);
      return itParses('color(var(--foo) tint(66%))').withContext({
        'var(--foo)': asColor('#fd0cc7')
      }).asColor(254, 172, 236);
    });
    describe('lua color', function() {
      beforeEach(function() {
        return this.scope = 'lua';
      });
      itParses('Color(255, 0, 0, 255)').asColor(255, 0, 0);
      itParses('Color(r, g, b, a)').withContext({
        'r': '255',
        'g': '0',
        'b': '0',
        'a': '255'
      }).asColor(255, 0, 0);
      return itParses('Color(r, g, b, a)').asInvalid();
    });
    describe('elm-lang support', function() {
      beforeEach(function() {
        return this.scope = 'elm';
      });
      itParses('rgba 255 0 0 1').asColor(255, 0, 0);
      itParses('rgba r g b a').withContext({
        'r': '255',
        'g': '0',
        'b': '0',
        'a': '1'
      }).asColor(255, 0, 0);
      itParses('rgba r g b a').asInvalid();
      itParses('rgb 255 0 0').asColor(255, 0, 0);
      itParses('rgb r g b').withContext({
        'r': '255',
        'g': '0',
        'b': '0'
      }).asColor(255, 0, 0);
      itParses('rgb r g b').asInvalid();
      itParses('hsla (degrees 200) 50 50 0.5').asColor(64, 149, 191, 0.5);
      itParses('hsla (degrees h) s l a').withContext({
        'h': '200',
        's': '50',
        'l': '50',
        'a': '0.5'
      }).asColor(64, 149, 191, 0.5);
      itParses('hsla (degrees h) s l a').asInvalid();
      itParses('hsla 3.49 50 50 0.5').asColor(64, 149, 191, 0.5);
      itParses('hsla h s l a').withContext({
        'h': '3.49',
        's': '50',
        'l': '50',
        'a': '0.5'
      }).asColor(64, 149, 191, 0.5);
      itParses('hsla h s l a').asInvalid();
      itParses('hsl (degrees 200) 50 50').asColor(64, 149, 191);
      itParses('hsl (degrees h) s l').withContext({
        'h': '200',
        's': '50',
        'l': '50'
      }).asColor(64, 149, 191);
      itParses('hsl (degrees h) s l').asInvalid();
      itParses('hsl 3.49 50 50').asColor(64, 149, 191);
      itParses('hsl h s l').withContext({
        'h': '3.49',
        's': '50',
        'l': '50'
      }).asColor(64, 149, 191);
      itParses('hsl h s l').asInvalid();
      itParses('grayscale 1').asColor(0, 0, 0);
      itParses('greyscale 0.5').asColor(127, 127, 127);
      itParses('grayscale 0').asColor(255, 255, 255);
      itParses('grayscale g').withContext({
        'g': '0.5'
      }).asColor(127, 127, 127);
      itParses('grayscale g').asInvalid();
      itParses('complement rgb 255 0 0').asColor('#00ffff');
      itParses('complement base').withContext({
        'base': asColor('red')
      }).asColor('#00ffff');
      return itParses('complement base').asInvalid();
    });
    describe('latex support', function() {
      beforeEach(function() {
        return this.scope = 'tex';
      });
      itParses('[gray]{1}').asColor('#ffffff');
      itParses('[rgb]{1,0.5,0}').asColor('#ff7f00');
      itParses('[RGB]{255,127,0}').asColor('#ff7f00');
      itParses('[cmyk]{0,0.5,1,0}').asColor('#ff7f00');
      itParses('[HTML]{ff7f00}').asColor('#ff7f00');
      itParses('{blue}').asColor('#0000ff');
      itParses('{blue!20}').asColor('#ccccff');
      itParses('{blue!20!black}').asColor('#000033');
      return itParses('{blue!20!black!30!green}').asColor('#00590f');
    });
    describe('qt support', function() {
      beforeEach(function() {
        return this.scope = 'qml';
      });
      return itParses('Qt.rgba(1.0,1.0,0,0.5)').asColor(255, 255, 0, 0.5);
    });
    return describe('qt cpp support', function() {
      beforeEach(function() {
        return this.scope = 'cpp';
      });
      return itParses('Qt.rgba(1.0,1.0,0,0.5)').asColor(255, 255, 0, 0.5);
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvZGRld2V5Ly5hdG9tL3BhY2thZ2VzL3BpZ21lbnRzL3NwZWMvY29sb3ItcGFyc2VyLXNwZWMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxPQUFBLENBQVEsb0JBQVI7O0VBRUEsV0FBQSxHQUFjLE9BQUEsQ0FBUSxxQkFBUjs7RUFDZCxZQUFBLEdBQWUsT0FBQSxDQUFRLHNCQUFSOztFQUNmLGVBQUEsR0FBa0IsT0FBQSxDQUFRLHlCQUFSOztFQUNsQixRQUFBLEdBQVcsT0FBQSxDQUFRLDBCQUFSOztFQUVYLFFBQUEsQ0FBUyxhQUFULEVBQXdCLFNBQUE7QUFDdEIsUUFBQTtJQUFDLFNBQVU7SUFFWCxVQUFBLENBQVcsU0FBQTtBQUNULFVBQUE7TUFBQSxrQkFBQSxHQUFxQixRQUFRLENBQUMsYUFBVCxDQUF1Qix1QkFBdkI7YUFDckIsa0JBQWtCLENBQUMsTUFBbkIsR0FBNEIsQ0FBQyxHQUFEO0lBRm5CLENBQVg7SUFJQSxPQUFBLEdBQVUsU0FBQyxLQUFEO2FBQVcsUUFBQSxHQUFTO0lBQXBCO0lBRVYsU0FBQSxHQUFZLFNBQUMsT0FBRDtNQUNWLE9BQUEsR0FBYyxJQUFBLFlBQUEsbUJBQWEsVUFBVTtRQUFDLFVBQUEsUUFBRDtPQUF2QjthQUNkLE9BQU8sQ0FBQztJQUZFO0lBSVosUUFBQSxHQUFXLFNBQUMsVUFBRDthQUNUO1FBQUEsV0FBQSxFQUFhLEVBQWI7UUFDQSxPQUFBLEVBQVMsU0FBQyxDQUFELEVBQUcsQ0FBSCxFQUFLLENBQUwsRUFBTyxDQUFQO0FBQ1AsY0FBQTs7WUFEYyxJQUFFOztVQUNoQixPQUFBLEdBQVUsSUFBQyxDQUFBO2lCQUNYLFFBQUEsQ0FBUyxJQUFDLENBQUEsV0FBVixFQUF1QixTQUFBO1lBQ3JCLFVBQUEsQ0FBVyxTQUFBO3FCQUFHLE1BQUEsR0FBUyxTQUFBLENBQVUsT0FBVjtZQUFaLENBQVg7bUJBRUEs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RUEsUUFBQSxDQUFTLHdCQUFULENBQWtDLENBQUMsT0FBbkMsQ0FBMkMsR0FBM0MsRUFBZ0QsR0FBaEQsRUFBcUQsQ0FBckQsRUFBd0QsR0FBeEQ7SUFIcUIsQ0FBdkI7V0FLQSxRQUFBLENBQVMsZ0JBQVQsRUFBMkIsU0FBQTtNQUN6QixVQUFBLENBQVcsU0FBQTtlQUFHLElBQUMsQ0FBQSxLQUFELEdBQVM7TUFBWixDQUFYO2FBRUEsUUFBQSxDQUFTLHdCQUFULENBQWtDLENBQUMsT0FBbkMsQ0FBMkMsR0FBM0MsRUFBZ0QsR0FBaEQsRUFBcUQsQ0FBckQsRUFBd0QsR0FBeEQ7SUFIeUIsQ0FBM0I7RUFuK0JzQixDQUF4QjtBQVBBIiwic291cmNlc0NvbnRlbnQiOlsicmVxdWlyZSAnLi9oZWxwZXJzL21hdGNoZXJzJ1xuXG5Db2xvclBhcnNlciA9IHJlcXVpcmUgJy4uL2xpYi9jb2xvci1wYXJzZXInXG5Db2xvckNvbnRleHQgPSByZXF1aXJlICcuLi9saWIvY29sb3ItY29udGV4dCdcbkNvbG9yRXhwcmVzc2lvbiA9IHJlcXVpcmUgJy4uL2xpYi9jb2xvci1leHByZXNzaW9uJ1xucmVnaXN0cnkgPSByZXF1aXJlICcuLi9saWIvY29sb3ItZXhwcmVzc2lvbnMnXG5cbmRlc2NyaWJlICdDb2xvclBhcnNlcicsIC0+XG4gIFtwYXJzZXJdID0gW11cblxuICBiZWZvcmVFYWNoIC0+XG4gICAgc3ZnQ29sb3JFeHByZXNzaW9uID0gcmVnaXN0cnkuZ2V0RXhwcmVzc2lvbigncGlnbWVudHM6bmFtZWRfY29sb3JzJylcbiAgICBzdmdDb2xvckV4cHJlc3Npb24uc2NvcGVzID0gWycqJ11cblxuICBhc0NvbG9yID0gKHZhbHVlKSAtPiBcImNvbG9yOiN7dmFsdWV9XCJcblxuICBnZXRQYXJzZXIgPSAoY29udGV4dCkgLT5cbiAgICBjb250ZXh0ID0gbmV3IENvbG9yQ29udGV4dChjb250ZXh0ID8ge3JlZ2lzdHJ5fSlcbiAgICBjb250ZXh0LnBhcnNlclxuXG4gIGl0UGFyc2VzID0gKGV4cHJlc3Npb24pIC0+XG4gICAgZGVzY3JpcHRpb246ICcnXG4gICAgYXNDb2xvcjogKHIsZyxiLGE9MSkgLT5cbiAgICAgIGNvbnRleHQgPSBAY29udGV4dFxuICAgICAgZGVzY3JpYmUgQGRlc2NyaXB0aW9uLCAtPlxuICAgICAgICBiZWZvcmVFYWNoIC0+IHBhcnNlciA9IGdldFBhcnNlcihjb250ZXh0KVxuXG4gICAgICAgIGl0IFwicGFyc2VzICcje2V4cHJlc3Npb259JyBhcyBhIGNvbG9yXCIsIC0+XG4gICAgICAgICAgZXhwZWN0KHBhcnNlci5wYXJzZShleHByZXNzaW9uLCBAc2NvcGUgPyAnbGVzcycpKS50b0JlQ29sb3IocixnLGIsYSlcblxuICAgIGFzVW5kZWZpbmVkOiAtPlxuICAgICAgY29udGV4dCA9IEBjb250ZXh0XG4gICAgICBkZXNjcmliZSBAZGVzY3JpcHRpb24sIC0+XG4gICAgICAgIGJlZm9yZUVhY2ggLT4gcGFyc2VyID0gZ2V0UGFyc2VyKGNvbnRleHQpXG5cbiAgICAgICAgaXQgXCJkb2VzIG5vdCBwYXJzZSAnI3tleHByZXNzaW9ufScgYW5kIHJldHVybiB1bmRlZmluZWRcIiwgLT5cbiAgICAgICAgICBleHBlY3QocGFyc2VyLnBhcnNlKGV4cHJlc3Npb24sIEBzY29wZSA/ICdsZXNzJykpLnRvQmVVbmRlZmluZWQoKVxuXG4gICAgYXNJbnZhbGlkOiAtPlxuICAgICAgY29udGV4dCA9IEBjb250ZXh0XG4gICAgICBkZXNjcmliZSBAZGVzY3JpcHRpb24sIC0+XG4gICAgICAgIGJlZm9yZUVhY2ggLT4gcGFyc2VyID0gZ2V0UGFyc2VyKGNvbnRleHQpXG5cbiAgICAgICAgaXQgXCJwYXJzZXMgJyN7ZXhwcmVzc2lvbn0nIGFzIGFuIGludmFsaWQgY29sb3JcIiwgLT5cbiAgICAgICAgICBleHBlY3QocGFyc2VyLnBhcnNlKGV4cHJlc3Npb24sIEBzY29wZSA/ICdsZXNzJykpLm5vdC50b0JlVmFsaWQoKVxuXG4gICAgd2l0aENvbnRleHQ6ICh2YXJpYWJsZXMpIC0+XG4gICAgICB2YXJzID0gW11cbiAgICAgIGNvbG9yVmFycyA9IFtdXG4gICAgICBwYXRoID0gXCIvcGF0aC90by9maWxlLnN0eWxcIlxuICAgICAgZm9yIG5hbWUsdmFsdWUgb2YgdmFyaWFibGVzXG4gICAgICAgIGlmIHZhbHVlLmluZGV4T2YoJ2NvbG9yOicpIGlzbnQgLTFcbiAgICAgICAgICB2YWx1ZSA9IHZhbHVlLnJlcGxhY2UoJ2NvbG9yOicsICcnKVxuICAgICAgICAgIHZhcnMucHVzaCB7bmFtZSwgdmFsdWUsIHBhdGh9XG4gICAgICAgICAgY29sb3JWYXJzLnB1c2gge25hbWUsIHZhbHVlLCBwYXRofVxuXG4gICAgICAgIGVsc2VcbiAgICAgICAgICB2YXJzLnB1c2gge25hbWUsIHZhbHVlLCBwYXRofVxuICAgICAgQGNvbnRleHQgPSB7dmFyaWFibGVzOiB2YXJzLCBjb2xvclZhcmlhYmxlczogY29sb3JWYXJzLCByZWdpc3RyeX1cbiAgICAgIEBkZXNjcmlwdGlvbiA9IFwid2l0aCB2YXJpYWJsZXMgY29udGV4dCAje2phc21pbmUucHAgdmFyaWFibGVzfSBcIlxuXG4gICAgICByZXR1cm4gdGhpc1xuXG4gIGl0UGFyc2VzKCdAbGlzdC1pdGVtLWhlaWdodCcpLndpdGhDb250ZXh0KHtcbiAgICAnQHRleHQtaGVpZ2h0JzogJ0BzY2FsZS1iLXh4bCAqIDFyZW0nXG4gICAgJ0Bjb21wb25lbnQtbGluZS1oZWlnaHQnOiAnQHRleHQtaGVpZ2h0J1xuICAgICdAbGlzdC1pdGVtLWhlaWdodCc6ICdAY29tcG9uZW50LWxpbmUtaGVpZ2h0J1xuICAgIH0pLmFzVW5kZWZpbmVkKClcblxuICBpdFBhcnNlcygnJHRleHQtY29sb3IgIWRlZmF1bHQnKS53aXRoQ29udGV4dCh7XG4gICAgJyR0ZXh0LWNvbG9yJzogYXNDb2xvciAnY3lhbidcbiAgfSkuYXNDb2xvcigwLDI1NSwyNTUpXG5cbiAgaXRQYXJzZXMoJ2MnKS53aXRoQ29udGV4dCh7J2MnOiAnYyd9KS5hc1VuZGVmaW5lZCgpXG4gIGl0UGFyc2VzKCdjJykud2l0aENvbnRleHQoe1xuICAgICdjJzogJ2QnXG4gICAgJ2QnOiAnZSdcbiAgICAnZSc6ICdjJ1xuICB9KS5hc1VuZGVmaW5lZCgpXG5cbiAgaXRQYXJzZXMoJyNmZjdmMDAnKS5hc0NvbG9yKDI1NSwgMTI3LCAwKVxuICBpdFBhcnNlcygnI2Y3MCcpLmFzQ29sb3IoMjU1LCAxMTksIDApXG5cbiAgaXRQYXJzZXMoJyNmZjdmMDBjYycpLmFzQ29sb3IoMjU1LCAxMjcsIDAsIDAuOClcbiAgaXRQYXJzZXMoJyNmNzBjJykuYXNDb2xvcigyNTUsIDExOSwgMCwgMC44KVxuXG4gIGl0UGFyc2VzKCcweGZmN2YwMCcpLmFzQ29sb3IoMjU1LCAxMjcsIDApXG4gIGl0UGFyc2VzKCcweDAwZmY3ZjAwJykuYXNDb2xvcigyNTUsIDEyNywgMCwgMClcblxuICBkZXNjcmliZSAnaW4gY29udGV4dCBvdGhlciB0aGFuIGNzcyBhbmQgcHJlLXByb2Nlc3NvcnMnLCAtPlxuICAgIGJlZm9yZUVhY2ggLT4gQHNjb3BlID0gJ3hhbWwnXG5cbiAgICBpdFBhcnNlcygnI2NjZmY3ZjAwJykuYXNDb2xvcigyNTUsIDEyNywgMCwgMC44KVxuXG4gIGl0UGFyc2VzKCdyZ2IoMjU1LDEyNywwKScpLmFzQ29sb3IoMjU1LCAxMjcsIDApXG4gIGl0UGFyc2VzKCdyZ2IoMjU1LDEyNywwKScpLmFzQ29sb3IoMjU1LCAxMjcsIDApXG4gIGl0UGFyc2VzKCdSR0IoMjU1LDEyNywwKScpLmFzQ29sb3IoMjU1LCAxMjcsIDApXG4gIGl0UGFyc2VzKCdSZ0IoMjU1LDEyNywwKScpLmFzQ29sb3IoMjU1LCAxMjcsIDApXG4gIGl0UGFyc2VzKCdyR2IoMjU1LDEyNywwKScpLmFzQ29sb3IoMjU1LCAxMjcsIDApXG4gIGl0UGFyc2VzKCdyZ2IoJHIsJGcsJGIpJykuYXNJbnZhbGlkKClcbiAgaXRQYXJzZXMoJ3JnYigkciwwLDApJykuYXNJbnZhbGlkKClcbiAgaXRQYXJzZXMoJ3JnYigwLCRnLDApJykuYXNJbnZhbGlkKClcbiAgaXRQYXJzZXMoJ3JnYigwLDAsJGIpJykuYXNJbnZhbGlkKClcbiAgaXRQYXJzZXMoJ3JnYigkciwkZywkYiknKS53aXRoQ29udGV4dCh7XG4gICAgJyRyJzogJzI1NSdcbiAgICAnJGcnOiAnMTI3J1xuICAgICckYic6ICcwJ1xuICB9KS5hc0NvbG9yKDI1NSwgMTI3LCAwKVxuXG4gIGl0UGFyc2VzKCdyZ2JhKDI1NSwxMjcsMCwwLjUpJykuYXNDb2xvcigyNTUsIDEyNywgMCwgMC41KVxuICBpdFBhcnNlcygncmdiYSgyNTUsMTI3LDAsLjUpJykuYXNDb2xvcigyNTUsIDEyNywgMCwgMC41KVxuICBpdFBhcnNlcygnUkdCQSgyNTUsMTI3LDAsLjUpJykuYXNDb2xvcigyNTUsIDEyNywgMCwgMC41KVxuICBpdFBhcnNlcygnckdiQSgyNTUsMTI3LDAsLjUpJykuYXNDb2xvcigyNTUsIDEyNywgMCwgMC41KVxuICBpdFBhcnNlcygncmdiYSgyNTUsMTI3LDAsKScpLmFzVW5kZWZpbmVkKClcbiAgaXRQYXJzZXMoJ3JnYmEoJHIsJGcsJGIsJGEpJykuYXNJbnZhbGlkKClcbiAgaXRQYXJzZXMoJ3JnYmEoJHIsMCwwLDApJykuYXNJbnZhbGlkKClcbiAgaXRQYXJzZXMoJ3JnYmEoMCwkZywwLDApJykuYXNJbnZhbGlkKClcbiAgaXRQYXJzZXMoJ3JnYmEoMCwwLCRiLDApJykuYXNJbnZhbGlkKClcbiAgaXRQYXJzZXMoJ3JnYmEoMCwwLDAsJGEpJykuYXNJbnZhbGlkKClcbiAgaXRQYXJzZXMoJ3JnYmEoJHIsJGcsJGIsJGEpJykud2l0aENvbnRleHQoe1xuICAgICckcic6ICcyNTUnXG4gICAgJyRnJzogJzEyNydcbiAgICAnJGInOiAnMCdcbiAgICAnJGEnOiAnMC41J1xuICB9KS5hc0NvbG9yKDI1NSwgMTI3LCAwLCAwLjUpXG5cbiAgaXRQYXJzZXMoJ3JnYmEoZ3JlZW4sIDAuNSknKS5hc0NvbG9yKDAsIDEyOCwgMCwgMC41KVxuICBpdFBhcnNlcygncmdiYSgkYywkYSwpJykuYXNVbmRlZmluZWQoKVxuICBpdFBhcnNlcygncmdiYSgkYywkYSknKS5hc0ludmFsaWQoKVxuICBpdFBhcnNlcygncmdiYSgkYywxKScpLmFzSW52YWxpZCgpXG4gIGl0UGFyc2VzKCdyZ2JhKCRjLCAkciknKS53aXRoQ29udGV4dCh7XG4gICAgJyRjJzogYXNDb2xvciAnaHN2KCRoLCAkcywgJHYpJ1xuICAgICckcic6ICcxJ1xuICB9KS5hc0ludmFsaWQoKVxuICBpdFBhcnNlcygncmdiYSgkYywkYSknKS53aXRoQ29udGV4dCh7XG4gICAgJyRjJzogYXNDb2xvciAnZ3JlZW4nXG4gICAgJyRhJzogJzAuNSdcbiAgfSkuYXNDb2xvcigwLCAxMjgsIDAsIDAuNSlcblxuICBkZXNjcmliZSAnY3NzJywgLT5cbiAgICBiZWZvcmVFYWNoIC0+IEBzY29wZSA9ICdjc3MnXG5cbiAgICBpdFBhcnNlcygnaHNsKDIwMCw1MCUsNTAlKScpLmFzQ29sb3IoNjQsIDE0OSwgMTkxKVxuICAgIGl0UGFyc2VzKCdoc2woMjAwLDUwLDUwKScpLmFzQ29sb3IoNjQsIDE0OSwgMTkxKVxuICAgIGl0UGFyc2VzKCdIU0woMjAwLDUwLDUwKScpLmFzQ29sb3IoNjQsIDE0OSwgMTkxKVxuICAgIGl0UGFyc2VzKCdoU2woMjAwLDUwLDUwKScpLmFzQ29sb3IoNjQsIDE0OSwgMTkxKVxuICAgIGl0UGFyc2VzKCdoc2woMjAwLjUsNTAuNSw1MC41KScpLmFzQ29sb3IoNjUsIDE1MCwgMTkzKVxuICAgIGl0UGFyc2VzKCdoc2woJGgsJHMsJGwsKScpLmFzVW5kZWZpbmVkKClcbiAgICBpdFBhcnNlcygnaHNsKCRoLCRzLCRsKScpLmFzSW52YWxpZCgpXG4gICAgaXRQYXJzZXMoJ2hzbCgkaCwwJSwwJSknKS5hc0ludmFsaWQoKVxuICAgIGl0UGFyc2VzKCdoc2woMCwkcywwJSknKS5hc0ludmFsaWQoKVxuICAgIGl0UGFyc2VzKCdoc2woMCwwJSwkbCknKS5hc0ludmFsaWQoKVxuICAgIGl0UGFyc2VzKCdoc2woJGgsJHMsJGwpJykud2l0aENvbnRleHQoe1xuICAgICAgJyRoJzogJzIwMCdcbiAgICAgICckcyc6ICc1MCUnXG4gICAgICAnJGwnOiAnNTAlJ1xuICAgIH0pLmFzQ29sb3IoNjQsIDE0OSwgMTkxKVxuXG4gIGRlc2NyaWJlICdsZXNzJywgLT5cbiAgICBiZWZvcmVFYWNoIC0+IEBzY29wZSA9ICdsZXNzJ1xuXG4gICAgaXRQYXJzZXMoJ2hzbCgyODUsIDAuNywgMC43KScpLmFzQ29sb3IoJyNjZDdkZTgnKVxuICAgIGl0UGFyc2VzKCdoc2woMjAwLDUwJSw1MCUpJykuYXNDb2xvcig2NCwgMTQ5LCAxOTEpXG5cbiAgaXRQYXJzZXMoJ2hzbGEoMjAwLDUwJSw1MCUsMC41KScpLmFzQ29sb3IoNjQsIDE0OSwgMTkxLCAwLjUpXG4gIGl0UGFyc2VzKCdoc2xhKDIwMCw1MCUsNTAlLC41KScpLmFzQ29sb3IoNjQsIDE0OSwgMTkxLCAwLjUpXG4gIGl0UGFyc2VzKCdoc2xhKDIwMCw1MCw1MCwuNSknKS5hc0NvbG9yKDY0LCAxNDksIDE5MSwgMC41KVxuICBpdFBhcnNlcygnSFNMQSgyMDAsNTAsNTAsLjUpJykuYXNDb2xvcig2NCwgMTQ5LCAxOTEsIDAuNSlcbiAgaXRQYXJzZXMoJ0hzTGEoMjAwLDUwLDUwLC41KScpLmFzQ29sb3IoNjQsIDE0OSwgMTkxLCAwLjUpXG4gIGl0UGFyc2VzKCdoc2xhKDIwMC41LDUwLjUsNTAuNSwuNSknKS5hc0NvbG9yKDY1LCAxNTAsIDE5MywgMC41KVxuICBpdFBhcnNlcygnaHNsYSgyMDAsNTAlLDUwJSwpJykuYXNVbmRlZmluZWQoKVxuICBpdFBhcnNlcygnaHNsYSgkaCwkcywkbCwkYSknKS5hc0ludmFsaWQoKVxuICBpdFBhcnNlcygnaHNsYSgkaCwwJSwwJSwwKScpLmFzSW52YWxpZCgpXG4gIGl0UGFyc2VzKCdoc2xhKDAsJHMsMCUsMCknKS5hc0ludmFsaWQoKVxuICBpdFBhcnNlcygnaHNsYSgwLDAlLCRsLDApJykuYXNJbnZhbGlkKClcbiAgaXRQYXJzZXMoJ2hzbGEoMCwwJSwwJSwkYSknKS5hc0ludmFsaWQoKVxuICBpdFBhcnNlcygnaHNsYSgkaCwkcywkbCwkYSknKS53aXRoQ29udGV4dCh7XG4gICAgJyRoJzogJzIwMCdcbiAgICAnJHMnOiAnNTAlJ1xuICAgICckbCc6ICc1MCUnXG4gICAgJyRhJzogJzAuNSdcbiAgfSkuYXNDb2xvcig2NCwgMTQ5LCAxOTEsIDAuNSlcblxuICBpdFBhcnNlcygnaHN2KDIwMCw1MCUsNTAlKScpLmFzQ29sb3IoNjQsIDEwNiwgMTI4KVxuICBpdFBhcnNlcygnSFNWKDIwMCw1MCUsNTAlKScpLmFzQ29sb3IoNjQsIDEwNiwgMTI4KVxuICBpdFBhcnNlcygnaFN2KDIwMCw1MCUsNTAlKScpLmFzQ29sb3IoNjQsIDEwNiwgMTI4KVxuICBpdFBhcnNlcygnaHNiKDIwMCw1MCUsNTAlKScpLmFzQ29sb3IoNjQsIDEwNiwgMTI4KVxuICBpdFBhcnNlcygnaHNiKDIwMCw1MCw1MCknKS5hc0NvbG9yKDY0LCAxMDYsIDEyOClcbiAgaXRQYXJzZXMoJ2hzYigyMDAuNSw1MC41LDUwLjUpJykuYXNDb2xvcig2NCwgMTA3LCAxMjkpXG4gIGl0UGFyc2VzKCdoc3YoJGgsJHMsJHYsKScpLmFzVW5kZWZpbmVkKClcbiAgaXRQYXJzZXMoJ2hzdigkaCwkcywkdiknKS5hc0ludmFsaWQoKVxuICBpdFBhcnNlcygnaHN2KCRoLDAlLDAlKScpLmFzSW52YWxpZCgpXG4gIGl0UGFyc2VzKCdoc3YoMCwkcywwJSknKS5hc0ludmFsaWQoKVxuICBpdFBhcnNlcygnaHN2KDAsMCUsJHYpJykuYXNJbnZhbGlkKClcbiAgaXRQYXJzZXMoJ2hzdigkaCwkcywkdiknKS53aXRoQ29udGV4dCh7XG4gICAgJyRoJzogJzIwMCdcbiAgICAnJHMnOiAnNTAlJ1xuICAgICckdic6ICc1MCUnXG4gIH0pLmFzQ29sb3IoNjQsIDEwNiwgMTI4KVxuXG4gIGl0UGFyc2VzKCdoc3ZhKDIwMCw1MCUsNTAlLDAuNSknKS5hc0NvbG9yKDY0LCAxMDYsIDEyOCwgMC41KVxuICBpdFBhcnNlcygnaHN2YSgyMDAsNTAsNTAsMC41KScpLmFzQ29sb3IoNjQsIDEwNiwgMTI4LCAwLjUpXG4gIGl0UGFyc2VzKCdIU1ZBKDIwMCw1MCw1MCwwLjUpJykuYXNDb2xvcig2NCwgMTA2LCAxMjgsIDAuNSlcbiAgaXRQYXJzZXMoJ2hzYmEoMjAwLDUwJSw1MCUsMC41KScpLmFzQ29sb3IoNjQsIDEwNiwgMTI4LCAwLjUpXG4gIGl0UGFyc2VzKCdIc0JhKDIwMCw1MCUsNTAlLDAuNSknKS5hc0NvbG9yKDY0LCAxMDYsIDEyOCwgMC41KVxuICBpdFBhcnNlcygnaHN2YSgyMDAsNTAlLDUwJSwuNSknKS5hc0NvbG9yKDY0LCAxMDYsIDEyOCwgMC41KVxuICBpdFBhcnNlcygnaHN2YSgyMDAuNSw1MC41LDUwLjUsLjUpJykuYXNDb2xvcig2NCwgMTA3LCAxMjksIDAuNSlcbiAgaXRQYXJzZXMoJ2hzdmEoMjAwLDUwJSw1MCUsKScpLmFzVW5kZWZpbmVkKClcbiAgaXRQYXJzZXMoJ2hzdmEoJGgsJHMsJHYsJGEpJykuYXNJbnZhbGlkKClcbiAgaXRQYXJzZXMoJ2hzdmEoJGgsMCUsMCUsMCknKS5hc0ludmFsaWQoKVxuICBpdFBhcnNlcygnaHN2YSgwLCRzLDAlLDApJykuYXNJbnZhbGlkKClcbiAgaXRQYXJzZXMoJ2hzdmEoMCwwJSwkdiwwKScpLmFzSW52YWxpZCgpXG4gIGl0UGFyc2VzKCdoc3ZhKCRoLCRzLCR2LCRhKScpLndpdGhDb250ZXh0KHtcbiAgICAnJGgnOiAnMjAwJ1xuICAgICckcyc6ICc1MCUnXG4gICAgJyR2JzogJzUwJSdcbiAgICAnJGEnOiAnMC41J1xuICB9KS5hc0NvbG9yKDY0LCAxMDYsIDEyOCwgMC41KVxuXG4gIGl0UGFyc2VzKCdoY2coMjAwLDUwJSw1MCUpJykuYXNDb2xvcig2NCwgMTQ5LCAxOTEpXG4gIGl0UGFyc2VzKCdIQ0coMjAwLDUwJSw1MCUpJykuYXNDb2xvcig2NCwgMTQ5LCAxOTEpXG4gIGl0UGFyc2VzKCdoY2coMjAwLDUwLDUwKScpLmFzQ29sb3IoNjQsIDE0OSwgMTkxKVxuICBpdFBhcnNlcygnaGNnKDIwMC41LDUwLjUsNTAuNSknKS5hc0NvbG9yKDY0LCAxNTAsIDE5MylcbiAgaXRQYXJzZXMoJ2hjZygkaCwkYywkZywpJykuYXNVbmRlZmluZWQoKVxuICBpdFBhcnNlcygnaGNnKCRoLCRjLCRnKScpLmFzSW52YWxpZCgpXG4gIGl0UGFyc2VzKCdoY2coJGgsMCUsMCUpJykuYXNJbnZhbGlkKClcbiAgaXRQYXJzZXMoJ2hjZygwLCRjLDAlKScpLmFzSW52YWxpZCgpXG4gIGl0UGFyc2VzKCdoY2coMCwwJSwkZyknKS5hc0ludmFsaWQoKVxuICBpdFBhcnNlcygnaGNnKCRoLCRjLCRnKScpLndpdGhDb250ZXh0KHtcbiAgICAnJGgnOiAnMjAwJ1xuICAgICckYyc6ICc1MCUnXG4gICAgJyRnJzogJzUwJSdcbiAgfSkuYXNDb2xvcig2NCwgMTQ5LCAxOTEpXG5cbiAgaXRQYXJzZXMoJ2hjZ2EoMjAwLDUwJSw1MCUsMC41KScpLmFzQ29sb3IoNjQsIDE0OSwgMTkxLCAwLjUpXG4gIGl0UGFyc2VzKCdoY2dhKDIwMCw1MCw1MCwwLjUpJykuYXNDb2xvcig2NCwgMTQ5LCAxOTEsIDAuNSlcbiAgaXRQYXJzZXMoJ0hDR0EoMjAwLDUwLDUwLDAuNSknKS5hc0NvbG9yKDY0LCAxNDksIDE5MSwgMC41KVxuICBpdFBhcnNlcygnaGNnYSgyMDAsNTAlLDUwJSwuNSknKS5hc0NvbG9yKDY0LCAxNDksIDE5MSwgMC41KVxuICBpdFBhcnNlcygnaGNnYSgyMDAuNSw1MC41LDUwLjUsLjUpJykuYXNDb2xvcig2NCwgMTUwLCAxOTMsIDAuNSlcbiAgaXRQYXJzZXMoJ2hjZ2EoMjAwLDUwJSw1MCUsKScpLmFzVW5kZWZpbmVkKClcbiAgaXRQYXJzZXMoJ2hjZ2EoJGgsJGMsJGcsJGEpJykuYXNJbnZhbGlkKClcbiAgaXRQYXJzZXMoJ2hjZ2EoJGgsMCUsMCUsMCknKS5hc0ludmFsaWQoKVxuICBpdFBhcnNlcygnaGNnYSgwLCRjLDAlLDApJykuYXNJbnZhbGlkKClcbiAgaXRQYXJzZXMoJ2hjZ2EoMCwwJSwkZywwKScpLmFzSW52YWxpZCgpXG4gIGl0UGFyc2VzKCdoY2dhKCRoLCRjLCRnLCRhKScpLndpdGhDb250ZXh0KHtcbiAgICAnJGgnOiAnMjAwJ1xuICAgICckYyc6ICc1MCUnXG4gICAgJyRnJzogJzUwJSdcbiAgICAnJGEnOiAnMC41J1xuICB9KS5hc0NvbG9yKDY0LCAxNDksIDE5MSwgMC41KVxuXG4gIGl0UGFyc2VzKCdod2IoMjEwLDQwJSw0MCUpJykuYXNDb2xvcigxMDIsIDEyOCwgMTUzKVxuICBpdFBhcnNlcygnaHdiKDIxMCw0MCw0MCknKS5hc0NvbG9yKDEwMiwgMTI4LCAxNTMpXG4gIGl0UGFyc2VzKCdIV0IoMjEwLDQwLDQwKScpLmFzQ29sb3IoMTAyLCAxMjgsIDE1MylcbiAgaXRQYXJzZXMoJ2hXYigyMTAsNDAsNDApJykuYXNDb2xvcigxMDIsIDEyOCwgMTUzKVxuICBpdFBhcnNlcygnaHdiKDIxMCw0MCUsNDAlLCAwLjUpJykuYXNDb2xvcigxMDIsIDEyOCwgMTUzLCAwLjUpXG4gIGl0UGFyc2VzKCdod2IoMjEwLjUsNDAuNSw0MC41KScpLmFzQ29sb3IoMTAzLCAxMjgsIDE1MilcbiAgaXRQYXJzZXMoJ2h3YigyMTAuNSw0MC41JSw0MC41JSwgMC41KScpLmFzQ29sb3IoMTAzLCAxMjgsIDE1MiwgMC41KVxuICBpdFBhcnNlcygnaHdiKCRoLCR3LCRiLCknKS5hc1VuZGVmaW5lZCgpXG4gIGl0UGFyc2VzKCdod2IoJGgsJHcsJGIpJykuYXNJbnZhbGlkKClcbiAgaXRQYXJzZXMoJ2h3YigkaCwwJSwwJSknKS5hc0ludmFsaWQoKVxuICBpdFBhcnNlcygnaHdiKDAsJHcsMCUpJykuYXNJbnZhbGlkKClcbiAgaXRQYXJzZXMoJ2h3YigwLDAlLCRiKScpLmFzSW52YWxpZCgpXG4gIGl0UGFyc2VzKCdod2IoJGgsMCUsMCUsMCknKS5hc0ludmFsaWQoKVxuICBpdFBhcnNlcygnaHdiKDAsJHcsMCUsMCknKS5hc0ludmFsaWQoKVxuICBpdFBhcnNlcygnaHdiKDAsMCUsJGIsMCknKS5hc0ludmFsaWQoKVxuICBpdFBhcnNlcygnaHdiKDAsMCUsMCUsJGEpJykuYXNJbnZhbGlkKClcbiAgaXRQYXJzZXMoJ2h3YigkaCwkdywkYiknKS53aXRoQ29udGV4dCh7XG4gICAgJyRoJzogJzIxMCdcbiAgICAnJHcnOiAnNDAlJ1xuICAgICckYic6ICc0MCUnXG4gIH0pLmFzQ29sb3IoMTAyLCAxMjgsIDE1MylcbiAgaXRQYXJzZXMoJ2h3YigkaCwkdywkYiwkYSknKS53aXRoQ29udGV4dCh7XG4gICAgJyRoJzogJzIxMCdcbiAgICAnJHcnOiAnNDAlJ1xuICAgICckYic6ICc0MCUnXG4gICAgJyRhJzogJzAuNSdcbiAgfSkuYXNDb2xvcigxMDIsIDEyOCwgMTUzLCAwLjUpXG5cbiAgaXRQYXJzZXMoJ2NteWsoMCwwLjUsMSwwKScpLmFzQ29sb3IoJyNmZjdmMDAnKVxuICBpdFBhcnNlcygnQ01ZSygwLDAuNSwxLDApJykuYXNDb2xvcignI2ZmN2YwMCcpXG4gIGl0UGFyc2VzKCdjTXlLKDAsMC41LDEsMCknKS5hc0NvbG9yKCcjZmY3ZjAwJylcbiAgaXRQYXJzZXMoJ2NteWsoYyxtLHksayknKS53aXRoQ29udGV4dCh7XG4gICAgJ2MnOiAnMCdcbiAgICAnbSc6ICcwLjUnXG4gICAgJ3knOiAnMSdcbiAgICAnayc6ICcwJ1xuICB9KS5hc0NvbG9yKCcjZmY3ZjAwJylcbiAgaXRQYXJzZXMoJ2NteWsoYyxtLHksayknKS5hc0ludmFsaWQoKVxuXG4gIGl0UGFyc2VzKCdncmF5KDEwMCUpJykuYXNDb2xvcigyNTUsIDI1NSwgMjU1KVxuICBpdFBhcnNlcygnZ3JheSgxMDApJykuYXNDb2xvcigyNTUsIDI1NSwgMjU1KVxuICBpdFBhcnNlcygnR1JBWSgxMDApJykuYXNDb2xvcigyNTUsIDI1NSwgMjU1KVxuICBpdFBhcnNlcygnZ1JhWSgxMDApJykuYXNDb2xvcigyNTUsIDI1NSwgMjU1KVxuICBpdFBhcnNlcygnZ3JheSgxMDAlLCAwLjUpJykuYXNDb2xvcigyNTUsIDI1NSwgMjU1LCAwLjUpXG4gIGl0UGFyc2VzKCdncmF5KCRjLCAkYSwpJykuYXNVbmRlZmluZWQoKVxuICBpdFBhcnNlcygnZ3JheSgkYywgJGEpJykuYXNJbnZhbGlkKClcbiAgaXRQYXJzZXMoJ2dyYXkoMCUsICRhKScpLmFzSW52YWxpZCgpXG4gIGl0UGFyc2VzKCdncmF5KCRjLCAwKScpLmFzSW52YWxpZCgpXG4gIGl0UGFyc2VzKCdncmF5KCRjLCAkYSknKS53aXRoQ29udGV4dCh7XG4gICAgJyRjJzogJzEwMCUnXG4gICAgJyRhJzogJzAuNSdcbiAgfSkuYXNDb2xvcigyNTUsIDI1NSwgMjU1LCAwLjUpXG5cbiAgaXRQYXJzZXMoJ3llbGxvd2dyZWVuJykuYXNDb2xvcignIzlhY2QzMicpXG4gIGl0UGFyc2VzKCdZRUxMT1dHUkVFTicpLmFzQ29sb3IoJyM5YWNkMzInKVxuICBpdFBhcnNlcygneWVsbG93R3JlZW4nKS5hc0NvbG9yKCcjOWFjZDMyJylcbiAgaXRQYXJzZXMoJ1llbGxvd0dyZWVuJykuYXNDb2xvcignIzlhY2QzMicpXG4gIGl0UGFyc2VzKCd5ZWxsb3dfZ3JlZW4nKS5hc0NvbG9yKCcjOWFjZDMyJylcbiAgaXRQYXJzZXMoJ1lFTExPV19HUkVFTicpLmFzQ29sb3IoJyM5YWNkMzInKVxuICBpdFBhcnNlcygnPllFTExPV19HUkVFTicpLmFzQ29sb3IoJyM5YWNkMzInKVxuXG4gIGl0UGFyc2VzKCdkYXJrZW4oY3lhbiwgMjAlKScpLmFzQ29sb3IoMCwgMTUzLCAxNTMpXG4gIGl0UGFyc2VzKCdkYXJrZW4oY3lhbiwgMjApJykuYXNDb2xvcigwLCAxNTMsIDE1MylcbiAgaXRQYXJzZXMoJ2RhcmtlbigjZmZmLCAxMDAlKScpLmFzQ29sb3IoMCwgMCwgMClcbiAgaXRQYXJzZXMoJ2RhcmtlbihjeWFuLCAkciknKS5hc0ludmFsaWQoKVxuICBpdFBhcnNlcygnZGFya2VuKCRjLCAkciknKS53aXRoQ29udGV4dCh7XG4gICAgJyRjJzogYXNDb2xvciAnaHN2KCRoLCAkcywgJHYpJ1xuICAgICckcic6ICcxJ1xuICB9KS5hc0ludmFsaWQoKVxuICBpdFBhcnNlcygnZGFya2VuKCRjLCAkciknKS53aXRoQ29udGV4dCh7XG4gICAgJyRjJzogYXNDb2xvciAnY3lhbidcbiAgICAnJHInOiAnMjAlJ1xuICB9KS5hc0NvbG9yKDAsIDE1MywgMTUzKVxuICBpdFBhcnNlcygnZGFya2VuKCRhLCAkciknKS53aXRoQ29udGV4dCh7XG4gICAgJyRhJzogYXNDb2xvciAncmdiYSgkYywgMSknXG4gICAgJyRjJzogYXNDb2xvciAnY3lhbidcbiAgICAnJHInOiAnMjAlJ1xuICB9KS5hc0NvbG9yKDAsIDE1MywgMTUzKVxuXG4gIGl0UGFyc2VzKCdsaWdodGVuKGN5YW4sIDIwJSknKS5hc0NvbG9yKDEwMiwgMjU1LCAyNTUpXG4gIGl0UGFyc2VzKCdsaWdodGVuKGN5YW4sIDIwKScpLmFzQ29sb3IoMTAyLCAyNTUsIDI1NSlcbiAgaXRQYXJzZXMoJ2xpZ2h0ZW4oIzAwMCwgMTAwJSknKS5hc0NvbG9yKDI1NSwgMjU1LCAyNTUpXG4gIGl0UGFyc2VzKCdsaWdodGVuKGN5YW4sICRyKScpLmFzSW52YWxpZCgpXG4gIGl0UGFyc2VzKCdsaWdodGVuKCRjLCAkciknKS53aXRoQ29udGV4dCh7XG4gICAgJyRjJzogYXNDb2xvciAnaHN2KCRoLCAkcywgJHYpJ1xuICAgICckcic6ICcxJ1xuICB9KS5hc0ludmFsaWQoKVxuICBpdFBhcnNlcygnbGlnaHRlbigkYywgJHIpJykud2l0aENvbnRleHQoe1xuICAgICckYyc6IGFzQ29sb3IgJ2N5YW4nXG4gICAgJyRyJzogJzIwJSdcbiAgfSkuYXNDb2xvcigxMDIsIDI1NSwgMjU1KVxuICBpdFBhcnNlcygnbGlnaHRlbigkYSwgJHIpJykud2l0aENvbnRleHQoe1xuICAgICckYSc6IGFzQ29sb3IgJ3JnYmEoJGMsIDEpJ1xuICAgICckYyc6IGFzQ29sb3IgJ2N5YW4nXG4gICAgJyRyJzogJzIwJSdcbiAgfSkuYXNDb2xvcigxMDIsIDI1NSwgMjU1KVxuXG4gIGl0UGFyc2VzKCd0cmFuc3BhcmVudGl6ZShjeWFuLCA1MCUpJykuYXNDb2xvcigwLCAyNTUsIDI1NSwgMC41KVxuICBpdFBhcnNlcygndHJhbnNwYXJlbnRpemUoY3lhbiwgNTApJykuYXNDb2xvcigwLCAyNTUsIDI1NSwgMC41KVxuICBpdFBhcnNlcygndHJhbnNwYXJlbnRpemUoY3lhbiwgMC41KScpLmFzQ29sb3IoMCwgMjU1LCAyNTUsIDAuNSlcbiAgaXRQYXJzZXMoJ3RyYW5zcGFyZW50aXplKGN5YW4sIC41KScpLmFzQ29sb3IoMCwgMjU1LCAyNTUsIDAuNSlcbiAgaXRQYXJzZXMoJ2ZhZGVvdXQoY3lhbiwgMC41KScpLmFzQ29sb3IoMCwgMjU1LCAyNTUsIDAuNSlcbiAgaXRQYXJzZXMoJ2ZhZGUtb3V0KGN5YW4sIDAuNSknKS5hc0NvbG9yKDAsIDI1NSwgMjU1LCAwLjUpXG4gIGl0UGFyc2VzKCdmYWRlX291dChjeWFuLCAwLjUpJykuYXNDb2xvcigwLCAyNTUsIDI1NSwgMC41KVxuICBpdFBhcnNlcygnZmFkZW91dChjeWFuLCAuNSknKS5hc0NvbG9yKDAsIDI1NSwgMjU1LCAwLjUpXG4gIGl0UGFyc2VzKCdmYWRlb3V0KGN5YW4sIEByKScpLmFzSW52YWxpZCgpXG4gIGl0UGFyc2VzKCdmYWRlb3V0KCRjLCAkciknKS53aXRoQ29udGV4dCh7XG4gICAgJyRjJzogYXNDb2xvciAnaHN2KCRoLCAkcywgJHYpJ1xuICAgICckcic6ICcxJ1xuICB9KS5hc0ludmFsaWQoKVxuICBpdFBhcnNlcygnZmFkZW91dChAYywgQHIpJykud2l0aENvbnRleHQoe1xuICAgICdAYyc6IGFzQ29sb3IgJ2N5YW4nXG4gICAgJ0ByJzogJzAuNSdcbiAgfSkuYXNDb2xvcigwLCAyNTUsIDI1NSwgMC41KVxuICBpdFBhcnNlcygnZmFkZW91dChAYSwgQHIpJykud2l0aENvbnRleHQoe1xuICAgICdAYSc6IGFzQ29sb3IgJ3JnYmEoQGMsIDEpJ1xuICAgICdAYyc6IGFzQ29sb3IgJ2N5YW4nXG4gICAgJ0ByJzogJzAuNSdcbiAgfSkuYXNDb2xvcigwLCAyNTUsIDI1NSwgMC41KVxuXG4gIGl0UGFyc2VzKCdvcGFjaWZ5KDB4NzgwMEZGRkYsIDUwJSknKS5hc0NvbG9yKDAsIDI1NSwgMjU1LCAxKVxuICBpdFBhcnNlcygnb3BhY2lmeSgweDc4MDBGRkZGLCA1MCknKS5hc0NvbG9yKDAsIDI1NSwgMjU1LCAxKVxuICBpdFBhcnNlcygnb3BhY2lmeSgweDc4MDBGRkZGLCAwLjUpJykuYXNDb2xvcigwLCAyNTUsIDI1NSwgMSlcbiAgaXRQYXJzZXMoJ29wYWNpZnkoMHg3ODAwRkZGRiwgLjUpJykuYXNDb2xvcigwLCAyNTUsIDI1NSwgMSlcbiAgaXRQYXJzZXMoJ2ZhZGVpbigweDc4MDBGRkZGLCAwLjUpJykuYXNDb2xvcigwLCAyNTUsIDI1NSwgMSlcbiAgaXRQYXJzZXMoJ2ZhZGUtaW4oMHg3ODAwRkZGRiwgMC41KScpLmFzQ29sb3IoMCwgMjU1LCAyNTUsIDEpXG4gIGl0UGFyc2VzKCdmYWRlX2luKDB4NzgwMEZGRkYsIDAuNSknKS5hc0NvbG9yKDAsIDI1NSwgMjU1LCAxKVxuICBpdFBhcnNlcygnZmFkZWluKDB4NzgwMEZGRkYsIC41KScpLmFzQ29sb3IoMCwgMjU1LCAyNTUsIDEpXG4gIGl0UGFyc2VzKCdmYWRlaW4oMHg3ODAwRkZGRiwgQHIpJykuYXNJbnZhbGlkKClcbiAgaXRQYXJzZXMoJ2ZhZGVpbigkYywgJHIpJykud2l0aENvbnRleHQoe1xuICAgICckYyc6IGFzQ29sb3IgJ2hzdigkaCwgJHMsICR2KSdcbiAgICAnJHInOiAnMSdcbiAgfSkuYXNJbnZhbGlkKClcbiAgaXRQYXJzZXMoJ2ZhZGVpbihAYywgQHIpJykud2l0aENvbnRleHQoe1xuICAgICdAYyc6IGFzQ29sb3IgJzB4NzgwMEZGRkYnXG4gICAgJ0ByJzogJzAuNSdcbiAgfSkuYXNDb2xvcigwLCAyNTUsIDI1NSwgMSlcbiAgaXRQYXJzZXMoJ2ZhZGVpbihAYSwgQHIpJykud2l0aENvbnRleHQoe1xuICAgICdAYSc6IGFzQ29sb3IgJ3JnYmEoQGMsIDEpJ1xuICAgICdAYyc6IGFzQ29sb3IgJzB4NzgwMEZGRkYnXG4gICAgJ0ByJzogJzAuNSdcbiAgfSkuYXNDb2xvcigwLCAyNTUsIDI1NSwgMSlcblxuICBpdFBhcnNlcygnc2F0dXJhdGUoIzg1NSwgMjAlKScpLmFzQ29sb3IoMTU4LCA2MywgNjMpXG4gIGl0UGFyc2VzKCdzYXR1cmF0ZSgjODU1LCAyMCknKS5hc0NvbG9yKDE1OCwgNjMsIDYzKVxuICBpdFBhcnNlcygnc2F0dXJhdGUoIzg1NSwgMC4yKScpLmFzQ29sb3IoMTU4LCA2MywgNjMpXG4gIGl0UGFyc2VzKCdzYXR1cmF0ZSgjODU1LCBAciknKS5hc0ludmFsaWQoKVxuICBpdFBhcnNlcygnc2F0dXJhdGUoJGMsICRyKScpLndpdGhDb250ZXh0KHtcbiAgICAnJGMnOiBhc0NvbG9yICdoc3YoJGgsICRzLCAkdiknXG4gICAgJyRyJzogJzEnXG4gIH0pLmFzSW52YWxpZCgpXG4gIGl0UGFyc2VzKCdzYXR1cmF0ZShAYywgQHIpJykud2l0aENvbnRleHQoe1xuICAgICdAYyc6IGFzQ29sb3IgJyM4NTUnXG4gICAgJ0ByJzogJzAuMidcbiAgfSkuYXNDb2xvcigxNTgsIDYzLCA2MylcbiAgaXRQYXJzZXMoJ3NhdHVyYXRlKEBhLCBAciknKS53aXRoQ29udGV4dCh7XG4gICAgJ0BhJzogYXNDb2xvciAncmdiYShAYywgMSknXG4gICAgJ0BjJzogYXNDb2xvciAnIzg1NSdcbiAgICAnQHInOiAnMC4yJ1xuICB9KS5hc0NvbG9yKDE1OCwgNjMsIDYzKVxuXG4gIGl0UGFyc2VzKCdkZXNhdHVyYXRlKCM5ZTNmM2YsIDIwJSknKS5hc0NvbG9yKDEzNiwgODUsIDg1KVxuICBpdFBhcnNlcygnZGVzYXR1cmF0ZSgjOWUzZjNmLCAyMCknKS5hc0NvbG9yKDEzNiwgODUsIDg1KVxuICBpdFBhcnNlcygnZGVzYXR1cmF0ZSgjOWUzZjNmLCAwLjIpJykuYXNDb2xvcigxMzYsIDg1LCA4NSlcbiAgaXRQYXJzZXMoJ2Rlc2F0dXJhdGUoIzllM2YzZiwgLjIpJykuYXNDb2xvcigxMzYsIDg1LCA4NSlcbiAgaXRQYXJzZXMoJ2Rlc2F0dXJhdGUoIzllM2YzZiwgQHIpJykuYXNJbnZhbGlkKClcbiAgaXRQYXJzZXMoJ2Rlc2F0dXJhdGUoJGMsICRyKScpLndpdGhDb250ZXh0KHtcbiAgICAnJGMnOiBhc0NvbG9yICdoc3YoJGgsICRzLCAkdiknXG4gICAgJyRyJzogJzEnXG4gIH0pLmFzSW52YWxpZCgpXG4gIGl0UGFyc2VzKCdkZXNhdHVyYXRlKEBjLCBAciknKS53aXRoQ29udGV4dCh7XG4gICAgJ0BjJzogYXNDb2xvciAnIzllM2YzZidcbiAgICAnQHInOiAnMC4yJ1xuICB9KS5hc0NvbG9yKDEzNiwgODUsIDg1KVxuICBpdFBhcnNlcygnZGVzYXR1cmF0ZShAYSwgQHIpJykud2l0aENvbnRleHQoe1xuICAgICdAYSc6IGFzQ29sb3IgJ3JnYmEoQGMsIDEpJ1xuICAgICdAYyc6IGFzQ29sb3IgJyM5ZTNmM2YnXG4gICAgJ0ByJzogJzAuMidcbiAgfSkuYXNDb2xvcigxMzYsIDg1LCA4NSlcblxuICBpdFBhcnNlcygnZ3JheXNjYWxlKCM5ZTNmM2YpJykuYXNDb2xvcigxMTEsIDExMSwgMTExKVxuICBpdFBhcnNlcygnZ3JleXNjYWxlKCM5ZTNmM2YpJykuYXNDb2xvcigxMTEsIDExMSwgMTExKVxuICBpdFBhcnNlcygnZ3JheXNjYWxlKEBjKScpLmFzSW52YWxpZCgpXG4gIGl0UGFyc2VzKCdncmF5c2NhbGUoJGMpJykud2l0aENvbnRleHQoe1xuICAgICckYyc6IGFzQ29sb3IgJ2hzdigkaCwgJHMsICR2KSdcbiAgfSkuYXNJbnZhbGlkKClcbiAgaXRQYXJzZXMoJ2dyYXlzY2FsZShAYyknKS53aXRoQ29udGV4dCh7XG4gICAgJ0BjJzogYXNDb2xvciAnIzllM2YzZidcbiAgfSkuYXNDb2xvcigxMTEsIDExMSwgMTExKVxuICBpdFBhcnNlcygnZ3JheXNjYWxlKEBhKScpLndpdGhDb250ZXh0KHtcbiAgICAnQGEnOiBhc0NvbG9yICdyZ2JhKEBjLCAxKSdcbiAgICAnQGMnOiBhc0NvbG9yICcjOWUzZjNmJ1xuICB9KS5hc0NvbG9yKDExMSwgMTExLCAxMTEpXG5cbiAgaXRQYXJzZXMoJ2ludmVydCgjOWUzZjNmKScpLmFzQ29sb3IoOTcsIDE5MiwgMTkyKVxuICBpdFBhcnNlcygnaW52ZXJ0KEBjKScpLmFzSW52YWxpZCgpXG4gIGl0UGFyc2VzKCdpbnZlcnQoJGMpJykud2l0aENvbnRleHQoe1xuICAgICckYyc6IGFzQ29sb3IgJ2hzdigkaCwgJHMsICR2KSdcbiAgfSkuYXNJbnZhbGlkKClcbiAgaXRQYXJzZXMoJ2ludmVydChAYyknKS53aXRoQ29udGV4dCh7XG4gICAgJ0BjJzogYXNDb2xvciAnIzllM2YzZidcbiAgfSkuYXNDb2xvcig5NywgMTkyLCAxOTIpXG4gIGl0UGFyc2VzKCdpbnZlcnQoQGEpJykud2l0aENvbnRleHQoe1xuICAgICdAYSc6IGFzQ29sb3IgJ3JnYmEoQGMsIDEpJ1xuICAgICdAYyc6IGFzQ29sb3IgJyM5ZTNmM2YnXG4gIH0pLmFzQ29sb3IoOTcsIDE5MiwgMTkyKVxuXG4gIGl0UGFyc2VzKCdhZGp1c3QtaHVlKCM4MTEsIDQ1ZGVnKScpLmFzQ29sb3IoMTM2LCAxMDYsIDE3KVxuICBpdFBhcnNlcygnYWRqdXN0LWh1ZSgjODExLCAtNDVkZWcpJykuYXNDb2xvcigxMzYsIDE3LCAxMDYpXG4gIGl0UGFyc2VzKCdhZGp1c3QtaHVlKCM4MTEsIDQ1JSknKS5hc0NvbG9yKDEzNiwgMTA2LCAxNylcbiAgaXRQYXJzZXMoJ2FkanVzdC1odWUoIzgxMSwgLTQ1JSknKS5hc0NvbG9yKDEzNiwgMTcsIDEwNilcbiAgaXRQYXJzZXMoJ2FkanVzdC1odWUoIzgxMSwgNDUpJykuYXNDb2xvcigxMzYsIDEwNiwgMTcpXG4gIGl0UGFyc2VzKCdhZGp1c3QtaHVlKCM4MTEsIC00NSknKS5hc0NvbG9yKDEzNiwgMTcsIDEwNilcbiAgaXRQYXJzZXMoJ2FkanVzdC1odWUoJGMsICRyKScpLmFzSW52YWxpZCgpXG4gIGl0UGFyc2VzKCdhZGp1c3QtaHVlKCRjLCAkciknKS53aXRoQ29udGV4dCh7XG4gICAgJyRjJzogYXNDb2xvciAnaHN2KCRoLCAkcywgJHYpJ1xuICAgICckcic6ICcxJ1xuICB9KS5hc0ludmFsaWQoKVxuICBpdFBhcnNlcygnYWRqdXN0LWh1ZSgkYywgJHIpJykud2l0aENvbnRleHQoe1xuICAgICckYyc6IGFzQ29sb3IgJyM4MTEnXG4gICAgJyRyJzogJy00NWRlZydcbiAgfSkuYXNDb2xvcigxMzYsIDE3LCAxMDYpXG4gIGl0UGFyc2VzKCdhZGp1c3QtaHVlKCRhLCAkciknKS53aXRoQ29udGV4dCh7XG4gICAgJyRhJzogYXNDb2xvciAncmdiYSgkYywgMC41KSdcbiAgICAnJGMnOiBhc0NvbG9yICcjODExJ1xuICAgICckcic6ICctNDVkZWcnXG4gIH0pLmFzQ29sb3IoMTM2LCAxNywgMTA2LCAwLjUpXG5cbiAgaXRQYXJzZXMoJ21peChyZ2IoMjU1LDAsMCksIGJsdWUpJykuYXNDb2xvcigxMjcsIDAsIDEyNylcbiAgaXRQYXJzZXMoJ21peChyZWQsIHJnYigwLDAsMjU1KSwgMjUlKScpLmFzQ29sb3IoNjMsIDAsIDE5MSlcbiAgaXRQYXJzZXMoJ21peCgjZmYwMDAwLCAweDAwMDBmZiknKS5hc0NvbG9yKCcjN2YwMDdmJylcbiAgaXRQYXJzZXMoJ21peCgjZmYwMDAwLCAweDAwMDBmZiwgMjUlKScpLmFzQ29sb3IoJyMzZjAwYmYnKVxuICBpdFBhcnNlcygnbWl4KHJlZCwgcmdiKDAsMCwyNTUpLCAyNSknKS5hc0NvbG9yKDYzLCAwLCAxOTEpXG4gIGl0UGFyc2VzKCdtaXgoJGEsICRiLCAkciknKS5hc0ludmFsaWQoKVxuICBpdFBhcnNlcygnbWl4KCRhLCAkYiwgJHIpJykud2l0aENvbnRleHQoe1xuICAgICckYSc6IGFzQ29sb3IgJ2hzdigkaCwgJHMsICR2KSdcbiAgICAnJGInOiBhc0NvbG9yICdibHVlJ1xuICAgICckcic6ICcyNSUnXG4gIH0pLmFzSW52YWxpZCgpXG4gIGl0UGFyc2VzKCdtaXgoJGEsICRiLCAkciknKS53aXRoQ29udGV4dCh7XG4gICAgJyRhJzogYXNDb2xvciAnYmx1ZSdcbiAgICAnJGInOiBhc0NvbG9yICdoc3YoJGgsICRzLCAkdiknXG4gICAgJyRyJzogJzI1JSdcbiAgfSkuYXNJbnZhbGlkKClcbiAgaXRQYXJzZXMoJ21peCgkYSwgJGIsICRyKScpLndpdGhDb250ZXh0KHtcbiAgICAnJGEnOiBhc0NvbG9yICdyZWQnXG4gICAgJyRiJzogYXNDb2xvciAnYmx1ZSdcbiAgICAnJHInOiAnMjUlJ1xuICB9KS5hc0NvbG9yKDYzLCAwLCAxOTEpXG4gIGl0UGFyc2VzKCdtaXgoJGMsICRkLCAkciknKS53aXRoQ29udGV4dCh7XG4gICAgJyRhJzogYXNDb2xvciAncmVkJ1xuICAgICckYic6IGFzQ29sb3IgJ2JsdWUnXG4gICAgJyRjJzogYXNDb2xvciAncmdiYSgkYSwgMSknXG4gICAgJyRkJzogYXNDb2xvciAncmdiYSgkYiwgMSknXG4gICAgJyRyJzogJzI1JSdcbiAgfSkuYXNDb2xvcig2MywgMCwgMTkxKVxuXG4gIGRlc2NyaWJlICdzdHlsdXMgYW5kIGxlc3MnLCAtPlxuICAgIGJlZm9yZUVhY2ggLT4gQHNjb3BlID0gJ3N0eWwnXG5cbiAgICBpdFBhcnNlcygndGludCgjZmQwY2M3LDY2JSknKS5hc0NvbG9yKDI1NCwgMTcyLCAyMzUpXG4gICAgaXRQYXJzZXMoJ3RpbnQoI2ZkMGNjNyw2NiknKS5hc0NvbG9yKDI1NCwgMTcyLCAyMzUpXG4gICAgaXRQYXJzZXMoJ3RpbnQoJGMsJHIpJykuYXNJbnZhbGlkKClcbiAgICBpdFBhcnNlcygndGludCgkYywgJHIpJykud2l0aENvbnRleHQoe1xuICAgICAgJyRjJzogYXNDb2xvciAnaHN2KCRoLCAkcywgJHYpJ1xuICAgICAgJyRyJzogJzEnXG4gICAgfSkuYXNJbnZhbGlkKClcbiAgICBpdFBhcnNlcygndGludCgkYywkciknKS53aXRoQ29udGV4dCh7XG4gICAgICAnJGMnOiBhc0NvbG9yICcjZmQwY2M3J1xuICAgICAgJyRyJzogJzY2JSdcbiAgICB9KS5hc0NvbG9yKDI1NCwgMTcyLCAyMzUpXG4gICAgaXRQYXJzZXMoJ3RpbnQoJGMsJHIpJykud2l0aENvbnRleHQoe1xuICAgICAgJyRhJzogYXNDb2xvciAnI2ZkMGNjNydcbiAgICAgICckYyc6IGFzQ29sb3IgJ3JnYmEoJGEsIDAuOSknXG4gICAgICAnJHInOiAnNjYlJ1xuICAgIH0pLmFzQ29sb3IoMjU0LCAxNzIsIDIzNSwgMC45NjYpXG5cbiAgICBpdFBhcnNlcygnc2hhZGUoI2ZkMGNjNyw2NiUpJykuYXNDb2xvcig4NiwgNCwgNjcpXG4gICAgaXRQYXJzZXMoJ3NoYWRlKCNmZDBjYzcsNjYpJykuYXNDb2xvcig4NiwgNCwgNjcpXG4gICAgaXRQYXJzZXMoJ3NoYWRlKCRjLCRyKScpLmFzSW52YWxpZCgpXG4gICAgaXRQYXJzZXMoJ3NoYWRlKCRjLCAkciknKS53aXRoQ29udGV4dCh7XG4gICAgICAnJGMnOiBhc0NvbG9yICdoc3YoJGgsICRzLCAkdiknXG4gICAgICAnJHInOiAnMSdcbiAgICB9KS5hc0ludmFsaWQoKVxuICAgIGl0UGFyc2VzKCdzaGFkZSgkYywkciknKS53aXRoQ29udGV4dCh7XG4gICAgICAnJGMnOiBhc0NvbG9yICcjZmQwY2M3J1xuICAgICAgJyRyJzogJzY2JSdcbiAgICB9KS5hc0NvbG9yKDg2LCA0LCA2NylcbiAgICBpdFBhcnNlcygnc2hhZGUoJGMsJHIpJykud2l0aENvbnRleHQoe1xuICAgICAgJyRhJzogYXNDb2xvciAnI2ZkMGNjNydcbiAgICAgICckYyc6IGFzQ29sb3IgJ3JnYmEoJGEsIDAuOSknXG4gICAgICAnJHInOiAnNjYlJ1xuICAgIH0pLmFzQ29sb3IoODYsIDQsIDY3LCAwLjk2NilcblxuICBkZXNjcmliZSAnc2NzcyBhbmQgc2FzcycsIC0+XG4gICAgZGVzY3JpYmUgJ3dpdGggY29tcGFzcyBpbXBsZW1lbnRhdGlvbicsIC0+XG4gICAgICBiZWZvcmVFYWNoIC0+IEBzY29wZSA9ICdzYXNzOmNvbXBhc3MnXG5cbiAgICAgIGl0UGFyc2VzKCd0aW50KCNCQURBNTUsIDQyJSknKS5hc0NvbG9yKCcjZTJlZmI3JylcbiAgICAgIGl0UGFyc2VzKCd0aW50KCNCQURBNTUsIDQyKScpLmFzQ29sb3IoJyNlMmVmYjcnKVxuICAgICAgaXRQYXJzZXMoJ3RpbnQoJGMsJHIpJykuYXNJbnZhbGlkKClcbiAgICAgIGl0UGFyc2VzKCd0aW50KCRjLCAkciknKS53aXRoQ29udGV4dCh7XG4gICAgICAgICckYyc6IGFzQ29sb3IgJ2hzdigkaCwgJHMsICR2KSdcbiAgICAgICAgJyRyJzogJzEnXG4gICAgICB9KS5hc0ludmFsaWQoKVxuICAgICAgaXRQYXJzZXMoJ3RpbnQoJGMsJHIpJykud2l0aENvbnRleHQoe1xuICAgICAgICAnJGMnOiBhc0NvbG9yICcjQkFEQTU1J1xuICAgICAgICAnJHInOiAnNDIlJ1xuICAgICAgfSkuYXNDb2xvcignI2UyZWZiNycpXG4gICAgICBpdFBhcnNlcygndGludCgkYywkciknKS53aXRoQ29udGV4dCh7XG4gICAgICAgICckYSc6IGFzQ29sb3IgJyNCQURBNTUnXG4gICAgICAgICckYyc6IGFzQ29sb3IgJ3JnYmEoJGEsIDAuOSknXG4gICAgICAgICckcic6ICc0MiUnXG4gICAgICB9KS5hc0NvbG9yKDIyNiwyMzksMTgzLDAuOTQyKVxuXG4gICAgICBpdFBhcnNlcygnc2hhZGUoIzY2MzM5OSwgNDIlKScpLmFzQ29sb3IoJyMyYTE1NDAnKVxuICAgICAgaXRQYXJzZXMoJ3NoYWRlKCM2NjMzOTksIDQyKScpLmFzQ29sb3IoJyMyYTE1NDAnKVxuICAgICAgaXRQYXJzZXMoJ3NoYWRlKCRjLCRyKScpLmFzSW52YWxpZCgpXG4gICAgICBpdFBhcnNlcygnc2hhZGUoJGMsICRyKScpLndpdGhDb250ZXh0KHtcbiAgICAgICAgJyRjJzogYXNDb2xvciAnaHN2KCRoLCAkcywgJHYpJ1xuICAgICAgICAnJHInOiAnMSdcbiAgICAgIH0pLmFzSW52YWxpZCgpXG4gICAgICBpdFBhcnNlcygnc2hhZGUoJGMsJHIpJykud2l0aENvbnRleHQoe1xuICAgICAgICAnJGMnOiBhc0NvbG9yICcjNjYzMzk5J1xuICAgICAgICAnJHInOiAnNDIlJ1xuICAgICAgfSkuYXNDb2xvcignIzJhMTU0MCcpXG4gICAgICBpdFBhcnNlcygnc2hhZGUoJGMsJHIpJykud2l0aENvbnRleHQoe1xuICAgICAgICAnJGEnOiBhc0NvbG9yICcjNjYzMzk5J1xuICAgICAgICAnJGMnOiBhc0NvbG9yICdyZ2JhKCRhLCAwLjkpJ1xuICAgICAgICAnJHInOiAnNDIlJ1xuICAgICAgfSkuYXNDb2xvcigweDJhLDB4MTUsMHg0MCwwLjk0MilcblxuICAgIGRlc2NyaWJlICd3aXRoIGJvdXJib24gaW1wbGVtZW50YXRpb24nLCAtPlxuICAgICAgYmVmb3JlRWFjaCAtPiBAc2NvcGUgPSAnc2Fzczpib3VyYm9uJ1xuXG4gICAgICBpdFBhcnNlcygndGludCgjQkFEQTU1LCA0MiUpJykuYXNDb2xvcigyMTQsIDIzMywgMTU2KVxuICAgICAgaXRQYXJzZXMoJ3RpbnQoI0JBREE1NSwgNDIpJykuYXNDb2xvcigyMTQsIDIzMywgMTU2KVxuICAgICAgaXRQYXJzZXMoJ3RpbnQoJGMsJHIpJykuYXNJbnZhbGlkKClcbiAgICAgIGl0UGFyc2VzKCd0aW50KCRjLCAkciknKS53aXRoQ29udGV4dCh7XG4gICAgICAgICckYyc6IGFzQ29sb3IgJ2hzdigkaCwgJHMsICR2KSdcbiAgICAgICAgJyRyJzogJzEnXG4gICAgICB9KS5hc0ludmFsaWQoKVxuICAgICAgaXRQYXJzZXMoJ3RpbnQoJGMsJHIpJykud2l0aENvbnRleHQoe1xuICAgICAgICAnJGMnOiBhc0NvbG9yICcjQkFEQTU1J1xuICAgICAgICAnJHInOiAnNDIlJ1xuICAgICAgfSkuYXNDb2xvcigyMTQsIDIzMywgMTU2KVxuICAgICAgaXRQYXJzZXMoJ3RpbnQoJGMsJHIpJykud2l0aENvbnRleHQoe1xuICAgICAgICAnJGEnOiBhc0NvbG9yICcjQkFEQTU1J1xuICAgICAgICAnJGMnOiBhc0NvbG9yICdyZ2JhKCRhLCAwLjkpJ1xuICAgICAgICAnJHInOiAnNDIlJ1xuICAgICAgfSkuYXNDb2xvcigyMTQsIDIzMywgMTU2LCAwLjk0MilcblxuICAgICAgaXRQYXJzZXMoJ3NoYWRlKCM2NjMzOTksIDQyJSknKS5hc0NvbG9yKDU5LCAyOSwgODgpXG4gICAgICBpdFBhcnNlcygnc2hhZGUoIzY2MzM5OSwgNDIpJykuYXNDb2xvcig1OSwgMjksIDg4KVxuICAgICAgaXRQYXJzZXMoJ3NoYWRlKCRjLCRyKScpLmFzSW52YWxpZCgpXG4gICAgICBpdFBhcnNlcygnc2hhZGUoJGMsICRyKScpLndpdGhDb250ZXh0KHtcbiAgICAgICAgJyRjJzogYXNDb2xvciAnaHN2KCRoLCAkcywgJHYpJ1xuICAgICAgICAnJHInOiAnMSdcbiAgICAgIH0pLmFzSW52YWxpZCgpXG4gICAgICBpdFBhcnNlcygnc2hhZGUoJGMsJHIpJykud2l0aENvbnRleHQoe1xuICAgICAgICAnJGMnOiBhc0NvbG9yICcjNjYzMzk5J1xuICAgICAgICAnJHInOiAnNDIlJ1xuICAgICAgfSkuYXNDb2xvcig1OSwgMjksIDg4KVxuICAgICAgaXRQYXJzZXMoJ3NoYWRlKCRjLCRyKScpLndpdGhDb250ZXh0KHtcbiAgICAgICAgJyRhJzogYXNDb2xvciAnIzY2MzM5OSdcbiAgICAgICAgJyRjJzogYXNDb2xvciAncmdiYSgkYSwgMC45KSdcbiAgICAgICAgJyRyJzogJzQyJSdcbiAgICAgIH0pLmFzQ29sb3IoNTksIDI5LCA4OCwgMC45NDIpXG5cbiAgaXRQYXJzZXMoJ2FkanVzdC1jb2xvcigjMTAyMDMwLCAkcmVkOiAtNSwgJGJsdWU6IDUpJywgMTEsIDMyLCA1MylcbiAgaXRQYXJzZXMoJ2FkanVzdC1jb2xvcihoc2woMjUsIDEwMCUsIDgwJSksICRsaWdodG5lc3M6IC0zMCUsICRhbHBoYTogLTAuNCknLCAyNTUsIDEwNiwgMCwgMC42KVxuICBpdFBhcnNlcygnYWRqdXN0LWNvbG9yKCRjLCAkcmVkOiAkYSwgJGJsdWU6ICRiKScpLmFzSW52YWxpZCgpXG4gIGl0UGFyc2VzKCdhZGp1c3QtY29sb3IoJGQsICRyZWQ6ICRhLCAkYmx1ZTogJGIpJykud2l0aENvbnRleHQoe1xuICAgICckYSc6ICctNSdcbiAgICAnJGInOiAnNSdcbiAgICAnJGQnOiBhc0NvbG9yICdyZ2JhKCRjLCAxKSdcbiAgfSkuYXNJbnZhbGlkKClcbiAgaXRQYXJzZXMoJ2FkanVzdC1jb2xvcigkYywgJHJlZDogJGEsICRibHVlOiAkYiknKS53aXRoQ29udGV4dCh7XG4gICAgJyRhJzogJy01J1xuICAgICckYic6ICc1J1xuICAgICckYyc6IGFzQ29sb3IgJyMxMDIwMzAnXG4gIH0pLmFzQ29sb3IoMTEsIDMyLCA1MylcbiAgaXRQYXJzZXMoJ2FkanVzdC1jb2xvcigkZCwgJHJlZDogJGEsICRibHVlOiAkYiknKS53aXRoQ29udGV4dCh7XG4gICAgJyRhJzogJy01J1xuICAgICckYic6ICc1J1xuICAgICckYyc6IGFzQ29sb3IgJyMxMDIwMzAnXG4gICAgJyRkJzogYXNDb2xvciAncmdiYSgkYywgMSknXG4gIH0pLmFzQ29sb3IoMTEsIDMyLCA1MylcblxuICBpdFBhcnNlcygnc2NhbGUtY29sb3IocmdiKDIwMCwgMTUwLCAxNzApLCAkZ3JlZW46IC00MCUsICRibHVlOiA3MCUpJykuYXNDb2xvcigyMDAsIDkwLCAyMzApXG4gIGl0UGFyc2VzKCdjaGFuZ2UtY29sb3IocmdiKDIwMCwgMTUwLCAxNzApLCAkZ3JlZW46IDQwLCAkYmx1ZTogNzApJykuYXNDb2xvcigyMDAsIDQwLCA3MClcbiAgaXRQYXJzZXMoJ3NjYWxlLWNvbG9yKCRjLCAkZ3JlZW46ICRhLCAkYmx1ZTogJGIpJykuYXNJbnZhbGlkKClcbiAgaXRQYXJzZXMoJ3NjYWxlLWNvbG9yKCRkLCAkZ3JlZW46ICRhLCAkYmx1ZTogJGIpJykud2l0aENvbnRleHQoe1xuICAgICckYSc6ICctNDAlJ1xuICAgICckYic6ICc3MCUnXG4gICAgJyRkJzogYXNDb2xvciAncmdiYSgkYywgMSknXG4gIH0pLmFzSW52YWxpZCgpXG4gIGl0UGFyc2VzKCdzY2FsZS1jb2xvcigkYywgJGdyZWVuOiAkYSwgJGJsdWU6ICRiKScpLndpdGhDb250ZXh0KHtcbiAgICAnJGEnOiAnLTQwJSdcbiAgICAnJGInOiAnNzAlJ1xuICAgICckYyc6IGFzQ29sb3IgJ3JnYigyMDAsIDE1MCwgMTcwKSdcbiAgfSkuYXNDb2xvcigyMDAsIDkwLCAyMzApXG4gIGl0UGFyc2VzKCdzY2FsZS1jb2xvcigkZCwgJGdyZWVuOiAkYSwgJGJsdWU6ICRiKScpLndpdGhDb250ZXh0KHtcbiAgICAnJGEnOiAnLTQwJSdcbiAgICAnJGInOiAnNzAlJ1xuICAgICckYyc6IGFzQ29sb3IgJ3JnYigyMDAsIDE1MCwgMTcwKSdcbiAgICAnJGQnOiBhc0NvbG9yICdyZ2JhKCRjLCAxKSdcbiAgfSkuYXNDb2xvcigyMDAsIDkwLCAyMzApXG5cbiAgaXRQYXJzZXMoJ3NwaW4oI0YwMCwgMTIwKScpLmFzQ29sb3IoMCwgMjU1LCAwKVxuICBpdFBhcnNlcygnc3BpbigjRjAwLCAxMjApJykuYXNDb2xvcigwLCAyNTUsIDApXG4gIGl0UGFyc2VzKCdzcGluKCNGMDAsIDEyMGRlZyknKS5hc0NvbG9yKDAsIDI1NSwgMClcbiAgaXRQYXJzZXMoJ3NwaW4oI0YwMCwgLTEyMCknKS5hc0NvbG9yKDAsIDAsIDI1NSlcbiAgaXRQYXJzZXMoJ3NwaW4oI0YwMCwgLTEyMGRlZyknKS5hc0NvbG9yKDAsIDAsIDI1NSlcbiAgaXRQYXJzZXMoJ3NwaW4oQGMsIEBhKScpLndpdGhDb250ZXh0KHtcbiAgICAnQGMnOiBhc0NvbG9yICcjRjAwJ1xuICAgICdAYSc6ICcxMjAnXG4gIH0pLmFzQ29sb3IoMCwgMjU1LCAwKVxuICBpdFBhcnNlcygnc3BpbihAYywgQGEpJykud2l0aENvbnRleHQoe1xuICAgICdAYSc6ICcxMjAnXG4gIH0pLmFzSW52YWxpZCgpXG4gIGl0UGFyc2VzKCdzcGluKEBjLCBAYSknKS53aXRoQ29udGV4dCh7XG4gICAgJ0BhJzogJzEyMCdcbiAgfSkuYXNJbnZhbGlkKClcbiAgaXRQYXJzZXMoJ3NwaW4oQGMsIEBhLCknKS5hc1VuZGVmaW5lZCgpXG5cbiAgaXRQYXJzZXMoJ2ZhZGUoI0YwMCwgMC41KScpLmFzQ29sb3IoMjU1LCAwLCAwLCAwLjUpXG4gIGl0UGFyc2VzKCdmYWRlKCNGMDAsIDUwJSknKS5hc0NvbG9yKDI1NSwgMCwgMCwgMC41KVxuICBpdFBhcnNlcygnZmFkZSgjRjAwLCA1MCknKS5hc0NvbG9yKDI1NSwgMCwgMCwgMC41KVxuICBpdFBhcnNlcygnZmFkZShAYywgQGEpJykud2l0aENvbnRleHQoe1xuICAgICdAYyc6IGFzQ29sb3IgJyNGMDAnXG4gICAgJ0BhJzogJzAuNSdcbiAgfSkuYXNDb2xvcigyNTUsIDAsIDAsIDAuNSlcbiAgaXRQYXJzZXMoJ2ZhZGUoQGMsIEBhKScpLndpdGhDb250ZXh0KHtcbiAgICAnQGEnOiAnMC41J1xuICB9KS5hc0ludmFsaWQoKVxuICBpdFBhcnNlcygnZmFkZShAYywgQGEpJykud2l0aENvbnRleHQoe1xuICAgICdAYSc6ICcwLjUnXG4gIH0pLmFzSW52YWxpZCgpXG4gIGl0UGFyc2VzKCdmYWRlKEBjLCBAYSwpJykuYXNVbmRlZmluZWQoKVxuXG4gIGl0UGFyc2VzKCdjb250cmFzdCgjYmJiYmJiKScpLmFzQ29sb3IoMCwwLDApXG4gIGl0UGFyc2VzKCdjb250cmFzdCgjMzMzMzMzKScpLmFzQ29sb3IoMjU1LDI1NSwyNTUpXG4gIGl0UGFyc2VzKCdjb250cmFzdCgjYmJiYmJiLCByZ2IoMjAsMjAsMjApKScpLmFzQ29sb3IoMjAsMjAsMjApXG4gIGl0UGFyc2VzKCdjb250cmFzdCgjMzMzMzMzLCByZ2IoMjAsMjAsMjApLCByZ2IoMTQwLDE0MCwxNDApKScpLmFzQ29sb3IoMTQwLDE0MCwxNDApXG4gIGl0UGFyc2VzKCdjb250cmFzdCgjNjY2NjY2LCByZ2IoMjAsMjAsMjApLCByZ2IoMTQwLDE0MCwxNDApLCAxMyUpJykuYXNDb2xvcigxNDAsMTQwLDE0MClcblxuICBpdFBhcnNlcygnY29udHJhc3QoQGJhc2UpJykud2l0aENvbnRleHQoe1xuICAgICdAYmFzZSc6IGFzQ29sb3IgJyNiYmJiYmInXG4gIH0pLmFzQ29sb3IoMCwwLDApXG4gIGl0UGFyc2VzKCdjb250cmFzdChAYmFzZSknKS53aXRoQ29udGV4dCh7XG4gICAgJ0BiYXNlJzogYXNDb2xvciAnIzMzMzMzMydcbiAgfSkuYXNDb2xvcigyNTUsMjU1LDI1NSlcbiAgaXRQYXJzZXMoJ2NvbnRyYXN0KEBiYXNlLCBAZGFyayknKS53aXRoQ29udGV4dCh7XG4gICAgJ0BiYXNlJzogYXNDb2xvciAnI2JiYmJiYidcbiAgICAnQGRhcmsnOiBhc0NvbG9yICdyZ2IoMjAsMjAsMjApJ1xuICB9KS5hc0NvbG9yKDIwLDIwLDIwKVxuICBpdFBhcnNlcygnY29udHJhc3QoQGJhc2UsIEBkYXJrLCBAbGlnaHQpJykud2l0aENvbnRleHQoe1xuICAgICdAYmFzZSc6IGFzQ29sb3IgJyMzMzMzMzMnXG4gICAgJ0BkYXJrJzogYXNDb2xvciAncmdiKDIwLDIwLDIwKSdcbiAgICAnQGxpZ2h0JzogYXNDb2xvciAncmdiKDE0MCwxNDAsMTQwKSdcbiAgfSkuYXNDb2xvcigxNDAsMTQwLDE0MClcbiAgaXRQYXJzZXMoJ2NvbnRyYXN0KEBiYXNlLCBAZGFyaywgQGxpZ2h0LCBAdGhyZXNob2xkKScpLndpdGhDb250ZXh0KHtcbiAgICAnQGJhc2UnOiBhc0NvbG9yICcjNjY2NjY2J1xuICAgICdAZGFyayc6IGFzQ29sb3IgJ3JnYigyMCwyMCwyMCknXG4gICAgJ0BsaWdodCc6IGFzQ29sb3IgJ3JnYigxNDAsMTQwLDE0MCknXG4gICAgJ0B0aHJlc2hvbGQnOiAnMTMlJ1xuICB9KS5hc0NvbG9yKDE0MCwxNDAsMTQwKVxuXG4gIGl0UGFyc2VzKCdjb250cmFzdChAYmFzZSknKS5hc0ludmFsaWQoKVxuICBpdFBhcnNlcygnY29udHJhc3QoQGJhc2UpJykuYXNJbnZhbGlkKClcbiAgaXRQYXJzZXMoJ2NvbnRyYXN0KEBiYXNlLCBAZGFyayknKS5hc0ludmFsaWQoKVxuICBpdFBhcnNlcygnY29udHJhc3QoQGJhc2UsIEBkYXJrLCBAbGlnaHQpJykuYXNJbnZhbGlkKClcbiAgaXRQYXJzZXMoJ2NvbnRyYXN0KEBiYXNlLCBAZGFyaywgQGxpZ2h0LCBAdGhyZXNob2xkKScpLmFzSW52YWxpZCgpXG5cbiAgaXRQYXJzZXMoJ211bHRpcGx5KCNmZjY2MDAsIDB4NjY2NjY2KScpLmFzQ29sb3IoJyM2NjI5MDAnKVxuICBpdFBhcnNlcygnbXVsdGlwbHkoQGJhc2UsIEBtb2RpZmllciknKS53aXRoQ29udGV4dCh7XG4gICAgJ0BiYXNlJzogYXNDb2xvciAnI2ZmNjYwMCdcbiAgICAnQG1vZGlmaWVyJzogYXNDb2xvciAnIzY2NjY2NidcbiAgfSkuYXNDb2xvcignIzY2MjkwMCcpXG4gIGl0UGFyc2VzKCdtdWx0aXBseShAYmFzZSwgQG1vZGlmaWVyKScpLmFzSW52YWxpZCgpXG5cbiAgaXRQYXJzZXMoJ3NjcmVlbigjZmY2NjAwLCAweDY2NjY2NiknKS5hc0NvbG9yKCcjZmZhMzY2JylcbiAgaXRQYXJzZXMoJ3NjcmVlbihAYmFzZSwgQG1vZGlmaWVyKScpLndpdGhDb250ZXh0KHtcbiAgICAnQGJhc2UnOiBhc0NvbG9yICcjZmY2NjAwJ1xuICAgICdAbW9kaWZpZXInOiBhc0NvbG9yICcjNjY2NjY2J1xuICB9KS5hc0NvbG9yKCcjZmZhMzY2JylcbiAgaXRQYXJzZXMoJ3NjcmVlbihAYmFzZSwgQG1vZGlmaWVyKScpLmFzSW52YWxpZCgpXG5cbiAgaXRQYXJzZXMoJ292ZXJsYXkoI2ZmNjYwMCwgMHg2NjY2NjYpJykuYXNDb2xvcignI2ZmNTIwMCcpXG4gIGl0UGFyc2VzKCdvdmVybGF5KEBiYXNlLCBAbW9kaWZpZXIpJykud2l0aENvbnRleHQoe1xuICAgICdAYmFzZSc6IGFzQ29sb3IgJyNmZjY2MDAnXG4gICAgJ0Btb2RpZmllcic6IGFzQ29sb3IgJyM2NjY2NjYnXG4gIH0pLmFzQ29sb3IoJyNmZjUyMDAnKVxuICBpdFBhcnNlcygnb3ZlcmxheShAYmFzZSwgQG1vZGlmaWVyKScpLmFzSW52YWxpZCgpXG5cbiAgaXRQYXJzZXMoJ3NvZnRsaWdodCgjZmY2NjAwLCAweDY2NjY2NiknKS5hc0NvbG9yKCcjZmY1YTAwJylcbiAgaXRQYXJzZXMoJ3NvZnRsaWdodChAYmFzZSwgQG1vZGlmaWVyKScpLndpdGhDb250ZXh0KHtcbiAgICAnQGJhc2UnOiBhc0NvbG9yICcjZmY2NjAwJ1xuICAgICdAbW9kaWZpZXInOiBhc0NvbG9yICcjNjY2NjY2J1xuICB9KS5hc0NvbG9yKCcjZmY1YTAwJylcbiAgaXRQYXJzZXMoJ3NvZnRsaWdodChAYmFzZSwgQG1vZGlmaWVyKScpLmFzSW52YWxpZCgpXG5cbiAgaXRQYXJzZXMoJ2hhcmRsaWdodCgjZmY2NjAwLCAweDY2NjY2NiknKS5hc0NvbG9yKCcjY2M1MjAwJylcbiAgaXRQYXJzZXMoJ2hhcmRsaWdodChAYmFzZSwgQG1vZGlmaWVyKScpLndpdGhDb250ZXh0KHtcbiAgICAnQGJhc2UnOiBhc0NvbG9yICcjZmY2NjAwJ1xuICAgICdAbW9kaWZpZXInOiBhc0NvbG9yICcjNjY2NjY2J1xuICB9KS5hc0NvbG9yKCcjY2M1MjAwJylcbiAgaXRQYXJzZXMoJ2hhcmRsaWdodChAYmFzZSwgQG1vZGlmaWVyKScpLmFzSW52YWxpZCgpXG5cbiAgaXRQYXJzZXMoJ2RpZmZlcmVuY2UoI2ZmNjYwMCwgMHg2NjY2NjYpJykuYXNDb2xvcignIzk5MDA2NicpXG4gIGl0UGFyc2VzKCdkaWZmZXJlbmNlKCNmZjY2MDAsKSgpJykuYXNJbnZhbGlkKClcbiAgaXRQYXJzZXMoJ2RpZmZlcmVuY2UoQGJhc2UsIEBtb2RpZmllciknKS53aXRoQ29udGV4dCh7XG4gICAgJ0BiYXNlJzogYXNDb2xvciAnI2ZmNjYwMCdcbiAgICAnQG1vZGlmaWVyJzogYXNDb2xvciAnIzY2NjY2NidcbiAgfSkuYXNDb2xvcignIzk5MDA2NicpXG4gIGl0UGFyc2VzKCdkaWZmZXJlbmNlKEBiYXNlLCBAbW9kaWZpZXIpJykuYXNJbnZhbGlkKClcblxuICBpdFBhcnNlcygnZXhjbHVzaW9uKCNmZjY2MDAsIDB4NjY2NjY2KScpLmFzQ29sb3IoJyM5OTdhNjYnKVxuICBpdFBhcnNlcygnZXhjbHVzaW9uKEBiYXNlLCBAbW9kaWZpZXIpJykud2l0aENvbnRleHQoe1xuICAgICdAYmFzZSc6IGFzQ29sb3IgJyNmZjY2MDAnXG4gICAgJ0Btb2RpZmllcic6IGFzQ29sb3IgJyM2NjY2NjYnXG4gIH0pLmFzQ29sb3IoJyM5OTdhNjYnKVxuICBpdFBhcnNlcygnZXhjbHVzaW9uKEBiYXNlLCBAbW9kaWZpZXIpJykuYXNJbnZhbGlkKClcblxuICBpdFBhcnNlcygnYXZlcmFnZSgjZmY2NjAwLCAweDY2NjY2NiknKS5hc0NvbG9yKCcjYjM2NjMzJylcbiAgaXRQYXJzZXMoJ2F2ZXJhZ2UoQGJhc2UsIEBtb2RpZmllciknKS53aXRoQ29udGV4dCh7XG4gICAgJ0BiYXNlJzogYXNDb2xvciAnI2ZmNjYwMCdcbiAgICAnQG1vZGlmaWVyJzogYXNDb2xvciAnIzY2NjY2NidcbiAgfSkuYXNDb2xvcignI2IzNjYzMycpXG4gIGl0UGFyc2VzKCdhdmVyYWdlKEBiYXNlLCBAbW9kaWZpZXIpJykuYXNJbnZhbGlkKClcbiAgaXRQYXJzZXMoJ2F2ZXJhZ2UoQGdyYWRpZW50LWIsIEBncmFkaWVudC1tZWFuKScpLndpdGhDb250ZXh0KHtcbiAgICAnQGdyYWRpZW50LWEnOiBhc0NvbG9yICcjMDBkMzhiJ1xuICAgICdAZ3JhZGllbnQtYic6IGFzQ29sb3IgJyMwMDkyODUnXG4gICAgJ0BncmFkaWVudC1tZWFuJzogYXNDb2xvciAnYXZlcmFnZShAZ3JhZGllbnQtYSwgQGdyYWRpZW50LWIpJ1xuICB9KS5hc0NvbG9yKCcjMDBhMjg3JylcblxuICBpdFBhcnNlcygnbmVnYXRpb24oI2ZmNjYwMCwgMHg2NjY2NjYpJykuYXNDb2xvcignIzk5Y2M2NicpXG4gIGl0UGFyc2VzKCduZWdhdGlvbihAYmFzZSwgQG1vZGlmaWVyKScpLndpdGhDb250ZXh0KHtcbiAgICAnQGJhc2UnOiBhc0NvbG9yICcjZmY2NjAwJ1xuICAgICdAbW9kaWZpZXInOiBhc0NvbG9yICcjNjY2NjY2J1xuICB9KS5hc0NvbG9yKCcjOTljYzY2JylcbiAgaXRQYXJzZXMoJ25lZ2F0aW9uKEBiYXNlLCBAbW9kaWZpZXIpJykuYXNJbnZhbGlkKClcblxuICBpdFBhcnNlcygnYmxlbmQocmdiYSgjRkZERTAwLC40MiksIDB4MTlDMjYxKScpLmFzQ29sb3IoJyM3YWNlMzgnKVxuICBpdFBhcnNlcygnYmxlbmQoQHRvcCwgQGJvdHRvbSknKS53aXRoQ29udGV4dCh7XG4gICAgJ0B0b3AnOiBhc0NvbG9yICdyZ2JhKCNGRkRFMDAsLjQyKSdcbiAgICAnQGJvdHRvbSc6IGFzQ29sb3IgJzB4MTlDMjYxJ1xuICB9KS5hc0NvbG9yKCcjN2FjZTM4JylcbiAgaXRQYXJzZXMoJ2JsZW5kKEB0b3AsIEBib3R0b20pJykuYXNJbnZhbGlkKClcblxuICBpdFBhcnNlcygnY29tcGxlbWVudChyZWQpJykuYXNDb2xvcignIzAwZmZmZicpXG4gIGl0UGFyc2VzKCdjb21wbGVtZW50KEBiYXNlKScpLndpdGhDb250ZXh0KHtcbiAgICAnQGJhc2UnOiBhc0NvbG9yICdyZWQnXG4gIH0pLmFzQ29sb3IoJyMwMGZmZmYnKVxuICBpdFBhcnNlcygnY29tcGxlbWVudChAYmFzZSknKS5hc0ludmFsaWQoKVxuXG4gIGl0UGFyc2VzKCd0cmFuc3BhcmVudGlmeSgjODA4MDgwKScpLmFzQ29sb3IoMCwwLDAsMC41KVxuICBpdFBhcnNlcygndHJhbnNwYXJlbnRpZnkoIzQxNDE0MSwgYmxhY2spJykuYXNDb2xvcigyNTUsMjU1LDI1NSwwLjI1KVxuICBpdFBhcnNlcygndHJhbnNwYXJlbnRpZnkoIzkxOTc0QywgMHhGMzQ5NDksIDAuNSknKS5hc0NvbG9yKDQ3LDIyOSw3OSwwLjUpXG4gIGl0UGFyc2VzKCd0cmFuc3BhcmVudGlmeShhKScpLndpdGhDb250ZXh0KHtcbiAgICAnYSc6IGFzQ29sb3IgJyM4MDgwODAnXG4gIH0pLmFzQ29sb3IoMCwwLDAsMC41KVxuICBpdFBhcnNlcygndHJhbnNwYXJlbnRpZnkoYSwgYiwgMC41KScpLndpdGhDb250ZXh0KHtcbiAgICAnYSc6IGFzQ29sb3IgJyM5MTk3NEMnXG4gICAgJ2InOiBhc0NvbG9yICcjRjM0OTQ5J1xuICB9KS5hc0NvbG9yKDQ3LDIyOSw3OSwwLjUpXG4gIGl0UGFyc2VzKCd0cmFuc3BhcmVudGlmeShhKScpLmFzSW52YWxpZCgpXG5cbiAgaXRQYXJzZXMoJ3JlZCgjMDAwLCAyNTUpJykuYXNDb2xvcigyNTUsMCwwKVxuICBpdFBhcnNlcygncmVkKGEsIGIpJykud2l0aENvbnRleHQoe1xuICAgICdhJzogYXNDb2xvciAnIzAwMCdcbiAgICAnYic6ICcyNTUnXG4gIH0pLmFzQ29sb3IoMjU1LDAsMClcbiAgaXRQYXJzZXMoJ3JlZChhLCBiKScpLmFzSW52YWxpZCgpXG5cbiAgaXRQYXJzZXMoJ2dyZWVuKCMwMDAsIDI1NSknKS5hc0NvbG9yKDAsMjU1LDApXG4gIGl0UGFyc2VzKCdncmVlbihhLCBiKScpLndpdGhDb250ZXh0KHtcbiAgICAnYSc6IGFzQ29sb3IgJyMwMDAnXG4gICAgJ2InOiAnMjU1J1xuICB9KS5hc0NvbG9yKDAsMjU1LDApXG4gIGl0UGFyc2VzKCdncmVlbihhLCBiKScpLmFzSW52YWxpZCgpXG5cbiAgaXRQYXJzZXMoJ2JsdWUoIzAwMCwgMjU1KScpLmFzQ29sb3IoMCwwLDI1NSlcbiAgaXRQYXJzZXMoJ2JsdWUoYSwgYiknKS53aXRoQ29udGV4dCh7XG4gICAgJ2EnOiBhc0NvbG9yICcjMDAwJ1xuICAgICdiJzogJzI1NSdcbiAgfSkuYXNDb2xvcigwLDAsMjU1KVxuICBpdFBhcnNlcygnYmx1ZShhLCBiKScpLmFzSW52YWxpZCgpXG5cbiAgaXRQYXJzZXMoJ2FscGhhKCMwMDAsIDAuNSknKS5hc0NvbG9yKDAsMCwwLDAuNSlcbiAgaXRQYXJzZXMoJ2FscGhhKGEsIGIpJykud2l0aENvbnRleHQoe1xuICAgICdhJzogYXNDb2xvciAnIzAwMCdcbiAgICAnYic6ICcwLjUnXG4gIH0pLmFzQ29sb3IoMCwwLDAsMC41KVxuICBpdFBhcnNlcygnYWxwaGEoYSwgYiknKS5hc0ludmFsaWQoKVxuXG4gIGl0UGFyc2VzKCdodWUoIzAwYywgOTBkZWcpJykuYXNDb2xvcigweDY2LDB4Q0MsMClcbiAgaXRQYXJzZXMoJ2h1ZShhLCBiKScpLndpdGhDb250ZXh0KHtcbiAgICAnYSc6IGFzQ29sb3IgJyMwMGMnXG4gICAgJ2InOiAnOTBkZWcnXG4gIH0pLmFzQ29sb3IoMHg2NiwweENDLDApXG4gIGl0UGFyc2VzKCdodWUoYSwgYiknKS5hc0ludmFsaWQoKVxuXG4gIGl0UGFyc2VzKCdzYXR1cmF0aW9uKCMwMGMsIDUwJSknKS5hc0NvbG9yKDB4MzMsMHgzMywweDk5KVxuICBpdFBhcnNlcygnc2F0dXJhdGlvbihhLCBiKScpLndpdGhDb250ZXh0KHtcbiAgICAnYSc6IGFzQ29sb3IgJyMwMGMnXG4gICAgJ2InOiAnNTAlJ1xuICB9KS5hc0NvbG9yKDB4MzMsMHgzMywweDk5KVxuICBpdFBhcnNlcygnc2F0dXJhdGlvbihhLCBiKScpLmFzSW52YWxpZCgpXG5cbiAgaXRQYXJzZXMoJ2xpZ2h0bmVzcygjMDBjLCA4MCUpJykuYXNDb2xvcigweDk5LDB4OTksMHhmZilcbiAgaXRQYXJzZXMoJ2xpZ2h0bmVzcyhhLCBiKScpLndpdGhDb250ZXh0KHtcbiAgICAnYSc6IGFzQ29sb3IgJyMwMGMnXG4gICAgJ2InOiAnODAlJ1xuICB9KS5hc0NvbG9yKDB4OTksMHg5OSwweGZmKVxuICBpdFBhcnNlcygnbGlnaHRuZXNzKGEsIGIpJykuYXNJbnZhbGlkKClcblxuICBkZXNjcmliZSAnQ1NTIGNvbG9yIGZ1bmN0aW9uJywgLT5cbiAgICBiZWZvcmVFYWNoIC0+IEBzY29wZSA9ICdjc3MnXG5cbiAgICBpdFBhcnNlcygnY29sb3IoI2ZkMGNjNyB0aW50KDY2JSkpJykuYXNDb2xvcigyNTQsIDE3MiwgMjM2KVxuICAgIGl0UGFyc2VzKCdDT0xPUigjZmQwY2M3IHRpbnQoNjYlKSknKS5hc0NvbG9yKDI1NCwgMTcyLCAyMzYpXG4gICAgaXRQYXJzZXMoJ2NPbE9yKCNmZDBjYzcgdGludCg2NiUpKScpLmFzQ29sb3IoMjU0LCAxNzIsIDIzNilcbiAgICBpdFBhcnNlcygnY29sb3IodmFyKC0tZm9vKSB0aW50KDY2JSkpJykud2l0aENvbnRleHQoe1xuICAgICAgJ3ZhcigtLWZvbyknOiBhc0NvbG9yICcjZmQwY2M3J1xuICAgIH0pLmFzQ29sb3IoMjU0LCAxNzIsIDIzNilcblxuICBkZXNjcmliZSAnbHVhIGNvbG9yJywgLT5cbiAgICBiZWZvcmVFYWNoIC0+IEBzY29wZSA9ICdsdWEnXG5cbiAgICBpdFBhcnNlcygnQ29sb3IoMjU1LCAwLCAwLCAyNTUpJykuYXNDb2xvcigyNTUsMCwwKVxuICAgIGl0UGFyc2VzKCdDb2xvcihyLCBnLCBiLCBhKScpLndpdGhDb250ZXh0KHtcbiAgICAgICdyJzogJzI1NSdcbiAgICAgICdnJzogJzAnXG4gICAgICAnYic6ICcwJ1xuICAgICAgJ2EnOiAnMjU1J1xuICAgIH0pLmFzQ29sb3IoMjU1LDAsMClcbiAgICBpdFBhcnNlcygnQ29sb3IociwgZywgYiwgYSknKS5hc0ludmFsaWQoKVxuXG4gICMgICAgIyMjIyMjIyMgIyMgICAgICAgIyMgICAgICMjXG4gICMgICAgIyMgICAgICAgIyMgICAgICAgIyMjICAgIyMjXG4gICMgICAgIyMgICAgICAgIyMgICAgICAgIyMjIyAjIyMjXG4gICMgICAgIyMjIyMjICAgIyMgICAgICAgIyMgIyMjICMjXG4gICMgICAgIyMgICAgICAgIyMgICAgICAgIyMgICAgICMjXG4gICMgICAgIyMgICAgICAgIyMgICAgICAgIyMgICAgICMjXG4gICMgICAgIyMjIyMjIyMgIyMjIyMjIyMgIyMgICAgICMjXG5cbiAgZGVzY3JpYmUgJ2VsbS1sYW5nIHN1cHBvcnQnLCAtPlxuICAgIGJlZm9yZUVhY2ggLT4gQHNjb3BlID0gJ2VsbSdcblxuICAgIGl0UGFyc2VzKCdyZ2JhIDI1NSAwIDAgMScpLmFzQ29sb3IoMjU1LDAsMClcbiAgICBpdFBhcnNlcygncmdiYSByIGcgYiBhJykud2l0aENvbnRleHQoe1xuICAgICAgJ3InOiAnMjU1J1xuICAgICAgJ2cnOiAnMCdcbiAgICAgICdiJzogJzAnXG4gICAgICAnYSc6ICcxJ1xuICAgIH0pLmFzQ29sb3IoMjU1LDAsMClcbiAgICBpdFBhcnNlcygncmdiYSByIGcgYiBhJykuYXNJbnZhbGlkKClcblxuICAgIGl0UGFyc2VzKCdyZ2IgMjU1IDAgMCcpLmFzQ29sb3IoMjU1LDAsMClcbiAgICBpdFBhcnNlcygncmdiIHIgZyBiJykud2l0aENvbnRleHQoe1xuICAgICAgJ3InOiAnMjU1J1xuICAgICAgJ2cnOiAnMCdcbiAgICAgICdiJzogJzAnXG4gICAgfSkuYXNDb2xvcigyNTUsMCwwKVxuICAgIGl0UGFyc2VzKCdyZ2IgciBnIGInKS5hc0ludmFsaWQoKVxuXG4gICAgaXRQYXJzZXMoJ2hzbGEgKGRlZ3JlZXMgMjAwKSA1MCA1MCAwLjUnKS5hc0NvbG9yKDY0LCAxNDksIDE5MSwgMC41KVxuICAgIGl0UGFyc2VzKCdoc2xhIChkZWdyZWVzIGgpIHMgbCBhJykud2l0aENvbnRleHQoe1xuICAgICAgJ2gnOiAnMjAwJ1xuICAgICAgJ3MnOiAnNTAnXG4gICAgICAnbCc6ICc1MCdcbiAgICAgICdhJzogJzAuNSdcbiAgICB9KS5hc0NvbG9yKDY0LCAxNDksIDE5MSwgMC41KVxuICAgIGl0UGFyc2VzKCdoc2xhIChkZWdyZWVzIGgpIHMgbCBhJykuYXNJbnZhbGlkKClcblxuICAgIGl0UGFyc2VzKCdoc2xhIDMuNDkgNTAgNTAgMC41JykuYXNDb2xvcig2NCwgMTQ5LCAxOTEsIDAuNSlcbiAgICBpdFBhcnNlcygnaHNsYSBoIHMgbCBhJykud2l0aENvbnRleHQoe1xuICAgICAgJ2gnOiAnMy40OSdcbiAgICAgICdzJzogJzUwJ1xuICAgICAgJ2wnOiAnNTAnXG4gICAgICAnYSc6ICcwLjUnXG4gICAgfSkuYXNDb2xvcig2NCwgMTQ5LCAxOTEsIDAuNSlcbiAgICBpdFBhcnNlcygnaHNsYSBoIHMgbCBhJykuYXNJbnZhbGlkKClcblxuICAgIGl0UGFyc2VzKCdoc2wgKGRlZ3JlZXMgMjAwKSA1MCA1MCcpLmFzQ29sb3IoNjQsIDE0OSwgMTkxKVxuICAgIGl0UGFyc2VzKCdoc2wgKGRlZ3JlZXMgaCkgcyBsJykud2l0aENvbnRleHQoe1xuICAgICAgJ2gnOiAnMjAwJ1xuICAgICAgJ3MnOiAnNTAnXG4gICAgICAnbCc6ICc1MCdcbiAgICB9KS5hc0NvbG9yKDY0LCAxNDksIDE5MSlcbiAgICBpdFBhcnNlcygnaHNsIChkZWdyZWVzIGgpIHMgbCcpLmFzSW52YWxpZCgpXG5cbiAgICBpdFBhcnNlcygnaHNsIDMuNDkgNTAgNTAnKS5hc0NvbG9yKDY0LCAxNDksIDE5MSlcbiAgICBpdFBhcnNlcygnaHNsIGggcyBsJykud2l0aENvbnRleHQoe1xuICAgICAgJ2gnOiAnMy40OSdcbiAgICAgICdzJzogJzUwJ1xuICAgICAgJ2wnOiAnNTAnXG4gICAgfSkuYXNDb2xvcig2NCwgMTQ5LCAxOTEpXG4gICAgaXRQYXJzZXMoJ2hzbCBoIHMgbCcpLmFzSW52YWxpZCgpXG5cbiAgICBpdFBhcnNlcygnZ3JheXNjYWxlIDEnKS5hc0NvbG9yKDAsIDAsIDApXG4gICAgaXRQYXJzZXMoJ2dyZXlzY2FsZSAwLjUnKS5hc0NvbG9yKDEyNywgMTI3LCAxMjcpXG4gICAgaXRQYXJzZXMoJ2dyYXlzY2FsZSAwJykuYXNDb2xvcigyNTUsIDI1NSwgMjU1KVxuICAgIGl0UGFyc2VzKCdncmF5c2NhbGUgZycpLndpdGhDb250ZXh0KHtcbiAgICAgICdnJzogJzAuNSdcbiAgICB9KS5hc0NvbG9yKDEyNywgMTI3LCAxMjcpXG4gICAgaXRQYXJzZXMoJ2dyYXlzY2FsZSBnJykuYXNJbnZhbGlkKClcblxuICAgIGl0UGFyc2VzKCdjb21wbGVtZW50IHJnYiAyNTUgMCAwJykuYXNDb2xvcignIzAwZmZmZicpXG4gICAgaXRQYXJzZXMoJ2NvbXBsZW1lbnQgYmFzZScpLndpdGhDb250ZXh0KHtcbiAgICAgICdiYXNlJzogYXNDb2xvciAncmVkJ1xuICAgIH0pLmFzQ29sb3IoJyMwMGZmZmYnKVxuICAgIGl0UGFyc2VzKCdjb21wbGVtZW50IGJhc2UnKS5hc0ludmFsaWQoKVxuXG4gICMgICAgIyMgICAgICAgICAgIyMjICAgICMjIyMjIyMjICMjIyMjIyMjICMjICAgICAjI1xuICAjICAgICMjICAgICAgICAgIyMgIyMgICAgICAjIyAgICAjIyAgICAgICAgIyMgICAjI1xuICAjICAgICMjICAgICAgICAjIyAgICMjICAgICAjIyAgICAjIyAgICAgICAgICMjICMjXG4gICMgICAgIyMgICAgICAgIyMgICAgICMjICAgICMjICAgICMjIyMjIyAgICAgICMjI1xuICAjICAgICMjICAgICAgICMjIyMjIyMjIyAgICAjIyAgICAjIyAgICAgICAgICMjICMjXG4gICMgICAgIyMgICAgICAgIyMgICAgICMjICAgICMjICAgICMjICAgICAgICAjIyAgICMjXG4gICMgICAgIyMjIyMjIyMgIyMgICAgICMjICAgICMjICAgICMjIyMjIyMjICMjICAgICAjI1xuXG4gIGRlc2NyaWJlICdsYXRleCBzdXBwb3J0JywgLT5cbiAgICBiZWZvcmVFYWNoIC0+IEBzY29wZSA9ICd0ZXgnXG5cbiAgICBpdFBhcnNlcygnW2dyYXldezF9JykuYXNDb2xvcignI2ZmZmZmZicpXG4gICAgaXRQYXJzZXMoJ1tyZ2JdezEsMC41LDB9JykuYXNDb2xvcignI2ZmN2YwMCcpXG4gICAgaXRQYXJzZXMoJ1tSR0JdezI1NSwxMjcsMH0nKS5hc0NvbG9yKCcjZmY3ZjAwJylcbiAgICBpdFBhcnNlcygnW2NteWtdezAsMC41LDEsMH0nKS5hc0NvbG9yKCcjZmY3ZjAwJylcbiAgICBpdFBhcnNlcygnW0hUTUxde2ZmN2YwMH0nKS5hc0NvbG9yKCcjZmY3ZjAwJylcbiAgICBpdFBhcnNlcygne2JsdWV9JykuYXNDb2xvcignIzAwMDBmZicpXG5cbiAgICBpdFBhcnNlcygne2JsdWUhMjB9JykuYXNDb2xvcignI2NjY2NmZicpXG4gICAgaXRQYXJzZXMoJ3tibHVlITIwIWJsYWNrfScpLmFzQ29sb3IoJyMwMDAwMzMnKVxuICAgIGl0UGFyc2VzKCd7Ymx1ZSEyMCFibGFjayEzMCFncmVlbn0nKS5hc0NvbG9yKCcjMDA1OTBmJylcblxuICAjICAgICAjIyMjIyMjICAjIyMjIyMjI1xuICAjICAgICMjICAgICAjIyAgICAjI1xuICAjICAgICMjICAgICAjIyAgICAjI1xuICAjICAgICMjICAgICAjIyAgICAjI1xuICAjICAgICMjICAjIyAjIyAgICAjI1xuICAjICAgICMjICAgICMjICAgICAjI1xuICAjICAgICAjIyMjIyAjIyAgICAjI1xuXG4gIGRlc2NyaWJlICdxdCBzdXBwb3J0JywgLT5cbiAgICBiZWZvcmVFYWNoIC0+IEBzY29wZSA9ICdxbWwnXG5cbiAgICBpdFBhcnNlcygnUXQucmdiYSgxLjAsMS4wLDAsMC41KScpLmFzQ29sb3IoMjU1LCAyNTUsIDAsIDAuNSlcblxuICBkZXNjcmliZSAncXQgY3BwIHN1cHBvcnQnLCAtPlxuICAgIGJlZm9yZUVhY2ggLT4gQHNjb3BlID0gJ2NwcCdcblxuICAgIGl0UGFyc2VzKCdRdC5yZ2JhKDEuMCwxLjAsMCwwLjUpJykuYXNDb2xvcigyNTUsIDI1NSwgMCwgMC41KVxuIl19
