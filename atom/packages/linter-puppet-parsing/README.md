![Preview](https://raw.githubusercontent.com/mschuchard/linter-puppet-parsing/master/linter_puppet_parsing.png)

Image displays example of simultaneous use of `Linter-Puppet-Parsing` with `Linter-Puppet-Lint`.

### Linter-Puppet-Parsing
`Linter-Puppet-Parsing` aims to provide functional and robust `puppet parser validate` linting functionality in Atom. Intended to be used as a complement to `Linter-Puppet-Lint` to provide syntax checks in addition to `Puppet-Lint`'s style checks.

### Installation
The `Puppet` or `Puppet Enterprise` Agent is required to be installed (preferably from a package or a gem) before using this. The `Linter` and `Language-Puppet` Atom packages are also required but should be automatically installed as dependencies thanks to steelbrain's `package-deps`.

### Usage
- Avoid specifying arguments (e.g. --debug) that greatly affect the formatting of the parser output.  These will cause issues.
- The `Puppet` parser is slower than most executables used for linting and its errors may require several seconds after saving to display.
- The `Puppet` parser only throws errors for the first line of errors it encounters in a manifest so this linter only displays one line of errors at a time. However. some versions of `Puppet` support multiple lines of certain errors per manifest.
