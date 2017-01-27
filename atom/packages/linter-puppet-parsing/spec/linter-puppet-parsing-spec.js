'use babel';

import * as path from 'path';

describe('The Puppet Parser provider for Linter', () => {
  const lint = require(path.join('..', 'lib', 'main.js')).provideLinter().lint;

  beforeEach(() => {
    atom.workspace.destroyActivePaneItem();
    waitsForPromise(() => {
      atom.packages.activatePackage('linter-puppet-parsing');
      return atom.packages.activatePackage('language-puppet').then(() =>
        atom.workspace.open(path.join(__dirname, 'fixtures', 'test_two.pp'))
      );
    });
  });

  describe('checks a file with multiple issues on separate lines and', () => {
    let editor = null;
    const badFile = path.join(__dirname, 'fixtures', 'test.pp');
    beforeEach(() => {
      waitsForPromise(() =>
        atom.workspace.open(badFile).then(openEditor => {
          editor = openEditor;
        })
      );
    });

    it('finds the first message', () => {
      waitsForPromise(() =>
        lint(editor).then(messages => {
          expect(messages.length).toEqual(1);
        })
      );
    });

    it('verifies the first message', () => {
      waitsForPromise(() => {
        return lint(editor).then(messages => {
          expect(messages[0].type).toBeDefined();
          expect(messages[0].type).toEqual('Error');
          expect(messages[0].text).toBeDefined();
          expect(messages[0].text).toEqual("Syntax error at 'ensure'");
          expect(messages[0].filePath).toBeDefined();
          expect(messages[0].filePath).toMatch(/.+test\.pp$/);
          expect(messages[0].range).toBeDefined();
          expect(messages[0].range.length).toBeDefined();
          expect(messages[0].range.length).toEqual(2);
          expect(messages[0].range).toEqual([[3, 3], [3, 4]]);
        });
      });
    });
  });

  describe('checks a file with two issues on one line and', () => {
    let editor = null;
    const badFile = path.join(__dirname, 'fixtures', 'test_three.pp');
    beforeEach(() => {
      waitsForPromise(() =>
        atom.workspace.open(badFile).then(openEditor => {
          editor = openEditor;
        })
      );
    });

    it('finds both messages', () => {
      waitsForPromise(() =>
        lint(editor).then(messages => {
          expect(messages.length).toEqual(2);
        })
      );
    });

    it('verifies the messages', () => {
      waitsForPromise(() => {
        return lint(editor).then(messages => {
          expect(messages[0].type).toBeDefined();
          expect(messages[0].type).toEqual('Error');
          expect(messages[0].text).toBeDefined();
          expect(messages[0].text).toEqual('This Variable has no effect. A value was produced and then forgotten (one or more preceding expressions may have the wrong form)');
          expect(messages[0].filePath).toBeDefined();
          expect(messages[0].filePath).toMatch(/.+test_three\.pp$/);
          expect(messages[0].range).toBeDefined();
          expect(messages[0].range.length).toBeDefined();
          expect(messages[0].range.length).toEqual(2);
          expect(messages[0].range).toEqual([[3, 20], [3, 21]]);
          expect(messages[1].type).toBeDefined();
          expect(messages[1].type).toEqual('Error');
          expect(messages[1].text).toBeDefined();
          expect(messages[1].text).toEqual("Illegal variable name, The given name '' does not conform to the naming rule /^((::)?[a-z]\w*)*((::)?[a-z_]\w*)$/");
          expect(messages[1].filePath).toBeDefined();
          expect(messages[1].filePath).toMatch(/.+test_three\.pp$/);
          expect(messages[1].range).toBeDefined();
          expect(messages[1].range.length).toBeDefined();
          expect(messages[1].range.length).toEqual(2);
          expect(messages[1].range).toEqual([[3, 20], [3, 21]]);
        });
      });
    });
  });

  describe('checks a file with an issue with no line or col information and', () => {
    let editor = null;
    const badFile = path.join(__dirname, 'fixtures', 'test_four.pp');
    beforeEach(() => {
      waitsForPromise(() =>
        atom.workspace.open(badFile).then(openEditor => {
          editor = openEditor;
        })
      );
    });

    it('finds one message', () => {
      waitsForPromise(() =>
        lint(editor).then(messages => {
          expect(messages.length).toEqual(1);
        })
      );
    });

    it('verifies the only message', () => {
      waitsForPromise(() => {
        return lint(editor).then(messages => {
          expect(messages[0].type).toBeDefined();
          expect(messages[0].type).toEqual('Error');
          expect(messages[0].text).toBeDefined();
          expect(messages[0].text).toEqual("Syntax error at end of file");
          expect(messages[0].filePath).toBeDefined();
          expect(messages[0].filePath).toMatch(/.+test_four\.pp$/);
          expect(messages[0].range).toBeDefined();
          expect(messages[0].range.length).toBeDefined();
          expect(messages[0].range.length).toEqual(2);
          expect(messages[0].range).toEqual([[3, 3], [3, 4]]);
        });
      });
    });
  });

  describe('checks a file with warnings and', () => {
    let editor = null;
    const badFile = path.join(__dirname, 'fixtures', 'test_five.pp');
    beforeEach(() => {
      waitsForPromise(() =>
        atom.workspace.open(badFile).then(openEditor => {
          editor = openEditor;
        })
      );
    });

    it('finds the both messages', () => {
      waitsForPromise(() =>
        lint(editor).then(messages => {
          expect(messages.length).toEqual(2);
        })
      );
    });

    it('verifies the first message', () => {
      waitsForPromise(() => {
        return lint(editor).then(messages => {
          expect(messages[0].type).toBeDefined();
          expect(messages[0].type).toEqual('Warning');
          expect(messages[0].text).toBeDefined();
          expect(messages[0].text).toEqual("Unrecognized escape sequence '\['");
          expect(messages[0].filePath).toBeDefined();
          expect(messages[0].filePath).toMatch(/.+test_five\.pp$/);
          expect(messages[0].range).toBeDefined();
          expect(messages[0].range.length).toBeDefined();
          expect(messages[0].range.length).toEqual(2);
          expect(messages[0].range).toEqual([[3, 3], [3, 4]]);
          expect(messages[1].type).toBeDefined();
          expect(messages[1].type).toEqual('Warning');
          expect(messages[1].text).toBeDefined();
          expect(messages[1].text).toEqual("Unrecognized escape sequence '\['");
          expect(messages[1].filePath).toBeDefined();
          expect(messages[1].filePath).toMatch(/.+test_five\.pp$/);
          expect(messages[1].range).toBeDefined();
          expect(messages[1].range.length).toBeDefined();
          expect(messages[1].range.length).toEqual(2);
          expect(messages[1].range).toEqual([[3, 3], [3, 4]]);
        });
      });
    });
  });

  it('finds nothing wrong with a valid file', () => {
    waitsForPromise(() => {
      const goodFile = path.join(__dirname, 'fixtures', 'test_two.pp');
      return atom.workspace.open(goodFile).then(editor =>
        lint(editor).then(messages => {
          expect(messages.length).toEqual(0);
        })
      );
    });
  });
});
